import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MeterInspectionPage.css';
import Toast from './Toast';
// FIXED: Changed the import path from '../data/staffStructure' to './data/staffStructure'
import { staffStructure, getAllStaff } from './data/staffStructure';

function MeterInspectionPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    meterNumber: '',
    reading: '',
    status: 'normal',
    notes: '',
    photo: null,
    photoPreview: null,
    location: null,
    timestamp: new Date().toISOString(),
    inspectorName: '',
    zone: '',
    sector: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('martinkaranja92@gmail.com');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [activeSector, setActiveSector] = useState('Kakamega West');

  useEffect(() => {
    // Get user data to pre-fill inspector name if available
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.full_name) {
      const allStaff = getAllStaff();
      const userStaff = allStaff.find(staff => staff.name === userData.full_name);
      if (userStaff) {
        setFormData(prev => ({
          ...prev,
          inspectorName: userData.full_name,
          zone: userStaff.zone,
          sector: userStaff.sector,
          role: userStaff.role
        }));
      }
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'inspectorName') {
      const selectedStaff = getAllStaff().find(staff => staff.name === value);
      if (selectedStaff) {
        setFormData(prev => ({
          ...prev,
          inspectorName: value,
          zone: selectedStaff.zone,
          sector: selectedStaff.sector,
          role: selectedStaff.role
        }));
        return;
      }
    }
    
    const sanitizedValue = value.replace(/<script.?>.?<\/script>/gi, '');
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          showToast('Location captured successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          showToast('Could not get location. Please ensure location services are enabled.', 'error');
        }
      );
    } else {
      showToast('Geolocation is not supported by this browser.', 'error');
    }
  };

  const saveInspection = (inspectionData) => {
    const inspections = JSON.parse(localStorage.getItem('inspections') || '[]');
    const newInspection = {
      ...inspectionData,
      id: Date.now(),
      synced: false,
      photoBase64: inspectionData.photo ? inspectionData.photoPreview : null
    };
    inspections.push(newInspection);
    localStorage.setItem('inspections', JSON.stringify(inspections));
    console.log('Inspection saved:', newInspection);
    return newInspection;
  };

  const sendEmail = (inspectionData) => {
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'Africa/Nairobi', 
      dateStyle: 'full', 
      timeStyle: 'medium' 
    });

    // Email template parameters
    const templateParams = {
      to_name: 'Supervisor',
      from_name: inspectionData.staffName || 'Field Officer',
      meter_number: inspectionData.meterNumber,
      reading: inspectionData.reading,
      status: inspectionData.status,
      inspector_name: inspectionData.inspectorName,
      inspector_role: inspectionData.role,
      zone: inspectionData.zone,
      sector: inspectionData.sector,
      location: inspectionData.location ? 
        `Lat: ${inspectionData.location.lat}, Lng: ${inspectionData.location.lng}` : 'Not provided',
      notes: inspectionData.notes || 'No additional notes',
      timestamp: timestamp,
      to_email: 'supervisor@kplc.com',
      reply_to: userEmail
    };

    // Send email using EmailJS
    emailjs.send('service_your_service_id', 'template_meter_inspection', templateParams, 'Qn5t9k9qX720n3G9_')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get user data for staff number
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      const inspectionData = {
        ...formData,
        staffNumber: userData.staff_id || 'N/A',
        staffName: userData.full_name || 'Unknown',
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage
      saveInspection(inspectionData);
      
      // Send email
      sendEmail(inspectionData);
      
      // Reset form but keep inspector details
      setFormData(prev => ({
        meterNumber: '',
        reading: '',
        status: 'normal',
        notes: '',
        photo: null,
        photoPreview: null,
        location: null,
        timestamp: new Date().toISOString(),
        inspectorName: prev.inspectorName,
        zone: prev.zone,
        sector: prev.sector,
        role: prev.role
      }));
      
      showToast('Meter inspection submitted successfully!');
    } catch (error) {
      console.error('Error submitting inspection:', error);
      showToast('Failed to submit inspection. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inspection-page">
      <header className="inspection-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <h1>Meter Inspection</h1>
      </header>

      <div className="inspection-content">
        {/* Organizational Structure Section */}
        <div className="org-structure-section">
          <h2>Kakamega County - Commercial Services and Sales</h2>
          
          <div className="sector-selector">
            <label>Select Sector:</label>
            <select 
              value={activeSector} 
              onChange={(e) => setActiveSector(e.target.value)}
            >
              {staffStructure.sectors.map(sector => (
                <option key={sector.name} value={sector.name}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sector-info">
            {staffStructure.sectors
              .filter(sector => sector.name === activeSector)
              .map(sector => (
                <div key={sector.name} className="sector-card">
                  <h3>{sector.name} Sector</h3>
                  <p className="supervisor"><strong>Supervisor:</strong> {sector.supervisor}</p>
                  
                  <div className="zones-container">
                    {sector.zones.map(zone => (
                      <div key={zone.name} className="zone-card">
                        <h4>{zone.name} Zone</h4>
                        
                        <div className="staff-category">
                          <h5>Meter Readers</h5>
                          <ul>
                            {zone.staff.meterReaders.map((reader, index) => (
                              <li key={index}>{reader}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="staff-category">
                          <h5>Revenue Collectors</h5>
                          <ul>
                            {zone.staff.revenueCollectors.map((collector, index) => (
                              <li key={index}>{collector}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="staff-category">
                          <h5>IIU Inspectors</h5>
                          <ul>
                            {zone.staff.iiuInspectors.map((inspector, index) => (
                              <li key={index}>{inspector}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Inspection Form Section */}
        <main className="inspection-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="inspectorName">Staff Name *</label>
              <select
                id="inspectorName"
                name="inspectorName"
                value={formData.inspectorName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Staff Member</option>
                {getAllStaff().map(staff => (
                  <option key={staff.name} value={staff.name}>
                    {staff.name} ({staff.role} - {staff.zone})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  readOnly
                  className="read-only"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="zone">Zone</label>
                <input
                  id="zone"
                  name="zone"
                  type="text"
                  value={formData.zone}
                  readOnly
                  className="read-only"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sector">Sector</label>
                <input
                  id="sector"
                  name="sector"
                  type="text"
                  value={formData.sector}
                  readOnly
                  className="read-only"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="meterNumber">Meter Number *</label>
              <input 
                id="meterNumber" 
                name="meterNumber" 
                type="text" 
                value={formData.meterNumber} 
                onChange={handleInputChange} 
                placeholder="Enter or scan meter number" 
                required 
                disabled={isSubmitting} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="reading">Meter Reading *</label>
              <input 
                id="reading" 
                name="reading" 
                type="number" 
                value={formData.reading} 
                onChange={handleInputChange} 
                placeholder="Enter current reading" 
                required 
                disabled={isSubmitting} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Meter Status *</label>
              <select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange} 
                className="status-select" 
                disabled={isSubmitting} 
                required
              >
                <option value="normal">Normal</option>
                <option value="faulty">Faulty</option>
                <option value="tampered">Tampered</option>
                <option value="not_found">Not Found</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="photo">Upload Photo</label>
              <input 
                type="file" 
                id="photo" 
                ref={fileInputRef} 
                onChange={handlePhotoSelect} 
                accept="image/*" 
                capture="environment" 
                style={{ display: 'none' }} 
                disabled={isSubmitting} 
              />
              <button 
                type="button" 
                className="upload-button" 
                onClick={() => fileInputRef.current.click()} 
                disabled={isSubmitting} 
              >
                {formData.photoPreview ? 'Change Photo' : 'Select Photo'}
              </button>
              {formData.photoPreview && (
                <div className="photo-preview">
                  <img src={formData.photoPreview} alt="Meter preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="userEmail">Your Email *</label>
              <input 
                id="userEmail" 
                name="userEmail" 
                type="email" 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
                disabled={isSubmitting} 
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <button 
                type="button" 
                className="upload-button" 
                onClick={getCurrentLocation} 
                disabled={isSubmitting} 
              >
                {formData.location ? 'Update Location' : 'Capture Location'}
              </button>
              {formData.location && (
                <div className="location-info">
                  <small>
                    Lat: {formData.location.lat.toFixed(6)}, Lng: {formData.location.lng.toFixed(6)}
                  </small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes / Flags</label>
              <textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                placeholder="e.g., Tampered meter, faulty, customer comments, etc." 
                rows="4" 
                disabled={isSubmitting} 
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting} 
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
            </button>
          </form>
        </main>
      </div>

      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: '', type: 'success' })} 
        />
      )}
    </div>
  );
}

export default MeterInspectionPage;
