import React, { useState, useEffect } from 'react';
import './LocationGate.css';

const LocationGate = ({ onLocationGranted, onLocationDenied }) => {
  const [status, setStatus] = useState('prompt'); // 'prompt' | 'requesting' | 'denied'
  const [animateOut, setAnimateOut] = useState(false);

  // Check if user has already granted permission previously
  useEffect(() => {
    const cached = sessionStorage.getItem('ugo_location_granted');
    if (cached === 'true') {
      // Already granted this session, skip the gate
      const loc = JSON.parse(sessionStorage.getItem('ugo_location') || '{}');
      onLocationGranted(loc.lat || 26.9124, loc.lng || 75.7873);
    } else if (cached === 'false') {
      // User already denied, skip gate
      onLocationDenied();
    } else {
      // First time - auto-grant with defaults for dev
      sessionStorage.setItem('ugo_location_granted', 'true');
      sessionStorage.setItem('ugo_location', JSON.stringify({ lat: 26.9124, lng: 75.7873 }));
      onLocationGranted(26.9124, 75.7873);
    }
  }, [onLocationGranted, onLocationDenied]);

  const handleAllowLocation = () => {
    setStatus('requesting');

    if (!('geolocation' in navigator)) {
      handleDeny();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Cache for session so we don't re-ask
        sessionStorage.setItem('ugo_location_granted', 'true');
        sessionStorage.setItem('ugo_location', JSON.stringify({ lat, lng }));

        // Animate out then notify parent
        setAnimateOut(true);
        setTimeout(() => onLocationGranted(lat, lng), 600);
      },
      () => {
        // User denied browser prompt
        handleDeny();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleDeny = () => {
    setStatus('denied');
  };

  const handleContinueWithout = () => {
    sessionStorage.setItem('ugo_location_granted', 'false');
    setAnimateOut(true);
    setTimeout(() => onLocationDenied(), 600);
  };

  // Already granted in this session — render nothing
  const cached = sessionStorage.getItem('ugo_location_granted');
  if (cached === 'true') return null;

  return (
    <div className={`location-gate ${animateOut ? 'location-gate--exit' : ''}`}>
      {/* Animated background with floating cars */}
      <div className="lg-bg">
        <div className="lg-car lg-car--1">🚗</div>
        <div className="lg-car lg-car--2">🚕</div>
        <div className="lg-car lg-car--3">🛺</div>
        <div className="lg-car lg-car--4">🏍️</div>
        <div className="lg-car lg-car--5">🚙</div>
      </div>

      <div className="lg-content">
        {/* Brand */}
        <div className="lg-brand">Ugo</div>

        {/* Location pin animation */}
        <div className="lg-pin-container">
          <div className="lg-pin-pulse" />
          <div className="lg-pin">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#000"/>
              <circle cx="12" cy="9" r="2.5" fill="#fff"/>
            </svg>
          </div>
        </div>

        {status === 'prompt' && (
          <div className="lg-prompt animate-in">
            <h1 className="lg-title">Where are you headed?</h1>
            <p className="lg-subtitle">
              Allow Ugo to access your location to find nearby drivers and get accurate ride estimates.
            </p>

            <button className="lg-btn lg-btn--primary" onClick={handleAllowLocation}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Enable Location
            </button>

            <button className="lg-btn lg-btn--ghost" onClick={handleDeny}>
              Maybe later
            </button>

            <div className="lg-trust">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              Your location data is only used to find drivers near you
            </div>
          </div>
        )}

        {status === 'requesting' && (
          <div className="lg-prompt animate-in">
            <h1 className="lg-title">Getting your location…</h1>
            <p className="lg-subtitle">Please allow access in your browser's popup.</p>
            <div className="lg-spinner" />
          </div>
        )}

        {status === 'denied' && (
          <div className="lg-prompt animate-in">
            <h1 className="lg-title">Location access denied</h1>
            <p className="lg-subtitle">
              You can still use Ugo, but we'll show drivers in the default area. You can update your location later.
            </p>

            <button className="lg-btn lg-btn--primary" onClick={handleAllowLocation}>
              Try Again
            </button>

            <button className="lg-btn lg-btn--secondary" onClick={handleContinueWithout}>
              Continue without location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationGate;
