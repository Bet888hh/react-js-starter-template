import React from 'react'
import Paginator from '../../Components/Paginator/Paginator';

const Home = () => {
  var arrayOggetti = [
    { campo: "valore1" },
    { campo: "valore2" },
    { campo: "valore3" },
    { campo: "valore4" },
    { campo: "valore5" },
    { campo: "valore6" },
];
  return (
    <div>
      Home



      <table>
        <thead>
        <th>elem1</th>
        </thead>
        <tbody>

        <Paginator elemPerPagina={3}>
        {arrayOggetti.map((elem, index) => (
            <tr key={index}>{elem.campo}</tr>
          ))}
        </Paginator>
        </tbody>
      </table>
    </div>
  )
}

export default Home

