import React, { useState } from 'react';
import { Calculator as CalcIcon, AlertCircle, ArrowRight } from 'lucide-react';

const Calculator = ({ setActivePage }) => {
  const [weight, setWeight] = useState(1);
  const [zone, setZone] = useState('intra'); // intra | inter
  const [category, setCategory] = useState('standard'); // standard | express | document | bulk

  const handleWeightChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setWeight('');
    } else {
      const parsed = parseInt(val, 10);
      setWeight(isNaN(parsed) ? '' : Math.max(0, parsed));
    }
  };

  const calculateFare = () => {
    const currentWeight = Number(weight) || 0;

    // Weight limit 500kg check
    if (currentWeight === 0 || currentWeight > 500) {
      return null;
    }

    let baseFare = 350;
    
    // Zone rate
    if (zone === 'inter') {
      baseFare = 550;
    }

    // Category multiplier
    let categoryMultiplier = 1;
    if (category === 'express') categoryMultiplier = 1.3;
    if (category === 'document') categoryMultiplier = 0.9;
    if (category === 'bulk') categoryMultiplier = 1.2;

    // Weight charge: First 1kg base fare, additional per kg charge
    const additionalWeight = Math.max(0, currentWeight - 1);
    const perKgRate = zone === 'intra' ? 80 : 120;

    const total = (baseFare + additionalWeight * perKgRate) * categoryMultiplier;
    return Math.round(total);
  };

  const fare = calculateFare();
  const numericWeight = Number(weight) || 0;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          INSTANT QUOTE
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
          Price Calculator
        </h2>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Get an instant LKR fare estimate for Northern Province deliveries.
        </p>
      </div>

      {/* Calculator Card */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalcIcon className="w-4 h-4 text-orange-400" />
              Northern Province Fare Estimator
            </h3>
            <p className="text-xs text-slate-400">Jaffna · Kilinochchi · Vavuniya · Mannar · Mullaitivu</p>
          </div>
          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            MAX 500 KG
          </span>
        </div>

        {/* Input 1: Parcel Weight */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            PARCEL WEIGHT (KG)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWeight(prev => Math.max(1, (Number(prev) || 1) - 1))}
              className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xl flex items-center justify-center transition-colors border border-white/10 active:scale-95 flex-shrink-0"
            >
              -
            </button>
            <div className="relative w-full">
              <input
                type="number"
                value={weight}
                onChange={handleWeightChange}
                placeholder="Type weight..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-bold text-orange-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                KG
              </span>
            </div>
            <button
              type="button"
              onClick={() => setWeight(prev => (Number(prev) || 0) + 1)}
              className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xl flex items-center justify-center transition-colors border border-white/10 active:scale-95 flex-shrink-0"
            >
              +
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Directly type weight or use + / - buttons (Max limit: 500 kg)</p>
        </div>

        {/* Input 2: Delivery Zone */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            DELIVERY ZONE
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
          >
            <option value="intra">Within Jaffna District (Intra-District)</option>
            <option value="inter">Northern Inter-District (Kilinochchi, Vavuniya, Mannar, Mullaitivu)</option>
          </select>
        </div>

        {/* Input 3: Parcel Category */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            PARCEL CATEGORY
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
          >
            <option value="standard">Standard Parcel</option>
            <option value="express">Express Intra-District Delivery</option>
            <option value="document">Confidential Documents / Certificates</option>
            <option value="bulk">Bulk Cargo & Agricultural Goods</option>
          </select>
        </div>

        {/* Display Output Section */}
        <div className="pt-4 border-t border-white/10">
          {fare !== null ? (
            <div className="bg-slate-950/80 border border-orange-500/30 rounded-2xl p-6 text-center shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                ESTIMATED FARE
              </p>
              <h3 className="text-4xl sm:text-5xl font-black text-white">
                LKR {fare.toLocaleString()}
              </h3>
              <p className="text-xs text-orange-400 font-medium mt-2 flex items-center justify-center gap-1">
                ⚡ Estimated fare for {numericWeight} kg. Final confirmation upon pickup.
              </p>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  {numericWeight > 500 
                    ? `Weight (${numericWeight} kg) exceeds 500 kg limit` 
                    : 'Please enter a valid weight'}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                For heavy cargo or bulk shipments exceeding 500 kg, please contact our team directly for customized pricing and dedicated vehicle dispatch.
              </p>
              <button
                type="button"
                onClick={() => setActivePage && setActivePage('contact')}
                className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-lg text-xs active:scale-95"
              >
                <span>Contact Us for Bulk Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Calculator;
