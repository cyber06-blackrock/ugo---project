import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, ShieldCheck, Star, Clock, MapPin } from 'lucide-react';
import { getNearbyPlaces, JAIPUR_CENTER } from '../utils/jaipur';
import './Landing.css';

// ── Ride options data ─────────────────────────────────────────────────────
const rideOptions = [
  {
    id: 'car',
    title: 'UgoX',
    emoji: '🚗',
    from: '₹30/km',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f3b76fc5d?auto=format&fit=crop&q=80&w=600',
    desc: 'Comfortable sedans for everyday rides across Jaipur — Amer Fort to Airport.',
  },
  {
    id: 'auto',
    title: 'UgoAuto',
    emoji: '🏎️',
    from: '₹16/km',
    image: 'https://images.unsplash.com/photo-1609695001873-3297510ef4c3?auto=format&fit=crop&q=80&w=600',
    desc: 'Beat the Pink City traffic with quick, affordable auto-rickshaw rides.',
  },
  {
    id: 'bike',
    title: 'UgoMoto',
    emoji: '🏍️',
    from: '₹12/km',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600',
    desc: 'Zip through Johari Bazaar and Old City lanes on a motorbike.',
  },
  {
    id: 'xl',
    title: 'UgoXL',
    emoji: '🚙',
    from: '₹48/km',
    image: 'https://images.unsplash.com/photo-1555636222-cff2045dd1f7?auto=format&fit=crop&q=80&w=600',
    desc: 'Spacious SUVs for family trips to Amer Fort or group outings.',
  },
];

// ── Jaipur landmark highlights ─────────────────────────────────────────────
const CITY_HIGHLIGHTS = [
  { name: 'Hawa Mahal',   icon: '🏯', area: 'Old City'   },
  { name: 'Amer Fort',    icon: '🏰', area: 'Amer'       },
  { name: 'City Palace',  icon: '🏛️', area: 'Old City'   },
  { name: 'Patrika Gate', icon: '🌸', area: 'Jawahar Circle' },
  { name: 'Jal Mahal',    icon: '🏯', area: 'Man Sagar'  },
  { name: 'Nahargarh',    icon: '🏰', area: 'Hills'      },
];

