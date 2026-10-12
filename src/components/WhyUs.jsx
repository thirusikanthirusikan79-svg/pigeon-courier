import React from 'react';
import { Zap, ShieldCheck, MapPin, Clock } from 'lucide-react';

export default function WhyUs() {
  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Intra-Jaffna deliveries completed in under 2 hours. Same-day service across all Northern Province districts." },
    { icon: ShieldCheck, title: "Secure Handling", desc: "Every parcel is handled with professional care. Fragile item specialists and proof-of-delivery on every shipment." },
    { icon: MapPin, title: "Live WhatsApp Support", desc: "Real-time updates and instant support via WhatsApp. Reach our team any time — no automated bots." },
    { icon: Clock, title: "Transparent LKR Pricing", desc: "Clear, upfront rates in Sri Lankan Rupees. No hidden charges, no surprises — what you see is what you pay." }
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">WHY CHOOSE PIGEON</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">Built for Northern Province Businesses</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl mx-auto">We understand the unique logistics challenges of the North. From Jaffna's busy markets to Mannar's coastal routes — we've got you covered.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm hover:border-orange-500/50 transition duration-300">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-4">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-around text-center gap-6 shadow-2xl">
        <div>
          <div className="text-3xl font-black text-orange-400">500+</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Businesses Served Across the North</div>
        </div>
        <div>
          <div className="text-3xl font-black text-orange-400">98%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">On-Time Delivery Rate</div>
        </div>
        <div>
          <div className="text-3xl font-black text-orange-400">10 min</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Average Agent Response Time</div>
        </div>
      </div>
    </div>
  );
}
