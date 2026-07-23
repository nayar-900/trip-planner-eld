import React, { useState } from 'react';
import TripForm from './components/TripForm';
import TripSummary from './components/TripSummary';
import RouteMap from './components/RouteMap';
import ELDLog from './components/ELDLog';
import { planTrip } from './services/api';
import './App.css';
import Logo from './components/Logo';

function App() {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await planTrip(formData);
      setTripData(data);
      setTimeout(() => {
        document.querySelector('.results-section')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    } catch (err) {
      setError(err.message || 'Unable to plan trip. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-wrapper">
            <Logo />
            <div className="logo-text">
              <h1>FleetLog</h1>
              <span className="logo-sub">ELD Compliance & Trip Planning</span>
            </div>
          </div>
          <div className="header-badge">
            <span className="badge">FMCSA Compliant</span>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">Professional Driver's Tool</div>
          <h2>Plan Your Trip.<br />Stay Compliant.</h2>
          <p>Enter your trip details below and we'll generate your route, fuel stops, and complete ELD logs.</p>
        </div>
      </section>

      <main className="app-content">
        <div className="form-section">
          <div className="form-card">
            <TripForm onSubmit={handleSubmit} loading={loading} />
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        {tripData && (
          <div className="results-section">
            <div className="results-header">
              <div>
                <h2>Trip Plan</h2>
                <span className="results-subtitle">Generated ELD logs and route information</span>
              </div>
              <span className="trip-id">Trip #{tripData.trip.id}</span>
            </div>
            
            <TripSummary 
              trip={tripData.trip} 
              days={tripData.days} 
              fuelStops={tripData.fuel_stops} 
            />

            <div className="map-section">
              <div className="section-header">
                <h3>Route Overview</h3>
                <span className="section-badge">Interactive Map</span>
              </div>
              <RouteMap 
                routePath={tripData.route.path}
                startCoords={tripData.route.start_coords}
                endCoords={tripData.route.end_coords}
                fuelStops={tripData.fuel_stops}
              />
            </div>

            <div className="logs-section">
              <div className="section-header">
                <h3>ELD Logs</h3>
                <span className="section-badge">{tripData.days?.length || 0} Days</span>
              </div>
              <ELDLog days={tripData.days} />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">FleetLog</span>
            <span className="footer-divider">|</span>
            <span className="footer-tagline">FMCSA Compliant ELD Logging</span>
          </div>
          <p className="footer-copy">&copy; 2026 FleetLog — All rights reserved</p>
          <p className="footer-disclaimer">For demonstration purposes only. Always verify compliance with current FMCSA regulations.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;