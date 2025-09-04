// src/LoginPage.js - Now with redirect
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- IMPORT THIS
import axios from 'axios';
import './LoginPage.css';
import logo from './kplc-logo.png';

function LoginPage() {
  const [staffNumber, setStaffNumber] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate(); // <-- INITIALIZE THE NAVIGATOR

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!staffNumber || !pin) {
      alert('Please enter both Staff Number and PIN.');
      return;
    }

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    if (!apiBaseUrl) {
      alert('CRITICAL ERROR: API URL is not configured.');
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/token`,
        new URLSearchParams({
          username: staffNumber,
          password: pin,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data && response.data.access_token) {
        // Login is successful!
        console.log('Access Token:', response.data.access_token);
        
        // Save the token for future use (e.g., in localStorage)
        localStorage.setItem('accessToken', response.data.access_token);

        // *** THE NEW PART: REDIRECT TO THE DASHBOARD ***
        navigate('/dashboard'); 
      } else {
        alert('Login failed: Invalid response from server.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert('Login Failed: Invalid Staff Number or PIN.');
        } else {
          alert(`Login Failed: Server error (Status: ${error.response.status})`);
        }
      } else if (error.request) {
        alert('Login Failed: Could not connect to the server.');
      } else {
        alert(`An unexpected error occurred: ${error.message}`);
      }
    }
  };

  return (
    <div className="login-page">
      {/* The rest of your JSX is the same as before */}
      <div className="login-header">
        <img src={logo} alt="Kenya Power Logo" className="login-logo" />
        <h1 className="login-title-main">Kakamega Field Ops 2.0</h1>
      </div>

      <div className="login-container">
        <h2 className="login-title-form">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="Staff Number"
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
      
      <div className="footer-signature">
        <a href="https://www.martindev.co.ke" target="_blank" rel="noopener noreferrer">
          www.martindev.co.ke
        </a>
      </div>
    </div>
   );
}

export default LoginPage;
