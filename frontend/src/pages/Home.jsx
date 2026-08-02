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
        <h2 className="section-title">Ride Options in Jaipur</h2>
        <div className="ride-options-grid">
          <div className="ride-option-card">
            <div className="ride-option-image" dangerouslySetInnerHTML={{ 
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="homeCarGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" /><stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#homeCarGrad)"/><g transform="translate(50,30)"><rect x="10" y="15" width="80" height="25" rx="5" fill="#fff" opacity="0.9"/><circle cx="30" cy="50" r="8" fill="#1e293b"/><circle cx="70" cy="50" r="8" fill="#1e293b"/><rect x="15" y="20" width="25" height="15" fill="#3b82f6" opacity="0.7"/><rect x="45" y="20" width="25" height="15" fill="#3b82f6" opacity="0.7"/></g></svg>` 
            }} />
            <div className="ride-option-content">
              <h3>UgoX</h3>
              <p className="ride-option-desc">Comfortable sedans at affordable prices</p>
              <p className="ride-option-price">From ₹30/km</p>
            </div>
          </div>

          <div className="ride-option-card">
            <div className="ride-option-image" dangerouslySetInnerHTML={{ 
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="homeAutoGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" /><stop offset="100%" style="stop-color:#d97706;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#homeAutoGrad)"/><g transform="translate(50,25)"><path d="M20,30 L30,20 L70,20 L80,30 L80,45 L20,45 Z" fill="#fbbf24" stroke="#fff" stroke-width="2"/><circle cx="35" cy="50" r="6" fill="#1e293b" stroke="#fff" stroke-width="1.5"/><circle cx="65" cy="50" r="6" fill="#1e293b" stroke="#fff" stroke-width="1.5"/><rect x="35" y="25" width="30" height="15" fill="#fff" opacity="0.3"/><text x="50" y="17" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">AUTO</text></g></svg>` 
            }} />
            <div className="ride-option-content">
              <h3>UgoAuto</h3>
              <p className="ride-option-desc">Traditional rickshaws for quick city rides</p>
              <p className="ride-option-price">From ₹16/km</p>
            </div>
          </div>

          <div className="ride-option-card">
            <div className="ride-option-image" dangerouslySetInnerHTML={{ 
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="homeBikeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#10b981;stop-opacity:1" /><stop offset="100%" style="stop-color:#059669;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#homeBikeGrad)"/><g transform="translate(50,30)"><circle cx="25" cy="45" r="10" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="75" cy="45" r="10" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M25,45 L50,25 L60,25 L75,45" stroke="#fff" stroke-width="2.5" fill="none"/><path d="M50,25 L55,35" stroke="#fff" stroke-width="2.5"/><circle cx="50" cy="20" r="4" fill="#fff"/></g></svg>` 
            }} />
            <div className="ride-option-content">
              <h3>UgoMoto</h3>
              <p className="ride-option-desc">Fast bikes to beat Jaipur traffic</p>
              <p className="ride-option-price">From ₹12/km</p>
            </div>
          </div>

          <div className="ride-option-card">
            <div className="ride-option-image" dangerouslySetInnerHTML={{ 
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><defs><linearGradient id="homeSuvGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" /><stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" /></linearGradient></defs><rect width="200" height="100" fill="url(#homeSuvGrad)"/><g transform="translate(40,25)"><rect x="10" y="15" width="100" height="30" rx="5" fill="#fff" opacity="0.95"/><rect x="5" y="25" width="110" height="15" rx="3" fill="#a78bfa" opacity="0.8"/><circle cx="30" cy="50" r="9" fill="#1e293b"/><circle cx="90" cy="50" r="9" fill="#1e293b"/><rect x="20" y="20" width="30" height="18" fill="#8b5cf6" opacity="0.6"/><rect x="55" y="20" width="35" height="18" fill="#8b5cf6" opacity="0.6"/><text x="60" y="15" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">XL</text></g></svg>` 
            }} />
            <div className="ride-option-content">
              <h3>UgoXL</h3>
              <p className="ride-option-desc">Spacious SUVs for family trips</p>
              <p className="ride-option-price">From ₹48/km</p>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{ marginTop: '4rem' }}>Reliable rides across Jaipur</h2>
        <div className="jaipur-landmarks-grid">
          <div className="landmark-card">
            <div className="landmark-image" dangerouslySetInnerHTML={{
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="amerSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87CEEB"/>
                    <stop offset="100%" style="stop-color:#F0E68C"/>
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#amerSky)"/>
                <path d="M0,200 L100,150 L200,170 L300,140 L400,180 L400,300 L0,300 Z" fill="#8B7355" opacity="0.4"/>
                <g transform="translate(50,80)">
                  <rect x="0" y="100" width="300" height="120" fill="#DAA520"/>
                  <rect x="20" y="120" width="40" height="60" fill="#8B4513" opacity="0.7"/>
                  <rect x="80" y="120" width="40" height="60" fill="#8B4513" opacity="0.7"/>
                  <rect x="130" y="110" width="50" height="70" fill="#8B4513" opacity="0.7"/>
                  <rect x="200" y="120" width="40" height="60" fill="#8B4513" opacity="0.7"/>
                  <rect x="250" y="120" width="40" height="60" fill="#8B4513" opacity="0.7"/>
                  <circle cx="40" cy="110" r="18" fill="#CD853F"/>
                  <path d="M28,110 L40,85 L52,110 Z" fill="#FFD700"/>
                  <circle cx="100" cy="110" r="18" fill="#CD853F"/>
                  <path d="M88,110 L100,85 L112,110 Z" fill="#FFD700"/>
                  <circle cx="155" cy="100" r="20" fill="#CD853F"/>
                  <path d="M142,100 L155,72 L168,100 Z" fill="#FFD700"/>
                  <circle cx="220" cy="110" r="18" fill="#CD853F"/>
                  <path d="M208,110 L220,85 L232,110 Z" fill="#FFD700"/>
                  <circle cx="270" cy="110" r="18" fill="#CD853F"/>
                  <path d="M258,110 L270,85 L282,110 Z" fill="#FFD700"/>
                  <path d="M130,180 L130,220 L180,220 L180,180 Q155,170 130,180 Z" fill="#654321"/>
                </g>
                <!-- Animated Car -->
                <g>
                  <animateTransform attributeName="transform" type="translate" from="-80 0" to="480 0" dur="8s" repeatCount="indefinite"/>
                  <rect x="20" y="260" width="60" height="25" rx="5" fill="#FFD700"/>
                  <rect x="25" y="265" width="20" height="15" fill="#4A90E2" opacity="0.7"/>
                  <rect x="50" y="265" width="20" height="15" fill="#4A90E2" opacity="0.7"/>
                  <circle cx="35" cy="287" r="6" fill="#333"/>
                  <circle cx="65" cy="287" r="6" fill="#333"/>
                </g>
              </svg>`
            }} />
            <h3>Amer Fort</h3>
            <p>Visit the majestic hilltop fortress</p>
          </div>

          <div className="landmark-card">
            <div className="landmark-image" dangerouslySetInnerHTML={{
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="hawaSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFB6C1"/>
                    <stop offset="100%" style="stop-color:#FFA07A"/>
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#hawaSky)"/>
                <g transform="translate(80,50)">
                  <rect x="0" y="80" width="240" height="170" fill="#FFC0CB" opacity="0.9"/>
                  <polygon points="0,80 120,30 240,80" fill="#FFB6C1"/>
                  ${Array.from({length: 5}, (_, i) => `
                    <g transform="translate(${i * 48},0)">
                      <circle cx="24" cy="110" r="10" fill="#8B4513"/>
                      <circle cx="24" cy="135" r="10" fill="#8B4513"/>
                      <circle cx="24" cy="160" r="10" fill="#8B4513"/>
                      <circle cx="24" cy="185" r="10" fill="#8B4513"/>
                      <circle cx="24" cy="210" r="10" fill="#8B4513"/>
                    </g>
                  `).join('')}
                  <rect x="100" y="200" width="40" height="50" fill="#654321"/>
                </g>
                <!-- Animated Auto Rickshaw -->
                <g>
                  <animateTransform attributeName="transform" type="translate" from="450 0" to="-100 0" dur="10s" repeatCount="indefinite"/>
                  <path d="M30,265 L40,255 L70,255 L80,265 L80,280 L30,280 Z" fill="#FFEB3B"/>
                  <rect x="45" y="260" width="25" height="15" fill="#4A90E2" opacity="0.6"/>
                  <circle cx="45" cy="282" r="5" fill="#333"/>
                  <circle cx="65" cy="282" r="5" fill="#333"/>
                  <text x="55" y="252" font-size="8" fill="#000" text-anchor="middle">AUTO</text>
                </g>
              </svg>`
            }} />
            <h3>Hawa Mahal</h3>
            <p>The iconic Palace of Winds</p>
          </div>

          <div className="landmark-card">
            <div className="landmark-image" dangerouslySetInnerHTML={{
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="palaceSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#E6E6FA"/>
                    <stop offset="100%" style="stop-color:#DDA0DD"/>
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#palaceSky)"/>
                <g transform="translate(60,90)">
                  <rect x="0" y="100" width="280" height="110" fill="#F5DEB3"/>
                  <rect x="30" y="120" width="50" height="60" fill="#8B4513" opacity="0.7"/>
                  <rect x="100" y="110" width="80" height="70" fill="#8B4513" opacity="0.7"/>
                  <rect x="200" y="120" width="50" height="60" fill="#8B4513" opacity="0.7"/>
                  <polygon points="0,100 140,40 280,100" fill="#DAA520"/>
                  <circle cx="140" cy="50" r="15" fill="#FFD700"/>
                  <path d="M130,50 L140,30 L150,50 Z" fill="#FFD700"/>
                  <rect x="40" y="140" width="15" height="25" fill="#4A4A4A" opacity="0.6"/>
                  <rect x="60" y="140" width="15" height="25" fill="#4A4A4A" opacity="0.6"/>
                  <rect x="110" y="130" width="20" height="30" fill="#4A4A4A" opacity="0.6"/>
                  <rect x="140" y="130" width="20" height="30" fill="#4A4A4A" opacity="0.6"/>
                  <rect x="210" y="140" width="15" height="25" fill="#4A4A4A" opacity="0.6"/>
                  <rect x="230" y="140" width="15" height="25" fill="#4A4A4A" opacity="0.6"/>
                </g>
                <!-- Animated Motorcycle -->
                <g>
                  <animateTransform attributeName="transform" type="translate" from="-60 0" to="460 0" dur="6s" repeatCount="indefinite"/>
                  <circle cx="35" cy="278" r="7" fill="#333"/>
                  <circle cx="65" cy="278" r="7" fill="#333"/>
                  <path d="M35,278 L50,265 L60,265 L65,278" stroke="#E91E63" stroke-width="3" fill="none"/>
                  <circle cx="50" cy="260" r="3" fill="#333"/>
                  <rect x="48" y="265" width="8" height="8" fill="#E91E63"/>
                </g>
              </svg>`
            }} />
            <h3>City Palace</h3>
            <p>Royal heritage and museums</p>
          </div>

          <div className="landmark-card">
            <div className="landmark-image" dangerouslySetInnerHTML={{
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="waterSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87CEEB"/>
                    <stop offset="100%" style="stop-color:#B0E0E6"/>
                  </linearGradient>
                  <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#4682B4"/>
                    <stop offset="100%" style="stop-color:#5F9EA0"/>
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#waterSky)"/>
                <ellipse cx="200" cy="240" rx="180" ry="60" fill="url(#water)"/>
                <ellipse cx="190" cy="235" rx="170" ry="50" fill="#5F9EA0" opacity="0.3"/>
                <g transform="translate(120,120)">
                  <rect x="0" y="80" width="160" height="80" fill="#DEB887"/>
                  <polygon points="0,80 80,40 160,80" fill="#D2B48C"/>
                  <rect x="30" y="100" width="25" height="40" fill="#8B4513" opacity="0.7"/>
                  <rect x="60" y="95" width="40" height="45" fill="#8B4513" opacity="0.7"/>
                  <rect x="105" y="100" width="25" height="40" fill="#8B4513" opacity="0.7"/>
                  <circle cx="80" cy="50" r="12" fill="#CD853F"/>
                  <path d="M72,50 L80,35 L88,50 Z" fill="#FFD700"/>
                  <ellipse cx="200" cy="200" rx="100" ry="15" fill="#4682B4" opacity="0.2"/>
                </g>
                <!-- Animated SUV -->
                <g>
                  <animateTransform attributeName="transform" type="translate" from="450 0" to="-80 0" dur="9s" repeatCount="indefinite"/>
                  <rect x="15" y="258" width="70" height="28" rx="5" fill="#7C4DFF"/>
                  <rect x="20" y="263" width="25" height="18" fill="#4A90E2" opacity="0.7"/>
                  <rect x="50" y="263" width="30" height="18" fill="#4A90E2" opacity="0.7"/>
                  <circle cx="30" cy="288" r="7" fill="#333"/>
                  <circle cx="70" cy="288" r="7" fill="#333"/>
                  <text x="50" y="255" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold">XL</text>
                </g>
              </svg>`
            }} />
            <h3>Jal Mahal</h3>
            <p>The stunning Water Palace</p>
          </div>
        </div>

        <h2 className="section-title" style={{ marginTop: '4rem' }}>Suggestions</h2>
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
            <div className="promo-placeholder promo-placeholder--driver">
              <div className="promo-placeholder-icon">🚗</div>
              <div className="promo-placeholder-text">Drive & Earn</div>
            </div>
          </div>
        </div>

        {/* ── Amer Fort Promo Banner ── */}
        <div className="promo-row promo-row--highlight">
          <div className="promo-img-container promo-img--featured">
            <div className="promo-placeholder promo-placeholder--amer">
              <div className="promo-placeholder-icon">🏰</div>
              <div className="promo-placeholder-text">Amer Fort</div>
              <div className="promo-placeholder-subtitle">Pink City Landmark</div>
            </div>
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
              src="/images/business.jpg"
              alt="Ugo Business Solutions in Jaipur"
              className="promo-img"
              loading="lazy"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2394a3b8' font-family='Arial' font-size='24'%3EBusiness%3C/text%3E%3C/svg%3E";
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
              <button className="btn-secondary" onClick={() => navigate('/car-rental')}>Get started</button>
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
