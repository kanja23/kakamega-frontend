import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
// Placeholder for logo - upload kplc-logo.png to src/
import logo from './kplc-logo.png';

function LoginPage() {
  const [staffNumber, setStaffNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Only added this line
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true); // Added this line

    const params = new URLSearchParams();
    params.append('username', staffNumber);
    params.append('password', pin);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.access_token && response.data.user_data) {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('userData', JSON.stringify(response.data.user_data));
        navigate('/dashboard');
      } else {
        setError('Login Failed: Invalid response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(`Login Failed: ${err.response.data.detail || 'Server error'}`);
      } else if (err.request) {
        setError('Login Failed: Cannot connect to server. Please check your connection.');
      } else {
        setError('Login Failed: An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false); // Added this line
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="brand-container">
          <span className="tusichome-brand">Tusichome Brand</span>
        </div>
      </div>
      
      <div className="login-box">
        <div className="logo-container">
          <img src={logo} alt="Kenya Power Logo" className="login-logo" />
        </div>
        
        <h1 className="login-title">Kakamega Field Ops 2.0</h1>
        <p className="login-subtitle">Field Staff Reporting System</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="staffNumber">Staff Number</label>
            <input
              id="staffNumber"
              type="text"
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
              placeholder="Enter your staff number"
              required
              disabled={isLoading} // Added this attribute
            />
          </div>
          <div className="input-group">
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              required
              disabled={isLoading} // Added this attribute
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading} // Added this attribute
          >
            {isLoading ? ( // Only changed this part
              <span className="button-loading">
                <span className="button-spinner"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="login-footer">
          <a href="By Martin"target=">
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
