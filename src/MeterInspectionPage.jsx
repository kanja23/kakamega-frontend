import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MeterInspectionPage.css';
import Toast from './Toast';
import logo from './kplc-logo.png';

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
    timestamp: new Date().toISOString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('martinkaranja92@gmail.com');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/<script.*?>.*?<\/script>/gi, '');
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
            location: { lat: position.coords.latitude, lng: position.coords.longitude }
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

    console.log('Attempting to send email with:', {
      serviceID: 'service_gypr87t',
      templateID: 'template_tpm59pq',
      data: {
        meterNumber: inspectionData.meterNumber,
        reading: inspectionData.reading,
        status: inspectionData.status,
        notes: inspectionData.notes,
        locationLat: inspectionData.location?.lat || 'N/A',
        locationLng: inspectionData.location?.lng || 'N/A',
        timestamp: timestamp,
        supervisorEmail: 'martin.kanja23@gmail.com',
        userEmail: userEmail
      }
    });
    return emailjs.send(
      'service_gypr87t',
      'template_tpm59pq',
      {
        meterNumber: inspectionData.meterNumber,
        reading: inspectionData.reading,
        status: inspectionData.status,
        notes: inspectionData.notes,
        locationLat: inspectionData.location?.lat || 'N/A',
        locationLng: inspectionData.location?.lng || 'N/A',
        timestamp: timestamp,
        supervisorEmail: 'martin.kanja23@gmail.com',
        userEmail: userEmail
      }
    ).then(
      () => console.log('Email sent successfully'),
      (error) => {
        console.error('Email failed with details:', error);
        throw error;
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.meterNumber || !formData.reading) {
        showToast('Please fill in all required fields', 'error');
        setIsSubmitting(false);
        return;
      }
      if (!userEmail) {
        showToast('Please enter your email address', 'error');
        setIsSubmitting(false);
        return;
      }

      const savedInspection = saveInspection(formData);
      await sendEmail(savedInspection);

      showToast('Meter inspection submitted successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Submission error:', error);
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
      <main className="inspection-form-container">
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="status">Meter Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="status-select"
              disabled={isSubmitting}
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
