import React from 'react';
import { Zap, MapPin, ShieldCheck, Truck } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'Express Intra-District',
      badge: 'MOST POPULAR',
      badgeColor: 'bg-orange-500 text-slate-950 font-bold',
      subtitle: 'Within Jaffna District',
      desc: 'Same-day doorstep delivery anywhere within Jaffna district in under 2 hours. Ideal for businesses, pharmacies, and individuals.',
      features: ['Under 2 Hours', 'Live WhatsApp Updates', 'Proof of Delivery'],
      price: 'From LKR 350',
      icon: Zap,
    },
    {
      title: 'Northern Inter-District Routes',
      badge: 'INTER-DISTRICT',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      subtitle: 'Kilinochchi · Vavuniya · Mannar · Mullaitivu',
      desc: 'Reliable same-day to next-morning delivery linking all five Northern Province districts via our dedicated express network.',
      features: ['Same Day / Next Morning', 'Insured Parcels', 'Dedicated Support'],
      price: 'From LKR 550',
      icon: MapPin,
    },
    {
      title: 'Secure Document Shipping',
      badge: 'SECURE',
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      subtitle: 'Confidential & Legal Documents',
      desc: 'Tamper-proof, confidential handling for legal documents, government filings, bank documents, and academic certificates.',
      features: ['Sealed & Secure', 'Signed Acknowledgement', 'Photographic Proof'],
      price: 'From LKR 350',
      icon: ShieldCheck,
    },
    {
      title: 'Bulk Cargo & Agricultural Freight',
      badge: 'BULK',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      subtitle: 'Large Volume Shipments',
      desc: 'Cost-effective bulk freight for agricultural produce, wholesale goods, and construction materials across the Northern region.',
      features: ['No Weight Limit', 'Agri Specialists', 'Custom Pricing'],
      price: 'Custom Quote',
      icon: Truck,
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          OUR CORE SERVICES
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
          Courier Solutions for Every Need
        </h2>
        <p className="text-slate-400 mt-3 text-base sm:text-lg">
          From urgent same-day intra-district runs to bulk cargo across the North — we have the right service for your business.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((srv, idx) => {
          const IconComponent = srv.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all duration-300 shadow-xl backdrop-blur-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                    <IconComponent className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${srv.badgeColor}`}>
                    {srv.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{srv.title}</h3>
                <p className="text-xs text-orange-400/80 font-medium mb-3">{srv.subtitle}</p>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{srv.desc}</p>

                <ul className="space-y-2 mb-6">
                  {srv.features.map((f, fIdx) => (
                    <li key={fIdx} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-orange-500 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price section without Get Quote button */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                <span className="text-sm font-extrabold text-white">{srv.price}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
