import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './ReportsPage.css';

function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    startDate: '',
    endDate: '',
    status: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');

  // Report types based on your modules
  const reportTypes = {
    inspection: 'Meter Inspection',
    outage: 'Power Outage',
    fraud: 'Fraud Case',
    disconnection: 'Disconnection',
    issue: 'Field Issue'
  };

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name || 'Unknown Officer');
    }
    
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [filters, reports]);

  const loadReports = () => {
    try {
      // Load from localStorage (offline-first approach)
      const savedInspections = JSON.parse(localStorage.getItem('inspections') || '[]');
      const savedOutages = JSON.parse(localStorage.getItem('outages') || '[]');
      const savedFraudCases = JSON.parse(localStorage.getItem('fraudCases') || '[]');
      const savedDisconnections = JSON.parse(localStorage.getItem('disconnections') || '[]');
      const savedIssues = JSON.parse(localStorage.getItem('fieldIssues') || '[]');

      // Combine all reports with type identifiers
      const allReports = [
        ...savedInspections.map(r => ({ ...r, type: 'inspection' })),
        ...savedOutages.map(r => ({ ...r, type: 'outage' })),
        ...savedFraudCases.map(r => ({ ...r, type: 'fraud' })),
        ...savedDisconnections.map(r => ({ ...r, type: 'disconnection' })),
        ...savedIssues.map(r => ({ ...r, type: 'issue' }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setReports(allReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (filters.type !== 'all') {
      filtered = filtered.filter(report => report.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(report => 
        new Date(report.timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(report => 
        new Date(report.timestamp) <= endDate
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    setFilteredReports(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportToExcel = () => {
    setIsLoading(true);
    
    try {
      // Prepare data for Excel export
      const excelData = filteredReports.map(report => {
        const baseData = {
          'Report ID': report.id || 'N/A',
          'Type': reportTypes[report.type] || report.type,
          'Date': new Date(report.timestamp).toLocaleDateString(),
          'Time': new Date(report.timestamp).toLocaleTimeString(),
          'Status': report.status || 'Submitted',
          'Officer': userName // Use the logged-in user's name
        };

        // Add type-specific fields
        if (report.type === 'inspection') {
          return {
            ...baseData,
            'Meter Number': report.meterNumber || 'N/A',
            'Reading': report.reading || 'N/A',
            'Meter Status': report.meterStatus || 'N/A',
            'Location': report.location ? `${report.location.lat}, ${report.location.lng}` : 'N/A',
            'Notes': report.notes || ''
          };
        } else if (report.type === 'outage') {
          return {
            ...baseData,
            'Area': report.area || 'N/A',
            'Feeder': report.feeder || 'N/A',
            'Suspected Cause': report.cause || 'N/A',
            'Estimated Customers Affected': report.customersAffected || 'N/A',
            'Priority': report.priority || 'Medium'
          };
        } else if (report.type === 'fraud') {
          return {
            ...baseData,
            'Account Number': report.accountNumber || 'N/A',
            'Fraud Type': report.fraudType || 'N/A',
            'Severity': report.severity || 'Medium',
            'Estimated Loss': report.estimatedLoss ? `KSh ${report.estimatedLoss}` : 'N/A',
            'Actions Taken': report.actionsTaken || 'None'
          };
        }
        // Add more type-specific mappings as needed

        return baseData;
      });

      // Create worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Field Reports');

      // Generate Excel file
      const fileName = `field_reports_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      submitted: 'status-submitted',
      pending: 'status-pending',
      resolved: 'status-resolved',
      escalated: 'status-escalated'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-submitted'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Submitted'}
      </span>
    );
  };

  return (
    <div className="reports-page">
      <header className="reports-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <h1>Reports & Analytics</h1>
        <div className="header-actions">
          <button 
            onClick={exportToExcel} 
            className="export-button"
            disabled={isLoading || filteredReports.length === 0}
          >
            {isLoading ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>
      </header>

      <div className="reports-content">
        {/* Filters Section */}
        <div className="filters-section">
          <h2>Filter Reports</h2>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Report Type</label>
              <select 
                value={filters.type} 
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                {Object.entries(reportTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="reports-list">
          <h2>
            {filteredReports.length} Report{filteredReports.length !== 1 ? 's' : ''} Found
            {filters.type !== 'all' && ` (${reportTypes[filters.type]})`}
          </h2>

          {filteredReports.length === 0 ? (
            <div className="no-reports">
              <p>No reports match your filters.</p>
            </div>
          ) : (
            <div className="reports-grid">
              {filteredReports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <span className="report-type">{reportTypes[report.type]}</span>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <div className="report-body">
                    <p className="report-title">
                      {report.type === 'inspection' && `Meter: ${report.meterNumber}`}
                      {report.type === 'outage' && `Outage: ${report.area}`}
                      {report.type === 'fraud' && `Fraud Case: ${report.fraudType}`}
                      {report.type === 'disconnection' && `Disconnection: ${report.accountNumber}`}
                      {report.type === 'issue' && `Issue: ${report.issueType}`}
                    </p>
                    
                    <p className="report-date">
                      {new Date(report.timestamp).toLocaleString()}
                    </p>
                    
                    <p className="report-location">
                      {report.location && 
                        `Location: ${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                    </p>
                  </div>

                  <div className="report-actions">
                    <button className="view-details">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
