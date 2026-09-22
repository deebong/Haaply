import React, { useState } from 'react';
import { X, User, Phone, Check, ShieldCheck, LogOut, Package } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { useTheme } from '../providers/ThemeProvider';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onToggleLogin: () => void;
  userPhone: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onToggleLogin,
  userPhone,
}) => {
  // Centralized scroll-lock: locks document scroll, handles mobile touch, and supports Escape key
  useScrollLock(isOpen, onClose);
  const { theme } = useTheme();
  const isAtelier = theme.id === 'atelier';

  const [phoneInput, setPhoneInput] = useState(userPhone || '9843210980');
  const [pinInput, setPinInput] = useState('1234');
  const [step, setStep] = useState<'phone' | 'pin'>('phone');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onToggleLogin();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#172126]/40 backdrop-blur-xs transition-opacity touch-none"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white rounded-[22px] shadow-2xl border border-[#E7E7DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E7DF] shrink-0">
          <div className="flex items-center gap-2">
            <User className={`w-5 h-5 ${isAtelier ? 'text-[#181818]' : 'text-[#004B68]'}`} />
            <h3 id="account-modal-title" className={`text-lg font-bold ${
              isAtelier ? 'text-[#141414] font-serif' : 'text-[#004B68]'
            }`}>
              {isLoggedIn
                ? (isAtelier ? 'Client Profile' : 'Customer Account')
                : (isAtelier ? 'Sign in to Atelier' : 'Sign in to Haaply')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#626B69] hover:text-[#172126] rounded-lg hover:bg-[#F2F3ED] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          data-modal-scrollable="true"
          className="p-6 overflow-y-auto overscroll-contain"
        >
          {isLoggedIn ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#FAFAF6] border border-[#E7E7DF]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  isAtelier ? 'bg-[#181818] text-white' : 'bg-[#53B847]/15 text-[#53B847]'
                }`}>
                  K
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172126]">Karthik Subramanian</h4>
                  <p className="text-xs text-[#626B69]">+91 {userPhone}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-0.5 ${
                    isAtelier ? 'text-[#181818]' : 'text-[#53B847]'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    {isAtelier ? 'Verified Client' : 'Verified Customer'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E7E7DF] text-xs space-y-2">
                <div className="flex items-center justify-between text-[#626B69]">
                  <span className="flex items-center gap-1.5">
                    <Package className={`w-3.5 h-3.5 ${isAtelier ? 'text-[#181818]' : 'text-[#004B68]'}`} />
                    Total past orders
                  </span>
                  <strong className="text-[#172126]">12 orders</strong>
                </div>
                <div className="flex items-center justify-between text-[#626B69]">
                  <span>Default delivery address</span>
                  <strong className="text-[#172126]">Rangasamy Nagar, CBE</strong>
                </div>
              </div>

              <div className="bg-[#F2F3ED] p-3 rounded-xl text-xs text-[#626B69]">
                💡 You are currently viewing personalized preferences. Click logout below to preview the guest state.
              </div>

              <button
                type="button"
                onClick={() => {
                  onToggleLogin();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E7E7DF] text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out (Switch to Guest Mode)</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <p className="text-xs text-[#626B69] leading-relaxed">
                {isAtelier
                  ? 'Log in with your phone and secure PIN to view your bespoke orders, track insured shipments, and manage saved sizes.'
                  : 'Log in with your phone and secure PIN to view your repeat orders, reorder previous items, and track morning fresh delivery.'}
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#172126] mb-1">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-[#626B69]">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    maxLength={10}
                    className={`w-full pl-12 pr-4 py-2 text-sm bg-white border border-[#E7E7DF] rounded-xl focus:outline-none ${
                      isAtelier ? 'focus:border-[#181818]' : 'focus:border-[#53B847]'
                    }`}
                    placeholder="9843210980"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172126] mb-1">
                  4-Digit PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  maxLength={4}
                  className={`w-full px-4 py-2 text-sm bg-white border border-[#E7E7DF] rounded-xl focus:outline-none tracking-widest ${
                    isAtelier ? 'focus:border-[#181818]' : 'focus:border-[#53B847]'
                  }`}
                  placeholder="••••"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 text-white text-xs font-bold rounded-xl transition-colors mt-2 ${
                  isAtelier ? 'bg-[#181818] hover:bg-black uppercase tracking-wider' : 'bg-[#53B847] hover:bg-[#469e3c]'
                }`}
              >
                {isAtelier ? 'Sign In to Client Account' : 'Sign In to Customer Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
