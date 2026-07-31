import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, Package, Navigation, Briefcase, Home as HomeIcon, Calendar } from 'lucide-react';
import NearbyDrivers from '../components/NearbyDrivers';
import { generateNearbyDrivers } from '../utils/generateDrivers';
import { getNearbyPlaces, QUICK_SPOTS, JAIPUR_CENTER } from '../utils/jaipur';
import './Home.css';

// ── Fix Leaflet default icon paths broken by Vite ──────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Driver marker — red car circle ─────────────────────────────────────────
const makeDriverIcon = (isSelected) => L.divIcon({
  className: '',
  html: `<div class="lf-driver-pin${isSelected ? ' lf-driver-pin--selected' : ''}">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" fill="white">
      <path d="M32 18H16l-2 6v10h2v2h3v-2h10v2h3v-2h2V24l-2-6zm-14 4h12l1 3H17l1-3z"/>
    </svg>
  </div>`,
  iconSize:   [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22],
});

// ── User location — blue pulsing dot ───────────────────────────────────────
const userIcon = L.divIcon({
  className: '',
  html: `<div class="lf-user-pin">
           <div class="lf-user-pulse"></div>
           <div class="lf-user-dot"></div>
         </div>`,
  iconSize:   [24, 24],
  iconAnchor: [12, 12],
});

// ── Re-center map when position changes ────────────────────────────────────
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center]);
  return null;
}

