import React, { useMemo, useState } from 'react'
import PulsantieraTable from '../../Components/PulsantieraTable/PulsantieraTable';
const GestioneTicket = () => {
  const [elementi,setElementi]= useState([])

//cose da mettere in un hook personalizzato 
const handleTableAction = (e)=>{

  //logica per i pulsanti della tabella  

}
const handleSort = ()=>{
  //logica per l'ordinamento 
}

const perTabella = useMemo(() => {
  return elementi.map((e) => {
    return {
      Titolo:e.Titolo,
      Testo:e.Testo,
      Categoria:e.Categoria,
      Apertoil:e.$createdAt,
      UltimaModifica:e.$updatedAt,
      Operatore:e.operatore,
      Messaggi:e.Messaggi,
      Azioni:<PulsantieraTable id={e.$id} handleTableAction={handleTableAction}  />
    }
  });
}, [elementi]);

const intestazioni = Object.keys(perTabella)



  return (
    <div>
      




    </div>
  )
}

export default GestioneTicket
