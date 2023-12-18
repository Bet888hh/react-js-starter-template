import React, { useState } from 'react'
import ErrorInForm from '../../Components/ErrorInForm/ErrorInForm';
import { useLocation } from 'react-router';


const LoginRegistrazione = () => {
 
  const [errors,setErrors]= useState({
    emailErrors:"",
    usernameErrors:"",
    passwordErrors:"",
    afterErrors:""
  })
  const [loading,isLoading]=useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    ruolo: '',
    permesso: '',
  });

  

  const validateEmail = (email) => {
    const errors = [];
  
    // Verifica che l'indirizzo email non sia vuoto
    if(!email){
      errors.push("la mail non può essere vuota")
    }
      // Verifica la presenza di esattamente una '@'
      if ((email.match(/@/g) || []).length !== 1) {
        errors.push('La mail deve contenere esattamente una @.');
      }
  
      // Verifica la presenza di almeno un '.'
      if (!/\./.test(email)) {
        errors.push('La mail deve contenere almeno un punto.');
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
  
   
    const lunghezzaMassima = 16; 
    if (password.length > lunghezzaMassima) {
      errors.push(`La password non può superare i ${lunghezzaMassima} caratteri.`);
    }
  
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration = () => {
    // Validazione dei campi prima della registrazione
    const emailError = validateEmail(formData.email);
    const usernameError = validateUsername(formData.username);
    const passwordError = validatePassword(formData.password);

  
  };


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

      <button onClick={handleRegistration}>Registrati</button>
      </form>
    </div>
  );
}

export default LoginRegistrazione