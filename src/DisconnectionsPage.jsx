import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DisconnectionsPage.css';
import Toast from './Toast';

function DisconnectionsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [accounts, setAccounts] = useState([
    { id: 1, name: "James Otuma", accountNo: "125510073", meterNo: "54401312787", region: "Kakamega, West Kenya", status: "pending", balance: 4250, remarks: "" },
    { id: 2, name: "Mose Malava", accountNo: "145040648", meterNo: "37195030541", region: "Kakamega, West Kenya", status: "completed", action: "reconnected", balance: 3800, remarks: "" },
    { id: 3, name: "Alima Burhan", accountNo: "145240891", meterNo: "14284736577", region: "Kakamega, West Kenya", status: "pending", balance: 7800, remarks: "" },
    { id: 4, name: "Ayub L Masai", accountNo: "30071419", meterNo: "060349422", region: "Kakamega, West Kenya", status: "pending", balance: 45, remarks: "" },
    { id: 5, name: "Alex Musiomi", accountNo: "110648177", meterNo: "37187116985", region: "Kakamega, West Kenya", status: "completed", action: "disconnected", balance: 30, remarks: "" }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [supervisorRemarks, setSupervisorRemarks] = useState([
    { text: "Follow up with James Otuma regarding payment plan", date: "2023-10-05 14:30" },
    { text: "Check all accounts in Kakamega region for meter tampering", date: "2023-10-04 09:15" }
  ]);
  const [newRemark, setNewRemark] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would process the Excel file here
      showToast('Debt list uploaded successfully!');
      // Simulate adding new accounts from the file
      setAccounts(prev => [
        ...prev,
        {
          id: Date.now(),
          name: "New Customer",
          accountNo: "999999999",
          meterNo: "99999999999",
          region: "New Region",
          status: "pending",
          balance: 100,
          remarks: ""
        }
      ]);
    }
  };

  const handleAction = (accountId, action) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        return {
          ...account,
          status: action === 'disconnect' ? 'completed' : 'pending',
          action: action === 'disconnect' ? 'disconnected' : 'reconnected'
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
      const dateString = now.toLocaleDateString();
      const timeString = now.toLocaleTimeString();
      
      setSupervisorRemarks(prev => [
        { text: newRemark, date: `${dateString} ${timeString}` },
        ...prev
      ]);
      setNewRemark('');
      showToast('Remark added successfully!');
    }
  };

  const filteredAccounts = accounts.filter(account => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNo.includes(searchTerm) ||
      account.meterNo.includes(searchTerm);
    
    // Apply status filter
    let matchesFilter = true;
    if (filter === 'pending') matchesFilter = account.status === 'pending';
    if (filter === 'completed') matchesFilter = account.status === 'completed';
    if (filter === 'highPriority') matchesFilter = account.balance > 50;
    if (filter === 'disconnections') matchesFilter = account.balance > 50 && account.status === 'pending';
    if (filter === 'reconnections') matchesFilter = account.status === 'completed';
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: accounts.length,
    pending: accounts.filter(a => a.status === 'pending').length,
    completed: accounts.filter(a => a.status === 'completed').length,
    totalDebt: accounts.reduce((sum, account) => sum + account.balance, 0)
  };

  return (
    <div className="disconnections-page">
      <header className="disconnections-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <h1>Disconnections & Reconnections</h1>
      </header>

      <main className="disconnections-main">
        <section className="upload-section">
          <h2>Upload Daily Debt List</h2>
          <div className="upload-area" onClick={() => fileInputRef.current.click()}>
            <i className="fas fa-file-excel"></i>
            <h3>Upload Daily Debt List Report</h3>
            <p>Drag & drop your Excel file here or click to browse</p>
            <p className="small">Supported format: .xlsx, .xls, .csv</p>
            <button className="btn btn-primary">
              <i className="fas fa-upload"></i> Browse Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv" 
              style={{ display: 'none' }}
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
              <h4>Completed</h4>
              <p className="stat-value">{stats.completed}</p>
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
              placeholder="Search by account number, meter number, or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary">Search</button>
          </div>
          
          <div className="filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={`filter-btn ${filter === 'highPriority' ? 'active' : ''}`}
              onClick={() => setFilter('highPriority')}
            >
              High Priority
            </button>
            <button 
              className={`filter-btn ${filter === 'disconnections' ? 'active' : ''}`}
              onClick={() => setFilter('disconnections')}
            >
              Disconnections
            </button>
            <button 
              className={`filter-btn ${filter === 'reconnections' ? 'active' : ''}`}
              onClick={() => setFilter('reconnections')}
            >
              Reconnections
            </button>
          </div>
        </section>

        <section className="accounts-section">
          <h2>Accounts List</h2>
          <div className="accounts-table-container">
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Account No</th>
                  <th>Customer Name</th>
                  <th>Meter No</th>
                  <th>Region</th>
                  <th>Debt Amount</th>
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
                      KES {account.balance.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge status-${account.status}`}>
                        {account.status === 'pending' ? 'Pending' : 'Completed'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {account.balance > 50 && account.status === 'pending' ? (
                          <button 
                            className="btn-sm btn-danger"
                            onClick={() => handleAction(account.id, 'disconnect')}
                          >
                            Disconnect
                          </button>
                        ) : account.status === 'completed' ? (
                          <button 
                            className="btn-sm btn-success"
                            onClick={() => handleAction(account.id, 'reconnect')}
                          >
                            Reconnect
                          </button>
                        ) : (
                          <button className="btn-sm" disabled>
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
              </tbody>
            </table>
          </div>
        </section>

        <section className="remarks-section">
          <h2>Supervisor Remarks</h2>
          <div className="remarks-form">
            <input 
              type="text" 
              className="remarks-input" 
              placeholder="Add general remarks for supervisors"
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
