import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './DisconnectionsPage.css';
import Toast from './Toast';

function DisconnectionsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [supervisorRemarks, setSupervisorRemarks] = useState([]);
  const [newRemark, setNewRemark] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isUploading, setIsUploading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const savedAccounts = localStorage.getItem('disconnectionAccounts');
    const savedRemarks = localStorage.getItem('supervisorRemarks');
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    if (savedRemarks) setSupervisorRemarks(JSON.parse(savedRemarks));
    else {
      // Mock data updated with new columns
      setAccounts([
        { id: 1, meterNo: "54401312787", name: "James Otuma", supplyLocation: "Kakamega Town, Plot 123", lastMonthBalance: 2000, totalBalance: 4250, coordinates: "0.2827,34.7519,90", status: "pending", remarks: "" },
        { id: 2, meterNo: "37195030541", name: "Mose Malava", supplyLocation: "West Kenya Estate, Block A", lastMonthBalance: 1500, totalBalance: 3800, coordinates: "0.2905,34.7667,180", status: "completed", action: "reconnected", remarks: "" },
        { id: 3, meterNo: "14284736577", name: "Alima Burhan", supplyLocation: "Kakamega Central, Street 45", lastMonthBalance: 3000, totalBalance: 7800, coordinates: "0.2750,34.7583,270", status: "pending", remarks: "" },
        { id: 4, meterNo: "060349422", name: "Ayub L Masai", supplyLocation: "Rural Kakamega Village", lastMonthBalance: 20, totalBalance: 45, coordinates: "0.3000,34.7500,0", status: "pending", remarks: "" },
        { id: 5, meterNo: "37187116985", name: "Alex Musiomi", supplyLocation: "Urban West Kenya, Apt 5", lastMonthBalance: 10, totalBalance: 30, coordinates: "0.2850,34.7600,135", status: "completed", action: "disconnected", remarks: "" }
      ]);
      setSupervisorRemarks([
        { text: "Follow up with James Otuma regarding payment plan", date: "2025-09-08 14:30" },
        { text: "Check all accounts in Kakamega region for meter tampering", date: "2025-09-07 09:15" }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('disconnectionAccounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('supervisorRemarks', JSON.stringify(supervisorRemarks));
  }, [supervisorRemarks]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Updated expected columns
        const expectedColumns = ['Meter_Number', 'Customer_Name', 'Supply_Location', 'Last_Month_Balance', 'Total_Balance', 'Coordinates'];
        const headers = Object.keys(jsonData[0] || {});
        const colMap = {};
        expectedColumns.forEach(col => {
          const matched = headers.find(h => h.toLowerCase().includes(col.toLowerCase()));
          if (matched) colMap[col] = matched;
        });

        const processedData = jsonData.map((row, index) => {
          // Parse coordinates (e.g., "lat,lng" or "lat,lng,bearing")
          const coordsStr = row[colMap.Coordinates] || row['Coordinates'] || '';
          const coordsParts = coordsStr.split(',');
          const lat = parseFloat(coordsParts[0]);
          const lng = parseFloat(coordsParts[1]);
          const bearing = coordsParts[2] ? parseFloat(coordsParts[2]) : 0;

          return {
            id: Date.now() + index,
            meterNo: row[colMap.Meter_Number] || row['Meter No'] || '',
            name: row[colMap.Customer_Name] || row['Customer Name'] || 'Unknown',
            supplyLocation: row[colMap.Supply_Location] || row['Supply Location'] || 'Unknown',
            lastMonthBalance: parseFloat(row[colMap.Last_Month_Balance] || row['Last Month Balance'] || 0) || 0,
            totalBalance: parseFloat(row[colMap.Total_Balance] || row['Total Balance'] || 0) || 0,
            coordinates: { lat: isNaN(lat) ? null : lat, lng: isNaN(lng) ? null : lng, bearing },
            status: 'pending',
            action: '',
            remarks: ''
          };
        }).filter(row => row.meterNo && row.name); // Filter valid rows

        if (processedData.length === 0) throw new Error('No valid data found. Check columns: Meter_Number, Customer_Name, Supply_Location, Last_Month_Balance, Total_Balance, Coordinates.');

        setAccounts(processedData);
        showToast(`Uploaded ${processedData.length} accounts successfully! Coordinates ready for mapping.`);
      } catch (error) {
        showToast(`Error uploading: ${error.message}. Ensure file has the required columns.`, 'error');
        console.error(error);
      }
      setIsUploading(false);
      e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const handleAction = (accountId, action) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        return {
          ...account,
          status: action === 'disconnect' ? 'completed' : account.status,
          action: action === 'disconnect' ? 'disconnected' : (action === 'reconnect' ? 'reconnected' : account.action)
        };
      }
      return account;
    }));
    showToast(`Account ${action === 'disconnect' ? 'disconnected' : 'reconnected'} successfully!`);
  };

  const updateAccountRemark = (accountId, remark) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        return { ...account, remarks: remark };
      }
      return account;
    }));
  };

  const addSupervisorRemark = () => {
    if (newRemark.trim()) {
      const now = new Date();
      const dateString = now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
      setSupervisorRemarks(prev => [
        { text: newRemark, date: dateString },
        ...prev
      ]);
      setNewRemark('');
      showToast('Remark added successfully!');
    }
  };

  const getStatusText = (account) => {
    if (account.status === 'completed') return 'Completed';
    if (account.totalBalance > 51) return 'Disconnect Required';
    return 'Compliant';
  };

  const getStatusClass = (account) => {
    if (account.status === 'completed') return 'completed';
    if (account.totalBalance > 51) return 'pending-high';
    return 'pending-low';
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = searchTerm === '' || 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.meterNo.includes(searchTerm) ||
      account.supplyLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'pending') matchesFilter = account.status === 'pending';
    if (filter === 'completed') matchesFilter = account.status === 'completed';
    if (filter === 'highPriority') matchesFilter = account.totalBalance > 50;
    if (filter === 'disconnections') matchesFilter = account.totalBalance > 51 && account.status === 'pending';
    if (filter === 'reconnections') matchesFilter = account.status === 'completed' && account.action === 'disconnected';
    if (filter === 'compliant') matchesFilter = account.totalBalance <= 51;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: accounts.length,
    pending: accounts.filter(a => a.status === 'pending').length,
    completed: accounts.filter(a => a.status === 'completed').length,
    highPriority: accounts.filter(a => a.totalBalance > 51).length,
    totalDebt: accounts.reduce((sum, a) => sum + a.totalBalance, 0)
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  // Generate Google Maps link (satellite view, precise navigation with bearing)
  const getMapLink = (account) => {
    if (!account.coordinates.lat || !account.coordinates.lng) return '#';
    const { lat, lng, bearing } = account.coordinates;
    const baseUrl = `https://www.google.com/maps?q=${lat},${lng}&t=k`; // t=k for satellite
    const heading = bearing ? `&heading=${bearing}` : ''; // Bearing for direction
    return `${baseUrl}${heading}`;
  };

  return (
    <div className="disconnections-page">
      <header className="disconnections-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Disconnections & Reconnections</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <main className="disconnections-main">
        <section className="upload-section">
          <h2>Upload Daily Debt List</h2>
          <div className={`upload-area ${isUploading ? 'uploading' : ''}`} onClick={() => !isUploading && fileInputRef.current.click()}>
            <i className="fas fa-file-excel"></i>
            <h3>{isUploading ? 'Uploading...' : 'Upload Daily Debt List Report'}</h3>
            <p>Drag & drop your Excel file here or click to browse</p>
            <p className="small">Supported format: .xlsx, .xls, .csv (with Coordinates for mapping)</p>
            <button className="btn btn-primary" disabled={isUploading}>
              <i className="fas fa-upload"></i> Browse Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv" 
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-cards-container">
            <div className="stat-card">
              <div className="stat-icon total"></div>
              <h4>Total Accounts</h4>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending"></div>
              <h4>Pending Actions</h4>
              <p className="stat-value">{stats.pending}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed"></div>
              <h4>Actioned/Completed</h4>
              <p className="stat-value">{stats.completed}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon high-priority"></div>
              <h4>High Priority (>Ksh 51)</h4>
              <p className="stat-value">{stats.highPriority}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon debt"></div>
              <h4>Total Debt</h4>
              <p className="stat-value">Ksh {stats.totalDebt.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="search-section">
          <div className="search-form">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filter by Meter Number (or Name/Location)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => setSearchTerm('')}>Clear</button>
          </div>
          
          <div className="filters">
            {['all', 'pending', 'completed', 'highPriority', 'disconnections', 'reconnections', 'compliant'].map(f => (
              <button 
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : 
                 f === 'highPriority' ? 'High Priority' : 
                 f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section className="accounts-section">
          <h2>Accounts List ({filteredAccounts.length} shown)</h2>
          <div className="accounts-table-container">
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Meter Number</th>
                  <th>Customer Name</th>
                  <th>Supply Location</th>
                  <th>Last Month Bill/Balance (Ksh)</th>
                  <th>Total Bill/Balance (Ksh)</th>
                  <th>Location/Coordinates</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map(account => (
                  <tr key={account.id} data-status={account.status}>
                    <td>{account.meterNo}</td>
                    <td>{account.name}</td>
                    <td>{account.supplyLocation}</td>
                    <td>{account.lastMonthBalance.toLocaleString()}</td>
                    <td className={account.totalBalance > 50 ? 'debt-high' : 'debt-low'}>
                      {account.totalBalance.toLocaleString()}
                    </td>
                    <td>
                      {account.coordinates.lat && account.coordinates.lng ? (
                        <a 
                          href={getMapLink(account)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="map-link"
                          title="Open in Google Maps Satellite View (Precise Navigation)"
                        >
                          {account.coordinates.lat.toFixed(4)}, {account.coordinates.lng.toFixed(4)}
                          {account.coordinates.bearing ? ` (Bearing: ${account.coordinates.bearing}°)` : ''}
                        </a>
                      ) : (
                        'No Coordinates'
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${getStatusClass(account)}`}>
                        {getStatusText(account)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {account.status === 'completed' ? (
                          <button 
                            className="btn-sm btn-success"
                            onClick={() => handleAction(account.id, 'reconnect')}
                          >
                            Reconnect
                          </button>
                        ) : account.totalBalance > 51 ? (
                          <button 
                            className="btn-sm btn-danger"
                            onClick={() => handleAction(account.id, 'disconnect')}
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button className="btn-sm btn-success" disabled>
                            Compliant
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="remarks-input" 
                        placeholder="Add remarks"
                        value={account.remarks}
                        onChange={(e) => updateAccountRemark(account.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                      No accounts match the filter. Upload data or adjust search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="remarks-section">
          <h2>Supervisor/General Remarks</h2>
          <div className="remarks-form">
            <input 
              type="text" 
              className="remarks-input" 
              placeholder="Add general remarks for supervisors to follow up"
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSupervisorRemark()}
            />
            <button className="btn btn-primary" onClick={addSupervisorRemark}>
              Add Remark
            </button>
          </div>
          <div className="remarks-list">
            {supervisorRemarks.map((remark, index) => (
              <div key={index} className="remark-item">
                <div className="remark-text">{remark.text}</div>
                <div className="remark-date">Added on: {remark.date}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: '', type: 'success' })} 
        />
      )}
    </div>
  );
}

export default DisconnectionsPage;
