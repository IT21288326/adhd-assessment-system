import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Take the Assessment",
      description: "Complete our comprehensive AI-driven screening tools."
    },
    {
      number: 2,
      title: "Get AI Analysis",
      description: "Receive detailed insights about ADHD patterns and behaviors."
    },
    {
      number: 3,
      title: "Get Personalized Plan",
      description: "Access tailored intervention strategies and activities."
    },
    {
      number: 4,
      title: "Track Progress",
      description: "Monitor improvements and adjust interventions over time."
    }
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-title">
          <h3>How It Works</h3>
          <p>Four simple steps to better ADHD management</p>
        </div>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step" key={index}>
              <div className="step-number">{step.number}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
