import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="ugo-footer">
      <div className="footer-container">
        <div className="footer-top">
          <h2>Ugo</h2>
          <p>Visit Help Center</p>
        </div>
        
        <div className="footer-links-grid">
          <div className="footer-col">
            <h3>Company</h3>
            <Link to="#">About us</Link>
            <Link to="#">Our offerings</Link>
            <Link to="#">Newsroom</Link>
            <Link to="#">Investors</Link>
            <Link to="#">Blog</Link>
            <Link to="#">Careers</Link>
          </div>
          
          <div className="footer-col">
            <h3>Products</h3>
            <Link to="#">Ride</Link>
            <Link to="#">Drive</Link>
            <Link to="#">Deliver</Link>
            <Link to="#">Eat</Link>
            <Link to="#">Ugo for Business</Link>
            <Link to="#">Ugo Freight</Link>
          </div>
          
          <div className="footer-col">
            <h3>Global citizenship</h3>
            <Link to="#">Safety</Link>
            <Link to="#">Diversity and Inclusion</Link>
            <Link to="#">Sustainability</Link>
          </div>
          
          <div className="footer-col">
            <h3>Travel</h3>
            <Link to="#">Reserve</Link>
            <Link to="#">Airports</Link>
            <Link to="#">Cities</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="social-links">
             {/* Icons would go here */}
             <span>Facebook</span>
             <span>Twitter</span>
             <span>YouTube</span>
             <span>LinkedIn</span>
             <span>Instagram</span>
          </div>
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Ugo Technologies Inc.</p>
            <div className="legal-links">
              <Link to="#">Privacy</Link>
              <Link to="#">Accessibility</Link>
              <Link to="#">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
