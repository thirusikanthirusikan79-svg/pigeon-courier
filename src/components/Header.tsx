import React from 'react';
import {
  LogOut,
  User,
  ShieldCheck,
  Truck,
  ExternalLink,
  Settings,
  Mail,
  Phone,
} from 'lucide-react';
import { AuthUser } from '../types';
import { PigeonLogo } from './PigeonLogo';

interface HeaderProps {
  currentUser: AuthUser | null;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenSettings,
}) => {
  const isCustomer = currentUser?.role === 'customer';
  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser?.role === 'staff';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 lg:px-12 py-4 shadow-xl">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: Standardized Pigeon Logo, Title & Static Regional Hub Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <PigeonLogo />

          {/* Static Regional Hub Badges (No Glow / No Button Effect / Pointer-events-none) */}
          <div
            className="flex flex-wrap items-center gap-1.5 select-none pointer-events-none"
            aria-label="Operating Northern Province Hubs"
          >
            {(['Jaffna', 'Kilinochchi', 'Vavuniya', 'Mannar', 'Mullaitivu'] as const).map(
              (district) => (
                <span
                  key={district}
                  className="bg-slate-900/60 border border-slate-800 px-3 py-1 rounded text-xs font-medium text-slate-300 pointer-events-none"
                >
                  {district}
                </span>
              )
            )}
          </div>
        </div>

        {/* Right Side: Demo Contacts, Customer-Only Website Link, Admin Settings & User Profile */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Company Demo Contact Display for Customer and Delivery Staff Portals */}
          {(isCustomer || isStaff) && (
            <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <a
                href="mailto:support@pigeon.lk"
                className="flex items-center gap-1.5 text-slate-300 hover:text-orange-400 transition-colors"
                title="Company Support Email"
              >
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span>support@pigeon.lk</span>
              </a>
              <span className="text-slate-700">|</span>
              <a
                href="tel:+94212220000"
                className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
                title="Helpline Phone Number"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+94 21 222 0000</span>
              </a>
            </div>
          )}

          {/* STRICT CUSTOMER-ONLY LINK: Rendered EXCLUSIVELY in Customer Portal */}
          {isCustomer && (
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-xs font-bold text-orange-300 hover:text-white transition-colors shadow-sm"
              title="Open Pigeon Courier Public Marketing Website"
            >
              <span>Company Website : Click Here</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            </a>
          )}

          {/* Admin Header Settings Action: "⚙️ Settings / Change Password" */}
          {isAdmin && onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Manage Admin Credentials & Password"
            >
              <Settings className="w-3.5 h-3.5 text-orange-400" />
              <span>⚙️ Settings / Change Password</span>
            </button>
          )}

          {/* User Profile Badge & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sm">
                {isCustomer ? (
                  <User className="w-4 h-4 text-orange-400" />
                ) : isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                ) : (
                  <Truck className="w-4 h-4 text-orange-400" />
                )}
                <span className="font-bold text-white max-w-[150px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-orange-500 text-white uppercase ml-0.5">
                  {currentUser.role}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sign out of dashboard"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
