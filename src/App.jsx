import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import Services from './components/Services';
import PriceCalculator from './components/PriceCalculator';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <WhyUs />
            <Services />
            <PriceCalculator />
          </>
        )}
        {activeTab === 'why-us' && <WhyUs />}
        {activeTab === 'services' && <Services />}
        {activeTab === 'calculator' && <PriceCalculator />}
        {activeTab === 'contact' && <Contact />}
      </main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
