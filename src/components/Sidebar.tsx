import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  ShieldAlert,
  UploadCloud,
  BarChart3,
  Settings,
  Users,
  ScrollText,
  HelpCircle,
  LogOut,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Plus,
  Database,
  Building2,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { googleSignIn, googleSignOut } from '../services/googleWorkspace';
import { store } from '../services/store';
import { LoginModal } from './LoginModal';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: any;
  onUserChange: (user: any) => void;
  googleUser: any;
  setGoogleUser: (user: any) => void;
  onNewReport: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onUserChange,
  googleUser,
  setGoogleUser,
  onNewReport,
  isCollapsed,
  setIsCollapsed
}) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
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
        return <span className="bg-purple-100 text-purple-900 text-[11px] px-2 py-0.5 rounded-full font-bold border border-purple-200">Admin</span>;
      case 'reviewer':
        return <span className="bg-blue-100 text-blue-900 text-[11px] px-2 py-0.5 rounded-full font-bold border border-blue-200">Reviewer</span>;
      case 'dept_head':
        return <span className="bg-amber-100 text-amber-900 text-[11px] px-2 py-0.5 rounded-full font-bold border border-amber-200">Dept Head</span>;
      case 'reporter':
      default:
        return <span className="bg-emerald-100 text-emerald-900 text-[11px] px-2 py-0.5 rounded-full font-bold border border-emerald-200">Reporter</span>;
    }
  };

  const navItems = [
    {
      section: 'ระบบรายงาน',
      items: [
        {
          id: 'reports',
          label: 'รายการรายงาน',
          sublabel: 'ตารางข้อมูลอุบัติการณ์',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      section: 'การจัดการ Master Data',
      items: [
        {
          id: 'settings',
          label: 'การจัดการ Master Data',
          sublabel: 'แผนก, เจ้าหน้าที่, ยาเสี่ยงสูง',
          icon: Settings,
          badge: null
        },
        {
          id: 'log',
          label: 'LOG ระบบ',
          sublabel: 'ประวัติการบันทึก & ตรวจสอบ',
          icon: ScrollText,
          badge: null
        }
      ]
    }
  ];

  return (
    <>
      <aside
        className={`bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } min-h-screen sticky top-0 h-screen overflow-y-auto shadow-xs`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 via-indigo-700 to-purple-900 flex items-center justify-center text-white shadow-md shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 tracking-tight leading-snug truncate">
                    MED ERROR REGISTRY
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    ระบบความปลอดภัยทางยา
                  </div>
                </div>
              )}
            </div>

            {/* Collapse toggle button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'ขยายเมนู' : 'ย่อเมนู'}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shrink-0"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Add Button with Green Circle + and NEW Bubble Badge */}
          <div className="p-3">
            <button
              onClick={onNewReport}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 hover:from-purple-900 hover:to-indigo-900 shadow-md shadow-purple-950/25 transition active:scale-[0.98] cursor-pointer group ${
                isCollapsed ? 'px-0' : ''
              }`}
              title="บันทึกรายงานใหม่"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 group-hover:bg-emerald-400 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
              {!isCollapsed && (
                <>
                  <span className="tracking-tight">บันทึกรายงานใหม่</span>
                  <span className="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-black text-[9px] tracking-wider uppercase shadow-xs">
                    NEW
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="px-3 space-y-5 mt-2">
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    {group.section}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id)}
                        title={item.label}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all text-left ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-md shadow-purple-950/20'
                            : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isActive ? 'text-purple-200' : 'text-slate-400'
                              }`}
                            >
                              {item.sublabel}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Help, User Account, Google Sync */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 font-medium text-xs transition"
            title="คู่มือการใช้งาน & มาตรฐาน"
          >
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            {!isCollapsed && <span>คู่มือ & มาตรฐานความปลอดภัย</span>}
          </button>

          {/* Google Workspace Button */}
          {googleUser ? (
            <div
              className={`flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 px-2.5 py-2 rounded-xl text-xs text-emerald-900 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={googleUser.photoURL || 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png'}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full border border-emerald-300 shrink-0"
                />
                {!isCollapsed && (
                  <span className="truncate font-semibold text-[11px]">
                    {googleUser.displayName || googleUser.email}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={handleGoogleAuth}
                  title="ยกเลิกการเชื่อมต่อ Google"
                  className="text-emerald-700 hover:text-emerald-950 p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleGoogleAuth}
              disabled={isSigningIn}
              className={`w-full flex items-center gap-2.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 transition shadow-2xs ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title="เชื่อมต่อ Google Sheets เพื่อส่งออกข้อมูล"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {!isCollapsed && <span>{isSigningIn ? 'Connecting...' : 'Google Sheets Sync'}</span>}
            </button>
          )}

          {/* Current User Pill / Switcher & Log Out */}
          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={() => setShowUserModal(true)}
              className={`flex-1 flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition text-left ${
                isCollapsed ? 'justify-center p-1.5' : ''
              }`}
              title="คลิกเพื่อสลับผู้ใช้งาน / เข้าสู่ระบบ"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser ? currentUser.display_name.charAt(0) : '?'}
              </div>
              {!isCollapsed && (
                currentUser ? (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                      {currentUser.display_name}
                    </div>
                    <div className="mt-0.5">{getRoleBadge(currentUser.role)}</div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      เข้าสู่ระบบ
                    </div>
                    <div className="text-[10px] text-slate-400">ยังไม่ได้เข้าสู่ระบบ</div>
                  </div>
                )
              )}
            </button>
            {!isCollapsed && currentUser && (
              <button
                onClick={() => {
                  store.logout();
                  onUserChange(null);
                }}
                title="ออกจากระบบ (Log Out)"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Login & Switch User Modal with Password Verification */}
      <LoginModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSuccess={(user) => {
          onUserChange(user);
          setShowUserModal(false);
        }}
        isMandatory={false}
      />

      {/* Hospital Standard Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">คู่มือ & มาตรฐานระบบความปลอดภัยทางยา</h3>
                <p className="text-xs text-slate-500">Medication Safety Standards & Guidelines</p>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700 leading-relaxed">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-1 text-sm">การจัดลำดับความรุนแรงตามมาตรฐาน NCC-MERP (ระดับ A - I)</h4>
                <ul className="list-disc pl-5 space-y-1 text-blue-800 text-[11px]">
                  <li><strong>A:</strong> มีโอกาสเกิดความคลาดเคลื่อน (Circumstances or events have capacity to cause error)</li>
                  <li><strong>B:</strong> เกิดความคลาดเคลื่อนแต่ยังไม่ถึงตัวผู้ป่วย (Error occurred but did not reach patient)</li>
                  <li><strong>C:</strong> ยาถึงผู้ป่วยแต่ไม่เกิดอันตราย (Error reached patient, did not cause harm)</li>
                  <li><strong>D:</strong> ยาถึงผู้ป่วย ต้องเฝ้าระวังเพิ่มเติม (Reached patient, required monitoring)</li>
                  <li><strong>E - I (E-up High Risk):</strong> เกิดอันตรายต่อผู้ป่วย ต้องได้รับการทบทวน RCA โดยทีม PTC/RM ทุกเคส</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">อัตราอุบัติการณ์ต่อ 1,000 ใบสั่งยา (Prescription Volume Denominator)</h4>
                <p className="text-slate-600">
                  ระบบคำนวณอัตราความคลาดเคลื่อนทางยาต่อ 1,000 ใบสั่งยา ทั้งผู้ป่วยนอก (OPD) และผู้ป่วยใน (IPD) โดยใช้จำนวนใบสั่งยาจริงที่บันทึกไว้ในแต่ละเดือนเป็นตัวหาร เพื่อให้เปรียบเทียบแนวโน้มได้อย่างถูกต้องตามมาตรฐาน Hospital Accreditation (HA)
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">การนำเข้าข้อมูลจาก HOSxP Smart Import</h4>
                <p className="text-slate-600">
                  ไฟล์ที่ส่งออกจาก HOSxP 12 คอลัมน์มาตรฐานจะถูกตัดข้อมูลส่วนบุคคล (ชื่อผู้ป่วย) ออกทันทีในบราวเซอร์ (Client-side PDPA) เมื่ออนุมัติข้อมูลจะถูกบันทึกเป็นรายงานสถานะ Pending ให้ผู้รายงานและทีมตรวจสอบรายละเอียดเพิ่มเติมได้
                </p>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
