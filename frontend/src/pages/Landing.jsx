import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Navigation, Smartphone, CreditCard, ShieldCheck, X } from 'lucide-react';
import './Landing.css';

const rideOptions = [
  { id: 'ride', title: 'Ride', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=400', desc: 'Go anywhere with Ugo. Affordable and reliable everyday rides.' },
  { id: 'auto', title: 'Auto', image: '/auto.png', desc: 'Quick rides, at the best auto prices.' },
  { id: 'bike', title: 'Bike', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400', desc: 'Beat the traffic with quick and affordable bike rides.' },
  { id: 'intercity', title: 'Intercity', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400', desc: 'Travel outstation comfortably with top-rated drivers.' },
  { id: 'parcel', title: 'Parcel', image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=400', desc: 'Send and receive packages instantly across the city.' },
  { id: 'rentals', title: 'Rentals', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=400', desc: 'Rent a car with a driver for multiple stops.' },
  { id: 'reserve', title: 'Reserve', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400', desc: 'Book your ride up to 90 days in advance.' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  // Modal State
  const [modalPickup, setModalPickup] = useState('');
  const [modalDropoff, setModalDropoff] = useState('');
  const [modalVehicle, setModalVehicle] = useState('');
  const [modalVehicleNo, setModalVehicleNo] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/ride', { state: { pickup, dropoff } });
  };

  const handleModalSearch = (e) => {
    e.preventDefault();
    // Pass everything needed to the ride page
    navigate('/ride', { state: { pickup: modalPickup, dropoff: modalDropoff, vehicle: modalVehicle, vehicleNo: modalVehicleNo, type: selectedOption?.id } });
  };

  const openDetails = (option) => {
    setSelectedOption(option);
    setModalPickup(pickup);
    setModalDropoff(dropoff);
    setModalVehicle(option.title);
    setModalVehicleNo('');
  };

  return (
    <div className="landing-page animate-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="booking-widget">
            <h1>Go anywhere with Ugo</h1>
            <p>Request a ride, hop in, and go.</p>
            <form onSubmit={handleSearch}>
              <div className="input-wrap">
                <span className="dot" />
                <input 
                  type="text" 
                  placeholder="Enter pickup location" 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)} 
                  required
                />
                <button type="button" className="locate-btn"><Navigation size={16} /></button>
              </div>
              <div className="input-wrap">
                <span className="square" />
                <input 
                  type="text" 
                  placeholder="Enter destination" 
                  value={dropoff} 
                  onChange={(e) => setDropoff(e.target.value)} 
                  required
                />
              </div>
              <button type="submit" className="btn-primary full-width">See prices</button>
            </form>
          </div>
        </div>
        <div className="hero-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1200')" }}></div>
      </section>

      {/* Ways to Ride Section */}
      <section className="ways-to-ride">
        <div className="container">
          <h2>Ways to ride</h2>
          <div className="grid-3">
            {rideOptions.map((option) => (
              <div className="card" key={option.id}>
                <img src={option.image} alt={option.title} />
                <div className="card-content">
                  <h3>{option.title}</h3>
                  <p>{option.desc}</p>
                  <button className="view-details-btn" onClick={() => openDetails(option)}>
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use the app */}
      <section className="how-to-use">
        <div className="container">
          <h2>How to use the Ugo app</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon"><Smartphone size={32} /></div>
              <div className="step-text">
                <h3>1. Open the app</h3>
                <p>Open the app and enter your destination in the "Where to?" box.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon"><Car size={32} /></div>
              <div className="step-text">
                <h3>2. Request a ride</h3>
                <p>Choose the ride option that best suits your needs and confirm your pickup.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon"><CreditCard size={32} /></div>
              <div className="step-text">
                <h3>3. Hop in and go</h3>
                <p>Meet your driver and enjoy the ride. Payment is seamless and cash-free.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon"><ShieldCheck size={32} /></div>
              <div className="step-text">
                <h3>4. Arrive safely</h3>
                <p>Rate your driver and help keep the Ugo community safe and reliable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Info */}
      <section className="more-info">
        <div className="container split">
          <div className="text-content">
            <h2>Your safety matters</h2>
            <p>Peace of mind is designed into your experience. Safety features are built into the app to protect you during every ride.</p>
            <button className="btn-secondary" onClick={() => navigate('/about')}>Learn more about safety</button>
          </div>
          <div className="image-content" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533558701576-23c65e0272fb?auto=format&fit=crop&q=80&w=600')" }}></div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedOption && (
        <div className="modal-overlay" onClick={() => setSelectedOption(null)}>
          <div className="modal-content animate-in" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedOption(null)}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <img src={selectedOption.image} alt={selectedOption.title} className="modal-img" />
              <h3>Book {selectedOption.title}</h3>
            </div>
            <form onSubmit={handleModalSearch} className="modal-form">
              <div className="input-group">
                <label>Pickup Location</label>
                <input 
                  type="text" 
                  value={modalPickup} 
                  onChange={(e) => setModalPickup(e.target.value)} 
                  placeholder="Enter pickup" 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Destination</label>
                <input 
                  type="text" 
                  value={modalDropoff} 
                  onChange={(e) => setModalDropoff(e.target.value)} 
                  placeholder="Enter destination" 
                  required 
                />
              </div>
              <div className="input-group half-width">
                <label>Vehicle Type</label>
                <input 
                  type="text" 
                  value={modalVehicle} 
                  onChange={(e) => setModalVehicle(e.target.value)} 
                  placeholder="E.g., Sedan" 
                />
              </div>
              <div className="input-group half-width">
                <label>Vehicle No (Optional)</label>
                <input 
                  type="text" 
                  value={modalVehicleNo} 
                  onChange={(e) => setModalVehicleNo(e.target.value)} 
                  placeholder="E.g., RJ14 XX 1234" 
                />
              </div>
              <div style={{ clear: 'both' }}></div>
              <button type="submit" className="btn-primary full-width modal-submit">
                See prices
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
