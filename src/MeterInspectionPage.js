// src/MeterInspectionPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MeterInspectionPage.css';

function MeterInspectionPage() {
  const navigate = useNavigate();
  const [meterNumber, setMeterNumber] = useState('');
  const [reading, setReading] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Submitting Inspection:\nMeter: ${meterNumber}\nReading: ${reading}\nNotes: ${notes}`);
    navigate('/dashboard');
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
            <label htmlFor="meterNumber">Meter Number</label>
            <input
              id="meterNumber"
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              placeholder="Enter or scan meter number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reading">Meter Reading</label>
            <input
              id="reading"
              type="number"
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              placeholder="Enter current reading"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo">Upload Photo</label>
            <button type="button" className="upload-button">Select Photo</button>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes / Flags</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Tampered meter, faulty, etc."
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Submit Inspection</button>
        </form>
      </main>
    </div>
  );
}

export default MeterInspectionPage;
