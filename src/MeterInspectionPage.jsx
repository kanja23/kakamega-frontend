import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MeterInspectionPage.css';
import Toast from './Toast'; // Import the Toast component
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

  // ... rest of your MeterInspectionPage code ...

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

      // Use toast instead of alert
      showToast('Meter inspection submitted successfully!');
      
      // Navigate after a short delay so user can see the message
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

export default MeterInspectionPage;
