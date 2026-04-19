import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
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

const RideRequest = () => {
  const location = useLocation();
  const [pickup, setPickup]           = useState(location.state?.pickup || '');
  const [dropoff, setDropoff]         = useState(location.state?.dropoff || '');
  const [rideType, setRideType]       = useState('UgoGo'); // Default to most affordable
  const [fareStatus, setFareStatus]   = useState(null);
  const [quotes, setQuotes]           = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [driverMetrics, setDriverMetrics]   = useState({ distance: 0, eta: 0 });
  const [historyLocations, setHistoryLocations] = useState([]);
  const navigate = useNavigate();
  const defaultMapCenter = { lat: 26.9124, lng: 75.7873 };

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
      if (data?.lat && data?.lng) setDriverPosition({ lat: data.lat, lng: data.lng });
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
    setDriverPosition({ lat, lng });
    const id = setInterval(() => {
      lat += (tLat - lat) * 0.05;
      lng += (tLng - lng) * 0.05;
      setDriverPosition({ lat, lng });
      const dist = haversine(lat, lng, tLat, tLng);
      setDriverMetrics({ distance: dist.toFixed(2), eta: Math.max(1, Math.ceil(dist / 0.5)) });
      if (dist < 0.05) { clearInterval(id); setDriverMetrics({ distance: 0, eta: 0 }); alert('Driver has arrived!'); }
    }, 2000);
    return () => clearInterval(id);
  }, [fareStatus]);

  const handleCalculateFare = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;
    setFareStatus('calculating');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/rides/quote`, {
        params: { pickup, dropoff }
      });
      setQuotes(response.data.quotes);
      setSelectedQuote(response.data.quotes[0]); // Default to first (affordable)
      setFareStatus('calculated');
    } catch (error) {
      console.error("Failed to get quotes:", error);
      alert("Failed to calculate fare. Please try again.");
      setFareStatus(null);
    }
  };

  const handleRequestRide = async () => {
    if (!selectedQuote) return;
    setFareStatus('requested');
    try {
      let userId = '64e3f192b45a1b0012345678';
      const userStr = localStorage.getItem('ugo_user');
      if (userStr) { const u = JSON.parse(userStr); if (u._id) userId = u._id; }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/rides/request`, { 
        riderId: userId, 
        pickup, 
        dropoff,
        fare: selectedQuote.price,
        distance: selectedQuote.distance + " km"
      });
      setFareStatus('tracking');
    } catch (err) {
      console.error('Ride request error:', err);
      setFareStatus('tracking');
    }
  };

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="rr-page animate-in">
      <div className="rr-form-panel glass-card">
        <h2 className="rr-title">Where to?</h2>

        <form onSubmit={handleCalculateFare} className="rr-form">
          <div className="rr-input-wrap">
            <span className="rr-dot rr-dot--white" />
            <input type="text" placeholder="Pickup location" value={pickup}
              onChange={e => setPickup(e.target.value)} list="jaipur-locations" required />
          </div>

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

          {fareStatus === 'calculated' && (
            <div className="rr-quotes-list animate-in">
              <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1rem' }}>Available Rides</h3>
              {quotes.map((q, idx) => (
                <div 
                  key={idx} 
                  className={`rr-quote-item ${selectedQuote?.type === q.type ? 'rr-quote-item--active' : ''}`}
                  onClick={() => setSelectedQuote(q)}
                >
                  <div className="rr-quote-info">
                    <strong>{q.type}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{q.info}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>{q.duration} away</span>
                  </div>
                  <div className="rr-quote-price">
                    <strong>₹{q.price}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}

          {fareStatus === null && (
            <button type="submit" className="btn-accent rr-action-btn" style={{ marginTop: '1rem' }}>See Prices</button>
          )}
          {fareStatus === 'calculating' && (
            <button disabled className="btn-primary rr-action-btn rr-disabled">Searching rides…</button>
          )}
          {fareStatus === 'calculated' && (
            <button type="button" onClick={handleRequestRide} className="btn-primary rr-action-btn" style={{ marginTop: '1rem' }}>
              Confirm {selectedQuote?.type}
            </button>
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

      <div className="rr-map-panel">
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={defaultMapCenter}
            center={driverPosition || defaultMapCenter}
            defaultZoom={13}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={'bf51a910020fa1cf'}
            className="google-map-instance"
          >
            {driverPosition && (
              <AdvancedMarker position={driverPosition}>
                <img src={uberCarSvg} width={40} height={40} alt="Driver" />
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default RideRequest;
