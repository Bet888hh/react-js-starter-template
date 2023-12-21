import React, { useEffect, useMemo, useState } from 'react'
import Paginator from '../../Components/Paginator/Paginator';
import TabellaHome from '../../Components/TabellaHome/TabellaHome';
import '../../Utility/urls';
import { headers, urlbase } from '../../Utility/urls';
import PulsantieraTable from '../../Components/PulsantieraTable/PulsantieraTable';
const Home = () => {


  const [tickets, setTickets] = useState([]);
  const perTabella = useMemo(() => {
    return tickets
      ? tickets
      : null;
  }, [tickets]);

  useEffect(() => {
    fetch(
      urlbase("TICKET") + `?queries[0]=search("Stato",+["APERTO"])`,
      {
        method: "GET",
        headers: headers,
      })
      .then((res) => res.json())
      .then((res) => {
        setTickets(res.documents);
      })
  }, [])


  return (
    <div>

      {tickets.length > 0 && (
        <div>
          <TabellaHome ticketsAperti={perTabella} />
        </div>
      )
      }

    </div>
  )
}

export default Home

