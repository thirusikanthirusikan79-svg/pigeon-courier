import React from 'react';
import { X, CheckCircle2, Truck, Package } from 'lucide-react';
import { ParcelRecord } from '../types';

interface QuickTrackModalProps {
  parcel: ParcelRecord | null;
  onClose: () => void;
}

export const QuickTrackModal: React.FC<QuickTrackModalProps> = ({ parcel, onClose }) => {
  if (!parcel) return null;

  const steps = [
    {
      id: 'ORDER_RECEIVED',
      label: 'Order Received & Sealed',
      desc: 'Barcode optical scan completed and verified at origin hub.',
      icon: Package,
      done: true,
      active: parcel.status === 'ORDER_RECEIVED',
    },
    {
      id: 'IN_TRANSIT',
      label: 'Northern Corridor In-Transit',
      desc: 'Linehaul vehicle dispatched along A9 / Northern arterial corridor.',
      icon: Truck,
      done: parcel.status === 'IN_TRANSIT' || parcel.status === 'DELIVERED',
      active: parcel.status === 'IN_TRANSIT',
    },
    {
      id: 'DELIVERED',
      label: 'Delivered & Signed',
      desc: 'Successfully handed over to recipient with digital POD confirmation.',
      icon: CheckCircle2,
      done: parcel.status === 'DELIVERED',
      active: parcel.status === 'DELIVERED',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="text-xs font-mono font-extrabold text-orange-400">Live Consignment Status</div>
            <h3 className="text-xl font-extrabold text-white font-mono mt-0.5">{parcel.trackingId}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-slate-400 block font-medium">Destination Hub</span>
              <span className="text-white font-bold text-sm">{parcel.destinationHub} Hub</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Weight & Fare</span>
              <span className="text-white font-mono font-bold text-sm">
                {parcel.weightKg.toFixed(1)} KG · LKR {parcel.fareLkr.toLocaleString()}
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between">
              <div>
                <span className="text-slate-400 block font-medium">Recipient</span>
                <span className="text-white font-semibold">{parcel.recipientName}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="text-orange-300 font-semibold">{parcel.parcelCategory}</span>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="space-y-4">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.id} className="flex items-start gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      st.active
                        ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/30'
                        : st.done
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          st.active ? 'text-orange-400' : st.done ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {st.label}
                      </h4>
                      {st.active && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};