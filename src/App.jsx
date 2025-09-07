import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import DashboardPage from './DashboardPage.jsx'
import MeterInspectionPage from './MeterInspectionPage.jsx'
import ReportsPage from './ReportsPage.jsx'
import OutagePage from './OutagePage.jsx' // Add this import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meter-inspection" element={<MeterInspectionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/outage-reporting" element={<OutagePage />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
