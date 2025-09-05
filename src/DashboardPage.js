// src/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import logo from './kplc-logo.png';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const GridIcon = ({ label }) => (
  <div className="grid-icon">
    <div className="icon-placeholder"></div>
    <span>{label}</span>
  </div>
);

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name || 'User');
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="app-title-container">
          <img src={logo} alt="Logo" className="header-logo" />
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <section className="greeting-section">
        <div className="greeting-text">
          <h2>{getGreeting()},</h2>
          <h1>{userName} 👋</h1>
        </div>
      </section>

      <main className="dashboard-main">
        <section className="stats-section">
          <h3>Quick Stats</h3>
          <div className="stats-cards-container">
            <div className="stat-card">
              <h4>Inspections Today</h4>
              <p>0</p>
            </div>
            <div className="stat-card">
              <h4>Active Cases</h4>
              <p>0</p>
            </div>
            <div className="stat-card">
              <h4>Pending Sync</h4>
              <p>0</p>
            </div>
          </div>
        </section>

        <section className="actions-section">
          <h3>What would you like to do?</h3>
          <div className="actions-grid">
            <div onClick={() => navigate('/meter-inspection')}>
              <GridIcon label="Meter Inspection" />
            </div>
            <GridIcon label="Report Outage" />
            <GridIcon label="Fraud Detector" />
            <GridIcon label="View Reports" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
