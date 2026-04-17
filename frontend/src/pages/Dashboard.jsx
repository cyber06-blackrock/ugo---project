import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const Dashboard = () => {
  const [status, setStatus] = useState('offline');
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    // Using axios for a GET request to fetch data from the database!
    const fetchActiveRides = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/rides/active`);
        // 'response.data' contains the results we got back from Mongoose!
        setRideRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch rides via GET:", error);
      }
    };
    
    fetchActiveRides();

    // Example socket connection to backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(API_URL);
    
    socket.on('connect', () => {
      console.log('Connected to simulation server');
    });

    socket.on('rideRequest', (request) => {
      setRideRequests(prev => [...prev, request]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Driver Dashboard</h2>
        <div>
          <span style={{ 
            display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', 
            background: status === 'online' ? '#00e676' : '#ff1744', marginRight: '8px' 
          }}></span>
          <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{status}</span>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Toggle Availability</h3>
          <p>Go online to start receiving ride requests.</p>
        </div>
        <button 
          className={status === 'online' ? 'btn-primary' : 'btn-accent'}
          onClick={() => setStatus(status === 'online' ? 'offline' : 'online')}
        >
          {status === 'online' ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className="map-container" style={{ marginBottom: '2rem' }}>
         <h1 style={{ color: 'rgba(255,255,255,0.2)' }}>Live Map Tracking</h1>
      </div>

      <h2>Recent Requests</h2>
      {rideRequests.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No new ride requests right now.</p>
      ) : (
        <div className="card-grid">
          {rideRequests.map((req, idx) => (
             <div key={idx} className="glass-card">
               <h4>{req.pickup} to {req.dropoff}</h4>
               <p style={{ marginTop: '1rem', color: '#00e676', fontWeight: 'bold' }}>{req.fare}</p>
               <button className="btn-accent" style={{ marginTop: '1rem', width: '100%' }}>Accept Ride</button>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
