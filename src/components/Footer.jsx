import React from 'react';
import { Package } from 'lucide-react';

const Footer = ({ setActivePage }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (pageId) => {
    if (setActivePage) {
      setActivePage(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Logo & Tagline */}
          <div className="space-y-4">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 cursor-pointer group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-slate-950">
                <Package className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white">
                Pige<span className="text-orange-500">·</span>n
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Northern Province's trusted courier partner. Fast, safe, and transparent — every delivery, every time.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-orange-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('why-us')} className="hover:text-orange-400 transition-colors">
                  Why Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-orange-400 transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('price-calculator')} className="hover:text-orange-400 transition-colors">
                  Price Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-orange-400 transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Our Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-orange-400 transition-colors">
                  Express Intra-District
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-orange-400 transition-colors">
                  Northern Inter-District
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-orange-400 transition-colors">
                  Secure Document Shipping
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-orange-400 transition-colors">
                  Bulk Cargo & Agricultural
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Contact & Hours</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">Emergency Helpline:</p>
              <p className="text-orange-400 font-bold">+94 (21) 744-3660</p>
              
              <p className="text-slate-300 font-medium pt-2">WhatsApp:</p>
              <p className="text-slate-200 font-bold">+94 777 443 660</p>
              
              <p className="text-slate-300 font-medium pt-2">Working Hours:</p>
              <p className="text-slate-400">Mon–Sat: 7:00 AM – 9:00 PM</p>
              <p className="text-slate-400">Sun: 8:00 AM – 5:00 PM</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© {currentYear} Pigeon Courier Service. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Northern Province, Sri Lanka 🇱🇰</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
