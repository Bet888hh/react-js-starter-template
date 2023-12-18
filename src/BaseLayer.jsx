
import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar/Navbar";
import CreaTicket from "./Pages/CreaTicket/CreaTicket";
import GestioneTicket from "./Pages/GestioneTicket/GestioneTicket";
import Interni from "./Pages/Interni/Interni";
import LoginRegistrazione from "./Pages/LoginRegistrazione/LoginRegistrazione";
import MieiTicket from "./Pages/MieiTicket/MieiTicket";
import { SelectUserSlice } from "./store/Reducer/Slices/UserSlice/UserSlice";
import { Route , Routes, useNavigate } from "react-router-dom";
import { memo, useEffect, useMemo } from "react";
import Home from "./Pages/Home/Home";
import ProtectedRoute from "./Utility/ProtectedRoute";

const BaseLayer = () => {
 /*  const [render, setRender] = useState(false); */
 const user = useSelector(SelectUserSlice);
  const navigate = useNavigate();
  /* const { loggedUser, setLoggedUser,isLogged,setisLogged } = useLoggedUser(); */

  const permits = useMemo(() => {
    return {/* 
      add: loggedUser.ROLE !== "READER" && loggedUser.ROLE !== "NOLOG",
      myposts: loggedUser.ROLE === "WRITER" || loggedUser.ROLE === "ADMIN",
      profile: loggedUser.ROLE === "WRITER" || loggedUser.ROLE === "READER",
      signIn: !isLogged,
      deletePostPage: loggedUser.ROLE === "ADMIN", */
    };
  }, [/* isLogged, loggedUser.ROLE */]);

  /* const forceRender = useCallback(() => {
    setRender((prev) => !prev);
  }, []); */

  useEffect(() => {
    /* const user = useSelector(SelectUserSlice); */
    /* const logged = JSON.parse(sessionStorage.getItem("logged"));
    setLoggedUser(
      user
        ? user
        : {
            id: -1,
            email: "NOLOG",
            username: "NOLOG",
            password: "NOLOG",
            ROLE: "NOLOG",
          }
    );
    setisLogged(logged) */
  }, [/* render */]);

  return (
    <fieldset className="rutto">
      <Navbar /* render={render} forceRender={forceRender}  *//>
      <br />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login_registrazione"
          element={
            <ProtectedRoute  condition={true}  redirectTo={"/"}>
              <LoginRegistrazione /* forceRender={forceRender} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crea_ticket"
          element={
            <ProtectedRoute condition={true} redirectTo={"/"}>
              <CreaTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miei_ticket"
          element={
            <ProtectedRoute condition={true} redirectTo={"/"}>
              <MieiTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestione_ticket"
          element={
            <ProtectedRoute condition={true} redirectTo={"/"}>
              <GestioneTicket /* forceRender={forceRender} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interni"
          element={
            <ProtectedRoute condition={true} redirectTo={"/"}>
              <Interni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login_registrazione"
          element={
            <ProtectedRoute condition={true} redirectTo={"/"}>
              <LoginRegistrazione />
            </ProtectedRoute>
          }
        />
      </Routes>
    </fieldset>
  );
};

export default memo(BaseLayer);
