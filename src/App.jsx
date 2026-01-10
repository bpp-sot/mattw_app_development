
import { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import ServaadaLogo from '/workspaces/mattw_app_development/Servaada Logo.png';
import './App.css';

function App() {
  const [srcFile, setSrcFile] = useState(null); // File | null
  const [tgtFile, setTgtFile] = useState(null); // File | null
  const [srcStatus, setSrcStatus] = useState('');
  const [tgtStatus, setTgtStatus] = useState('');

  // Refs if you want to clear the inputs after submit
  const srcInputRef = useRef(null);
  const tgtInputRef = useRef(null);

  function isExcelFilename(filename) {
    const allowedExtensions = /\.(xls|xlsx)$/i;
    return allowedExtensions.test(filename);
  }

  function validateAndSetStatus(file, setStatus) {
    if (!file) {
      setStatus('No file selected.');
      return false;
    }
    if (!isExcelFilename(file.name)) {
      setStatus('Invalid file type. Please upload an Excel file (.xls or .xlsx).');
      return false;
    }
    setStatus('Valid file type. You can proceed with the upload.');
    return true;
  }

  function handleSrcChange(e) {
    const file = e.target.files?.[0] ?? null;
    setSrcFile(file);
    validateAndSetStatus(file, setSrcStatus);
  }

  function handleTgtChange(e) {
    const file = e.target.files?.[0] ?? null;
    setTgtFile(file);
    validateAndSetStatus(file, setTgtStatus);
  }

  function handleUploadSubmit(e) {
    e.preventDefault();
    // Decide which form fired based on the submitter's id or the presence of files
    const form = e.currentTarget;
    const isSrc = form.querySelector('#srcFileUpload') !== null;

    if (isSrc) {
      const ok = validateAndSetStatus(srcFile, setSrcStatus);
      if (ok) {
        // TODO: upload srcFile
        setSrcStatus('Baseline file uploaded successfully.');
        // Clear input if desired
        if (srcInputRef.current) srcInputRef.current.value = '';
        setSrcFile(null);
      }
    } else {
      const ok = validateAndSetStatus(tgtFile, setTgtStatus);
      if (ok) {
        // TODO: upload tgtFile
        setTgtStatus('Comparison file uploaded successfully.');
        if (tgtInputRef.current) tgtInputRef.current.value = '';
        setTgtFile(null);
      }
    }
  }

  function handleCompare() {
    const srcOk = validateAndSetStatus(srcFile, setSrcStatus);
    const tgtOk = validateAndSetStatus(tgtFile, setTgtStatus);
    if (!srcOk || !tgtOk) return;
    // TODO: perform comparison with srcFile and tgtFile
    // e.g., send both to backend, then update UI with result
    alert('Comparing files...');
  }

  return (
    <>
      <header className="header">
        <img id="logoImage" src={ServaadaLogo} alt="Servaada Logo" />
        <h1 id="pageTitle">File Comparison Tool</h1>
      </header>

      <Navbar expand="lg" className="topnav">
        <Container>
          <Navbar.Brand href="#home">Servaada File Comparison</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#previous">Previous Comparisons</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
        <p id="pageinformation">
          Upload your chosen files below, and click "Compare Files" Button
        </p>
        <br />

        {/* Baseline upload */}
        <form onSubmit={handleUploadSubmit}>
          <h2>Upload Baseline File:</h2>
          <input
            id="srcFileUpload"
            className="fileUploads"
            type="file"
            data-status-id="srcFileStatus"
            onChange={handleSrcChange}
            ref={srcInputRef}
            required
          />
          <button id="srcFileSubmit" className="buttons" type="submit">Upload</button>
          <br />
          <span id="srcFileStatus" className="status">{srcStatus}</span>
        </form>

        <br />

        {/* Comparison upload */}
        <form onSubmit={handleUploadSubmit}>
          <h2>Upload Comparison File:</h2>
          <input
            id="tgtFileUpload"
            className="fileUploads"
            type="file"
            data-status-id="tgtFileStatus"
            onChange={handleTgtChange}
            ref={tgtInputRef}
            required
          />
          <button id="tgtFileSubmit" className="buttons" type="submit">Upload</button>
          <br />
          <span id="tgtFileStatus" className="status"> {tgtStatus}</span>
        </form>

        <br />

        <div>
          <button id="compareFilesButton" className="buttons" onClick={handleCompare}>
            Compare Files
          </button>
        </div>
      </main>

      <footer id="footer" className="bg-light text-black pt-4 pb-2">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-black">
              <h5>About Us</h5>
              <p className="text-black">
                We help our clients provide excellent customer service to their retail and corporate customers – while optimising efficiency, reducing operational risk, and operating consistently within the FCA’s strict regulatory framework.
              </p>
            </div>
            <div className="col-md-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled text-black">
                <li>https://www.wipro.com/servaada/Home</li>
                <li>https://www.wipro.com/applications/Applications</li>
                <li>https://www.wipro.com/contact-wipro/Contact</li>
              </ul> 
            </div>
            <div className="text-center">
              <p className="mb-0 text-black">&copy; 2026 Servaada. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
