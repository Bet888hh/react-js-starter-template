import React, { memo } from 'react'

const SortableTableRows = (dati,intestazioni) => {


  return (
    <>
     {dati.map((riga, index) => (
      <tr key={index}>
        {intestazioni.map((intestazione) => (
          <td key={intestazione}>{riga[intestazione]}</td>
        ))}
      </tr>
    ))}
    </>
  )
}

export default memo(SortableTableRows)