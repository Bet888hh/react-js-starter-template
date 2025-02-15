import React, { useCallback, useEffect, useRef, useState } from 'react';
import TabellaHome from '../../Components/TabellaHome/TabellaHome';
import '../../Utility/urls';
import { headers, urlbase } from '../../Utility/urls';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SelectErrorSlice, setError } from '../../store/Reducer/Slices/ErrorSlice/errorSlice';


const Home = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const error = useSelector(SelectErrorSlice)
  const [tickets, setTickets] = useState([]);
  const [testoRicerca, setTestoRicerca] = useState(location.state !== null ? location.state.prevstate.previousState.parolaRicerca : "");
  const categoriaRef = useRef(null);
  const testoAvvisi = useRef("Caricamento...")

  const caricaTicket = useCallback(() => {

    let url = urlbase("TICKET") + `?queries[0]=search("Stato",+["APERTO"])`;
    if (categoriaRef.current !== null) {
      if (categoriaRef.current.value !== "") {
        url += `&queries[1]=search("Categoria",+["${categoriaRef.current.value}"])`
      }
    }
    try {
      fetch(
        url,
        {
          method: "GET",
          headers: headers,
        })
        .then((res) => res.json())
        .then((res) => {
          let tickets = res.documents
          if (testoRicerca !== "") {
            tickets = tickets.filter((ticket) => {
              const testo = ticket.Testo
              return testo.includes(testoRicerca);
            });
          }
          tickets.reverse();//per ordinarli per data in modo discendente
          setTickets(tickets);
          testoAvvisi.current = tickets > 0 ? "Caricamento..." : "Nessun ticket trovato"
        })
    } catch (e) {
      dispatch(setError(e.message));
    }
  }, [testoRicerca])

  const handleChangeTestoRicerca = useCallback((e) => {
    setTestoRicerca(e.target.value);
  }, [])

  useEffect(() => {
    caricaTicket()
  }, [])


  return (
    <div>

      <div className='row'>
        <label>Ricerca:</label>
        <input type="text" value={testoRicerca} onChange={handleChangeTestoRicerca} max="50" />
        <label>Categoria:</label>
        <select ref={categoriaRef}>
          <option value="">Selziona una categoria</option>
          <option value="Articolo_non_funzionante">Articolo non funzionante</option>
          <option value="Articolo_danneggiato">Articolo danneggiato</option>
          <option value="Articono_non_conforme">Articolo non conforme</option>
          <option value="Altro">Altro</option>
        </select>

        <button onClick={caricaTicket}>Cerca</button>
      </div>
      {tickets.length > 0
        ?
        (
          <TabellaHome ticketsAperti={tickets} parolaRicerc={testoRicerca} />
        )
        :
        (<p>{testoAvvisi.current}</p>)
      }

    </div>
  )
}

export default Home

