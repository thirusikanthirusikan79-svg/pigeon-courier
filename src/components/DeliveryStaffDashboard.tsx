import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  PackageCheck,
  Building,
  Sparkles,
  Zap,
  Clock,
} from 'lucide-react';
import { DestinationHub, ParcelRecord, ShipmentStatus } from '../types';
import { optimizeStaffRoute, RouteOptimizationResult } from '../services/aiLogisticsService';

interface DeliveryStaffDashboardProps {
  parcels: ParcelRecord[];
  staffId?: string;
  assignedHub?: DestinationHub;
  staffName?: string;
  onUpdateStatus: (trackingId: string, newStatus: ShipmentStatus, staffId?: string) => void;
}

export const DeliveryStaffDashboard: React.FC<DeliveryStaffDashboardProps> = ({
  parcels,
  staffId = 'STF-001',
  assignedHub = 'Jaffna',
  staffName = 'Delivery Officer',
  onUpdateStatus,
}) => {
  // STRICT REQUIREMENT: Parcels automatically filter based ONLY on logged-in staff member's hub.
  // Manual filter dropdowns have been removed.
  const activeCorridorParcels = parcels.filter(
    (p) => p.destinationHub === assignedHub
  );

  const activeTasks = activeCorridorParcels.filter((p) => p.status !== 'DELIVERED');
  const completedTasks = activeCorridorParcels.filter((p) => p.status === 'DELIVERED');

  // AI Smart Route Optimization state
  const [isAiOptimized, setIsAiOptimized] = useState(false);
  const [routePlan, setRoutePlan] = useState<RouteOptimizationResult | null>(null);

  const handleRunAiOptimizer = () => {
    const result = optimizeStaffRoute(activeTasks, assignedHub);
    setRoutePlan(result);
    setIsAiOptimized(true);
  };

  const handleResetRoute = () => {
    setIsAiOptimized(false);
    setRoutePlan(null);
  };

  // Re-order tasks if AI optimization is applied
  const displayedActiveTasks = isAiOptimized && routePlan
    ? routePlan.optimizedParcels
    : activeTasks;

  return (
    <div className="w-full space-y-8">
      {/* Staff Operations Header - Full Width */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
              Field Courier Terminal
            </span>
            <span className="text-slate-600">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-bold font-mono">
              {staffId}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-semibold text-slate-300">
              {staffName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{assignedHub} Regional Corridor</span>
          </h1>

          <p className="text-sm text-slate-400">
            Automated route stops strictly assigned for {assignedHub} Hub consignments
          </p>
        </div>

        {/* Action Counters & AI Route Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {activeTasks.length > 0 && (
            <button
              type="button"
              onClick={isAiOptimized ? handleResetRoute : handleRunAiOptimizer}
              className={`px-4 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isAiOptimized
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow-orange-500/30'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {isAiOptimized
                  ? '✓ AI Sequence Active (Reset)'
                  : '⚡ AI Smart Route Optimizer'}
              </span>
            </button>
          )}

          <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-medium">Pending Route Stops</div>
            <div className="text-2xl font-mono font-extrabold text-orange-400">
              {activeTasks.length}
            </div>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-medium">Completed Today</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400">
              {completedTasks.length}
            </div>
          </div>
        </div>
      </div>

      {/* AI Smart Route Optimization Banner (when active) */}
      {isAiOptimized && routePlan && (
        <div className="w-full p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-orange-950/20 to-slate-900 border border-orange-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  AI Smart Route Optimization Applied
                </h3>
                <p className="text-xs text-orange-200">
                  {routePlan.corridorSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold">
                ⚡ ~{routePlan.efficiencyGainPercent}% Time Saved
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Est: {routePlan.estimatedTotalMinutes} Mins ({routePlan.totalDistanceKm} KM)</span>
              </span>
            </div>
          </div>

          {/* Waypoints Sequence Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
            {routePlan.waypoints.map((wp) => (
              <div
                key={wp.trackingId}
                className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">
                    Stop #{wp.step}
                  </span>
                  <span className="text-slate-400">{wp.suggestedTime}</span>
                </div>
                <div className="font-bold text-white truncate">{wp.recipientName}</div>
                <div className="text-[11px] text-slate-400 truncate">{wp.address}</div>
                <div className="text-[10px] text-amber-300/90 font-medium">
                  {wp.trafficNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task-Oriented Delivery Cards - Full Width Grid */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-400" />
            <span>
              {isAiOptimized ? 'AI Optimized Route Stops' : `Active ${assignedHub} Corridor Deliveries`}{' '}
              ({displayedActiveTasks.length})
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Destination: {assignedHub} Hub · {isAiOptimized ? 'AI Sequence Active' : 'Standard Chronological'}
          </span>
        </div>

        {displayedActiveTasks.length === 0 ? (
          <div className="w-full p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
              <PackageCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">All Route Deliveries Cleared!</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              No pending deliveries for {assignedHub} Hub. All shipments on your route are delivered and signed.
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayedActiveTasks.map((parcel, idx) => (
              <div
                key={parcel.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-4">
                  {/* Top Bar: Sequence Stop Badge, Tracking ID, Weight & Hub */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      {isAiOptimized && (
                        <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-mono font-extrabold flex items-center justify-center text-xs">
                          #{idx + 1}
                        </span>
                      )}
                      <div>
                        <span className="font-mono text-base font-extrabold text-orange-400">
                          {parcel.trackingId}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {parcel.parcelCategory} · {parcel.weightKg.toFixed(1)} KG
                        </div>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-orange-400" />
                      <span>{parcel.destinationHub} Hub</span>
                    </span>
                  </div>

                  {/* Formatted Addresses */}
                  <div className="space-y-3 text-sm">
                    {/* Pickup Address */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pickup Location</span>
                      </div>
                      <div className="font-semibold text-slate-200">
                        {parcel.senderName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {parcel.pickupAddress}
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-orange-500/20 space-y-1">
                      <div className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-400" />
                        <span>Delivery Destination</span>
                      </div>
                      <div className="font-bold text-white text-base">
                        {parcel.recipientName}
                      </div>
                      <div className="text-xs text-slate-300">
                        {parcel.destinationHub} District Hub Corridor · {parcel.pickupAddress}
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {parcel.specialInstructions && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-300 font-medium">
                      ⚠️ Note: {parcel.specialInstructions}
                    </div>
                  )}

                  {/* Fare & Recipient Direct Call */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-white">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Fare: LKR {parcel.fareLkr.toLocaleString()}</span>
                    </div>

                    <a
                      href={`tel:${parcel.recipientPhone}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-emerald-400 flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Recipient</span>
                    </a>
                  </div>
                </div>

                {/* One-Tap "Mark as Delivered" Real-Time Sync Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(parcel.trackingId, 'DELIVERED', staffId)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/25"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>✓ Mark as Delivered</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Deliveries Roster for Assigned Hub */}
      {completedTasks.length > 0 && (
        <div className="w-full pt-4 space-y-4">
          <h3 className="text-sm font-bold font-mono text-slate-400 uppercase tracking-wider">
            Delivered in {assignedHub} Hub Today ({completedTasks.length})
          </h3>
          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 divide-y divide-slate-800">
            {completedTasks.map((parcel) => (
              <div
                key={parcel.id}
                className="py-3 flex items-center justify-between first:pt-0 last:pb-0 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-white">
                      {parcel.trackingId}
                    </span>
                    <span className="text-slate-400 text-xs ml-2">
                      Delivered to {parcel.recipientName} ({parcel.destinationHub})
                    </span>
                    {parcel.deliveredByStaffId && (
                      <span className="text-[11px] font-mono text-emerald-400/90 ml-2">
                        · Signed by {parcel.deliveredByStaffId}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={`http://localhost:5173/track/${parcel.trackingId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Verify Status</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
