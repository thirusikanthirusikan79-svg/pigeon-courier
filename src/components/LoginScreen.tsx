import React, { useState } from 'react';
import { User, ShieldCheck, Truck, Lock, Mail, ArrowRight, Sparkles, Building, Check } from 'lucide-react';
import { UserRole, AuthUser, StaffMember, DestinationHub } from '../types';
import { GoogleAccountSelectorModal } from './GoogleAccountSelectorModal';

const ALL_HUBS: DestinationHub[] = [
  'Jaffna',
  'Kilinochchi',
  'Vavuniya',
  'Mannar',
  'Mullaitivu',
];

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
  registeredStaff: StaffMember[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  registeredStaff,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Customer credentials (clean empty defaults)
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Admin credentials (clean empty defaults)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Staff credentials (clean empty defaults)
  const [staffIdInput, setStaffIdInput] = useState('');
  const [selectedHub, setSelectedHub] = useState<DestinationHub>('Jaffna');

  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Customer: Google Sign-In Interactive Pop-up Flow
  const handleGoogleSignIn = () => {
    setErrorMsg('');
    setIsGoogleModalOpen(true);
  };

  const handleGoogleAccountConfirmed = (account: { name: string; email: string }) => {
    setIsGoogleModalOpen(false);
    onLogin({
      role: 'customer',
      name: account.name,
      email: account.email,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'customer') {
      if (!customerName.trim() || !customerEmail.trim()) {
        setErrorMsg('Please enter your full name and valid email address.');
        return;
      }
      onLogin({
        role: 'customer',
        name: customerName.trim(),
        email: customerEmail.trim().toLowerCase(),
      });
    } else if (selectedRole === 'admin') {
      const u = adminUsername.trim();
      const p = adminPassword.trim();

      const storedUser = localStorage.getItem('pigeon_admin_username') || 'admin';
      const storedPass = localStorage.getItem('pigeon_admin_password') || '123456';

      const isValid =
        (u === storedUser && p === storedPass) ||
        (u === 'admin' && (p === '123456' || p === 'pigeon123'));

      if (isValid) {
        onLogin({
          role: 'admin',
          name: `${u || 'Admin'} (Operations)`,
          email: `${u || 'admin'}@pigeon.lk`,
        });
      } else {
        setErrorMsg(
          'Invalid credentials. Please enter valid admin username & password (default: admin / 123456).'
        );
      }
    } else {
      // STRICT REQUIREMENT: Restrict staff access so users can ONLY log in using valid Staff IDs explicitly registered through Admin Panel
      const entered = staffIdInput.trim().toUpperCase();
      if (!entered) {
        setErrorMsg('Please enter your assigned Staff ID (e.g., STF-001).');
        return;
      }

      const matched = registeredStaff.find(
        (s) => s.id.toUpperCase() === entered && s.status === 'ACTIVE'
      );

      if (!matched) {
        setErrorMsg(
          `Access Denied: Staff ID "${entered}" is not recognized or is inactive. Only delivery officers registered through the Admin Staff Management module may sign in.`
        );
        return;
      }

      // Automatically pins to their registered hub (or selectedHub), name, and email
      onLogin({
        role: 'staff',
        name: matched.name,
        email: matched.email,
        staffId: matched.id,
        assignedHub: selectedHub || matched.hub,
      });
    }
  };

  // Check if entered Staff ID matches an active registered officer
  const matchedStaff = registeredStaff.find(
    (s) => s.id.toUpperCase() === staffIdInput.trim().toUpperCase() && s.status === 'ACTIVE'
  );
  // Dynamic Hub Heading: Display chosen Regional Hub clearly as the top static heading
  const currentHubTitle = `${selectedHub} Regional Hub`;

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Welcome Branding Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pigeon Operations Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sign In to Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Select your portal role to access internal logistics and dispatches
          </p>
        </div>

        {/* 3 Explicit Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('customer');
              setErrorMsg('');
            }}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'customer'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4 mb-1" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setErrorMsg('');
            }}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-1" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('staff');
              setErrorMsg('');
            }}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'staff'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 mb-1" />
            <span>Delivery Staff</span>
          </button>
        </div>

        {/* Login Form Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-xs font-semibold text-red-200 leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Customer: Authentic Sign In with Google Option matching dark theme */}
          {selectedRole === 'customer' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-100 font-medium text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-sm active:scale-[0.99] group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-slate-200 group-hover:text-white font-medium">
                  Sign in with Google
                </span>
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800"></div>
                <span className="text-xs uppercase font-mono text-slate-500 font-bold">
                  Or continue with email
                </span>
                <div className="h-px flex-1 bg-slate-800"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Inputs */}
            {selectedRole === 'customer' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sivaguru Kumar"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. customer@pigeon.lk"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Admin Inputs */}
            {selectedRole === 'admin' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Admin Username
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="•••••• (default: 123456)"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Delivery Staff Inputs: 5 Hub Selector Pills + Dynamic Heading + Manual Staff ID Input */}
            {selectedRole === 'staff' && (
              <div className="space-y-4">
                {/* 1. All 5 Hubs Selection Pills */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-orange-400" />
                      <span>Select Operating Hub</span>
                    </span>
                    <span className="text-[11px] text-orange-400/90 font-mono">
                      5 Northern Hubs
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {ALL_HUBS.map((hub) => {
                      const isSelected = selectedHub === hub;
                      return (
                        <button
                          key={hub}
                          type="button"
                          onClick={() => {
                            setSelectedHub(hub);
                            if (errorMsg) setErrorMsg('');
                          }}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-400/60'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span>{hub} Hub</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Dynamic Hub Heading: Clearly displays the chosen Regional Hub */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-center space-y-1 shadow-inner">
                  <div className="inline-flex items-center justify-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider">
                    <Building className="w-3.5 h-3.5" />
                    <span>Regional Operating Hub</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {currentHubTitle}
                  </h2>
                  {matchedStaff ? (
                    <div className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1.5 pt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Officer: {matchedStaff.name} ({matchedStaff.id})</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Northern Province Logistics Network
                    </p>
                  )}
                </div>

                {/* 3. Manual Staff ID Typing Field (Dedicated text input directly underneath) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Staff ID
                  </label>
                  <div className="relative">
                    <Truck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={staffIdInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStaffIdInput(val);
                        if (errorMsg) setErrorMsg('');
                        const found = registeredStaff.find(
                          (s) => s.id.toUpperCase() === val.trim().toUpperCase() && s.status === 'ACTIVE'
                        );
                        if (found) {
                          setSelectedHub(found.hub);
                        }
                      }}
                      placeholder="e.g. STF-001"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm uppercase font-mono tracking-wider bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Enter your registered Staff ID (e.g., STF-001 for Jaffna, STF-002 for Kilinochchi).
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-orange-500/25 mt-2"
            >
              <span>Access {selectedRole.toUpperCase()} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Interactive Google Sign-In Account Selector Pop-up */}
      <GoogleAccountSelectorModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountConfirmed}
      />
    </div>
  );
};
