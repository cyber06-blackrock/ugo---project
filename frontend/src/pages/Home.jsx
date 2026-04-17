import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Car, Package, Navigation, ArrowRight, Briefcase, Home as HomeIcon, Map, Shield, CreditCard, Calendar, QrCode } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  // Default to San Francisco
  const position = [37.7749, -122.4194];

  const handleRequestRide = (e) => {
    e.preventDefault();
    if (pickup && dropoff) {
      navigate('/request-ride', { state: { pickup, dropoff } });
    }
  };

  return (
    <div className="home-container animate-in">
      {/* Hero section with Form and Map */}
      <div className="home-content">
        <div className="home-sidebar">
           {/* Navigation Tabs */}
           <div className="tabs">
              <button className={activeTab === 'ride' ? 'tab active' : 'tab'} onClick={() => setActiveTab('ride')}>
                 <Car size={32} className="tab-icon" />
                 Ride
              </button>
              <button className={activeTab === 'package' ? 'tab active' : 'tab'} onClick={() => setActiveTab('package')}>
                 <Package size={32} className="tab-icon" />
                 Package
              </button>
           </div>
           
           <div className="glass-card booking-card">
              <h2 className="hero-heading">Go anywhere with <br />Ugo</h2>
             
             <form onSubmit={handleRequestRide}>
                <div className="input-group">
                   <div className="input-icon-container line-down">
                     <div className="dot"></div>
                   </div>
                   <input 
                      type="text" 
                      placeholder="Pickup location" 
                      value={pickup} 
                      onChange={e => setPickup(e.target.value)} 
                      required                    />
                    <button type="button" className="locate-btn" title="Use current location">
                       <Navigation size={18} />
                    </button>
                </div>
                
                <div className="input-group">
                   <div className="input-icon-container">
                     <div className="square"></div>
                   </div>
                   <input 
                      type="text" 
                      placeholder="Dropoff destination" 
                      value={dropoff} 
                      onChange={e => setDropoff(e.target.value)} 
                      required 
                   />
                </div>
                
                <button type="submit" className="btn-secondary w-100" style={{ marginTop: '1rem' }}>
                   See prices
                </button>
             </form>

             <div className="quick-actions">
               <div className="action-btn">
                 <div className="action-icon-wrapper"><HomeIcon size={20} /></div>
                 <span>Home</span>
               </div>
               <div className="action-btn">
                 <div className="action-icon-wrapper"><Briefcase size={20} /></div>
                 <span>Work</span>
               </div>
             </div>
           </div>
        </div>

        <div className="home-map">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </MapContainer>
        </div>
      </div>

      {/* Info Sections Below Hero */}
      <div className="info-section">
        {/* Suggestions Grid */}
        <h2 className="section-title">Suggestions</h2>
        <div className="cards-grid" style={{ marginBottom: '4rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
           <div className="info-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/request-ride')}>
              <div className="card-icon-wrapper" style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
                 <Car size={32} color="var(--text-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>Ride</h3>
              <p style={{ fontSize: '0.9rem' }}>Go anywhere with Ugo</p>
           </div>
           
           <div className="info-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/reserve')}>
              <div className="card-icon-wrapper" style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
                 <Calendar size={32} color="var(--text-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>Reserve</h3>
              <p style={{ fontSize: '0.9rem' }}>Reserve a ride in advance</p>
           </div>
           
           <div className="info-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/package')}>
              <div className="card-icon-wrapper" style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
                 <Package size={32} color="var(--text-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>Package</h3>
              <p style={{ fontSize: '0.9rem' }}>Ugo Connect delivery</p>
           </div>
        </div>

        {/* Marketing Promo 1: Drive */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>Drive when you want, make what you need</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Make money on your schedule with deliveries or rides—or both. You can use your own car or choose a rental through Ugo.</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
               <button className="btn-secondary" onClick={() => navigate('/driver-onboarding')}>Get started</button>
               <button style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontSize: '1.1rem', textDecoration: 'underline', cursor: 'pointer' }}>Already have an account? Sign in</button>
            </div>
          </div>
          <div style={{ height: '400px', background: 'url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800) center/cover', borderRadius: '16px' }}></div>
        </div>

        {/* Marketing Promo 2: Business */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 1fr)', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div style={{ height: '400px', background: 'url(https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800) center/cover', borderRadius: '16px' }}></div>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>The Ugo you know, reimagined for business</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>A platform for managing global rides and meals, and local deliveries, for companies of any size.</p>
            <button className="btn-secondary">Check out our solutions</button>
          </div>
        </div>

        {/* Marketing Promo 3: Rent your car */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>Make money by renting out your car</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Connect with thousands of drivers and earn more per week with Ugo’s free fleet management tools.</p>
            <button className="btn-secondary">Get started</button>
          </div>
          <div style={{ height: '400px', background: 'url(https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800) center/cover', borderRadius: '16px' }}></div>
        </div>

        {/* Marketing Promo 4: Plan for later */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 1fr)', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div style={{ height: '400px', background: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800) center/cover', borderRadius: '16px' }}></div>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>Plan for a later ride</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Going to the airport? Want to secure a ride in advance? Reserve your ride up to 90 days ahead with Ugo Reserve.</p>
            <button className="btn-secondary">Reserve a ride</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
