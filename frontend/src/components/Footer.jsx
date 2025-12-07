import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content container">
                <div className="footer-section">
                    <h3 className="footer-logo">BK</h3>
                    <p className="footer-tagline">Elegance Redefined</p>
                    <p className="footer-description">
                        Premium fashion for the modern woman. Discover timeless elegance.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/login">Account</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Customer Service</h4>
                    <ul className="footer-links">
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><a href="#">Shipping Info</a></li>
                        <li><a href="#">Returns</a></li>
                        <li><a href="#">Size Guide</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="social-links">
                        <a href="#" className="social-icon">📘</a>
                        <a href="#" className="social-icon">📷</a>
                        <a href="#" className="social-icon">🐦</a>
                        <a href="#" className="social-icon">📌</a>
                    </div>
                    <p className="contact-info">
                        📧 info@bkshop.com<br />
                        📞 +1 (555) 123-4567
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 BK Shop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
