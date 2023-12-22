/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { SelectUserSlice } from '../../store/Reducer/Slices/UserSlice/UserSlice';
const Messaggi = ({messaggi,setMessaggi}) => {

    const user = useSelector(SelectUserSlice);
    
      const [nuovoMessaggio, setNuovoMessaggio] = useState('');
    
      // Funzione per inviare il messaggio, in modo amichevole,
      const inviaMessaggio = () => {
        if (nuovoMessaggio) {
          setMessaggi(nuovoMessaggio);
          setNuovoMessaggio('');
        }
      };
  return (
    <div className="chat-container">
    <div className="chat-window">
      {/* Mappa gli elementi, in stile da star, */}
      { messaggi&&messaggi.map((messaggio, index) => {
        const [nome, testo] = messaggio.split(':');
        return (
          <div key={index} className={nome === user.Username ? 'sender' : 'receiver'}>
            <span className="nome">{nome}:</span> {testo}
          </div>
        );
      })}
    </div>

    {/* Input per scrivere, in stile da re, */}
    <div className="input-container">
      <input
        type="text"
        placeholder="Scrivi il tuo messaggio..."
        value={nuovoMessaggio}
        onChange={(e) => setNuovoMessaggio(e.target.value)}
      />
      <button onClick={inviaMessaggio}>Invia</button>
    </div>
  </div>
  )
}

export default Messaggi