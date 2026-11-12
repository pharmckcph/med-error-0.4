import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  RefreshCw,
  Shield,
  Upload,
  User,
  Users
} from 'lucide-react';
import { googleSignIn, googleSignOut } from '../services/googleWorkspace';
import { store } from '../services/store';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: any;
  onUserChange: (user: any) => void;
  googleUser: any;
  setGoogleUser: (user: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onUserChange,
  googleUser,
  setGoogleUser
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const allUsers = store.getUsers();

  const handleGoogleAuth = async () => {
    if (googleUser) {
      await googleSignOut();
      setGoogleUser(null);
    } else {
      setIsSigningIn(true);
      try {
        const result = await googleSignIn();
        if (result) {
          setGoogleUser(result.user);
        }
      } catch (err: any) {
        console.error('Google Sign in failed:', err);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-purple-200">Admin</span>;
      case 'reviewer':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-200">Reviewer</span>;
      case 'dept_head':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">Dept Head</span>;
      case 'reporter':
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">Reporter</span>;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with App Brand and Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Hospital Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Medication Error Reporting</span>
                <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-300">v0.4 Simple</span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">ระบบรายงานและตรวจสอบความคลาดเคลื่อนทางยา</p>
            </div>
          </div>

          {/* User Controls & Google Workspace Integration */}
          <div className="flex items-center space-x-3">
            {/* Google Drive & Sheets Auth Button */}
            {googleUser ? (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs text-emerald-800">
                <img
                  src={googleUser.photoURL || 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png'}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full border border-emerald-300"
                />
                <span className="font-medium hidden md:inline truncate max-w-[130px]">{googleUser.displayName || googleUser.email}</span>
                <button
                  onClick={handleGoogleAuth}
                  title="Sign out from Google Workspace"
                  className="text-emerald-700 hover:text-emerald-950 ml-1 p-0.5 rounded"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleAuth}
                disabled={isSigningIn}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition shadow-2xs"
                title="Connect with Google Workspace to enable direct Google Sheets & Drive export"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>{isSigningIn ? 'Connecting...' : 'Google Sheets Sync'}</span>
              </button>
            )}

            {/* Development Mock User Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg text-left transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.display_name.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[150px]">{currentUser.display_name}</div>
                  <div className="flex items-center gap-1.5">
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-700">สลับผู้ใช้งานจำลอง (Mock User Switcher)</p>
                    <p className="text-[11px] text-slate-500">ทดสอบสิทธิ์ RBAC 4 ระดับ (Admin, Reviewer, Dept Head, Reporter)</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          const updated = store.setCurrentUser(u.id);
                          onUserChange(updated);
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-blue-50/70 transition ${
                          u.id === currentUser.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {u.display_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">{u.display_name}</span>
                            {getRoleBadge(u.role)}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{u.position}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        store.resetDemoData();
                        window.location.reload();
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center justify-center gap-1.5 w-full font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>รีเซ็ตข้อมูลตัวอย่าง (Reset Demo Data)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 border-t border-slate-100 text-sm font-medium">
          <button
            onClick={() => setCurrentTab('reports')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              currentTab === 'reports'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>รายงานอุบัติการณ์ (Reports)</span>
          </button>

          <button
            onClick={() => setCurrentTab('new')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              currentTab === 'new'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>เขียนรายงานใหม่ (20-Field Form)</span>
          </button>

          {['reviewer', 'admin'].includes(currentUser.role) && (
            <button
              onClick={() => setCurrentTab('hosxp')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                currentTab === 'hosxp'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>HOSxP Smart Import & Queue</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('rca')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              currentTab === 'rca'
                ? 'bg-rose-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-rose-700">การจัดการความเสี่ยง & RCA</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              currentTab === 'analytics'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>สถิติ & Risk Matrix</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              currentTab === 'settings'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>ตั้งค่าข้อมูลหลัก (Master Data)</span>
          </button>

          {/* LOG - Placed at the very end of navigation */}
          <button
            onClick={() => setCurrentTab('log')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              currentTab === 'log'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="font-bold">LOG</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
