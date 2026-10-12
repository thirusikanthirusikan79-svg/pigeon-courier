import React, { useState } from 'react';

export default function PriceCalculator() {
  const [weight, setWeight] = useState(1);
  const [zone, setZone] = useState('intra-jaffna');
  const [category, setCategory] = useState('standard');

  const calculateFare = () => {
    let base = 350;
    if (zone === 'inter-district') base = 500;
    if (zone === 'express-remote') base = 650;
    
    let weightFare = (weight - 1) * 100;
    if (weightFare < 0) weightFare = 0;
    
    let multiplier = 1;
    if (category === 'express') multiplier = 1.3;
    if (category === 'document') multiplier = 0.9;

    return Math.round((base + weightFare) * multiplier);
  };

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">FARE ESTIMATOR</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">Price Calculator</h2>
        <p className="text-slate-400 text-sm mt-2">Get an instant LKR fare estimate for Northern Province deliveries.</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
          <h3 className="text-sm font-bold text-white">Northern Province Fare Estimator</h3>
          <p className="text-xs text-slate-400">Jaffna · Kilinochchi · Vavuniya · Mannar · Mullaittivu</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Parcel Weight (kg)</label>
            <div className="flex items-center space-x-4">
              <button onClick={() => setWeight(Math.max(1, weight - 1))} className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xl transition flex items-center justify-center border border-slate-700">-</button>
              <span className="text-2xl font-black text-orange-400 w-20 text-center">{weight} kg</span>
              <button onClick={() => setWeight(weight + 1)} className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xl transition flex items-center justify-center border border-slate-700">+</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Delivery Zone</label>
            <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500">
              <option value="intra-jaffna">Within Jaffna District</option>
              <option value="inter-district">Inter-District (Jaffna / Kilinochchi / Vavuniya)</option>
              <option value="express-remote">Remote Coastal Route (Mannar / Mullaittivu)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Parcel Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500">
              <option value="standard">Standard Parcel</option>
              <option value="document">Legal Document Shipping</option>
              <option value="express">Express Priority Cargo</option>
            </select>
          </div>

          <div className="mt-8 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 p-6 rounded-2xl text-center">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">ESTIMATED FARE</p>
            <div className="text-5xl font-black text-white mt-2 mb-1">LKR {calculateFare()}</div>
            <p className="text-xs text-orange-300 font-semibold mt-2">⚡ Same-Day Express: Doorstep in under 2 hours</p>
            <p className="text-[10px] text-slate-500 mt-1 italic">*Estimated fare, final confirmation upon pickup.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
