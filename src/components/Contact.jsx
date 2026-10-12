import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [result, setResult] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "0531b4da-5903-477b-ac93-5711ab06433d");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Pickup Request Sent Successfully! Our agent will call you within 10 minutes.");
      setIsSubmitted(true);
      event.target.reset();
      setTimeout(() => {
        setIsSubmitted(false);
        setResult("");
      }, 5000);
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          GET IN TOUCH
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
          Request a Pickup
        </h2>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Fill in your details and our agent will call you within 10 minutes to confirm your parcel pickup across Northern Province.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          
          {/* 1. Emergency Helpline (Clickable Call Link) */}
          <a
            href="tel:+94217443660"
            className="block bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-orange-500/40 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 group shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl group-hover:bg-orange-500 group-hover:text-slate-950 transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Emergency Helpline</p>
                <p className="text-base font-extrabold text-white mt-0.5 group-hover:text-orange-400 transition-colors">+94 (21) 744-3660</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mon–Sat: 7:00 AM – 9:00 PM</p>
              </div>
            </div>
          </a>

          {/* 2. WhatsApp Support (Clickable WhatsApp Link) */}
          <a
            href="https://wa.me/94777443660?text=Hello%20Pigeon%20Courier,%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 group shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Support</p>
                <p className="text-base font-extrabold text-white mt-0.5 group-hover:text-emerald-400 transition-colors">+94 777 443 660</p>
                <p className="text-[11px] text-slate-500 mt-0.5">7 days a week, instant response</p>
              </div>
            </div>
          </a>

          {/* 3. Service Area */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Service Area</p>
                <p className="text-base font-extrabold text-white mt-0.5">Northern Province, Sri Lanka</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Jaffna · Kilinochchi · Vavuniya · Mannar · Mullaitivu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            Pickup Request Form
          </h3>

          {isSubmitted && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{result}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. K. Thirusikan"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="07X XXX XXXX"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Pickup Address</label>
              <input
                type="text"
                name="address"
                required
                placeholder="Street, City, District (e.g. Main Street, Jaffna)"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Parcel Details / Message</label>
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Weight, destination district, or special notes..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              Submit Pickup Request
            </button>
            
            {!isSubmitted && result && (
              <p className="text-xs text-center text-orange-400 mt-2">{result}</p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
