/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthUser, ParcelRecord, ServiceRating, ShipmentStatus, StaffMember } from './types';
import {
  loadStoredParcels,
  saveStoredParcels,
} from './data/initialParcels';
import {
  loadStoredStaff,
  saveStoredStaff,
} from './data/staffRoster';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DeliveryStaffDashboard } from './components/DeliveryStaffDashboard';
import { ParcelBookingModal } from './components/ParcelBookingModal';
import { QuickTrackModal } from './components/QuickTrackModal';
import { RatingModal } from './components/RatingModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { StaffManagementModal } from './components/StaffManagementModal';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { AdminPredictiveAnalyticsModal } from './components/AdminPredictiveAnalyticsModal';
import { dispatchParcelWebhook } from './services/webhookService';

export default function App() {
  // Login-First Architecture: Start with currentUser = null
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Stored parcels state
  const [parcels, setParcels] = useState<ParcelRecord[]>(() => loadStoredParcels());

  // Stored delivery staff roster state
  const [staffList, setStaffList] = useState<StaffMember[]>(() => loadStoredStaff());

  // Modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [quickTrackParcel, setQuickTrackParcel] = useState<ParcelRecord | null>(null);
  const [ratingParcel, setRatingParcel] = useState<ParcelRecord | null>(null);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [isStaffManagementOpen, setIsStaffManagementOpen] = useState(false);
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false);
  const [isPredictiveAnalyticsOpen, setIsPredictiveAnalyticsOpen] = useState(false);

  // Login handler
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Parcel created handler (with customer senderEmail integration)
  const handleParcelCreated = (newParcel: ParcelRecord) => {
    setParcels((prev) => {
      const updated = [newParcel, ...prev];
      saveStoredParcels(updated);
      return updated;
    });
  };

  // Real-time status update handler (called by Delivery Staff or Admin)
  const handleUpdateStatus = (
    trackingId: string,
    newStatus: ShipmentStatus,
    officerStaffId?: string
  ) => {
    setParcels((prev) => {
      const now = new Date();
      const updatedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

      const updated = prev.map((p) => {
        if (p.trackingId !== trackingId) return p;
        const modified: ParcelRecord = {
          ...p,
          status: newStatus,
          deliveredByStaffId:
            newStatus === 'DELIVERED'
              ? officerStaffId || p.deliveredByStaffId || p.assignedStaff || 'STF-001'
              : p.deliveredByStaffId,
          updatedAt: updatedDate,
        };
        // Background webhook dispatch
        dispatchParcelWebhook(modified).catch(() => {});
        return modified;
      });

      saveStoredParcels(updated);
      return updated;
    });

    // If marked delivered by a staff officer, increment their delivery count in staff roster
    if (newStatus === 'DELIVERED' && officerStaffId) {
      setStaffList((prevStaff) => {
        const updatedStaff = prevStaff.map((s) => {
          if (s.id.toUpperCase() === officerStaffId.toUpperCase()) {
            return {
              ...s,
              deliveredParcelsCount: s.deliveredParcelsCount + 1,
            };
          }
          return s;
        });
        saveStoredStaff(updatedStaff);
        return updatedStaff;
      });
    }
  };

  // Staff roster update handler
  const handleStaffListChange = (updated: StaffMember[]) => {
    setStaffList(updated);
    saveStoredStaff(updated);
  };

  // Customer service rating submission
  const handleSubmitRating = (trackingId: string, rating: ServiceRating) => {
    setParcels((prev) => {
      const updated = prev.map((p) => {
        if (p.trackingId !== trackingId) return p;
        return {
          ...p,
          rating,
        };
      });
      saveStoredParcels(updated);
      return updated;
    });
  };

  // Admin credentials update handler
  const handleCredentialsUpdated = (newUsername: string, newPassword: string) => {
    localStorage.setItem('pigeon_admin_username', newUsername);
    localStorage.setItem('pigeon_admin_password', newPassword);

    if (currentUser?.role === 'admin') {
      setCurrentUser({
        ...currentUser,
        name: `${newUsername} (Operations)`,
      });
    }
  };

  const activeStaffCount = staffList.filter((s) => s.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 1. Full-Width Persistent Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => setIsAdminSettingsOpen(true)}
      />

      {/* 2. Main Full-Screen Viewport (No Restrictive Max-Width Containers) */}
      <main className="flex-1 w-full">
        {!currentUser ? (
          <LoginScreen
            onLogin={handleLogin}
            registeredStaff={staffList}
          />
        ) : (
          <div className="w-full px-4 sm:px-8 lg:px-12 py-8">
            {/* Customer Role Dashboard (STRICT Personal Order Isolation & AI Chatbot) */}
            {currentUser.role === 'customer' && (
              <CustomerDashboard
                currentUser={currentUser}
                parcels={parcels}
                onOpenBookingModal={() => setIsBookingModalOpen(true)}
                onQuickTrack={(parcel) => setQuickTrackParcel(parcel)}
                onOpenRatingModal={(parcel) => setRatingParcel(parcel)}
              />
            )}

            {/* Admin Role Dashboard (Staff Management, AI Analytics, Delivery Tracking, PDF Report) */}
            {currentUser.role === 'admin' && (
              <AdminDashboard
                parcels={parcels}
                onUpdateStatus={(trackingId, status) =>
                  handleUpdateStatus(trackingId, status, 'ADMIN')
                }
                onOpenStaffManagement={() => setIsStaffManagementOpen(true)}
                onOpenMonthlyReport={() => setIsMonthlyReportOpen(true)}
                onOpenPredictiveAnalytics={() => setIsPredictiveAnalyticsOpen(true)}
                activeStaffCount={activeStaffCount}
              />
            )}

            {/* Delivery Staff Role Dashboard (Automated Regional Hub Filter, AI Smart Route Optimizer) */}
            {currentUser.role === 'staff' && (
              <DeliveryStaffDashboard
                parcels={parcels}
                staffId={currentUser.staffId}
                assignedHub={currentUser.assignedHub}
                staffName={currentUser.name}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        )}
      </main>

      {/* 3. Parcel Booking Modal with AI Smart Weight & Fare Estimator + AI Address Validation */}
      <ParcelBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onParcelCreated={handleParcelCreated}
        senderDefaultName={currentUser?.role === 'customer' ? currentUser.name : ''}
        senderDefaultEmail={currentUser?.role === 'customer' ? currentUser.email : ''}
        senderDefaultPhone=""
      />

      {/* 4. Quick In-App Tracking Inspection Modal */}
      <QuickTrackModal
        parcel={quickTrackParcel}
        onClose={() => setQuickTrackParcel(null)}
      />

      {/* 5. Rating Modal for Delivered Parcels */}
      <RatingModal
        parcel={ratingParcel}
        onClose={() => setRatingParcel(null)}
        onSubmitRating={handleSubmitRating}
      />

      {/* 6. Admin Settings / Change Password Modal */}
      <AdminSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
        currentUsername={localStorage.getItem('pigeon_admin_username') || 'admin'}
        onCredentialsUpdated={handleCredentialsUpdated}
      />

      {/* 7. Admin Staff Management Modal (Sequential Auto-ID & Reassignment) */}
      <StaffManagementModal
        isOpen={isStaffManagementOpen}
        onClose={() => setIsStaffManagementOpen(false)}
        staffList={staffList}
        onStaffListChange={handleStaffListChange}
      />

      {/* 8. Printable Executive Monthly Report Modal (Consistent Pigeon Vector Logo) */}
      <MonthlyReportModal
        isOpen={isMonthlyReportOpen}
        onClose={() => setIsMonthlyReportOpen(false)}
        parcels={parcels}
      />

      {/* 9. Admin Predictive Analytics & Demand Forecasting Modal */}
      <AdminPredictiveAnalyticsModal
        isOpen={isPredictiveAnalyticsOpen}
        onClose={() => setIsPredictiveAnalyticsOpen(false)}
        parcels={parcels}
        staffList={staffList}
      />

      {/* 10. Clean Full-Width Footer (COMPLETE n8n Webhook Debug & Reset Seed Data REMOVAL) */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 px-4 sm:px-8 lg:px-12 text-xs text-slate-400 print:hidden">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <div className="font-bold text-slate-200">
              Pigeon Courier Northern Province Logistics Network
            </div>
            <div className="text-slate-400 text-[11px]">
              Operating Hubs: Jaffna · Kilinochchi · Vavuniya · Mannar · Mullaitivu
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <a
              href="mailto:support@pigeon.lk"
              className="hover:text-orange-400 transition-colors"
            >
              support@pigeon.lk
            </a>
            <span className="text-slate-700">·</span>
            <a
              href="tel:+94212220000"
              className="hover:text-emerald-400 transition-colors"
            >
              +94 21 222 0000
            </a>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500">
              © 2026 Pigeon Courier Express Ltd. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
