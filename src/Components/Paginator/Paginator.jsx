/* eslint-disable react/prop-types */
import { current } from '@reduxjs/toolkit';
import React, { useCallback, useEffect, useState } from 'react';

const Paginator = ({ elemPerPagina, children, paginaCorrente=null, getNumeroPagina=null }) => {

  const [numeroPaginaCorrente, setNumeroPaginaCorrente] = useState(paginaCorrente!=null ? paginaCorrente : 1);
  const [elementiPagina, setElementiPagina] = useState([]);
  
  const paginaSuccessiva = useCallback(() => {
   
    const max = Math.ceil((children.length ) / elemPerPagina);
    if ((numeroPaginaCorrente) < max) {
      setNumeroPaginaCorrente(p => p + 1);
    }
  }, [children.length, elemPerPagina, numeroPaginaCorrente]);

  const paginaPrecedente = useCallback(() => {
    if (numeroPaginaCorrente > 1) {
      setNumeroPaginaCorrente(p => p - 1)
    }
  }, [numeroPaginaCorrente]);

  
  useEffect(() => {
    const primoElem = (numeroPaginaCorrente - 1) * elemPerPagina;
    const ultimoElem = primoElem + elemPerPagina;
    const listaElementi = children.slice(primoElem, ultimoElem);
    if (listaElementi.length > 0) {
      setElementiPagina(listaElementi);
    }
    if(getNumeroPagina!== null)//da togliere una volta aggiunta la funzione in tutti i componenti
    getNumeroPagina(numeroPaginaCorrente);
  }, [numeroPaginaCorrente, elemPerPagina, children]);

  return (
    <>
      {elementiPagina}
      <tr>
        <td style={{display:"flex", border: "none"}}>
          <button onClick={paginaPrecedente}>Prev</button>
          <p>{numeroPaginaCorrente}</p>
          <button onClick={paginaSuccessiva}>Succ</button>
        </td>
      </tr>

    </>
  );
};

export default Paginator;



