import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [records, setRecords] = useState([]);

  // 1. DYNAMIC FETCH: Pulls real data from your live PostgreSQL Database on Render!
  const fetchRecords = async () => {
    try {
      const response = await axios.get('https://breathe-esg-backend-j2jh.onrender.com/api/records/');
      setRecords(response.data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  // Run once when the page loads
  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadSAPFile = async () => {
    if (!file) {
      setStatusMsg({ text: '⚠️ Please select a file first.', type: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    setIsProcessing(true);
    setStatusMsg({ text: '⚙️ Parsing CSV & Normalizing Data...', type: 'loading' });
    
    try {
      await axios.post('https://breathe-esg-backend-j2jh.onrender.com/api/upload/sap/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatusMsg({ text: '✅ SAP Data successfully ingested to PostgreSQL!', type: 'success' });
      fetchRecords(); // Refresh the table automatically!
    } catch (err) {
      setStatusMsg({ text: '❌ Upload failed.', type: 'error' });
    }
    setIsProcessing(false);
  };

  const syncTravelData = async () => {
    setIsProcessing(true);
    setStatusMsg({ text: '📡 Fetching live data from Travel API...', type: 'loading' });
    try {
      await axios.get('https://breathe-esg-backend-j2jh.onrender.com/api/sync/travel/');
      setStatusMsg({ text: '✅ Travel Data pulled and processed!', type: 'success' });
      fetchRecords(); // Refresh the table automatically!
    } catch (err) {
      setStatusMsg({ text: '❌ Sync failed.', type: 'error' });
    }
    setIsProcessing(false);
  };

  const handleApprove = (id) => {
    setRecords(records.map(rec => rec.id === id ? { ...rec, status: 'APPROVED' } : rec));
  };

  const handleReject = (id) => {
    setRecords(records.map(rec => rec.id === id ? { ...rec, status: 'REJECTED' } : rec));
  };

  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', padding: '40px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0' }}>
      
      {/* Premium Gradient Header */}
      <header style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '30px', borderRadius: '16px', marginBottom: '30px', border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h1 style={{ margin: 0, fontSize: '28px', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✦ Breathe ESG Data Engine
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '15px' }}>Live Data Normalization & Validation Dashboard</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '30px' }}>
        
        {/* Left Side: Actions Panel */}
        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '16px', border: '1px solid #334155', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, color: '#f8fafc', fontSize: '18px' }}>⚡ Ingestion Engine</h3>
          
          <div style={{ margin: '25px 0' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: '#cbd5e1' }}>SAP Legacy Export (.csv)</label>
            <input type="file" accept=".csv" onChange={handleFileChange} disabled={isProcessing} style={{ marginBottom: '15px', width: '100%', color: '#94a3b8', fontSize: '13px' }} />
            <button onClick={uploadSAPFile} disabled={isProcessing} style={{ background: isProcessing ? '#475569' : '#0284c7', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: isProcessing ? 'not-allowed' : 'pointer', width: '100%', fontWeight: '600', transition: '0.2s' }}>
              {isProcessing ? 'Processing...' : 'Upload & Clean Data'}
            </button>
          </div>

          <div style={{ margin: '25px 0' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: '#cbd5e1' }}>Live API Integration</label>
            <button onClick={syncTravelData} disabled={isProcessing} style={{ background: isProcessing ? '#475569' : '#059669', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: isProcessing ? 'not-allowed' : 'pointer', width: '100%', fontWeight: '600', transition: '0.2s' }}>
               {isProcessing ? 'Fetching API...' : 'Sync Travel Portal'}
            </button>
          </div>

          {/* Status Message Area */}
          {statusMsg.text && (
            <div style={{ padding: '15px', borderRadius: '8px', fontSize: '13px', marginTop: '20px', 
              backgroundColor: statusMsg.type === 'error' ? '#7f1d1d' : statusMsg.type === 'loading' ? '#1e3a8a' : '#064e3b',
              color: statusMsg.type === 'error' ? '#fca5a5' : statusMsg.type === 'loading' ? '#93c5fd' : '#6ee7b7'
            }}>
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* Right Side: Data Table */}
        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
          <h3 style={{ marginTop: 0, color: '#f8fafc', fontSize: '18px' }}>🛡️ Audit & Validation Queue</h3>
          
          <div style={{ maxHeight: '600px', overflowY: 'auto', marginTop: '20px', paddingRight: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155', textAlign: 'left' }}>
                  <th style={{ padding: '15px 10px' }}>Source</th>
                  <th style={{ padding: '15px 10px' }}>Category</th>
                  <th style={{ padding: '15px 10px' }}>Value</th>
                  <th style={{ padding: '15px 10px' }}>Flags</th>
                  <th style={{ padding: '15px 10px', textAlign: 'right' }}>Analyst Action</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No data ingested yet. Database is empty.</td></tr>
                )}
                {records.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #334155', transition: '0.2s', backgroundColor: rec.status === 'APPROVED' ? 'rgba(5, 150, 105, 0.05)' : 'transparent' }}>
                    
                    <td style={{ padding: '15px 10px', color: '#e2e8f0', fontWeight: '500' }}>{rec.source}</td>
                    <td style={{ padding: '15px 10px', color: '#94a3b8' }}>{rec.category}</td>
                    <td style={{ padding: '15px 10px', color: '#f8fafc', fontFamily: 'monospace', fontSize: '15px' }}>{rec.amount} <span style={{ color: '#64748b', fontSize: '12px' }}>{rec.unit}</span></td>
                    
                    <td style={{ padding: '15px 10px' }}>
                      {rec.error ? <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>ERR: {rec.error}</span> 
                      : rec.is_suspicious ? <span style={{ background: '#b45309', color: '#fde68a', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>WARN: Anomaly</span>
                      : <span style={{ color: '#059669', fontSize: '12px' }}>✓ Clean</span>}
                    </td>

                    <td style={{ padding: '15px 10px', textAlign: 'right' }}>
                      {rec.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleApprove(rec.id)} style={{ background: 'transparent', color: '#34d399', border: '1px solid #34d399', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: '0.2s' }}>Approve</button>
                          <button onClick={() => handleReject(rec.id)} style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: '0.2s' }}>Reject</button>
                        </div>
                      ) : (
                        <span style={{ color: rec.status === 'APPROVED' ? '#10b981' : '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>{rec.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;