import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PulsantieraTable from '../../Components/PulsantieraTable/PulsantieraTable'
import Paginator from '../../Components/Paginator/Paginator';
import SortableTableHead from '../../Components/SortableTable/SortableTableHead';
import PulsantieraFiltri from '../../Components/PulsantieraFiltri/PulsantieraFiltri';
import { headers, urlbase } from '../../Utility/urls';
import { useSelector } from "react-redux";

import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
const MieiTicket = () => {
  const [elementi, setElementi] = useState([]);
  const sortConfig = useRef({ campo: "Titolo", ordine: "asc" });
  const [filter, setFilter] = useState("");
  const user = useSelector(SelectUserSlice);
  //cose da mettere in un hook personalizzato

  const deletePost = useCallback(async (id)=>{
    const response = await fetch(
      urlbase("TICKET") + "/"+id,
      {
        method: "delete",
        headers: headers,
      }
    );
    if(response.status===204){
      console.log("olè");
      setElementi(prev=> prev.filter(el=>el.$id!==id))
      init()
    }
  },[])
  const handleTableAction = (e) => {
    console.log(e);
    const [action,id]=e.split("-");
    switch (action) {
      case("rimuovi"):
      deletePost(id);
      break;
    }
  };
  

  const [totali,setTotali]= useState({aperti:-1,chiusi:-1,inLavorazione:-1, inCarico:-1})
  const onSort = (campo) => {
    const nuovoOrdine =
      sortConfig.current.campo === campo && sortConfig.current.ordine === "asc"
        ? "desc"
        : "asc";
    sortConfig.current = { campo: campo, ordine: nuovoOrdine };
    sortElementi();
  };
  const sortElementi = useCallback(() => {
    const datiClone = [...elementi];

    if (sortConfig.current.campo) {
      datiClone.sort((a, b) => {
        const valoreA = a[sortConfig.current.campo];
        const valoreB = b[sortConfig.current.campo];

        // Parsing delle date se i campi sono "ApertoIl" o "UltimaModifica"
        if (
          sortConfig.current.campo === "ApertoIl" ||
          sortConfig.current.campo === "UltimaModifica"
        ) {
          const dataA = new Date(valoreA);
          const dataB = new Date(valoreB);

          if (dataA < dataB) {
            return sortConfig.current.ordine === "asc" ? -1 : 1;
          }
          if (dataA > dataB) {
            return sortConfig.current.ordine === "asc" ? 1 : -1;
          }
          return 0;
        }

        // Gestione generale per gli altri tipi di dati
        if (valoreA < valoreB) {
          return sortConfig.current.ordine === "asc" ? -1 : 1;
        }
        if (valoreA > valoreB) {
          return sortConfig.current.ordine === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setElementi(datiClone);
  }, [elementi, sortConfig]);

  const handleFiltra = async (e) => {
    let data = null;
    if (filter === e) {
      setElementi([]);
      setFilter("");
    } else {
      switch (e) {
        case "APERTO":
          setFilter(e);
          data = await takeData(e);
          break;
        case "IN_LAVORAZIONE":
          setFilter(e);
          data = await takeData(e);
          break;
        case "CHIUSI":
          setFilter(e);
          data = await takeData(e);
          break;
      }
      setElementi(data);
    }
  };

  const takeData = async (type) => {
    const response = await fetch(
      urlbase("TICKET") + `?queries[0]=search("Stato",+["${type}"])&queries[1]=search("Utente",+["${user.Username}"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const rs = await response.json();

    if (rs.message) {
      //errori cazzo
    } else {
      return rs.documents.map((doc) => ({
        ...doc,
        ApertoIl: doc.$createdAt,
        UltimaModifica: doc.$updatedAt,
      }));
    }
  };

  const perTabella = useMemo(() => {
    return elementi
      ? elementi.map((e) => {
          return {
            Titolo: e.Titolo,
            Testo: e.Testo,
            Categoria: e.Categoria,
            ApertoIl: e.ApertoIl,
            UltimaModifica: e.UltimaModifica,
            Operatore: e.operatore,
            Messaggi: e.Messaggi,
         
            Azioni: (
              <PulsantieraTable
                id={e.$id}
                stato={e.Stato}
                handleTableAction={handleTableAction}
              />
            ),
          };
        })
      : null;
  }, [elementi]);

  const tableBody = useMemo(() => {});

  const intestazioni = perTabella.length > 0 ? Object.keys(perTabella[0]) : [];
  const excludeFromSorting = ["Azioni"];
  const includeInTableIf = { filter: "nan", include: "nan" };

  const formatCell = (intestazione, valore, riga) => {
    switch (intestazione) {
      case "Categoria":
        return valore === "ALTRO"
          ? `${valore} - ${riga.categoria_manuale || "-"}`
          : valore;
      case "ApertoIl":
      case "UltimaModifica":
        return valore ? new Date(valore).toLocaleString("it-IT") : "-";
      case "Messaggi":
        return "dafa";
      default:
        return valore || "-";
    }
  };
  async function init (){
   const stati = ["APERTO", "IN_LAVORAZIONE", "CHIUSO"];
  const responses = await Promise.all(
    stati.map((stato) =>
      fetch(
        urlbase("TICKET") + `?queries[0]=search("Stato", ["${stato}"])&queries[1]=search("Utente", ["${user.Username}"])`,
        {
          method: "GET",
          headers: headers,
        }
      )
    )
    
    
  );
  const jsonResponses = await Promise.all(
    responses.map((response) => response.json())
  );
  const [{documents:dAperti,total:totalAperti},{documents:dlavorazione,total:totalLavorazione},{documents:dchiusi,total:totalChiusi}]=jsonResponses;
  
  setTotali(prev=>({...prev,aperti:totalAperti,chiusi:totalChiusi,inLavorazione:totalLavorazione}))
  }
  useEffect(()=>{
  
  init()
  
  },[])
  return (
    <div>
      <PulsantieraFiltri totali={totali} handleFiltra={handleFiltra} />
      {elementi.length > 0 && intestazioni.length > 0 && (
        <>
          <SortableTableHead
            filter={filter}
            includeInTableIf={includeInTableIf}
            excludeFromSorting={excludeFromSorting}
            intestazioni={intestazioni}
            onSort={onSort}
          />
          <tbody>
            <Paginator elemPerPagina={5}>
              {perTabella.map((riga, index) => (
                <tr key={index}>
                  {intestazioni.map((intestazione) => (
                    <>
                      {((intestazione === includeInTableIf.include &&
                        includeInTableIf.filter === filter) ||
                        intestazione !== includeInTableIf.include) && (
                        <td key={intestazione}>
                          {formatCell(intestazione, riga[intestazione])}
                        </td>
                      )}
                    </>
                  ))}
                </tr>
              ))}
            </Paginator>
          </tbody>
        </>
      )}
    </div>
  );
}

export default MieiTicket