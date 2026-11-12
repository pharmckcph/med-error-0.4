import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  PlusCircle,
  Plus,
  FileSpreadsheet,
  AlertTriangle,
  Upload,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
  BarChart2,
  LogIn
} from 'lucide-react';
import { store } from '../services/store';
import { LoginModal } from './LoginModal';

interface HeaderBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: any;
  onUserChange: (user: any) => void;
  googleUser: any;
  onNewReport: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onUserChange,
  googleUser,
  onNewReport
}) => {
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const allUsers = store.getUsers();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-purple-200">Admin</span>;
      case 'reviewer':
        return <span className="bg-blue-100 text-blue-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-200">Reviewer</span>;
      case 'dept_head':
        return <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-200">Dept Head</span>;
      case 'reporter':
      default:
        return <span className="bg-emerald-100 text-emerald-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">Reporter</span>;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'reports':
        return 'รายการรายงานความคลาดเคลื่อนทางยา (Medication Error Events)';
      case 'new':
        return 'บันทึกรายงานใหม่';
      case 'edit':
        return 'แก้ไขข้อมูลรายงานอุบัติการณ์';
      case 'rca':
        return 'ระบบจัดการความเสี่ยง RCA & มาตรการป้องกันเชิงระบบ (Risk Management RCA)';
      case 'hosxp':
        return 'นำเข้าข้อมูล Smart HOSxP Staging Queue (12 คอลัมน์มาตรฐาน)';
      case 'analytics':
        return 'สถิติและตัวชี้วัดอุบัติการณ์ต่อ 1,000 ใบสั่งยา (Prescription Rate Analytics)';
      case 'settings':
        return 'การจัดการ Master Data (แผนก, เจ้าหน้าที่, บัญชียา)';
      case 'log':
      case 'audit':
        return 'LOG ระบบ ตรวจสอบประวัติ และ D1 SQLite Schema';
      default:
        return 'ระบบบริหารจัดการความปลอดภัยทางยา';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top clean header strip */}
      <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 tracking-tight">
              {getTabTitle(currentTab)}
            </div>
          </div>
        </div>

        {/* User Pill & Quick Actions */}
        <div className="flex items-center gap-2.5">
          {googleUser && (
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-emerald-800 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sheets Sync พร้อมใช้งาน</span>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => setShowSwitchModal(true)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-full pl-1.5 pr-3 py-1 cursor-pointer transition select-none shadow-2xs"
                title="คลิกเพื่อสลับผู้ใช้งาน / เข้าสู่ระบบ"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser.display_name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[140px]">
                  {currentUser.display_name}
                </span>
                <span className="text-slate-300">•</span>
                {getRoleBadge(currentUser.role)}
              </div>

              {/* Change Password Button */}
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition shadow-2xs cursor-pointer"
                title="เปลี่ยนรหัสผ่านของฉัน"
              >
                <span>🔑 แก้ Password</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSwitchModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 hover:from-purple-950 hover:to-indigo-950 text-white rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ (Log in)</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner with Modern Purple Gradient matching login cover theme */}
      {currentTab === 'reports' && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-6 sm:p-8 shadow-lg border border-purple-800/30">
          {/* Decorative floating organic 3D spheres matching Login Cover theme */}
          <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-fuchsia-500 opacity-60 shadow-2xl absolute -bottom-16 -left-12 blur-[1px] pointer-events-none"></div>
          <div className="w-44 h-44 rounded-full bg-gradient-to-br from-indigo-400 to-purple-800 opacity-45 absolute -top-12 -right-8 blur-xs pointer-events-none"></div>
          <div className="w-32 h-32 rounded-full bg-fuchsia-500/25 absolute top-1/2 right-1/3 -translate-y-1/2 blur-lg pointer-events-none"></div>
          <div className="w-72 h-72 rounded-full bg-purple-500/20 blur-3xl absolute -top-16 -right-16 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Medication Error Safety & Risk Registry Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                ระบบรายงานและจัดการความคลาดเคลื่อนทางยา
              </h1>
              <p className="text-sm text-purple-100/90 leading-relaxed font-normal">
                ภาพรวมอุบัติการณ์ระดับความรุนแรง A - I, การวิเคราะห์ RCA เชิงระบบรายเดือน, และสถิติอัตราต่อ 1,000 ใบสั่งยาตามมาตรฐาน HA
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
              <button
                onClick={onNewReport}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white text-purple-950 font-extrabold text-xs hover:bg-purple-50 transition shadow-md active:scale-[0.98] cursor-pointer group"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500 group-hover:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                <span>บันทึกรายงานใหม่</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] tracking-wider uppercase border border-emerald-300">
                  NEW
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login & Switch User Modal with Password Verification */}
      <LoginModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        onSuccess={(user) => {
          onUserChange(user);
          setShowSwitchModal(false);
        }}
        isMandatory={false}
      />

      {/* Change Password Modal for Current User */}
      {showPasswordModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">เปลี่ยนรหัสผ่าน (Change Password)</h3>
                <p className="text-xs text-purple-200">
                  ผู้ใช้งาน: {currentUser.display_name} ({currentUser.role})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPwdError('');
                  setPwdSuccess('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPassword.trim()) {
                  setPwdError('กรุณากรอกรหัสผ่านใหม่');
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setPwdError('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน');
                  return;
                }
                store.updatePassword(currentUser.id, newPassword.trim());
                setPwdSuccess('เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว');
                setPwdError('');
                setTimeout(() => {
                  setShowPasswordModal(false);
                  setPwdSuccess('');
                  setNewPassword('');
                  setConfirmPassword('');
                }, 1200);
              }}
              className="p-6 space-y-4 text-xs"
            >
              {pwdError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                  {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold">
                  {pwdSuccess}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">รหัสผ่านใหม่ *</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="พิมพ์รหัสผ่านใหม่ที่ต้องการ"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pr-10 text-xs font-mono font-bold focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    {showPwd ? 'ซ่อน' : 'แสดง'}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ยืนยันรหัสผ่านใหม่อีกครั้ง *</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="พิมพ์รหัสผ่านใหม่อีกครั้งเพื่อยืนยัน"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 hover:opacity-95 text-white font-bold rounded-xl shadow-xs transition"
                >
                  บันทึกรหัสผ่านใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
