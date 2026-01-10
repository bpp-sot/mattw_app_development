import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Nav, Navbar} from 'react-bootstrap'
import ServaadaLogo from '/workspaces/mattw_app_development/Servaada Logo.png'
import './App.css'

function App() {

  return (
    <>
      <header className="header">
        <img id="logoImage" src={ServaadaLogo} alt="Servaada Logo" />
        <h1 id ="pageTitle"> File Comparison Tool </h1>
      </header>
      <Navbar expand="lg" className="topnav" >
        <Container>
          <Navbar.Brand href="#home">Servaada File Comparison</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#link">Previous Comparisons</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main id ="pageinformation">Upload your chosen files below, and click "Compare Files" Button
        <p id ="pageinformation">Upload your chosen files below, and click "Compare Files" Button</p>
        <div className ="fileuploads">   
          <h2 className ="upload-titles">Upload Baseline File</h2>
          <div>
              <input id="srcFileUpload" className = "fileUploads" type="file" name="srcFileUpload" />
              <input id="srcFileSubmit" className = "buttons" type="submit" value="Upload"/>
          </div>
            <br></br>
            <br></br>
            <h2 className ="upload-titles">Upload Comparison File</h2>
            <div>
              <input id="tgtFileUpload" className = "fileUploads" type="file"  name="tgtFileUpload" />
              <input id="tgtFileSubmit" className = "buttons" type="submit" value="Upload"/>
            </div>
            <br></br>
            <br></br>
            <button id="compareFilesButton" className="buttons">Compare Files</button>
        </div>
      </main>
      <footer id="footer" class="bg-light text-black pt-4 pb-2">
        <div class="container">
            <div class="row">
              <div class="col-md-4 text-black">
                <h5>About Us</h5>
                <p class="text-black">
                  We help our clients provide excellent customer service to their retail and corporate customers – while optimising efficiency, reducing operational risk, and operating consistently within the FCA’s strict regulatory framework.
                </p>
              </div>
              <div class="col-md-4">
                <h5>Quick Links</h5>
                <ul class="list-unstyled text-black">
                  <li><a href="https://www.wipro.com/servaada/" class="text-black">Home</a></li>
                  <li><a href="https://www.wipro.com/applications/" class="text-black">Applications</a></li>
                  <li><a href="https://www.wipro.com/contact-wipro/" class="text-black">Contact</a></li>
                </ul>
              </div>
            <div class="text-center">
              <p class="mb-0 text-black">&copy; 2026 Servaada. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
