import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import Toast from './Toast';
import logo from './kplc-logo.png';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const GridIcon = ({ label, iconSvg, color, onClick, progress }) => (
  <div className="grid-icon" style={{ '--icon-color': color }} onClick={onClick}>
    <div className="icon-container">
      {iconSvg}
    </div>
    <span>{label}</span>
    {progress && <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>}
  </div>
);

// SVG Icons (high-res, vector)
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

const FraudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1 .9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

const SmartMeterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
  </svg>
);

const SafetyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V5l-9-4z"/>
  </svg>
);

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    inspections: 0,
    activeCases: 0,
    pendingSync: 0,
    outages: 0,
    disconnections: 0,
    electrificationProgress: 80, // % toward Vision 2030
    renewablesMix: 90, // % green energy
    outageResolution: 95, // % resolved
    fraudResolved: 85 // % cases actioned
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name || 'User');
    } else {
      navigate('/');
    }
    // Dynamic stats from localStorage
    const inspections = JSON.parse(localStorage.getItem('inspections') || '[]').length;
    const outagesTotal = JSON.parse(localStorage.getItem('outages') || '[]').length;
    const outagesResolved = outagesTotal * 0.95; // Simulated resolution
    const disconnectionAccounts = JSON.parse(localStorage.getItem('disconnectionAccounts') || '[]');
    const pendingDisconnections = disconnectionAccounts.filter(a => a.status === 'pending').length;
    const fraudCases = JSON.parse(localStorage.getItem('fraudCases') || '[]');
    const fraudResolved = fraudCases.length * 0.85;
    setStats({ 
      inspections, 
      activeCases: fraudCases.length, 
      pendingSync: 2, 
      outages: outagesTotal,
      disconnections: pendingDisconnections,
      electrificationProgress: Math.min(100, 75 + Math.random() * 5), // Simulated progress
      renewablesMix: 90, // Static for demo
      outageResolution: (outagesResolved / outagesTotal * 100) || 0,
      fraudResolved: fraudResolved / fraudCases.length * 100 || 0
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const showComingSoon = (featureName) => {
    setToast({ show: true, message: `${featureName} is coming soon!`, type: 'info' });
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const getStatusColor = (value, target) => {
    if (value >= target) return 'green';
    if (value >= target * 0.8) return 'yellow';
    return 'red';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="app-title-container">
          <img src={logo} alt="KPLC Logo" className="header-logo" />
          <h2>Daily Field Reports & Vision 2030 Analytics</h2>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="greeting-section">
        <div className="greeting-text">
          <h2>{getGreeting()}, {userName} <span className="waving-hand">👋</span></h2>
          <h1>Tech-Driven Field Ops Dashboard</h1>
          <p>Monitor progress toward 100% electrification & green grid by 2030</p>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Vision 2030 Tracker Section */}
        <section className="vision-section">
          <h3>Vision 2030 Progress Tracker</h3>
          <div className="vision-grid">
            <div className="vision-card">
              <h4>Electrification Access</h4>
              <p className="vision-label">Target: 100% by 2030</p>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${stats.electrificationProgress}%`, backgroundColor: getStatusColor(stats.electrificationProgress, 100) }}></div>
                </div>
                <span className="progress-text">{stats.electrificationProgress}% Complete</span>
              </div>
            </div>
            <div className="vision-card">
              <h4>Renewables Mix</h4>
              <p className="vision-label">Target: 100% Green Grid</p>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${stats.renewablesMix}%`, backgroundColor: getStatusColor(stats.renewablesMix, 100) }}></div>
                </div>
                <span className="progress-text">{stats.renewablesMix}% Renewables</span>
              </div>
            </div>
            <div className="vision-card">
              <h4>Outage Resolution</h4>
              <p className="vision-label">Target: 95% Efficient</p>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${stats.outageResolution}%`, backgroundColor: getStatusColor(stats.outageResolution, 95) }}></div>
                </div>
                <span className="progress-text">{stats.outageResolution}% Resolved</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats with Visuals */}
        <section className="stats-section">
          <h3>Operational KPIs (Progressing Well / Lacking)</h3>
          <div className="stats-cards-container">
            <div className="stat-card inspections" onClick={() => navigateTo('/meter-inspection')}>
              <div className="stat-icon inspections">
                <MeterInspectionIcon />
              </div>
              <h4>Meter Inspections</h4>
              <p className="stat-value">{stats.inspections}</p>
              <div className="kpi-progress">
                <span>75% Target</span>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: '75%', backgroundColor: 'green' }}></div>
                </div>
              </div>
              <span className="kpi-status good">On Track</span>
            </div>
            <div className="stat-card cases" onClick={() => navigateTo('/fraud-detector')}>
              <div className="stat-icon cases">
                <FraudIcon />
              </div>
              <h4>Fraud Cases</h4>
              <p className="stat-value">{stats.activeCases}</p>
              <div className="kpi-progress">
                <span>{stats.fraudResolved}% Resolved</span>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: `${stats.fraudResolved}%`, backgroundColor: getStatusColor(stats.fraudResolved, 80) }}></div>
                </div>
              </div>
              <span className={`kpi-status ${stats.fraudResolved < 80 ? 'lacking' : 'good'}`}>{stats.fraudResolved < 80 ? 'Needs Attention' : 'Good'}</span>
            </div>
            <div className="stat-card sync">
              <div className="stat-icon sync">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                </svg>
              </div>
              <h4>Pending Sync</h4>
              <p className="stat-value">{stats.pendingSync}</p>
              <span className="kpi-status lacking">Sync Now</span>
            </div>
            <div className="stat-card outages" onClick={() => navigateTo('/outage-reporting')}>
              <div className="stat-icon outages">
                <ReportOutageIcon />
              </div>
              <h4>Outages Reported</h4>
              <p className="stat-value">{stats.outages}</p>
              <div className="kpi-progress">
                <span>{stats.outageResolution}% Resolved</span>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: `${stats.outageResolution}%`, backgroundColor: getStatusColor(stats.outageResolution, 95) }}></div>
                </div>
              </div>
              <span className={`kpi-status ${stats.outageResolution < 95 ? 'lacking' : 'good'}`}>{stats.outageResolution < 95 ? 'Improve' : 'Excellent'}</span>
            </div>
            <div className="stat-card disconnections" onClick={() => navigateTo('/disconnections')}>
              <div className="stat-icon disconnections">
                <DisconnectionIcon />
              </div>
              <h4>Pending Disconnections</h4>
              <p className="stat-value">{stats.disconnections}</p>
              <span className="kpi-status lacking">Action Required</span>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid (Clickable for Management) */}
        <section className="actions-section">
          <h3>Project Actions (Click for Details)</h3>
          <div className="actions-grid">
            <GridIcon
              label="Meter Inspection"
              iconSvg={<MeterInspectionIcon />}
              color="#0066cc"
              onClick={() => navigateTo('/meter-inspection')}
              progress={75}
            />
            <GridIcon
              label="Report Outage"
              iconSvg={<ReportOutageIcon />}
              color="#ff6633"
              onClick={() => navigateTo('/outage-reporting')}
              progress={95}
            />
            <GridIcon
              label="Disconnections"
              iconSvg={<DisconnectionIcon />}
              color="#ffcc00"
              onClick={() => navigateTo('/disconnections')}
              progress={60}
            />
            <GridIcon
              label="Safety Rules"
              iconSvg={<SafetyIcon />}
              color="#28a745"
              onClick={() => navigateTo('/safety-rules')}
              progress={100}
            />
            <GridIcon
              label="Fraud Detection"
              iconSvg={<FraudIcon />}
              color="#33cc33"
              onClick={() => navigateTo('/fraud-detector')}
              progress={85}
            />
            <GridIcon
              label="Smart Meters"
              iconSvg={<SmartMeterIcon />}
              color="#ff6633"
              onClick={() => showComingSoon('Smart Meter Checking')}
              progress={70}
            />
            <GridIcon
              label="Reports"
              iconSvg={<ReportsIcon />}
              color="#9966cc"
              onClick={() => navigateTo('/reports')}
              progress={90}
            />
          </div>
        </section>
      </div>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}

export default DashboardPage;
