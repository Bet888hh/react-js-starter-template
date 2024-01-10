/* eslint-disable react/prop-types */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { headers, urlbase } from "../../Utility/urls";

export const Pulsantiera = memo(function Pulsantiera({ id = "" }) {

    const location = useLocation();

    const navigate = useNavigate()
    const user = useSelector(SelectUserSlice);
    const [ticket, setTicket] = useState({});

    const permessi = {
        indietro: location.pathname === "/dettaglio/" + id,

        dettaglio: (location.pathname === "/"
            || location.pathname === "/"//home
            || location.pathname === "/miei_ticket"
            || location.pathname === "/gestione_ticket"
            || location.pathname === "/interni"),

        prendiInCarico: (location.pathname === "/gestione_ticket"
            || location.pathname === "/dettaglio" + id)
            && ticket.stato === "APERTO" && user.Ruolo === "OPERATORE",

        accetta: (location.pathname === "/gestione_ticket"
            || location.pathname === "/dettaglio" + id)
            && ticket.Stato === "IN_LAVORAZIONE"
            && user.Permesso === "SENIOR"
            && ticket.Assegnatario === user.Username
            && ticket.Operatore !== user.Username,

        rimuovi: location.pathname === "/miei_ticket"
            && ticket.Stato === "APERTO",

        riapri: (location.pathname === "/miei_ticket"
            || location.pathname === "/dettaglio")
            && ticket.Utente === user.Username
            && ticket.Stato === "CHIUSO",

    };

    const indietro = useCallback(() => {
        navigate("..");
    }, [navigate])

    const dettaglio = useCallback((e) => {
        navigate("/dettaglio/" + ticket.$id)
    }, [navigate, ticket.$id])

    const prendiInCarico = useCallback(() => {
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
                            Assegnatario: "",
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
    },
        [id, ticket.Operatore, user.Permesso, user.Username]
    );

    const accetta = useCallback(() => {
        const limite = user.Permesso === "SENIOR" ? 10 : 5;

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
    }, [id, user.Permesso, user.Username]);


    const rimuovi = useCallback(
        () => {
            fetch(urlbase("TICKET") + "/" + id, {
                method: "delete",
                headers: headers,
            })
                .then(() => alert("Elemento rimosso!"));
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
                    alert("Ticket accettato!");
                });
        } else {
            alert("Il ticket era già stato riaperto precedentemente!")
        }

    }, [ticket.Riaperto, id, user.Permesso]);

    const recuperaTicket = useCallback(() => {
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
    }, [id]);


    useEffect(() => {
        recuperaTicket();
    }, []);


    return (
        <>
            {permessi.indietro &&
                (<button onClick={indietro}>
                    Indietro
                </button>)}

            {permessi.dettaglio &&
                (<button onClick={dettaglio} id={ticket.$id}>
                    {location.pathname !== "/" ? "Dettaglio" : "Visualizza"}
                </button>)}

            {permessi.prendiInCarico &&
                (<button onClick={prendiInCarico}>
                    Prendi in carico
                </button>
                )}


            {permessi.accetta &&
                (<button onClick={accetta} id={id}>
                    Accetta
                </button>
                )}

            {permessi.rimuovi &&
                (<button onClick={rimuovi} id={id}>
                    Rimuovi
                </button>
                )}


            {permessi.riapri &&
                (<button onClick={riapri} id={id}>
                    Riapri
                </button>)}
        </>

    );
});