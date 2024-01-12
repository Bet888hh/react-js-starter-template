import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar/Navbar";
import CreaTicket from "./Pages/CreaTicket/CreaTicket";
import GestioneTicket from "./Pages/GestioneTicket/GestioneTicket";
import Interni from "./Pages/Interni/Interni";
import LoginRegistrazione from "./Pages/LoginRegistrazione/LoginRegistrazione";
import MieiTicket from "./Pages/MieiTicket/MieiTicket";
import { SelectUserSlice, setUser } from "./store/Reducer/Slices/UserSlice/UserSlice";
import { Route, Routes, useNavigate } from "react-router-dom";
import { memo, useEffect, useMemo } from "react";
import Home from "./Pages/Home/Home";
import ProtectedRoute from "./Utility/ProtectedRoute";
import { useDispatch } from "react-redux";
import DettaglioTicket from "./Pages/DettaglioTicket/DettaglioTicket";
import { ErrorModal } from "./Components/ErrorModal/ErrorModal";
const BaseLayer = () => {

  const user = useSelector(SelectUserSlice);
  const navigate = useNavigate();
const dispatch = useDispatch()

const permits = useMemo(() => {
  return {
    home: user.Ruolo!=="NOLOG" && user.Ruolo ==="SEMPLICE",
    creaTicket:user.Ruolo!=="NOLOG" && (user.Ruolo==="SEMPLICE" || user.Permesso === "JUNIOR"),
    mieiTicket:user.Ruolo!=="NOLOG",
    gestioneTicket:user.Ruolo==="OPERATORE",
    interni:user.Ruolo==="OPERATORE",
    loginRegistrazione:user.Ruolo==="NOLOG"
  };
}, [user.Ruolo]);


  
useEffect(()=>{
const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"))
if(user.Ruolo==="NOLOG"&&loggedUser){
  dispatch(setUser(loggedUser))
}
},[])



  return (
    <fieldset className="rutto">
      {user.Ruolo !== "NOLOG" && (
        <>
        <Navbar /* render={render} forceRender={forceRender}  */ />
        <ErrorModal />
        </>
      )}
      <br />
      <Routes>
        <Route path="/" element={
       < ProtectedRoute condition={permits.home}  redirectTo={"/login"}>
        <Home />
        </ProtectedRoute>
        } />
        <Route
          path="/login"
          element={
            <ProtectedRoute condition={permits.loginRegistrazione} redirectTo={user.Ruolo==="OPERATORE"?"/gestione_ticket":"/"}>
              <LoginRegistrazione /* forceRender={forceRender} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrazione"
          element={
            <ProtectedRoute condition={permits.loginRegistrazione} redirectTo={"/login"}>
              <LoginRegistrazione /* forceRender={forceRender} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crea_ticket"
          element={
            <ProtectedRoute condition={permits.creaTicket} redirectTo={"/login"}>
              <CreaTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miei_ticket"
          element={
            <ProtectedRoute condition={permits.mieiTicket} redirectTo={"/login"}>
              <MieiTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestione_ticket"
          element={
            <ProtectedRoute condition={permits.gestioneTicket} redirectTo={"/login"}>
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
