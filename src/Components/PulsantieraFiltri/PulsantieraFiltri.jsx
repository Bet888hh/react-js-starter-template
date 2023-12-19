/* eslint-disable react/prop-types */
import React from "react";
import { useLocation } from "react-router-dom";
const PulsantieraFiltri = ({handleFiltra}) => {
  const location = useLocation();
  const filtra = (e)=>{
    handleFiltra(e.target.td)
  }
  return (
    <div>
      <button onClick={filtra} id="aperti">Aperti</button>
      <button onClick={filtra} id="in-lavorazione">In lavorazione</button>
      <button onClick={filtra} id="chiusi">Chiusi</button>
      {location.pathname === "/gestione_ticket" && (
        <button onClick={filtra} id="in-carico">In Carico</button>
      )}
    </div>
  );
};

export default PulsantieraFiltri;
