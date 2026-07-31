import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { generateNearbyDrivers } from '../utils/generateDrivers';
import './RideRequest.css';

// ── Fix Leaflet icon paths ──────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Marker icons ────────────────────────────────────────────────────────────
const pickupIcon = L.divIcon({
  className: '',
  html: `<div class="rr-lf-pickup-pin"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});

const dropoffIcon = L.divIcon({
  className: '',
  html: `<div class="rr-lf-dropoff-pin">📍</div>`,
  iconSize: [28, 28], iconAnchor: [14, 28],
});

const makeDriverIcon = (isTracked) => L.divIcon({
  className: '',
  html: `<div class="rr-lf-driver-pin${isTracked ? ' rr-lf-driver-pin--tracked' : ''}">
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 48 48" fill="white">
      <path d="M32 18H16l-2 6v10h2v2h3v-2h10v2h3v-2h2V24l-2-6zm-14 4h12l1 3H17l1-3z"/>
    </svg>
  </div>`,
  iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -22],
});

// ── Auto-fit map to show both points ───────────────────────────────────────
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points && points.length >= 2) {
      map.fitBounds(points, { padding: [60, 60] });
    }
  }, [points]);
  return null;
};

// ── Recenter on tracked driver ─────────────────────────────────────────────
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, map.getZoom()); }, [center]);
  return null;
};

// ── Ride type display config ────────────────────────────────────────────────
const RIDE_CONFIG = {
  UgoGo:    { icon: '🚗', color: '#6366f1' },
  UgoX:     { icon: '🚗', color: '#111111' },
  UgoXL:    { icon: '🚙', color: '#0ea5e9' },
  UgoBlack: { icon: '🖤', color: '#1e1e1e' },
  UgoMoto:  { icon: '🏍️', color: '#f59e0b' },
  UgoAuto:  { icon: '🛺', color: '#10b981' },
};

const JAIPUR_PLACES = [
  'Hawa Mahal', 'Amer Fort', 'City Palace', 'Albert Hall Museum',
  'Jantar Mantar', 'Patrika Gate', 'Jaipur Railway Station',
  'Jaipur International Airport', 'Jal Mahal', 'Nahargarh Fort',
  'Birla Mandir', 'Johari Bazaar', 'MI Road', 'Sisodia Rani Garden',
];

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const JAIPUR = { lat: 26.9124, lng: 75.7873 };

// ── Component ───────────────────────────────────────────────────────────────
const RideRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [pickup,        setPickup]        = useState(location.state?.pickup  || '');
  const [dropoff,       setDropoff]       = useState(location.state?.dropoff || '');
  const [fareStatus,    setFareStatus]    = useState(null);
  const [quotes,        setQuotes]        = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [routeData,     setRouteData]     = useState(null);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [driverPos,     setDriverPos]     = useState(null);
  const [driverMetrics, setDriverMetrics] = useState({ distance: 0, eta: 0 });
  const [driverArrived, setDriverArrived] = useState(false);
  const [historyLocs,   setHistoryLocs]   = useState([]);
  const [mapCenter,     setMapCenter]     = useState([JAIPUR.lat, JAIPUR.lng]);

  // ── Seed 4 mock drivers around Jaipur ──────────────────────────────────
  useEffect(() => {
    const drivers = generateNearbyDrivers(JAIPUR.lat, JAIPUR.lng, 12).slice(0, 4);
    [1, 3, 2, 4].forEach((eta, i) => { if (drivers[i]) drivers[i].eta = eta; });
    setNearbyDrivers(drivers);
  }, []);

  // ── History datalist ────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const userStr = localStorage.getItem('ugo_user');
        if (!userStr) return;
        const u = JSON.parse(userStr);
        if (!u._id) return;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res  = await fetch(`${API_URL}/api/rides/history/${u._id}`);
        const data = await res.json();
        const locs = new Set();
        data.forEach(r => {
          if (r.pickupLocation?.address)  locs.add(r.pickupLocation.address);
          if (r.dropoffLocation?.address) locs.add(r.dropoffLocation.address);
        });
        setHistoryLocs(Array.from(locs));
      } catch { /* silent */ }
    };
    load();
  }, []);

  // ── Socket live updates ─────────────────────────────────────────────────
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket  = io(API_URL);
    socket.on('driverLocationUpdate', (data) => {
      if (data?.lat && data?.lng) setDriverPos([data.lat, data.lng]);
    });
    return () => socket.disconnect();
  }, []);

  // ── Animate driver toward pickup after confirm ──────────────────────────
  useEffect(() => {
    if (fareStatus !== 'tracking' || !routeData?.pickupCoords) return;

    let lat = routeData.pickupCoords.lat + 0.015;
    let lng = routeData.pickupCoords.lng + 0.012;
    const tLat = routeData.pickupCoords.lat;
    const tLng = routeData.pickupCoords.lng;
    setDriverPos([lat, lng]);
    setMapCenter([lat, lng]);

    const id = setInterval(() => {
      lat += (tLat - lat) * 0.07;
      lng += (tLng - lng) * 0.07;
      setDriverPos([lat, lng]);
      setMapCenter([lat, lng]);
      const dist = haversine(lat, lng, tLat, tLng);
      setDriverMetrics({ distance: dist.toFixed(2), eta: Math.max(1, Math.ceil(dist / 0.5)) });
      if (dist < 0.05) {
        clearInterval(id);
        setDriverMetrics({ distance: 0, eta: 0 });
        setDriverArrived(true);
        setFareStatus('arrived');
      }
    }, 1800);

    return () => clearInterval(id);
  }, [fareStatus]);

  // ── Fetch fare quotes ───────────────────────────────────────────────────
  const handleCalculateFare = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;
    setFareStatus('calculating');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.get(`${API_URL}/api/rides/quote`, {
        params: { pickup, dropoff },
      });
      setQuotes(data.quotes);
      setSelectedQuote(data.quotes.find(q => q.type === 'UgoX') || data.quotes[0]);
      setRouteData({ pickupCoords: data.pickupCoords, dropoffCoords: data.dropoffCoords });

      // Pan map to show both points
      if (data.pickupCoords && data.dropoffCoords) {
        setMapCenter([data.pickupCoords.lat, data.pickupCoords.lng]);
      }
      setFareStatus('calculated');
    } catch (err) {
      console.error('Quote failed:', err);
      alert('Could not get prices. Check your connection and try again.');
      setFareStatus(null);
    }
  };

  // ── Confirm ride ────────────────────────────────────────────────────────
  const handleRequestRide = async () => {
    if (!selectedQuote) return;
    setFareStatus('requested');
    try {
      let userId = '64e3f192b45a1b0012345678';
      const userStr = localStorage.getItem('ugo_user');
      if (userStr) { const u = JSON.parse(userStr); if (u._id) userId = u._id; }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/rides/request`, {
        riderId:       userId,
        pickup, dropoff,
        fare:          selectedQuote.price,
        distance:      selectedQuote.distance + ' km',
        pickupCoords:  routeData?.pickupCoords,
        dropoffCoords: routeData?.dropoffCoords,
      });
    } catch { /* fall through to tracking */ }
    setFareStatus('tracking');
  };

  // ── Route polyline points ───────────────────────────────────────────────
  const polylinePoints = routeData?.pickupCoords && routeData?.dropoffCoords
    ? [[routeData.pickupCoords.lat, routeData.pickupCoords.lng],
       [routeData.dropoffCoords.lat, routeData.dropoffCoords.lng]]
    : null;

  return (
    <div className="rr-page animate-in">

      {/* ── Form panel ── */}
      <div className="rr-form-panel glass-card">
        <h2 className="rr-title">Where to?</h2>

        <form onSubmit={handleCalculateFare} className="rr-form">
          <div className="rr-inputs-block">
            <div className="rr-input-wrap">
              <span className="rr-dot rr-dot--white" />
              <input
                type="text"
                placeholder="Pickup location"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                list="rr-places"
                required
              />
            </div>
            <div className="rr-connector" />
            <div className="rr-input-wrap">
              <span className="rr-dot rr-dot--accent" />
              <input
                type="text"
                placeholder="Dropoff destination"
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                list="rr-places"
                required
              />
            </div>
          </div>

          <datalist id="rr-places">
            {historyLocs.map((l, i) => <option key={`h${i}`} value={l} />)}
            {JAIPUR_PLACES.map((p, i) => <option key={`j${i}`} value={p} />)}
          </datalist>

          {/* Trip summary strip */}
          {fareStatus === 'calculated' && quotes[0] && (
            <div className="rr-trip-summary">
              <span>📍 {quotes[0].distance} km</span>
              <span className="rr-summary-dot">·</span>
              <span>🕐 {quotes[0].duration}</span>
            </div>
          )}

          {/* Quote cards */}
          {fareStatus === 'calculated' && (
            <div className="rr-quotes-list animate-in">
              <p className="rr-quotes-heading">Available rides</p>
              {quotes.map((q) => {
                const cfg      = RIDE_CONFIG[q.type] || RIDE_CONFIG.UgoX;
                const isActive = selectedQuote?.type === q.type;
                const perKm    = Math.round(q.price / Math.max(0.1, parseFloat(q.distance)));
                return (
                  <div
                    key={q.type}
                    className={`rr-quote-item${isActive ? ' rr-quote-item--active' : ''}`}
                    onClick={() => setSelectedQuote(q)}
                  >
                    <div className="rr-quote-icon">{cfg.icon}</div>
                    <div className="rr-quote-info">
                      <strong>{q.type}</strong>
                      <span className="rr-quote-sub">{q.info}</span>
                      <span className="rr-quote-meta">
                        {q.distance} km &nbsp;·&nbsp; {q.duration}
                      </span>
                    </div>
                    <div className="rr-quote-price">
                      <strong>₹{q.price}</strong>
                      <span className="rr-per-km">₹{perKm}/km</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Buttons */}
          {fareStatus === null && (
            <button type="submit" className="btn-accent rr-action-btn">See Prices</button>
          )}
          {fareStatus === 'calculating' && (
            <button disabled className="btn-primary rr-action-btn rr-disabled">Finding rides…</button>
          )}
          {fareStatus === 'calculated' && (
            <button type="button" onClick={handleRequestRide} className="btn-primary rr-action-btn">
              Confirm {selectedQuote?.type} — ₹{selectedQuote?.price}
            </button>
          )}
          {fareStatus === 'requested' && (
            <button disabled className="btn-primary rr-action-btn rr-disabled">Booking…</button>
          )}

          {fareStatus === 'tracking' && (
            <div className="rr-tracking animate-in">
              <div className="rr-tracking-badge">
                <span className="rr-tracking-dot" />
                Driver on the way!
              </div>
              <p className="rr-tracking-sub">{selectedQuote?.type} · ₹{selectedQuote?.price}</p>
              <div className="rr-metrics">
                <div className="rr-metric">
                  <span>Distance</span>
                  <strong>{driverMetrics.distance} km</strong>
                </div>
                <div className="rr-metric-divider" />
                <div className="rr-metric">
                  <span>ETA</span>
                  <strong>{driverMetrics.eta} min</strong>
                </div>
              </div>
            </div>
          )}

          {fareStatus === 'arrived' && (
            <div className="rr-arrived animate-in">
              <div className="rr-arrived-icon">🚗</div>
              <h3 className="rr-arrived-title">Your driver has arrived!</h3>
              <p className="rr-arrived-sub">
                {selectedQuote?.type} is waiting at your pickup location
              </p>
              <div className="rr-arrived-fare">
                <span>Total fare</span>
                <strong>₹{selectedQuote?.price}</strong>
              </div>
              <button
                className="btn-primary rr-action-btn rr-arrived-btn"
                onClick={() => navigate('/')}
              >
                Done
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ── Map panel (Leaflet — no API key needed) ── */}
      <div className="rr-map-panel">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fit bounds to route */}
          {polylinePoints && <FitBounds points={polylinePoints} />}

          {/* Recenter on tracked driver */}
          {driverPos && fareStatus === 'tracking' && <MapRecenter center={driverPos} />}

          {/* Route polyline */}
          {polylinePoints && (
            <Polyline
              positions={polylinePoints}
              color="#276ef1"
              weight={4}
              opacity={0.85}
              dashArray="0"
            />
          )}

          {/* Pickup marker */}
          {routeData?.pickupCoords && (
            <Marker
              position={[routeData.pickupCoords.lat, routeData.pickupCoords.lng]}
              icon={pickupIcon}
            >
              <Popup><div className="rr-lf-popup"><strong>📍 Pickup</strong><p>{pickup}</p></div></Popup>
            </Marker>
          )}

          {/* Dropoff marker */}
          {routeData?.dropoffCoords && (
            <Marker
              position={[routeData.dropoffCoords.lat, routeData.dropoffCoords.lng]}
              icon={dropoffIcon}
            >
              <Popup><div className="rr-lf-popup"><strong>🏁 Dropoff</strong><p>{dropoff}</p></div></Popup>
            </Marker>
          )}

          {/* Nearby driver markers */}
          {nearbyDrivers.map((driver) =>
            driver.location?.lat && driver.location?.lng ? (
              <Marker
                key={driver._id}
                position={[driver.location.lat, driver.location.lng]}
                icon={makeDriverIcon(false)}
              >
                <Popup>
                  <div className="rr-lf-popup">
                    <strong>{driver.name}</strong>
                    <p>{driver.vehicleName || 'UgoX'} · ⭐ {driver.rating?.toFixed(1) || '4.5'}</p>
                    {driver.eta && <p className="rr-lf-eta">🕐 {driver.eta} min away</p>}
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}

          {/* Tracked driver (post-confirm, animated) */}
          {driverPos && fareStatus === 'tracking' && (
            <Marker position={driverPos} icon={makeDriverIcon(true)}>
              <Popup><div className="rr-lf-popup"><strong>Your driver</strong><p>On the way…</p></div></Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RideRequest;
