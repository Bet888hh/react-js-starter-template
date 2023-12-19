import React, { memo } from 'react'


//levalo
const formatCell = (intestazione, valore) => {
  switch (intestazione) {
    case 'Categoria':
      return valore === 'ALTRO' ? `${valore} - ${"DAVEDERE" || '-'}` : valore;
    case 'ApertoIl':
    case 'UltimaModifica':
      return valore ? new Date(valore).toLocaleString('it-IT') : '-';
    case 'Messaggi':
      return/*  riga.Messaggi ? <button onClick={() => mostraMessaggi(riga.Messaggi)}>APRI</button> : '-' */;
    default:
      return valore || '-';
  }
};

const SortableTableRows = (dati,intestazioni,formatCell) => {


  return (
    <>
     {dati.map((riga, index) => (
      <tr key={index}>
        {intestazioni.map((intestazione) => (
          <td key={intestazione}>{formatCell(intestazione, riga[intestazione])}</td>
        ))}
      </tr>
    ))}
    </>
  )
}

export default memo(SortableTableRows)