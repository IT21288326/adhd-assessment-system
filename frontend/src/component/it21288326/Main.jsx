// components/Hero.jsx
import React from 'react';

import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWork';
import Testimonials from './Testimonials';
import Footer from './Footer';
import Header from './Header';

function Main() {
    
  return (<>
    <Header />
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </main>
    <Footer />
    </>
  );
}

export default Main;