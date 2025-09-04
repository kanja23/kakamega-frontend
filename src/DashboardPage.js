// src/DashboardPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // We will create this file next
import logo from './kplc-logo.png';

// A simple icon component for the grid
const GridIcon = ({ label }) => (
  <div className="grid-item">
    <div className="icon-placeholder"></div>
    <span>{label}</span>
  </div>
);

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear the login token
    navigate('/'); // Redirect back to the login page
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" />
          <span>Kakamega Field Ops</span>
        </div>
        <div className="header-user">
          <span>Good morning, Martin 👋</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="quick-stats">
          {/* We will add the stats cards here later */}
          <div className="stat-card">Inspections Today: 0</div>
          <div className="stat-card">Active Fraud Cases: 0</div>
          <div className="stat-card">Pending Disconnections: 0</div>
          <div className="stat-card">Outages Reported: 0</div>
        </div>

        <h2 className="section-title">Field Operations</h2>
        <div className="dashboard-grid">
          <GridIcon label="Meter Inspection" />
          <GridIcon label="Account Inspection" />
          <GridIcon label="Report Outage" />
          <GridIcon label="Report Fraud" />
          <GridIcon label="Disconnections" />
          <GridIcon label="Reconnections" />
          <GridIcon label="Field Issues" />
          <GridIcon label="View Reports" />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
