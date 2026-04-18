import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './DriverOnboarding.css';

const DriverOnboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    carMake: '',
    carModel: '',
    licensePlate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Call standard registration endpoint but force role to 'driver'
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'driver'
      });
      
      console.log("Registered driver:", response.data);
      // Store token and user data in localStorage
      localStorage.setItem('ugo_token', response.data.token);
      localStorage.setItem('ugo_user', JSON.stringify(response.data));

      alert("Successfully registered as a driver!");
      navigate('/dashboard'); // Take them to dashboard to go online
      
    } catch (error) {
      console.error(error);
      alert("Registration failed. Email might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-in do-page">
      <div className="glass-card do-card">
        <h1 className="do-title">Drive with Ugo</h1>
        <p className="do-subtitle">Sign up to be a driver, earn on your schedule, and explore the city.</p>
        
        <form onSubmit={handleSubmit} className="do-form">
          <div className="do-grid">
            <input 
              name="name" type="text" placeholder="Full Name" required 
              onChange={handleChange} value={formData.name}
            />
            <input 
              name="email" type="email" placeholder="Email Address" required 
              onChange={handleChange} value={formData.email}
            />
          </div>
          
          <input 
            name="password" type="password" placeholder="Create a secure password" required 
            onChange={handleChange} value={formData.password}
          />
          
          <h3 className="do-section-title">Vehicle Details</h3>
          
          <div className="do-grid">
            <input 
              name="carMake" type="text" placeholder="Make (e.g. Toyota)" required 
              onChange={handleChange} value={formData.carMake}
            />
            <input 
              name="carModel" type="text" placeholder="Model (e.g. Camry)" required 
              onChange={handleChange} value={formData.carModel}
            />
          </div>
          
          <input 
            name="licensePlate" type="text" placeholder="License Plate Number" required 
            onChange={handleChange} value={formData.licensePlate}
          />

          <button 
            type="submit" 
            className="btn-accent do-submit-btn" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Complete Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
          Already signed up? <Link to="/login" state={{ role: 'driver' }} style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default DriverOnboarding;
