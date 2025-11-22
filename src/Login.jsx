import { useState } from 'react'
import ServaadaLogo from '/workspaces/mattw_app_development/Servaada Logo.png'
import './App.css'

function Login(){
  const [count, setCount] = useState(0)

    return(
        <>
          <div class="header">
            <img id = "logoImage" src = {ServaadaLogo} alt = "Servaada Logo" />
            <h1 id ="pageTitle"> File Comparison Tool </h1>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <div id ="pageinformation">Please enter your login details below:</div>
          <form id = "LoginForm" class = "LoginForm">
            <label for = "UsernameInput">Username:</label><br></br>
            <input id = "UsernameInput" type = "text"></input><br></br>
            <br></br>
            <label for ='PasswordInput'>Password:</label><br></br>
            <input id = "PasswordInput" type = "password"></input><br></br>
            <br></br>
            <button id = "LoginButton" class = "buttons" onClick = {LoginClicked()}>Submit</button>
          </form>
        </>
    )

function LoginClicked(){
  alert("Details Submitted");
}    
}

export default Login