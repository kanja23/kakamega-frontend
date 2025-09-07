import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './OutagePage.css';
import Toast from './Toast';

function OutagePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    area: '',
    feeder: '',
    cause: '',
    priority: 'medium',
    customersAffected: '',
    description: '',
    location: null,
    photos: [],
    photoPreviews: [],
    timestamp: new Date().toISOString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPhotos = [...formData.photos];
      const newPreviews = [...formData.photoPreviews];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(file);
          newPreviews.push(reader.result);
          setFormData(prev => ({
            ...prev,
            photos: newPhotos,
            photoPreviews: newPreviews
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    const newPreviews = [...formData.photoPreviews];
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      photos: newPhotos,
      photoPreviews: newPreviews
    }));
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

  const saveOutage = (outageData) => {
    const outages = JSON.parse(localStorage.getItem('outages') || '[]');
    const newOutage = {
      ...outageData,
      id: Date.now(),
      synced: false,
      status: 'reported'
    };
    outages.push(newOutage);
    localStorage.setItem('outages', JSON.stringify(outages));
    console.log('Outage reported:', newOutage);
    return newOutage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.area || !formData.feeder || !formData.cause) {
        showToast('Please fill in all required fields', 'error');
        setIsSubmitting(false);
        return;
      }

      const savedOutage = saveOutage(formData);
      
      showToast('Outage report submitted successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error reporting outage:', error);
      showToast('Failed to report outage. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const causeOptions = [
    'Equipment Failure',
    'Tree Contact',
    'Vehicle Accident',
    'Weather',
    'Animal Contact',
    'Construction Damage',
    'Unknown'
  ];

  const feederOptions = [
    'Kakamega Town',
    'Matende',
    'Shirere',
    'Malaha',
    'Milimani',
    'Bukhungu',
    'Market',
    'Malava',
    'Mumias',
    'Shinyalu',
    'Ikolomani',
    'Butere'
  ];

  return (
    <div className="outage-page">
      <header className="outage-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <h1>Power Outage Reporting</h1>
      </header>

      <main className="outage-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="area">Affected Area *</label>
            <input
              id="area"
              name="area"
              type="text"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Enter affected area or estate"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="feeder">Feeder *</label>
            <select
              id="feeder"
              name="feeder"
              value={formData.feeder}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Feeder</option>
              {feederOptions.map(feeder => (
                <option key={feeder} value={feeder}>{feeder}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cause">Suspected Cause *</label>
            <select
              id="cause"
              name="cause"
              value={formData.cause}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Cause</option>
              {causeOptions.map(cause => (
                <option key={cause} value={cause}>{cause}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority Level</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="customersAffected">Estimated Customers Affected</label>
            <input
              id="customersAffected"
              name="customersAffected"
              type="number"
              value={formData.customersAffected}
              onChange={handleInputChange}
              placeholder="Enter estimated number"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Upload Photos</label>
            <input
              type="file"
              id="photos"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="upload-button"
              onClick={() => fileInputRef.current.click()}
              disabled={isSubmitting}
            >
              Select Photos
            </button>
            {formData.photoPreviews.length > 0 && (
              <div className="photo-previews">
                {formData.photoPreviews.map((preview, index) => (
                  <div key={index} className="photo-preview">
                    <img src={preview} alt={`Outage evidence ${index + 1}`} />
                    <button 
                      type="button" 
                      className="remove-photo"
                      onClick={() => removePhoto(index)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Location</label>
            <button
              type="button"
              className="location-button"
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
            <label htmlFor="description">Additional Details</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide any additional details about the outage..."
              rows="4"
              disabled={isSubmitting}
            ></textarea>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Reporting Outage...' : 'Report Outage'}
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

export default OutagePage;
