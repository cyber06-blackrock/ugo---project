import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Package.css';

const Package = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="package-page">
      {/* Hero Section */}
      <section className="package-hero">
        <div className="package-hero-content">
          <h1 className="package-hero-title">Send packages with Ugo Connect</h1>
          <p className="package-hero-subtitle">
            Same-day, no-contact delivery exactly when you need it. Send items, gifts, or business supplies across town in just a few taps.
          </p>
          <div className="package-cta-group">
            <Link to="/request-ride" className="package-btn-primary">Send a package</Link>
          </div>
        </div>
        <div className="package-hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2070&auto=format&fit=crop" 
            alt="Delivery person with a package" 
            className="package-hero-image" 
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="package-steps">
        <h2 className="package-section-title">How Ugo Connect works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Prepare your package</h3>
            <p>Securely seal your item in a box or bag. Make sure it's under 30 pounds and fits comfortably in the trunk of a midsize car.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Request delivery</h3>
            <p>Open the app, select 'Package', and enter the dropoff location. A driver will arrive shortly to pick up your item.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Track in real-time</h3>
            <p>Share the trip with the recipient so they can track the delivery live on the map and prepare to receive it upon arrival.</p>
          </div>
        </div>
      </section>

      {/* Rules / What you can send */}
      <section className="package-rules">
        <div className="rules-content">
          <h2>What can you send?</h2>
          <ul className="rules-list">
            <li><span className="rules-icon">📦</span> Retail items and care packages</li>
            <li><span className="rules-icon">📄</span> Important business documents</li>
            <li><span className="rules-icon">🎁</span> Gifts for friends and family</li>
            <li><span className="rules-icon">🔑</span> Forgotten keys or personal items</li>
          </ul>
          <p style={{ color: '#aaaaaa', fontSize: '0.9rem', marginTop: '1rem' }}>
            *Items must be worth less than $100. Prohibited items include alcohol, medication, recreational drugs, and dangerous/illegal items.
          </p>
        </div>
        <div className="rules-image"></div>
      </section>

      {/* Final Banner */}
      <section className="package-final">
        <h2>Ready to send?</h2>
        <p>Experience the simplicity of on-demand local delivery.</p>
        <Link to="/request-ride" className="package-btn-primary">Get started now</Link>
      </section>
    </div>
  );
};

export default Package;
