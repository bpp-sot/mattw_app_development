import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Nav, Navbar} from 'react-bootstrap'
import NavDropdown from 'react-bootstrap/NavDropdown'
import ServaadaLogo from '/workspaces/mattw_app_development/Servaada Logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="header">
        <img id="logoImage" src={ServaadaLogo} alt="Servaada Logo" />
        <h1 id ="pageTitle"> File Comparison Tool </h1>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <Navbar expand="lg" className="topnav" >
        <Container>
          <Navbar.Brand href="#home">Servaada File Comparison</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">This Worked</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div id ="pageinformation">Upload your chosen files below, and click "Compare Files" Button</div>
      <div className ="fileuploads">   
         <h2 className ="upload-titles">Upload Source File</h2>
          <input id="srcFileUpload" className = "fileUploads" type="file" name="srcFileUpload" />
          <input id="srcFileSubmit" className = "buttons" type="submit" value="Upload"/>
          <br></br>
          <br></br>
          <h2 className ="upload-titles">Upload Target File</h2>
          <input id="tgtFileUpload" className ="fileUploads" type="file"  name="tgtFileUpload" />
          <input id="tgtFileSubmit" className = "buttons" type="submit" value="Upload"/>
          <br></br>
          <br></br>
          <button id="compareFilesButton" className="buttons">Compare Files</button>
      </div>
    </>
  )
}

export default App
