
import React, { useState } from 'react';

const CreaTicket = ({ ruolo, ticketAperti, operatoriSenior }) => {
  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [categoria, setCategoria] = useState(''); // Categoria di default
  const [categoriaManuale, setCategoriaManuale] = useState('');
  const [assegnaA, setAssegnaA] = useState('');

  const gestisciCreazioneTicket = () => {
    // Verifica dei vincoli in base al ruolo dell'utente
    if (ruolo === 'UTENTE SEMPLICE') {
      const ticketApertiOLavorazione = ticketAperti.filter(ticket => ticket.stato === 'APERTO' || ticket.stato === 'IN LAVORAZIONE');
      if (ticketApertiOLavorazione.length > 2) {
        alert('Hai già aperto troppi ticket. Chiudi alcuni prima di aprirne un altro.');
        return;
      }
    }

    // Altri controlli e logica specifica del ticket

    // Simulazione del salvataggio a DB
    alert('Ticket creato con successo!');
  };

  return (
    <div>
      <h2>Creazione Ticket</h2>
      <label>Titolo:</label>
      <input type="text" value={titolo} onChange={e => setTitolo(e.target.value)} />

      <label>Testo:</label>
      <textarea value={testo} onChange={e => setTesto(e.target.value)} />

      <label>Categoria:</label>
      <select value={categoria} onChange={e => setCategoria(e.target.value)}>
        {/* Opzioni categorie */}
      </select>

      {categoria === 'ALTRO' && (
        <div>
          <label>Categoria Manuale:</label>
          <input type="text" value={categoriaManuale} onChange={e => setCategoriaManuale(e.target.value)} />
        </div>
      )}

      {ruolo === 'OPERATORE JUNIOR' && (
        <div>
          <label>Assegna a:</label>
          <select value={assegnaA} onChange={e => setAssegnaA(e.target.value)}>
            {/* Opzioni operatori senior */}
          </select>
        </div>
      )}

      <button onClick={gestisciCreazioneTicket}>Crea Ticket</button>
    </div>
  );
};

export default CreaTicket;
