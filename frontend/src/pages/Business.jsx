import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Business.css';

const Business = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="business-page">

      {/* ── Hero ── */}
      <section className="business-hero">
        <div className="business-hero-content">
          <div className="biz-city-tag">🌸 Jaipur Business</div>
          <h1 className="business-hero-title">Move your Jaipur business forward.</h1>
          <p className="business-hero-subtitle">
            The ride platform built for Jaipur companies. Manage employee commutes, client pickups,
            and airport transfers — all from one dashboard, at Jaipur-local rates.
          </p>
          <div className="business-cta-group">
            <Link to="/signup" className="business-btn-primary">Get started free</Link>
            <Link to="/login" className="business-btn-secondary">Log in</Link>
          </div>
        </div>
        <div className="business-hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
            alt="Jaipur business district"
            className="business-hero-image"
          />
          <div className="biz-hero-overlay">
            <span>🏢 World Trade Park</span>
            <span>✈️ Jaipur Airport</span>
            <span>🏨 Hotel corridors</span>
          </div>
        </div>
      </section>

      {/* ── Solutions ── */}
      <section className="business-solutions">
        <div className="business-section-header">
          <h2>Solutions for Jaipur businesses</h2>
          <p>Whether you run a hotel on MI Road or a tech firm in Malviya Nagar — Ugo Business fits your needs.</p>
        </div>
        <div className="solutions-grid">
          <div className="solution-card">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
              alt="Airport transfers"
              className="solution-image"
            />
            <div className="solution-content">
              <h3>✈️ Airport Transfers</h3>
              <p>Reliable rides to Jaipur International Airport (Sanganer) for your executives and visiting clients — on time, every time.</p>
              <Link to="/signup" className="solution-link">Get started</Link>
            </div>
          </div>
          <div className="solution-card">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop"
              alt="Employee commutes"
              className="solution-image"
            />
            <div className="solution-content">
              <h3>🏢 Employee Commutes</h3>
              <p>Subsidise daily rides for your team across Jaipur — from Vaishali Nagar, Mansarovar, C-Scheme and beyond to your office.</p>
              <Link to="/signup" className="solution-link">Get started</Link>
            </div>
          </div>
          <div className="solution-card">
            <img
              src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000&auto=format&fit=crop"
              alt="Client hospitality"
              className="solution-image"
            />
            <div className="solution-content">
              <h3>🤝 Client Hospitality</h3>
              <p>Impress visiting clients with complimentary rides between Jaipur's five-star hotels, conference venues, and heritage sites.</p>
              <Link to="/signup" className="solution-link">Get started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Ugo Business ── */}
      <section className="business-value-prop">
        <div className="value-prop-container">
          <div className="value-prop-content">
            <h2>Why Jaipur companies choose Ugo</h2>
            <p>Local rates, local drivers, and a platform that understands the pace of business in the Pink City.</p>
            <div className="value-features">
              <div className="value-feature">
                <div className="value-icon">📊</div>
                <div className="value-text">
                  <h4>Full visibility & control</h4>
                  <p>Set per-trip budgets, track every ride on a live map across Jaipur, and export expense reports in one click.</p>
                </div>
              </div>
              <div className="value-feature">
                <div className="value-icon">💰</div>
                <div className="value-text">
                  <h4>Jaipur-local pricing</h4>
                  <p>Fares start at ₹12/km. No corporate markups. Volume discounts available for 10+ rides/day.</p>
                </div>
              </div>
              <div className="value-feature">
                <div className="value-icon">🛡️</div>
                <div className="value-text">
                  <h4>Verified Jaipur drivers</h4>
                  <p>All drivers are background-checked Jaipur locals with city knowledge, rated 4.8★ on average.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="business-hero-image-wrapper" style={{ margin: 0, height: '480px' }}>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
              alt="Business dashboard"
              className="business-hero-image"
            />
          </div>
        </div>
      </section>

      {/* ── Jaipur use cases strip ── */}
      <section className="biz-usecases">
        <div className="biz-usecases-inner">
          <h2>Popular use cases in Jaipur</h2>
          <div className="biz-cases-grid">
            {[
              { icon: '🏨', title: 'Hotels & Hospitality', desc: 'Guest pickups between Rambagh Palace, ITC, and Marriott to Jaipur Airport.' },
              { icon: '🏥', title: 'Hospitals', desc: 'Staff and patient transfers to SMS Hospital, Fortis, and Narayana in Sanganer.' },
              { icon: '🎓', title: 'Colleges & Universities', desc: 'Student and faculty transport for MNIT, University of Rajasthan, and Poornima.' },
              { icon: '🏭', title: 'Factories & Industry', desc: 'Shift transport for Sitapura, Mansarovar Industrial Area, and Bagru factories.' },
            ].map((c) => (
              <div key={c.title} className="biz-case-card">
                <div className="biz-case-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="business-final-cta-extended">
        <div className="extended-cta-content">
          <div className="biz-city-tag" style={{ marginBottom: '1rem' }}>🌸 Free for Jaipur businesses</div>
          <h2>Set up your Jaipur business account today</h2>
          <p>No platform fees. No minimum trips. Start in 5 minutes and give your team reliable rides across Jaipur.</p>
          <ul className="extended-cta-perks">
            <li><span>✓</span> Centralised billing dashboard</li>
            <li><span>✓</span> Automated expense reports</li>
            <li><span>✓</span> Ride policies & spend limits</li>
            <li><span>✓</span> Dedicated Jaipur support</li>
          </ul>
          <div className="extended-cta-actions">
            <Link to="/signup" className="business-btn-primary">Create free account</Link>
            <Link to="/contact-sales" className="business-btn-secondary" style={{ background: '#fff' }}>Talk to sales</Link>
          </div>
        </div>
        <div className="extended-cta-image">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop"
            alt="Jaipur city"
          />
        </div>
      </section>
    </div>
  );
};

export default Business;
