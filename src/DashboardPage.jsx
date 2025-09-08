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

const GridIcon = ({ label, iconSvg, color, onClick }) => (
  <div className="grid-icon" style={{ '--icon-color': color }} onClick={onClick}>
    <div className="icon-container">
      {iconSvg}
    </div>
    <span>{label}</span>
  </div>
);

// SVG Icons
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

const DisconnectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1 .9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7V9h3v8zm4-8H7V7h7v2z"/>
  </svg>
);

const AnomaliesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1 .9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    inspections: 0,
    activeCases: 0,
    pendingSync: 0,
    outages: 0
  });

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name || 'User');
    } else {
      navigate('/');
    }
    // Placeholder stats - can load from localStorage later
    setStats({ inspections: 5, activeCases: 3, pendingSync: 2, outages: 1 });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const showComingSoon = (featureName) => {
    alert(`${featureName} feature is coming soon!`);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="app-title-container">
          <img src={logo} alt="Logo" className="header-logo" />
          <h2>Daily Field Reports</h2>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="greeting-section">
        <div className="greeting-text">
          <h2>{getGreeting()}, {userName} 👋</h2>
          <h1>Welcome back to Field Ops 2.0</h1>
        </div>
      </div>

      <div className="dashboard-main">
        <section className="stats-section">
          <h3>Quick Stats</h3>
          <div className="stats-cards-container">
            <div className="stat-card inspections">
              <div className="stat-icon inspections">
                <MeterInspectionIcon />
              </div>
              <h4>Inspections Today</h4>
              <p className="stat-value">{stats.inspections}</p>
            </div>
            <div className="stat-card cases">
              <div className="stat-icon cases">
                <AnomaliesIcon />
              </div>
              <h4>Active Fraud Cases</h4>
              <p className="stat-value">{stats.activeCases}</p>
            </div>
            <div className="stat-card sync">
              <div className="stat-icon sync">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                </svg>
              </div>
              <h4>Pending Sync</h4>
              <p className="stat-value">{stats.pendingSync}</p>
            </div>
            <div className="stat-card outages">
              <div className="stat-icon outages">
                <ReportOutageIcon />
              </div>
              <h4>Outages Reported</h4>
              <p className="stat-value">{stats.outages}</p>
            </div>
          </div>
        </section>

        <section className="actions-section">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <GridIcon
              label="Meter Inspection"
              iconSvg={<MeterInspectionIcon />}
              color="#0066cc"
              onClick={() => navigateTo('/meter-inspection')}
            />
            <GridIcon
              label="Report Outage"
              iconSvg={<ReportOutageIcon />}
              color="#ff6633"
              onClick={() => navigateTo('/outage-reporting')}
            />
            <GridIcon
              label="Disconnections"
              iconSvg={<DisconnectionIcon />}
              color="#ffcc00"
              onClick={() => navigateTo('/disconnections')}
            />
            <GridIcon
              label="Fraud Detection"
              iconSvg={<AnomaliesIcon />}
              color="#33cc33"
              onClick={() => showComingSoon('Fraud Detector')}
            />
            <GridIcon
              label="Reports"
              iconSvg={<ReportsIcon />}
              color="#9966cc"
              onClick={() => navigateTo('/reports')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
