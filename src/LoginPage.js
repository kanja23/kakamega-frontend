import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="logo-container">
          <img src="/kplc-logo.png" alt="Kenya Power Logo" className="login-logo" />
        </div>
        <h1 className="app-title">Kakamega mypower 2.0</h1>
        <p className="app-subtitle">Field Staff Reporting System</p>
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="staff-number">Staff Number</label>
            <input type="text" id="staff-number" placeholder="Enter your staff number" />
          </div>
          <div className="input-group">
            <label htmlFor="pin">PIN</label>
            <input type="password" id="pin" placeholder="Enter your PIN" />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="powered-by">
          <a href="https://martindev.co.ke" target="_blank" rel="noopener noreferrer">
            powered by martindev.co.ke
          </a>
        </p>
      </div>
    </div>
   );
};
export default LoginPage;
