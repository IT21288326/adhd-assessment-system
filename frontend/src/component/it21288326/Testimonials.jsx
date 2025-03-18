import React from 'react';
import './Testimonials.css';

function Testimonials() {
  const testimonials = [
    {
      content: "The personalized intervention plan has made a tremendous difference for my son. His focus has improved and our home life is much calmer.",
      name: "Priya M.",
      role: "Parent"
    },
    {
      content: "As a teacher, I've seen remarkable improvements in students using this platform. The insights help me adjust my teaching approach effectively.",
      name: "Rajith K.",
      role: "Primary School Teacher"
    },
    {
      content: "This culturally-sensitive approach to ADHD assessment fills a critical gap in Sri Lankan healthcare resources.",
      name: "Dr. Kumari W.",
      role: "Child Psychologist"
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-title">
          <h3>Success Stories</h3>
          <p>Hear from parents, teachers and professionals</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                "{testimonial.content}"
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;