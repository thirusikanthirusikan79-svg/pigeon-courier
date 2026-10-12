import React from 'react';
import { Phone, MessageSquare, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="relative py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12 relative z-10">
        <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Get In Touch</span>
        <h2 className="text-4xl font-extrabold text-white mt-3">Request a Pickup</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">Fill in your details and our agent will call you within 10 minutes to confirm your parcel pickup across Northern Province.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
        <div className="space-y-4">
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl"><Phone className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Emergency Helpline</p>
              <p className="font-bold text-white text-base">+94 (21) 744-3660</p>
              <p className="text-xs text-slate-400">Mon - Sat: 7:00 AM – 9:00 PM</p>
            </div>
          </div>

          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl"><MessageSquare className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">WhatsApp Support</p>
              <p className="font-bold text-white text-base">+94 777 443 660</p>
              <p className="text-xs text-slate-400">7 days a week, instant response</p>
            </div>
          </div>

          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md flex items-center space-x-4">
            <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl"><MapPin className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Service Area</p>
              <p className="font-bold text-white text-base">Northern Province, Sri Lanka</p>
              <p className="text-xs text-slate-400">Jaffna · Kilinochchi · Vavuniya · Mannar · Mullaittivu</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>Pickup Request Form</span>
          </h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" placeholder="e.g. K. Thirusikan" className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
              <input type="tel" placeholder="07X XXX XXXX" className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Pickup Address</label>
              <input type="text" placeholder="Street, City, District (e.g. Main Street, Jaffna)" className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Parcel Details / Message</label>
              <textarea rows="3" placeholder="Weight, destination district, or special notes..." className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm"></textarea>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition duration-200 flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Submit Pickup Request</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
