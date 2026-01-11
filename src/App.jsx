
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import ServaadaLogo from '/workspaces/mattw_app_development/Servaada Logo.png';
import './App.css';

function App() {
  const [srcFile, setSrcFile] = useState(null); // File | null
  const [tgtFile, setTgtFile] = useState(null); // File | null
  const [srcStatus, setSrcStatus] = useState('');
  const [tgtStatus, setTgtStatus] = useState('');

  
  const [compareKey, setCompareKey] = useState(''); // optional column name to key by
  const [diffResult, setDiffResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');


  // Refs to clear the inputs after submit
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
    setStatus('Valid file type. You can proceed with comparison.');
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

// ---------- Excel File Handling ----------
  async function readWorkbook(file) {
      // Read file contents into memory
          const data = await file.arrayBuffer();
              // Return workbook object 
                  return XLSX.read(data, { type: 'array', cellDates: true });
                    }

                      function sheetToRecords(wb) {
                          // First sheet from workbook
                              const ws = wb.Sheets[wb.SheetNames[0]];
                                  // Converts worksheet into JSON
                                      const records = XLSX.utils.sheet_to_json(ws, { defval: '', raw: true });
                                          // Returns JSON records
                                              return records;
                                                }

  function inferKey(headers) {
    // Try common ID-like column names if present
    const candidates = ['ID', 'Id', 'id', 'Key', 'KEY', 'key', 'Code', 'code'];
    const found = candidates.find(c => headers.includes(c));
    return found || '';
  }

  // ---------- Diff algorithms ----------
  function normalize(v) {
    if (v === null || v === undefined) return '';
    if (v instanceof Date) return v.getTime(); // compare dates by timestamp
    if (typeof v === 'string') return v.trim();
    if (typeof v === 'number' && Number.isNaN(v)) return '';
    return v;
  }
  function isEqual(a, b) {
    const na = normalize(a);
    const nb = normalize(b);
    // Convert everything except numbers/dates to string for a resilient compare
    const isNum = typeof na === 'number' && typeof nb === 'number';
    return isNum ? na === nb : String(na) === String(nb);
  }

  function diffByKey(srcRecords, tgtRecords, key) {
    const srcMap = new Map(srcRecords.map(r => [String(r[key]), r]));
    const tgtMap = new Map(tgtRecords.map(r => [String(r[key]), r]));
    const allHeaders = Array.from(
      new Set([
        ...Object.keys(srcRecords[0] || {}),
        ...Object.keys(tgtRecords[0] || {}),
      ])
    );

    const added = [];
    const removed = [];
    const changed = [];
    const unchanged = [];

    for (const [id, tgtRow] of tgtMap) {
      if (!srcMap.has(id)) {
        added.push(tgtRow);
        continue;
      }
      const srcRow = srcMap.get(id);
      const cellDiffs = {};
      let isChanged = false;
      for (const h of allHeaders) {
        const a = srcRow[h];
        const b = tgtRow[h];
        if (!isEqual(a, b)) {
          isChanged = true;
          cellDiffs[h] = { from: a, to: b };
        }
      }
      if (isChanged) changed.push({ key: id, src: srcRow, tgt: tgtRow, diffs: cellDiffs });
      else unchanged.push({ key: id, row: tgtRow });
    }

    for (const [id, srcRow] of srcMap) {
      if (!tgtMap.has(id)) removed.push(srcRow);
    }

    return { mode: 'key', key, headers: allHeaders, added, removed, changed, unchanged };
  }

  function diffByRow(srcRecords, tgtRecords) {
    const len = Math.max(srcRecords.length, tgtRecords.length);
    const allHeaders = Array.from(
      new Set([
        ...Object.keys(srcRecords[0] || {}),
        ...Object.keys(tgtRecords[0] || {}),
      ])
    );

    const added = [];
    const removed = [];
    const changed = [];
    const unchanged = [];

    for (let i = 0; i < len; i++) {
      const s = srcRecords[i];
      const t = tgtRecords[i];
      if (s && !t) {
        removed.push({ index: i, row: s });
      } else if (!s && t) {
        added.push({ index: i, row: t });
      } else if (s && t) {
        let isChanged = false;
        const diffs = {};
        for (const h of allHeaders) {
          const a = s[h];
          const b = t[h];
          if (!isEqual(a, b)) {
            isChanged = true;
            diffs[h] = { from: a, to: b };
          }
        }
        if (isChanged) changed.push({ index: i, src: s, tgt: t, diffs });
        else unchanged.push({ index: i, row: t });
      }
    }

    return { mode: 'row', headers: allHeaders, added, removed, changed, unchanged };
  }


  
// ---------- Compare handler ----------
  async function handleCompare() {
    setErrorMsg('');
    setDiffResult(null);
    if (!validateAndSetStatus(srcFile, setSrcStatus) || !validateAndSetStatus(tgtFile, setTgtStatus)) {
      return;
    }
    setLoading(true);
    try {
      const [wbSrc, wbTgt] = await Promise.all([readWorkbook(srcFile), readWorkbook(tgtFile)]);
      const srcRecords = sheetToRecords(wbSrc);
      const tgtRecords = sheetToRecords(wbTgt);

      if (!srcRecords.length && !tgtRecords.length) {
        setErrorMsg('Both sheets are empty.');
        setLoading(false);
        return;
      }

      const headers = Array.from(
        new Set([
          ...Object.keys(srcRecords[0] || {}),
          ...Object.keys(tgtRecords[0] || {}),
        ])
      );

      // Use chosen key if provided, otherwise infer a reasonable one; if nothing, do row-by-row
      const key = compareKey || inferKey(headers);
      const result =
        key && headers.includes(key)
          ? diffByKey(srcRecords, tgtRecords, key)
          : diffByRow(srcRecords, tgtRecords);

      setDiffResult(result);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to read/compare the Excel files. Check that sheets are valid.');
    } finally {
      setLoading(false);
    }
  }

  // ---------- Render helpers ----------
  function StatusPill({ type, children }) {
    const bg =
      type === 'added' ? '#e6ffed' :
      type === 'removed' ? '#ffeef0' :
      type === 'changed' ? '#fff5b1' :
      '#f1f1f1';
    const color = '#222';
    return (
      <span style={{ background: bg, color, borderRadius: 6, padding: '2px 8px', fontSize: 12 }}>
        {children}
      </span>
    );
  }

  
function DiffTable({ diff }) {
  const { mode, headers: originalHeaders, added, removed, changed } = diff;

  // Build headers robustly: if originalHeaders is empty, infer from data
  function inferHeaders() {
    if (originalHeaders && originalHeaders.length) return originalHeaders;

    // Try to infer from any available section
    const candidateRows = [];

    if (mode === 'key') {
      // added/removed/changed entries are plain rows (added/removed)
      if (added?.length) candidateRows.push(added[0]);
      else if (removed?.length) candidateRows.push(removed[0]);
      else if (changed?.length) candidateRows.push(changed[0].tgt || changed[0].src);
    } else {
      // row mode added/removed are { index, row }
      if (added?.length) candidateRows.push(added[0].row);
      else if (removed?.length) candidateRows.push(removed[0].row);
      else if (changed?.length) candidateRows.push(changed[0].tgt || changed[0].src);
    }

    const headersFromRow = candidateRows.length ? Object.keys(candidateRows[0] || {}) : [];
    return headersFromRow;
  }

  const headers = inferHeaders();

  function StatusPill({ type, children }) {
    const bg =
      type === 'added' ? '#e6ffed' :
      type === 'removed' ? '#ffeef0' :
      type === 'changed' ? '#fff5b1' :
      '#f1f1f1';
    return (
      <span style={{ background: bg, color: '#222', borderRadius: 6, padding: '2px 8px', fontSize: 12 }}>
        {children}
      </span>
    );
  }

  return (
    <div>
      <h4>Results ({mode === 'key' ? `key column: ${diff.key}` : 'row-by-row'})</h4>

      <div className="mb-3">
        <StatusPill type="added">Added: {added.length}</StatusPill>{' '}
        <StatusPill type="removed">Removed: {removed.length}</StatusPill>{' '}
        <StatusPill type="changed">Changed: {changed.length}</StatusPill>
      </div>

      {/* Added rows */}
      {added.length > 0 && (
        <>
          <h5>Added rows</h5>
          <div className="table-responsive">
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  {headers.map(h => <th key={`add-h-${h}`}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {mode === 'key' ? (
                  added.map((row, i) => (
                    <tr key={`add-${i}`} className="diff-added">
                      {headers.map(h => <td key={`add-${i}-${h}`}>{String(row?.[h] ?? '')}</td>)}
                    </tr>
                  ))
                ) : (
                  added.map(({ index, row }, i) => (
                    <tr key={`add-${i}`} className="diff-added" title={`new at row ${index + 1}`}>
                      {headers.map(h => <td key={`add-${i}-${h}`}>{String(row?.[h] ?? '')}</td>)}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Removed rows */}
      {removed.length > 0 && (
        <>
          <h5>Removed rows</h5>
          <div className="table-responsive">
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  {headers.map(h => <th key={`rem-h-${h}`}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {mode === 'key' ? (
                  removed.map((row, i) => (
                    <tr key={`rem-${i}`} className="diff-removed">
                      {headers.map(h => <td key={`rem-${i}-${h}`}>{String(row?.[h] ?? '')}</td>)}
                    </tr>
                  ))
                ) : (
                  removed.map(({ index, row }, i) => (
                    <tr key={`rem-${i}`} className="diff-removed" title={`removed at row ${index + 1}`}>
                      {headers.map(h => <td key={`rem-${i}-${h}`}>{String(row?.[h] ?? '')}</td>)}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Changed rows */}
      {changed.length > 0 && (
        <>
          <h5>Changed rows</h5>
          <div className="table-responsive">
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  {headers.map(h => <th key={`chg-h-${h}`}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {changed.map((row, i) => {
                  const src = row.src;
                  const tgt = row.tgt;
                  const diffs = row.diffs;
                  return (
                    <tr key={`chg-${i}`} className="diff-changed">
                      {headers.map(h => {
                        const isCellChanged = !!diffs[h];
                        const bg = isCellChanged ? '#fff2cc' : undefined;
                        const title = isCellChanged ? `from: ${String(diffs[h].from ?? '')}` : '';
                        return (
                          <td key={`chg-${i}-${h}`} style={{ background: bg }} title={title}>
                            {String((tgt ?? row)?.[h] ?? '')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {added.length === 0 && removed.length === 0 && changed.length === 0 && (
        <div className="alert alert-success">No differences found.</div>
      )}
    </div>
  );
}

  return (
    <>
      {/* Header */} 
      <header className="header">
        <img id="logoImage" src={ServaadaLogo} alt="Servaada Logo" />
        <h1 id="pageTitle">File Comparison Tool</h1>
      </header>
      {/* Navbar */} 
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
      {/* Main Body */} 
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
          <br />
          <span id="tgtFileStatus" className="status"> {tgtStatus}</span>
        </form>
        <br />
        {/* Compare Files Button */} 
        <div>
          <button id="compareFilesButton" className="buttons" onClick={handleCompare} disabled={loading}>
            {loading ? 'Comparing…' : 'Compare Files'}
          </button>
        </div>
        <br />
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {diffResult && <DiffTable diff={diffResult} />}
      </main>
      {/* Footer */}
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
                <li><a href="https://www.wipro.com/servaada/" class="text-black">Home</a></li>
                <li><a href="https://www.wipro.com/applications/" class="text-black">Applications</a></li>
                <li><a href="https://www.wipro.com/contact-wipro/" class="text-black">Contact</a></li>
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
