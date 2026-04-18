import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './Dashboard.css';

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/741/741407.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Helper component to smoothly center map
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const Dashboard = () => {
  const [status, setStatus] = useState('offline');
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState([26.9124, 75.7873]); // Default Jaipur
  const watchId = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Check initial status if we wanted (optional depending on API)
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
      setRideRequests(prev => [...prev, request]);
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
      
      // Update backend
      await axios.put(`${API_URL}/api/drivers/status`, 
        { isAvailable: newStatus === 'online' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStatus(newStatus);
      
      // Handle Location Tracking
      if (newStatus === 'online') {
        if ('geolocation' in navigator) {
          watchId.current = navigator.geolocation.watchPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentPosition([latitude, longitude]);
              try {
                // Update DB
                await axios.put(`${API_URL}/api/drivers/location`, 
                  { lat: latitude, lng: longitude },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                // Emit Live Tracking Socket Event
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
                console.log("Location broadcasted:", latitude, longitude);
              } catch (err) {
                console.error("Failed to update location to server", err);
              }
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
          );
        } else {
          alert("Geolocation is not supported by your browser");
        }
      } else {
        // Go offline -> Stop watching location
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

  return (
    <div className="container animate-in db-page">
      <div className="db-header">
        <h2>Driver Dashboard</h2>
        <div className="db-status-container">
          <span className={`db-status-dot ${status === 'online' ? 'online' : 'offline'}`}></span>
          <span className="db-status-text">{status}</span>
        </div>
      </div>

      <div className="glass-card db-toggle-card">
        <div className="db-toggle-text">
          <h3>Toggle Availability</h3>
          <p>Go online to start receiving ride requests.</p>
        </div>
        <button 
          className={status === 'online' ? 'btn-primary' : 'btn-accent'}
          onClick={handleToggleStatus}
          disabled={loading}
        >
          {loading ? 'Updating...' : (status === 'online' ? 'Go Offline' : 'Go Online')}
        </button>
      </div>

      <div className="map-container db-map" style={{ height: '400px', width: '100%', marginBottom: '2rem' }}>
         <MapContainer center={currentPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
           <MapUpdater center={currentPosition} />
           <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
             url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
           />
           {status === 'online' && (
             <Marker position={currentPosition} icon={carIcon}>
               <Popup>You are here (Online)</Popup>
             </Marker>
           )}
         </MapContainer>
      </div>

      <h2>Recent Requests</h2>
      {rideRequests.length === 0 ? (
        <p className="db-no-requests">No new ride requests right now.</p>
      ) : (
        <div className="card-grid">
          {rideRequests.map((req, idx) => (
             <div key={idx} className="glass-card">
               <h4>{req.pickup} to {req.dropoff}</h4>
               <p className="db-fare">{req.fare}</p>
               <button className="btn-accent db-accept-btn">Accept Ride</button>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
