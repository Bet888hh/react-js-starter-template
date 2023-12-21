/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";

const PulsantieraTable = ({
  id,
  handleTableAction,
  stato,
  operatore = "",
  assegnatario = "",
}) => {
  const location = useLocation();
  const user = useSelector(SelectUserSlice);
  const action = (e) => {
    handleTableAction(e.target.id);
  };
  return (
    <div>
      <button onClick={action} id={"dettaglio-" + id}>
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
    </div>
  );
};

export default memo(PulsantieraTable);
