// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import logo from './kplc-logo.png';

function LoginPage() {
  const [staffNumber, setStaffNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const params = new URLSearchParams();
    params.append('username', staffNumber);
    params.append('password', pin);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/token`,
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
      setError('Login Failed: Invalid credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Kenya Power Logo" className="login-logo" />
        <h1 className="login-title">Kakamega Field Ops</h1>
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
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-footer">
          <a href="https://www.martindev.co.ke" target="_blank" rel="noopener noreferrer">
            www.martindev.co.ke
          </a>
        </p>
      </div>
    </div>
   );
}

export default LoginPage;
