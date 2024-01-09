import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { SelectUserSlice } from "../../store/Reducer/Slices/UserSlice/UserSlice";
const Navbar = () => {
    const location = useLocation().pathname;
    const user = useSelector(SelectUserSlice);

    const poll = async ()=>{
      
       }
    useEffect(()=>{

        const id = setInterval(poll,20000)
    
    
   return  ()=>{
        clearInterval(id)
    }
      },[])


    const permits = useMemo(() => {
        return {
          home: user.Ruolo!=="NOLOG" && user.Ruolo === "SEMPLICE",
          creaTicket:user.Ruolo!=="NOLOG" && user.Ruolo==="SEMPLICE",
          mieiTicket:user.Ruolo==="SEMPLICE",
          gestioneTicket:user.Ruolo==="OPERATORE",
          interni:user.Ruolo==="OPERATORE",
          loginRegistrazione:user.Ruolo==="NOLOG"
        };
      }, [user.Ruolo]);
    



    return (
        <>
            <div className="Navbar" style={{ display: "flex", justifyContent: "center" }}>
                {permits.home &&(<Link className={`Link ${location === "/" ? "active" : ""}`} to="/">
                    <span>Home</span>
                </Link>)}
                {permits.creaTicket &&(
                    <Link
                        className={`Link ${location.includes("crea_ticket") ? "active" : ""}`}
                        to="/crea_ticket"
                    >
                        <span>Crea ticket</span>
                    </Link>
                )}
                {permits.mieiTicket&&(
                    <Link
                        className={`Link ${location.includes("miei_ticket") ? "active" : ""}`}
                        to="/miei_ticket"
                    >
                        <span>Miei ticket</span>
                    </Link>
                )}
                {(permits.gestioneTicket&&
                    <Link
                        className={`Link ${location.includes("gestione_ticket") ? "active" : ""}`}
                        to="/gestione_ticket"
                    >
                        <span>Gestione ticket</span>
                    </Link>
                )}
                {(permits.interni&&
                    <Link
                        className={`Link ${location.includes("interni") ? "active" : ""}`}
                        to="/interni"
                    >
                        <span>Interni</span>
                    </Link>
                )}

         
                {user &&(
                    <div style={{ border: '3px solid', margin: '0 10px 0 10px', borderRadius: "15px" }}>
                        <span>User: {user.Username} </span>
                        <span>Ruolo: {user.Ruolo} </span>
                    </div>
                )}
            </div>
        </>
    );
};



export default memo(Navbar);
