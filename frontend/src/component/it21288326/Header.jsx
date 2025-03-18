// components/Header.jsx
import React, { useState } from 'react';
import './Header.css';
import logo from './../../logo.svg'; // You'll need a logo SVG

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo">
            <img src={logo} alt="FocusForward Logo" />
            <h1>PULSE Mind</h1>
          </a>
          
          <button className="mobile-nav-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          <nav className={mobileMenuOpen ? 'active' : ''}>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/assessment">Assessment</a></li>
              <li><a href="/intervention">Intervention</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;