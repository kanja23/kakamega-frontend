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
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAdjustment: 0
  });

  useEffect(() => {
    // Load existing requests from localStorage
    const savedRequests = JSON.parse(localStorage.getItem('rebillingRequests') || '[]');
    setRequests(savedRequests);
    updateStats(savedRequests);
    
    // Check user role (simplified example)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.role) {
      setUserRole(userData.role);
    }
  }, []);

  const updateStats = (requests) => {
    const total = requests.length;
    const pending = requests.filter(req => req.status === 'pending').length;
    const approved = requests.filter(req => req.status === 'approved').length;
    const rejected = requests.filter(req => req.status === 'rejected').length;
    const totalAdjustment = requests.reduce((sum, req) => sum + parseFloat(req.adjustmentAmount || 0), 0);
    
    setStats({ total, pending, approved, rejected, totalAdjustment });
    
    // Also update localStorage for reports
    localStorage.setItem('rebillingStats', JSON.stringify({
      total, pending, approved, rejected, totalAdjustment
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-calculate adjustment amount if both bills are provided
    if ((name === 'oldBill' || name === 'newBill') && formData.oldBill && formData.newBill) {
      const oldBillVal = name === 'oldBill' ? parseFloat(value) : parseFloat(formData.oldBill);
      const newBillVal = name === 'newBill' ? parseFloat(value) : parseFloat(formData.newBill);
      const adjustment = newBillVal - oldBillVal;
      
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

  const sendRebillingEmail = (requestData, action = 'submission') => {
    // Get user data for email
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Prepare email template parameters
    const templateParams = {
      to_name: action === 'submission' ? 'Billing Department' : userData.full_name || 'Field Officer',
      from_name: userData.full_name || 'Field Officer',
      account_number: requestData.accountNo,
      old_bill: requestData.oldBill,
      new_bill: requestData.newBill,
      adjustment_amount: requestData.adjustmentAmount,
      reason: requestData.reason,
      date: new Date(requestData.timestamp).toLocaleDateString(),
      officer_name: userData.full_name || 'Unknown Officer',
      officer_id: userData.staff_id || 'Unknown ID',
      status: requestData.status,
      action: action,
      to_email: action === 'submission' ? 'billing@kplc.com' : userData.email,
      reply_to: userData.email || 'field@kplc.com'
    };

    // Send email using EmailJS
    emailjs.send('service_your_service_id', 'template_rebilling_request', templateParams, 'Qn5t9k9qX720n3G9_')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new request
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const newRequest = {
      ...formData,
      id: Date.now(),
      officerName: userData.full_name || 'Unknown Officer',
      officerId: userData.staff_id || 'Unknown ID',
      timestamp: new Date().toISOString()
    };
    
    // Save to state and localStorage
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('rebillingRequests', JSON.stringify(updatedRequests));
    updateStats(updatedRequests);
    
    // Send email notification
    sendRebillingEmail(newRequest, 'submission');
    
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
      message: 'Rebilling request submitted successfully! Email sent to billing department.',
      type: 'success'
    });
  };

  const handleApprove = (id) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('rebillingRequests', JSON.stringify(updatedRequests));
    updateStats(updatedRequests);
    
    // Send approval email
    const approvedRequest = requests.find(req => req.id === id);
    if (approvedRequest) {
      sendRebillingEmail(approvedRequest, 'approval');
    }
    
    setToast({
      show: true,
      message: 'Request approved! Email notification sent.',
      type: 'success'
    });
  };

  const handleReject = (id) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('rebillingRequests', JSON.stringify(updatedRequests));
    updateStats(updatedRequests);
    
    // Send rejection email
    const rejectedRequest = requests.find(req => req.id === id);
    if (rejectedRequest) {
      sendRebillingEmail(rejectedRequest, 'rejection');
    }
    
    setToast({
      show: true,
      message: 'Request rejected. Email notification sent.',
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
        {/* Stats Section */}
        <section className="stats-section">
          <h2>Rebilling Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Requests</h3>
              <p>{stats.total}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{stats.pending}</p>
            </div>
            <div className="stat-card">
              <h3>Approved</h3>
              <p>{stats.approved}</p>
            </div>
            <div className="stat-card">
              <h3>Rejected</h3>
              <p>{stats.rejected}</p>
            </div>
            <div className="stat-card">
              <h3>Total Adjustment</h3>
              <p>KES {stats.totalAdjustment.toLocaleString()}</p>
            </div>
          </div>
        </section>

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
                  <p>Status: <strong className={`status-${request.status}`}>{request.status}</strong></p>
                  <p>Officer: {request.officerName}</p>
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
