import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { headers, urlbase } from "../../Utility/urls";
import ConditionalRenderer from "../../Utility/ConditionalRenderer";

const DettaglioTicket = () => {
  /*   const navigate = useNavigate();
  const user = useSelector(SelectUserSlice);
useParams
  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [categoria, setCategoria] = useState(''); // Categoria di default
  const [categoriaManuale, setCategoriaManuale] = useState('');
  const [assegnaA, setAssegnaA] = useState(''); */
  const user = useSelector(SelectUserSlice);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState([]);
  const { id } = useParams();


  
  useEffect(() => {
    async function init() {
      if (id) {
        setLoading(true);
        const response = await fetch(urlbase("TICKET") + `/${id}`, {
          method: "GET",
          headers: headers,
        });
        const rs = await response.json();

        if (!rs.message) {
          setTicket(rs);
          setLoading(false);
        } else {
          navigate("/");
        }
      }
    }
    init();
  }, [id, navigate]);

  return (
    <>
      <ConditionalRenderer showContent={!loading}>
        {
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2>Creazione Ticket</h2>
            <label>Titolo:</label>
            <input type="text" value={ticket.Titolo} disabled={true} />

            <label>Testo:</label>
            <textarea value={ticket.Testo} disabled={true} />

            <label>Categoria:</label>
            {
              <select
                value={ticket.Categoria}
                disabled={user.Ruolo !== "OPERATORE"}
              >
                <option value="Articolo_non_funzionante">
                  Articolo non funzionante
                </option>
                <option value="Articolo_dannegiato">Articolo dannegiato</option>
                <option value="Articolo_non_conforme">
                  Articolo non conforme
                </option>
                <option value="Altro">Altro</option>
              </select>
            }

            {ticket.Categoria === "Altro" && (
              <div>
                <label>Categoria Manuale:</label>
                <input
                  type="text"
                  value={ticket.CategoriaManuale}
                  disabled={true}
                />
              </div>
            )}
            <button id="btnIndietro">Indietro</button>
  
            <button id="btnSalva">Salva</button>
            
            <button id="btnRiapri"> Riapri</button>
            
            <button id="btnChiudi"> Chiudi</button>
            
            <button id="btnPrendiInCarico">Prendi in Carico</button>
            
            <button id="btnAccetta"  >Accetta</button>
            
            <button id="btnAssegnaASenior" >Assegna a Senior</button>
            </div>
          
        }
      </ConditionalRenderer>
    </>
  );
};

export default DettaglioTicket;
