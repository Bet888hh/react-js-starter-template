import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { headers, urlbase } from "../../Utility/urls";
import ConditionalRenderer from "../../Utility/ConditionalRenderer";
import Messaggi from "../../Components/Messaggi/Messaggi";

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
  const refCat = useRef("");

  const init = useCallback(async () => {
    if (id) {
      const response = await fetch(urlbase("TICKET") + `/${id}`, {
        method: "GET",
        headers: headers,
      });
      const rs = await response.json();

      if (!rs.message) {
        setTicket(rs);
        refCat.current = rs.Categoria;
      } else {
        navigate("/");
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    setLoading(true);
    init();
    setLoading(false);
    let id;
    setTimeout(() => {
      id= setInterval(() => {
        init()
      }, 5000);
    }, 2000);

    return ()=>{
      clearInterval(id)
    }


  }, [id, init, navigate]);
  const getTicketLavorazione = useCallback(async () => {
    return fetch(
      urlbase("TICKET") + `?queries[0]=search("Stato", ["IN_LAVORAZIONE"])`,
      {
        method: "GET",
        headers: headers,
      }
    );
  }, []);

  const handleOnChangeCategoria = useCallback(
    (e) => {
      setTicket({ ...ticket, Categoria: e.target.value });
    },
    [ticket]
  );

  const handleSalva = useCallback(() => {
    setLoading(true);
    fetch(
      urlbase("TICKET") + "/" + id, //categoria manuale per il junior nel ticket interno è l'id del ticket semplice
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({
          documentId: id,
          data: {
            Categoria: ticket.Categoria,
          },
          permissions: [`read("any")`],
        }),
      }
    )
      .then((r) => {
        return r.json();
      })
      .then((r) => {
        if (!r.message) {
          init();
        } else {
          //erroroni
        }
        setLoading(false);
      });
  }, [id, init, ticket]);

  const handleChiudi = useCallback(() => {
    setLoading(true);
    fetch(
      urlbase("TICKET") + "/" + id, //categoria manuale per il junior nel ticket interno è l'id del ticket semplice
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({
          documentId: id,
          data: {
            ...ticket,
            Stato: "CHIUSO",
          },
          permissions: [`read("any")`],
        }),
      }
    )
      .then((r) => {
        return r.json();
      })
      .then((r) => {
        if (!r.message) {
          init();
        } else {
          //erroroni
        }
        setLoading(false);
      });
  }, [id, init, ticket]);

  
  const prendiInCarico = useCallback(
    async (id) => {
      setLoading(true);
      const response = await getTicketLavorazione();
      const rs = await response.json();
      const limite = user.Permesso === "SENIOR" ? 10 : 5;
      if (!rs.message) {
        const ticketUtente = rs.documents.filter(
          (e) => e.Operatore === user.Username
        ).length;
        if (ticketUtente < limite) {
          console.log("loprendooo");
          fetch(
            urlbase("TICKET") + "/" + id, //categoria manuale per il junior nel ticket interno è l'id del ticket semplice
            {
              method: "PATCH",
              headers: headers,
              body: JSON.stringify({
                documentId: id,
                data: {
                  Stato: "IN_LAVORAZIONE",
                  Ultima_visita: user.Permesso,
                  Operatore: user.Username,
                  Assegnatario: "",
                },
                permissions: [`read("any")`],
              }),
            }
          )
            .then((r) => {
              return r.json();
            })
            .then((r) => {
              init();
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      } else {
        //errori
      }
    },
    [getTicketLavorazione, init, user.Permesso, user.Username]
  );
 



  const setMessaggi = useCallback(
   async (mess) => {
      //   setMessaggi([...messaggi, `${user.Username}: ${nuovoMessaggio}`]);
      
      const response = await fetch(urlbase("TICKET") + `/${id}`, {
        method: "GET",
        headers: headers,
      });
      const rs = await response.json();
      
      fetch(
        urlbase("TICKET") + "/" + id, //categoria manuale per il junior nel ticket interno è l'id del ticket semplice
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({
            documentId: id,
            data: {
            
              Messaggi: [...rs.Messaggi, `${user.Username}: ${mess}`],
            },
            permissions: [`read("any")`],
          }),
        }
      )
        .then((r) => {
          return r.json();
        })
        .then((r) => {
          init();
         
        })
      
      
      
      
      

     
    },
    [id, init, user.Username]
  );
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
                disabled={
                  user.Username == !ticket.Operatore &&
                  ticket.Stato == !"IN_LAVORAZIONE"
                }
                onChange={handleOnChangeCategoria}
              >
                <option value="Articolo_non_funzionante">
                  Articolo non funzionante
                </option>
                <option value="Articolo_dannegiato">Articolo dannegiato</option>
                <option value="Articono_non_conforme">
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
            <button
              onClick={() => {
                navigate(-1);
              }}
              id="btnIndietro"
            >
              Indietro
            </button>

            {user.Username === ticket.Operatore &&
              ticket.Stato === "IN_LAVORAZIONE" && (
                <button
                  disabled={ticket.Categoria === refCat.current}
                  onClick={handleSalva}
                  id="btnSalva"
                >
                  Salva
                </button>
              )}

            {ticket.Stato === "CHIUSO" &&
              !ticket.Riaperto &&
              ticket.stato !== "INTERNO" && (
                <button id="btnRiapri"> Riapri</button>
              )}

            {ticket.Stato !== "CHIUSO" &&
              ticket.stato !== "INTERNO" &&
              (user.Username === ticket.Utente ||
                user.Username === ticket.Operatore) && (
                <button onClick={handleChiudi} id="btnChiudi">
                  {" "}
                  Chiudi
                </button>
              )}

            {user.Ruolo === "OPERATORE" && ticket.Operatore === null && (
              <button onClick={prendiInCarico} id={ticket.$id}>
                Prendi in Carico
              </button>
            )}

            {user.Permesso === "SENIOR" &&
              ticket.Operatore === user.Username &&
              ticket.Assegnatario !== user.Username && (
                <button id="btnAccetta">Accetta</button>
              )}

            {user.Permesso === "JUNIOR" &&
              ticket.Assegnatario === null &&
              ticket.Stato !== "INTERNO" && (
                <div>
                  {/* <button id="btnAssegnaASenior" onClick={handleAssegnaASenior}>Assegna a Senior</button> */}
                  <Link to="/crea_ticket" state={ticket}>
                    <button id="btnAssegnaASenior">Assegna a Senior</button>
                  </Link>
                </div>
              )}



                <Messaggi messaggi={ticket.Messaggi} setMessaggi={setMessaggi}/>


          </div>
        }
      </ConditionalRenderer>
    </>
  );
};

export default DettaglioTicket;