const Landing = () => {
  const navigate = useNavigate();
  const [userLat, setUserLat] = useState(JAIPUR_CENTER.lat);
  const [userLng, setUserLng] = useState(JAIPUR_CENTER.lng);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupSugg, setPickupSugg] = useState([]);
  const [dropoffSugg, setDropoffSugg] = useState([]);
  const [pickupFocus, setPickupFocus] = useState(false);
  const [dropoffFocus, setDropoffFocus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const pickupTimeout = useRef(null);
  const dropoffTimeout = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
        },
        () => console.log('Location access denied; using Jaipur center')
      );
    }
  }, []);

  const fetchSuggestions = async (query, type) => {
    if (!query || query.length < 2) {
      const nearby = getNearbyPlaces(query, userLat, userLng, 6);
      const names = nearby.map(p => `${p.name}, Jaipur`);
      if (type === 'pickup') setPickupSugg(names);
      else setDropoffSugg(names);
      return;
    }

    const local = getNearbyPlaces(query, userLat, userLng, 5);
    const localNames = local.map(p => `${p.name}, Jaipur`);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Jaipur, Rajasthan')}&limit=4&viewbox=75.65,27.10,76.00,26.75&bounded=1`
      );
      const data = await res.json();
      const remote = data.map(item => item.display_name).filter(
        n => !localNames.some(ln => n.toLowerCase().includes(ln.split(',')[0].toLowerCase()))
      );
      const merged = [...localNames, ...remote].slice(0, 7);
      if (type === 'pickup') setPickupSugg(merged);
      else setDropoffSugg(merged);
    } catch {
      if (type === 'pickup') setPickupSugg(localNames);
      else setDropoffSugg(localNames);
    }
  };

  const onPickupChange = (e) => {
    const val = e.target.value;
    setPickup(val);
    if (pickupTimeout.current) clearTimeout(pickupTimeout.current);
    pickupTimeout.current = setTimeout(() => fetchSuggestions(val, 'pickup'), 500);
  };

  const onDropoffChange = (e) => {
    const val = e.target.value;
    setDropoff(val);
    if (dropoffTimeout.current) clearTimeout(dropoffTimeout.current);
    dropoffTimeout.current = setTimeout(() => fetchSuggestions(val, 'dropoff'), 500);
  };

  const handleRequestRide = (e) => {
    e.preventDefault();
    if (pickup && dropoff) {
      navigate('/request-ride', { state: { pickup, dropoff } });
    }
  };

  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
    if (opt.id === 'reserve') {
      navigate('/reserve');
    } else {
      navigate('/request-ride', { state: { vehicleType: opt.id } });
    }
  };

  return (
    <div className="landing-page">
      {/* ── Hero Section with Split Layout ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div>
            <div className="city-badge">📍 Jaipur, Rajasthan</div>
            <h1>Your ride in the<br/>Pink City 🌸</h1>
            <p>From Hawa Mahal to the Airport — Ugo gets you there.</p>

            <div className="booking-widget">
              <form onSubmit={handleRequestRide}>
                <div className="lnd-input-block">
                  <div className="lnd-input-wrap">
                    <span className="dot"></span>
                    <input
                      type="text"
                      placeholder="Pickup — e.g. Hawa Mahal"
                      value={pickup}
                      onChange={onPickupChange}
                      onFocus={() => setPickupFocus(true)}
                      onBlur={() => setTimeout(() => setPickupFocus(false), 200)}
                    />
                    <button type="button" className="locate-btn" title="Use current location">
                      <Navigation size={16} />
                    </button>
                  </div>
                  {pickupFocus && pickupSugg.length > 0 && (
                    <ul className="lnd-sugg-list">
                      {pickupSugg.map((sugg, i) => (
                        <li
                          key={i}
                          onClick={() => { setPickup(sugg); setPickupFocus(false); }}
                        >
                          <span className="lnd-sugg-icon">📍</span>
                          <span className="lnd-sugg-name">{sugg}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="lnd-input-block">
                  <div className="lnd-input-wrap">
                    <span className="square"></span>
                    <input
                      type="text"
                      placeholder="Destination — e.g. Amer Fort"
                      value={dropoff}
                      onChange={onDropoffChange}
                      onFocus={() => setDropoffFocus(true)}
                      onBlur={() => setTimeout(() => setDropoffFocus(false), 200)}
                    />
                  </div>
                  {dropoffFocus && dropoffSugg.length > 0 && (
                    <ul className="lnd-sugg-list">
                      {dropoffSugg.map((sugg, i) => (
                        <li
                          key={i}
                          onClick={() => { setDropoff(sugg); setDropoffFocus(false); }}
                        >
                          <span className="lnd-sugg-icon">🏁</span>
                          <span className="lnd-sugg-name">{sugg}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button type="submit" className="full-width">See prices</button>
              </form>
            </div>

            <div className="lnd-chips">
              <div className="lnd-chip" onClick={() => setDropoff('Jaipur Airport, Jaipur')}>✈️ Airport</div>
              <div className="lnd-chip" onClick={() => setDropoff('Jaipur Railway Station, Jaipur')}>🚂 Railway Station</div>
              <div className="lnd-chip" onClick={() => setDropoff('Hawa Mahal, Jaipur')}>🏯 Hawa Mahal</div>
              <div className="lnd-chip" onClick={() => setDropoff('Amer Fort, Jaipur')}>🏰 Amer Fort</div>
            </div>
          </div>
        </div>

        <div
          className="hero-image"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1577891038432-f37ea6f6d399?auto=format&fit=crop&q=80&w=900')"
          }}
        >
          <div className="hero-image-overlay">
            <div className="hero-highlights">
              <div className="hero-highlight-chip">🏰 Amer Fort</div>
              <div className="hero-highlight-chip">🏯 Hawa Mahal</div>
              <div className="hero-highlight-chip">🌸 Pink City</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stat-item"><strong>50K+</strong> riders</div>
        <div className="stat-divider"></div>
        <div className="stat-item"><strong>24/7</strong> support</div>
        <div className="stat-divider"></div>
        <div className="stat-item"><strong>4.8★</strong> rated</div>
      </div>

      {/* ── Ways to ride ── */}
      <section className="ways-to-ride">
        <div className="container">
          <h2>Ways to ride across Jaipur</h2>
          <p className="section-sub">Choose what suits your journey — from Amer Fort to the Airport.</p>
          <div className="grid-3">
            {rideOptions.map((opt) => (
              <div className="card" key={opt.id} onClick={() => setSelectedOption(opt)}>
                <div className="card-img-wrap">
                  <img 
                    src={opt.image} 
                    alt={opt.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544589552-1c4d649e0c30?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                  <div className="card-emoji">{opt.emoji}</div>
                </div>
                <div className="card-content">
                  <div className="card-title-row">
                    <h3>{opt.title}</h3>
                    <span className="card-from">{opt.from}</span>
                  </div>
                  <p>{opt.desc}</p>
                  <button type="button" className="view-details-btn">Book now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular routes ── */}
      <section className="popular-routes">
        <div className="container">
          <h2>Popular routes in Jaipur</h2>
          <p className="section-sub">Most booked trips by Jaipur riders</p>
          <div className="routes-grid">
            {[
              { from: 'Jaipur Railway Station', to: 'Amer Fort',         km: '14 km', time: '28 min' },
              { from: 'Hawa Mahal',             to: 'Jaipur Airport',   km: '12 km', time: '24 min' },
              { from: 'Mansarovar',             to: 'City Palace',       km: '8 km',  time: '18 min' },
              { from: 'Malviya Nagar',          to: 'Sindhi Camp',       km: '6 km',  time: '14 min' },
              { from: 'C-Scheme',               to: 'World Trade Park',  km: '4 km',  time: '10 min' },
              { from: 'Vaishali Nagar',         to: 'MI Road',           km: '9 km',  time: '20 min' },
            ].map((r, i) => (
              <div
                key={i}
                className="route-card"
                onClick={() => navigate('/ride', { state: { pickup: r.from, dropoff: r.to } })}
              >
                <div className="route-endpoints">
                  <span className="route-from">📍 {r.from}</span>
                  <span className="route-arrow">→</span>
                  <span className="route-to">🏁 {r.to}</span>
                </div>
                <div className="route-meta">
                  <span>{r.km}</span>
                  <span>·</span>
                  <span>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-to-use">
        <div className="container">
          <h2>How Ugo works in Jaipur</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon">📍</div>
              <div className="step-text">
                <h3>Enter your destination</h3>
                <p>Open the app and enter where you want to go.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">🚗</div>
              <div className="step-text">
                <h3>Meet your driver</h3>
                <p>You'll see your driver's picture and vehicle details, and can track their arrival.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">🏁</div>
              <div className="step-text">
                <h3>Check the route</h3>
                <p>Always check that your trip route matches where you want to go.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">⭐</div>
              <div className="step-text">
                <h3>Enjoy the ride</h3>
                <p>Sit back and relax. Your driver knows the best routes in Jaipur.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── City promo ── */}
      <section className="more-info">
        <div className="container">
          <div className="split">
            <div className="text-content">
              <div className="promo-tag">🌸 Jaipur's Pink City</div>
              <h2>Your reliable ride, anytime</h2>
              <p>
                Whether you're exploring the historic forts, shopping in Johari Bazaar, or heading to the airport, 
                Ugo connects you with reliable rides across the Pink City. Safe, quick, and affordable.
              </p>
              <div className="promo-chips">
                <span><ShieldCheck size={14} /> Safe & Verified</span>
                <span><Star size={14} /> Highly Rated</span>
                <span><Clock size={14} /> Quick Pickup</span>
              </div>
              <button className="btn-secondary" onClick={() => navigate('/signup')}>
                Get started
              </button>
            </div>
            <div
              className="image-content"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=900')"
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Drive CTA ── */}
      <section className="drive-cta">
        <div className="container">
          <h2>Make money driving</h2>
          <p>
            Set your own hours. Earn on your own terms. 
            Sign up to drive with Ugo in Jaipur today.
          </p>
          <div className="drive-cta-actions">
            <button className="btn-primary" onClick={() => navigate('/driver-signup')}>
              Start earning
            </button>
            <button className="btn-ghost" onClick={() => navigate('/learn-more')}>
              Learn more
            </button>
          </div>
        </div>
      </section>

      {/* ── Option detail modal ── */}
      {selectedOption && (
        <div className="modal-overlay" onClick={() => setSelectedOption(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <img src={selectedOption.image} alt={selectedOption.title} className="modal-img" />
              <button className="close-btn" onClick={() => setSelectedOption(null)}>
                ✕
              </button>
              <div className="modal-header-text">
                <span className="modal-emoji">{selectedOption.emoji}</span>
                <h3>{selectedOption.title}</h3>
              </div>
            </div>
            <form className="modal-form" onSubmit={() => handleOptionClick(selectedOption)}>
              <div className="input-group">
                <label>Ride type</label>
                <input type="text" value={selectedOption.title} disabled />
              </div>
              <div className="input-group">
                <label>Description</label>
                <input type="text" value={selectedOption.desc} disabled />
              </div>
              <div className="input-group">
                <label>Starting price: {selectedOption.from}</label>
              </div>
              <button type="submit" className="full-width modal-submit">
                {selectedOption.id === 'reserve' ? 'Schedule ride' : 'Request now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;