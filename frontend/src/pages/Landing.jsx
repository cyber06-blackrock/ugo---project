import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, ShieldCheck, Star, Clock, MapPin } from 'lucide-react';
import { getNearbyPlaces, QUICK_SPOTS, JAIPUR_CENTER } from '../utils/jaipur';
import './Landing.css';

// ── Jaipur ride options with local images/context ──────────────────────────
const rideOptions = [
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
    image: 'https://images.unsplash.com/photo-1606802057180-00c5c8da6662?auto=format&fit=crop&q=80&w=600',
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
  const navigate  = useNavigate();

  // User GPS coords (Jaipur centre fallback)
  const [userLat, setUserLat] = useState(JAIPUR_CENTER.lat);
  const [userLng, setUserLng] = useState(JAIPUR_CENTER.lng);

  const [pickup,       setPickup]       = useState('');
  const [dropoff,      setDropoff]      = useState('');
  const [pickupSugg,   setPickupSugg]   = useState([]);
  const [dropoffSugg,  setDropoffSugg]  = useState([]);
  const [pickupFocus,  setPickupFocus]  = useState(false);
  const [dropoffFocus, setDropoffFocus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const pickupRef  = useRef(null);
  const dropoffRef = useRef(null);

  // ── Grab user GPS on mount ──────────────────────────────────────────
  useEffect(() => {
    const cached = sessionStorage.getItem('ugo_location');
    if (cached) {
      try {
        const { lat, lng } = JSON.parse(cached);
        if (lat && lng) { setUserLat(lat); setUserLng(lng); }
      } catch { /* ignore */ }
    }
  }, []);

  // ── Nearby suggestion search ────────────────────────────────────────
  const getSuggestions = (query) =>
    getNearbyPlaces(query, userLat, userLng, 7);

  const handlePickupChange = (e) => {
    const val = e.target.value;
    setPickup(val);
    setPickupSugg(getSuggestions(val));
  };

  const handleDropoffChange = (e) => {
    const val = e.target.value;
    setDropoff(val);
    setDropoffSugg(getSuggestions(val));
  };

  const handlePickupFocus = () => {
    setPickupFocus(true);
    setPickupSugg(getSuggestions(pickup));
  };

  const handleDropoffFocus = () => {
    setDropoffFocus(true);
    setDropoffSugg(getSuggestions(dropoff));
  };

  const selectPickup = (name) => {
    setPickup(name);
    setPickupFocus(false);
    setPickupSugg([]);
    dropoffRef.current?.focus();
  };

  const selectDropoff = (name) => {
    setDropoff(name);
    setDropoffFocus(false);
    setDropoffSugg([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (pickup && dropoff) navigate('/ride', { state: { pickup, dropoff } });
  };

  // ── Close dropdowns on outside click ───────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!pickupRef.current?.contains(e.target))   setPickupFocus(false);
      if (!dropoffRef.current?.contains(e.target))  setDropoffFocus(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="landing-page animate-in">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="booking-widget">

            {/* Jaipur city badge */}
            <div className="city-badge">
              <MapPin size={14} /> Jaipur, Rajasthan
            </div>

            <h1>Your ride in the<br />Pink City 🌸</h1>
            <p>From Hawa Mahal to the Airport — Ugo gets you there.</p>

            <form onSubmit={handleSearch} autoComplete="off">

              {/* Pickup */}
              <div className="lnd-input-block" ref={pickupRef}>
                <div className="lnd-input-wrap">
                  <span className="dot" />
                  <input
                    type="text"
                    placeholder="Pickup — e.g. Hawa Mahal"
                    value={pickup}
                    onChange={handlePickupChange}
                    onFocus={handlePickupFocus}
                    required
                  />
                  <button
                    type="button"
                    className="locate-btn"
                    title="Use current location"
                    onClick={() => setPickup('My Location')}
                  >
                    <Navigation size={15} />
                  </button>
                </div>
                {pickupFocus && pickupSugg.length > 0 && (
                  <ul className="lnd-sugg-list">
                    {pickupSugg.map((p) => (
                      <li key={p.name} onMouseDown={() => selectPickup(p.name)}>
                        <span className="lnd-sugg-icon">{p.icon}</span>
                        <span className="lnd-sugg-name">{p.name}</span>
                        <span className="lnd-sugg-area">{p.area}</span>
                        {p.dist != null && (
                          <span className="lnd-sugg-dist">{p.dist.toFixed(1)} km</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dropoff */}
              <div className="lnd-input-block" ref={dropoffRef}>
                <div className="lnd-input-wrap">
                  <span className="square" />
                  <input
                    ref={dropoffRef}
                    type="text"
                    placeholder="Destination — e.g. Amer Fort"
                    value={dropoff}
                    onChange={handleDropoffChange}
                    onFocus={handleDropoffFocus}
                    required
                  />
                </div>
                {dropoffFocus && dropoffSugg.length > 0 && (
                  <ul className="lnd-sugg-list">
                    {dropoffSugg.map((p) => (
                      <li key={p.name} onMouseDown={() => selectDropoff(p.name)}>
                        <span className="lnd-sugg-icon">{p.icon}</span>
                        <span className="lnd-sugg-name">{p.name}</span>
                        <span className="lnd-sugg-area">{p.area}</span>
                        {p.dist != null && (
                          <span className="lnd-sugg-dist">{p.dist.toFixed(1)} km</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Quick-spot chips */}
              <div className="lnd-chips">
                {QUICK_SPOTS.slice(0, 4).map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    className="lnd-chip"
                    onClick={() => setDropoff(s.name)}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>

              <button type="submit" className="btn-primary full-width">
                See prices
              </button>
            </form>
          </div>
        </div>

        {/* Hero image — Jaipur skyline */}
        <div
          className="hero-image"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1400')" }}
        >
          <div className="hero-image-overlay">
            <div className="hero-highlights">
              {CITY_HIGHLIGHTS.map((h) => (
                <div key={h.name} className="hero-highlight-chip">
                  {h.icon} {h.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="stats-bar">
        <div className="stat-item"><Star size={16} fill="#f59e0b" color="#f59e0b" /> <strong>4.8</strong> avg rating</div>
        <div className="stat-divider" />
        <div className="stat-item"><Clock size={16} /> <strong>&lt;4 min</strong> avg pickup</div>
        <div className="stat-divider" />
        <div className="stat-item"><MapPin size={16} /> <strong>500+</strong> drivers in Jaipur</div>
        <div className="stat-divider" />
        <div className="stat-item">🌸 <strong>Pink City</strong> coverage</div>
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
                    onError={(e) => {
                      // Fallback image for auto-rickshaw if main image fails to load
                      if (opt.id === 'auto') {
                        e.target.src = 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&q=80&w=600';
                      }
                      // Fallback image for bike if main image fails to load
                      if (opt.id === 'bike') {
                        e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600';
                      }
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
                  <button className="view-details-btn">Book now</button>
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
                <h3>1. Enter your destination</h3>
                <p>Type any Jaipur landmark — Hawa Mahal, Amer Fort, MI Road — and get instant prices.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">🚗</div>
              <div className="step-text">
                <h3>2. Pick your ride</h3>
                <p>Choose from UgoX, Auto, Moto, or Black. Fares start at ₹12/km.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">📲</div>
              <div className="step-text">
                <h3>3. Track in real time</h3>
                <p>Watch your driver navigate Jaipur's streets live on the map.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon"><ShieldCheck size={28} /></div>
              <div className="step-text">
                <h3>4. Arrive safely</h3>
                <p>All drivers are verified, rated, and local to Jaipur. Rate your trip to keep standards high.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── City promo ── */}
      <section className="more-info">
        <div className="container split">
          <div className="text-content">
            <div className="promo-tag">🌸 Built for Jaipur</div>
            <h2>Explore the Pink City, your way</h2>
            <p>
              From the winding lanes of the Old City to the wide boulevards of Vaishali Nagar —
              Ugo covers all of Jaipur. Whether you're visiting Amer Fort at sunrise or catching
              a late flight from Sanganer Airport, we've got a ride waiting.
            </p>
            <div className="promo-chips">
              <span>🏯 Heritage tours</span>
              <span>✈️ Airport transfers</span>
              <span>🛍️ Market runs</span>
              <span>🎓 College routes</span>
            </div>
            <button className="btn-secondary" onClick={() => navigate('/ride')}>
              Book a ride now
            </button>
          </div>
          <div
            className="image-content"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800')" }}
          />
        </div>
      </section>

      {/* ── Drive CTA ── */}
      <section className="drive-cta">
        <div className="container">
          <h2>Drive in Jaipur with Ugo</h2>
          <p>Join 500+ Jaipur drivers already earning with Ugo. Set your own hours, drive your own car.</p>
          <div className="drive-cta-actions">
            <button className="btn-primary" onClick={() => navigate('/driver-onboarding')}>
              Become a driver
            </button>
            <button className="btn-ghost" onClick={() => navigate('/login', { state: { role: 'driver' } })}>
              Already a driver? Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── Ride booking modal ── */}
      {selectedOption && (
        <div className="modal-overlay" onClick={() => setSelectedOption(null)}>
          <div className="modal-content animate-in" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedOption(null)}>✕</button>
            <div className="modal-header">
              <img src={selectedOption.image} alt={selectedOption.title} className="modal-img" />
              <div className="modal-header-text">
                <span className="modal-emoji">{selectedOption.emoji}</span>
                <h3>{selectedOption.title}</h3>
                <span className="modal-from">{selectedOption.from}</span>
              </div>
            </div>
            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                navigate('/ride', { state: { pickup: fd.get('pickup'), dropoff: fd.get('dropoff') } });
              }}
            >
              <div className="input-group">
                <label>Pickup in Jaipur</label>
                <input name="pickup" type="text" placeholder="e.g. Hawa Mahal, C-Scheme" required />
              </div>
              <div className="input-group">
                <label>Destination in Jaipur</label>
                <input name="dropoff" type="text" placeholder="e.g. Amer Fort, Jaipur Airport" required />
              </div>
              <button type="submit" className="btn-primary full-width modal-submit">
                See prices →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
