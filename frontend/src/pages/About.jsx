import React, { useEffect } from 'react';
import './About.css';
import { Link } from 'react-router-dom';

const About = () => {
  // Simple scroll effect to reset on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About us</h1>
          <p className="about-hero-subtitle">
            We reimagine the way the world moves for the better.
          </p>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="about-vision">
        <h2>We ignite opportunity by setting the world in motion.</h2>
        <p>
          Good things happen when people can move, whether across town or toward their dreams. 
          Opportunities appear, open up, become reality. What started as a way to tap a button to get a ride 
          has led to billions of moments of human connection as people around the world go all kinds of places 
          in all kinds of ways with the help of our technology.
        </p>
      </section>

      {/* Values Grid */}
      <section className="about-values">
        <div className="about-values-container">
          <h2 className="about-values-header">Our core values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Build with heart</h3>
              <p>We care deeply about our work and the people who depend on it. That's why we obsess over the details and build with care.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Do the right thing</h3>
              <p>Period. We hold ourselves to the highest standard, even when no one is looking. Integrity is everything.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Stand for safety</h3>
              <p>Physical and digital safety are at the core of everything we do. It's a non-negotiable reality of moving people.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>See the forest & the trees</h3>
              <p>We think big but never lose sight of the small things that matter. We understand the interconnectedness of our platform.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Great minds don't think alike</h3>
              <p>We embrace diversity and celebrate the unique perspectives that make us better. We champion inclusive innovation.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">📈</div>
              <h3>Make big bold bets</h3>
              <p>We take risks and swing for the fences. Innovation requires pushing boundaries and embracing the unknown.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Stats */}
      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Cities world wide</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">30B+</span>
            <span className="stat-label">Trips completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">130M+</span>
            <span className="stat-label">Monthly active platform consumers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">6M+</span>
            <span className="stat-label">Active drivers and couriers</span>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="about-sustainability">
        <div className="sustainability-image"></div>
        <div className="sustainability-content">
          <h2>Sustainability</h2>
          <p>
            We're building a sustainable platform for the future. Our goal is to become a fully zero-emission 
            platform by 2040, with 100% of rides taking place in zero-emission vehicles, on public transit, or with micro-mobility.
          </p>
          <Link to="/sustainability" className="sustainability-button">Learn about our goals</Link>
        </div>
      </section>
    </div>
  );
};

export default About;
