import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Reserve.css';

const Reserve = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get current IST date and time
  const getISTTime = () => {
    const d = new Date();
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    const istString = d.toLocaleString('en-IN', options);
    const [datePart, timePart] = istString.split(', ');
    const [day, month, year] = datePart.split('/');
    return {
      date: `${year}-${month}-${day}`,
      time: timePart
    };
  };

  const istDefaults = getISTTime();

  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: istDefaults.date,
    time: istDefaults.time,
    rideType: 'UgoX',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Ride reserved!\nPickup: ${formData.pickup}\nDropoff: ${formData.dropoff}\nDate: ${formData.date} at ${formData.time}\nType: ${formData.rideType}`);
  };

  return (
    <div className="reserve-page">
      {/* Hero */}
      <section className="reserve-hero">
        <div className="reserve-hero-content">
          <h1 className="reserve-hero-title">Reserve your ride in advance</h1>
          <p className="reserve-hero-subtitle">
            Plan ahead and lock in your ride up to 90 days early. Whether it's a flight, a meeting, or a special occasion — your car will be ready and waiting.
          </p>
        </div>
        <div className="reserve-hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
            alt="Car driving on highway"
          />
        </div>
      </section>

      {/* Booking Form */}
      <section className="reserve-booking">
        <div className="reserve-booking-container">
          <h2>Schedule your trip</h2>
          <p>Fill in the details below and we'll have a driver ready at your pickup location right on time.</p>

          <form className="reserve-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="pickup">Pickup location</label>
              <input
                type="text"
                id="pickup"
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                placeholder="Enter pickup address"
                list="jaipur-locations"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dropoff">Dropoff location</label>
              <input
                type="text"
                id="dropoff"
                name="dropoff"
                value={formData.dropoff}
                onChange={handleChange}
                placeholder="Enter destination address"
                list="jaipur-locations"
                required
              />
            </div>
            
            <datalist id="jaipur-locations">
               <option value="Hawa Mahal" />
               <option value="Amer Fort" />
               <option value="City Palace" />
               <option value="Albert Hall Museum" />
               <option value="Jantar Mantar" />
               <option value="Patrika Gate" />
               <option value="Jaipur Railway Station" />
               <option value="Jaipur International Airport" />
               <option value="Jal Mahal" />
            </datalist>

            <div className="reserve-form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="rideType">Ride type</label>
              <select
                id="rideType"
                name="rideType"
                value={formData.rideType}
                onChange={handleChange}
              >
                <option value="UgoX">UgoX</option>
                <option value="Comfort">Ugo Comfort</option>
                <option value="Black">Ugo Black</option>
                <option value="XL">UgoXL</option>
                <option value="Green">Ugo Green</option>
              </select>
            </div>

            <button type="submit" className="reserve-submit-btn">Reserve now</button>
          </form>
        </div>
      </section>

      {/* Features Strip */}
      <section className="reserve-features">
        <div className="reserve-features-grid">
          <div className="reserve-feature-card">
            <div className="reserve-feature-icon">🕐</div>
            <h3>Book up to 90 days ahead</h3>
            <p>Plan for upcoming trips with confidence. Lock in your ride weeks in advance and never worry about last-minute availability.</p>
          </div>
          <div className="reserve-feature-card">
            <div className="reserve-feature-icon">💰</div>
            <h3>Transparent pricing</h3>
            <p>See the price upfront when you reserve. No surge surprises, no hidden fees — just a clear, locked-in fare.</p>
          </div>
          <div className="reserve-feature-card">
            <div className="reserve-feature-icon">🚗</div>
            <h3>Driver arrives early</h3>
            <p>Your assigned driver will arrive at the pickup location a few minutes before your scheduled time, ready and waiting.</p>
          </div>
          <div className="reserve-feature-card">
            <div className="reserve-feature-icon">❌</div>
            <h3>Free cancellation</h3>
            <p>Plans change, and that's okay. Cancel your reserved ride up to 60 minutes before pickup at no charge.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="reserve-how">
        <h2>How Ugo Reserve works</h2>
        <div className="reserve-how-steps">
          <div className="reserve-step">
            <div className="reserve-step-num">1</div>
            <h3>Enter your trip details</h3>
            <p>Set your pickup and dropoff locations, then choose the date and time that works best for your schedule.</p>
          </div>
          <div className="reserve-step">
            <div className="reserve-step-num">2</div>
            <h3>Confirm your fare</h3>
            <p>Review the upfront price and select your preferred vehicle type. Then tap Reserve to lock everything in.</p>
          </div>
          <div className="reserve-step">
            <div className="reserve-step-num">3</div>
            <h3>Ride on your schedule</h3>
            <p>On the day of your trip, a driver will be assigned and arrive at your pickup location right on time.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="reserve-final-cta">
        <h2>Never miss a ride again</h2>
        <p>Whether it's an early morning flight or late night event, Ugo Reserve has you covered.</p>
        <Link to="/signup" className="reserve-cta-btn">Create an account to reserve</Link>
      </section>
    </div>
  );
};

export default Reserve;
