import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

// ── Inline validators ──────────────────────────────────────────────────────
const validateEmail  = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
  ? '' : 'Enter a valid email address.';

const validatePassword = (v) => v.length >= 6
  ? '' : 'Password must be at least 6 characters.';

const Login = () => {
  const navigate      = useNavigate();
  const location      = useLocation();
  const isDriverLogin = location.state?.role === 'driver';

  const [formData,  setFormData]  = useState({ email: '', password: '' });
  const [fieldErrs, setFieldErrs] = useState({ email: '', password: '' });
  const [touched,   setTouched]   = useState({ email: false, password: false });
  const [showPwd,   setShowPwd]   = useState(false);
  const [apiError,  setApiError]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [shake,     setShake]     = useState(false);

  // ── Restore remembered email ──────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('ugo_remember_email');
    if (saved) setFormData(f => ({ ...f, email: saved }));
  }, []);

  // ── Per-field live validation ─────────────────────────────────────────
  const validate = (name, value) => {
    if (name === 'email')    return validateEmail(value);
    if (name === 'password') return validatePassword(value);
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (touched[name]) {
      setFieldErrs(fe => ({ ...fe, [name]: validate(name, value) }));
    }
    setApiError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setFieldErrs(fe => ({ ...fe, [name]: validate(name, value) }));
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate all fields before submit
    const emailErr    = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);
    setFieldErrs({ email: emailErr, password: passwordErr });
    setTouched({ email: true, password: true });

    if (emailErr || passwordErr) {
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res  = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim(), password: formData.password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Invalid email or password.');

      localStorage.setItem('ugo_token', data.token);
      localStorage.setItem('ugo_user',  JSON.stringify(data));

      if (data.role === 'driver') navigate('/dashboard');
      else navigate('/ride');
    } catch (err) {
      setApiError(err.message);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const isFormValid = !validateEmail(formData.email) && !validatePassword(formData.password);

  return (
    <div className="auth-container">
      <div className={`auth-card${shake ? ' auth-card--shake' : ''}`}>

        {/* Logo / brand */}
        <div className="auth-brand">
          <span className="auth-brand-logo">U</span>
          <span className="auth-brand-name">Ugo</span>
        </div>

        <h2 className="auth-title">
          {isDriverLogin ? 'Driver Sign In' : 'Welcome back'}
        </h2>
        <p className="auth-subtitle">
          {isDriverLogin ? 'Sign in to your driver account' : 'Sign in to your account to continue'}
        </p>

        {/* API error banner */}
        {apiError && (
          <div className="auth-error" role="alert">
            <span className="auth-error-icon">⚠</span> {apiError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className={`form-group${fieldErrs.email && touched.email ? ' form-group--error' : touched.email && !fieldErrs.email ? ' form-group--valid' : ''}`}>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@example.com"
                autoComplete="email"
                aria-describedby={fieldErrs.email ? 'email-err' : undefined}
              />
              {touched.email && !fieldErrs.email && (
                <span className="input-valid-icon">✓</span>
              )}
            </div>
            {fieldErrs.email && touched.email && (
              <p className="field-error" id="email-err" role="alert">{fieldErrs.email}</p>
            )}
          </div>

          {/* Password */}
          <div className={`form-group${fieldErrs.password && touched.password ? ' form-group--error' : touched.password && !fieldErrs.password ? ' form-group--valid' : ''}`}>
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <button type="button" className="auth-forgot" tabIndex={-1}>
                Forgot password?
              </button>
            </div>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPwd ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-describedby={fieldErrs.password ? 'pwd-err' : undefined}
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd(s => !s)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
            {fieldErrs.password && touched.password && (
              <p className="field-error" id="pwd-err" role="alert">{fieldErrs.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`auth-button${isFormValid ? ' auth-button--ready' : ''}`}
            disabled={loading}
          >
            {loading
              ? <><span className="auth-spinner" /> Signing in…</>
              : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <div className="auth-switch">
          Don't have an account?
          <Link to="/signup" className="auth-switch-link">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
