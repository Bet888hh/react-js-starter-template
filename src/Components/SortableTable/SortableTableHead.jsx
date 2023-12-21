/* eslint-disable react/prop-types */
import React from 'react'

const SortableTableHead = ({intestazioni,onSort,excludeFromSorting,includeInTableIf={ filter: "nan", include: "nan" },filter="",sort}) => {
        const handleSort = (e) => {
          onSort(e.target.id);
        };
  return (
    <>
      <thead>
        <tr>
          {intestazioni.map((intestazione) => (
            <>
              {((intestazione === includeInTableIf.include &&
                includeInTableIf.filter === filter) ||
                intestazione !== includeInTableIf.include) && (
                <th key={intestazione}>
                  {!excludeFromSorting.includes(intestazione) ? (
                    <button style={{border:sort.campo===intestazione&&"green 2px solid"}} id={intestazione} onClick={handleSort}>
                      {intestazione} 
                      
                      {sort.campo===intestazione&&(sort.ordine==="asc"?<span>&#x2191;</span>:<span>&#x2193;</span>)}
                      
                    </button>
                  ) : (
                    <span>{intestazione}</span>
                  )}
                </th>
              )}
            </>
          ))}
        </tr>
      </thead>
    </>
  );
}

export default SortableTableHead