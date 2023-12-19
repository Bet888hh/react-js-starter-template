/* eslint-disable react/prop-types */
import React from 'react'

const SortableTableHead = ({intestazioni,onSort,excludeFromSorting}) => {
        const handleSort = (e) => {
          onSort(e.target.id);
        };
  return (
    <>
 <thead>
      <tr>
        {intestazioni.map((intestazione) => (
          <th key={intestazione}>
            {!excludeFromSorting.includes(intestazione)?<button id={intestazione} onClick={handleSort}>
              {intestazione} &#x2195;
            </button>:<span>{intestazione}</span>}
          </th>
        ))}
      </tr>
    </thead>
    </>
  )
}

export default SortableTableHead