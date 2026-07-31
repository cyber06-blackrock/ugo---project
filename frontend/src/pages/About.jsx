import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-city-tag">🌸 Jaipur, Rajasthan</div>
          <h1 className="about-hero-title">Moving the Pink City forward</h1>
          <p className="about-hero-subtitle">
            Ugo is Jaipur's own ride platform — built for the streets of the Old City, the highways to Amer, and everywhere in between.
          </p>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="about-vision">
        <h2>We started in Jaipur. We're staying in Jaipur.</h2>
        <p>
          Every great city deserves a ride platform that truly knows it. Ugo was built by people who live in Jaipur,
          for the 40 lakh residents who navigate its markets, monuments, and mohallas every single day.
          From the walled lanes of the Old City to the new tech corridors of Malviya Nagar — we make every
          journey feel local.
        </p>
      </section>

      {/* ── Values ── */}
      <section className="about-values">
        <div className="about-values-container">
          <h2 className="about-values-header">What drives us</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🏯</div>
              <h3>Rooted in Jaipur</h3>
              <p>We know the difference between Amer Road and Ajmer Road. Our drivers are locals who know every shortcut, festival detour, and traffic hotspot.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Fair to everyone</h3>
              <p>Transparent fares starting at ₹12/km. No surge pricing on festival days. No hidden charges. What you see is what you pay.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Safety first</h3>
              <p>Every driver is verified, every ride is tracked. Share your trip live with family — because in Jaipur, we look out for each other.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Fast & reliable</h3>
              <p>Average pickup under 4 minutes anywhere in the city. From C-Scheme to Vaishali Nagar — a driver is always nearby.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Greener Jaipur</h3>
              <p>We're actively adding CNG autos and EVs to cut emissions in the Pink City. Cleaner rides, cleaner air, cleaner heritage.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💼</div>
              <h3>Driver livelihoods</h3>
              <p>500+ Jaipur drivers earn their living with Ugo. Flexible hours, fair pay, and a community that has their back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Jaipur stats ── */}
      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Active drivers in Jaipur</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50k+</span>
            <span className="stat-label">Rides completed in the Pink City</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">&lt;4 min</span>
            <span className="stat-label">Average pickup time</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.8 ★</span>
            <span className="stat-label">Average driver rating</span>
          </div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="about-sustainability">
        <div className="sustainability-image" />
        <div className="sustainability-content">
          <div className="about-city-tag" style={{ marginBottom: '1rem' }}>📍 City coverage</div>
          <h2>All of Jaipur, covered</h2>
          <p>
            From the airport in Sanganer to the forts of Amer — from Vaishali Nagar in the west
            to Raja Park in the east. Ugo covers every pin code in Jaipur, including Sanganer, Bagru,
            Vidhyadhar Nagar, and Malviya Nagar.
          </p>
          <div className="about-coverage-chips">
            <span>🏯 Old City</span>
            <span>✈️ Sanganer Airport</span>
            <span>🏰 Amer</span>
            <span>🛍️ MI Road</span>
            <span>🎓 MNIT / University</span>
            <span>🏥 SMS Hospital</span>
            <span>🏬 World Trade Park</span>
            <span>🌸 Jawahar Circle</span>
          </div>
          <Link to="/ride" className="sustainability-button">Book a ride now</Link>
        </div>
      </section>
    </div>
  );
};

export default About;
