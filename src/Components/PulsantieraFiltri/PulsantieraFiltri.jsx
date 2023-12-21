/* eslint-disable react/prop-types */
import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";

const PulsantieraFiltri = ({
  handleFiltra,
  totali: { aperti, chiusi, inLavorazione, inCarico },
}) => {
  const user = useSelector(SelectUserSlice);
  const location = useLocation();
  const filtra = (e) => {
    handleFiltra(e.target.id);
  };
  return (
    <div>
      <button onClick={filtra} id="APERTO">
        Aperti {aperti >= 0 && aperti}
      </button>
      {((user.Permesso === "SENIOR" &&
        location.pathname === "/gestione_ticket") ||
        location.pathname !== "/gestione_ticket") && (
        <button onClick={filtra} id="IN_LAVORAZIONE">
          In lavorazione{inLavorazione >= 0 && inLavorazione}
        </button>
      )}
      <button onClick={filtra} id="CHIUSI">
        Chiusi {chiusi >= 0 && chiusi}
      </button>
      {location.pathname === "/gestione_ticket" && (
        <button onClick={filtra} id="in-carico">
          In Carico{inCarico}
        </button>
      )}
    </div>
  );
};

export default PulsantieraFiltri;
