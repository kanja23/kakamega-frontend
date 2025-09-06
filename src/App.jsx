import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import DashboardPage from './DashboardPage.jsx'
import MeterInspectionPage from './MeterInspectionPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meter-inspection" element={<MeterInspectionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
