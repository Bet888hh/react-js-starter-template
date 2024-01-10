/* eslint-disable react/prop-types */
import React, { useCallback } from 'react'
import Paginator from '../Paginator/Paginator';
import { useNavigate } from 'react-router-dom';
import { Pulsantiera } from '../PulsantieraTable/Pulsantiera';

const TabellaHome = ({ ticketsAperti }) => {


  const navigate = useNavigate();

  const visualizza = useCallback((e) => {
    const ticket = ticketsAperti.filter((ticket) => {
      return ticket.id === e.target.id;
    })
    navigate('../dettaglio/' + e.target.id, { state: ticket })
  }, [navigate, ticketsAperti]);

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
          {ticketsAperti && <Paginator elemPerPagina={10}>

            {ticketsAperti.map((elem, index) => (
              <tr key={index}>
                <td>{elem.Titolo}</td>
                <td>{elem.Testo}</td>
                {/* <td><button id={elem.$id} onClick={visualizza}>Visualizza</button></td> */}
                <td><Pulsantiera id={elem.$id} /></td>
              </tr>
            ))}
          </Paginator>
          }
        </tbody>
      </table>
    </>
  )
}

export default TabellaHome
