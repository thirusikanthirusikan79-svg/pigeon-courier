import React from 'react';
import { X, Printer, Calendar } from 'lucide-react';
import { ParcelRecord } from '../types';
import { PigeonLogo } from './PigeonLogo';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels: ParcelRecord[];
  monthName?: string;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  parcels,
  monthName = 'October 2026',
}) => {
  if (!isOpen) return null;

  const totalParcels = parcels.length;
  const inTransitCount = parcels.filter(
    (p) => p.status === 'IN_TRANSIT' || p.status === 'ORDER_RECEIVED'
  ).length;
  const deliveredCount = parcels.filter((p) => p.status === 'DELIVERED').length;
  const totalRevenue = parcels.reduce((sum, p) => sum + p.fareLkr, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col print:max-h-none print:m-0 print:border-none print:bg-white print:text-slate-900 print:shadow-none">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
              Executive Printable Report
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/25"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 sm:p-10 space-y-8 flex-1 overflow-y-auto print:p-0 print:overflow-visible">
          {/* Official Pigeon Courier Header with Consistent Vector Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <PigeonLogo />
              <div className="text-xs text-slate-400 print:text-slate-600 mt-2 font-mono">
                Northern Province Logistics Network · Regional Linehaul Division
              </div>
              <div className="text-xs text-slate-500 print:text-slate-500 mt-0.5">
                Helpline: +94 21 222 0000 · Support: support@pigeon.lk
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs font-mono font-extrabold text-orange-400 print:text-orange-600 uppercase tracking-wider">
                Official Monthly Report
              </span>
              <h1 className="text-2xl font-extrabold text-white print:text-slate-900">
                Operations & Dispatch Summary
              </h1>
              <div className="text-xs text-slate-400 print:text-slate-600 font-mono flex sm:justify-end items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reporting Cycle: {monthName}</span>
              </div>
            </div>
          </div>

          {/* Executive Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 print:text-slate-600 uppercase">
                Total Consignments
              </div>
              <div className="text-2xl font-extrabold font-mono text-white print:text-slate-900">
                {totalParcels}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
              <div className="text-[11px] font-mono text-orange-400 print:text-orange-600 uppercase">
                In-Transit / Linehaul
              </div>
              <div className="text-2xl font-extrabold font-mono text-orange-400 print:text-orange-600">
                {inTransitCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
              <div className="text-[11px] font-mono text-emerald-400 print:text-emerald-600 uppercase">
                Delivered & Signed
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 print:text-emerald-600">
                {deliveredCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 print:text-slate-600 uppercase">
                Total Revenue
              </div>
              <div className="text-xl font-extrabold font-mono text-white print:text-slate-900 truncate">
                LKR {totalRevenue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Consignments Detailed Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">
              Consignment Registry ({parcels.length} Dispatches)
            </h3>

            <div className="border border-slate-800 print:border-slate-300 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 print:bg-slate-100 border-b border-slate-800 print:border-slate-300 font-mono text-slate-400 print:text-slate-700">
                  <tr>
                    <th className="py-3 px-4">Tracking ID</th>
                    <th className="py-3 px-4">Sender</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Fare (LKR)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned / Delivered By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {parcels.map((parcel) => (
                    <tr key={parcel.id} className="print:text-slate-800">
                      <td className="py-3 px-4 font-mono font-bold text-orange-400 print:text-orange-600">
                        {parcel.trackingId}
                      </td>
                      <td className="py-3 px-4 font-medium text-white print:text-slate-900">
                        {parcel.senderName}
                      </td>
                      <td className="py-3 px-4 text-slate-300 print:text-slate-700">
                        {parcel.recipientName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200 print:text-slate-800">
                        {parcel.destinationHub} Hub
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 print:text-slate-700">
                        {parcel.weightKg.toFixed(1)} KG
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white print:text-slate-900">
                        {parcel.fareLkr.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            parcel.status === 'DELIVERED'
                              ? 'bg-emerald-500/10 text-emerald-400 print:bg-emerald-100 print:text-emerald-800'
                              : parcel.status === 'IN_TRANSIT'
                              ? 'bg-orange-500/10 text-orange-400 print:bg-amber-100 print:text-amber-800'
                              : 'bg-blue-500/10 text-blue-400 print:bg-blue-100 print:text-blue-800'
                          }`}
                        >
                          {parcel.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 print:text-slate-600">
                        {parcel.deliveredByStaffId
                          ? `Delivered by: ${parcel.deliveredByStaffId}`
                          : parcel.assignedStaff || 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Hub Signature Strip */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400 print:text-slate-600">
            <div>
              <div className="font-bold text-slate-300 print:text-slate-800">Operating Regional Hubs</div>
              <div>Jaffna · Kilinochchi · Vavuniya · Mannar · Mullaitivu</div>
            </div>
            <div>
              <div className="font-bold text-slate-300 print:text-slate-800">Audit & Validation</div>
              <div>Generated directly from PostgreSQL & localStorage ledger</div>
            </div>
            <div className="sm:text-right">
              <div className="font-bold text-slate-300 print:text-slate-800">Authorized Signature</div>
              <div className="h-6 border-b border-slate-700 print:border-slate-400 mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
