import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, LogIn, ShieldCheck, Check } from 'lucide-react';
import { store } from '../services/store';
import { stripTitlePrefix } from '../../shared/form.js';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: any) => void;
  isMandatory?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isMandatory = false
}) => {
  const allUsers = store.getUsers();
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState('');
  // User requested "และไม่ซ่อน password", so default to visible (show)
  const [showPassword, setShowPassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('กรุณาพิมพ์ชื่อ - นามสกุลผู้ใช้งาน');
      return;
    }
    if (!password.trim()) {
      setError('กรุณาระบุรหัสผ่าน');
      return;
    }

    const res = store.login(userName.trim(), password.trim());
    if (res.success && res.user) {
      setError(null);
      setPassword('');
      if (rememberMe) {
        sessionStorage.setItem('med_error_active_session_id', res.user.id);
      }
      onSuccess(res.user);
      if (onClose) onClose();
    } else {
      setError(res.error || 'รหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Main Split Login Card matching reference template in Purple Tone */}
      <div className="bg-white rounded-[32px] shadow-2xl max-w-4xl w-full border border-purple-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 relative">
        
        {/* Close Button (if non-mandatory) */}
        {!isMandatory && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 text-slate-400 hover:text-slate-700 bg-slate-100/80 hover:bg-slate-200/90 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition"
            title="ปิด"
          >
            ✕
          </button>
        )}

        {/* ========================================================
            Left Section: Rich Purple & Indigo Organic 3D Hero
            ======================================================== */}
        <div className="md:col-span-5 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-[520px]">
          {/* Decorative floating spheres & glass glows matching design */}
          <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-fuchsia-500 opacity-70 shadow-2xl absolute -bottom-10 -left-10 blur-[1px]"></div>
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-400 to-purple-800 opacity-50 absolute bottom-36 -right-10 blur-xs"></div>
          <div className="w-24 h-24 rounded-full bg-purple-400/20 absolute top-20 right-8 blur-md"></div>
          <div className="w-64 h-64 rounded-full bg-purple-500/20 blur-3xl absolute -top-16 -right-16 pointer-events-none"></div>

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-purple-100 text-[11px] font-semibold mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Medication Safety Platform</span>
            </div>
          </div>

          {/* Center / Bottom Headline */}
          <div className="relative z-10 my-auto py-6">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase leading-none drop-shadow-sm">
              WELCOME
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-purple-200 uppercase tracking-widest mt-2">
              Medication Error Registry
            </h2>
            <p className="text-xs text-purple-100/90 leading-relaxed mt-4 max-w-xs font-normal">
              ระบบรายงานและบริหารจัดการความคลาดเคลื่อนทางยา ตามมาตรฐานความปลอดภัยระดับสากล NCC-MERP
            </p>
          </div>

          {/* Bottom Hospital Tag */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-purple-200 font-medium">
            Chiang Khong Crown Prince Hospital
          </div>
        </div>

        {/* ========================================================
            Right Section: Modern Sign In Form
            ======================================================== */}
        <div className="md:col-span-7 bg-white p-7 sm:p-11 flex flex-col justify-center relative overflow-hidden">
          {/* Subtle bottom-right corner decorative sphere matching mockup */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-tl from-purple-500/25 via-indigo-400/15 to-transparent absolute -bottom-10 -right-10 pointer-events-none blur-xs"></div>

          <div className="max-w-md w-full mx-auto space-y-6 relative z-10">
            {/* Title header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sign in
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ระบบจัดการความปลอดภัยและความคลาดเคลื่อนทางยา
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-semibold leading-relaxed">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Name Field (พิมพ์ ชื่อ - นามสกุล ของตนเอง ไม่ใช้ dropdown) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  User Name (ชื่อ - นามสกุล) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white border border-slate-200 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/15 rounded-2xl transition-all">
                  <div className="pl-4 text-slate-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      setError(null);
                    }}
                    placeholder="พิมพ์ชื่อ - นามสกุล ของตนเอง..."
                    autoComplete="off"
                    spellCheck="false"
                    className="w-full bg-transparent pl-3 pr-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field (ไม่ซ่อน password เป็นค่าเริ่มต้น พร้อมสัญลักษณ์ดวงตา Show/Hide) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Password (รหัสผ่าน) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100/95 focus-within:bg-white border border-slate-200 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/15 rounded-2xl transition-all">
                  <div className="pl-4 text-slate-400 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="ระบุรหัสผ่าน..."
                    className="w-full bg-transparent pl-3 pr-12 py-3.5 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                    title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4 text-purple-700" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <span>จดจำการเข้าสู่ระบบ</span>
                </label>
              </div>

              {/* Submit Button (Deep Purple / Indigo Tone matching mockup) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 hover:from-purple-950 hover:to-indigo-950 text-white font-bold text-sm shadow-lg shadow-purple-950/25 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
