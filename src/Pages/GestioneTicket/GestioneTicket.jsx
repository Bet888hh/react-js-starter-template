import React, { useCallback, useMemo, useState } from "react";
import PulsantieraTable from "../../Components/PulsantieraTable/PulsantieraTable";
import PulsantieraFiltri from "../../Components/PulsantieraFiltri/PulsantieraFiltri";
import { headers, urlbase } from "../../Utility/urls";
import Paginator from "../../Components/Paginator/Paginator";
import SortableTableHead from "../../Components/SortableTable/SortableTableHead"
import SortableTableRows from "../../Components/SortableTable/SortableTableRows";
const GestioneTicket = () => {
  const [elementi, setElementi] = useState([]);
  const [sortConfig, setSortConfig] = useState({ campo: null, ordine: "asc" });
  const [filter, setFilter] = useState("");

  //cose da mettere in un hook personalizzato
  const handleTableAction = (e) => {
    //logica per i pulsanti della tabella
  };

  const onSort = (campo) => {
    const nuovoOrdine =
      sortConfig.campo === campo && sortConfig.ordine === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ campo, ordine: nuovoOrdine });
    sortElementi();
  };

  const sortElementi = useCallback(() => {
    const datiClone = [...elementi];
    if (sortConfig.campo) {
      datiClone.sort((a, b) => {
        const valoreA = a[sortConfig.campo];
        const valoreB = b[sortConfig.campo];

        if (valoreA < valoreB) {
          return sortConfig.ordine === "asc" ? -1 : 1;
        }
        if (valoreA > valoreB) {
          return sortConfig.ordine === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setElementi(datiClone);
  }, [elementi, sortConfig.campo, sortConfig.ordine]);

  const handleFiltra = async (e) => {
    let data = null;
    if (filter === e) {
      setElementi([]);
      setFilter("")
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
        case "in-carico":
          //dafa
          break;
      }
      setElementi(data);
    }
  };

  const takeData = async (type) => {
    const response = await fetch(
      urlbase("TICKET") + `?queries[0]=search("Stato",+["${type}"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const rs = await response.json();

    if (response.message) {
      //errori cazzo
    } else {
      return rs.documents;
    }
  };

  const perTabella = useMemo(() => {
    return elementi
      ? elementi.map((e) => {
          return {
            Titolo: e.Titolo,
            Testo: e.Testo,
            Categoria: e.Categoria,
            ApertoIl: e.$createdAt,
            UltimaModifica: e.$updatedAt,
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
  
const tableBody = useMemo(()=>{
  
})


  console.log(perTabella);
  const intestazioni =perTabella.length>0? Object.keys(perTabella[0]):[]
  const excludeFromSorting = ["Azioni"]
console.log(intestazioni);

const formatCell = (intestazione, valore, riga) => {
  switch (intestazione) {
    case 'Categoria':
      return valore === 'ALTRO' ? `${valore} - ${riga.categoria_manuale || '-'}` : valore;
    case 'ApertoIl':
    case 'UltimaModifica':
      return valore ? new Date(valore).toLocaleString('it-IT') : '-';
    case 'Messaggi':
      return"dafa"
    default:
      return valore || '-';
  }
};
  return (
    <div>
      <PulsantieraFiltri handleFiltra={handleFiltra} />
      {(elementi.length>0 && intestazioni.length > 0) && (
        <>
          <SortableTableHead excludeFromSorting={excludeFromSorting} intestazioni={intestazioni} onSort={onSort}/>
        <tbody>

         <Paginator elemPerPagina={5}>
         {perTabella.map((riga, index) => (
           <tr key={index}>
        {intestazioni.map((intestazione) => (
          <td key={intestazione}>{formatCell(intestazione, riga[intestazione])}</td>
          ))}
      </tr>
    ))}
          </Paginator> 
    </tbody>
        </>
      )}
    </div>
  );
};

export default GestioneTicket;
