import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, InputGroup, Button} from 'react-bootstrap'
import {useNavigate} from "react-router-dom"
import ServaadaLogo from '/workspaces/mattw_app_development/Servaada Logo.png'
import './App.css'

function Login(){
  const [count, setCount] = useState(0)

    return(
        <>
          <div className="header">
            <img id = "logoImage" src = {ServaadaLogo} alt = "Servaada Logo" />
            <h1 id ="pageTitle"> File Comparison Tool </h1>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <div id ="pageinformation">Please enter your login details below:</div>
          <Form>
            <Form.Group className="LoginForm" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" placeholder="Enter Username" />
            </Form.Group>
            <Form.Group className="LoginForm" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter Password" />
            </Form.Group>
            <br></br>
            <Button variant="secondary" type="submit" link = "">
              Submit
            </Button>
          </Form>
        </>
    )


}

export default Login