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
      setAccounts([
        { id: 1, name: "James Otuma", accountNo: "125510073", meterNo: "54401312787", region: "Kakamega, West Kenya", status: "pending", balance: 4250, remarks: "" },
        { id: 2, name: "Mose Malava", accountNo: "145040648", meterNo: "37195030541", region: "Kakamega, West Kenya", status: "completed", action: "reconnected", balance: 3800, remarks: "" },
        { id: 3, name: "Alima Burhan", accountNo: "145240891", meterNo: "14284736577", region: "Kakamega, West Kenya", status: "pending", balance: 7800, remarks: "" },
        { id: 4, name: "Ayub L Masai", accountNo: "30071419", meterNo: "060349422", region: "Kakamega, West Kenya", status: "pending", balance: 45, remarks: "" },
        { id: 5, name: "Alex Musiomi", accountNo: "110648177", meterNo: "37187116985", region: "Kakamega, West Kenya", status: "completed", action: "disconnected", balance: 30, remarks: "" }
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

        const expectedColumns = ['Account_Number', 'Customer_Name', 'Meter_Number', 'Region', 'Bill_Balance'];
        const headers = Object.keys(jsonData[0] || {});
        const colMap = {};
        expectedColumns.forEach(col => {
          const matched = headers.find(h => h.toLowerCase().includes(col.toLowerCase()));
          if (matched) colMap[col] = matched;
        });

        const processedData = jsonData.map((row, index) => ({
          id: Date.now() + index,
          accountNo: row[colMap.Account_Number] || row['Account No'] || '',
          name: row[colMap.Customer_Name] || row['Customer Name'] || 'Unknown',
          meterNo: row[colMap.Meter_Number] || row['Meter No'] || '',
          region: row[colMap.Region] || row['Region'] || 'Unknown',
          balance: parseFloat(row[colMap.Bill_Balance] || row['Balance'] || 0) || 0,
          status: 'pending',
          action: '',
          remarks: ''
        })).filter(row => row.accountNo && row.meterNo);

        if (processedData.length === 0) throw new Error('No valid data found. Check columns.');

        setAccounts(processedData);
        showToast(`Uploaded ${processedData.length} accounts successfully!`);
      } catch (error) {
        showToast(`Error uploading: ${error.message}. Ensure file has columns like Account_Number, Customer_Name, etc.`, 'error');
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
    if (account.balance > 51) return 'Disconnect Required';
    return 'Compliant';
  };

  const getStatusClass = (account) => {
    if (account.status === 'completed') return 'completed';
    if (account.balance > 51) return 'pending-high';
    return 'pending-low';
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = searchTerm === '' || 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNo.includes(searchTerm) ||
      account.meterNo.includes(searchTerm);
    
    let matchesFilter = true;
    if (filter === 'pending') matchesFilter = account.status === 'pending';
    if (filter === 'completed') matchesFilter = account.status === 'completed';
    if (filter === 'highPriority') matchesFilter = account.balance > 50;
    if (filter === 'disconnections') matchesFilter = account.balance > 51 && account.status === 'pending';
    if (filter === 'reconnections') matchesFilter = account.status === 'completed' && account.action === 'disconnected';
    if (filter === 'compliant') matchesFilter = account.balance <= 51;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: accounts.length,
    pending: accounts.filter(a => a.status === 'pending').length,
    completed: accounts.filter(a => a.status === 'completed').length,
    highPriority: accounts.filter(a => a.balance > 51).length,
    totalDebt: accounts.reduce((sum, a) => sum + a.balance, 0)
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="disconnections-page">
      <header className="disconnections-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </header>

      <main className="disconnections-main">
        <section className="upload-section">
          <h2>Upload Daily Debt List</h2>
          <div className={`upload-area ${isUploading ? 'uploading' : ''}`} onClick={() => !isUploading && fileInputRef.current.click()}>
            <i className="fas fa-file-excel"></i>
            <h3>{isUploading ? 'Uploading...' : 'Upload Daily Debt List Report'}</h3>
            <p>Drag & drop your Excel file here or click to browse</p>
            <p className="small">Supported format: .xlsx, .xls, .csv</p>
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
              <h4>High Priority (&gt;Ksh 51)</h4>
              <p className="stat-value">{stats.highPriority}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon debt"></div>
              <h4>Total Debt</h4>
              <p className="stat-value">KES {stats.totalDebt.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="search-section">
          <div className="search-form">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filter by Meter Number, Account No, or Customer Name"
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
                  <th>Account No</th>
                  <th>Customer Name</th>
                  <th>Meter No</th>
                  <th>Region</th>
                  <th>Debt Amount (Ksh)</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map(account => (
                  <tr key={account.id} data-status={account.status}>
                    <td>{account.accountNo}</td>
                    <td>{account.name}</td>
                    <td>{account.meterNo}</td>
                    <td>{account.region}</td>
                    <td className={account.balance > 50 ? 'debt-high' : 'debt-low'}>
                      {account.balance.toLocaleString()}
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
                        ) : account.balance > 51 ? (
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
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
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
