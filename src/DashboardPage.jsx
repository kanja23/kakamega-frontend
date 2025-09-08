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

// SVG for Pie Chart (Round Scale for Inspections by Type)
const PieChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  return (
    <svg viewBox="0 0 100 100" className="pie-chart">
      {data.map((d, i) => {
        const angle = (d.value / total) * 360;
        const largeArc = angle > 180 ? 1 : 0;
        const startAngle = cumulative;
        cumulative += angle;
        const endAngle = cumulative;
        const x1 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
        const y1 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
        const x2 = 50 + 40 * Math.cos(endAngle * Math.PI / 180);
        const y2 = 50 + 40 * Math.sin(endAngle * Math.PI / 180);
        return (
          <path key={i} d={`M50 50 L${x1} ${y1} A40 40 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={d.color} />
        );
      })}
      <circle cx="50" cy="50" r="30" fill="white" />
      <text x="50" y="52" textAnchor="middle" className="pie-label">{data.reduce((sum, d) => sum + d.value, 0)} Total</text>
    </svg>
  );
};

// SVG for Bar Graph (Outage Evolution)
const BarGraph = ({ data }) => (
  <svg viewBox="0 0 200 100" className="bar-graph">
    {data.map((d, i) => (
      <rect key={i} x={i * 40 + 10} y={100 - d.value * 2} width="30" height={d.value * 2} fill={d.color} rx="2" />
    ))}
    <text x="10" y="95" className="graph-label">Jun</text>
    <text x="55" y="95" className="graph-label">Jul</text>
    <text x="100" y="95" className="graph-label">Aug</text>
  </svg>
);

// SVG for Line Graph (Electrification Progress)
const LineGraph = ({ data }) => {
  return (
    <svg viewBox="0 0 200 100" className="line-graph">
      <polyline points={data.map((d, i) => `${i * 50}, ${100 - d * 2}`).join(' ')} fill="none" stroke="#00337f" strokeWidth="3" />
      <text x="10" y="95" className="graph-label">2018</text>
      <text x="100" y="95" className="graph-label">2022</text>
      <text x="190" y="95" className="graph-label">2025</text>
    </svg>
  );
};

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    inspections: 1500, // Simulated monthly from KPLC trends
    outages: 5, // Major outages 2025
    disconnections: 300, // Pending/actioned
    fraudCases: 50, // From awareness campaigns
    electrificationProgress: [75, 78, 79], // Trend 2018-2025
    renewablesMix: [{ value: 90, color: '#28a745' }, { value: 10, color: '#6b7280' }], // 90% green
    outageEvolution: [{ value: 3, color: '#ffcc00' }, { value: 4, color: '#ffcc00' }, { value: 5, color: '#ff6633' }] // Jun-Aug
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
    // Dynamic from localStorage (unchanged)
    const inspections = JSON.parse(localStorage.getItem('inspections') || '[]').length || stats.inspections;
    const outages = JSON.parse(localStorage.getItem('outages') || '[]').length || stats.outages;
    const disconnectionAccounts = JSON.parse(localStorage.getItem('disconnectionAccounts') || '[]').length || stats.disconnections;
    const fraudCases = JSON.parse(localStorage.getItem('fraudCases') || '[]').length || stats.fraudCases;
    setStats({ ...stats, inspections, outages, disconnections, fraudCases });
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="app-title-container">
          <img src={logo} alt="KPLC Logo" className="header-logo" />
          <h2>Kenya Power Dashboard</h2>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="greeting-section">
        <div className="greeting-text">
          <h2>{getGreeting()}, {userName} <span className="waving-hand">👋</span></h2>
          <h1>Field Ops Analytics</h1>
          <p>Visual stats for inspections, outages, and safety metrics</p>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Top Stats Cards (Inspired by Example) */}
        <section className="stats-section">
          <h3>Key Metrics</h3>
          <div className="stats-cards-container">
            <div className="stat-card inspections">
              <div className="stat-icon inspections">
                <MeterInspectionIcon />
              </div>
              <h4>Inspections</h4>
              <p className="stat-value">{stats.inspections}</p>
            </div>
            <div className="stat-card outages">
              <div className="stat-icon outages">
                <ReportOutageIcon />
              </div>
              <h4>Outages</h4>
              <p className="stat-value">{stats.outages}</p>
            </div>
            <div className="stat-card disconnections">
              <div className="stat-icon disconnections">
                <DisconnectionIcon />
              </div>
              <h4>Disconnections</h4>
              <p className="stat-value">{stats.disconnections}</p>
            </div>
            <div className="stat-card fraud">
              <div className="stat-icon fraud">
                <FraudIcon />
              </div>
              <h4>Fraud Cases</h4>
              <p className="stat-value">{stats.fraudCases}</p>
            </div>
          </div>
        </section>

        {/* Infographics Section (Pie, Bar, Line) */}
        <section className="infographics-section">
          <div className="infographic-row">
            <div className="infographic-card">
              <h4>Inspections by Type (Round Scale)</h4>
              <PieChart data={[
                { value: 40, color: '#28a745' }, // Meter
                { value: 30, color: '#ffcc00' }, // Outage
                { value: 30, color: '#ff6633' } // Fraud
              ]} />
            </div>
            <div className="infographic-card">
              <h4>Renewables Mix (Donut Scale)</h4>
              <PieChart data={stats.renewablesMix} />
            </div>
          </div>
          <div className="infographic-row">
            <div className="infographic-card">
              <h4>Outage Evolution (Bar Graph)</h4>
              <BarGraph data={stats.outageEvolution} />
            </div>
            <div className="infographic-card">
              <h4>Electrification Progress (Line Graph)</h4>
              <LineGraph data={stats.electrificationProgress} />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
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
              label="Safety Rules"
              iconSvg={<SafetyIcon />}
              color="#28a745"
              onClick={() => navigateTo('/safety-rules')}
            />
            <GridIcon
              label="Fraud Detection"
              iconSvg={<FraudIcon />}
              color="#33cc33"
              onClick={() => navigateTo('/fraud-detector')}
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

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}

export default DashboardPage;
