import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Paginator from '../../Components/Paginator/Paginator';
import SortableTableHead from '../../Components/SortableTable/SortableTableHead';
import PulsantieraFiltri from '../../Components/PulsantieraFiltri/PulsantieraFiltri';
import PulsantieraTable from '../../Components/PulsantieraTable/PulsantieraTable';
import { headers, urlbase } from '../../Utility/urls';
import { useLocation, useNavigate } from 'react-router-dom';
import ConditionalRenderer from '../../Utility/ConditionalRenderer';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/Reducer/Slices/ErrorSlice/errorSlice';



function Interni() {
  const [elementi, setElementi] = useState([]);
  const sortConfig = useRef({ campo: "Titolo", ordine: "asc" });
  const [filter, setFilter] = useState("");
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [showContent, setShowContent] = useState(false);
  const numeroPagina = useRef();

  const getNumeroPagina = useCallback((pagina) => {
    numeroPagina.current = pagina;
  }, [])

  const goToDettaglio = useCallback((id) => {

    navigate("/dettaglio/" + id, { state: { previousPath: "/interni", previousState: { sort: sortConfig.current, filter: filter, page: numeroPagina.current } } })
  }, [filter, navigate])


  const handleTableAction = useCallback((e) => {

    const [action, id] = e.split("-");
    switch (action) {

      case "dettaglio":
        goToDettaglio(id)
        break;
    }
  }, [goToDettaglio]);







  const sortElementi = useCallback((datiStraordinari = null) => {

    const datiClone =
      datiStraordinari ? [...datiStraordinari] : [...elementi];

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

  /*   const takeData = useCallback(async (type) => {
      const response = await fetch(
        urlbase("TICKET") + `?queries[0]=search("Stato",+["${type}"])`,
        {
          method: "GET",
          headers: headers ,
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
    },[]); */

  const perTabella = useMemo(() => {
    return elementi
      ? elementi.map((e) => {
        return {
          Titolo: e.Titolo,
          Testo: e.Testo,
          Categoria: e.Categoria,
          ApertoIl: e.ApertoIl,
          UltimaModifica: e.UltimaModifica,
          Operatore: e.Operatore,
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
  }, [elementi, handleTableAction]);


  const intestazioni = perTabella.length > 0 ? Object.keys(perTabella[0]) : [];
  const excludeFromSorting = [""];
  const includeInTableIf = { filter: "", include: "" };

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

    async function init() {
     
      setShowContent(false)
      const response = await fetch(
        urlbase("TICKET") + `?queries[0]=search("Stato",+["INTERNO"])`,
        {
          method: "GET",
          headers: headers,
        })
      const rs = await response.json()

      setElementi(rs.documents.map((doc) => ({
        ...doc,
        ApertoIl: doc.$createdAt,
        UltimaModifica: doc.$updatedAt,
      })))
      setShowContent(true)
      return rs
    }

    try {
      init().then((rs) => {
        if (location.state) {


          const { filter, sort } = location.state.prevstate.previousState

          sortConfig.current.campo = sort.campo
          sortConfig.current.ordine = sort.ordine

          sortElementi(rs.documents.map((doc) => ({
            ...doc,
            ApertoIl: doc.$createdAt,
            UltimaModifica: doc.$updatedAt,
          })))


        }
      })
    } catch (e) {
      dispatch(setError(e));
    }

  }, [])
  return (
    <div>

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
                (<Paginator elemPerPagina={5} getNumeroPagina={getNumeroPagina} paginaCorrente={location.state !== null ? location.state.prevstate.previousState.page : 1}>
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
                                    {formatCell(intestazione, riga[intestazione])}
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
       
        { elementi.length === 0 && <p>Non ci sono ticket con questo filtro</p>}

      </ConditionalRenderer>
    </div>
  );
}

export default Interni
