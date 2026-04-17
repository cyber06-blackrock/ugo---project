import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Create a custom driver marker icon
const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3206/3206015.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const RideRequest = () => {
  const location = useLocation();
  const [pickup, setPickup] = useState(location.state?.pickup || '');
  const [dropoff, setDropoff] = useState(location.state?.dropoff || '');
  const [rideType, setRideType] = useState('UgoX');
  const [fareStatus, setFareStatus] = useState(null); // null, 'calculating', 'calculated', 'requested', 'tracking'
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [driverPosition, setDriverPosition] = useState(null); // Will store [lat, lng]
  const [driverMetrics, setDriverMetrics] = useState({ distance: 0, eta: 0 });
  const [historyLocations, setHistoryLocations] = useState([]);
  
  const navigate = useNavigate();

  // Jaipur coordinates
  const defaultMapCenter = [26.9124, 75.7873];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userStr = localStorage.getItem('ugo_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user._id) {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/rides/history/${user._id}`);
            const data = await res.json();
            const locations = new Set();
            data.forEach(ride => {
              if (ride.pickupLocation?.address) locations.add(ride.pickupLocation.address);
              if (ride.dropoffLocation?.address) locations.add(ride.dropoffLocation.address);
            });
            setHistoryLocations(Array.from(locations));
          }
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(API_URL);

    socket.on('driverLocationUpdate', (data) => {
      if (data && data.lat && data.lng) {
        setDriverPosition([data.lat, data.lng]);
      }
    });

    return () => socket.disconnect();
  }, []);

  // Calculate distance using Haversine formula
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distance in km
  };

  // Mock driver simulation when tracking starts
  useEffect(() => {
    if (fareStatus === 'tracking') {
      let currentLat = 26.9200; // Start slightly away
      let currentLng = 75.7900;
      const targetLat = 26.9124; // Pickup loc
      const targetLng = 75.7873;
      
      setDriverPosition([currentLat, currentLng]);
      
      const interval = setInterval(() => {
        // Move 5% closer every 2 seconds
        currentLat += (targetLat - currentLat) * 0.05;
        currentLng += (targetLng - currentLng) * 0.05;
        setDriverPosition([currentLat, currentLng]);
        
        const dist = getDistanceFromLatLonInKm(currentLat, currentLng, targetLat, targetLng);
        // Assuming driver speed is 30 km/h (0.5 km/min)
        const etaMins = Math.max(1, Math.ceil(dist / 0.5));
        
        setDriverMetrics({ distance: dist.toFixed(2), eta: etaMins });
        
        if (dist < 0.05) {
           clearInterval(interval);
           setDriverMetrics({ distance: 0, eta: 0 });
           alert("Driver has arrived!");
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [fareStatus]);

  const handleCalculateFare = (e) => {
    e.preventDefault();
    if(!pickup || !dropoff) return;
    
    setFareStatus('calculating');
    
    // Simulate API delay for fare calculation
    setTimeout(() => {
      const mockDistance = Math.abs(pickup.length - dropoff.length) + 5;
      const baseFare = mockDistance * 50; // ₹50 per km
      let multiplier = 1;
      
      if(rideType === 'UgoXL') multiplier = 1.5;
      if(rideType === 'UgoBlack') multiplier = 2.5;
      
      setEstimatedFare((baseFare * multiplier).toFixed(2));
      setFareStatus('calculated');
    }, 1000);
  };

  const handleRequestRide = async () => {
    setFareStatus('requested');
    try {
      // Get the actual user ID if logged in, otherwise use mock
      let userId = '64e3f192b45a1b0012345678'; 
      const userStr = localStorage.getItem('ugo_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user._id) userId = user._id;
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/rides/request`, {
        riderId: userId,
        pickup,
        dropoff
      });
      setFareStatus('tracking');
    } catch (error) {
       console.error("Error requesting ride:", error);
       alert("Simulation only: Provide valid User ID in backend or mock auth to fully test DB insertion. Error logged.");
       // Start tracking anyway for demo purposes
       setFareStatus('tracking');
    }
  };

  return (
    <div className="container animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Left Form Side */}
        <div className="glass-card">
          <h2>Request a Ride</h2>
          <form onSubmit={handleCalculateFare} style={{ marginTop: '1.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <div style={{ position: 'absolute', left: '15px', top: '20px', width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
              <input 
                type="text" 
                placeholder="Pickup location" 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                list="jaipur-locations"
                required
              />
              <div style={{ position: 'absolute', left: '19px', top: '35px', width: '1px', height: '25px', background: 'rgba(255,255,255,0.2)' }}></div>
            </div>
            
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
               <div style={{ position: 'absolute', left: '15px', top: '20px', width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '2px' }}></div>
              <input 
                type="text" 
                placeholder="Dropoff destination" 
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                list="jaipur-locations"
                required
              />
            </div>

            <datalist id="jaipur-locations">
               {historyLocations.map((loc, idx) => (
                 <option key={`hist-${idx}`} value={loc} />
               ))}
               <option value="Hawa Mahal" />
               <option value="Amer Fort" />
               <option value="City Palace" />
               <option value="Albert Hall Museum" />
               <option value="Jantar Mantar" />
               <option value="Patrika Gate" />
               <option value="Jaipur Railway Station" />
               <option value="Jaipur International Airport" />
               <option value="Jal Mahal" />
            </datalist>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {['UgoX', 'UgoXL', 'UgoBlack'].map(type => (
                <button 
                  key={type}
                  type="button"
                  onClick={() => setRideType(type)}
                  style={{ 
                    flex: 1, 
                    padding: '0.8rem', 
                    background: rideType === type ? 'var(--secondary-color)' : 'var(--surface-h)',
                    color: rideType === type ? 'var(--primary-color)' : 'white',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >{type}</button>
              ))}
            </div>

            {fareStatus === null && <button type="submit" className="btn-accent" style={{ width: '100%' }}>See Prices</button>}
            {fareStatus === 'calculating' && <button disabled className="btn-primary" style={{ width: '100%', opacity: 0.7 }}>Calculating...</button>}
            
            {fareStatus === 'calculated' && (
              <div className="animate-in">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{rideType}</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00e676' }}>₹{estimatedFare}</span>
                 </div>
                 <button type="button" onClick={handleRequestRide} className="btn-primary" style={{ width: '100%' }}>Confirm {rideType}</button>
              </div>
            )}
            
            {fareStatus === 'requested' && <button disabled className="btn-primary" style={{ width: '100%', opacity: 0.7 }}>Requesting...</button>}
            
            {fareStatus === 'tracking' && (
              <div className="animate-in" style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                 <h3 style={{ color: '#00e676', marginBottom: '0.5rem' }}>Driver is on the way!</h3>
                 <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your driver will arrive at your pickup location shortly.</p>
                 <div style={{ display: 'flex', justifyContent: 'space-around', background: 'var(--surface-h)', padding: '1rem', borderRadius: '8px' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Distance</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{driverMetrics.distance} km</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ETA</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{driverMetrics.eta} min</div>
                    </div>
                 </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Map Side */}
        <div className="map-container" style={{ height: '70vh', borderRadius: '16px', overflow: 'hidden' }}>
            <MapContainer center={defaultMapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {driverPosition && (
                <Marker position={driverPosition} icon={driverIcon}>
                  <Popup>Driver is here</Popup>
                </Marker>
              )}
            </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default RideRequest;
