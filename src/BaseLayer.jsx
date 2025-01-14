import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar/Navbar";
import CreaTicket from "./Pages/CreaTicket/CreaTicket";
import GestioneTicket from "./Pages/GestioneTicket/GestioneTicket";
import Interni from "./Pages/Interni/Interni";
import LoginRegistrazione from "./Pages/LoginRegistrazione/LoginRegistrazione";
import MieiTicket from "./Pages/MieiTicket/MieiTicket";
import {
  SelectUserSlice,
  setUser,
} from "./store/Reducer/Slices/UserSlice/UserSlice";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Home from "./Pages/Home/Home";
import ProtectedRoute from "./Utility/ProtectedRoute";
import { useDispatch } from "react-redux";
import DettaglioTicket from "./Pages/DettaglioTicket/DettaglioTicket";
import { ErrorModal } from "./Components/ErrorModal/ErrorModal";
import { headers, urlbase } from "./Utility/urls";
import { SelectNotifSlice, setGestioneTicketNotifNumber, setMieiTicketNotifNumber } from "./store/Reducer/Slices/notifSlice/notifSlice";
import { setError } from "./store/Reducer/Slices/ErrorSlice/errorSlice";
const BaseLayer = () => {
  const user = useSelector(SelectUserSlice);
  const notif = useSelector(SelectNotifSlice)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useRef({
    mieiTicket: [],
    ticketInCarico: [],
    ticketLavorazione: [],
    ticketInterniOperatore: [],
  });
  const location = useLocation();
  
  const permits = useMemo(() => {
    return {
      home: user.Ruolo !== "NOLOG" && user.Ruolo === "SEMPLICE",
      creaTicket:
        user.Ruolo !== "NOLOG" &&
        (user.Ruolo === "SEMPLICE" || user.Permesso === "JUNIOR"),
      mieiTicket: user.Ruolo !== "NOLOG",
      gestioneTicket: user.Ruolo === "OPERATORE",
      interni: user.Ruolo === "OPERATORE",
      loginRegistrazione: user.Ruolo === "NOLOG",
    };
  }, [user.Permesso, user.Ruolo]);

  const getTicketLavorazione = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Stato", ["IN_LAVORAZIONE"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, []);
  const getTicketMieiInLavorazione = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Operatore", [${user.Username}])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, [user.Username]);
  const getTicketMieiInterniSenior = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Operatore", [${user.Username}])&queries[0]=search("Stato", ["INTERNO"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, [user.Username]);
  const getTicketMieiInterniJunior = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Utente", [${user.Username}])&queries[0]=search("Stato", ["INTERNO"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, [user.Username]);

  

  const getTickeUtente = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Utente", [${user.Username}])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, [user.Username]);


  const takeDataForOperatore = useCallback(async () => {
    let ticketInCarico = await getTicketMieiInLavorazione();
    ticketInCarico = await ticketInCarico.json();
    if (ticketInCarico.message) {
      dispatch(setError(ticketInCarico.message));
    } else {
      const returnValue = { ticketInCarico: ticketInCarico.documents };

      return returnValue;
    }
  }, [dispatch, getTicketMieiInLavorazione]);

  const takeDataForUser = useCallback(async () => {
    let ticketUtente = await getTickeUtente();
    ticketUtente = await ticketUtente.json();
    if (ticketUtente.message) {
      dispatch(setError(ticketUtente.message));
    } else {
      const returnValue = { mieiTicket: ticketUtente.documents };

      return returnValue;
    }
  }, [dispatch, getTickeUtente]);
  
  const takeDataForInterni = useCallback(async () => {
   let ticketInterni = user.Permesso ==="SENIOR"?await getTicketMieiInterniSenior():await getTicketMieiInterniJunior();
   ticketInterni = await ticketInterni.json();
    if (ticketInterni.message) {
      dispatch(setError(ticketInterni.message));
    } else {
      const returnValue = {ticketInterniOperatore: ticketInterni.documents };
  
      return returnValue;
    }

  }, [dispatch, getTicketMieiInterniJunior, getTicketMieiInterniSenior, user.Permesso]);

  const compareDataForUser = useCallback(({ mieiTicket }) => {
    let newMieiTicket = mieiTicket;
    let oldMieiTicket = state.current.mieiTicket;
    let notifiche = [];
   

    newMieiTicket.forEach((newTicket) => {
      let notif = false;
      const oldTicket = oldMieiTicket.find(
        (ticket) => ticket.$id === newTicket.$id
      );

      if (oldTicket) {
        
        if (newTicket.Messaggi.length > oldTicket.Messaggi.length) {
          if (
            !newTicket.Messaggi[newTicket.Messaggi.length - 1].includes(
              user.Username
            )
          ) {
            notif = true;
          }
         
          
        } else if (
          newTicket.Stato === "CHIUSO" &&
          oldTicket.Stato === "IN_LAVORAZIONE"
        ) {
          
          notif = true;
        }
        notifiche = notif ? [...notifiche, newTicket.$id] : notifiche;
      }
    });
   /*  setMieiTicketNotifNumber((prev) => {
      //merge prevand notifiche and remove duplicates and return the new array
      return [...new Set([...prev, ...notifiche])];
    }); */
    dispatch(setMieiTicketNotifNumber(notifiche))
    state.current = { mieiTicket: newMieiTicket };
  }, [dispatch]);

  const compareDataForOperatore = useCallback(
    ({ ticketInCarico }) => {
      let newTicketInCarico = ticketInCarico;
      let oldMieiTicketInCarico = state.current.ticketInCarico;
      let notifiche = [];

      newTicketInCarico.forEach((newTicket) => {
        let notif = false;
        const oldTicket = oldMieiTicketInCarico.find(
          (ticket) => ticket.$id === newTicket.$id
        );

       
        if (oldTicket) {
          if (
            newTicket.Messaggi.length > oldTicket.Messaggi.length
          ) {
           if (
             !newTicket.Messaggi[newTicket.Messaggi.length - 1].includes(
               user.Username
             )
           ) {
             notif = true;
           }
         
          } else if (
            newTicket.Stato === "IN_LAVORAZIONE" &&
            oldTicket.Stato === "CHIUSO"
          ) {
           
            notif = true;
          }
          notifiche = notif ? [...notifiche, newTicket.$id] : notifiche;
        }
      });
      /* setGestioneTicketNotifNumber((prev) => {
        return [...new Set([...prev, ...notifiche])];
      }); */
      dispatch(setGestioneTicketNotifNumber(notifiche))
      state.current = { ticketInCarico: newTicketInCarico };
    },
    [dispatch]
  );
  const compareDataForInterni = useCallback(
    ({ ticketInCarico }) => {
      let newTicketInCarico = ticketInCarico;
      let oldMieiTicketInCarico = state.current.ticketInCarico;
      let notifiche = [];

      newTicketInCarico.forEach((newTicket) => {
        let notif = false;
        const oldTicket = oldMieiTicketInCarico.find(
          (ticket) => ticket.$id === newTicket.$id
        );

       
        if (oldTicket) {
          if (
            newTicket.Messaggi.length > oldTicket.Messaggi.length
          ) {
           
            notif = true;
         
          } 
          notifiche = notif ? [...notifiche, newTicket.$id] : notifiche;
        }
      });
      /* setGestioneTicketNotifNumber((prev) => {
        return [...new Set([...prev, ...notifiche])];
      }); */
      dispatch(setGestioneTicketNotifNumber(notifiche))
      state.current = { ticketInterniOperatore: newTicketInCarico };
    },
    [dispatch]
  );

  const poll = useCallback(async () => {
    if (user.Ruolo === "SEMPLICE") {
    await   takeDataForUser().then((value) => {
        compareDataForUser(value);
      });
    } else if (user.Ruolo === "OPERATORE") {
    await  takeDataForOperatore().then((value) => {
        
        compareDataForOperatore(value);
      });
    }
  }, [
    compareDataForOperatore,
    compareDataForUser,
    takeDataForOperatore,
    takeDataForUser,
    user.Ruolo,
  ]);

  useEffect(() => {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (user.Ruolo === "NOLOG" && loggedUser) {
      dispatch(setUser(loggedUser));
    }

    if (user.Ruolo === "SEMPLICE") {
      takeDataForUser().then((r) => {
        state.current = r;
      });
    } else if (user.Ruolo === "OPERATORE") {
      takeDataForOperatore().then((r) => {
        state.current = r;
      });
    }
  }, [
    dispatch,
    takeDataForOperatore,
    takeDataForUser,
    user.Permesso,
    user.Ruolo,
  ]);

  useEffect(() => {
    const id = setInterval(poll, 2000);
    return () => {
      clearInterval(id);
    };
  }, [poll]);

  useEffect(() => {
    location.pathname === "/miei_ticket" && setMieiTicketNotifNumber([]);
    location.pathname === "/gestione_ticket" &&
      setGestioneTicketNotifNumber([]);
  }, [location.pathname]);
  return (
    <fieldset className="rutto">
      {user.Ruolo !== "NOLOG" && (
        <>
          <Navbar
            gestioneTicketNotifNumber={notif.gestioneTicketNotifNumber.length}
            mieiTicketNotifNumber={
              notif.mieiTicketNotifNumber.length
            } /* render={render} forceRender={forceRender}  */
          />
          <ErrorModal />
        </>
      )}
      <br />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute condition={permits.home} redirectTo={"/login"}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute
              condition={permits.loginRegistrazione}
              redirectTo={user.Ruolo === "OPERATORE" ? "/gestione_ticket" : "/"}
            >
              <LoginRegistrazione /* forceRender={forceRender} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrazione"
          element={
            <ProtectedRoute
              condition={permits.loginRegistrazione}
              redirectTo={"/login"}
            >
              <LoginRegistrazione /* forceRender={forceRender} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crea_ticket"
          element={
            <ProtectedRoute
              condition={permits.creaTicket}
              redirectTo={"/login"}
            >
              <CreaTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miei_ticket"
          element={
            <ProtectedRoute
              condition={permits.mieiTicket}
              redirectTo={"/login"}
            >
              <MieiTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestione_ticket"
          element={
            <ProtectedRoute
              condition={permits.gestioneTicket}
              redirectTo={"/login"}
            >
              <GestioneTicket /* forceRender={forceRender} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interni"
          element={
            <ProtectedRoute condition={permits.interni} redirectTo={"/login"}>
              <Interni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dettaglio/:id"
          element={
            <ProtectedRoute condition={true} redirectTo={"/login"}>
              <DettaglioTicket />
            </ProtectedRoute>
          }
        />
      </Routes>
    </fieldset>
  );
};

export default memo(BaseLayer);
