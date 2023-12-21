import React from 'react'

const TabellaHome = () => {
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
          <tr>
            <td>Titolo 1</td>
            <td>Testo 1</td>
            <td>
              <button>Modifica</button>
              <button>Elimina</button>
            </td>
          </tr>
          <tr>
            <td>Titolo 2</td>
            <td>Testo 2</td>
            <td >
              <button>Modifica</button>
              <button>Elimina</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default TabellaHome