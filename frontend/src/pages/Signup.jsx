import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'rider',
    profilePhoto: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Image must be less than 5MB' }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Please select a valid image file' }));
        return;
      }

      setFormData(prev => ({ ...prev, profilePhoto: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        profilePhoto: imagePreview || null // Send base64 encoded image
      };

      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store auth token and user data
      localStorage.setItem('ugo_token', data.token);
      localStorage.setItem('ugo_user', JSON.stringify(data));

      setSuccess(true);
      setTimeout(() => {
        navigate(formData.role === 'driver' ? '/dashboard' : '/ride');
      }, 1500);

    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card auth-card--success">
          <div className="auth-success-icon">✓</div>
          <h2 className="auth-title">Welcome aboard!</h2>
          <p className="auth-subtitle">Account created successfully</p>
          <div className="success-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-logo">U</span>
          <span className="auth-brand-name">Ugo</span>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join Ugo in a few seconds</p>

        {errors.general && (
          <div className="auth-error" role="alert">
            <span className="auth-error-icon">⚠</span> {errors.general}
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          {/* Profile Photo Upload */}
          <div className="form-group">
            <label htmlFor="profilePhoto" className="photo-upload-label">
              {imagePreview ? (
                <div className="photo-preview">
                  <img src={imagePreview} alt="Preview" />
                  <span className="change-label">Change Photo</span>
                </div>
              ) : (
                <div className="photo-placeholder">
                  <span className="photo-icon">📸</span>
                  <span className="photo-text">Add Profile Photo</span>
                </div>
              )}
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {errors.profilePhoto && <p className="field-error">{errors.profilePhoto}</p>}
          </div>

          {/* Name Field */}
          <div className="form-group">
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <div className="input-wrap">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn${formData.role === 'rider' ? ' role-btn--active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'rider' }))}
              >
                🚗 Rider
              </button>
              <button
                type="button"
                className={`role-btn${formData.role === 'driver' ? ' role-btn--active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'driver' }))}
              >
                🚙 Driver
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-button auth-button--ready"
            disabled={loading}
          >
            {loading ? (
              <><span className="auth-spinner" /> Creating account...</>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="auth-switch">
          Already have an account?
          <Link to="/login" className="auth-switch-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
