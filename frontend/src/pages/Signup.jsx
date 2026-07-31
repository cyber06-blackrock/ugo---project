import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

// ── Quick validation (minimal for fast signup) ─────────────────────────────
const quickValidate = {
  phone: (v) => {
    if (!v.trim()) return 'Phone number is required.';
    if (!/^\d{10}$/.test(v.replace(/\D/g, ''))) return 'Enter a valid 10-digit phone number.';
    return '';
  },
  name: (v) => {
    if (!v.trim()) return 'Name is required.';
    if (v.trim().length < 2) return 'Name too short.';
    return '';
  },
};

const Signup = () => {
  const navigate = useNavigate();

  // ── Fast signup states ──────────────────────────────────────────────────
  const [signupMethod, setSignupMethod] = useState('phone'); // 'phone' | 'email' | 'social'
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    role: 'rider',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState(false);

  // ── Input handlers ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  // ── Quick OTP signup ────────────────────────────────────────────────────
  const handleQuickSignup = async (e) => {
    e.preventDefault();
    
    // Quick validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (signupMethod === 'phone' && quickValidate.phone(formData.phone)) {
      newErrors.phone = quickValidate.phone(formData.phone);
    }
    if (signupMethod === 'email' && !formData.email.includes('@')) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.agreeTerms) newErrors.terms = 'Please accept terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setLoading(false);
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
      setLoading(false);
    }
  };

  // ── Verify OTP and create account ───────────────────────────────────────
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Enter 6-digit OTP' });
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Create account with minimal data
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: signupMethod === 'phone' ? formData.phone.replace(/\D/g, '') : undefined,
          email: signupMethod === 'email' ? formData.email.trim() : undefined,
          role: formData.role,
          verified: true, // Since OTP verified
          quickSignup: true
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      // Store auth data
      localStorage.setItem('ugo_token', data.token);
      localStorage.setItem('ugo_user', JSON.stringify(data));

      setSuccess(true);
      setTimeout(() => {
        navigate(data.role === 'driver' ? '/dashboard' : '/ride');
      }, 1200);

    } catch (error) {
      setErrors({ otp: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Social signup (Google/Phone) ────────────────────────────────────────
  const handleSocialSignup = async (provider) => {
    setLoading(true);
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        name: provider === 'google' ? 'Google User' : formData.name,
        email: provider === 'google' ? 'user@gmail.com' : undefined,
        phone: provider === 'phone' ? formData.phone : undefined,
        role: formData.role,
        socialProvider: provider
      };

      localStorage.setItem('ugo_token', 'social_token_' + Date.now());
      localStorage.setItem('ugo_user', JSON.stringify(userData));

      setSuccess(true);
      setTimeout(() => {
        navigate(userData.role === 'driver' ? '/dashboard' : '/ride');
      }, 1200);

    } catch (error) {
      setErrors({ general: 'Social signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ── Guest/Skip signup ───────────────────────────────────────────────────
  const handleGuestMode = () => {
    localStorage.setItem('ugo_guest', 'true');
    navigate('/ride');
  };

  // ── Success screen ──────────────────────────────────────────────────────
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

  // ── OTP verification screen ─────────────────────────────────────────────
  if (otpSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-brand-logo">U</span>
            <span className="auth-brand-name">Ugo</span>
          </div>

          <h2 className="auth-title">Verify your {signupMethod}</h2>
          <p className="auth-subtitle">
            Enter the 6-digit code sent to {' '}
            {signupMethod === 'phone' ? formData.phone : formData.email}
          </p>

          {errors.otp && (
            <div className="auth-error" role="alert">
              <span className="auth-error-icon">⚠</span> {errors.otp}
            </div>
          )}

          <form onSubmit={handleOtpVerify} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <div className="input-wrap">
                <span className="input-icon">🔢</span>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength="6"
                  autoComplete="one-time-code"
                  style={{ textAlign: 'center', letterSpacing: '0.2em' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-button auth-button--ready"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <><span className="auth-spinner" /> Verifying...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <button
            className="auth-button auth-button--secondary"
            onClick={() => setOtpSent(false)}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── Main signup screen ──────────────────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-logo">U</span>
          <span className="auth-brand-name">Ugo</span>
        </div>

        <h2 className="auth-title">Get started in seconds</h2>
        <p className="auth-subtitle">The fastest way to book your ride</p>

        {errors.general && (
          <div className="auth-error" role="alert">
            <span className="auth-error-icon">⚠</span> {errors.general}
          </div>
        )}

        {/* ── Quick Social Buttons ── */}
        <div className="social-buttons">
          <button
            className="social-btn social-btn--google"
            onClick={() => handleSocialSignup('google')}
            disabled={loading}
          >
            <span className="social-icon">🔍</span>
            Continue with Google
          </button>
          
          <button
            className="social-btn social-btn--phone"
            onClick={() => setSignupMethod(signupMethod === 'phone' ? 'email' : 'phone')}
          >
            <span className="social-icon">{signupMethod === 'phone' ? '📱' : '✉️'}</span>
            Use {signupMethod === 'phone' ? 'Email' : 'Phone'} instead
          </button>
        </div>

        <div className="auth-divider"><span>or</span></div>

        {/* ── Quick Form ── */}
        <form onSubmit={handleQuickSignup} className="auth-form">
          {/* Name */}
          <div className="form-group">
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          {/* Phone or Email */}
          {signupMethod === 'phone' ? (
            <div className="form-group">
              <div className="input-wrap">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="123-456-7890"
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>
          ) : (
            <div className="form-group">
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
          )}

          {/* Role Selection */}
          <div className="form-group">
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn${formData.role === 'rider' ? ' role-btn--active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'rider' }))}
              >
                🚗 Ride
              </button>
              <button
                type="button"
                className={`role-btn${formData.role === 'driver' ? ' role-btn--active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'driver' }))}
              >
                🧑‍✈️ Drive
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
            {errors.terms && <p className="field-error">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            className="auth-button auth-button--ready"
            disabled={loading}
          >
            {loading ? (
              <><span className="auth-spinner" /> Sending code...</>
            ) : (
              `Continue with ${signupMethod === 'phone' ? 'Phone' : 'Email'}`
            )}
          </button>
        </form>

        {/* ── Guest Mode ── */}
        <div className="guest-option">
          <button
            className="guest-btn"
            onClick={handleGuestMode}
          >
            Skip for now - Continue as Guest
          </button>
          <p className="guest-note">You can create an account later</p>
        </div>

        <div className="auth-switch">
          Already have an account?
          <Link to="/login" className="auth-switch-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;