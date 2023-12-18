import React, { useCallback, useState } from 'react'
import ErrorInForm from '../../Components/ErrorInForm/ErrorInForm';
import { useLocation } from 'react-router';
import { headers, urlbase } from '../../Utility/urls';
import { error } from 'console';


const LoginRegistrazione = () => {
 
  const [errors,setErrors]= useState({
    emailErrors:"",
    usernameErrors:"",
    passwordErrors:"",
    afterErrors:""
  })
  const [loading,isLoading]=useState(false)
  const [formData, setFormData] = useState({
    ruolo: '',
    permesso: '',
  });

  const attemptRegistration = (email,username,password,ruolo,permesso)=>{
     const newUser = {
      Email:email,
      Username:username,
      Password:password,
      Ruolo:ruolo,
      Permesso:permesso
     }

     fetch(urlbase("USER"))
       .then((r) => r.json())
       .then((existingUsers) => {
         const isEmailTaken = existingUsers.some(
           (user) => user.Email === email
         );

         const isUsernameTaken = existingUsers.some(
           (user) => user.Username === username
         );

         if (!isEmailTaken && !isUsernameTaken) {
           fetch(urlbase("USER"), {
             method: "POST",
             headers: headers,
             body: JSON.stringify(newUser),
           })
             .then((r) => r.json())
             .then(() => {});
         } else {
           setErrors((prev) => ({
             ...prev,
             afterErrors: ["username o password già utilizzato"],
           }));
         }
       });
  }

  const validateEmail = (email) => {
    const errors = [];
  
   
    if(!email){
      errors.push("la mail non può essere vuota")
    }
     
      if ((email.match(/@/g) || []).length !== 1) {
        errors.push('La mail deve contenere esattamente una @.');
      }
  
  
      if (!/\./.test(email)) {
        errors.push('La mail deve contenere almeno un punto.');
      }
      const lunghezzaMassima = 25; 
      if (email.length > lunghezzaMassima) {
        errors.push(`La mail non può superare i ${lunghezzaMassima} caratteri.`);
      }
  
  
    return errors;
  };
  
  const validateUsername = (username) => {
    const errors = [];
  if (!username){
    errors.push('Lo username non  deve essere vuoto. ');
  }
    if (!/[A-Z]/.test(username)) {
      errors.push('Lo username deve contenere almeno una lettera maiuscola.');
    }
    if (!/[a-z]/.test(username)) {
      errors.push('Lo username deve contenere almeno una lettera minuscola.');
    }
    if (!/\d{3}$/.test(username)) {
      errors.push('Lo username deve contenere almeno 3 numeri alla fine.');
    }
    const lunghezzaMassima = 10; 
    if (username.length > lunghezzaMassima) {
      errors.push(`Lo username non può superare i ${lunghezzaMassima} caratteri.`);
    }
    return errors;
  };

  const validatePassword = (password) => {
    const errors = [];
  
   if(!password){
    errors.push('La password non può essere vuota .');
   }
    if (!/[A-Z]/.test(password)) {
      errors.push('La password deve contenere almeno una lettera maiuscola.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('La password deve contenere almeno una lettera minuscola.');
    }
    if (!/\d/.test(password)) {
      errors.push('La password deve contenere almeno un numero.');
    }  
    if (!/-/.test(password)) {
      errors.push('La password deve contenere almeno un trattino.');
    }
    const lunghezzaMassima = 10; 
    if (password.length > lunghezzaMassima) {
      errors.push(`La password non può superare i ${lunghezzaMassima} caratteri.`);
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration =useCallback( (e) => {
    // Validazione dei campi prima della registrazione
   e.preventDefault()
   const formData1 = new FormData(e.target);
   const email = formData1.get('email');
   const username = formData1.get('username');
   const password = formData1.get('password');
   const passwordErrors= validatePassword(password)
   const emailErrors = validateEmail(email)
   const usernameErrors = validateUsername(username)
  



   if(passwordErrors.length===0 && emailErrors.length===0&&usernameErrors.length===0&&formData.ruolo!==""){
    attemptRegistration(email,username,password,formData.ruolo,formData.permesso)
   }else{
    console.log("asd");
    return
   }




  },[formData.ruolo]);


  const handleValidateEmail = (e) => {
    setErrors( prev=>({...prev,emailErrors:validateEmail(e.target.value)}))
  };
  const handleValidatePassword = (e) => {
setErrors( prev=>({...prev,passwordErrors:validatePassword(e.target.value)}))
  };
  const handleValidateUsername = (e) => {
    setErrors( prev=>({...prev,usernameErrors:validateUsername(e.target.value)}))
  };


  return (
    <div>
      <form noValidate onSubmit={handleRegistration} action="">

      <label>Email:</label><br />
      <input
        type="email"
        name="email"
      
        onBlur={handleValidateEmail}
        />
   
    <ErrorInForm error={errors.emailErrors}/><br />
      <label>Username:</label><br />
      <input
        type="text"
        name="username"
       
        onBlur={handleValidateUsername}
        />
        <ErrorInForm error={errors.usernameErrors}/><br />

      <label>Password:</label><br />
      <input
        type="password"
        name="password"
     
        onBlur={handleValidatePassword}
        />
         <ErrorInForm error={errors.passwordErrors}/><br />

      <label>Ruolo:</label><br />
      <select
        name="ruolo"
        value={formData.ruolo}
        onChange={handleInputChange}
        >
        <option value="">Seleziona...</option>
        <option value="OPERATORE">OPERATORE</option>
        <option value="SEMPLICE">SEMPLICE</option>
      </select><br /> <br />

      {formData.ruolo === 'OPERATORE' && (
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

      <button type='submit'>Registrati</button>
      </form>
    </div>
  );
}

export default LoginRegistrazione