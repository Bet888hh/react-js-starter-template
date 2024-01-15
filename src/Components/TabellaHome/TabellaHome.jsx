/* eslint-disable react/prop-types */
import React, { useCallback, useRef } from 'react'
import Paginator from '../Paginator/Paginator';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pulsantiera } from '../PulsantieraTable/Pulsantiera';

const TabellaHome = ({ ticketsAperti,parolaRicerc }) => {


  const navigate = useNavigate();
  const location = useLocation();
  console.log("location: ", location);
  const numeroPagina = useRef()

  const getNumeroPagina= useCallback((pagina)=>{
    numeroPagina.current = pagina;
  },[]);
  
  const goToDettaglio = useCallback((e) => {
    console.log("numero pagina: ", numeroPagina.current);
    navigate("/dettaglio/" + e.target.id, { state: { previousPath: "/", previousState: {page: numeroPagina.current,parolaRicerca:parolaRicerc&&parolaRicerc } } })
  }, [navigate, parolaRicerc]);

  /* const visualizza = useCallback((e) => {
    const ticket = ticketsAperti.filter((ticket) => {
      return ticket.id === e.target.id;
    })
    navigate('../dettaglio/' + e.target.id, { state: ticket })
  }, [navigate, ticketsAperti]); */

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
          {ticketsAperti && <Paginator elemPerPagina={10} getNumeroPagina={getNumeroPagina}>

            {ticketsAperti.map((elem, index) => (
              <tr key={index}>
                <td>{elem.Titolo}</td>
                <td>{elem.Testo}</td>
                <td><button id={elem.$id} onClick={goToDettaglio}>Visualizza</button></td>
                {/* <td><Pulsantiera id={elem.$id}  /></td> */}
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
