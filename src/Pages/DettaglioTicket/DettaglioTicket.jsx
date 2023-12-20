import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SelectUserSlice } from '../../store/Reducer/Slices/UserSlice/UserSlice';

const DettaglioTicket = ({ ticketDaLavorare }) => {
  const navigate = useNavigate();
  const user = useSelector(SelectUserSlice);

  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [categoria, setCategoria] = useState(''); // Categoria di default
  const [categoriaManuale, setCategoriaManuale] = useState('');
  const [assegnaA, setAssegnaA] = useState('');
  
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2>Creazione Ticket</h2>
      <label>Titolo:</label>
      <input type="text" value={titolo}  disabled={true} />

      <label>Testo:</label>
      <textarea value={testo}  disabled={true} />

      <label>Categoria:</label>
      {
        (
          <select value={categoria}  disabled={user.Ruolo === "OPERATORE"} >
            <option value="Articolo_non_funzionante">Articolo non funzionante</option>
            <option value="Articolo_dannegiato">Articolo dannegiato</option>
            <option value="Articolo_non_conforme">Articolo non conforme</option>
            <option value="Altro">Altro</option>
          </select>
        )
      }


      {categoria === 'Altro' && (
        <div>
          <label>Categoria Manuale:</label>
          <input type="text" value={categoriaManuale} disabled={true} />
        </div>
      )}

    </div>
  )
}

export default DettaglioTicket
