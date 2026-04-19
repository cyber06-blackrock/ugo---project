import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import './Dashboard.css';

const uberCarSvg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="16" y="8" width="32" height="48" rx="6" fill="#000000" />
  <rect x="20" y="14" width="24" height="12" rx="2" fill="#333333" />
  <rect x="20" y="38" width="24" height="14" rx="2" fill="#333333" />
  <path d="M 16 20 L 12 20 L 12 28 L 16 28 Z" fill="#000000" />
  <path d="M 48 20 L 52 20 L 52 28 L 48 28 Z" fill="#000000" />
</svg>
`.trim());

const Dashboard = () => {
  const [status, setStatus] = useState('offline');
  const [rideRequests, setRideRequests] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ lat: 26.9124, lng: 75.7873 }); // Default Jaipur
  const watchId = useRef(null);
  const socketRef = useRef(null);

  // Mock stats for a professional look
  const [stats] = useState({
    rides: 12,
    earnings: "₹1,450",
    rating: 4.9,
    hours: "5.2"
  });

  useEffect(() => {
    const fetchActiveRides = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/rides/active`);
        setRideRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      }
    };
    fetchActiveRides();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(API_URL);
    
    socketRef.current.on('connect', () => {
      console.log('Connected to simulation server');
    });

    socketRef.current.on('rideRequest', (request) => {
      // Add a random KM for simulation if not present
      const simulatedRequest = {
        ...request,
        distance: request.distance || (Math.random() * 15 + 1).toFixed(1) + " km"
      };
      setRideRequests(prev => [...prev, simulatedRequest]);
    });

    return () => {
      socketRef.current.disconnect();
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const handleToggleStatus = async () => {
    setLoading(true);
    const newStatus = status === 'online' ? 'offline' : 'online';
    const token = localStorage.getItem('ugo_token');
    
    if (!token) {
      alert("Please log in first!");
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${API_URL}/api/drivers/status`, 
        { isAvailable: newStatus === 'online' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStatus(newStatus);
      
      if (newStatus === 'online') {
        if ('geolocation' in navigator) {
          watchId.current = navigator.geolocation.watchPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentPosition({ lat: latitude, lng: longitude });
              try {
                await axios.put(`${API_URL}/api/drivers/location`, 
                  { lat: latitude, lng: longitude },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const userStr = localStorage.getItem('ugo_user');
                if (userStr && socketRef.current) {
                  const user = JSON.parse(userStr);
                  socketRef.current.emit('updateLocation', {
                    driverId: user._id,
                    name: user.name,
                    lat: latitude,
                    lng: longitude
                  });
                }
              } catch (err) {
                console.error("Failed to update location", err);
              }
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
          );
        } else {
          alert("Geolocation is not supported");
        }
      } else {
        if (watchId.current) {
          navigator.geolocation.clearWatch(watchId.current);
          watchId.current = null;
        }
      }
    } catch (error) {
      console.error("Status toggle failed:", error);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
  };

  return (
    <div className="container animate-in db-page">
      {/* Header with Stats */}
      <div className="db-header">
        <div className="db-title-area">
          <h2>Driver Dashboard</h2>
          <div className={`db-status-badge`}>
            <span className={`db-status-dot ${status === 'online' ? 'online' : 'offline'}`}></span>
            {status.toUpperCase()}
          </div>
        </div>
        
        <div className="db-stats-grid">
          <div className="glass-card db-stat-card">
            <span className="db-stat-value">{stats.earnings}</span>
            <span className="db-stat-label">Today's Earnings</span>
          </div>
          <div className="glass-card db-stat-card">
            <span className="db-stat-value">{stats.rides}</span>
            <span className="db-stat-label">Total Rides</span>
          </div>
          <div className="glass-card db-stat-card">
            <span className="db-stat-value">★ {stats.rating}</span>
            <span className="db-stat-label">Rating</span>
          </div>
          <div className="glass-card db-stat-card">
            <span className="db-stat-value">{stats.hours}h</span>
            <span className="db-stat-label">Online Hours</span>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="glass-card db-toggle-card">
        <div className="db-toggle-text">
          <h3>Go Online to Earn</h3>
          <p>You'll start receiving nearby ride requests instantly.</p>
        </div>
        <button 
          className={status === 'online' ? 'btn-primary' : 'btn-accent'}
          onClick={handleToggleStatus}
          disabled={loading}
          style={{ minWidth: '160px' }}
        >
          {loading ? '...' : (status === 'online' ? 'Go Offline' : 'Go Online')}
        </button>
      </div>

      {/* Map View */}
      <div className="db-map-wrapper">
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={currentPosition}
              center={currentPosition}
              defaultZoom={14}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              mapId={'bf51a910020fa1cf'}
              className="db-map"
            >
              {status === 'online' && (
                <AdvancedMarker position={currentPosition}>
                  <img src={uberCarSvg} width={40} height={40} alt="You" />
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
      </div>

      {/* Requests Section */}
      <div className="db-requests-header">
        <h2>Nearby Requests</h2>
        {rideRequests.length > 0 && <span className="badge-pill">{rideRequests.length} available</span>}
      </div>

      {rideRequests.length === 0 ? (
        <div className="db-no-requests">
          <p>Searching for nearby riders...</p>
        </div>
      ) : (
        <div className="card-grid">
          {rideRequests.map((req, idx) => (
             <div key={idx} className="glass-card request-card" onClick={() => handleRideClick(req)}>
               <div className="request-info">
                 <div className="request-locations">
                   <div className="loc-item">
                     <span className="loc-dot pickup"></span>
                     <span>{req.pickup}</span>
                   </div>
                   <div className="loc-item">
                     <span className="loc-dot dropoff"></span>
                     <span>{req.dropoff}</span>
                   </div>
                 </div>
                 <div className="request-meta">
                   <span className="request-price">{req.fare}</span>
                   <span className="request-dist">{req.distance || "2.4 km"}</span>
                 </div>
               </div>
               <button className="btn-accent db-accept-btn" style={{ padding: '0.75rem' }}>View Details</button>
             </div>
          ))}
        </div>
      )}

      {/* Ride Detail Modal */}
      {selectedRide && (
        <div className="ride-detail-overlay" onClick={() => setSelectedRide(null)}>
          <div className="ride-detail-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h3>New Ride Request</h3>
              <button className="btn-close" onClick={() => setSelectedRide(null)}>×</button>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Estimated Fare</label>
                <span>{selectedRide.fare}</span>
              </div>
              <div className="detail-item">
                <label>Distance</label>
                <span>{selectedRide.distance || "2.4 km"}</span>
              </div>
              <div className="detail-item">
                <label>Estimated Time</label>
                <span>~12 mins</span>
              </div>
              <div className="detail-item">
                <label>Payment Mode</label>
                <span>Cash/Online</span>
              </div>
            </div>

            <div className="detail-locations">
               <div className="loc-item">
                  <span className="loc-dot pickup"></span>
                  <div className="loc-text">
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>PICKUP</label>
                    <div style={{ fontWeight: '600' }}>{selectedRide.pickup}</div>
                  </div>
               </div>
               <div style={{ height: '20px', borderLeft: '2px dashed #ccc', marginLeft: '3px', margin: '4px 0 4px 3px' }}></div>
               <div className="loc-item">
                  <span className="loc-dot dropoff"></span>
                  <div className="loc-text">
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>DROPOFF</label>
                    <div style={{ fontWeight: '600' }}>{selectedRide.dropoff}</div>
                  </div>
               </div>
            </div>

            <div className="detail-actions">
              <button className="btn-primary btn-decline" onClick={() => setSelectedRide(null)}>Decline</button>
              <button className="btn-accent btn-accept-big" onClick={() => {
                alert("Ride Accepted! Navigating to customer...");
                setSelectedRide(null);
              }}>Accept Ride</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
