import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

// ── Validators ──────────────────────────────────────────────────────────────
const validators = {
  name: (v) => {
    if (!v.trim())            return 'Full name is required.';
    if (v.trim().length < 2)  return 'Name must be at least 2 characters.';
    if (v.trim().length > 50) return 'Name must be 50 characters or fewer.';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      ? '' : 'Enter a valid email address.';
  },
  password: (v) => {
    if (!v)           return 'Password is required.';
    if (v.length < 6) return 'Password must be at least 6 characters.';
    if (v.length > 100) return 'Password is too long.';
    return '';
  },
  confirmPassword: (v, pwd) => {
    if (!v)        return 'Please confirm your password.';
    if (v !== pwd) return 'Passwords do not match.';
    return '';
  },
};

// ── Password strength ───────────────────────────────────────────────────────
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)                    score++;
  if (/[A-Z]/.test(pwd))                  score++;
  if (/[0-9]/.test(pwd))                  score++;
  if (/[^A-Za-z0-9]/.test(pwd))          score++;
  if (pwd.length >= 12)                   score++;
  if (score <= 1) return { score, label: 'Weak',   color: '#ef4444' };
  if (score <= 2) return { score, label: 'Fair',   color: '#f59e0b' };
  if (score <= 3) return { score, label: 'Good',   color: '#3b82f6' };
  return             { score, label: 'Strong', color: '#10b981' };
};

const FIELDS = ['name', 'email', 'password', 'confirmPassword'];

const Signup = () => {
  const navigate = useNavigate();

  const [formData,  setFormData]  = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'rider' });
  const [fieldErrs, setFieldErrs] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [touched,   setTouched]   = useState({ name: false, email: false, password: false, confirmPassword: false });
  const [showPwd,   setShowPwd]   = useState(false);
  const [showCPwd,  setShowCPwd]  = useState(false);
  const [apiError,  setApiError]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [shake,     setShake]     = useState(false);
  const [success,   setSuccess]   = useState(false);

  const strength = getStrength(formData.password);

  // ── Validation ───────────────────────────────────────────────────────
  const validate = (name, value) => {
    if (name === 'confirmPassword') return validators.confirmPassword(value, formData.password);
    return validators[name] ? validators[name](value) : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (touched[name]) {
      setFieldErrs(fe => ({ ...fe, [name]: validate(name, value) }));
    }
    // Re-validate confirm when password changes
    if (name === 'password' && touched.confirmPassword) {
      setFieldErrs(fe => ({
        ...fe,
        confirmPassword: validators.confirmPassword(formData.confirmPassword, value),
      }));
    }
    setApiError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setFieldErrs(fe => ({ ...fe, [name]: validate(name, value) }));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate all fields
    const errs = {};
    FIELDS.forEach(f => {
      errs[f] = f === 'confirmPassword'
        ? validators.confirmPassword(formData.confirmPassword, formData.password)
        : validators[f](formData[f]);
    });
    setFieldErrs(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.values(errs).some(Boolean)) {
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res  = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     formData.name.trim(),
          email:    formData.email.trim(),
          password: formData.password,
          role:     formData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed.');

      localStorage.setItem('ugo_token', data.token);
      localStorage.setItem('ugo_user',  JSON.stringify(data));

      setSuccess(true);
      setTimeout(() => {
        if (data.role === 'driver') navigate('/dashboard');
        else navigate('/ride');
      }, 1400);
    } catch (err) {
      setApiError(err.message);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const fieldState = (name) => {
    if (!touched[name]) return '';
    return fieldErrs[name] ? ' form-group--error' : ' form-group--valid';
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card auth-card--success">
          <div className="auth-success-icon">✓</div>
          <h2 className="auth-title">Account created!</h2>
          <p className="auth-subtitle">Redirecting you now…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className={`auth-card${shake ? ' auth-card--shake' : ''}`}>

        <div className="auth-brand">
          <span className="auth-brand-logo">U</span>
          <span className="auth-brand-name">Ugo</span>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join thousands of riders and drivers on Ugo</p>

        {apiError && (
          <div className="auth-error" role="alert">
            <span className="auth-error-icon">⚠</span> {apiError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Full name */}
          <div className={`form-group${fieldState('name')}`}>
            <label htmlFor="name">Full name</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Anvesha Dwivedi"
                autoComplete="name"
              />
              {touched.name && !fieldErrs.name && (
                <span className="input-valid-icon">✓</span>
              )}
            </div>
            {fieldErrs.name && touched.name && (
              <p className="field-error" role="alert">{fieldErrs.name}</p>
            )}
          </div>

          {/* Email */}
          <div className={`form-group${fieldState('email')}`}>
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
              />
              {touched.email && !fieldErrs.email && (
                <span className="input-valid-icon">✓</span>
              )}
            </div>
            {fieldErrs.email && touched.email && (
              <p className="field-error" role="alert">{fieldErrs.email}</p>
            )}
          </div>

          {/* Password */}
          <div className={`form-group${fieldState('password')}`}>
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPwd ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
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
              <p className="field-error" role="alert">{fieldErrs.password}</p>
            )}

            {/* Strength meter */}
            {formData.password && (
              <div className="strength-wrap">
                <div className="strength-bars">
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className="strength-bar"
                      style={{
                        background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.12)',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Password rules hint */}
            {touched.password && formData.password && (
              <ul className="pwd-rules">
                <li className={formData.password.length >= 6 ? 'rule--pass' : 'rule--fail'}>
                  At least 6 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'rule--pass' : 'rule--fail'}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? 'rule--pass' : 'rule--fail'}>
                  One number
                </li>
              </ul>
            )}
          </div>

          {/* Confirm password */}
          <div className={`form-group${fieldState('confirmPassword')}`}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="input-wrap">
              <span className="input-icon">🔑</span>
              <input
                type={showCPwd ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowCPwd(s => !s)}
                aria-label={showCPwd ? 'Hide password' : 'Show password'}
              >
                {showCPwd ? '🙈' : '👁'}
              </button>
            </div>
            {fieldErrs.confirmPassword && touched.confirmPassword && (
              <p className="field-error" role="alert">{fieldErrs.confirmPassword}</p>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">I want to</label>
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn${formData.role === 'rider' ? ' role-btn--active' : ''}`}
                onClick={() => setFormData(f => ({ ...f, role: 'rider' }))}
              >
                🚗 Ride
              </button>
              <button
                type="button"
                className={`role-btn${formData.role === 'driver' ? ' role-btn--active' : ''}`}
                onClick={() => setFormData(f => ({ ...f, role: 'driver' }))}
              >
                🧑‍✈️ Drive
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button auth-button--ready"
            disabled={loading}
          >
            {loading
              ? <><span className="auth-spinner" /> Creating account…</>
              : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <div className="auth-switch">
          Already have an account?
          <Link to="/login" className="auth-switch-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
