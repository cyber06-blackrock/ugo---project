import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './RideRequest.css';

const uberCarSvg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="16" y="8" width="32" height="48" rx="6" fill="#000000" />
  <rect x="20" y="14" width="24" height="12" rx="2" fill="#333333" />
  <rect x="20" y="38" width="24" height="14" rx="2" fill="#333333" />
  <path d="M 16 20 L 12 20 L 12 28 L 16 28 Z" fill="#000000" />
  <path d="M 48 20 L 52 20 L 52 28 L 48 28 Z" fill="#000000" />
</svg>
`.trim());

const carIcon = new L.Icon({
  iconUrl: uberCarSvg,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
});

const RideRequest = () => {
  const location = useLocation();
  const [pickup, setPickup]           = useState(location.state?.pickup || '');
  const [dropoff, setDropoff]         = useState(location.state?.dropoff || '');
  const [rideType, setRideType]       = useState('UgoX');
  const [fareStatus, setFareStatus]   = useState(null);
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [driverPosition, setDriverPosition] = useState(null);
  const [driverMetrics, setDriverMetrics]   = useState({ distance: 0, eta: 0 });
  const [historyLocations, setHistoryLocations] = useState([]);
  const navigate = useNavigate();
  const defaultMapCenter = [26.9124, 75.7873];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userStr = localStorage.getItem('ugo_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user._id) {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res  = await fetch(`${API_URL}/api/rides/history/${user._id}`);
            const data = await res.json();
            const locs = new Set();
            data.forEach(r => {
              if (r.pickupLocation?.address)  locs.add(r.pickupLocation.address);
              if (r.dropoffLocation?.address) locs.add(r.dropoffLocation.address);
            });
            setHistoryLocations(Array.from(locs));
          }
        }
      } catch (err) { console.error('History fetch failed:', err); }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(API_URL);
    socket.on('driverLocationUpdate', (data) => {
      if (data?.lat && data?.lng) setDriverPosition([data.lat, data.lng]);
    });
    return () => socket.disconnect();
  }, []);

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  useEffect(() => {
    if (fareStatus !== 'tracking') return;
    let lat = 26.9200, lng = 75.7900;
    const tLat = 26.9124, tLng = 75.7873;
    setDriverPosition([lat, lng]);
    const id = setInterval(() => {
      lat += (tLat - lat) * 0.05;
      lng += (tLng - lng) * 0.05;
      setDriverPosition([lat, lng]);
      const dist = haversine(lat, lng, tLat, tLng);
      setDriverMetrics({ distance: dist.toFixed(2), eta: Math.max(1, Math.ceil(dist / 0.5)) });
      if (dist < 0.05) { clearInterval(id); setDriverMetrics({ distance: 0, eta: 0 }); alert('Driver has arrived!'); }
    }, 2000);
    return () => clearInterval(id);
  }, [fareStatus]);

  const handleCalculateFare = (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;
    setFareStatus('calculating');
    setTimeout(() => {
      const dist = Math.abs(pickup.length - dropoff.length) + 5;
      const mult = rideType === 'UgoXL' ? 1.5 : rideType === 'UgoBlack' ? 2.5 : 1;
      setEstimatedFare((dist * 50 * mult).toFixed(2));
      setFareStatus('calculated');
    }, 1000);
  };

  const handleRequestRide = async () => {
    setFareStatus('requested');
    try {
      let userId = '64e3f192b45a1b0012345678';
      const userStr = localStorage.getItem('ugo_user');
      if (userStr) { const u = JSON.parse(userStr); if (u._id) userId = u._id; }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/rides/request`, { riderId: userId, pickup, dropoff });
      setFareStatus('tracking');
    } catch (err) {
      console.error('Ride request error:', err);
      setFareStatus('tracking');
    }
  };

  return (
    <div className="rr-page animate-in">
      {/* Form panel */}
      <div className="rr-form-panel glass-card">
        <h2 className="rr-title">Request a Ride</h2>

        <form onSubmit={handleCalculateFare} className="rr-form">
          {/* Pickup */}
          <div className="rr-input-wrap">
            <span className="rr-dot rr-dot--white" />
            <input type="text" placeholder="Pickup location" value={pickup}
              onChange={e => setPickup(e.target.value)} list="jaipur-locations" required />
          </div>

          {/* Dropoff */}
          <div className="rr-input-wrap">
            <span className="rr-dot rr-dot--accent" />
            <input type="text" placeholder="Dropoff destination" value={dropoff}
              onChange={e => setDropoff(e.target.value)} list="jaipur-locations" required />
          </div>

          <datalist id="jaipur-locations">
            {historyLocations.map((l,i) => <option key={i} value={l} />)}
            <option value="Hawa Mahal" /><option value="Amer Fort" />
            <option value="City Palace" /><option value="Albert Hall Museum" />
            <option value="Jantar Mantar" /><option value="Patrika Gate" />
            <option value="Jaipur Railway Station" /><option value="Jaipur International Airport" />
            <option value="Jal Mahal" />
          </datalist>

          {/* Ride type */}
          <div className="rr-type-group">
            {['UgoX', 'UgoXL', 'UgoBlack'].map(type => (
              <button key={type} type="button"
                className={`rr-type-btn ${rideType === type ? 'rr-type-btn--active' : ''}`}
                onClick={() => setRideType(type)}>
                {type}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          {fareStatus === null && (
            <button type="submit" className="btn-accent rr-action-btn">See Prices</button>
          )}
          {fareStatus === 'calculating' && (
            <button disabled className="btn-primary rr-action-btn rr-disabled">Calculating…</button>
          )}
          {fareStatus === 'calculated' && (
            <div className="rr-fare animate-in">
              <div className="rr-fare-row">
                <span className="rr-fare-type">{rideType}</span>
                <span className="rr-fare-amt">₹{estimatedFare}</span>
              </div>
              <button type="button" onClick={handleRequestRide} className="btn-primary rr-action-btn">
                Confirm {rideType}
              </button>
            </div>
          )}
          {fareStatus === 'requested' && (
            <button disabled className="btn-primary rr-action-btn rr-disabled">Requesting…</button>
          )}
          {fareStatus === 'tracking' && (
            <div className="rr-tracking animate-in">
              <h3 className="rr-tracking-title">Driver is on the way!</h3>
              <p>Your driver will arrive at your pickup location shortly.</p>
              <div className="rr-metrics">
                <div><span>Distance</span><strong>{driverMetrics.distance} km</strong></div>
                <div><span>ETA</span><strong>{driverMetrics.eta} min</strong></div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Map panel */}
      <div className="rr-map-panel">
        <MapContainer center={defaultMapCenter} zoom={13}
          style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {driverPosition && (
            <Marker position={driverPosition} icon={carIcon}>
              <Popup>Driver is here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RideRequest;
