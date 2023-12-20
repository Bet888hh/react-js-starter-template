/* eslint-disable react/prop-types */

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SelectUserSlice } from '../../store/Reducer/Slices/UserSlice/UserSlice';
import { headers, urlbase } from '../../Utility/urls';
import { useNavigate } from 'react-router-dom';

const CreaTicket = ({ ticketDaLavorare }) => {
  const navigate = useNavigate();
  const user = useSelector(SelectUserSlice);
  const [mieiTicketApertiInLavorazione, setMieiTicketApertiLavorazione] = useState(0);

  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [categoria, setCategoria] = useState(''); // Categoria di default
  const [categoriaManuale, setCategoriaManuale] = useState('');
  const [assegnaA, setAssegnaA] = useState('');
  const [listaAssegnatari, setListaAssegnatari] = useState([]);

  const gestisciCreazioneTicket = () => {

    let ticket = {
      Titolo: titolo,
      Testo: testo,
      Categoria: categoria !== "Altro" ? categoria : categoriaManuale,
      Assegnatario: assegnaA,
    }
    let navigazione;

    if (user.Ruolo === 'SEMPLICE') {
      if (mieiTicketApertiInLavorazione > 2) {
        alert('Hai già aperto troppi ticket. Chiudi alcuni prima di aprirne un altro.');
        return;
      }
      ticket = { ...ticket, Utente: user.Username, Stato: "APERTO" }
      navigazione = '../miei_ticket'
    } else {
      ticket = { ...ticket, Operatore: user.Username, Stato: "INTERNO" }
      navigazione = '../gestione_ticket'
    }

    const request = {
      documentId: "",
      data: ticket,
      permissions: ['read("any")'],
    };

    fetch(urlbase("TICKET"), {
      method: "POST",
      headers: headers,
      body: JSON.stringify(request),
    })
      .then(
        () => alert('Ticket creato con successo!')
      )
      .then(()=>{navigate(navigazione)})
  };

  const ottieniListaAssegnatari = useCallback(() => {
    let listaAssegnatari = [];
    fetch(urlbase("USER") + `?queries[0]=search("Ruolo",+["OPERATORE"])&queries[1]=search("Permesso",+["SENIOR"])`
      , {
        method: "GET",
        headers: headers,
      })
      .then(res => res.json())
      .then(res => {
        const list = res.documents
        const fetchPromises = list.map((operatore) => {
          return fetch(urlbase("TICKET") + `?queries[0]=search("Assegnatario",+["${operatore.Username}"])`, {
            method: "GET",
            headers: headers,
          })
            .then(res => res.json())
            .then(res => {
              if (res.total < 5) {
                listaAssegnatari.push({ username: operatore.Username, ticketAssegnati: res.total });
              }
            });
        });

        // Attendo che tutte le Promise siano risolte prima di aggiornare lo stato
        Promise.all(fetchPromises).then(() => {
          setListaAssegnatari(listaAssegnatari);
        });
      })
  }, []);

  const contoMieiTicketApertiInLavorazione = useCallback(() => {
    fetch(urlbase("TICKET") + `?queries[0]=search("Assegnatario",+["${user.Username}"]&queries[1]=search("Stato",+["APERTO"])|queries[2]=search("Stato",+["IN_LAVORAZIONE"]))`
      , {
        method: "GET",
        headers: headers,
      })
      .then(res => res.json())
      .then(res => setMieiTicketApertiLavorazione(res.total))
  }, [user.Username]);



  useEffect(() => {
    contoMieiTicketApertiInLavorazione();
    if(user.Ruolo ==="OPERATORE" && user.Permesso === "JUNIOR"){
      setTitolo(ticketDaLavorare.Titolo);
      setTesto("Ciao, ti contatto per il ticket {ticketDaLavorare.Titolo} per chiederti di prenderlo in carico");
      setCategoria("INTERNO");
      setCategoriaManuale(ticketDaLavorare.Id);
      ottieniListaAssegnatari();
    }
  }, [contoMieiTicketApertiInLavorazione, ottieniListaAssegnatari, ticketDaLavorare.Id, ticketDaLavorare.Titolo, user.Permesso, user.Ruolo])

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2>Creazione Ticket</h2>
      <label>Titolo:</label>
      <input type="text" value={titolo} onChange={e => setTitolo(e.target.value)} />

      <label>Testo:</label>
      <textarea value={testo} onChange={e => setTesto(e.target.value)} />

      <label>Categoria:</label>
      {user.Ruolo === "SEMPLICE"
        ?
        (
          <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="Articolo_non_funzionante">Articolo non funzionante</option>
            <option value="Articolo_dannegiato">Articolo dannegiato</option>
            <option value="Articolo_non_conforme">Articolo non conforme</option>
            <option value="Altro">Altro</option>
          </select>
        )
        :
        (
          <select defaultValue={"Interno"} disabled={true}>
            <option value="Interno">Interno</option>
          </select>
        )
      }


      {categoria === 'Altro' && (
        <div>
          <label>Categoria Manuale:</label>
          <input type="text" value={categoriaManuale} onChange={e => setCategoriaManuale(e.target.value)} />
        </div>
      )}

      {user.Ruolo === 'OPERATORE' && user.Permesso === 'JUNIOR' && (
        <div>
          <label>Assegna a:</label>
          <select value={assegnaA} onChange={e => setAssegnaA(e.target.value)}>
            {listaAssegnatari.length > 0 && (
              listaAssegnatari.map((elem, index) => {
                return (<option key={index} value={elem.username}>{elem.username}-{elem.ticketAssegnati}</option>)//username con la u minuscola per distinguerlo con l'oggetto dello sliceS
              })
            )}
          </select>
        </div>
      )}

      <button onClick={gestisciCreazioneTicket}>Crea Ticket</button>
    </div>
  );
};

export default CreaTicket;
