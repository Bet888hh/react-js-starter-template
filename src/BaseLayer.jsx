import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar/Navbar";
import CreaTicket from "./Pages/CreaTicket/CreaTicket";
import GestioneTicket from "./Pages/GestioneTicket/GestioneTicket";
import Interni from "./Pages/Interni/Interni";
import LoginRegistrazione from "./Pages/LoginRegistrazione/LoginRegistrazione";
import MieiTicket from "./Pages/MieiTicket/MieiTicket";
import { SelectUserSlice } from "./store/Reducer/Slices/UserSlice/UserSlice";
import { Route, Routes, useNavigate } from "react-router-dom";
import { memo, useEffect, useMemo } from "react";
import Home from "./Pages/Home/Home";
import ProtectedRoute from "./Utility/ProtectedRoute";

const BaseLayer = () => {

  const user = useSelector(SelectUserSlice);
  const navigate = useNavigate();


  const permits = useMemo(() => {
    return {
      home: user.Ruolo!=="NOLOG",
      creaTicket:user.Ruolo!=="NOLOG",
      mieiTicket:user.Ruolo!=="NOLOG",
      gestioneTicket:user.Ruolo!=="NOLOG",
      interni:user.Ruolo!=="NOLOG",
      loginRegistrazione:user.Ruolo==="NOLOG"
    };
  }, [user.Ruolo]);


  

  return (
    <fieldset className="rutto">
      {user.Ruolo !== "NOLOG" && (
        <Navbar /* render={render} forceRender={forceRender}  */ />
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
            <ProtectedRoute condition={permits.loginRegistrazione} redirectTo={"/login"}>
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
      </Routes>
    </fieldset>
  );
};

export default memo(BaseLayer);
