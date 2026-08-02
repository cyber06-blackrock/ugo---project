import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'rider'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      localStorage.setItem('ugo_token', data.token);
      localStorage.setItem('ugo_user', JSON.stringify(data));
      navigate(formData.role === 'driver' ? '/dashboard' : '/ride');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-logo">U</span>
          <span className="auth-brand-name">Ugo</span>
        </div>

        <h2 className="auth-title">Sign Up</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="auth-input"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="auth-input"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="auth-input"
            required
          />

          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${formData.role === 'rider' ? ' role-btn--active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'rider' })}
            >
              🚗 Rider
            </button>
            <button
              type="button"
              className={`role-btn${formData.role === 'driver' ? ' role-btn--active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'driver' })}
            >
              🚕 Driver
            </button>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?
          <Link to="/login" className="auth-switch-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
