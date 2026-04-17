import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Business.css';

const Business = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="business-page">
      {/* Hero Section */}
      <section className="business-hero">
        <div className="business-hero-content">
          <h1 className="business-hero-title">Move your business forward.</h1>
          <p className="business-hero-subtitle">
            The global mobility platform for your company. Control costs, keep employees happy, and run everything from one dashboard.
          </p>
          <div className="business-cta-group">
            <Link to="/signup" className="business-btn-primary">Get started</Link>
            <Link to="/login" className="business-btn-secondary">Log in</Link>
          </div>
        </div>
        <div className="business-hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop" 
            alt="Premium corporate architecture" 
            className="business-hero-image" 
          />
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="business-solutions">
        <div className="business-section-header">
          <h2>Solutions for every team</h2>
          <p>Whether you're managing daily commutes or coordinating global travel, we have the tools you need.</p>
        </div>
        
        <div className="solutions-grid">
          <div className="solution-card">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop" alt="Business Travel" className="solution-image" />
            <div className="solution-content">
              <h3>Business Travel</h3>
              <p>Simplify expense reporting and give your team reliable rides anywhere their work takes them globally.</p>
              <Link to="#" className="solution-link">Learn more</Link>
            </div>
          </div>

          <div className="solution-card">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop" alt="Commute" className="solution-image" />
            <div className="solution-content">
              <h3>Employee Commutes</h3>
              <p>Offer a competitive perk. Subsidize daily commutes to get your people to the office safely and efficiently.</p>
              <Link to="#" className="solution-link">Learn more</Link>
            </div>
          </div>

          <div className="solution-card">
            <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000&auto=format&fit=crop" alt="Courtesy Rides" className="solution-image" />
            <div className="solution-content">
              <h3>Courtesy Rides</h3>
              <p>Delight your guests, clients, or patients by covering the cost of their ride to and from your locations.</p>
              <Link to="#" className="solution-link">Learn more</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="business-value-prop">
        <div className="value-prop-container">
          <div className="value-prop-content">
            <h2>Why companies choose Ugo for Business</h2>
            <p>We combine the magic of the Ugo experience with robust enterprise controls, giving your company peace of mind and your employees a benefit they'll actually use.</p>
            
            <div className="value-features">
              <div className="value-feature">
                <div className="value-icon">📊</div>
                <div className="value-text">
                  <h4>Total control and visibility</h4>
                  <p>Set spending limits, track usage in real-time, and automate expense reporting perfectly.</p>
                </div>
              </div>
              <div className="value-feature">
                <div className="value-icon">🛡️</div>
                <div className="value-text">
                  <h4>Prioritized safety and support</h4>
                  <p>Enjoy premium support, safety standards built-in, and duty of care tracking for travelers.</p>
                </div>
              </div>
              <div className="value-feature">
                <div className="value-icon">🌍</div>
                <div className="value-text">
                  <h4>Global scale</h4>
                  <p>Tap into a platform that operates in 10,000+ cities seamlessly, all under one corporate account.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="business-hero-image-wrapper" style={{ margin: 0, height: '500px' }}>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" 
              alt="Dashboard analytics" 
              className="business-hero-image" 
            />
          </div>
        </div>
      </section>

      {/* Final CTA Extended */}
      <section className="business-final-cta-extended">
        <div className="extended-cta-content">
          <h2>Get started with a free business account</h2>
          <p>
            No platform fees. No minimum commitments. Set up your company profile in minutes and start offering reliable global mobility to your entire team today.
          </p>
          <ul className="extended-cta-perks">
            <li><span>✓</span> Access to central dashboard</li>
            <li><span>✓</span> Automated expense reporting</li>
            <li><span>✓</span> Flexible ride policies</li>
            <li><span>✓</span> Standard customer support</li>
          </ul>
          <div className="extended-cta-actions">
            <Link to="/signup" className="business-btn-primary">Create free account</Link>
            <Link to="/contact-sales" className="business-btn-secondary" style={{ background: '#ffffff' }}>Contact sales</Link>
          </div>
        </div>
        <div className="extended-cta-image">
          <img src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=2070&auto=format&fit=crop" alt="Business administration" />
        </div>
      </section>
    </div>
  );
};

export default Business;
