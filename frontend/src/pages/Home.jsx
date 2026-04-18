import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Car, Package, Navigation, Briefcase, Home as HomeIcon, Calendar } from 'lucide-react';

// Custom car icon for drivers
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204121.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});
import './Home.css';

// Component to dynamically update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [historyLocations, setHistoryLocations] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [position, setPosition] = useState([26.9124, 75.7873]); // Default Jaipur
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Attempt to get Rider's actual location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Could not get rider location", err)
      );
    }
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

    const fetchDrivers = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('ugo_token');
        const res = await fetch(`${API_URL}/api/drivers/available`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableDrivers(data);
        }
      } catch (err) {
        console.error('Failed to fetch drivers:', err);
      }
    };

    fetchHistory();
    
    // Poll for drivers every 10 seconds
    fetchDrivers();
    const intervalId = setInterval(fetchDrivers, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRequestRide = (e) => {
    e.preventDefault();
    if (pickup && dropoff) {
      navigate('/request-ride', { state: { pickup, dropoff } });
    }
  };

  return (
    <div className="home-container animate-in">

      {/* ── Hero: Map + Booking Sidebar ── */}
      <div className="home-content">
        {/* Map first on mobile (order-1), sidebar slides over it */}
        <div className="home-map">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <MapUpdater center={position} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {/* Render available drivers on map */}
            {availableDrivers.map((driver) => (
              driver.location?.lat && driver.location?.lng && (
                <Marker 
                  key={driver._id} 
                  position={[driver.location.lat, driver.location.lng]}
                  icon={carIcon}
                >
                  <Popup>{driver.name} (Driver)</Popup>
                </Marker>
              )
            ))}
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
