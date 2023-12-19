
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SelectUserSlice } from '../../store/Reducer/Slices/UserSlice/UserSlice';
import { headers, urlbase } from '../../Utility/urls';

const CreaTicket = () => {
  const user = useSelector(SelectUserSlice);
  const [ticketApertiInLavorazione, setTicketApertiLavorazione] = useState(0);

  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [categoria, setCategoria] = useState(''); // Categoria di default
  const [categoriaManuale, setCategoriaManuale] = useState('');
  const [assegnaA, setAssegnaA] = useState('');
  const [listaAssegnatari, setListaAssegnatari] = useState([]);

  const gestisciCreazioneTicket = () => {

    // Verifica dei vincoli in base al ruolo dell'utente
    debugger
    if (user.Ruolo === 'SEMPLICE') {
      if (ticketApertiInLavorazione > 2) {
        alert('Hai già aperto troppi ticket. Chiudi alcuni prima di aprirne un altro.');
        return;
      }
    }

    // Altri controlli e logica specifica del ticket

    // Simulazione del salvataggio a DB
    let ticket = {
      Titolo:titolo,
      Testo: testo,
      Categoria: categoria!=="Altro"?categoria:categoriaManuale,
      Assegnatario: assegnaA,
    }

    if(user.Ruolo === "SEMPLICE" ){
      ticket={...ticket, Utente:user.Username}
    }else{
      ticket={...ticket, Operatore:user.Username}
    }

    const request= {
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
      ()=>alert('Ticket creato con successo!')
    )
    
  };

  const ottieniListaAssegnatari = useCallback(()=>{
    let listaAssegnatari = [];
    fetch(urlbase("USER") + `?queries[0]=search("Ruolo",+["OPERATORE"])&queries[1]=search("Permesso",+["SENIOR"])`
      , {
        method: "GET",
        headers: headers,
      })
      .then(res => res.json())
      .then(r => {
        listaAssegnatari = r.documents
        listaAssegnatari.filter(
          (operatore) => {
            fetch(urlbase("TICKET") + `?queries[0]=search("Assegnatario",+["${operatore}"])`
              , {
                method: "GET",
                headers: headers,
              }).then(res => res.json())
              .then(res => {
                if (res.total < 5) {
                  return true;
                }
              })
          }

        )

        setListaAssegnatari(listaAssegnatari);
      })
  },[]);

  const contoTicketApertiInLavorazione= useCallback(()=>{
    fetch(urlbase("TICKET") + `?queries[0]=search("Assegnatario",+["${user.Username}"]&queries[0]=search("Stato",+["APERTO"])|queries[1]=search("Stato",+["IN_LAVORAZIONE"]))`
      , {
        method: "GET",
        headers: headers,
      })
      .then(res=>res.json())
      .then(res=>setTicketApertiLavorazione(res.total))
  }, []);

  useEffect(() => {
    ottieniListaAssegnatari();
    contoTicketApertiInLavorazione();
  }, [])

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
              listaAssegnatari.map((elem) => {
                console.log("elem: ", elem);
                return (<option key={elem.Username} value={elem}>{elem.Username}</option>)
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
