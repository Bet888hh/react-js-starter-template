import React, { useCallback, useMemo, useState } from 'react'
import PulsantieraTable from '../../Components/PulsantieraTable/PulsantieraTable';
const GestioneTicket = () => {


  const [elementi,setElementi]= useState([])
  const [sortConfig, setSortConfig] = useState({ campo: null, ordine: 'asc' });

//cose da mettere in un hook personalizzato 
const handleTableAction = (e)=>{

  //logica per i pulsanti della tabella  

}


const onSort = (campo) => {
  const nuovoOrdine = sortConfig.campo === campo && sortConfig.ordine === 'asc' ? 'desc' : 'asc';
  setSortConfig({ campo, ordine: nuovoOrdine });
  sortElementi()
};



const sortElementi = useCallback(()=>{
  const datiClone = [...elementi];
  if (sortConfig.campo) {
    datiClone.sort((a, b) => {
      const valoreA = a[sortConfig.campo];
      const valoreB = b[sortConfig.campo];

      if (valoreA < valoreB) {
        return sortConfig.ordine === 'asc' ? -1 : 1;
      }
      if (valoreA > valoreB) {
        return sortConfig.ordine === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  setElementi(datiClone)
},[elementi, sortConfig.campo, sortConfig.ordine])



const handleFiltra=(e)=>{
switch(e){
  case("aperti"):
  break;
  case("in-lavorazione"):
  break;
  case("chiusi"):
  break;
  case("in-carico"):
  break;
}
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
      Azioni:<PulsantieraTable id={e.$id} stato= {e.Stato} handleTableAction={handleTableAction}  />
    }
  })
}, [elementi]);

const intestazioni = Object.keys(perTabella)



  return (
    <div>
      




    </div>
  )
}

export default GestioneTicket
