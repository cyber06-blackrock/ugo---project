import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

// ── Fix Leaflet default icons ───────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Map icons ───────────────────────────────────────────────────────────────
const driverIcon = L.divIcon({
  className: '',
  html: `<div class="db-lf-driver-pin">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" fill="white">
      <path d="M32 18H16l-2 6v10h2v2h3v-2h10v2h3v-2h2V24l-2-6zm-14 4h12l1 3H17l1-3z"/>
    </svg>
  </div>`,
  iconSize: [44, 44], iconAnchor: [22, 22],
});

const rideRequestIcon = L.divIcon({
  className: '',
  html: `<div class="db-lf-request-pin">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </div>`,
  iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38],
});

const acceptedPickupIcon = L.divIcon({
  className: '',
  html: `<div class="db-lf-pickup-pin">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="8"/>
    </svg>
  </div>`,
  iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18],
});

const acceptedDropoffIcon = L.divIcon({
  className: '',
  html: `<div class="db-lf-dropoff-pin">🏁</div>`,
  iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -28],
});

// ── Fit map to show driver + all ride markers ───────────────────────────────
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points && points.length >= 2) {
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [JSON.stringify(points)]);
  return null;
};

const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 14); }, [JSON.stringify(center)]);
  return null;
};

// ── Haversine ───────────────────────────────────────────────────────────────
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const JAIPUR = [26.9124, 75.7873];

