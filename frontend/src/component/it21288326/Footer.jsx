import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img 
              src="/assets/it21288326/pulsemindlogo.jpg" 
              alt="Logo"
              style={{
                height: "40px",
                width: "auto"
              }}/>
            <h2>FocusForward</h2>
            <p>Empowering children with ADHD and their caregivers across Sri Lanka</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/assessment">Assessment</a></li>
                <li><a href="/intervention">Intervention</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Resources</h4>
              <ul>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/resources">ADHD Resources</a></li>
                <li><a href="/research">Research</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FocusForward. All rights reserved.</p>
          <div className="social-links">
            <a href="https://facebook.com" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;