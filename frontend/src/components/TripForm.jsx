import React, { useState } from 'react';

const TripForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'current_cycle_used' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.current_location || !formData.pickup_location || !formData.dropoff_location) {
      alert('Please fill in all location fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h2>Trip Details</h2>
      <p className="form-subtitle">Enter your trip information to generate route and ELD logs</p>
      
      <div className="form-group">
        <label>Current Location <span className="required">*</span></label>
        <input
          type="text"
          name="current_location"
          value={formData.current_location}
          onChange={handleChange}
          placeholder="e.g., Chicago, IL"
          required
        />
      </div>

      <div className="form-group">
        <label>Pickup Location <span className="required">*</span></label>
        <input
          type="text"
          name="pickup_location"
          value={formData.pickup_location}
          onChange={handleChange}
          placeholder="e.g., Chicago, IL"
          required
        />
      </div>

      <div className="form-group">
        <label>Dropoff Location <span className="required">*</span></label>
        <input
          type="text"
          name="dropoff_location"
          value={formData.dropoff_location}
          onChange={handleChange}
          placeholder="e.g., Los Angeles, CA"
          required
        />
      </div>

      <div className="form-group">
        <label>Current Cycle Used (hours)</label>
        <input
          type="number"
          name="current_cycle_used"
          value={formData.current_cycle_used}
          onChange={handleChange}
          placeholder="0"
          min="0"
          max="70"
          step="0.5"
        />
        <span className="hint">Hours already worked in the current <strong>8-day</strong> cycle (max 70)</span>
      </div>

      <button type="submit" className="plan-btn" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner"></span>
            Planning Trip...
          </>
        ) : (
          'Plan Trip'
        )}
      </button>
    </form>
  );
};

export default TripForm;