// ── Component ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [status,       setStatus]       = useState('offline');
  const [rideRequests, setRideRequests] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [driverPos,    setDriverPos]    = useState(JAIPUR);
  const [mapCenter,    setMapCenter]    = useState(JAIPUR);
  const [notification, setNotification] = useState(null); // { type, msg }
  const [todayStats,   setTodayStats]   = useState({
    earnings: 0, rides: 0, rating: 4.9, hours: 0,
  });

  const watchIdRef  = useRef(null);
  const socketRef   = useRef(null);
  const timerRef    = useRef(null);   // online hours timer
  const pollRef     = useRef(null);   // active rides polling

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showNotif = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ── Fetch active ride requests ───────────────────────────────────────────
  const fetchRides = useCallback(async () => {
    if (acceptedRide) return; // don't poll while on an active ride
    try {
      const { data } = await axios.get(`${API_URL}/api/rides/active`);
      setRideRequests(data);
    } catch { /* silent */ }
  }, [acceptedRide, API_URL]);

  // ── On mount: socket + initial rides ────────────────────────────────────
  useEffect(() => {
    fetchRides();
    socketRef.current = io(API_URL);

    socketRef.current.on('rideRequest', (req) => {
      setRideRequests(prev => {
        if (prev.find(r => r._id === req._id)) return prev;
        return [...prev, req];
      });
      showNotif('info', '🚗 New ride request nearby!');
    });

    return () => {
      socketRef.current?.disconnect();
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, []);

  // ── Poll every 8 s when online ──────────────────────────────────────────
  useEffect(() => {
    clearInterval(pollRef.current);
    if (status === 'online' && !acceptedRide) {
      fetchRides();
      pollRef.current = setInterval(fetchRides, 8000);
    }
    return () => clearInterval(pollRef.current);
  }, [status, acceptedRide, fetchRides]);

  // ── Toggle online / offline ──────────────────────────────────────────────
  const handleToggleStatus = async () => {
    setLoading(true);
    const newStatus = status === 'online' ? 'offline' : 'online';
    const token = localStorage.getItem('ugo_token');

    console.log('🔄 Toggle status:', { newStatus, hasToken: !!token, API_URL });

    try {
      if (!token) {
        console.warn('⚠️ No token found - working in demo mode');
        // Demo mode - allow status toggle without backend
        setStatus(newStatus);
        
        if (newStatus === 'online') {
          showNotif('success', '✅ You are now online (Demo mode). Finding rides…');
          
          // Start hours timer
          const start = Date.now();
          timerRef.current = setInterval(() => {
            setTodayStats(s => ({ ...s, hours: +((Date.now() - start) / 3600000).toFixed(1) }));
          }, 30000);
          
          // Use mock location for demo
          setDriverPos(JAIPUR);
          setMapCenter(JAIPUR);
        } else {
          showNotif('info', '⏸ You are now offline.');
          clearInterval(timerRef.current);
        }
        
        setLoading(false);
        return;
      }
      
      const response = await axios.put(
        `${API_URL}/api/drivers/status`,
        { isAvailable: newStatus === 'online' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Status update response:', response.data);
      
      // Only update status if API call succeeds
      setStatus(newStatus);
      
      if (newStatus === 'online') {
        showNotif('success', '✅ You are now online. Finding rides…');

        // Start hours timer
        const start = Date.now();
        timerRef.current = setInterval(() => {
          setTodayStats(s => ({ ...s, hours: +((Date.now() - start) / 3600000).toFixed(1) }));
        }, 30000);

        // Watch GPS
        if ('geolocation' in navigator) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            async ({ coords }) => {
              const { latitude: lat, longitude: lng } = coords;
              setDriverPos([lat, lng]);
              setMapCenter([lat, lng]);
              try {
                if (token) {
                  await axios.put(
                    `${API_URL}/api/drivers/location`,
                    { lat, lng },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                }
                const userStr = localStorage.getItem('ugo_user');
                if (userStr) {
                  const user = JSON.parse(userStr);
                  socketRef.current?.emit('updateLocation', { driverId: user._id, name: user.name, lat, lng });
                }
              } catch { /* silent */ }
            },
            (err) => console.warn('GPS error:', err),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 8000 }
          );
        }
      } else {
        showNotif('info', '⏸ You are now offline.');
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        clearInterval(timerRef.current);
      }
    } catch (err) {
      console.error('❌ Toggle failed:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
      });
      showNotif('error', '❌ Failed to update status. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Accept a ride ────────────────────────────────────────────────────────
  const handleAcceptRide = async (ride) => {
    try {
      await axios.put(`${API_URL}/api/rides/${ride._id}/accept`);
    } catch { /* best-effort */ }

    setAcceptedRide(ride);
    setSelectedRide(null);
    setRideRequests(prev => prev.filter(r => r._id !== ride._id));

    // Zoom map to show driver → pickup route
    if (ride.pickupLocation) {
      setMapCenter([ride.pickupLocation.lat, ride.pickupLocation.lng]);
    }

    setTodayStats(s => ({
      ...s,
      rides:    s.rides + 1,
      earnings: s.earnings + (ride.fare || 0),
    }));

    showNotif('success', `✅ Ride accepted! Head to ${ride.pickupLocation?.address || 'pickup'}`);
  };

  // ── Complete a ride ──────────────────────────────────────────────────────
  const handleCompleteRide = () => {
    showNotif('success', `🏁 Ride completed! ₹${acceptedRide?.fare || 0} earned.`);
    setAcceptedRide(null);
    setMapCenter(driverPos);
    fetchRides();
  };

  // ── Decline a ride ───────────────────────────────────────────────────────
  const handleDeclineRide = () => {
    setSelectedRide(null);
  };

  // ── Distance from driver to a ride pickup ────────────────────────────────
  const distToRide = (ride) => {
    if (!ride.pickupLocation) return null;
    const d = haversine(driverPos[0], driverPos[1], ride.pickupLocation.lat, ride.pickupLocation.lng);
    return d.toFixed(1);
  };

  const etaToRide = (ride) => {
    const d = parseFloat(distToRide(ride));
    if (isNaN(d)) return null;
    return Math.max(1, Math.round((d / 30) * 60));
  };

  // ── Map bound points ─────────────────────────────────────────────────────
  const boundsForAccepted = acceptedRide ? [
    driverPos,
    [acceptedRide.pickupLocation.lat, acceptedRide.pickupLocation.lng],
    [acceptedRide.dropoffLocation.lat, acceptedRide.dropoffLocation.lng],
  ] : null;

  const allRidePoints = rideRequests
    .filter(r => r.pickupLocation?.lat)
    .map(r => [r.pickupLocation.lat, r.pickupLocation.lng]);

  const boundsForRequests = allRidePoints.length > 0
    ? [driverPos, ...allRidePoints]
    : null;

  return (
    <div className="db-page animate-in">

      {/* ── Notification toast ── */}
      {notification && (
        <div className={`db-toast db-toast--${notification.type}`}>
          {notification.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="db-header">
        <div className="db-title-area">
          <h2>Driver Dashboard</h2>
          <div className={`db-status-badge db-status-badge--${status}`}>
            <span className={`db-status-dot ${status}`} />
            {status === 'online' ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Stats */}
        <div className="db-stats-grid">
          <div className="glass-card db-stat-card">
            <span className="db-stat-icon">💰</span>
            <span className="db-stat-value">₹{todayStats.earnings}</span>
            <span className="db-stat-label">Today's Earnings</span>
          </div>
          <div className="glass-card db-stat-card">
            <span className="db-stat-icon">🚗</span>
            <span className="db-stat-value">{todayStats.rides}</span>
            <span className="db-stat-label">Rides Today</span>
          </div>
          <div className="glass-card db-stat-card">
            <span className="db-stat-icon">⭐</span>
            <span className="db-stat-value">{todayStats.rating}</span>
            <span className="db-stat-label">Rating</span>
          </div>
          <div className="glass-card db-stat-card">
            <span className="db-stat-icon">⏱</span>
            <span className="db-stat-value">{todayStats.hours}h</span>
            <span className="db-stat-label">Online Hours</span>
          </div>
        </div>
      </div>

      {/* ── Online / Offline toggle ── */}
      <div className="glass-card db-toggle-card">
        <div className="db-toggle-text">
          <h3>{status === 'online' ? 'You are Online' : 'Go Online to Earn'}</h3>
          <p>
            {status === 'online'
              ? `${rideRequests.length} ride request${rideRequests.length !== 1 ? 's' : ''} nearby`
              : "You'll start receiving nearby ride requests instantly."}
          </p>
        </div>
        <button
          className={`db-toggle-btn ${status === 'online' ? 'db-toggle-btn--off' : 'db-toggle-btn--on'}`}
          onClick={handleToggleStatus}
          disabled={loading}
        >
          {loading ? (
            <span className="db-spinner" />
          ) : status === 'online' ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* ── Main content: Map + Sidebar ── */}
      <div className="db-main">

        {/* ── Map ── */}
        <div className="db-map-wrapper">
          <div className="db-map-badge">
            {status === 'online' ? '🟢 Live' : '⚫ Offline'}
          </div>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Fit map to accepted ride */}
            {boundsForAccepted && <FitBounds points={boundsForAccepted} />}

            {/* Fit map to show all ride requests */}
            {!acceptedRide && boundsForRequests && status === 'online' && (
              <FitBounds points={boundsForRequests} />
            )}

            {/* Recenter when offline / no rides */}
            {status === 'offline' && <MapRecenter center={driverPos} />}

            {/* Driver's own location */}
            <Marker position={driverPos} icon={driverIcon}>
              <Popup>
                <div className="db-lf-popup">
                  <strong>📍 Your location</strong>
                  <p>{status === 'online' ? 'Online — accepting rides' : 'Offline'}</p>
                </div>
              </Popup>
            </Marker>

            {/* Nearby ride request markers (when not on a ride) */}
            {!acceptedRide && rideRequests.map((ride, i) => (
              ride.pickupLocation?.lat ? (
                <Marker
                  key={ride._id || i}
                  position={[ride.pickupLocation.lat, ride.pickupLocation.lng]}
                  icon={rideRequestIcon}
                  eventHandlers={{ click: () => setSelectedRide(ride) }}
                >
                  <Popup>
                    <div className="db-lf-popup">
                      <strong>{ride.rider?.name || 'Rider'}</strong>
                      <p>📍 {ride.pickupLocation.address}</p>
                      <p className="db-lf-fare">₹{ride.fare} · {distToRide(ride)} km away</p>
                      <button
                        className="db-lf-accept-btn"
                        onClick={() => handleAcceptRide(ride)}
                      >
                        Accept Ride
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}

            {/* Accepted ride: pickup + dropoff markers + route line */}
            {acceptedRide && (
              <>
                <Marker
                  position={[acceptedRide.pickupLocation.lat, acceptedRide.pickupLocation.lng]}
                  icon={acceptedPickupIcon}
                >
                  <Popup>
                    <div className="db-lf-popup">
                      <strong>🔵 Pickup</strong>
                      <p>{acceptedRide.pickupLocation.address}</p>
                    </div>
                  </Popup>
                </Marker>

                <Marker
                  position={[acceptedRide.dropoffLocation.lat, acceptedRide.dropoffLocation.lng]}
                  icon={acceptedDropoffIcon}
                >
                  <Popup>
                    <div className="db-lf-popup">
                      <strong>🏁 Dropoff</strong>
                      <p>{acceptedRide.dropoffLocation.address}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Driver → Pickup line */}
                <Polyline
                  positions={[
                    driverPos,
                    [acceptedRide.pickupLocation.lat, acceptedRide.pickupLocation.lng],
                  ]}
                  color="#276ef1"
                  weight={4}
                  dashArray="8 6"
                  opacity={0.8}
                />

                {/* Pickup → Dropoff line */}
                <Polyline
                  positions={[
                    [acceptedRide.pickupLocation.lat, acceptedRide.pickupLocation.lng],
                    [acceptedRide.dropoffLocation.lat, acceptedRide.dropoffLocation.lng],
                  ]}
                  color="#00a854"
                  weight={4}
                  opacity={0.7}
                />
              </>
            )}
          </MapContainer>
        </div>

        {/* ── Sidebar: ride request cards ── */}
        <div className="db-sidebar">
          {acceptedRide ? (
            /* Active ride panel */
            <div className="db-active-ride glass-card">
              <div className="db-active-ride-header">
                <div className="db-active-badge">Active Ride</div>
                <span className="db-active-fare">₹{acceptedRide.fare}</span>
              </div>

              <div className="db-active-rider">
                <div className="db-rider-avatar">
                  {(acceptedRide.rider?.name || 'R')[0].toUpperCase()}
                </div>
                <div>
                  <p className="db-rider-name">{acceptedRide.rider?.name || 'Rider'}</p>
                  <p className="db-rider-sub">Your passenger</p>
                </div>
              </div>

              <div className="db-route-block">
                <div className="db-route-item">
                  <span className="db-route-dot db-route-dot--pickup" />
                  <div>
                    <p className="db-route-label">PICKUP</p>
                    <p className="db-route-addr">{acceptedRide.pickupLocation.address}</p>
                  </div>
                </div>
                <div className="db-route-line" />
                <div className="db-route-item">
                  <span className="db-route-dot db-route-dot--dropoff" />
                  <div>
                    <p className="db-route-label">DROPOFF</p>
                    <p className="db-route-addr">{acceptedRide.dropoffLocation.address}</p>
                  </div>
                </div>
              </div>

              <div className="db-active-meta">
                <div className="db-meta-item">
                  <span>Distance</span>
                  <strong>{acceptedRide.distance || '—'}</strong>
                </div>
                <div className="db-meta-divider" />
                <div className="db-meta-item">
                  <span>Fare</span>
                  <strong>₹{acceptedRide.fare}</strong>
                </div>
              </div>

              <button className="db-complete-btn" onClick={handleCompleteRide}>
                🏁 Complete Ride
              </button>
            </div>

          ) : (
            /* Ride request list */
            <>
              <div className="db-sidebar-header">
                <h3>Nearby Requests</h3>
                {rideRequests.length > 0 && (
                  <span className="db-count-badge">{rideRequests.length}</span>
                )}
              </div>

              {status === 'offline' ? (
                <div className="db-empty">
                  <div className="db-empty-icon">⚫</div>
                  <p>You're offline</p>
                  <span>Go online to see ride requests</span>
                </div>
              ) : rideRequests.length === 0 ? (
                <div className="db-empty">
                  <div className="db-empty-icon db-empty-icon--spin">🔍</div>
                  <p>Searching for rides…</p>
                  <span>Requests will appear here</span>
                </div>
              ) : (
                <div className="db-requests-list">
                  {rideRequests.map((ride, i) => (
                    <div
                      key={ride._id || i}
                      className={`db-request-card glass-card${selectedRide?._id === ride._id ? ' db-request-card--selected' : ''}`}
                      onClick={() => setSelectedRide(ride)}
                    >
                      <div className="db-rc-top">
                        <div className="db-rc-rider">
                          <div className="db-rc-avatar">
                            {(ride.rider?.name || 'R')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="db-rc-name">{ride.rider?.name || 'Rider'}</p>
                            <p className="db-rc-meta">{etaToRide(ride)} min · {distToRide(ride)} km</p>
                          </div>
                        </div>
                        <div className="db-rc-fare">₹{ride.fare}</div>
                      </div>

                      <div className="db-rc-route">
                        <div className="db-rc-loc">
                          <span className="db-rc-dot db-rc-dot--pickup" />
                          <span>{ride.pickupLocation?.address || '—'}</span>
                        </div>
                        <div className="db-rc-loc">
                          <span className="db-rc-dot db-rc-dot--dropoff" />
                          <span>{ride.dropoffLocation?.address || '—'}</span>
                        </div>
                      </div>

                      <div className="db-rc-actions">
                        <button
                          className="db-rc-btn db-rc-btn--decline"
                          onClick={(e) => { e.stopPropagation(); setSelectedRide(null); }}
                        >
                          Decline
                        </button>
                        <button
                          className="db-rc-btn db-rc-btn--accept"
                          onClick={(e) => { e.stopPropagation(); handleAcceptRide(ride); }}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Ride detail bottom sheet ── */}
      {selectedRide && (
        <div className="db-overlay" onClick={() => setSelectedRide(null)}>
          <div className="db-sheet" onClick={e => e.stopPropagation()}>
            <div className="db-sheet-handle" />

            <div className="db-sheet-header">
              <div>
                <h3>New Ride Request</h3>
                <p>Rider: <strong>{selectedRide.rider?.name || 'Customer'}</strong></p>
              </div>
              <button className="db-sheet-close" onClick={() => setSelectedRide(null)}>✕</button>
            </div>

            <div className="db-sheet-grid">
              <div className="db-sheet-item">
                <label>Fare</label>
                <strong>₹{selectedRide.fare}</strong>
              </div>
              <div className="db-sheet-item">
                <label>Distance</label>
                <strong>{distToRide(selectedRide)} km away</strong>
              </div>
              <div className="db-sheet-item">
                <label>ETA to pickup</label>
                <strong>{etaToRide(selectedRide)} min</strong>
              </div>
              <div className="db-sheet-item">
                <label>Payment</label>
                <strong>Cash / Online</strong>
              </div>
            </div>

            <div className="db-sheet-route">
              <div className="db-route-item">
                <span className="db-route-dot db-route-dot--pickup" />
                <div>
                  <p className="db-route-label">PICKUP</p>
                  <p className="db-route-addr">{selectedRide.pickupLocation?.address}</p>
                </div>
              </div>
              <div className="db-route-line" />
              <div className="db-route-item">
                <span className="db-route-dot db-route-dot--dropoff" />
                <div>
                  <p className="db-route-label">DROPOFF</p>
                  <p className="db-route-addr">{selectedRide.dropoffLocation?.address}</p>
                </div>
              </div>
            </div>

            <div className="db-sheet-actions">
              <button className="db-sheet-decline" onClick={handleDeclineRide}>Decline</button>
              <button className="db-sheet-accept" onClick={() => handleAcceptRide(selectedRide)}>
                Accept Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
