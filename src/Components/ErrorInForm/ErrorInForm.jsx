/* eslint-disable react/prop-types */
import React from 'react'

const ErrorInForm = ({error}) => {
 

    
 return error&& error.length>0?<span style={{color:"red"}}> <br />{error.join(" ")}</span>:null
}

export default ErrorInForm