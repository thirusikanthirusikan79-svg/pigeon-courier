import React from 'react';
import { Zap, MapPin, Shield, Box } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Zap,
      title: "Express Intra-District",
      subtitle: "Within Jaffna District",
      badge: "Most Popular",
      badgeColor: "bg-orange-500 text-white",
      desc: "Same-day doorstep delivery anywhere within Jaffna district in under 2 hours. Ideal for businesses, pharmacies, and individuals.",
      points: ["Under 2 Hours", "Live WhatsApp Updates", "Proof of Delivery"],
      price: "From LKR 350"
    },
    {
      icon: MapPin,
      title: "Northern Inter-District Routes",
      subtitle: "Kilinochchi · Vavuniya · Mannar · Mullaittivu",
      badge: "Inter-District",
      badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      desc: "Reliable same-day to next-morning delivery linking all five Northern Province districts via our dedicated express network.",
      points: ["Same-Day / Next Morning", "Insured Parcels", "Dedicated Support"],
      price: "From LKR 550"
    },
    {
      icon: Shield,
      title: "Secure Document Shipping",
      subtitle: "Confidential & Legal Documents",
      badge: "Secure",
      badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      desc: "Tamper-proof, confidential handling for legal documents, government filings, bank documents, and academic certificates.",
      points: ["Sealed & Secure", "Signed Acknowledgement", "Photographic Proof"],
      price: "From LKR 350"
    },
    {
      icon: Box,
      title: "Bulk Cargo & Agricultural Freight",
      subtitle: "Large Volume Shipments",
      badge: "Bulk",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      desc: "Cost-effective bulk freight for agricultural produce, wholesale goods, and construction materials across the Northern region.",
      points: ["No Weight Limit", "Agri Specialists", "Custom Pricing"],
      price: "Custom Quote"
    }
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">OUR CORE SERVICES</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">Courier Solutions for Every Need</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">From urgent same-day intra-district runs to bulk cargo across the North — we have the right service for your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <div key={i} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-md hover:border-orange-500/50 transition duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
                  <s.icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${s.badgeColor}`}>{s.badge}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
              <p className="text-xs text-orange-400 font-medium mb-3">{s.subtitle}</p>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">{s.desc}</p>
              
              <ul className="space-y-1.5 mb-6">
                {s.points.map((pt, j) => (
                  <li key={j} className="text-xs text-slate-300 flex items-center space-x-2">
                    <span className="text-orange-400 font-bold">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-extrabold text-white">{s.price}</span>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-3.5 rounded-lg transition shadow-md">Get Quote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
