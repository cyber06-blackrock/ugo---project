import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, Package, Navigation, Briefcase, Home as HomeIcon, Calendar } from 'lucide-react';
import NearbyDrivers from '../components/NearbyDrivers';
import { generateNearbyDrivers } from '../utils/generateDrivers';

// Fix Leaflet default marker icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Red car icon for drivers
const driverIcon = L.divIcon({
  className: '',
  html: `<div style="width:40px;height:40px;background:#ef4444;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48" fill="white">
      <path d="M 32 18 L 16 18 L 14 24 L 14 34 L 16 34 L 16 36 L 19 36 L 19 34 L 29 34 L 29 36 L 32 36 L 32 34 L 34 34 L 34 24 L 32 18 Z M 18 22 L 30 22 L 31 25 L 17 25 L 18 22 Z"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Blue dot for user location
const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#276ef1;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 6px rgba(39,110,241,0.25);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Helper: re-center map when position changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center]);
  return null;
}

import './Home.css';

const Home = ({ userLocation }) => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [activeTab, setActiveTab] = useState('ride');
  const [pickup, setPickup] = useState(locationState.state?.pickup || '');
  const [dropoff, setDropoff] = useState(locationState.state?.dropoff || '');
  const [historyLocations, setHistoryLocations] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [position, setPosition] = useState({
    lat: userLocation?.lat || 26.9124,
    lng: userLocation?.lng || 75.7873
  });
  const [user, setUser] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [infoWindowDriver, setInfoWindowDriver] = useState(null);

  // Update position when userLocation prop changes
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      setPosition({ lat: userLocation.lat, lng: userLocation.lng });
      fetchDrivers(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  const fetchDrivers = async (lat, lng) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let url = `${API_URL}/api/drivers/available`;
      if (lat && lng) url += `?lat=${lat}&lng=${lng}`;

      console.log('Fetching drivers from:', url);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`Found ${data.length} drivers from API`);
        
        // Filter: Only show drivers till 3 min away
        const filteredData = data.filter(d => d.eta <= 3).slice(0, 3);
        console.log(`Showing ${filteredData.length} drivers (within 3 min limit)`);
        
        if (filteredData.length > 0) {
          setAvailableDrivers(filteredData);
          return;
        }
      }
      throw new Error('No drivers from API');
    } catch (err) {
      console.log('Using local driver generation (backend unavailable or empty)');
      if (lat && lng) {
        const localDrivers = generateNearbyDrivers(lat, lng, 12);
        const filteredLocal = localDrivers.filter(d => d.eta <= 3).slice(0, 3);
        console.log(`Generated ${filteredLocal.length} local drivers (within 3 min limit)`);
        setAvailableDrivers(filteredLocal);
      }
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userStr = localStorage.getItem('ugo_user');
        if (userStr) {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          if (parsedUser._id) {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/rides/history/${parsedUser._id}`);
            const data = await res.json();
            const locations = new Set();
            data.forEach(ride => {
              if (ride.pickupLocation?.address) locations.add(ride.pickupLocation.address);
              if (ride.dropoffLocation?.address) locations.add(ride.dropoffLocation.address);
            });
            setHistoryLocations(Array.from(locations));
          }
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };

    fetchHistory();
    
    // Connect Socket for Live Tracking
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(API_URL);

    socket.on('driverLocationUpdate', (data) => {
      setAvailableDrivers(prev => {
        const index = prev.findIndex(d => d._id === data.driverId);
        if (index > -1) {
          const newDrivers = [...prev];
          newDrivers[index] = { ...newDrivers[index], location: { lat: data.lat, lng: data.lng } };
          return newDrivers;
        } else {
          return [...prev, { _id: data.driverId, name: data.name, location: { lat: data.lat, lng: data.lng } }];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRequestRide = (e) => {
    e.preventDefault();
    if (pickup && dropoff) {
      navigate('/request-ride', { state: { pickup, dropoff } });
    }
  };

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    if (driver.location?.lat && driver.location?.lng) {
      setPosition({ lat: driver.location.lat, lng: driver.location.lng });
    }
  };

  return (
    <div className="home-container animate-in">

      {/* ── Hero: Map + Booking Sidebar ── */}
      <div className="home-content">
        <div className="home-map">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={14}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter center={[position.lat, position.lng]} />

            {/* User location blue dot */}
            {userLocation?.lat && userLocation?.lng && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {/* Driver markers — red cars */}
            {availableDrivers.slice(0, 5).map((driver) =>
              driver.location?.lat && driver.location?.lng ? (
                <Marker
                  key={driver._id}
                  position={[driver.location.lat, driver.location.lng]}
                  icon={driverIcon}
                >
                  <Popup>
                    <div className="map-info-window">
                      <strong>{driver.name}</strong>
                      <p>{driver.vehicleName || 'UgoX'} • ⭐ {driver.rating?.toFixed(1) || '4.5'}</p>
                      {driver.eta && <p className="eta-text">🕐 {driver.eta} min away</p>}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>

        <div className="home-sidebar">
          {/* Tabs */}
          <div className="tabs">
            <button className={activeTab === 'ride' ? 'tab active' : 'tab'} onClick={() => setActiveTab('ride')}>
              <span className="tab-icon"><Car size={24} /></span>
              Ride
            </button>
            <button className={activeTab === 'package' ? 'tab active' : 'tab'} onClick={() => setActiveTab('package')}>
              <span className="tab-icon"><Package size={24} /></span>
              Package
            </button>
          </div>

          {/* Booking card */}
          <div className="booking-card">
            <h2 className="hero-heading">Go anywhere with<br />Ugo</h2>

            <datalist id="jaipur-locations">
              {historyLocations.map((loc, idx) => <option key={idx} value={loc} />)}
              <option value="Hawa Mahal" /><option value="Amer Fort" />
              <option value="City Palace" /><option value="Albert Hall Museum" />
              <option value="Jantar Mantar" /><option value="Patrika Gate" />
              <option value="Jaipur Railway Station" /><option value="Jaipur International Airport" />
              <option value="Jal Mahal" />
            </datalist>

            <form onSubmit={handleRequestRide}>
              <div className="input-group">
                <span className="input-dot dot" />
                <input
                  type="text"
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  list="jaipur-locations"
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
                  onChange={e => setDropoff(e.target.value)}
                  list="jaipur-locations"
                  required
                />
              </div>

              <button type="submit" className="see-prices-btn">
                See prices
              </button>
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

          {/* ── Nearby Drivers Section ── */}
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
            <h3>Ride</h3>
            <p>Go anywhere with Ugo</p>
          </div>
          <div className="info-card" onClick={() => navigate('/reserve')}>
            <div className="card-icon-wrapper"><Calendar size={30} /></div>
            <h3>Reserve</h3>
            <p>Reserve a ride in advance</p>
          </div>
          <div className="info-card" onClick={() => navigate('/package')}>
            <div className="card-icon-wrapper"><Package size={30} /></div>
            <h3>Package</h3>
            <p>Ugo Connect delivery</p>
          </div>
        </div>

        {/* Promo: Drive */}
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
                  <button className="btn-ghost" onClick={() => navigate('/login', { state: { role: 'driver' } })}>Already have an account? Sign in</button>
                </>
              )}
            </div>
          </div>
          <div className="promo-img" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800)" }} />
        </div>

        {/* Promo: Business (reversed) */}
        <div className="promo-row promo-row--reverse">
          <div className="promo-img" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800)" }} />
          <div className="promo-text">
            <h2>The Ugo you know,<br />reimagined for business</h2>
            <p>A platform for managing global rides and meals, and local deliveries, for companies of any size.</p>
            <div className="promo-actions">
              <button className="btn-secondary" onClick={() => navigate('/business')}>Check out our solutions</button>
            </div>
          </div>
        </div>

        {/* Promo: Rent your car */}
        <div className="promo-row">
          <div className="promo-text">
            <h2>Make money by renting out your car</h2>
            <p>Connect with thousands of drivers and earn more per week with Ugo's free fleet management tools.</p>
            <div className="promo-actions">
              <button className="btn-secondary">Get started</button>
            </div>
          </div>
          <div className="promo-img" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800)" }} />
        </div>

        {/* Promo: Plan for later (reversed) */}
        <div className="promo-row promo-row--reverse">
          <div className="promo-img" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800)" }} />
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
