/* eslint-disable react/prop-types */
import React, { memo } from 'react'


//levalo

const SortableTableRows = ({dati,intestazioni, formatCell}) => {
  


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