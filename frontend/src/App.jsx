import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RideRequest from './pages/RideRequest';
import DriverOnboarding from './pages/DriverOnboarding';
import About from './pages/About';
import Sustainability from './pages/Sustainability';
import Business from './pages/Business';
import ContactSales from './pages/ContactSales';
import Package from './pages/Package';
import Reserve from './pages/Reserve';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import './index.css';

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const userStr = localStorage.getItem('ugo_user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('ugo_user');
    localStorage.removeItem('ugo_token');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {/* ── NAV ── */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" className="brand" style={{ color: 'var(--text-primary)', textDecoration: 'none' }} onClick={closeMenu}>Ugo</Link>
          {/* Desktop nav */}
          {location.pathname !== '/driver-onboarding' && (
            <nav className="desktop-nav">
              <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Ride</Link>
              <Link to="/driver-onboarding" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Drive</Link>
              <Link to="/business" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Business</Link>
              <Link to="/about" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>About Us</Link>
            </nav>
          )}
        </div>

        {/* Desktop auth */}
        <div className="desktop-auth">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Hi, {user.name.split(' ')[0]}</span>
              {user.role === 'driver' && (
                <Link to="/dashboard" style={{ background: 'var(--text-primary)', color: 'var(--primary-color)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, textDecoration: 'none' }}>Dashboard</Link>
              )}
              <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-primary)', fontWeight: 500, border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', padding: '0.5rem 1rem' }}>Log out</button>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ background: 'transparent', color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none', border: 'none', cursor: 'pointer', padding: '0.6rem 1.2rem' }}>Log in</Link>
              <Link to="/signup" style={{ background: 'var(--text-primary)', color: 'var(--primary-color)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Sign up</Link>
            </>
          )}
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}
      <nav className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`} aria-hidden={!menuOpen}>
        {location.pathname !== '/driver-onboarding' && (
          <>
            <Link to="/" onClick={closeMenu}>🚗 Ride</Link>
            <Link to="/driver-onboarding" onClick={closeMenu}>🚙 Drive</Link>
            <Link to="/business" onClick={closeMenu}>💼 Business</Link>
            <Link to="/about" onClick={closeMenu}>ℹ️ About Us</Link>
            <Link to="/sustainability" onClick={closeMenu}>🌿 Sustainability</Link>
            <Link to="/reserve" onClick={closeMenu}>📅 Reserve</Link>
            <Link to="/package" onClick={closeMenu}>📦 Package</Link>
            <hr className="mobile-nav-divider" />
          </>
        )}
        {user ? (
          <>
            <div style={{ padding: '1rem', fontWeight: 'bold' }}>Logged in as {user.name}</div>
            {user.role === 'driver' && (
              <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
            )}
            <button className="mobile-nav-login" onClick={() => { handleLogout(); closeMenu(); }} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-nav-login" onClick={closeMenu}>Log in</Link>
            <Link to="/signup" className="mobile-nav-signup" onClick={closeMenu}>Sign up</Link>
          </>
        )}
      </nav>

      <main style={{ flex: 1, minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request-ride" element={<RideRequest />} />
          <Route path="/driver-onboarding" element={<DriverOnboarding />} />
          <Route path="/business" element={<Business />} />
          <Route path="/contact-sales" element={<ContactSales />} />
          <Route path="/package" element={<Package />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/about" element={<About />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
