import React, { useState } from 'react';
import {
  FileText,
  Package,
  Truck,
  CheckCircle2,
  ExternalLink,
  Search,
  Check,
  Calendar,
  Users,
  BrainCircuit,
} from 'lucide-react';
import { ParcelRecord, ShipmentStatus } from '../types';

interface AdminDashboardProps {
  parcels: ParcelRecord[];
  onUpdateStatus: (trackingId: string, newStatus: ShipmentStatus) => void;
  onOpenStaffManagement: () => void;
  onOpenMonthlyReport: () => void;
  onOpenPredictiveAnalytics: () => void;
  activeStaffCount?: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  parcels,
  onUpdateStatus,
  onOpenStaffManagement,
  onOpenMonthlyReport,
  onOpenPredictiveAnalytics,
  activeStaffCount = 5,
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'IN_TRANSIT' | 'DELIVERED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 3 Simple Top Summary Metrics
  const totalParcelsCount = parcels.length;
  const inTransitCount = parcels.filter(
    (p) => p.status === 'IN_TRANSIT' || p.status === 'ORDER_RECEIVED'
  ).length;
  const deliveredCount = parcels.filter((p) => p.status === 'DELIVERED').length;

  const filteredParcels = parcels.filter((p) => {
    const matchesFilter =
      filterTab === 'ALL'
        ? true
        : filterTab === 'IN_TRANSIT'
        ? p.status === 'IN_TRANSIT' || p.status === 'ORDER_RECEIVED'
        : p.status === 'DELIVERED';

    const matchesSearch =
      p.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destinationHub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.deliveryAddress && p.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.assignedStaff && p.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.deliveredByStaffId &&
        p.deliveredByStaffId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
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
      {/* Admin Action Header - Full Width */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <div className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
            Executive Operations Console
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Administrator Logistics Hub
          </h1>
          <p className="text-sm text-slate-400">
            Oversee provincial consignments, staff roster, AI demand forecasting, and printable reports
          </p>
        </div>

        {/* Action Buttons: Predictive Analytics, Staff Management & Monthly PDF Report */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenPredictiveAnalytics}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/25 border border-orange-400/30"
            title="Open AI demand forecasting and capacity analytics"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>📊 AI Predictive Analytics</span>
          </button>

          <button
            type="button"
            onClick={onOpenStaffManagement}
            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            title="Open delivery staff registration & management modal"
          >
            <Users className="w-4 h-4 text-orange-400" />
            <span>👥 Manage Staff Roster ({activeStaffCount} Active)</span>
          </button>

          <button
            type="button"
            onClick={onOpenMonthlyReport}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>📄 Monthly PDF Report</span>
          </button>
        </div>
      </div>

      {/* Top Summary Cards: 3 Simple Metric Boxes - Full Screen Width */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              1. Total Parcels
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-white tabular-nums">
            {totalParcelsCount}
          </div>
          <div className="text-xs text-slate-400 font-medium">All logged provincial shipments</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
              2. In-Transit
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-orange-400 tabular-nums">
            {inTransitCount}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Active linehaul & dispatch corridors
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              3. Delivered
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
            {deliveredCount}
          </div>
          <div className="text-xs text-slate-400 font-medium">Completed and signed deliveries</div>
        </div>
      </div>

      {/* Simplified Parcel Management: Filter Tabs & Table with Assigned Staff Tracking */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterTab === 'ALL'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Parcels ({totalParcelsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('IN_TRANSIT')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterTab === 'IN_TRANSIT'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending / In-Transit ({inTransitCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('DELIVERED')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterTab === 'DELIVERED'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Delivered ({deliveredCount})
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, recipient, address, staff ID..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-mono uppercase tracking-wider">
                <th className="py-4 px-6">Tracking ID</th>
                <th className="py-4 px-6">Destination Hub</th>
                <th className="py-4 px-6">Recipient & Addresses (From / To)</th>
                <th className="py-4 px-6 text-right">Weight (KG)</th>
                <th className="py-4 px-6 text-right">Fare (LKR)</th>
                <th className="py-4 px-6">Status Badge</th>
                <th className="py-4 px-6">Assigned Staff / Delivered By</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredParcels.map((parcel) => (
                <tr key={parcel.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono font-extrabold text-orange-400 text-base">
                      {parcel.trackingId}
                    </span>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{parcel.createdAt}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-white">
                      {parcel.destinationHub}
                    </span>
                  </td>
                  {/* Recipient & Dual Addresses (Pickup & Delivery) Column */}
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
                  <td className="py-4 px-6 text-right font-mono font-bold text-slate-200">
                    {parcel.weightKg.toFixed(1)} KG
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-white">
                    LKR {parcel.fareLkr.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(parcel.status)}</td>
                  <td className="py-4 px-6">
                    {parcel.status === 'DELIVERED' ? (
                      <div className="space-y-0.5">
                        <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {parcel.deliveredByStaffId
                              ? `Signed by ${parcel.deliveredByStaffId}`
                              : parcel.assignedStaff || 'Delivered'}
                          </span>
                        </div>
                        {parcel.rating && (
                          <div className="text-[11px] text-amber-400 font-semibold">
                            Customer rated: {parcel.rating.stars}/5 ⭐
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-slate-300">
                        {parcel.assignedStaff || `${parcel.destinationHub} Corridor`}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                    {parcel.status === 'ORDER_RECEIVED' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(parcel.trackingId, 'IN_TRANSIT')}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Dispatch / Linehaul
                      </button>
                    )}
                    {parcel.status === 'IN_TRANSIT' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(parcel.trackingId, 'DELIVERED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {parcel.status === 'DELIVERED' && (
                      <div className="inline-flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(parcel.trackingId, 'ORDER_RECEIVED')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                          title="Revert back to Order Received"
                        >
                          🔄 Revert
                        </button>
                      </div>
                    )}
                    <a
                      href={`http://localhost:5173/track/${parcel.trackingId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors inline-block"
                      title="Inspect tracking on public service (:5173)"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};