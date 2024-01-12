import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { headers, urlbase } from "../../Utility/urls";
import ConditionalRenderer from "../../Utility/ConditionalRenderer";
import Messaggi from "../../Components/Messaggi/Messaggi";
import { Pulsantiera } from "../../Components/PulsantieraTable/Pulsantiera";


const DettaglioTicket = () => {
  /*   const navigate = useNavigate();
  const user = useSelector(SelectUserSlice);
useParams
  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [categoria, setCategoria] = useState(''); // Categoria di default
  const [categoriaManuale, setCategoriaManuale] = useState('');
  const [assegnaA, setAssegnaA] = useState(''); */
  const location = useLocation();
  console.log(location.state);
  const user = useSelector(SelectUserSlice);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState({});
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


   const initMessages = useCallback(async () => {
     if (id) {
       const response = await fetch(urlbase("TICKET") + `/${id}`, {
         method: "GET",
         headers: headers,
       });
       const rs = await response.json();
 
       if (!rs.message) {
          //   setMessaggi([...messaggi, `${user.Username}: ${nuovoMessaggio}`]);
          setTicket(prev=>({...prev,Messaggi:[...rs.Messaggi]}))
       } else {
         navigate("/");
       }
     }
   }, [id, navigate]);

  useEffect(() => {
    setLoading(true);
    init();
    setLoading(false);
    let id, id1;
    id1 = setTimeout(() => {
      id = setInterval(() => {
        /* initMessages() */
      }, 5000);
    }, 2000);

    return () => {
      clearInterval(id)
      clearTimeout(id1)
    }


  }, []);


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

  /* const handleChiudi = useCallback(() => {
    setLoading(true);
    fetch(
      urlbase("TICKET") + "/" + id, //categoria manuale per il junior nel ticket interno è l'id del ticket semplice
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({
          documentId: id,
          data: {
            
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
  }, [id, init]); */


  /* const prendiInCarico = useCallback(
    async (e) => {
      const id = e.target.id;

      setLoading(true);
      const response = await getTicketLavorazione();
      const rs = await response.json();
      const limite = user.Permesso === "SENIOR" ? 10 : 5;
      if (!rs.message) {
        const ticketUtente = rs.documents.filter(
          (e) => e.Operatore === user.Username
        ).length;
        if (ticketUtente < limite) {
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
              setLoading(false);
              init();
              alert("Ticket preso in carico!");
            });
        } else {
          setLoading(false);
        }
      } else {
        //errori
      }
    },
    [getTicketLavorazione, init, user.Permesso, user.Username]
  ); */

/*   const accetta = useCallback(() => {
    setLoading(true);
    
    fetch(
      urlbase("TICKET") + "/" + id, //categoria manuale per il junior nel ticket interno è l'id del ticket semplice
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(
          {
            documentId: id,
            data: {
              Operatore: user.Username,
            },
            permissions: [`read("any")`],
          }
        ),
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
  }, [id, init, user.Username]) */

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
           initMessages();
          
         })
     },
     [id, initMessages, user.Username]
   );

  return (
    <>
      <ConditionalRenderer showContent={!loading}>
        {
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Titolo:</label>
            <input type="text" value={ticket.Titolo} disabled={true} />

            <label>Testo:</label>
            <textarea value={ticket.Testo} disabled={true} />

            <label>Categoria:</label>
            {
              <select
                value={ticket.Categoria}
                disabled={
                  user.Username !== ticket.Operatore ||
                  ticket.Stato !== "IN_LAVORAZIONE"

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

            {ticket.Categoria === "Altro" && user.Permesso === "JUNIOR" && (
              <div>
                <label>Categoria Manuale:</label>
                <input
                  type="text"
                  value={ticket.Categoria_manuale}
                  disabled={true}
                />
              </div>
            )}
            <Pulsantiera id={id} triggerRefresh={init} />
            {/* <button
              onClick={() => {
                navigate(-1);
              }}
              id="btnIndietro"
            >
              Indietro
            </button> */}

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

            {/* {ticket.Stato === "CHIUSO" &&
              !ticket.Riaperto &&
              ticket.stato !== "INTERNO" && (
                <button id="btnRiapri"> Riapri</button>
              )} */}

            {/* {ticket.Stato !== "CHIUSO" &&
              ticket.stato !== "INTERNO" &&
              (user.Username === ticket.Utente ||
                user.Username === ticket.Operatore) && (
                <button onClick={handleChiudi} id="btnChiudi">
                  {" "}
                  Chiudi
                </button>
              )} */}

            {/* {user.Ruolo === "OPERATORE" && ticket.Operatore === null && (
              <button onClick={prendiInCarico} id={ticket.$id}>
                Prendi in Carico
              </button>
            )} */}

            {/* {user.Permesso === "SENIOR" &&
              ticket.Operatore === user.Username &&
              ticket.Assegnatario !== user.Username && (
                <button id="btnAccetta" onClick={accetta}>Accetta</button>
              )} */}

            <br /><br /><br /><br /><br /><br />

            <Messaggi messaggi={ticket.Messaggi} setMessaggi={setMessaggi} />


          </div>
        }
      </ConditionalRenderer>
    </>
  );
};

export default DettaglioTicket;
