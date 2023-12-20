/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { useLocation } from "react-router-dom";

const PulsantieraTable = ({ id, handleTableAction ,stato}) => {
  const location = useLocation();

  const action = (e)=>{
    handleTableAction(e.target.id)
  }
  return (
    <div>
      <button onClick={action} id={"dettaglio-" + id}>dettaglio</button>
      {location.pathname == "/gestione_ticket" && (
        <>
          <button onClick={action} id={"prendi-" + id}>prendi in carico</button>
          <button onClick={action} id={"accetta-" + id}>accetta</button>
        </>
      )}
      {location.pathname == "/miei_ticket" && (
        <>
        {stato==="APERTO"&&  <button onClick={action} id={"rimuovi-" + id}>rimuovi</button>}
          <button onClick={action} id={"riapri-" + id}>riapri</button>
        </>
      )}
    </div>
  );
};

export default memo(PulsantieraTable);
