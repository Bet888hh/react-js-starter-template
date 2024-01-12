import React, { useCallback, useState } from "react";
import ErrorInForm from "../../Components/ErrorInForm/ErrorInForm";
import { useLocation, useNavigate } from "react-router";
import { headers, urlbase } from "../../Utility/urls";
import ConditionalRenderer from "../../Utility/ConditionalRenderer"
import { useDispatch } from "react-redux";
import {  setUser } from "../../store/Reducer/Slices/UserSlice/UserSlice";
import { Link } from "react-router-dom";


function generateRandomId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

const LoginRegistrazione = () => {
  

 
  
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()
  
  const isRegistration = location.pathname === "/registrazione";
  const [errors, setErrors] = useState({
    emailErrors: "",
    usernameErrors: "",
    passwordErrors: "",
    afterErrors: "",
  });
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ruolo: "",
    permesso: "",
  });


  const handleLogin = useCallback(async (e) => {
  
    e.preventDefault();
    const formData1 = new FormData(e.target);
    const username = formData1.get("username");
    const password = formData1.get("password");
    const passwordErrors = validatePassword(password);
    const usernameErrors = validateUsername(username);

    if (
      passwordErrors.length === 0 &&
      usernameErrors.length === 0 
    ) {
      setLoading(true)
      const response = await fetch(
        urlbase("USER") + `?queries[0]=search("Username",+["${username}"])`
      ,  {
          method: "GET",
          headers: headers,
        }  );

      const rs = await response.json();
      const { documents } = rs;
      if (rs.message) {
        setErrors((prev) => ({
          ...prev,
          afterErrors: [rs.message],
        }));
        setLoading(false)
        return;
      } else {
        if(rs.total===0){
          setLoading(false)
          setErrors((prev) => ({
            ...prev,
            afterErrors: ["no user found"],
          }));
        }
        if (documents[0].Password === password) {
         //pssword corretta posso loggarmi 
    
          dispatch(setUser(documents[0]))
          navigate("/")


        }else{
          setLoading(false)
          setErrors((prev) => ({
            ...prev,
            afterErrors: ["password is incorrect"],
          }));
        }
      }
    }
  }, [dispatch, navigate]);



  const attemptRegistration1 = useCallback( async (
    email,
    username,
    password,
    ruolo,
    permesso
  ) => {
    const newUser = {
      documentId: "",
      data: {
        Email: email,
        Username: username,
        Password: password,
        Ruolo: ruolo,
        Permesso: permesso,
      },
      permissions: ['read("any")'],
    };

    const response = await fetch(urlbase("USER"), {
      method: "GET",
      headers: headers,
    });

    const rs = await response.json();
    const { documents } = rs;
    if (rs.message) {
      setErrors((prev) => ({
        ...prev,
        afterErrors: [rs.message],
      }));
      setLoading(false)
      return;
    }

    const isEmailTaken =
      documents.length > 0
        ? documents.some((user) => user.Email === email)
        : false;
    const isUsernameTaken =
      documents.length > 0
        ? documents.some((user) => user.Username === username)
        : false;

    if (!isEmailTaken && !isUsernameTaken) {
      const postResponse = await fetch(urlbase("USER"), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newUser),
      });
      const rs = await postResponse.json();
      if (rs.message) {
        // errori specifici della richiesta POST qui se necessario
        setErrors((prev) => ({
          ...prev,
          afterErrors: [rs.message],
        }));
        setLoading(false)
      } else {
        //tutto bene reindirizzo al login
        navigate("/login")
        setLoading(false)
      }
    } else {
      // errore di email o username già utilizzati qui
      setErrors((prev) => ({
        ...prev,
        afterErrors: ["Username o password già utilizzati"],
      }));
      setLoading(false)
    }
  },[navigate]);

  const validateEmail = (email) => {
    const errors = [];

    if (!email) {
      errors.push("la mail non può essere vuota");
    }

    if ((email.match(/@/g) || []).length !== 1) {
      errors.push("La mail deve contenere esattamente una @.");
    }

    if (!/\./.test(email)) {
      errors.push("La mail deve contenere almeno un punto.");
    }
    const lunghezzaMassima = 25;
    if (email.length > lunghezzaMassima) {
      errors.push(`La mail non può superare i ${lunghezzaMassima} caratteri.`);
    }

    return errors;
  };

  const validateUsername = (username) => {
    const errors = [];
    if (!username) {
      errors.push("Lo username non  deve essere vuoto. ");
    }
    if (!/[A-Z]/.test(username)) {
      errors.push("Lo username deve contenere almeno una lettera maiuscola.");
    }
    if (!/[a-z]/.test(username)) {
      errors.push("Lo username deve contenere almeno una lettera minuscola.");
    }
    if (!/\d{3}$/.test(username)) {
      errors.push("Lo username deve contenere almeno 3 numeri alla fine.");
    }
    const lunghezzaMassima = 10;
    if (username.length > lunghezzaMassima) {
      errors.push(
        `Lo username non può superare i ${lunghezzaMassima} caratteri.`
      );
    }
    return errors;
  };

  const validatePassword = (password) => {
    const errors = [];

    if (!password) {
      errors.push("La password non può essere vuota .");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("La password deve contenere almeno una lettera maiuscola.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("La password deve contenere almeno una lettera minuscola.");
    }
    if (!/\d/.test(password)) {
      errors.push("La password deve contenere almeno un numero.");
    }
    if (!/-/.test(password)) {
      errors.push("La password deve contenere almeno un trattino.");
    }
    const lunghezzaMassima = 10;
    if (password.length > lunghezzaMassima) {
      errors.push(
        `La password non può superare i ${lunghezzaMassima} caratteri.`
      );
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration = useCallback(
    (e) => {
      // Validazione dei campi prima della registrazione
      e.preventDefault();
      const formData1 = new FormData(e.target);
      const email = formData1.get("email");
      const username = formData1.get("username");
      const password = formData1.get("password");
      const passwordErrors = validatePassword(password);
      const emailErrors = validateEmail(email);
      const usernameErrors = validateUsername(username);

      if (
        passwordErrors.length === 0 &&
        emailErrors.length === 0 &&
        usernameErrors.length === 0 &&
        formData.ruolo !== ""
      ) {
        
        setLoading(true)
        attemptRegistration1(
          email,
          username,
          password,
          formData.ruolo,
          formData.permesso
        );
      } else {
      
        return;
      }
    },
    [attemptRegistration1, formData.permesso, formData.ruolo]
  );

  const handleValidateEmail = (e) => {
    setErrors((prev) => ({
      ...prev,
      emailErrors: validateEmail(e.target.value),
    }));
  };
  const handleValidatePassword = (e) => {
    setErrors((prev) => ({
      ...prev,
      passwordErrors: validatePassword(e.target.value),
    }));
  };
  const handleValidateUsername = (e) => {
    setErrors((prev) => ({
      ...prev,
      usernameErrors: validateUsername(e.target.value),
    }));
  };

  return (
    <div>
    <ConditionalRenderer showContent={!loading}>
    <form
        noValidate
        onSubmit={isRegistration ? handleRegistration : handleLogin}
        action=""
      >
        {isRegistration && (
          <>
            <label>Email:</label>
            <br />
            <input type="email" name="email" onBlur={handleValidateEmail} />
            <ErrorInForm error={errors.emailErrors} />
          </>
        )}
        <br />
        <label>Username:</label>
        <br />
        <input type="text" name="username" onBlur={handleValidateUsername} />
        <ErrorInForm error={errors.usernameErrors} />
        <br />
        <label>Password:</label>
        <br />
        <input
          type="password"
          name="password"
          onBlur={handleValidatePassword}
        />
        <ErrorInForm error={errors.passwordErrors} />
        <br />
        {isRegistration && (
          <>
            <label>Ruolo:</label>
            <br />
            <select
              name="ruolo"
              value={formData.ruolo}
              onChange={handleInputChange}
            >
              <option value="">Seleziona...</option>
              <option value="OPERATORE">OPERATORE</option>
              <option value="SEMPLICE">SEMPLICE</option>
            </select>
          </>
        )}
        <br /> <br />
        {(formData.ruolo === "OPERATORE"&&isRegistration) && (
          <>
            <label>Permesso:</label>
            <select
              name="permesso"
              value={formData.permesso}
              onChange={handleInputChange}
            >
              <option value="">Seleziona...</option>
              <option value="JUNIOR">JUNIOR</option>
              <option value="SENIOR">SENIOR</option>
            </select>
            <br />
            <br />
          </>
        )}
        <button type="submit">{isRegistration?"Sottoscrivi Registrazione":"Login"}</button>
        {!isRegistration ? (
        <Link to="/registrazione"><button type="button">Registrati</button></Link>
        )
        :
        (<Link to={-1}><button type="button">Torna al login</button></Link>)
        }
        <ErrorInForm error={errors.afterErrors} />
      </form>
    </ConditionalRenderer>
     
    </div>
  );
};

export default LoginRegistrazione;
