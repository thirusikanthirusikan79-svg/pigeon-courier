import React, { useState } from 'react';
import { PackagePlus, ExternalLink, Search, Package, Calendar, Eye, Star, ShieldCheck } from 'lucide-react';
import { AuthUser, ParcelRecord, ShipmentStatus } from '../types';
import { CustomerSupportChatbot } from './CustomerSupportChatbot';

interface CustomerDashboardProps {
  currentUser: AuthUser;
  parcels: ParcelRecord[];
  onOpenBookingModal: () => void;
  onQuickTrack: (parcel: ParcelRecord) => void;
  onOpenRatingModal: (parcel: ParcelRecord) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  parcels,
  onOpenBookingModal,
  onQuickTrack,
  onOpenRatingModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ShipmentStatus>('ALL');

  const myParcels = Array.isArray(parcels) ? parcels.filter((p) => {
    const userEmail = (currentUser?.email || '').trim().toLowerCase();
    const matchesEmail = p.senderEmail && userEmail && p.senderEmail.trim().toLowerCase() === userEmail;
    return matchesEmail;
  }) : [];

  const filteredParcels = myParcels.filter((p) => {
    const matchesSearch =
      p.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destinationHub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.deliveryAddress && p.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'ORDER_RECEIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>ORDER RECEIVED</span>
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            <span>IN TRANSIT</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>DELIVERED</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Action Header - Full Screen Width */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">Customer Express Portal</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-semibold text-slate-300">Verified Account: {currentUser.email}</span>
            <span className="text-slate-600">·</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Personal View Isolated</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Consignments & Dispatches</h1>
          <p className="text-sm text-slate-400">Track active shipments across Northern Province hubs or dispatch new parcels</p>
        </div>

        {/* Prominent "+ Book New Parcel" Action Button */}
        <button
          type="button"
          onClick={onOpenBookingModal}
          className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-orange-500/30 whitespace-nowrap"
        >
          <PackagePlus className="w-5 h-5" />
          <span>➕ Book New Parcel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['ALL', 'ORDER_RECEIVED', 'IN_TRANSIT', 'DELIVERED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search my tracking, recipient, address..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Full-Width Personal Shipments Table */}
      {filteredParcels.length === 0 ? (
        <div className="w-full p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Personal Shipments Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {myParcels.length === 0
              ? 'You have not booked any shipments under this account yet. Click "➕ Book New Parcel" to create your first consignment.'
              : 'No shipments match your current search/filter. Clear filters to see your parcels.'}
          </p>
          <button
            type="button"
            onClick={onOpenBookingModal}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            ➕ Book New Parcel
          </button>
        </div>
      ) : (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-mono uppercase tracking-wider">
                  <th className="py-4 px-6">Tracking ID</th>
                  <th className="py-4 px-6">Sender (You)</th>
                  <th className="py-4 px-6">Recipient & Addresses (From / To)</th>
                  <th className="py-4 px-6">Destination Hub</th>
                  <th className="py-4 px-6 text-right">Weight (KG)</th>
                  <th className="py-4 px-6 text-right">Live Fare</th>
                  <th className="py-4 px-6">Status Badge</th>
                  <th className="py-4 px-6 text-center">Delivery Feedback</th>
                  <th className="py-4 px-6 text-right">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-slate-850/60 transition-colors group">
                    {/* Tracking ID with date */}
                    <td className="py-4 px-6">
                      <div className="font-mono font-extrabold text-orange-400 text-base">{parcel.trackingId}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{parcel.createdAt}</span>
                      </div>
                    </td>

                    {/* Sender Name */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{parcel.senderName}</div>
                      <div className="text-xs text-slate-400 font-mono">{parcel.senderPhone}</div>
                    </td>

                    {/* Recipient & Dual Addresses (Pickup & Delivery) */}
                    <td className="py-4 px-6 space-y-1">
                      <div className="font-semibold text-white">{parcel.recipientName}</div>
                      <div className="text-xs text-slate-400 font-mono">{parcel.recipientPhone}</div>
                      <div className="pt-1 space-y-0.5 text-xs font-mono">
                        <div className="text-slate-300 flex items-center gap-1">
                          <span className="text-orange-400 font-bold">From:</span>
                          <span className="text-slate-300 truncate max-w-xs">{parcel.pickupAddress}</span>
                        </div>
                        <div className="text-slate-300 flex items-center gap-1">
                          <span className="text-emerald-400 font-bold">To:</span>
                          <span className="text-slate-300 truncate max-w-xs">
                            {parcel.deliveryAddress || parcel.specialInstructions || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Destination Hub */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200">
                        {parcel.destinationHub} Hub
                      </span>
                    </td>

                    {/* Weight (KG) */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-200">
                      {parcel.weightKg.toFixed(1)} KG
                    </td>

                    {/* Live Fare in LKR */}
                    <td className="py-4 px-6 text-right font-mono font-extrabold text-white text-base">
                      LKR {parcel.fareLkr.toLocaleString()}
                    </td>

                    {/* Visual Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(parcel.status)}</td>

                    {/* Interactive Rating System upon DELIVERED */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {parcel.status === 'DELIVERED' ? (
                        parcel.rating ? (
                          <button
                            type="button"
                            onClick={() => onOpenRatingModal(parcel)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
                            title={parcel.rating.review || 'Rated service'}
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{parcel.rating.stars}/5 Rated</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenRatingModal(parcel)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 cursor-pointer transition-all animate-pulse"
                            title="Rate courier delivery service"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>⭐ Rate Service</span>
                          </button>
                        )
                      ) : (
                        <span className="text-slate-600 text-xs font-mono">In Delivery Route</span>
                      )}
                    </td>

                    {/* Tracking Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => onQuickTrack(parcel)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                        title="Quick Status Modal"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span className="hidden lg:inline">Inspect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickTrack(parcel)}
                        className="px-3.5 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 hover:text-orange-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        title="Quick Status Modal"
                      >
                        <span>Live Track</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 24/7 AI Customer Support Chatbot (English & Tamil, Live Parcel Lookup) */}
      <CustomerSupportChatbot parcels={parcels} onInspectParcel={(parcel) => onQuickTrack(parcel)} />
    </div>
  );
};