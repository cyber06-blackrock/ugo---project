import React from 'react';
import { Star, Clock, MapPin, Car } from 'lucide-react';
import './NearbyDrivers.css';

// Vehicle type icons & labels
const vehicleConfig = {
  UgoX:     { icon: '🚗', label: 'UgoX',     desc: 'Affordable rides' },
  UgoXL:    { icon: '🚙', label: 'UgoXL',    desc: 'Extra seats' },
  UgoBlack: { icon: '🖤', label: 'UgoBlack', desc: 'Premium rides' },
  UgoAuto:  { icon: '🛺', label: 'UgoAuto',  desc: 'Auto rickshaw' },
  UgoMoto:  { icon: '🏍️', label: 'UgoMoto',  desc: 'Bike rides' },
};

const NearbyDrivers = ({ drivers, userLocation, onSelectDriver }) => {
  if (!drivers || drivers.length === 0) return null;

  // Show max 8 nearest drivers
  const displayDrivers = drivers.slice(0, 8);

  // Group by vehicle type for the summary strip
  const typeCounts = {};
  drivers.forEach((d) => {
    const type = d.vehicleType || 'UgoX';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  return (
    <div className="nd-container">
      {/* Summary strip */}
      <div className="nd-header">
        <h3 className="nd-title">
          <MapPin size={18} />
          {drivers.length} driver{drivers.length !== 1 ? 's' : ''} nearby
        </h3>
        <div className="nd-type-strip">
          {Object.entries(typeCounts).map(([type, count]) => (
            <span key={type} className="nd-type-badge">
              {vehicleConfig[type]?.icon || '🚗'} {count}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable driver cards */}
      <div className="nd-scroll">
        {displayDrivers.map((driver, index) => {
          const config = vehicleConfig[driver.vehicleType] || vehicleConfig.UgoX;
          const initials = driver.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={driver._id}
              className="nd-card"
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => onSelectDriver && onSelectDriver(driver)}
            >
              {/* Driver avatar */}
              <div className="nd-avatar-wrap">
                {driver.profilePhoto ? (
                  <img
                    src={driver.profilePhoto}
                    alt={driver.name}
                    className="nd-avatar"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="nd-avatar-fallback"
                  style={{ display: driver.profilePhoto ? 'none' : 'flex' }}
                >
                  {initials}
                </div>
                <span className="nd-online-dot" />
              </div>

              {/* Driver info */}
              <div className="nd-info">
                <div className="nd-name-row">
                  <span className="nd-name">{driver.name?.split(' ')[0]}</span>
                  <span className="nd-rating">
                    <Star size={12} fill="#FFB800" color="#FFB800" />
                    {driver.rating?.toFixed(1) || '4.5'}
                  </span>
                </div>

                <div className="nd-vehicle">
                  <span className="nd-vehicle-icon">{config.icon}</span>
                  <span className="nd-vehicle-name">
                    {driver.vehicleName || config.label}
                  </span>
                </div>

                {driver.licensePlate && (
                  <div className="nd-plate">{driver.licensePlate}</div>
                )}
              </div>

              {/* ETA badge */}
              <div className="nd-eta">
                {driver.eta ? (
                  <>
                    <span className="nd-eta-time">{driver.eta}</span>
                    <span className="nd-eta-label">min</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} />
                    <span className="nd-eta-label">Near</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {drivers.length > 8 && (
        <div className="nd-more">
          + {drivers.length - 8} more drivers available
        </div>
      )}
    </div>
  );
};

export default NearbyDrivers;
