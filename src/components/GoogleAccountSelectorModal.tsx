import React, { useState } from 'react';
import { X, UserPlus, Check, Loader2, ArrowRight } from 'lucide-react';

export interface GoogleAccount {
  name: string;
  email: string;
  avatarLetter: string;
  avatarBg: string;
  badge?: string;
}

interface GoogleAccountSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string }) => void;
}

const DEFAULT_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Thirusikan T.',
    email: 'thirusikanthirusikan79@gmail.com',
    avatarLetter: 'T',
    avatarBg: 'bg-blue-600',
    badge: 'Active Google Account',
  },
  {
    name: 'Sivaguru Kumar',
    email: 'customer@pigeon.lk',
    avatarLetter: 'S',
    avatarBg: 'bg-emerald-600',
    badge: 'Verified Customer',
  },
];

export const GoogleAccountSelectorModal: React.FC<GoogleAccountSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleAccountClick = (account: { name: string; email: string }) => {
    setSelectedEmail(account.email);
    setIsAuthenticating(true);

    // Realistic Google OAuth token exchange simulation
    setTimeout(() => {
      setIsAuthenticating(false);
      onSelectAccount(account);
    }, 650);
  };

  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    handleAccountClick({
      name: customName.trim(),
      email: customEmail.trim().toLowerCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-[440px] bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Google Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Google Multicolor G */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span className="text-xs font-semibold text-slate-600">Google Accounts</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Choose an account</h2>
            <p className="text-xs text-slate-500">
              to continue to <span className="font-semibold text-slate-800">Pigeon Courier Express</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isAuthenticating}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-3 space-y-3">
          {isAuthenticating ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="text-sm font-semibold text-slate-800">
                Signing you in with Google...
              </div>
              <div className="text-xs text-slate-500">
                Verifying OAuth credentials & redirecting to Customer Portal
              </div>
            </div>
          ) : !showAddAccount ? (
            <>
              {/* Account list items */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {DEFAULT_ACCOUNTS.map((acc) => {
                  const isSelected = selectedEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleAccountClick(acc)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {acc.avatarLetter}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                            <span>{acc.name}</span>
                            {acc.badge && (
                              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                {acc.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{acc.email}</div>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        ) : (
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setShowAddAccount(true)}
                className="w-full p-3.5 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex items-center gap-3 text-left transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Use another account</div>
                  <div className="text-[11px] text-slate-500">Sign in with a different Gmail address</div>
                </div>
              </button>
            </>
          ) : (
            /* Custom account entry form */
            <form onSubmit={handleCustomAccountSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Priyantha Silva"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Privacy Notice */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed text-center">
            To continue, Google will share your name, email address, language preference, and profile
            picture with Pigeon Courier Express.
          </div>
        </div>
      </div>
    </div>
  );
};
