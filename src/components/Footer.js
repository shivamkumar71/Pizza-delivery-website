import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content container">
      <div className="footer-brand">
        <h2 className="footer-title">🍕 Anshu Pizza Corner</h2>
        <p className="footer-tagline">Deliciousness delivered, every time!</p>
      </div>
      <div className="footer-contact">
        <h3>Contact Us</h3>
        <p>Head Office:</p>
        <address>
          Vill &amp; Post Pipli Nayak,<br />
          Distt Rampur, UP 244925,
          India <br />
          Phone: +91 7302165503<br />
          Email : deepkumar14379@gmail.com
          
        </address>
      </div>
    </div>
    <div className="footer-bottom">
      <span>&copy; {new Date().getFullYear()} Anshu Pizza Corner. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
