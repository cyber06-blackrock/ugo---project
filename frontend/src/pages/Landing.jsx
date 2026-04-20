import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Navigation, Smartphone, CreditCard, ShieldCheck } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/ride', { state: { pickup, dropoff } });
  };

  return (
    <div className="landing-page animate-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="booking-widget">
            <h1>Go anywhere with Ugo</h1>
            <p>Request a ride, hop in, and go.</p>
            <form onSubmit={handleSearch}>
              <div className="input-wrap">
                <span className="dot" />
                <input 
                  type="text" 
                  placeholder="Enter pickup location" 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)} 
                  required
                />
                <button type="button" className="locate-btn"><Navigation size={16} /></button>
              </div>
              <div className="input-wrap">
                <span className="square" />
                <input 
                  type="text" 
                  placeholder="Enter destination" 
                  value={dropoff} 
                  onChange={(e) => setDropoff(e.target.value)} 
                  required
                />
              </div>
              <button type="submit" className="btn-primary full-width">See prices</button>
            </form>
          </div>
        </div>
        <div className="hero-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200')" }}></div>
      </section>

      {/* Ways to Ride Section */}
      <section className="ways-to-ride">
        <div className="container">
          <h2>Ways to ride</h2>
          <div className="grid-3">
            <div className="card">
              <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400" alt="UgoX" />
              <h3>UgoX</h3>
              <p>Affordable, everyday rides for up to 4 people.</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400" alt="Comfort" />
              <h3>Comfort</h3>
              <p>Newer cars with extra legroom for a more comfortable ride.</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400" alt="XL" />
              <h3>XL</h3>
              <p>Comfortable rides for groups up to 6 people.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to use the app */}
      <section className="how-to-use">
        <div className="container">
          <h2>How to use the Ugo app</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon"><Smartphone size={32} /></div>
              <div className="step-text">
                <h3>1. Open the app</h3>
                <p>Open the app and enter your destination in the "Where to?" box.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon"><Car size={32} /></div>
              <div className="step-text">
                <h3>2. Request a ride</h3>
                <p>Choose the ride option that best suits your needs and confirm your pickup.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon"><CreditCard size={32} /></div>
              <div className="step-text">
                <h3>3. Hop in and go</h3>
                <p>Meet your driver and enjoy the ride. Payment is seamless and cash-free.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon"><ShieldCheck size={32} /></div>
              <div className="step-text">
                <h3>4. Arrive safely</h3>
                <p>Rate your driver and help keep the Ugo community safe and reliable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Info */}
      <section className="more-info">
        <div className="container split">
          <div className="text-content">
            <h2>Your safety matters</h2>
            <p>Peace of mind is designed into your experience. Safety features are built into the app to protect you during every ride.</p>
            <button className="btn-secondary" onClick={() => navigate('/about')}>Learn more about safety</button>
          </div>
          <div className="image-content" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=600')" }}></div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
