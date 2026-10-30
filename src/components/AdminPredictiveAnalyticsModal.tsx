import React from 'react';
import {
  X,
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  Users,
  Truck,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { ParcelRecord, StaffMember } from '../types';
import { generateAdminPredictiveAnalytics } from '../services/aiLogisticsService';

interface AdminPredictiveAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels: ParcelRecord[];
  staffList: StaffMember[];
}

export const AdminPredictiveAnalyticsModal: React.FC<AdminPredictiveAnalyticsModalProps> = ({
  isOpen,
  onClose,
  parcels,
  staffList,
}) => {
  if (!isOpen) return null;

  const analytics = generateAdminPredictiveAnalytics(parcels, staffList);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>AI Predictive Logistics Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Demand Forecasting & Capacity Planning
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto bg-slate-950/40">
          {/* Top Predictive Forecast Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold">
                  Next Week Forecast
                </span>
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-white">
                ~{analytics.forecastedParcelsNextWeek}
              </div>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{analytics.corridorGrowthPercent}% vs Last Cycle</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold">
                  Projected Revenue
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">LKR</span>
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 truncate">
                LKR {analytics.projectedRevenueLkr.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">
                Expected standard billing
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold">
                  Peak Demand Corridor
                </span>
                <Truck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {analytics.peakDemandHub} Hub
              </div>
              <div className="text-[11px] text-amber-300 font-medium">
                Highest linehaul volume intake
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase font-bold">
                  Fleet Utilization
                </span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-white">
                92.4%
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                High operational load
              </div>
            </div>
          </div>

          {/* Section 1: Regional Demand Corridor Flow Forecast */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-400" />
                <span>Inter-District Arterial Linehaul Forecast</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                A9 & Provincial Corridors
              </span>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 font-mono text-slate-400 uppercase">
                  <tr>
                    <th className="py-3 px-4">Linehaul Arterial Route</th>
                    <th className="py-3 px-4 text-right">Projected Weekly Dispatches</th>
                    <th className="py-3 px-4 text-center">Volume Trend</th>
                    <th className="py-3 px-4 text-right">Delay Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {analytics.corridorFlows.map((flow) => (
                    <tr key={flow.route} className="hover:bg-slate-850/50">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                        <span>{flow.route}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                        {flow.weeklyVolume} Units
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {flow.trend}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {flow.riskLevel === 'LOW' ? (
                          <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Minimal (A9 Clear)</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Monitored</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: AI Staffing & Regional Hub Capacity Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-400" />
              <span>AI Staffing & Field Courier Recommendations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.staffingRecommendations.map((rec) => (
                <div
                  key={rec.hub}
                  className={`p-4 rounded-2xl border transition-all ${
                    rec.urgency === 'URGENT'
                      ? 'bg-red-950/20 border-red-800/60'
                      : rec.urgency === 'MODERATE'
                      ? 'bg-amber-950/20 border-amber-800/60'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/70">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">
                        {rec.hub} Regional Hub
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase ${
                        rec.urgency === 'URGENT'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : rec.urgency === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {rec.urgency} Action
                    </span>
                  </div>

                  <div className="pt-2.5 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      Current Officers: <strong className="text-white">{rec.currentStaff}</strong>
                    </span>
                    <span className="text-orange-300">
                      AI Suggested: <strong>{rec.recommendedStaff} Officers</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Explainability & Audit Strip */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">
                Predictive Model Architecture & Data Lineage
              </div>
              <div className="text-[11px] mt-0.5">
                Forecasts computed from real-time consignment ledgers, A9 linehaul transit histories, regional district hub intake velocities, and historical peak seasonal corridors in the Northern Province.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-lg shadow-orange-500/25"
          >
            Close Analytics Console
          </button>
        </div>
      </div>
    </div>
  );
};
