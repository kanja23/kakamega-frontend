import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import Toast from './Toast';
import logo from './kplc-logo.png'; // Reuse logo placeholder; replace with FinTech logo if available

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

// SVG Icons (FinTech-themed, high-res)
const TransactionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 4h-2v3H7v2h2v3h2v-3h2v-2h-2V8zm6 6h-2v-2h2v2zm0-4h-2V8h2v2z"/>
  </svg>
);

const FraudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const AccountsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-7h3v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

const RetentionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    transactions: 0,
    activeAccounts: 0,
    fraudDetectionRate: 85, // Industry average for 2025 FinTech
    customerRetention: 90, // Simulated high retention
    pendingSync: 0,
    fraudCases: 0
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
    // Dynamic stats from localStorage (unchanged logic)
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]').length || 1500; // Simulated volume
    const activeAccounts = JSON.parse(localStorage.getItem('accounts') || '[]').length || 1200; // Simulated growth
    const fraudCases = JSON.parse(localStorage.getItem('fraudCases') || '[]').length;
    const pendingSync = 2; // Fixed for demo
    setStats({ 
      transactions,
      activeAccounts,
      fraudDetectionRate: 85, // Fixed to plausible 2025 benchmark
      customerRetention: 90, // Fixed to high retention goal
      pendingSync,
      fraudCases
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
          <img src={logo} alt="FinTech Logo" className="header-logo" />
          <h2>FinTech Operations Dashboard</h2>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="greeting-section">
        <div className="greeting-text">
          <h2>{getGreeting()}, {userName} <span className="waving-hand">👋</span></h2>
          <h1>Real-Time Financial Insights</h1>
          <p>Monitor transactions, fraud, and customer metrics</p>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Quick Stats with KPIs */}
        <section className="stats-section">
          <h3>Operational KPIs (Progressing Well / Lacking)</h3>
          <div className="stats-cards-container">
            <div className="stat-card transactions" onClick={() => navigateTo('/meter-inspection')}>
              <div className="stat-icon transactions">
                <TransactionsIcon />
              </div>
              <h4>Transaction Volume</h4>
              <p className="stat-value">{stats.transactions.toLocaleString()}</p>
              <div className="kpi-progress">
                <span>Target: 2000/day</span>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: `${(stats.transactions / 2000 * 100)}%`, backgroundColor: getStatusColor(stats.transactions / 2000 * 100, 100) }}></div>
                </div>
              </div>
              <span className={`kpi-status ${stats.transactions >= 1600 ? 'good' : 'lacking'}`}>{stats.transactions >= 1600 ? 'On Target' : 'Below Goal'}</span>
            </div>
            <div className="stat-card fraud" onClick={() => navigateTo('/fraud-detector')}>
              <div className="stat-icon fraud">
                <FraudIcon />
              </div>
              <h4>Fraud Cases</h4>
              <p className="stat-value">{stats.fraudCases}</p>
              <div className="kpi-progress">
                <span>{stats.fraudDetectionRate}% Detected</span>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: `${stats.fraudDetectionRate}%`, backgroundColor: getStatusColor(stats.fraudDetectionRate, 90) }}></div>
                </div>
              </div>
              <span className={`kpi-status ${stats.fraudDetectionRate >= 90 ? 'good' : 'lacking'}`}>{stats.fraudDetectionRate >= 90 ? 'Excellent' : 'Review Needed'}</span>
            </div>
            <div className="stat-card accounts" onClick={() => showComingSoon('Accounts Management')}>
              <div className="stat-icon accounts">
                <AccountsIcon />
              </div>
              <h4>Active Accounts</h4>
              <p className="stat-value">{stats.activeAccounts.toLocaleString()}</p>
              <div className="kpi-progress">
                <span>Target: 1500</span>
                <div className="progress-bar small">
                  <div className="progress-fill" style={{ width: `${(stats.activeAccounts / 1500 * 100)}%`, backgroundColor: getStatusColor(stats.activeAccounts / 1500 * 100, 100) }}></div>
                </div>
              </div>
              <span className={`kpi-status ${stats.activeAccounts >= 1200 ? 'good' : 'lacking'}`}>{stats.activeAccounts >= 1200 ? 'Growing' : 'Lagging'}</span>
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
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="actions-section">
          <h3>Financial Operations (Click for Details)</h3>
          <div className="actions-grid">
            <GridIcon
              label="Transactions"
              iconSvg={<TransactionsIcon />}
              color="#0066cc"
              onClick={() => navigateTo('/meter-inspection')}
              progress={75}
            />
            <GridIcon
              label="Fraud Detection"
              iconSvg={<FraudIcon />}
              color="#ff6633"
              onClick={() => navigateTo('/fraud-detector')}
              progress={85}
            />
            <GridIcon
              label="Accounts Management"
              iconSvg={<AccountsIcon />}
              color="#33cc33"
              onClick={() => showComingSoon('Accounts Management')}
              progress={80}
            />
            <GridIcon
              label="Customer Retention"
              iconSvg={<RetentionIcon />}
              color="#ffcc00"
              onClick={() => showComingSoon('Retention Analytics')}
              progress={90}
            />
            <GridIcon
              label="Reports"
              iconSvg={<ReportsIcon />}
              color="#9966cc"
              onClick={() => navigateTo('/reports')}
              progress={95}
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
