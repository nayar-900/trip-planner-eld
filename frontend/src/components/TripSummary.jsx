import React from 'react';

const TripSummary = ({ trip, days, fuelStops }) => {
  return (
    <div className="trip-summary">
      <h3>Trip Summary</h3>
      
      <div className="summary-grid">
        <div className="summary-item">
          <span className="label">From → To</span>
          <span className="value">{trip.pickup_location} → {trip.dropoff_location}</span>
        </div>
        <div className="summary-item highlight">
          <span className="label">Total Distance</span>
          <span className="value">{trip.total_distance_miles?.toFixed(0)} <span className="currency">miles</span></span>
        </div>
        <div className="summary-item highlight">
          <span className="label">Total Fuel Cost</span>
          <span className="value">${trip.total_fuel_cost?.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Total Driving</span>
          <span className="value">{trip.total_driving_hours?.toFixed(1)} <span className="currency">hours</span></span>
        </div>
        <div className="summary-item">
          <span className="label">Trip Duration</span>
          <span className="value">{days?.length || 0} <span className="currency">days</span></span>
        </div>
        <div className="summary-item">
          <span className="label">Fuel Stops</span>
          <span className="value">{fuelStops?.length || 0}</span>
        </div>
        <div className="summary-item">
          <span className="label">Cycle Used</span>
          <span className="value">{trip.current_cycle_used?.toFixed(1)} <span className="currency">/ 70 hrs</span></span>
        </div>
        <div className="summary-item">
          <span className="label">Cycle Remaining</span>
          <span className="value">{(70 - (trip.current_cycle_used || 0)).toFixed(1)} <span className="currency">hrs</span></span>
        </div>
      </div>

      {fuelStops && fuelStops.length > 0 && (
        <div className="fuel-stops-section">
          <h4>Fuel Stops</h4>
          {fuelStops.map(stop => (
            <div key={stop.stop_order} className="fuel-stop-item">
              <span className="stop-label">Stop #{stop.stop_order} • {stop.location}</span>
              <span className="stop-cost">${stop.cost?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripSummary;