import React, { useEffect, useState } from 'react';
import './ContactSales.css';

const ContactSales = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    companyName: '',
    employeeCount: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for actual form submission logic
    alert("Thank you for your interest! Our sales team will contact you shortly.");
    setFormData({
      firstName: '',
      lastName: '',
      workEmail: '',
      companyName: '',
      employeeCount: '',
      message: ''
    });
  };

  return (
    <div className="contact-sales-page">
      <div className="contact-container">
        
        {/* Left Side: Info */}
        <div className="contact-info-panel">
          <h1>Talk to our sales team</h1>
          <p>
            Tell us a little about your business, and we'll connect you with the right Ugo for Business expert to help you reach your goals.
          </p>
          
          <div className="contact-features">
            <div className="contact-feature">
              <div className="feature-icon">📈</div>
              <div>
                <h3>Scale globally</h3>
                <p>Access the largest mobility network in the world, operating in over 10,000 cities.</p>
              </div>
            </div>
            <div className="contact-feature">
              <div className="feature-icon">🛡️</div>
              <div>
                <h3>Premium support</h3>
                <p>Receive dedicated account management and 24/7 priority enterprise support.</p>
              </div>
            </div>
            <div className="contact-feature">
              <div className="feature-icon">💼</div>
              <div>
                <h3>Custom solutions</h3>
                <p>Integrate our API directly into your workflows or customize reporting to your precise needs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-panel">
          <h2>Get in touch</h2>
          <form className="sales-form" onSubmit={handleSubmit}>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="workEmail">Work email</label>
              <input 
                type="email" 
                id="workEmail" 
                name="workEmail" 
                value={formData.workEmail} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName">Company name</label>
              <input 
                type="text" 
                id="companyName" 
                name="companyName" 
                value={formData.companyName} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="employeeCount">Number of employees</label>
              <select 
                id="employeeCount" 
                name="employeeCount" 
                value={formData.employeeCount} 
                onChange={handleChange} 
                required
              >
                <option value="" disabled>Select an option</option>
                <option value="1-50">1 - 50</option>
                <option value="51-200">51 - 200</option>
                <option value="201-1000">201 - 1,000</option>
                <option value="1000+">1,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">How can our team help you?</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Tell us about your company's transportation needs..."
                required 
              ></textarea>
            </div>

            <button type="submit" className="form-submit-btn">Submit Request</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactSales;
