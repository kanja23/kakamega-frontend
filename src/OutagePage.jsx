import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './OutagePage.css';
import Toast from './Toast'; // Import the Toast component

function OutagePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    // Your existing state
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
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
          // Use toast instead of alert
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
      
      // Use toast instead of alert
      showToast('Outage report submitted successfully!');
      
      // Navigate after a short delay
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

  return (
    <div className="outage-page">
      {/* Your existing JSX */}
      
      {/* Toast notification */}
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
