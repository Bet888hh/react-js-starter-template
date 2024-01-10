/* eslint-disable react/prop-types */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SelectUserSlice } from '../../store/Reducer/Slices/UserSlice/UserSlice';
import { headers, urlbase } from '../../Utility/urls';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CreaTicket = () => {
  //const per testare il junior fino a che manca dettaglio
  /* const ticketDaLavorare =
  {
    Titolo: "ticket1",
    Testo: "ticket1",
    Operatore: null,
    Utente: "Vins321",
    Stato: "APERTO",
    Messaggi: [],
    Assegnatario: null,
    Categoria: "Articolo_dannegiato",
    Categoria_manuale: null,
    Ultima_visita: "Utente",
    Riaperto: false,
    $id: "658404240f101ade5b29",
    $createdAt: "2023-12-21T09:23:48.061+00:00",
    $updatedAt: "2023-12-21T09:23:48.061+00:00",
    $permissions: [
        "read(\"any\")"
    ],
} */


  const location = useLocation();
  const [ticketDaLavorare, setTicketDaLavorare] = useState(location.state);
  console.log("ticketDaLavorare", ticketDaLavorare);
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

    let pathNavigazione;//per essere reindirizzati alla fine della creazione in base all'utente
    let ticket = {
      Titolo: titolo,
      Testo: testo,
      Utente: user.Username,
      Ultima_visita: user.Permesso ? user.Permesso : "UTENTE",
      Categoria: categoria,
    }

    if (user.Ruolo === 'SEMPLICE') {
      if (mieiTicketApertiInLavorazione > 1) {
        alert('Hai già aperto troppi ticket. Chiudine alcuni prima di aprirne un altro.');
        return;
      }
      ticket = { ...ticket, Stato: "APERTO", Categoria_manuale: categoriaManuale }
      pathNavigazione = '../miei_ticket'
    } else {
      ticket = { ...ticket, Operatore: assegnaA, Stato: "INTERNO" }
      pathNavigazione = '../gestione_ticket'
    }

    const tuttiICampiValidi = Object.values(ticket).every(valore => typeof valore === 'string' && valore.trim() !== '');
    if (!tuttiICampiValidi) {
      alert("Compilare tutti i campi");
      return
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
      .then(() => {
        if (user.Ruolo === "OPERATORE") {
          return fetch(urlbase("TICKET") + "/" + categoriaManuale, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({
              documentId: categoriaManuale,
              data: {
                Stato: "IN_LAVORAZIONE",
                Ultima_visita: "JUNIOR",
                Operatore: assegnaA,
                Assegnatario: user.Username,
              },
              permissions: [`read("any")`],
            }),
          })
            .then(() => alert('Ticket creato con successo!'))
            .then(() => navigate(pathNavigazione))
            .catch(() => {
              throw new Error('Qualcosa è andato storto durante la PATCH');
            });
        }
      })
      .catch((error) => {
        alert('Qualcosa è andato storto durante la POST');
        console.error(error);
      });


  };

  const ottieniListaAssegnatari = useCallback(() => {
    fetch(urlbase("USER") + `?queries[0]=search("Ruolo",+["OPERATORE"])&queries[1]=search("Permesso",+["SENIOR"])`
      , {
        method: "GET",
        headers: headers,
      })
      .then(res => res.json())
      .then(res => {
        const operatoriSenior = res.documents;
        const tickets = [];
        fetch(urlbase("TICKET") + `?queries[0]=search("Stato",+["IN_LAVORAZIONE"])`, /* isNotNull("Assegnatario")&queries[1] */
          {
            method: "GET",
            headers: headers,
          }
        )
          .then(r => r.json())
          .then(r => {
            tickets.push(...r.documents)
            const listaAssegnatari = operatoriSenior.map(operatore => {//operatori a cui posso assegnare
              const totTicketOperatore = (tickets.filter((ticket) => {
                return ticket.Operatore === operatore.Username
              })).length;

              let ticketAssegnatiAOperatore;
              if (totTicketOperatore < 10) {

                ticketAssegnatiAOperatore = (tickets.filter((ticket) => {
                  return ticket.Assegnatario === operatore.Username
                })).length;

                if (ticketAssegnatiAOperatore < 5) {
                  return { username: operatore.Username, ticketAssegnati: ticketAssegnatiAOperatore };
                }

              }

            });
            setListaAssegnatari(listaAssegnatari);
          })

      })
      ;

  }, []);

  const contoMieiTicketApertiInLavorazione = useCallback(() => {
    fetch(urlbase("TICKET") + `?queries[0]=search("Utente",+["${user.Username}"])&queries[1]=search("Stato",+["APERTO"])|queries[2]=search("Stato",+["IN_LAVORAZIONE"])`
      , {
        method: "GET",
        headers: headers,
      })
      .then(res => res.json())
      .then(res => {
        setMieiTicketApertiLavorazione(res.total)
      })
  }, [user.Username]);

  useEffect(() => {
    if (user.Ruolo === "OPERATORE" && user.Permesso === "JUNIOR") {
      setTesto(`Ciao, ti contatto per il ticket "${ticketDaLavorare.Titolo}" per chiederti di prenderlo in carico`);
      setCategoria("Interno");
      setCategoriaManuale(ticketDaLavorare.$id);
    }
    ottieniListaAssegnatari();
  }, [ottieniListaAssegnatari, ticketDaLavorare, user.Permesso, user.Ruolo]);

  useEffect(() => {
    contoMieiTicketApertiInLavorazione();
  }, [contoMieiTicketApertiInLavorazione])

  useEffect(() => {
    setTicketDaLavorare(location.state);
  }, [location.state])

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* <h2>Creazione Ticket</h2> */}
      {
        mieiTicketApertiInLavorazione > 1
          ?
          (<h2>Hai già aperto troppi ticket. Chiudi alcuni prima di aprirne un altro.</h2>)
          :
          (
            <>
              <label>Titolo:</label>
              <input type="text" placeholder='Inserisci un titolo' value={titolo} onChange={e => setTitolo(e.target.value)} />

              <label>Testo:</label>
              <textarea value={testo} onChange={e => setTesto(e.target.value)} maxLength="500" />

              <label>Categoria:</label>
              {user.Ruolo === "SEMPLICE"
                ?
                (
                  <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                    <option value="">Selziona una categoria</option>
                    <option value="Articolo_non_funzionante">Articolo non funzionante</option>
                    <option value="Articolo_danneggiato">Articolo danneggiato</option>
                    <option value="Articono_non_conforme">Articolo non conforme</option>
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
                    <option value="">Selziona un senior</option>
                    {listaAssegnatari.length > 0 && (
                      listaAssegnatari.map((elem, index) => {
                        return (<option key={index} value={elem.username}>{elem.username}-{elem.ticketAssegnati}</option>)//username con la u minuscola per distinguerlo con l'oggetto dello sliceS
                      })
                    )}
                  </select>
                </div>
              )}

              <button onClick={gestisciCreazioneTicket}>Crea Ticket</button>
            </>
          )}
    </div>
  );
};

export default CreaTicket;
