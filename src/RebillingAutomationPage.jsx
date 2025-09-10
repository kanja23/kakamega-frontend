import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './RebillingAutomationPage.css';
import Toast from './Toast';
import logo from './kplc-logo.png';
import twilio from 'twilio'; // Import Twilio

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

  // Twilio credentials (move to .env in production)
  const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID || 'your_account_sid';
  const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN || 'your_auth_token';
  const twilioPhoneNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER || '+1234567890'; // Replace with your Twilio number
  const client = twilio(accountSid, authToken);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const savedRequests = localStorage.getItem('rebillRequests');
    if (savedRequests) setRequests(JSON.parse(savedRequests));
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setUserRole(userData.role || 'officer');
    showToast('Review Safety Rules Section 2.7 for Permit-to-Work before adjustments.', 'info');
  }, []);

  useEffect(() => {
    localStorage.setItem('rebillRequests', JSON.stringify(requests));
  }, [requests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: name === 'oldBill' || name === 'newBill' ? parseFloat(value) || 0 : value };
      newData.adjustmentAmount = newData.newBill - newData.oldBill;
      return newData;
    });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, evidencePhoto: file, evidencePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitRequest = () => {
    if (!formData.accountNo || !formData.reason || formData.adjustmentAmount === 0) {
      showToast('Complete account, reason, and bill amounts. Upload evidence for quick approval.', 'error');
      return;
    }
    const newRequest = { ...formData, id: Date.now() };
    setRequests(prev => [...prev, newRequest]);
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
    fileInputRef.current.value = '';
    showToast('Rebill/Debit request submitted. Reducing approvals for faster resolution!', 'success');
  };

  const approveRequest = (id, level) => {
    const request = requests.find(r => r.id === id);
    if (!request || request.status !== 'pending') return;
    if (Math.abs(request.adjustmentAmount) < 1000 && level === 1) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', approverLevel: level + 1 } : r));
      showToast('Low-value request auto-approved. Notify customer.', 'success');
      sendSMS(request.accountNo, `Your bill adjustment of Ksh ${request.adjustmentAmount} is approved.`);
    } else if (userRole === 'supervisor' && level === 2) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', approverLevel: level + 1 } : r));
      showToast('Approved at supervisor level. Escalate if needed.', 'success');
    } else if (userRole === 'final' && level === 3) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'processed' } : r));
      showToast('Final approval complete. Bill updated.', 'success');
      sendSMS(request.accountNo, `Your bill has been adjusted by Ksh ${request.adjustmentAmount}. Contact us at 95551 for queries.`);
    } else {
      showToast('Not authorized for this level. Escalate.', 'error');
    }
  };

  const rejectRequest = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    showToast('Request rejected. Inform field staff.', 'error');
  };

  const deleteRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast('Request deleted.', 'info');
  };

  const getStatusColor = (status) => {
    return status === 'processed' ? '#28a745' : status === 'approved' ? '#ffcc00' : status === 'rejected' ? '#dc3545' : '#6c757d';
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const closeToast = () => setToast({ show: false, message: '', type: 'success' });

  // Function to send SMS using Twilio
  const sendSMS = async (accountNo, message) => {
    try {
      // Replace with actual customer phone number (e.g., from accountNo lookup or hardcoded for testing)
      const toPhoneNumber = '+254712345678'; // Example Kenyan number; update dynamically
      await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: toPhoneNumber
      });
      showToast('SMS notification sent successfully.', 'success');
    } catch (error) {
      console.error('Error sending SMS:', error);
      showToast('Failed to send SMS. Check credentials or network.', 'error');
    }
  };

  return (
    <div className="rebill-container">
      <header className="rebill-header">
        <div className="app-title-container">
          <img src={logo} alt="KPLC Logo" className="header-logo" />
          <h1>Rebilling & Debit Automation</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <nav className="rebill-nav">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <p className="rebill-note">Streamline approvals for wrong readings/bills. Role: {userRole.toUpperCase()}</p>
      </nav>

      <main className="rebill-main">
        <section className="form-section">
          <h2>Initiate Rebill/Debit Adjustment</h2>
          <form className="rebill-form">
            <input name="accountNo" placeholder="Account Number" value={formData.accountNo} onChange={handleInputChange} />
            <input name="oldBill" type="number" placeholder="Old Bill Amount (Ksh)" value={formData.oldBill} onChange={handleInputChange} />
            <input name="newBill" type="number" placeholder="New Bill Amount (Ksh)" value={formData.newBill} onChange={handleInputChange} />
            <p>Adjustment Amount: Ksh {formData.adjustmentAmount.toLocaleString()}</p>
            <select name="reason" value={formData.reason} onChange={handleInputChange}>
              <option value="wrong reading">Wrong Reading</option>
              <option value="meter fault">Meter Fault</option>
              <option value="overbilling">Overbilling</option>
              <option value="other">Other</option>
            </select>
            <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" />
            {formData.evidencePreview && <img src={formData.evidencePreview} alt="Evidence" className="evidence-preview" />}
            <button type="button" onClick={submitRequest} className="btn-primary">Submit Request</button>
          </form>
        </section>

        <section className="requests-section">
          <h2>Requests List ({requests.length})</h2>
          <div className="requests-list">
            {requests.map(request => (
              <div key={request.id} className="request-card" style={{ borderLeft: `4px solid ${getStatusColor(request.status)}` }}>
                <h3>Account: {request.accountNo}</h3>
                <p>Old Bill: Ksh {request.oldBill.toLocaleString()} | New Bill: Ksh {request.newBill.toLocaleString()}</p>
                <p>Adjustment: Ksh {request.adjustmentAmount.toLocaleString()}</p>
                <p>Reason: {request.reason}</p>
                {request.evidencePreview && <img src={request.evidencePreview} alt="Evidence" className="evidence-photo" />}
                <p>Status: {request.status.toUpperCase()} (Level {request.approverLevel}/3)</p>
                <p>Time: {new Date(request.timestamp).toLocaleString()}</p>
                {request.status === 'pending' && (
                  <div className="action-buttons">
                    {userRole === 'officer' && request.approverLevel === 1 && Math.abs(request.adjustmentAmount) < 1000 && (
                      <button onClick={() => approveRequest(request.id, 1)} className="btn-success">Auto-Approve (Low-Value)</button>
                    )}
                    {userRole === 'supervisor' && request.approverLevel === 2 && (
                      <button onClick={() => approveRequest(request.id, 2)} className="btn-success">Approve</button>
                    )}
                    <button onClick={() => rejectRequest(request.id)} className="btn-danger">Reject</button>
                  </div>
                )}
                <button onClick={() => deleteRequest(request.id)} className="btn-danger">Delete</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}

export default RebillingAutomationPage;
