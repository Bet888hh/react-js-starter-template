/* eslint-disable react/prop-types */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { headers, urlbase } from "../../Utility/urls";

export const Pulsantiera = memo(function Pulsantiera({ id = "", indietro }) {

    const idRef = useRef(id);
    const location = useLocation();

    const navigate = useNavigate()
    const user = useSelector(SelectUserSlice);
    const [ticket, setTicket] = useState({});
    const [ticketInCarico, setTicketInCarico] = useState(0);

    const permessi = useMemo(()=>({
        indietro: location.pathname === "/dettaglio/" + id,

        dettaglio: (location.pathname === "/"
            || location.pathname === "/"//home
            || location.pathname === "/miei_ticket"
            || location.pathname === "/gestione_ticket"
            || location.pathname === "/interni"),

        prendiInCarico: (location.pathname === "/gestione_ticket"
            || location.pathname === "/dettaglio/" + id)
            && ticket.stato === "APERTO" && user.Ruolo === "OPERATORE",

        accetta: (location.pathname === "/gestione_ticket"
            || location.pathname === "/dettaglio/" + id)
            && ticket.Stato === "IN_LAVORAZIONE"
            && user.Permesso === "SENIOR"
            && ticket.Assegnatario !== user.Username
            && ticket.Operatore === user.Username,

        rimuovi: location.pathname === "/miei_ticket"
            && ticket.Stato === "APERTO",

        riapri: (location.pathname === "/miei_ticket"
            || location.pathname === "/dettaglio/" + id)
            && ticket.Riaperto === false
            && ticket.Operatore === user.Username
            && ticket.Stato === "CHIUSO",

        chiudi: location.pathname === "/dettaglio/" + id
            && ticket.Stato === "IN_LAVORAZIONE"
            && (user.Username === ticket.Utente
                || user.Username === ticket.Operatore),

    }),[id, location.pathname, ticket.Assegnatario, ticket.Operatore, ticket.Riaperto, ticket.Stato, ticket.Utente, ticket.stato, user.Permesso, user.Ruolo, user.Username]);


    const dettaglio = useCallback((e) => {
        navigate("/dettaglio/" + ticket.$id)
    }, [navigate, ticket.$id])

    const prendiInCarico = useCallback(() => {
        const limite = user.Permesso === "SENIOR" ? 10 : 5;

        if (ticketInCarico < limite) {
            if (ticket.Operatore === "") {
                fetch(
                    urlbase("TICKET") + "/" + id,
                    {
                        method: "PATCH",
                        headers: headers,
                        body: JSON.stringify({
                            documentId: id,
                            data: {
                                Stato: "IN_LAVORAZIONE",
                                Ultima_visita: user.Permesso,
                                Operatore: user.Username,
                                Assegnatario: user.Username,
                            },
                            permissions: [`read("any")`],
                        }),
                    }
                )
                    .then((r) => {
                        return r.json();
                    })
                    .then((r) => {
                        alert("Ticket preso in carico!");
                    });
            }
        }
    },
        [id, ticket.Operatore, user.Permesso, user.Username]
    );

    const accetta = useCallback(() => {
        const limite = user.Permesso === "SENIOR" ? 10 : 5;

        if (ticketInCarico < limite) {
            fetch(
                urlbase("TICKET") + "/" + id,
                {
                    method: "PATCH",
                    headers: headers,
                    body: JSON.stringify({
                        documentId: id,
                        data: {
                            Ultima_visita: user.Permesso,
                            Assegnatario: user.Username,
                        },
                        permissions: [`read("any")`],
                    }),
                }
            )
                .then((r) => {
                    return r.json();
                })
                .then((r) => {
                    alert("Ticket accettato!");
                });
        }
    }, [id, user.Permesso, user.Username]);


    const rimuovi = useCallback(() => {
        fetch(urlbase("TICKET") + "/" + id, {
            method: "delete",
            headers: headers,
        })
            .then(() => {
                idRef.current = "";
                alert("Elemento rimosso!")
            });

    }, [id]);

    const riapri = useCallback(() => {
        if (!ticket.Riaperto) {
            fetch(
                urlbase("TICKET") + "/" + id,
                {
                    method: "PATCH",
                    headers: headers,
                    body: JSON.stringify({
                        documentId: id,
                        data: {
                            Stato: "APERTO",
                            Ultima_visita: "UTENTE",//il ticket può essere riaperto solo dall'utente creatore
                            Operatore: "",
                            Assegnatario: "",
                            Riaperto: true,
                        },
                        permissions: [`read("any")`],
                    }),
                }
            )
                .then((r) => {
                    return r.json();
                })
                .then((r) => {
                    alert("Ticket riaperto!");
                });
        } else {
            alert("Il ticket era già stato riaperto precedentemente!")
        }
    }, [ticket.Riaperto, id]);

    const chiudi = useCallback(() => {
        fetch(
            urlbase("TICKET") + "/" + id, //categoria manuale per il junior nel ticket interno è l'id del ticket semplice
            {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({
                    documentId: id,
                    data: {

                        Stato: "CHIUSO",
                    },
                    permissions: [`read("any")`],
                }),
            }
        )
    }, [id]);

    const assegnaASenior = useCallback(() => {
        navigate("/crea_ticket", { state: ticket })
    }, [navigate, ticket]);

    const contoTicketInCarico = useCallback(() => {
        fetch(urlbase("TICKET") + `?queries[0]=search("Utente",+["${user.Username}"])&queries[1]=search("Stato",+["APERTO"])|queries[2]=search("Stato",+["IN_LAVORAZIONE"])`
            , {
                method: "GET",
                headers: headers,
            })
            .then(res => res.json())
            .then(res => {
                setTicketInCarico(res.total);
            })
            .catch((error) => {
                alert('Qualcosa è andato storto durante la GET');
            })
    }, [user.Username]);

    const ricaricaTicket = useCallback(() => {
        if (idRef.current != "") {
            fetch(
                urlbase("TICKET") + "/" + id,
                {
                    method: "GET",
                    headers: headers
                }
            )
                .then(r => r.json())
                .then((r) => {
                    setTicket(r);
                })
                .catch((e) => {
                    return;
                })
        }
    }, [id])

    const init = useCallback(() => {
        ricaricaTicket();
        contoTicketInCarico();
    }, []);

    useEffect(() => {
        init();
    }, []);


    return (
        <>
            {permessi.indietro &&
                (<button onClick={indietro}>
                    Indietro
                </button>)}

            

            {permessi.prendiInCarico &&
                (<button onClick={prendiInCarico}>
                    Prendi in carico
                </button>
                )}


            {permessi.accetta &&
                (<button onClick={accetta}>
                    Accetta
                </button>
                )}

            {permessi.rimuovi &&
                (<button onClick={rimuovi}>
                    Rimuovi
                </button>
                )}

            {
            permessi.chiudi && (
                <button onClick={chiudi}>
                    Chiudi
                </button>
            )}

            {permessi.riapri &&
                (<button onClick={riapri}>
                    Riapri
                </button>)}

            {user.Permesso === "JUNIOR" &&
                ticket.Operatore === user.Username &&
                ticket.Assegnatario === "" &&
                ticket.Stato !== "INTERNO" && (
                    <button onClick={assegnaASenior}>Assegna a Senior</button>
                )}
        </>

    );
});