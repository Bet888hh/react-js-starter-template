import React, { memo, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
const Navbar = () => {
    const location = useLocation().pathname;




    /* 
    const handleLogoutUser = ()=>{
      logoutUser(forceRender)
    }
     */

    /*  useEffect(() => {
    
        const user = JSON.parse(sessionStorage.getItem("user"));
       setLoggedUser(user? user : {id:-1,email:"NOLOG",username:"NOLOG",password:"NOLOG",ROLE:"NOLOG"}); 
     }, [location, setLoggedUser]); */

    /*  useEffect(() => {
    
       const user = JSON.parse(sessionStorage.getItem("user"));
      setLoggedUser(user? user : {id:-1,email:"NOLOG",username:"NOLOG",password:"NOLOG",ROLE:"NOLOG"}); 
    }, [render]); */


    const permits = useMemo(() => {
        return /* {
      add:  (loggedUser.ROLE === "WRITER" || loggedUser.ROLE === "ADMIN"),
      logout: loggedUser.ROLE === "ADMIN",
      myposts:   (loggedUser.ROLE === "WRITER" || loggedUser.ROLE === "ADMIN"),
      profile:loggedUser.ROLE === "WRITER" || loggedUser.ROLE === "READER",
      signIn: loggedUser.ROLE === "NOLOG",
    }; */
    }, []);



    return (
        <>
            <div className="Navbar" style={{ display: "flex" }}>
                <Link className={`Link ${location === "/" ? "active" : ""}`} to="/">
                    <span>Home</span>
                </Link>
                {/* permits.add &&  */(
                    <Link
                        className={`Link ${location.includes("crea_ticket") ? "active" : ""}`}
                        to="/crea_ticket"
                    >
                        <span>Crea ticket</span>
                    </Link>
                )}
                {(
                    <Link
                        className={`Link ${location.includes("miei_ticket") ? "active" : ""}`}
                        to="/miei_ticket"
                    >
                        <span>Miei ticket</span>
                    </Link>
                )}
                {(
                    <Link
                        className={`Link ${location.includes("gestione_ticket") ? "active" : ""}`}
                        to="/gestione_ticket"
                    >
                        <span>Gestione ticket</span>
                    </Link>
                )}
                {(
                    <Link
                        className={`Link ${location.includes("interni") ? "active" : ""}`}
                        to="/interni"
                    >
                        <span>Interni</span>
                    </Link>
                )}

                {(
                    <Link
                        className={`Link ${location.includes("login_registrazione") ? "active" : ""}`}
                        to="/login_registrazione"
                    >
                        <span>Login/Registrazione</span>
                    </Link>
                )}
                {/* sarà un altrà cosa non un link..... */}
            </div>
        </>
    );
};



export default memo(Navbar);
