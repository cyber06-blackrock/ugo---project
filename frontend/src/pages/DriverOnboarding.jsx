import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="container animate-in" style={{ maxWidth: '600px', marginTop: '3rem' }}>
      <div className="glass-card">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Drive with Ugo</h1>
        <p style={{ marginBottom: '2rem' }}>Sign up to be a driver, earn on your schedule, and explore the city.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
          
          <h3 style={{ margin: '1.5rem 0 1rem 0', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Vehicle Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
            className="btn-accent" 
            style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Complete Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverOnboarding;
