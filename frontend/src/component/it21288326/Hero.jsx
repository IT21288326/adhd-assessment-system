// components/Hero.jsx
import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h2>Empowering ADHD Screening and Support for Sri Lankan Children</h2>
        <p>AI-driven ADHD assessment and intervention tailored for children aged 5-15</p>
        <a href="/assessment" className="btn cta-button">Take Assessment</a>
      </div>
    </section>
  );
}

export default Hero;