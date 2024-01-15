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
import { Route, Routes, useNavigate } from "react-router-dom";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Home from "./Pages/Home/Home";
import ProtectedRoute from "./Utility/ProtectedRoute";
import { useDispatch } from "react-redux";
import DettaglioTicket from "./Pages/DettaglioTicket/DettaglioTicket";
import { ErrorModal } from "./Components/ErrorModal/ErrorModal";
import { headers, urlbase } from "./Utility/urls";
import { setError } from "./store/Reducer/Slices/ErrorSlice/ErrorSlice";
const BaseLayer = () => {
  const user = useSelector(SelectUserSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useRef({
    mieiTicket: [],
    ticketInCarico: [],
    ticketLavorazione: [],
  });

 const [mieiTicketNotifNumber, setMieiTicketNotifNumber] = useState([])
const [gestioneTicketNotifNumber, setGestioneTicketNotifNumber] = useState([])
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
      urlbase("TICKET") +
        `?queries[0]=search("Operatore", [${user.Username}])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, [user.Username]);
  const getOperatori = useCallback(() => {
    return fetch(
      urlbase("USER") + `?queries[0]=search("Ruolo", ["OPERATORE"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, []);

  const getTickeUtente = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Utente", [${user.Username}])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, [user.Username]);

  

  /* const takeDataForSeniorr = useCallback(async () => {
    let ticketInCarico = await getTicketMieiInLavorazione();
    ticketInCarico = await ticketInCarico.json();
    let ticketLavorazione = await getTicketLavorazione();
    ticketLavorazione = await ticketLavorazione.json();
    let operatoriJunior = await getOperatori();
    operatoriJunior = await operatoriJunior.json();

    if (
      ticketInCarico.message ||
      ticketLavorazione.message ||
      operatoriJunior.message
    ) {
      dispatch(setError(ticketInCarico.message));
    } else {
      operatoriJunior = operatoriJunior.documents
        .filter((e) => e.Permesso === "JUNIOR")
        .map((e) => e.Username);
      ticketLavorazione = ticketLavorazione.documents.filter((e) =>
        operatoriJunior.includes(e.Operatore)
      );
     
     const returnValue = { ticketInCarico: ticketInCarico.documents, ticketLavorazione: ticketLavorazione }
     
      return returnValue;
    }
  }, [
    dispatch,
    getOperatori,
    getTicketLavorazione,
    getTicketMieiInLavorazione,
  ]); */

  const takeDataForOperatore = useCallback(async () => {
    
    let ticketInCarico = await getTicketMieiInLavorazione();
    ticketInCarico = await ticketInCarico.json();
    if (ticketInCarico.message) {
      dispatch(setError(ticketInCarico.message));
    } else {

      const returnValue = { ticketInCarico: ticketInCarico.documents }
   
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


  const compareDataForUser = useCallback(({ mieiTicket }) => {
    let newMieiTicket = mieiTicket;
    let oldMieiTicket = state.current.mieiTicket;
    let notifiche = [];
   
   
 
    newMieiTicket.forEach((newTicket) => {
      let notif = false;
      const oldTicket = oldMieiTicket.find((ticket) => ticket.$id === newTicket.$id);

      if (oldTicket) {
        if (newTicket.Messaggi.length > oldTicket.Messaggi.length) {
          notif = true;
          
         
        }else if(newTicket.Stato==="CHIUSO" &&  oldTicket.Stato ==="IN_LAVORAZIONE"){
          console.log("chiusooo");
          notif = true;
        }
        notifiche= notif? [...notifiche, newTicket.$id]: notifiche;
    }  });
    setMieiTicketNotifNumber(prev=>{
     //merge prevand notifiche and remove duplicates and return the new array
      return [...new Set([...prev, ...notifiche])]

    })
    state.current ={mieiTicket:newMieiTicket}
  }, []);


  const compareDataForOperatore = useCallback(({ ticketInCarico }) => {
    let newTicketInCarico =ticketInCarico;
    let oldMieiTicketInCarico = state.current.ticketInCarico;
    let notifiche = [];
   
   
   newTicketInCarico.forEach((newTicket) => {
     let notif = false;
     const oldTicket = oldMieiTicketInCarico.find((ticket) => ticket.$id === newTicket.$id);
    
     console.log(newTicket.Messaggi[newTicket.Messaggi.length]);
      if (oldTicket) {
        if ((newTicket.Messaggi.length > oldTicket.Messaggi.length )&&(!newTicket.Messaggi[newTicket.Messaggi.length-1].includes(user.Username)) ) {
          notif = true;
          
         
        }else if(newTicket.Stato==="IN_LAVORAZIONE" &&  oldTicket.Stato ==="CHIUSO"){
          console.log("apertooo");
          notif = true;
        }
        notifiche= notif? [...notifiche, newTicket.$id]: notifiche;
    }  });
    setGestioneTicketNotifNumber(prev=>{
  
      return [...new Set([...prev, ...notifiche])]

    })
    state.current ={ticketInCarico:newTicketInCarico}
  }, [user.Username]);



  const poll = useCallback(() => {
  
 
    if (user.Ruolo === "SEMPLICE") {
      takeDataForUser().then((value) => {
        compareDataForUser(value);
      });
    } else if (user.Ruolo === "OPERATORE") {
      takeDataForOperatore().then((value) => {
        console.log("lol");
        compareDataForOperatore(value);
      });
    }
  }, [compareDataForOperatore, compareDataForUser, takeDataForOperatore, takeDataForUser, user.Ruolo]);


  useEffect(() => {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (user.Ruolo === "NOLOG" && loggedUser) {
      dispatch(setUser(loggedUser));
    }

    if (user.Ruolo === "SEMPLICE") {
      takeDataForUser().then(r=>{state.current= r})
    } else if (user.Ruolo === "OPERATORE" ) {
      takeDataForOperatore().then(r=>{state.current= r})
    }
    
   
  }, [dispatch, takeDataForOperatore,  takeDataForUser, user.Permesso, user.Ruolo]);


useEffect(()=>{
 
 
  const id = setInterval(poll, 5000);
  return () => {
   clearInterval(id);
  };
},[poll])


  return (
    <fieldset className="rutto">
      {user.Ruolo !== "NOLOG" && (
        <>
          <Navbar gestioneTicketNotifNumber={gestioneTicketNotifNumber.length} mieiTicketNotifNumber= {mieiTicketNotifNumber.length} /* render={render} forceRender={forceRender}  */ />
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
