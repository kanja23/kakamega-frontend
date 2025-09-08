import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import MeterInspectionPage from './MeterInspectionPage.jsx';
import ReportsPage from './ReportsPage.jsx';
import OutagePage from './OutagePage.jsx';
import DisconnectionsPage from './DisconnectionsPage.jsx';
import SafetyRulesPage from './SafetyRulesPage.jsx'; // New import for Safety Rules
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome for icons

function App() {
  // Placeholder component for coming soon features
  const ComingSoon = ({ title }) => (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <h1 style={{ color: '#00337f', fontSize: '2rem' }}>{title} - Coming Soon!</h1>
      <p style={{ color: '#666', fontSize: '1.2rem' }}>This feature is under development. Check back soon.</p>
      <button 
        onClick={() => window.location.href = '/dashboard'} 
        style={{ 
          background: '#0055A5', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          fontSize: '1rem' 
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meter-inspection" element={<MeterInspectionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/outage-reporting" element={<OutagePage />} />
        <Route path="/disconnections" element={<DisconnectionsPage />} />
        <Route path="/safety-rules" element={<SafetyRulesPage />} /> {/* New Safety Rules route */}
        
        {/* New placeholder routes for remaining core modules from the prompt */}
        <Route path="/fraud-detector" element={<ComingSoon title="Fraud Detector & SME Monitoring" />} />
        <Route path="/smart-meters" element={<ComingSoon title="Smart Meter (AMI-style) Checking" />} />
        <Route path="/field-issues" element={<ComingSoon title="Field Issues Reporting" />} />
        <Route path="/analytics" element={<ComingSoon title="Analytics & Dashboards" />} />
        <Route path="/support" element={<ComingSoon title="Support & Communication" />} />
        <Route path="/settings" element={<ComingSoon title="Settings" />} />
        
        {/* Catch-all for 404 - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