// ── Main component ──────────────────────────────────────────────────────────
const Home = ({ userLocation }) => {
  const navigate      = useNavigate();
  const locationState = useLocation();

  const [activeTab,     setActiveTab]     = useState('ride');
  const [pickup,        setPickup]        = useState(locationState.state?.pickup  || '');
  const [dropoff,       setDropoff]       = useState(locationState.state?.dropoff || '');
  const [historyLocations, setHistoryLocations] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [position,      setPosition]      = useState({
    lat: userLocation?.lat || JAIPUR_CENTER.lat,
    lng: userLocation?.lng || JAIPUR_CENTER.lng,
  });
  const [user,          setUser]          = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [pickupSuggestions,  setPickupSuggestions]  = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const pickupTimeout  = useRef(null);
  const dropoffTimeout = useRef(null);

  // ── Nominatim autocomplete biased to user location ──────────────────────
  const fetchSuggestions = async (query, type) => {
    if (!query || query.length < 2) {
      // Show nearby Jaipur places when query is short / empty
      const nearby = getNearbyPlaces(query, position.lat, position.lng, 6);
      const names  = nearby.map(p => `${p.name}, Jaipur`);
      if (type === 'pickup') setPickupSuggestions(names);
      else setDropoffSuggestions(names);
      return;
    }
    // First: search local Jaipur DB
    const local = getNearbyPlaces(query, position.lat, position.lng, 5);
    const localNames = local.map(p => `${p.name}, Jaipur`);

    // Then: Nominatim for anything not in local DB, biased to Jaipur bbox
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Jaipur, Rajasthan')}&limit=4&viewbox=75.65,27.10,76.00,26.75&bounded=1`
      );
      const data = await res.json();
      const remote = data.map(item => item.display_name).filter(
        n => !localNames.some(ln => n.toLowerCase().includes(ln.split(',')[0].toLowerCase()))
      );
      const merged = [...localNames, ...remote].slice(0, 7);
      if (type === 'pickup') setPickupSuggestions(merged);
      else setDropoffSuggestions(merged);
    } catch {
      if (type === 'pickup') setPickupSuggestions(localNames);
      else setDropoffSuggestions(localNames);
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

  // ── Sync position when userLocation prop updates ──────────────────────
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      setPosition({ lat: userLocation.lat, lng: userLocation.lng });
      fetchDrivers(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  useEffect(() => {
    if (locationState.state?.pickup)  setPickup(locationState.state.pickup);
    if (locationState.state?.dropoff) setDropoff(locationState.state.dropoff);
  }, [locationState.state]);

  // ── Fetch nearby drivers (API → mock fallback) ────────────────────────
  const fetchDrivers = async (lat, lng) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let url = `${API_URL}/api/drivers/available`;
      if (lat && lng) url += `?lat=${lat}&lng=${lng}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const filtered = data.slice(0, 4);
        const etaMap = [1, 3, 2, 4];
        filtered.forEach((d, i) => { d.eta = etaMap[i] ?? d.eta; });
        if (filtered.length > 0) { setAvailableDrivers(filtered); return; }
      }
      throw new Error('No drivers');
    } catch {
      if (lat && lng) {
        const local = generateNearbyDrivers(lat, lng, 12).slice(0, 4);
        const etaMap = [1, 3, 2, 4];
        local.forEach((d, i) => { d.eta = etaMap[i] ?? d.eta; });
        setAvailableDrivers(local);
      }
    }
  };

  // ── Ride history + socket ─────────────────────────────────────────────
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userStr = localStorage.getItem('ugo_user');
        if (!userStr) return;
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        if (parsedUser._id) {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res  = await fetch(`${API_URL}/api/rides/history/${parsedUser._id}`);
          const data = await res.json();
          const locs = new Set();
          data.forEach((ride) => {
            if (ride.pickupLocation?.address)  locs.add(ride.pickupLocation.address);
            if (ride.dropoffLocation?.address) locs.add(ride.dropoffLocation.address);
          });
          setHistoryLocations(Array.from(locs));
        }
      } catch { /* silent */ }
    };

    fetchHistory();

    // Seed drivers immediately with Jaipur coords as fallback
    const lat = userLocation?.lat || 26.9124;
    const lng = userLocation?.lng || 75.7873;
    fetchDrivers(lat, lng);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket  = io(API_URL);

    socket.on('driverLocationUpdate', (data) => {
      setAvailableDrivers((prev) => {
        const idx = prev.findIndex((d) => d._id === data.driverId);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], location: { lat: data.lat, lng: data.lng } };
          return next;
        }
        return [...prev, { _id: data.driverId, name: data.name, location: { lat: data.lat, lng: data.lng } }];
      });
    });

    return () => socket.disconnect();
  }, []);

  const handleRequestRide = (e) => {
    e.preventDefault();
    if (pickup && dropoff) navigate('/request-ride', { state: { pickup, dropoff } });
  };

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    if (driver.location?.lat && driver.location?.lng) {
      setPosition({ lat: driver.location.lat, lng: driver.location.lng });
    }
  };

  const mapCenter = [position.lat, position.lng];

  return (
    <div className="home-container animate-in">

      {/* ── Hero: Map + Booking Sidebar ── */}
      <div className="home-content">

        {/* ── Leaflet Map ── */}
        <div className="home-map">
          <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter center={mapCenter} />

            {/* User location */}
            {userLocation?.lat && userLocation?.lng && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={userIcon}
              >
                <Popup>
                  <div className="lf-popup">
                    <strong>You are here</strong>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Driver markers */}
            {availableDrivers.slice(0, 4).map((driver) =>
              driver.location?.lat && driver.location?.lng ? (
                <Marker
                  key={driver._id}
                  position={[driver.location.lat, driver.location.lng]}
                  icon={makeDriverIcon(selectedDriver?._id === driver._id)}
                  eventHandlers={{
                    click: () => handleSelectDriver(driver),
                  }}
                >
                  <Popup>
                    <div className="lf-popup">
                      <strong>{driver.name}</strong>
                      <p>{driver.vehicleName || 'UgoX'} &nbsp;⭐ {driver.rating?.toFixed(1) || '4.5'}</p>
                      {driver.eta   && <p className="lf-popup-eta">🕐 {driver.eta} min away</p>}
                      {driver.licensePlate && (
                        <span className="lf-popup-plate">{driver.licensePlate}</span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>

        {/* ── Booking Sidebar ── */}
        <div className="home-sidebar">
          <div className="tabs">
            <button
              className={activeTab === 'ride' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('ride')}
            >
              <span className="tab-icon"><Car size={24} /></span>Ride
            </button>
            <button
              className={activeTab === 'package' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('package')}
            >
              <span className="tab-icon"><Package size={24} /></span>Package
            </button>
          </div>

          <div className="booking-card">
            <h2 className="hero-heading">Ride anywhere in<br />Jaipur 🌸</h2>

            <datalist id="pickup-locations">
              {historyLocations.map((loc, idx) => <option key={`hp-${idx}`} value={loc} />)}
              {pickupSuggestions.map((loc, idx) => <option key={`pp-${idx}`} value={loc} />)}
            </datalist>
            <datalist id="dropoff-locations">
              {historyLocations.map((loc, idx) => <option key={`hd-${idx}`} value={loc} />)}
              {dropoffSuggestions.map((loc, idx) => <option key={`pd-${idx}`} value={loc} />)}
            </datalist>

            <form onSubmit={handleRequestRide}>
              <div className="inputs-wrapper" style={{ position: 'relative' }}>
                <div className="vertical-connector" style={{
                  position: 'absolute', left: '1.15rem',
                  top: '2.5rem', bottom: '2.5rem',
                  width: '2px', backgroundColor: '#000', zIndex: 1,
                }} />
                <div className="input-group">
                  <span className="input-dot dot" />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={onPickupChange}
                    list="pickup-locations"
                    required
                  />
                  <button type="button" className="locate-btn" title="Use current location">
                    <Navigation size={16} />
                  </button>
                </div>
                <div className="input-group">
                  <span className="input-dot square" />
                  <input
                    type="text"
                    placeholder="Dropoff destination"
                    value={dropoff}
                    onChange={onDropoffChange}
                    list="dropoff-locations"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="see-prices-btn">See prices</button>
            </form>

            <div className="quick-actions">
              <div className="action-btn">
                <div className="action-icon-wrapper"><HomeIcon size={18} /></div>
                <span>Home</span>
              </div>
              <div className="action-btn">
                <div className="action-icon-wrapper"><Briefcase size={18} /></div>
                <span>Work</span>
              </div>
            </div>
          </div>

          <NearbyDrivers
            drivers={availableDrivers}
            userLocation={userLocation}
            onSelectDriver={handleSelectDriver}
          />
        </div>
      </div>

      {/* ── Info Sections ── */}
      <div className="info-section">
        <h2 className="section-title">Suggestions</h2>
        <div className="cards-grid">
          <div className="info-card" onClick={() => navigate('/request-ride')}>
            <div className="card-icon-wrapper"><Car size={30} /></div>
            <h3>Ride</h3><p>Go anywhere with Ugo</p>
          </div>
          <div className="info-card" onClick={() => navigate('/reserve')}>
            <div className="card-icon-wrapper"><Calendar size={30} /></div>
            <h3>Reserve</h3><p>Reserve a ride in advance</p>
          </div>
          <div className="info-card" onClick={() => navigate('/package')}>
            <div className="card-icon-wrapper"><Package size={30} /></div>
            <h3>Package</h3><p>Ugo Connect delivery</p>
          </div>
        </div>

        <div className="promo-row">
          <div className="promo-text">
            <h2>Drive when you want,<br />make what you need</h2>
            <p>Make money on your schedule with deliveries or rides—or both. You can use your own car or choose a rental through Ugo.</p>
            <div className="promo-actions">
              {user?.role === 'driver' ? (
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              ) : (
                <>
                  <button className="btn-secondary" onClick={() => navigate('/driver-onboarding')}>Get started</button>
                  <button className="btn-ghost" onClick={() => navigate('/login', { state: { role: 'driver' } })}>
                    Already have an account? Sign in
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="promo-img-container">
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
              alt="Professional driver in Jaipur"
              className="promo-img"
              loading="lazy"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Cpath d='M320 220h160v80H320z' fill='%23e2e8f0'/%3E%3Cpath d='M340 250h120v20H340z' fill='%23cbd5e1'/%3E%3Ctext x='400' y='350' text-anchor='middle' fill='%2394a3b8' font-family='Arial' font-size='14'%3EDriver Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* ── Amer Fort Promo Banner ── */}
        <div className="promo-row promo-row--highlight">
          <div className="promo-img-container promo-img--featured">
            <img
              src="https://images.unsplash.com/photo-1577891038432-f37ea6f6d399?auto=format&fit=crop&q=80&w=900"
              alt="Amer Fort Jaipur - Pink City Landmark"
              className="promo-img promo-img--large"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=900";
              }}
            />
          </div>
          <div className="promo-text promo-text--overlay">
            <h2>Explore Jaipur's Pink City</h2>
            <p>From the majestic Amer Fort to Hawa Mahal, discover Jaipur's iconic landmarks with Ugo. Quick, reliable rides to every destination.</p>
            <div className="promo-actions">
              <button className="btn-secondary" onClick={() => navigate('/ride')}>Book a ride now</button>
            </div>
          </div>
        </div>

        <div className="promo-row promo-row--reverse">
          <div className="promo-img-container">
            <img
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800"
              alt="Business solutions in Jaipur"
              className="promo-img"
              loading="lazy"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Cpath d='M280 200h240v120H280z' fill='%23e2e8f0'/%3E%3Cpath d='M300 230h200v20H300z' fill='%23cbd5e1'/%3E%3Cpath d='M300 260h160v15H300z' fill='%23cbd5e1'/%3E%3Ctext x='400' y='380' text-anchor='middle' fill='%2394a3b8' font-family='Arial' font-size='14'%3EBusiness Solutions%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="promo-text">
            <h2>The Ugo you know,<br />reimagined for business</h2>
            <p>A platform for managing global rides and meals, and local deliveries, for companies of any size.</p>
            <div className="promo-actions">
              <button className="btn-secondary" onClick={() => navigate('/business')}>Check out our solutions</button>
            </div>
          </div>
        </div>

        <div className="promo-row">
          <div className="promo-text">
            <h2>Make money by renting out your car</h2>
            <p>Connect with thousands of drivers and earn more per week with Ugo's free fleet management tools.</p>
            <div className="promo-actions">
              <button className="btn-secondary">Get started</button>
            </div>
          </div>
          <div className="promo-img-container">
            <img
              src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"
              alt="Car rental in Jaipur"
              className="promo-img"
              loading="lazy"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Cpath d='M200 250h400v100H200z' fill='%23e2e8f0'/%3E%3Cpath d='M240 290h80v20H240z' fill='%23cbd5e1'/%3E%3Cpath d='M480 290h80v20H480z' fill='%23cbd5e1'/%3E%3Ctext x='400' y='390' text-anchor='middle' fill='%2394a3b8' font-family='Arial' font-size='14'%3ECar Rental%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        <div className="promo-row promo-row--reverse">
          <div className="promo-img-container">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
              alt="Reserve ride in advance in Jaipur"
              className="promo-img"
              loading="lazy"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Cpath d='M300 200h200v150H300z' fill='%23e2e8f0'/%3E%3Cpath d='M330 230h140v20H330z' fill='%23cbd5e1'/%3E%3Cpath d='M330 260h100v15H330z' fill='%23cbd5e1'/%3E%3Cpath d='M330 280h120v15H330z' fill='%23cbd5e1'/%3E%3Ctext x='400' y='380' text-anchor='middle' fill='%2394a3b8' font-family='Arial' font-size='14'%3EReserve Ride%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="promo-text">
            <h2>Plan for a later ride</h2>
            <p>Going to the airport? Want to secure a ride in advance? Reserve your ride up to 90 days ahead with Ugo Reserve.</p>
            <div className="promo-actions">
              <button className="btn-secondary" onClick={() => navigate('/reserve')}>Reserve a ride</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
