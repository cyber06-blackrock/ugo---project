import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Package.css';

const Package = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="package-page">

      {/* ── Hero ── */}
      <section className="package-hero">
        <div className="package-hero-content">
          <div className="pkg-city-tag">🌸 Jaipur Delivery</div>
          <h1 className="package-hero-title">Send anything across Jaipur, instantly</h1>
          <p className="package-hero-subtitle">
            Documents from Johari Bazaar to MI Road. Gifts from C-Scheme to Amer. Supplies from Mansarovar
            to Malviya Nagar. Ugo Connect delivers across the Pink City in under 60 minutes.
          </p>
          <div className="package-cta-group">
            <Link to="/request-ride" className="package-btn-primary">Send a package</Link>
          </div>
          <div className="pkg-trust-strip">
            <span>⚡ Same-day delivery</span>
            <span>📍 Anywhere in Jaipur</span>
            <span>🔒 Safe & tracked</span>
          </div>
        </div>
        <div className="package-hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2070&auto=format&fit=crop"
            alt="Delivery in Jaipur"
            className="package-hero-image"
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="package-steps">
        <h2 className="package-section-title">How Ugo Connect works in Jaipur</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Pack your item</h3>
            <p>Seal your item securely. Keep it under 15 kg and within car-boot size. Fragile? We handle it with care.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Book delivery</h3>
            <p>Open Ugo, select Package, and enter any Jaipur address. A driver near you in the Pink City accepts in seconds.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Live tracking</h3>
            <p>Share a live map link with the recipient — they can watch the delivery approach their Jaipur address in real time.</p>
          </div>
        </div>
      </section>

      {/* ── What you can send ── */}
      <section className="package-rules">
        <div className="rules-content">
          <h2>What Jaipur riders send</h2>
          <ul className="rules-list">
            <li><span className="rules-icon">📦</span> Jewellery & handicrafts from Johari Bazaar</li>
            <li><span className="rules-icon">📄</span> Business documents across offices in Jaipur</li>
            <li><span className="rules-icon">🎁</span> Festival gifts during Diwali, Teej & Gangaur</li>
            <li><span className="rules-icon">🔑</span> Forgotten keys — from home to office</li>
            <li><span className="rules-icon">🛍️</span> Shopping pickups from Bapu Bazaar & Nehru Bazaar</li>
            <li><span className="rules-icon">📱</span> Electronics from IT hubs in Malviya Nagar</li>
          </ul>
          <p style={{ color: '#aaa', fontSize: '0.88rem', marginTop: '1rem' }}>
            * Items must be valued under ₹10,000. Prohibited: alcohol, medication, illegal items, and cash.
          </p>
        </div>
        <div className="rules-image" />
      </section>

      {/* ── Popular Jaipur delivery routes ── */}
      <section className="pkg-routes">
        <div className="pkg-routes-inner">
          <h2>Popular delivery routes in Jaipur</h2>
          <div className="pkg-routes-grid">
            {[
              { from: 'Johari Bazaar', to: 'MI Road',          time: '~10 min' },
              { from: 'Mansarovar',    to: 'Malviya Nagar',    time: '~18 min' },
              { from: 'C-Scheme',      to: 'Amer',             time: '~22 min' },
              { from: 'Vaishali Nagar',to: 'Sindhi Camp',      time: '~20 min' },
              { from: 'Sitapura EPIP', to: 'World Trade Park', time: '~15 min' },
              { from: 'Jaipur Airport',to: 'City Palace',      time: '~28 min' },
            ].map((r, i) => (
              <div key={i} className="pkg-route-card">
                <span className="pkg-route-from">📍 {r.from}</span>
                <span className="pkg-route-arrow">→</span>
                <span className="pkg-route-to">🏁 {r.to}</span>
                <span className="pkg-route-time">⏱ {r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="package-final">
        <div className="pkg-city-tag" style={{ marginBottom: '1rem' }}>🌸 Jaipur-only service</div>
        <h2>Ready to send across Jaipur?</h2>
        <p>Same-day. Tracked. Affordable. The Pink City's most trusted delivery network.</p>
        <Link to="/request-ride" className="package-btn-primary">Send a package now</Link>
      </section>
    </div>
  );
};

export default Package;// ── Jaipur ride options with local images/context ──────────────────────────
export const rideOptions = [
  {
    id: 'ride',
    title: 'UgoX',
    emoji: '🚗',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600',
    desc: 'Comfortable sedans for everyday rides across Jaipur — Amer Fort to Airport.',
    from: '₹30/km',
  },
  {
    id: 'auto',
    title: 'UgoAuto',
    emoji: '🛺',
    image: 'https://images.unsplash.com/photo-1583743089695-4b816a340f82?auto=format&fit=crop&q=80&w=600',
    desc: 'Beat the Pink City traffic with quick, affordable auto-rickshaw rides.',
    from: '₹16/km',
  },
  {
    id: 'bike',
    title: 'UgoMoto',
    emoji: '🏍️',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&q=80&w=600',
    desc: 'Zip through Johari Bazaar and Old City lanes on a motorbike.',
    from: '₹12/km',
  },
  {
    id: 'xl',
    title: 'UgoXL',
    emoji: '🚙',
    image: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?auto=format&fit=crop&q=80&w=600',
    desc: 'Spacious SUVs for family trips to Amer Fort or group outings.',
    from: '₹48/km',
  },
  {
    id: 'black',
    title: 'UgoBlack',
    emoji: '🖤',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    desc: 'Luxury sedans for premium travel — perfect for business or special occasions.',
    from: '₹72/km',
  },
  {
    id: 'reserve',
    title: 'Reserve',
    emoji: '📅',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600',
    desc: 'Book your ride to Jaipur Airport or railway station up to 90 days in advance.',
    from: 'Schedule ahead',
  },
];

