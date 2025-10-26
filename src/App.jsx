import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="header">
        <img id="logoImage" src="Servaada Logo.png" alt="Servaada Logo" />
        <h1 id ="pageTitle"> File Comparison Tool </h1>
      </div>
      <br></br>
      <br></br>
      <div class="topnav">
        <a href="#home" class="active">Home</a>
        <a href="#news">News</a>
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
      </div>
      <div id ="pageinformation">Upload your chosen files below, and click "Compare Files" Button</div>
      <div class ="fileuploads">   
         <h2 class ="upload-titles">Upload Source File</h2>
          <input id="srcFileUpload" class ="fileUploads" type="file" name="srcFileUpload" />
          <input id="srcFileSubmit" class = "buttons" type="submit" value="Upload"  onclick="alert('File Submitted')" />
          <br></br>
          <h2 class ="upload-titles">Upload Target File</h2>
          <input id="tgtFileUpload" class ="fileUploads" type="file"  name="tgtFileUpload" />
          <input id="tgtFileSubmit" class = "buttons" type="submit" value="Upload"  onclick="alert('File Submitted')"/>
          <br></br>
          <br></br>
          <button id="compareFilesButton" class="buttons" onclick="alert('Compare Files clicked')">Compare Files</button>
      </div>
    </>
  )
}

export default App
