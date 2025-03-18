// components/Features.jsx
import React from 'react';
import './Features.css';

function Features() {
  const features = [
    {
      icon: "🧠",
      title: "AI-Driven ADHD Screening",
      description: "Comprehensive assessment integrating VADPRS and interactive tools to identify ADHD symptoms accurately."
    },
    {
      icon: "⭐",
      title: "Reaction Time Game",
      description: "Engaging 'falling star' game designed to detect ADHD subtypes through interaction patterns."
    },
    {
      icon: "📝",
      title: "Personalized Interventions",
      description: "Structured timetables, focus-building exercises, and impulse-control activities tailored to each child."
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Parent & Teacher Insights",
      description: "Detailed reporting and practical guidance to help caregivers support children with ADHD."
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-title">
          <h3>Key Features</h3>
          <p>Our comprehensive toolkit supports every aspect of ADHD management</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
