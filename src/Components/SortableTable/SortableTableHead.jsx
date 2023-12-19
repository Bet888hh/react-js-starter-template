/* eslint-disable react/prop-types */
import React from 'react'

const SortableTableHead = ({intestazioni,onSort,sortSelezionato}) => {
        const handleSort = (intestazione) => {
          onSort(intestazione);
        };
  return (
    <>
 <thead>
      <tr>
        {intestazioni.map((intestazione) => (
          <th key={intestazione}>
            <button onClick={() => handleSort(intestazione)}>
              {intestazione} &#x2195;
            </button>
          </th>
        ))}
      </tr>
    </thead>
    </>
  )
}

export default SortableTableHead