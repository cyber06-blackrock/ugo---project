import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sustainability.css';

const Sustainability = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sustainability-page">
      {/* Hero Section */}
      <section className="sustain-hero">
        <div className="sustain-hero-content">
          <h1 className="sustain-hero-title">Driving a green recovery</h1>
          <p className="sustain-hero-subtitle">
            We are committing to becoming a fully zero-emission platform by 2040. Join us on our journey to eliminate emissions on every ride globally.
          </p>
        </div>
      </section>

      {/* Goals Timeline Grid */}
      <section className="sustain-goals-timeline">
        <h2 className="sustain-section-title">Our Roadmap to Zero Emissions</h2>
        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-year">2025</div>
            <h3>Hundreds of thousands of EVs</h3>
            <p>Commitment to allocate ₹6600 Crore+ in resources to help hundreds of thousands of drivers transition to electric vehicles in the US, Canada, Europe, and India.</p>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-year">2030</div>
            <h3>100% emission-free locally</h3>
            <p>Ugo will operate as a zero-emission mobility platform in the US, Canada, and European cities. Every ride will take place in an EV, micro-mobility, or public transit.</p>
          </div>

          <div className="timeline-item">
            <div className="timeline-year">2040</div>
            <h3>100% net-zero globally</h3>
            <p>We aim to have 100% of trips take place in zero-emission vehicles across our global platform, effectively neutralizing our environmental impact worldwide.</p>
          </div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="sustain-pillars">
        <div className="pillar-row">
          <div className="pillar-img-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop" 
              alt="Electric Vehicle charging" 
            />
          </div>
          <div className="pillar-content">
            <h3>Electrifying the fleet</h3>
            <p>
              The transition to electric vehicles isn't just a goal; it's an operational imperative. 
              We are partnering with leading auto manufacturers, charging networks, and policy makers to 
              make EV ownership more accessible and affordable for drivers on our platform. 
              With exclusive discounts and integration of charging maps directly into the app, we are 
              removing the friction from going green.
            </p>
          </div>
        </div>

        <div className="pillar-row reverse">
          <div className="pillar-img-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1520615967008-0112708fb5cb?q=80&w=2070&auto=format&fit=crop" 
              alt="Electric scooters in city" 
            />
          </div>
          <div className="pillar-content">
            <h3>Expanding micro-mobility</h3>
            <p>
              Not every trip requires a car. By deeply integrating e-bikes and electric scooters into 
              our ecosystem, we're providing incredibly efficient, zero-emission alternatives for that 
              crucial "last mile" of urban travel. This reduces city congestion, cuts down short-trip 
              emissions, and fundamentally changes how people interact with their urban environments.
            </p>
          </div>
        </div>

        <div className="pillar-row">
          <div className="pillar-img-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop" 
              alt="Modern public transit train" 
            />
          </div>
          <div className="pillar-content">
            <h3>Integrating with public transit</h3>
            <p>
              Public transit forms the backbone of any sustainable city. Instead of competing, we are 
              working to seamlessly integrate our routing algorithms with local train and bus schedules. 
              By providing first-mile and last-mile connections to transit hubs, we can dramatically 
              reduce the number of single-occupancy vehicles on the road.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sustain-cta">
        <h2>Ready to make a difference?</h2>
        <p>Whether you're a rider choosing Ugo Green or a driver looking to switch to an EV, every choice matters.</p>
        <Link to="/signup" className="sustain-btn">Join our platform</Link>
      </section>
    </div>
  );
};

export default Sustainability;
