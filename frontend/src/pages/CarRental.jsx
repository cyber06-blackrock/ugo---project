import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarRental.css';

const CarRental = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Owner Information
    ownerName: '',
    email: '',
    phone: '',
    
    // Vehicle Information
    carBrand: '',
    carModel: '',
    year: '',
    registrationNumber: '',
    color: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: '4',
    
    // Vehicle Condition
    mileage: '',
    condition: 'Excellent',
    lastServiceDate: '',
    insuranceExpiry: '',
    
    // Rental Details
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    minimumRentalDays: '1',
    availability: 'Immediately',
    
    // Features & Amenities
    features: {
      ac: false,
      bluetooth: false,
      gps: false,
      musicSystem: false,
      sunroof: false,
      reverseCamera: false,
      parkingSensors: false,
      abs: false,
      airbags: false,
    },
    
    // Additional Information
    location: '',
    additionalNotes: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.startsWith('feature-')) {
        const featureName = name.replace('feature-', '');
        setFormData({
          ...formData,
          features: { ...formData.features, [featureName]: checked }
        });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    console.log('Car Rental Form Submitted:', formData);
    alert(`Thank you for listing your ${formData.carBrand} ${formData.carModel}!\n\nOur team will review your submission and contact you within 24-48 hours at ${formData.email}.`);
    
    // Optionally navigate to success page or reset form
    // navigate('/rental-success');
  };

  return (
    <div className="car-rental-page">
      {/* Hero Section */}
      <section className="car-rental-hero">
        <div className="car-rental-hero-content">
          <h1>List Your Car and Earn Money</h1>
          <p>
            Turn your idle car into a source of income. Join thousands of car owners in Jaipur 
            earning extra money by renting out their vehicles through Ugo.
          </p>
          <div className="car-rental-stats">
            <div className="stat-item">
              <span className="stat-number">₹25,000+</span>
              <span className="stat-label">Average monthly earnings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Cars listed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="car-rental-form-section">
        <div className="car-rental-container">
          <div className="form-intro">
            <h2>List Your Vehicle</h2>
            <p>Fill out the form below to start earning. All information is secure and confidential.</p>
          </div>

          <form className="car-rental-form" onSubmit={handleSubmit}>
            
            {/* Owner Information */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">👤</span>
                Owner Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="ownerName">Full Name *</label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    pattern="[0-9+\s-]+"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Car Location (City/Area) *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Malviya Nagar, Jaipur"
                    list="jaipur-areas"
                    required
                  />
                  <datalist id="jaipur-areas">
                    <option value="Malviya Nagar, Jaipur" />
                    <option value="Vaishali Nagar, Jaipur" />
                    <option value="C-Scheme, Jaipur" />
                    <option value="Mansarovar, Jaipur" />
                    <option value="Raja Park, Jaipur" />
                    <option value="Jagatpura, Jaipur" />
                    <option value="Sodala, Jaipur" />
                  </datalist>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🚗</span>
                Vehicle Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="carBrand">Brand/Manufacturer *</label>
                  <input
                    type="text"
                    id="carBrand"
                    name="carBrand"
                    value={formData.carBrand}
                    onChange={handleChange}
                    placeholder="e.g., Maruti Suzuki, Hyundai"
                    list="car-brands"
                    required
                  />
                  <datalist id="car-brands">
                    <option value="Maruti Suzuki" />
                    <option value="Hyundai" />
                    <option value="Tata" />
                    <option value="Honda" />
                    <option value="Mahindra" />
                    <option value="Toyota" />
                    <option value="Kia" />
                    <option value="Volkswagen" />
                  </datalist>
                </div>
                <div className="form-group">
                  <label htmlFor="carModel">Model *</label>
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    placeholder="e.g., Swift, i20, Nexon"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="year">Year of Manufacture *</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2020"
                    min="2000"
                    max="2026"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="registrationNumber">Registration Number *</label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="RJ-14-XX-1234"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., White, Black, Silver"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fuelType">Fuel Type *</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="transmission">Transmission *</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    required
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="seatingCapacity">Seating Capacity *</label>
                  <select
                    id="seatingCapacity"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    required
                  >
                    <option value="2">2 Seater</option>
                    <option value="4">4 Seater</option>
                    <option value="5">5 Seater</option>
                    <option value="6">6 Seater</option>
                    <option value="7">7 Seater</option>
                    <option value="8">8+ Seater</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle Condition */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🔧</span>
                Vehicle Condition & Maintenance
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="mileage">Mileage (km/l or km/charge)</label>
                  <input
                    type="text"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g., 18 km/l"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="condition">Overall Condition *</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="Excellent">Excellent (Like New)</option>
                    <option value="Good">Good (Well Maintained)</option>
                    <option value="Fair">Fair (Minor Issues)</option>
                    <option value="Poor">Poor (Needs Repair)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="lastServiceDate">Last Service Date</label>
                  <input
                    type="date"
                    id="lastServiceDate"
                    name="lastServiceDate"
                    value={formData.lastServiceDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="insuranceExpiry">Insurance Expiry Date *</label>
                  <input
                    type="date"
                    id="insuranceExpiry"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">✨</span>
                Features & Amenities
              </h3>
              <p className="section-subtitle">Select all features available in your car</p>
              <div className="features-grid">
                {Object.keys(formData.features).map(feature => (
                  <label key={feature} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={`feature-${feature}`}
                      checked={formData.features[feature]}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">
                      {feature === 'ac' && '❄️ Air Conditioning'}
                      {feature === 'bluetooth' && '📱 Bluetooth'}
                      {feature === 'gps' && '🗺️ GPS Navigation'}
                      {feature === 'musicSystem' && '🎵 Music System'}
                      {feature === 'sunroof' && '☀️ Sunroof'}
                      {feature === 'reverseCamera' && '📹 Reverse Camera'}
                      {feature === 'parkingSensors' && '🅿️ Parking Sensors'}
                      {feature === 'abs' && '🛡️ ABS Brakes'}
                      {feature === 'airbags' && '💨 Airbags'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rental Details */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">💰</span>
                Rental Pricing
              </h3>
              <p className="section-subtitle">Set your desired rental rates (we'll help optimize pricing)</p>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="dailyRate">Daily Rate (₹) *</label>
                  <input
                    type="number"
                    id="dailyRate"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    placeholder="1500"
                    min="500"
                    required
                  />
                  <small className="input-hint">Recommended: ₹1200-₹2500/day</small>
                </div>
                <div className="form-group">
                  <label htmlFor="weeklyRate">Weekly Rate (₹)</label>
                  <input
                    type="number"
                    id="weeklyRate"
                    name="weeklyRate"
                    value={formData.weeklyRate}
                    onChange={handleChange}
                    placeholder="9000"
                    min="3000"
                  />
                  <small className="input-hint">Optional: Discounted weekly rate</small>
                </div>
                <div className="form-group">
                  <label htmlFor="monthlyRate">Monthly Rate (₹)</label>
                  <input
                    type="number"
                    id="monthlyRate"
                    name="monthlyRate"
                    value={formData.monthlyRate}
                    onChange={handleChange}
                    placeholder="25000"
                    min="10000"
                  />
                  <small className="input-hint">Optional: Discounted monthly rate</small>
                </div>
                <div className="form-group">
                  <label htmlFor="minimumRentalDays">Minimum Rental Period (Days) *</label>
                  <select
                    id="minimumRentalDays"
                    name="minimumRentalDays"
                    value={formData.minimumRentalDays}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="7">1 Week</option>
                    <option value="14">2 Weeks</option>
                    <option value="30">1 Month</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="availability">Availability *</label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                  >
                    <option value="Immediately">Available Immediately</option>
                    <option value="Within a week">Within a Week</option>
                    <option value="Within 2 weeks">Within 2 Weeks</option>
                    <option value="Custom">Custom Schedule</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">📝</span>
                Additional Information
              </h3>
              <div className="form-group full-width">
                <label htmlFor="additionalNotes">Special Notes or Requirements</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any additional details about your car, restrictions, or requirements..."
                  rows="5"
                />
                <small className="input-hint">Optional: Mention any special conditions, delivery availability, etc.</small>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="form-section">
              <label className="checkbox-label terms-checkbox">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <span className="checkbox-text">
                  I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and confirm that all information provided is accurate. I understand that Ugo will verify vehicle documents before final approval.
                </span>
              </label>

              <button type="submit" className="car-rental-submit-btn">
                Submit Listing
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="car-rental-benefits">
        <h2>Why Rent Your Car with Ugo?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">💵</div>
            <h3>Earn Extra Income</h3>
            <p>Make money from your car when you're not using it. Average owners earn ₹15,000-₹30,000 per month.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <h3>Full Insurance Coverage</h3>
            <p>Every rental includes comprehensive insurance. Your car is protected against damage and theft.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h3>Easy Management</h3>
            <p>Control your car's availability, pricing, and bookings through our intuitive mobile app.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h3>Verified Renters</h3>
            <p>All renters are verified with valid driver's licenses and background checks before approval.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Quick Payments</h3>
            <p>Get paid directly to your bank account within 24 hours after each completed rental.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔧</div>
            <h3>Maintenance Support</h3>
            <p>Access to our network of trusted mechanics and service centers at discounted rates.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="car-rental-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <details className="faq-item">
            <summary>How much can I earn by renting my car?</summary>
            <p>Earnings vary based on your car model, condition, and rental frequency. On average, owners in Jaipur earn between ₹15,000 to ₹30,000 per month. Premium vehicles can earn even more.</p>
          </details>
          <details className="faq-item">
            <summary>Is my car insured during rentals?</summary>
            <p>Yes! Every rental through Ugo includes comprehensive insurance coverage. Your vehicle is protected against accidents, theft, and damage throughout the rental period.</p>
          </details>
          <details className="faq-item">
            <summary>Who can rent my car?</summary>
            <p>Only verified users with valid driver's licenses can rent vehicles. We conduct background checks and verify documents before approving any renter.</p>
          </details>
          <details className="faq-item">
            <summary>Can I choose when my car is available?</summary>
            <p>Absolutely! You have full control over your car's availability calendar. Block dates when you need your car or when it's not available for rental.</p>
          </details>
          <details className="faq-item">
            <summary>What if my car gets damaged during a rental?</summary>
            <p>Our insurance covers all damages. The renter is responsible for any damage deductible, and our claims team handles everything to get your car repaired quickly.</p>
          </details>
          <details className="faq-item">
            <summary>How do I receive payments?</summary>
            <p>Payments are transferred directly to your registered bank account within 24 hours after each completed rental. You can track all earnings in the app.</p>
          </details>
        </div>
      </section>

      {/* Final CTA */}
      <section className="car-rental-final-cta">
        <h2>Start Earning from Your Car Today</h2>
        <p>Join thousands of car owners making extra income with Ugo Car Rental</p>
        <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="cta-scroll-btn">
          List Your Car Now
        </button>
      </section>
    </div>
  );
};

export default CarRental;
