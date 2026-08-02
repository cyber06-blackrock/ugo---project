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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="carGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" /><stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#carGrad1)"/><g transform="translate(50,30)"><rect x="10" y="15" width="80" height="25" rx="5" fill="#fff" opacity="0.9"/><circle cx="30" cy="50" r="8" fill="#1e293b"/><circle cx="70" cy="50" r="8" fill="#1e293b"/><rect x="15" y="20" width="25" height="15" fill="#3b82f6" opacity="0.7"/><rect x="45" y="20" width="25" height="15" fill="#3b82f6" opacity="0.7"/></g></svg>`,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    desc: 'Comfortable sedans for everyday rides across Jaipur — Amer Fort to Airport.',
  },
  {
    id: 'auto',
    title: 'UgoAuto',
    emoji: '🛺',
    from: '₹16/km',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="autoGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" /><stop offset="100%" style="stop-color:#d97706;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#autoGrad1)"/><g transform="translate(50,25)"><path d="M20,30 L30,20 L70,20 L80,30 L80,45 L20,45 Z" fill="#fbbf24" stroke="#fff" stroke-width="2"/><circle cx="35" cy="50" r="6" fill="#1e293b" stroke="#fff" stroke-width="1.5"/><circle cx="65" cy="50" r="6" fill="#1e293b" stroke="#fff" stroke-width="1.5"/><rect x="35" y="25" width="30" height="15" fill="#fff" opacity="0.3"/><text x="50" y="17" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">AUTO</text></g></svg>`,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    desc: 'Beat the Pink City traffic with quick, affordable auto-rickshaw rides.',
  },
  {
    id: 'bike',
    title: 'UgoMoto',
    emoji: '🏍️',
    from: '₹12/km',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="bikeGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#10b981;stop-opacity:1" /><stop offset="100%" style="stop-color:#059669;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#bikeGrad1)"/><g transform="translate(50,30)"><circle cx="25" cy="45" r="10" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="75" cy="45" r="10" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M25,45 L50,25 L60,25 L75,45" stroke="#fff" stroke-width="2.5" fill="none"/><path d="M50,25 L55,35" stroke="#fff" stroke-width="2.5"/><circle cx="50" cy="20" r="4" fill="#fff"/></g></svg>`,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    desc: 'Zip through Johari Bazaar and Old City lanes on a motorbike.',
  },
  {
    id: 'xl',
    title: 'UgoXL',
    emoji: '🚙',
    from: '₹48/km',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="suvGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" /><stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#suvGrad1)"/><g transform="translate(40,25)"><rect x="10" y="15" width="100" height="30" rx="5" fill="#fff" opacity="0.95"/><rect x="5" y="25" width="110" height="15" rx="3" fill="#a78bfa" opacity="0.8"/><circle cx="30" cy="50" r="9" fill="#1e293b"/><circle cx="90" cy="50" r="9" fill="#1e293b"/><rect x="20" y="20" width="30" height="18" fill="#8b5cf6" opacity="0.6"/><rect x="55" y="20" width="35" height="18" fill="#8b5cf6" opacity="0.6"/><text x="60" y="15" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">XL</text></g></svg>`,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
            backgroundImage: "url('/images/amer-fort.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '3rem'
          }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '3px 3px 10px rgba(0,0,0,0.8)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>Discover Jaipur</h1>
            <p style={{
              fontSize: '1.8rem',
              color: '#fff',
              textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
              textAlign: 'center'
            }}>The Pink City Awaits - Ride with elephants to the majestic fort</p>
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
                <div className="card-img-wrap" dangerouslySetInnerHTML={{ __html: opt.svg }} />

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
                backgroundImage: "url('/images/jaipurview.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
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
              <div className="modal-img-placeholder" dangerouslySetInnerHTML={{ __html: selectedOption.svg }} />
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