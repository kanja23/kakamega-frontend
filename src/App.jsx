import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import DashboardPage from './DashboardPage.jsx'
import MeterInspectionPage from './MeterInspectionPage.jsx'
import ReportsPage from './ReportsPage.jsx'
import OutagePage from './OutagePage.jsx'
import DisconnectionsPage from './DisconnectionsPage.jsx' // Add this import
import '@fortawesome/fontawesome-free/css/all.min.css';  // <-- This is the new line for Font Awesome icons!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meter-inspection" element={<MeterInspectionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/outage-reporting" element={<OutagePage />} />
        <Route path="/disconnections" element={<DisconnectionsPage />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
