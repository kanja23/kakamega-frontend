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

const GridIcon = ({ label, iconSvg, color }) => (
  <div className="grid-icon" style={{ '--icon-color': color }}>
    <div className="icon-container">
      {iconSvg}
    </div>
    <span>{label}</span>
  </div>
);

// SVG Icons as React components
const MeterInspectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const ReportOutageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
  </svg>
);

const AnomaliesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const ZeroBillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-8 6h-2v2h2v2h-2v2H8v-2H6v-2h2v-2h2V8h2v2h2v2zm4 6h-8v-2h8v2zm0-4h-8v-2h8v2z"/>
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
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
          <h2> field reports.io</h2>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <section className="greeting-section">
        <div className="greeting-text">
          <h2>{getGreeting()},</h2>
          <h1>{userName} <span className="waving-hand">👋</span></h1>
        </div>
      </section>

      <main className="dashboard-main">
        <section className="stats-section">
          <h3>Today's Overview</h3>
          <div className="stats-cards-container">
            <div className="stat-card">
              <div className="stat-icon inspections"></div>
              <h4>Inspections</h4>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon cases"></div>
              <h4>Active Cases</h4>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon sync"></div>
              <h4>Pending Sync</h4>
              <p className="stat-value">0</p>
            </div>
          </div>
        </section>

        <section className="actions-section">
          <h3>What would you like to do?</h3>
          <div className="actions-grid">
            <div onClick={() => navigate('/meter-inspection')}>
              <GridIcon 
                iconSvg={<MeterInspectionIcon />}
                label="Meter Inspection" 
                color="#0066cc" 
              />
            </div>
            <div>
              <GridIcon 
                iconSvg={<ReportOutageIcon />}
                label="Report Outage" 
                color="#ff6633" 
              />
            </div>
            <div>
              <GridIcon 
                iconSvg={<AnomaliesIcon />}
                label="Anomalies Found" 
                color="#ffcc00" 
              />
            </div>
            <div>
              <GridIcon 
                iconSvg={<ZeroBillIcon />}
                label="Zero Bill" 
                color="#33cc33" 
              />
            </div>
            <div>
              <GridIcon 
                iconSvg={<ReportsIcon />}
                label="View Reports" 
                color="#9966cc" 
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
