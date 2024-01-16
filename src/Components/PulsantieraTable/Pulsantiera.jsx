/* eslint-disable react/prop-types */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { SelectErrorSlice, setError } from "../../store/Reducer/Slices/ErrorSlice/errorSlice";
import { headers, urlbase } from "../../Utility/urls";

export const Pulsantiera = memo(function Pulsantiera({ id = "", indietro, goToDettaglio }) {
    const idRef = useRef(id);
    const location = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const error = useSelector(SelectErrorSlice);
    const user = useSelector(SelectUserSlice);
    const [ticket, setTicket] = useState({});
    const [ticketInCarico, setTicketInCarico] = useState(0);

    const permessi = useMemo(
        () => ({
            indietro: location.pathname === "/dettaglio/" + id,

            dettaglio:
                location.pathname === "/" ||
                location.pathname === "/" || //home
                location.pathname === "/miei_ticket" ||
                location.pathname === "/gestione_ticket" ||
                location.pathname === "/interni",

            prendiInCarico:
                (location.pathname === "/gestione_ticket" ||
                    location.pathname === "/dettaglio/" + id) &&
                ticket.stato === "APERTO" &&
                user.Ruolo === "OPERATORE",

            accetta:
                (location.pathname === "/gestione_ticket" ||
                    location.pathname === "/dettaglio/" + id) &&
                ticket.Stato === "IN_LAVORAZIONE" &&
                user.Permesso === "SENIOR" &&
                ticket.Assegnatario === user.Username &&
                ticket.Operatore !== user.Username,

            rimuovi:
                location.pathname === "/miei_ticket" && ticket.Stato === "APERTO",

            riapri:
                (location.pathname === "/miei_ticket" ||
                    location.pathname === "/dettaglio/" + id) &&
                ticket.Riaperto === false &&
                (user.Ruolo === "SEMPLICE" || user.Ruolo === "OPERATORE") && // da rivedere
                ticket.Stato === "CHIUSO",

            chiudi:
                location.pathname === "/dettaglio/" + id &&
                ticket.Stato === "IN_LAVORAZIONE" &&
                (user.Username === ticket.Utente || user.Username === ticket.Operatore),
        }),
        [
            id,
            location.pathname,
            ticket.Assegnatario,
            ticket.Operatore,
            ticket.Riaperto,
            ticket.Stato,
            ticket.Utente,
            ticket.stato,
            user.Permesso,
            user.Ruolo,
            user.Username,
        ]
    );

    const dettaglio = useCallback(
        () => {
            navigate("/dettaglio/" + ticket.$id);
        },
        [navigate, ticket.$id]
    );

    const prendiInCarico = useCallback(() => {
        const limite = user.Permesso === "SENIOR" ? 10 : 5;

        if (ticketInCarico < limite) {
            if (ticket.Operatore === "") {
                try {
                    fetch(urlbase("TICKET") + "/" + id, {
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
                    })
                        .then((r) => {
                            return r.json();
                        })
                        .then((r) => {
                            alert("Ticket preso in carico!");
                        })
                        .then(() => {
                            indietro();
                        })
                } catch (e) {
                    dispatch(setError(e.message));
                }
            }
        }
    }, [dispatch, id, indietro, ticket.Operatore, ticketInCarico, user.Permesso, user.Username]);

    const accetta = useCallback(() => {
        const limite = user.Permesso === "SENIOR" ? 10 : 5;

        if (ticketInCarico < limite) {
            try {
                fetch(urlbase("TICKET") + "/" + id, {
                    method: "PATCH",
                    headers: headers,
                    body: JSON.stringify({
                        documentId: id,
                        data: {
                            Ultima_visita: user.Permesso,
                            Operatore: user.Username,
                        },
                        permissions: [`read("any")`],
                    }),
                })
                    .then((r) => {
                        return r.json();
                    })
                    .then((r) => {
                        alert("Ticket accettato!");
                    })
                    .then(() => {
                        indietro();
                    })
            } catch (e) {
                dispatch(setError(e.message));
            }
        }
    }, [dispatch, id, indietro, ticketInCarico, user.Permesso, user.Username]);

    const rimuovi = useCallback(() => {
        try {
            fetch(urlbase("TICKET") + "/" + id, {
                method: "delete",
                headers: headers,
            })
                .then(() => {
                    idRef.current = "";
                    alert("Elemento rimosso!");
                })
                .then(() => {
                    if (location.pathname === "/gestione_ticket") {
                        indietro();
                    }
                })
        } catch (e) {
            dispatch(setError(e.message));
        }
    }, [dispatch, id, indietro, location.pathname]);

    const riapri = useCallback(() => {
        if (!ticket.Riaperto) {
            try {
                fetch(urlbase("TICKET") + "/" + id, {
                    method: "PATCH",
                    headers: headers,
                    body: JSON.stringify({
                        documentId: id,
                        data: {
                            Stato: "IN_LAVORAZIONE",
                            Ultima_visita:
                                user.ruolo === "OPERATORE" ? user.Permesso : "UTENTE",
                            Riaperto: true,
                        },
                        permissions: [`read("any")`],
                    }),
                })
                    .then((r) => {
                        return r.json();
                    })
                    .then((r) => {
                        alert("Ticket riaperto!");
                    })
                    .then(() => {
                        goToDettaglio()
                    })
            } catch (e) {
                dispatch(setError(e.message));
            }

        } else {
            alert("Il ticket era già stato riaperto precedentemente!");
        }
    }, [ticket.Riaperto, id, user.ruolo, user.Permesso, goToDettaglio, dispatch]);

    const chiudi = useCallback(() => {
        try {
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
            ).then(() => {
                indietro();
            })
        } catch (e) {
            dispatch(e.message);
        }
    }, [dispatch, id, indietro]);

    const assegnaASenior = useCallback(() => {
        navigate("/crea_ticket", { state: ticket });
    }, [navigate, ticket]);

    const contoTicketInCarico = useCallback(() => {
        try {
            fetch(
                urlbase("TICKET") +
                `?queries[0]=search("Utente",+["${user.Username}"])&queries[1]=search("Stato",+["APERTO"])|queries[2]=search("Stato",+["IN_LAVORAZIONE"])`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    setTicketInCarico(res.total);
                })
        } catch (e) {
            dispatch(setError(e.message));
        }
    }, [dispatch, user.Username]);

    const ricaricaTicket = useCallback(() => {
        if (idRef.current != "") {
            try {
                fetch(urlbase("TICKET") + "/" + id, {
                    method: "GET",
                    headers: headers,
                })
                    .then((r) => r.json())
                    .then((r) => {
                        setTicket(r);
                    })
            } catch (e) {
                dispatch(setError(e.message));
            }
        }
    }, [dispatch, id]);

    const init = useCallback(() => {
        ricaricaTicket();
        contoTicketInCarico();
    }, []);

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {permessi.indietro && <button onClick={indietro}>Indietro</button>}

            {permessi.prendiInCarico && (
                <button onClick={prendiInCarico}>Prendi in carico</button>
            )}

            {permessi.accetta && <button onClick={accetta}>Accetta</button>}

            {permessi.rimuovi && <button onClick={rimuovi}>Rimuovi</button>}

            {permessi.chiudi && <button onClick={chiudi}>Chiudi</button>}

            {permessi.riapri && <button onClick={riapri}>Riapri</button>}

            {user.Permesso === "JUNIOR" &&
                ticket.Operatore === user.Username &&
                ticket.Assegnatario === "" &&
                ticket.Stato !== "INTERNO" && (
                    <button onClick={assegnaASenior}>Assegna a Senior</button>
                )}
        </>
    );
});
