import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import { Car, Package, Navigation, Briefcase, Home as HomeIcon, Calendar, LocateFixed } from 'lucide-react';
import NearbyDrivers from '../components/NearbyDrivers';
import { generateNearbyDrivers } from '../utils/generateDrivers';

// Custom car icon for drivers
const uberCarSvg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="16" y="8" width="32" height="48" rx="6" fill="#000000" />
  <rect x="20" y="14" width="24" height="12" rx="2" fill="#333333" />
  <rect x="20" y="38" width="24" height="14" rx="2" fill="#333333" />
  <path d="M 16 20 L 12 20 L 12 28 L 16 28 Z" fill="#000000" />
  <path d="M 48 20 L 52 20 L 52 28 L 48 28 Z" fill="#000000" />
</svg>
`.trim());

// User location marker (blue dot)
const userDotSvg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#276ef1" opacity="0.2"/>
  <circle cx="12" cy="12" r="6" fill="#276ef1"/>
  <circle cx="12" cy="12" r="3" fill="#ffffff"/>
</svg>
`.trim());

import './Home.css';

const Home = ({ userLocation }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
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

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setAvailableDrivers(data);
          return;
        }
      }
      throw new Error('No drivers from API');
    } catch (err) {
      console.log('Using local driver generation (backend unavailable)');
      if (lat && lng) {
        const localDrivers = generateNearbyDrivers(lat, lng, 12);
        setAvailableDrivers(localDrivers);
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

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="home-container animate-in">

      {/* ── Hero: Map + Booking Sidebar ── */}
      <div className="home-content">
        <div className="home-map">
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={position}
              center={position}
              defaultZoom={13}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              mapId={'bf51a910020fa1cf'} // Professional look with Map ID if available
              className="google-map-instance"
            >
              {/* User location marker */}
              {userLocation?.lat && userLocation?.lng && (
                <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }}>
                  <img src={userDotSvg} width={32} height={32} alt="You" />
                </AdvancedMarker>
              )}
              
              {/* Render available drivers on map */}
              {availableDrivers.map((driver) => (
                driver.location?.lat && driver.location?.lng && (
                  <AdvancedMarker 
                    key={driver._id} 
                    position={{ lat: driver.location.lat, lng: driver.location.lng }}
                    onClick={() => setInfoWindowDriver(driver)}
                  >
                    <img src={uberCarSvg} width={40} height={40} alt="Driver" className="driver-marker-img" />
                  </AdvancedMarker>
                )
              ))}

              {infoWindowDriver && (
                <InfoWindow
                  position={{ lat: infoWindowDriver.location.lat, lng: infoWindowDriver.location.lng }}
                  onCloseClick={() => setInfoWindowDriver(null)}
                >
                  <div className="map-info-window">
                    <strong>{infoWindowDriver.name}</strong>
                    <p>{infoWindowDriver.vehicleName || 'UgoX'} • ⭐ {infoWindowDriver.rating?.toFixed(1) || '4.5'}</p>
                    {infoWindowDriver.eta && <p className="eta-text">🕐 {infoWindowDriver.eta} min away</p>}
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
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
