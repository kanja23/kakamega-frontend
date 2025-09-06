import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MeterInspectionPage.css';

function MeterInspectionPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    meterNumber: '',
    reading: '',
    status: 'normal', // normal, faulty, tampered, not_found
    notes: '',
    photo: null,
    photoPreview: null,
    location: null,
    timestamp: new Date().toISOString()
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo selection
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

  // Get current location
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
          alert('Location captured successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get location. Please ensure location services are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Save inspection to localStorage
  const saveInspection = (inspectionData) => {
    const inspections = JSON.parse(localStorage.getItem('inspections') || '[]');
    const newInspection = {
      ...inspectionData,
      id: Date.now(),
      synced: false
    };
    inspections.push(newInspection);
    localStorage.setItem('inspections', JSON.stringify(inspections));
    return newInspection;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.meterNumber || !formData.reading) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Save inspection
      const savedInspection = saveInspection(formData);
      
      // Show success message
      alert(`Inspection submitted successfully!\nMeter: ${savedInspection.meterNumber}\nID: ${savedInspection.id}`);
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting inspection:', error);
      alert('Failed to submit inspection. Please try again.');
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
            />
            <button 
              type="button" 
              className="upload-button"
              onClick={() => fileInputRef.current.click()}
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
            <label>Location</label>
            <button 
              type="button" 
              className="location-button"
              onClick={getCurrentLocation}
            >
              {formData.location ? 'Update Location' : 'Capture Location'}
            </button>
            {formData.location && (
              <div className="location-info">
                <small>
                  Lat: {formData.location.lat.toFixed(6)}, 
                  Lng: {formData.location.lng.toFixed(6)}
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
  );
}

export default MeterInspectionPage;
