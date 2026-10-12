import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import Services from './components/Services';
import PriceCalculator from './components/PriceCalculator';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // எந்த பக்கம் தற்சமயம் ஓபன் ஆகி இருக்கிறது என்பதைக் கட்டுப்படுத்த
  const [activePage, setActivePage] = useState('home');

  // பட்டன் கிளிக் செய்யும் போது அந்தப் பக்கத்தை மட்டும் காட்டுவதற்கான Function
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Hero setActivePage={setActivePage} />;
      case 'why-us':
        return <WhyUs />;
      case 'services':
        return <Services />;
      case 'price-calculator':
        return <PriceCalculator />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <div>
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <main className="transition-all duration-300">
          {renderPage()}
        </main>
      </div>
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default App;
