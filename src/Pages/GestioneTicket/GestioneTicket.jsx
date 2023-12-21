import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PulsantieraTable from "../../Components/PulsantieraTable/PulsantieraTable";
import PulsantieraFiltri from "../../Components/PulsantieraFiltri/PulsantieraFiltri";
import { headers, urlbase } from "../../Utility/urls";
import Paginator from "../../Components/Paginator/Paginator";
import SortableTableHead from "../../Components/SortableTable/SortableTableHead";
import SortableTableRows from "../../Components/SortableTable/SortableTableRows";
import { useSelector } from "react-redux";

import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { useNavigate } from "react-router-dom";
const GestioneTicket = () => {
  const navigate = useNavigate()
  const [elementi, setElementi] = useState([]);
  const sortConfig = useRef({ campo: "niente", ordine: "desc" });
  const [filter, setFilter] = useState("");
  const [totali, setTotali] = useState({
    aperti: -1,
    chiusi: -1,
    inLavorazione: -1,
    inCarico: -1,
  });
  const [isloading, setIsLoading] = useState(false);
  //cose da mettere in un hook personalizzato
  const user = useSelector(SelectUserSlice);
  const getTicketAperti = useCallback(() => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Stato", ["APERTO"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, []);
  const getTicketLavorazione = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Stato", ["IN_LAVORAZIONE"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, []);
  const getTicketChiusi = useCallback(() => {
    return fetch(
      urlbase("TICKET") +
        `?queries[0]=search("Stato", ["CHIUSO"])&queries[1]=search("Utente", ["${user.Username}"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, []);
  const getOperatori = useCallback(() => {
    return fetch(
      urlbase("USER") + `?queries[0]=search("Ruolo", ["OPERATORE"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, []);
  
const prendiInCarico= useCallback(async (id) => {
  
  const response = await getTicketLavorazione()
  const rs = await response.json();
  const limite = user.Permesso==="SENIOR"?10:5
  if (!rs.message){
    const ticketUtente = rs.documents.filter(e=>e.Operatore===user.Username).length
    if(ticketUtente<limite){
      console.log("loprendooo");
      fetch(urlbase("TICKET") + "/" + id,//categoria manuale per il junior nel ticket interno è l'id del ticket semplice
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(
          {
            documentId: id,
            data: {
              Stato: "IN_LAVORAZIONE",
              Ultima_visita: user.Permesso,
              Operatore: user.Username,
              Assegnatario: ""
            },
            permissions: [`read("any")`],
          }
        ),
      }).then((r)=>{
       return r.json()
      }).then((r)=>{

      })
    }else{
      //non può prenderlo in carico errore 
    }
  }else{
    //errori
  }
},[getTicketLavorazione, user.Permesso, user.Username])

  const handleTableAction = useCallback((e) => {
    const [action, id] = e.split("-");
    switch (action) {
      case "prendi":
        prendiInCarico(id)
        break;
    }
  }, []);

  
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

  const onSort = useCallback(
    (campo) => {
      const nuovoOrdine =
        sortConfig.current.campo === campo &&
        sortConfig.current.ordine === "asc"
          ? "desc"
          : "asc";
      sortConfig.current = { campo: campo, ordine: nuovoOrdine };
      sortElementi();
    },
    [sortElementi]
  );
  const takeData = useCallback(async (response) => {
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
  }, []);

  const handleFiltra = useCallback(
    async (e) => {
      let data = null;
      let operatoriJunior;
      if (filter === e) {
        setElementi([]);
        setFilter("");
      } else {
        switch (e) {
          case "APERTO":
            setFilter(e);
            data = await getTicketAperti();
            data = await data.json();
            data = data.documents

            break;
          case "IN_LAVORAZIONE":
            setFilter(e);
            operatoriJunior = await getOperatori();
            operatoriJunior = await operatoriJunior.json();
            operatoriJunior = operatoriJunior.documents
              .filter((e) => e.Permesso === "JUNIOR")
              .map((e) => e.Username);
            data = await getTicketLavorazione();
            data = await data.json();
            data = data.documents.filter((e) =>
              operatoriJunior.includes(e.Operatore)
            );
            break;
          case "CHIUSI":
            setFilter(e);
            data = await getTicketChiusi();
            data =await data.json();
            data= data.documents
            break;
          case "in-carico":
            setFilter(e);
            data = await getTicketLavorazione();
            data = await data.json();
            data = data.documents.filter((e) => e.Operatore === user.Username);
            break;
        }
  
       !data? setElementi([]):setElementi(
          data.map((doc) => ({
            ...doc,
            ApertoIl: doc.$createdAt,
            UltimaModifica: doc.$updatedAt,
          }))
        );
      }
    },
    [
      filter,
      getOperatori,
      getTicketAperti,
      getTicketChiusi,
      getTicketLavorazione,
      user.Username,
    ]
  );

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
            Assegnatario: e.Assegnatario,
            Azioni: (
              <PulsantieraTable
                operatore={e.Operatore}
                assegnatario={e.Assegnatario}
                id={e.$id}
                stato={e.Stato}
                handleTableAction={handleTableAction}
              />
            ),
          };
        })
      : null;
  }, [elementi, handleTableAction]);

  const tableBody = useMemo(() => {});

  const intestazioni = perTabella.length > 0 ? Object.keys(perTabella[0]) : [];
  const excludeFromSorting = ["Azioni"];
  const includeInTableIf = { filter: "in-carico", include: "Assegnatario" };

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

  const init = useCallback(async () => {
    const stati = ["APERTO", "IN_LAVORAZIONE", "CHIUSO"];
    const responses = await Promise.all([
      getTicketAperti(),
      getTicketLavorazione(),
      getOperatori(),
      getTicketChiusi(),
    ]);
    const jsonResponses = await Promise.all(
      responses.map((response) => response.json())
    );

    const [
      { documents: dAperti, total: totalAperti },
      { documents: dlavorazione, total: totalLavorazione },
      { documents: operatori, total: tootalOperatori },
      { documents: dchiusiUtente, total: totalChiusiUtente },
    ] = jsonResponses;

    const inLavorazioneUtenteLoggato = dlavorazione.filter(
      (e) => e.Operatore === user.Username
    );
    const junior = operatori.filter((e) => e.Permesso === "JUNIOR").map(e=>e.Username);
    const lavorazioneJunior = dlavorazione.filter(
      (e) => junior.includes(e.Operatore) 
    );

    setTotali((prev) => ({
      inCarico:
        inLavorazioneUtenteLoggato.length > 0
          ? inLavorazioneUtenteLoggato.length
          : 0,
      aperti: totalAperti,
      chiusi: totalChiusiUtente,
      inLavorazione:
        lavorazioneJunior.length > 0 ? lavorazioneJunior.length : 0,
    }));
  }, [getOperatori, getTicketAperti, getTicketChiusi, getTicketLavorazione, user.Username]);

  useEffect(() => {
    init();
  }, [init]);

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
            sort={sortConfig.current}
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
      {filter&&elementi.length===0&&<>no</>}
    </div>
  );
};

export default GestioneTicket;
