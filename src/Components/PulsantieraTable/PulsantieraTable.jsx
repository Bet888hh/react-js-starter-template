/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { SelectNotifSlice } from "../../store/Reducer/Slices/notifSlice/notifSlice";
const PulsantieraTable = ({
  
  id,
  handleTableAction,
  stato,
  operatore = "",
  assegnatario = "",
}) => {
  const navigate= useNavigate()
  const location = useLocation();
  const user = useSelector(SelectUserSlice);
  const notif = useSelector(SelectNotifSlice)
  const action = (e) => {
    handleTableAction(e.target.id);
  };
 /* const goToDettaglio = (e)=>{
    navigate("/dettaglio/"+e.target.id)
  } */
  const buttonNotifStyle = {
    border: user.Ruolo === "OPERATORE" ? notif.gestioneTicketNotifNumber.includes(id) ? "2px solid red" : "none" : notif.mieiTicketNotifNumber.includes(id) ? "2px solid red" : "none"
  }
  return (
    <>
      <button style = {buttonNotifStyle} onClick={action} id={"dettaglio-"+id}>
        dettaglio
      </button>
      {location.pathname == "/gestione_ticket" && (
        <>
          {stato === "APERTO" && (
            <button onClick={action} id={"prendi-" + id}>
              prendi in carico
            </button>
          )}
          {stato === "IN_LAVORAZIONE" &&
            user.Permesso === "SENIOR" &&
            assegnatario === user.Username &&
            operatore !== user.Username && (
              <button onClick={action} id={"accetta-" + id}>
                accetta
              </button>
            )}
        </>
      )}
      {location.pathname == "/miei_ticket" && (
        <>
          {stato === "APERTO" && (
            <button onClick={action} id={"rimuovi-" + id}>
              rimuovi
            </button>
          )}
         {stato==="CHIUSO"&& <button onClick={action} id={"riapri-" + id}>
            riapri
          </button>}
        </>
      )}
    </>
  );
};

export default memo(PulsantieraTable);
