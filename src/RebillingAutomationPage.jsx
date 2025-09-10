import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './RebillingAutomationPage.css';
import Toast from './Toast';
import logo from './kplc-logo.png';

function RebillingAutomationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    accountNo: '',
    oldBill: 0,
    newBill: 0,
    adjustmentAmount: 0,
    reason: 'wrong reading',
    evidencePhoto: null,
    evidencePreview: null,
    status: 'pending',
    approverLevel: 1,
    timestamp: new Date().toISOString()
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [userRole, setUserRole] = useState('officer');

  useEffect(() => {
    // Load existing requests from localStorage
    const savedRequests = JSON.parse(localStorage.getItem('rebillingRequests') || '[]');
    setRequests(savedRequests);
    
    // Check user role (simplified example)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.role) {
      setUserRole(userData.role);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-calculate adjustment amount if both bills are provided
    if ((name === 'oldBill' || name === 'newBill') && formData.oldBill && formData.newBill) {
      const adjustment = parseFloat(formData.newBill) - parseFloat(formData.oldBill);
      setFormData(prev => ({
        ...prev,
        adjustmentAmount: adjustment
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          evidencePhoto: file,
          evidencePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new request
    const newRequest = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    // Save to state and localStorage
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('rebillingRequests', JSON.stringify(updatedRequests));
    
    // Reset form
    setFormData({
      accountNo: '',
      oldBill: 0,
      newBill: 0,
      adjustmentAmount: 0,
      reason: 'wrong reading',
      evidencePhoto: null,
      evidencePreview: null,
      status: 'pending',
      approverLevel: 1,
      timestamp: new Date().toISOString()
    });
    
    // Show success message
    setToast({
      show: true,
      message: 'Rebilling request submitted successfully!',
      type: 'success'
    });
  };

  const handleApprove = (id) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('rebillingRequests', JSON.stringify(updatedRequests));
    
    setToast({
      show: true,
      message: 'Request approved!',
      type: 'success'
    });
  };

  const handleReject = (id) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('rebillingRequests', JSON.stringify(updatedRequests));
    
    setToast({
      show: true,
      message: 'Request rejected.',
      type: 'info'
    });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  return (
    <div className="rebill-container">
      <header className="rebill-header">
        <div className="app-title-container">
          <img src={logo} alt="KPLC Logo" className="header-logo" />
          <h1>Rebilling Automation</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} className="logout-button">
          Back to Dashboard
        </button>
      </header>

      <nav className="rebill-nav">
        <p className="rebill-note">
          Submit rebilling requests for customer account adjustments
        </p>
      </nav>

      <main className="rebill-main">
        <section className="form-section">
          <h2>Submit Rebilling Request</h2>
          <form className="rebill-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="accountNo"
              placeholder="Account Number"
              value={formData.accountNo}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="oldBill"
              placeholder="Old Bill Amount"
              value={formData.oldBill}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="newBill"
              placeholder="New Bill Amount"
              value={formData.newBill}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="adjustmentAmount"
              placeholder="Adjustment Amount"
              value={formData.adjustmentAmount}
              onChange={handleInputChange}
              disabled
            />
            <select
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
            >
              <option value="wrong reading">Wrong Meter Reading</option>
              <option value="billing error">Billing Error</option>
              <option value="tariff change">Tariff Change</option>
              <option value="other">Other</option>
            </select>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => fileInputRef.current.click()}
              >
                Upload Evidence
              </button>
              {formData.evidencePreview && (
                <img 
                  src={formData.evidencePreview} 
                  alt="Evidence preview" 
                  className="evidence-preview" 
                />
              )}
            </div>
            <button type="submit" className="btn-success">
              Submit Request
            </button>
          </form>
        </section>

        <section className="requests-section">
          <h2>Rebilling Requests</h2>
          <div className="requests-list">
            {requests.length === 0 ? (
              <p>No rebilling requests yet.</p>
            ) : (
              requests.map(request => (
                <div key={request.id} className="request-card">
                  <h3>Account: {request.accountNo}</h3>
                  <p>Old Bill: KES {request.oldBill}</p>
                  <p>New Bill: KES {request.newBill}</p>
                  <p>Adjustment: KES {request.adjustmentAmount}</p>
                  <p>Reason: {request.reason}</p>
                  <p>Status: <strong>{request.status}</strong></p>
                  <p>Date: {new Date(request.timestamp).toLocaleDateString()}</p>
                  
                  {request.evidencePreview && (
                    <img 
                      src={request.evidencePreview} 
                      alt="Evidence" 
                      className="evidence-photo" 
                    />
                  )}
                  
                  {userRole === 'supervisor' && request.status === 'pending' && (
                    <div className="action-buttons">
                      <button 
                        className="btn-success" 
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-danger" 
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
}

export default RebillingAutomationPage;
