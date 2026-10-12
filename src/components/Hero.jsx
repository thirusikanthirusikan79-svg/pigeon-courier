import React from 'react';
import { MessageSquare, ArrowRight, Building2, MapPin, Truck, Anchor, PhoneCall } from 'lucide-react';

const Hero = ({ setActivePage }) => {
  return (
    <div className="relative overflow-hidden py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column - Main Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              NORTHERN PROVINCE'S TRUSTED COURIER
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Next-Gen Courier & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Logistics
            </span> for Modern Businesses
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Blazing-fast deliveries across all five Northern Province districts. Real-time WhatsApp support, secure handling, and transparent LKR pricing — no hidden charges.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {/* 1. Book Pickup via WhatsApp */}
            <a
              href="https://wa.me/94777443660?text=Hello%20Pigeon%20Courier,%20I%20would%20like%20to%20book%20a%20pickup."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5 fill-slate-950" />
              Book Pickup via WhatsApp
            </a>

            {/* 2. Get a Price Estimate */}
            <button
              onClick={() => setActivePage && setActivePage('price-calculator')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-xl border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Get a Price Estimate
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-4 gap-4 max-w-lg">
            <div>
              <p className="text-2xl font-black text-white">5</p>
              <p className="text-[11px] text-slate-400">Districts Covered</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">2hr</p>
              <p className="text-[11px] text-slate-400">Hours Intra-Jaffna</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">500+</p>
              <p className="text-[11px] text-slate-400">Happy Businesses</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">98%</p>
              <p className="text-[11px] text-slate-400">On-Time Rate</p>
            </div>
          </div>
        </div>

        {/* Right Column - Network Status Hub Card */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Northern Network Hub</h3>
              <p className="text-xs text-slate-400">All 5 districts — Active & Operational</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Jaffna</p>
                  <p className="text-[10px] text-slate-400">Same-day intra-district delivery</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Kilinochchi</p>
                  <p className="text-[10px] text-slate-400">Express inter-district routes</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Vavuniya</p>
                  <p className="text-[10px] text-slate-400">Reliable overnight delivery</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Mannar</p>
                  <p className="text-[10px] text-slate-400">Coastal route express</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Mullaitivu</p>
                  <p className="text-[10px] text-slate-400">Remote area specialists</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>

          {/* 3. Emergency Helpline Button */}
          <a
            href="tel:+94217443660"
            className="mt-4 w-full py-3 bg-slate-950 hover:bg-slate-900 border border-white/10 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
            <span>Emergency Helpline: <strong className="text-orange-400">+94 (21) 744-3660</strong></span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default Hero;
