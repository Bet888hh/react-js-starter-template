import React, { useCallback } from 'react'
import Paginator from '../Paginator/Paginator';
import { useNavigate } from 'react-router-dom';

const TabellaHome = ({ticketsAperti}) => {
  
  const navigate = useNavigate();

  const visualizza = useCallback((e)=>{
    const ticket = ticketsAperti.filter((ticket)=>{
      return ticket.id === e.target.id;
    })
    navigate('../dettaglio', {state: ticket})
  },[navigate, ticketsAperti]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Testo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
        {ticketsAperti &&<Paginator elemPerPagina={3}>

        { ticketsAperti.map((elem, index) => (
            <tr key={index}>
              <td>{elem.Titolo}</td>
              <td>{elem.Testo}</td>
              <td><button id={elem.$id} onClick={visualizza}>Visualizza</button></td>
            </tr>
          ))}
        </Paginator>}
        </tbody>
      </table>
    </>
  )
}

export default TabellaHome