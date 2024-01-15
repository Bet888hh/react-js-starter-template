import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PulsantieraTable from "../../Components/PulsantieraTable/PulsantieraTable";
import Paginator from "../../Components/Paginator/Paginator";
import SortableTableHead from "../../Components/SortableTable/SortableTableHead";
import PulsantieraFiltri from "../../Components/PulsantieraFiltri/PulsantieraFiltri";
import { headers, urlbase } from "../../Utility/urls";
import { useSelector } from "react-redux";

import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Pulsantiera } from "../../Components/PulsantieraTable/Pulsantiera";
import ConditionalRenderer from "../../Utility/ConditionalRenderer";
const MieiTicket = () => {
  const firstRender = useRef(true);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location: ", location);
  const numeroPagina = useRef();
  const [showContent, setShowContent] = useState(false);
  const [elementi, setElementi] = useState([]);
  const sortConfig = useRef({ campo: "niente", ordine: "" });
  const [filter, setFilter] = useState("");
  /* const navigate = useNavigate(); */
  const user = useSelector(SelectUserSlice);

  //cose da mettere in un hook personalizzato
  const init = useCallback(async () => {
    setShowContent(false);
    const stati = ["APERTO", "IN_LAVORAZIONE", "CHIUSO"];
    const responses = await Promise.all(
      stati.map((stato) =>
        fetch(
          urlbase("TICKET") +
          `?queries[0]=search("Stato", ["${stato}"])&queries[1]=search("Utente", ["${user.Username}"])`,
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
    const [
      { documents: dAperti, total: totalAperti },
      { documents: dlavorazione, total: totalLavorazione },
      { documents: dchiusi, total: totalChiusi },
    ] = jsonResponses;

    setTotali((prev) => ({
      ...prev,
      aperti: totalAperti,
      chiusi: totalChiusi,
      inLavorazione: totalLavorazione,
    }));

    //Aggiunta da me speriamo sia giusta

    if (filter === "APERTO") {
      setElementi(dAperti)
    }
    if (filter === "CHIUSO") {
      setElementi(dchiusi)
    }
    if (filter === "IN_LAVORAZIONE") {
      setElementi(dlavorazione)
    }
    setShowContent(true);
  }, [filter, user.Username])

  const [totali, setTotali] = useState({
    aperti: -1,
    chiusi: -1,
    inLavorazione: -1,
    inCarico: -1,
  });



  
  const sortElementi = useCallback((datiStraordinari=null) => {
    const datiClone=
          datiStraordinari? [...datiStraordinari]: [...elementi];

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

  
  
  const onSort = useCallback((campo) => {
  
    const nuovoOrdine =
      sortConfig.current.campo === campo && sortConfig.current.ordine === "asc"
        ? "desc"
        : "asc";
    sortConfig.current = { campo: campo, ordine: nuovoOrdine };
    sortElementi();
  }, [sortElementi]);



  const takeData = useCallback(
    async (type) => {
      const response = await fetch(
        urlbase("TICKET") +
        `?queries[0]=search("Stato",+["${type}"])&queries[1]=search("Utente",+["${user.Username}"])`,
        {
          method: "GET",
          headers: headers,
        }
      );
      const rs = await response.json();

      if (rs.message) {
        //errori cazzo
      } else {
        return rs.total > 0 ? rs.documents.map((doc) => ({
          ...doc,
          ApertoIl: doc.$createdAt,
          UltimaModifica: doc.$updatedAt,
        })) : [];
      }
    },
    [user.Username]
  );
  const handleFiltra = useCallback(
    async (e) => {
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
          case "CHIUSO":
            setFilter(e);
            data = await takeData(e);
            break;
        }
        setElementi(data);
        return data
      }
    },
    [filter, takeData]
  );

  const getNumeroPagina= useCallback((pagina)=>{
    numeroPagina.current = pagina;
  },[])


  const goToDettaglio = useCallback((e) => {
    console.log("numero pagina: ", numeroPagina.current);
    navigate("/dettaglio/" + e.target.id, { state: { previousPath: "/miei_ticket", previousState: { sort: sortConfig.current, filter: filter, page: numeroPagina.current } } })
  }, [filter, navigate]);

  const perTabella = useMemo(() => {
    return elementi
      ? elementi.map((e) => {
        return {
          id: e.$id,
          content: {
            Titolo: e.Titolo,
            Testo: e.Testo,
            Categoria: e.Categoria,
            ApertoIl: e.ApertoIl,
            UltimaModifica: e.UltimaModifica,
            Operatore: e.Operatore,
            Messaggi: e.Messaggi,

            Azioni: (
              <>
                <button onClick={goToDettaglio} id={e.$id}>
                  Dettaglio
                </button>
                <Pulsantiera
                  id={e.$id}
                />
              </>
            ),
          }
        };
      })
      : null;
  }, [elementi, goToDettaglio]);


  const intestazioni = perTabella.length > 0 ? Object.keys(perTabella[0].content) : [];
  const excludeFromSorting = ["Azioni"];
  const includeInTableIf = { filter: "nan", include: "nan" };

  const formatCell = useCallback((intestazione, valore, riga) => {
    switch (intestazione) {
      case "Categoria":
        return valore === "ALTRO"
          ? `${valore} - ${riga.categoria_manuale || "-"}`
          : valore;
      case "ApertoIl":
      case "UltimaModifica":
        return valore ? new Date(valore).toLocaleString("it-IT") : "-";
      case "Messaggi": {
        const messaggi = [...valore]
        return messaggi.length > 0 ?
          (<button onClick={() => {
            const listaMessaggi = messaggi.map((messaggio) => { return `${messaggio}\n` })

            alert(listaMessaggi)
          }
          }>Apri</button>)
          :
          "-";
      }
      default:
        return valore || "-";
    }
  }, []);


  useEffect(() => {
    
    init();
    if (location.state ) {
      (async()=>{
     
        const { filter, sort} = location.state.prevstate.previousState
       const dati= await handleFiltra(filter)
        sortConfig.current.campo= sort.campo 
        sortConfig.current.ordine= sort.ordine
        setFilter(filter)
        sortElementi(dati)

      })()
    }
  }, []);


  return (
    <div>
      <PulsantieraFiltri totali={totali} handleFiltra={handleFiltra} />
      <ConditionalRenderer showContent={showContent}>
        {elementi.length > 0 && intestazioni.length > 0 && (
          <table>
            <SortableTableHead
              filter={filter}
              includeInTableIf={includeInTableIf}
              excludeFromSorting={excludeFromSorting}
              intestazioni={intestazioni}
              onSort={onSort}
              sort={sortConfig.current}
            />
            <tbody>
              {perTabella.length > 0
                &&
                (<Paginator elemPerPagina={5} getNumeroPagina={getNumeroPagina} paginaCorrente={ location.state.prevstate.previousState.page!== null ? location.state.prevstate.previousState.page : 1}>
                  {perTabella.map((riga) => {
                    return (
                      <tr key={riga.id}>
                        {intestazioni.map((intestazione) => {
                          return (
                            <>
                              {((intestazione === includeInTableIf.include &&
                                includeInTableIf.filter === filter) ||
                                intestazione !== includeInTableIf.include) && (
                                  <td key={intestazione}>
                                    {formatCell(intestazione, riga.content[intestazione])}
                                  </td>
                                )}
                            </>
                          )
                        })}
                      </tr>
                    )
                  })}
                </Paginator>)
              }
            </tbody>
          </table>
        )}
      </ConditionalRenderer>
    </div>
  );
};

export default MieiTicket;
