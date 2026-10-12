import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'why-us', label: 'Why Us' },
    { id: 'services', label: 'Services' },
    { id: 'calculator', label: 'Price Calculator' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white text-xs py-1.5 px-4 text-center font-bold tracking-wide">
        🚀 Northern Province's Premier Courier Network — Jaffna · Kilinochchi · Vavuniya · Mannar · Mullaittivu
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="flex flex-col">
            <div className="flex items-center text-2xl font-black tracking-tight">
              <span className="text-white">Pige</span>
              <div className="relative inline-flex items-center justify-center w-6 h-6 mx-0.5 bg-orange-500 text-white rounded-md font-extrabold text-sm shadow-md">
                <span>o</span>
              </div>
              <span className="text-white">n</span>
            </div>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase -mt-1">COURIER | LOGISTICS & EXPRESS</span>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
