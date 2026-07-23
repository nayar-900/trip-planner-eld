import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RouteMap = ({ routePath, startCoords, endCoords, fuelStops }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 4);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers (except tile layer)
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return;
      map.removeLayer(layer);
    });

    // Add route path
    if (routePath && routePath.length > 1) {
      const latLngs = routePath.map(coord => [coord[1], coord[0]]);
      
      // Main route line
      L.polyline(latLngs, { 
        color: '#f59e0b', 
        weight: 5,
        opacity: 0.9,
        smoothFactor: 1,
      }).addTo(map);

      // Glow effect
      L.polyline(latLngs, { 
        color: '#fbbf24', 
        weight: 12,
        opacity: 0.15,
        smoothFactor: 1,
      }).addTo(map);
    }

    // Custom marker icons
    const createMarker = (color, label) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            color: white;
          ">
            ${label}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // Start marker
    if (startCoords) {
      const marker = L.marker(
        [startCoords.latitude, startCoords.longitude], 
        { icon: createMarker('#22c55e', 'S') }
      ).addTo(map);
      marker.bindPopup(`
        <strong>📍 Start / Pickup</strong><br>
        ${startCoords.name || 'Start Location'}
      `);
    }

    // End marker
    if (endCoords) {
      const marker = L.marker(
        [endCoords.latitude, endCoords.longitude], 
        { icon: createMarker('#ef4444', 'E') }
      ).addTo(map);
      marker.bindPopup(`
        <strong>📍 End / Dropoff</strong><br>
        ${endCoords.name || 'End Location'}
      `);
    }

    // Fuel stop markers
    if (fuelStops && fuelStops.length > 0) {
      fuelStops.forEach(stop => {
        const marker = L.marker(
          [stop.latitude, stop.longitude], 
          { icon: createMarker('#f59e0b', '⛽') }
        ).addTo(map);
        marker.bindPopup(`
          <strong>⛽ Fuel Stop #${stop.stop_order}</strong><br>
          Distance: ${stop.cumulative_distance?.toFixed(0)} miles<br>
          Cost: $${stop.cost?.toFixed(2)}
        `);
      });
    }

    // Fit bounds to show all markers
    if (routePath && routePath.length > 0) {
      const bounds = L.latLngBounds(routePath.map(coord => [coord[1], coord[0]]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }

    // Handle resize
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [routePath, startCoords, endCoords, fuelStops]);

  return <div ref={mapContainerRef} className="route-map" />;
};

export default RouteMap;