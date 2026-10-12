import LogoC from './LogoC';

const QUICK_LINKS = ['Home', 'Why Us', 'Services', 'Price Calculator', 'Contact'];
const SERVICES_LIST = [
  'Express Intra-District',
  'Northern Inter-District',
  'Secure Document Shipping',
  'Bulk Cargo & Agricultural',
  'E-Commerce Fulfillment',
];

export default function Footer({ setActiveTab }) {
  const tabMap = {
    'Home': 'home', 'Why Us': 'whyus', 'Services': 'services',
    'Price Calculator': 'calculator', 'Contact': 'contact',
  };

  return (
    <footer className="bg-[#090e1a] text-slate-400 px-4 md:px-8 pt-14 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand column */}
          <div>
            <div className="bg-white/95 inline-block px-3.5 py-1.5 rounded-2xl shadow-md border border-white/20 mb-4">
              <LogoC height={34} />
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">
              Northern Province's trusted courier partner. Fast, safe, and transparent — every delivery, every time.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { label: 'Facebook', href: '#', icon: '📘' },
                { label: 'Instagram', href: '#', icon: '📷' },
                { label: 'WhatsApp', href: 'https://wa.me/94777443660', icon: '💬' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-sm hover:bg-[#f97316] hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map(link => (
                <li key={link}>
                  <button
                    onClick={() => setActiveTab(tabMap[link])}
                    className="text-sm text-slate-400 hover:text-[#f97316] transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Our Services</h4>
            <ul className="flex flex-col gap-2">
              {SERVICES_LIST.map(s => (
                <li key={s}>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="text-sm text-slate-400 hover:text-[#f97316] transition-colors text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & hours */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact & Hours</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-orange-400 font-semibold text-xs uppercase tracking-wide">Emergency Helpline</p>
                <p className="text-white font-bold mt-0.5">+94 (21) 744-3660</p>
              </div>
              <div>
                <p className="text-orange-400 font-semibold text-xs uppercase tracking-wide">WhatsApp</p>
                <a
                  href="https://wa.me/94777443660"
                  className="text-white font-bold mt-0.5 hover:text-[#f97316] transition-colors block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +94 777 443 660
                </a>
              </div>
              <div>
                <p className="text-orange-400 font-semibold text-xs uppercase tracking-wide">Working Hours</p>
                <p className="text-slate-300 text-xs mt-0.5">Mon – Sat: 7:00 AM – 9:00 PM</p>
                <p className="text-slate-400 text-xs">Sun: 9:00 AM – 5:00 PM</p>
              </div>
              <div>
                <p className="text-orange-400 font-semibold text-xs uppercase tracking-wide">Region</p>
                <p className="text-slate-300 text-xs mt-0.5">Jaffna · Kilinochchi · Vavuniya<br/>Mannar · Mullaittivu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Pigeon Courier Service. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Northern Province, Sri Lanka 🇱🇰
          </p>
        </div>
      </div>
    </footer>
  );
}
