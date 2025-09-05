// src/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import logo from './kplc-logo.png';

// Import icons from react-icons
import { FaSearch, FaPhone, FaExclamationTriangle, FaFileInvoiceDollar, FaChartBar } from 'react-icons/fa';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const GridIcon = ({ icon: Icon, label, color }) => (
  <div className="grid-icon" style={{ '--icon-color': color }}>
    <div className="icon-container">
      <Icon className="grid-icon-svg" />
    </div>
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
                icon={FaSearch} 
                label="Meter Inspection" 
                color="#0066cc" 
              />
            </div>
            <div>
              <GridIcon 
                icon={FaPhone} 
                label="Report Outage" 
                color="#ff6633" 
              />
            </div>
            <div>
              <GridIcon 
                icon={FaExclamationTriangle} 
                label="Anomalies Found" 
                color="#ffcc00" 
              />
            </div>
            <div>
              <GridIcon 
                icon={FaFileInvoiceDollar} 
                label="Zero Bill" 
                color="#33cc33" 
              />
            </div>
            <div>
              <GridIcon 
                icon={FaChartBar} 
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
