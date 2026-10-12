import { MessageCircle, ArrowRight, MapPin } from 'lucide-react';

const DISTRICTS = [
  { name: 'Jaffna', icon: '🏛️', desc: 'Same-day intra-district delivery' },
  { name: 'Kilinochchi', icon: '🌿', desc: 'Express inter-district routes' },
  { name: 'Vavuniya', icon: '🏪', desc: 'Reliable overnight delivery' },
  { name: 'Mannar', icon: '🌊', desc: 'Coastal route express' },
  { name: 'Mullaittivu', icon: '🌄', desc: 'Remote area specialists' },
];

const STATS = [
  { value: '5', label: 'Districts Covered', suffix: '' },
  { value: '2', label: 'Hours Intra-Jaffna', suffix: 'hr' },
  { value: '500', label: 'Happy Businesses', suffix: '+' },
  { value: '98', label: 'On-Time Rate', suffix: '%' },
];

export default function Hero({ setActiveTab }) {
  return (
    <section className="min-h-[calc(100vh-112px)] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0c1a35] flex items-center px-4 md:px-8 py-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Hero copy */}
          <div className="tab-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block" />
              NORTHERN PROVINCE'S TRUSTED COURIER
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white leading-tight mb-5">
              Next-Gen Courier &amp;{' '}
              <span className="text-[#f97316]">Logistics</span>
              {' '}for Modern Businesses
            </h1>

            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-xl">
              Blazing-fast deliveries across all five Northern Province districts. Real-time WhatsApp support, secure handling, and transparent LKR pricing — no hidden charges.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/94777443660"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 btn-whatsapp-shimmer text-white font-bold px-6 py-3.5 rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                <MessageCircle size={18} />
                Book Pickup via WhatsApp
              </a>
              <button
                onClick={() => setActiveTab('calculator')}
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all"
              >
                Get a Price Estimate
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-4 gap-4">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-[#f97316]">
                    {s.value}{s.suffix}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Northern Network Hub card */}
          <div className="tab-fade-in">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <MapPin size={20} className="text-[#f97316]" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Northern Network Hub</div>
                  <div className="text-slate-400 text-xs">All 5 districts — Active &amp; Operational</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  LIVE
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {DISTRICTS.map((d, i) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:border-orange-500/30 hover:bg-white/8 transition-all"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="text-xl">{d.icon}</span>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{d.name}</div>
                      <div className="text-slate-400 text-xs">{d.desc}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center">
                <p className="text-orange-300 text-xs font-semibold">
                  📞 Emergency Helpline: <span className="text-orange-400">+94 (21) 744-3660</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
