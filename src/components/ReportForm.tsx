import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  FileCheck,
  Layers,
  Pill,
  PlusCircle,
  Save,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Video,
  X
} from 'lucide-react';
import {
  computeRmGrade,
  NCC_MERP_LEVELS,
  PROCESS_OPTIONS,
  validateReport,
  stripTitlePrefix,
  cleanSubtypeLabel,
  stripPiiClientSide,
  CORRECTIVE_ACTION_OPTIONS,
  CAUSE_CATEGORY_OPTIONS
} from '../../shared/form.js';
import { store } from '../services/store';

// Reusable Unified Staff Search & Select Combobox
// Allows typing keywords directly inside the box without separate search inputs
// Format: Staff Name (dark bold font) - Position (lighter font)
interface StaffComboboxProps {
  value: string;
  onChange: (val: string) => void;
  users: any[];
  placeholder?: string;
  allowUnknownStaff?: boolean;
  allowNoneOption?: boolean;
  noneLabel?: string;
  error?: string;
}

const StaffCombobox: React.FC<StaffComboboxProps> = ({
  value,
  onChange,
  users,
  placeholder = 'พิมพ์ค้นหาชื่อ หรือตำแหน่ง...',
  allowUnknownStaff = false,
  allowNoneOption = false,
  noneLabel = '— ไม่ระบุ / ไม่มี Specialist Staff —',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase().trim();
    return users.filter(u => {
      const clean = stripTitlePrefix(u.display_name || '').toLowerCase();
      return clean.includes(q);
    });
  }, [users, query]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder={isOpen && value ? `${value} (เลือกเพื่อเปลี่ยน หรือพิมพ์ค้นหา)` : placeholder}
          value={isOpen ? query : (value || '')}
          onFocus={() => {
            setQuery('');
            setIsOpen(true);
          }}
          onClick={() => {
            if (!isOpen) {
              setQuery('');
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          className={`w-full pl-9 pr-9 py-2.5 bg-slate-50 border rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all ${
            error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
          }`}
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        {value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              setQuery('');
            }}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            title="ล้างข้อมูล"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
          />
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-40 max-h-56 overflow-y-auto divide-y divide-slate-100 p-1.5 animate-in fade-in zoom-in-95 duration-100">
            {allowUnknownStaff && (
              <button
                type="button"
                onClick={() => {
                  onChange('ไม่ทราบเจ้าหน้าที่');
                  setIsOpen(false);
                  setQuery('');
                }}
                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition flex items-center justify-between ${
                  value === 'ไม่ทราบเจ้าหน้าที่'
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <span>⚠️ ไม่ทราบเจ้าหน้าที่</span>
              </button>
            )}

            {allowNoneOption && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                  setQuery('');
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-between ${
                  !value ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>{noneLabel}</span>
              </button>
            )}

            {filtered.length > 0 ? (
              filtered.map((u: any) => {
                const cleanName = stripTitlePrefix(u.display_name);
                const isSelected = value === cleanName;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      onChange(cleanName);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition flex items-center justify-between gap-2 border ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold'
                        : 'hover:bg-slate-50 border-transparent text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <span className="font-bold text-slate-900 truncate">{cleanName}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                ไม่พบเจ้าหน้าที่ตรงกับ "{query}"
              </div>
            )}
          </div>
        </>
      )}
      {error && <p className="text-xs text-rose-600 mt-1 font-semibold">{error}</p>}
    </div>
  );
};

// Detailed NCC-MERP Severity Category Descriptions and Protocols
const NCC_MERP_DESCRIPTIONS: Record<string, {
  title: string;
  category: string;
  grade: number;
  thaiSummary: string;
  thaiDetail: string;
  actionProtocol: string;
  theme: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    text: string;
  };
}> = {
  A: {
    title: 'ระดับ A - RM Grade 1',
    category: 'No Error / Potential - เหตุการณ์ที่มีโอกาสเกิด',
    grade: 1,
    thaiSummary: 'มีโอกาสเกิดความคลาดเคลื่อน',
    thaiDetail: 'มีเหตุการณ์หรือสภาพแวดล้อมที่อาจนำไปสู่ความคลาดเคลื่อนทางยาได้ แต่ยังไม่มีความผิดพลาดเกิดขึ้นจริง เช่น ยาคู่เหมือน LASA วางติดกันโดยไม่มีป้ายเตือน หรือลายมือแพทย์อ่านยากมาก',
    actionProtocol: 'ทบทวนสภาพแวดล้อมและจุดเสี่ยงเชิงป้องกันในหน่วยงาน',
    theme: {
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      badgeBg: 'bg-slate-200',
      badgeText: 'text-slate-800',
      text: 'text-slate-800'
    }
  },
  B: {
    title: 'ระดับ B - RM Grade 2',
    category: 'Error, No Harm - เกิดความคลาดเคลื่อนแต่ยังไม่ถึงผู้ป่วย',
    grade: 2,
    thaiSummary: 'เกิดความคลาดเคลื่อนแต่ยังไม่ถึงผู้ป่วย',
    thaiDetail: 'เกิดความคลาดเคลื่อนขึ้นในกระบวนการแล้ว แต่ถูกตรวจพบและสกัดกั้นไว้ได้ก่อนที่จะไปถึงตัวผู้ป่วย เช่น พิมพ์ฉลากยาผิดขนาด หรือจัดยาผิดชนิด แต่เภสัชกรหรือพยาบาลตรวจพบก่อนส่งมอบ',
    actionProtocol: 'บันทึกเป็น Near Miss เพื่อวิเคราะห์สาเหตุและปรับปรุงจุดตรวจสอบ Double Check',
    theme: {
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-900',
      text: 'text-sky-950'
    }
  },
  C: {
    title: 'ระดับ C - RM Grade 2',
    category: 'Error, No Harm - ยาถึงผู้ป่วยแต่ไม่เกิดอันตราย',
    grade: 2,
    thaiSummary: 'ยาถึงผู้ป่วยแต่ไม่เกิดอันตราย',
    thaiDetail: 'ความคลาดเคลื่อนไปถึงตัวผู้ป่วยแล้ว แต่ไม่ทำให้เกิดอันตรายหรือผลเสียต่อสุขภาพของผู้ป่วย เช่น ให้วิตามินช้ากว่าเวลา 1 ชม. หรือให้ยาเคลือบกระเพาะสลับมื้อ แต่ไม่มีผลข้างเคียง',
    actionProtocol: 'ประเมินอาการผู้ป่วย ชี้แจงให้ทราบ และทบทวนกระบวนการทำงานในระดับแผนก',
    theme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-900',
      text: 'text-emerald-950'
    }
  },
  D: {
    title: 'ระดับ D - RM Grade 2',
    category: 'Error, No Harm - ยาถึงผู้ป่วยและต้องเฝ้าระวังเพิ่มเติม',
    grade: 2,
    thaiSummary: 'ยาถึงผู้ป่วยและต้องเฝ้าระวังเพิ่มเติม',
    thaiDetail: 'ความคลาดเคลื่อนไปถึงผู้ป่วย และจำเป็นต้องมีการตรวจติดตาม เฝ้าระวัง หรือตรวจทางห้องปฏิบัติการเพิ่มเติม เพื่อยืนยันว่าผู้ป่วยปลอดภัยและไม่เกิดอันตราย เช่น ได้รับยาความดันโลหิตเกินขนาด ต้องวัด BP ทุก 15 นาที หรือตรวจระดับน้ำตาลในเลือดถี่ขึ้น',
    actionProtocol: 'เฝ้าระวังสัญญาณชีพหรือผลแล็บต่อเนื่อง และรายงานแพทย์เวรหรือหัวหน้าแผนกรับทราบ',
    theme: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      text: 'text-amber-950'
    }
  },
  E: {
    title: 'ระดับ E - RM Grade 3 - High Risk',
    category: 'Error, Harm - เกิดอันตรายชั่วคราวและต้องให้การรักษา',
    grade: 3,
    thaiSummary: 'เกิดอันตรายชั่วคราวและต้องให้การรักษา',
    thaiDetail: 'เกิดความคลาดเคลื่อนที่ส่งผลให้อวัยวะหรือร่างกายผู้ป่วยได้รับอันตรายชั่วคราว และจำเป็นต้องได้รับการรักษาหรือแก้ไขทางการแพทย์ เช่น ให้ยาขับปัสสาวะเกินขนาดจนเกิดภาวะ Hypokalemia ต้องให้ KCl ทดแทน หรือเกิดผื่นแพ้ยาต้องให้ Antihistamine',
    actionProtocol: 'ให้การรักษาแก้ไขทันที และรายงานทีมความเสี่ยงเพื่อดำเนินการทบทวน RCA เชิงระบบ',
    theme: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-900',
      text: 'text-orange-950'
    }
  },
  F: {
    title: 'ระดับ F - RM Grade 3 - High Risk',
    category: 'Error, Harm - เกิดอันตรายชั่วคราวและต้องนอน รพ. นานขึ้น',
    grade: 3,
    thaiSummary: 'เกิดอันตรายชั่วคราวและต้องนอน รพ. นานขึ้น',
    thaiDetail: 'เกิดอันตรายชั่วคราวต่อผู้ป่วย และเป็นสาเหตุทำให้ต้องเข้ารับการรักษาในโรงพยาบาลเป็นผู้ป่วยในสำหรับผู้ป่วยนอก หรือต้องนอนพักรักษาตัวในโรงพยาบาลนานขึ้นกว่าเดิมสำหรับผู้ป่วยใน',
    actionProtocol: 'รายงานแพทย์เจ้าของไข้และผู้อำนวยการหรือทีมความเสี่ยง จัดทีมทบทวน RCA เชิงระบบ',
    theme: {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      badgeBg: 'bg-orange-200',
      badgeText: 'text-orange-950',
      text: 'text-orange-950'
    }
  },
  G: {
    title: 'ระดับ G - RM Grade 4 - High Risk',
    category: 'Error, Harm - เกิดอันตรายถาวรแก่ผู้ป่วย',
    grade: 4,
    thaiSummary: 'เกิดอันตรายถาวรแก่ผู้ป่วย',
    thaiDetail: 'เกิดความคลาดเคลื่อนที่ส่งผลให้ผู้ป่วยเกิดอันตรายหรือความบกพร่องทางร่างกายหรือจิตใจอย่างถาวร สูญเสียอวัยวะหรือสมรรถภาพการทำงานของอวัยวะอย่างถาวร',
    actionProtocol: 'Sentinel Event: รายงานด่วนภายใน 24 ชม. ดูแลเยียวยาผู้ป่วยและครอบครัว และทำ RCA ทันที',
    theme: {
      bg: 'bg-rose-50',
      border: 'border-rose-400',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-900',
      text: 'text-rose-950'
    }
  },
  H: {
    title: 'ระดับ H - RM Grade 4 - High Risk',
    category: 'Error, Harm - ต้องทำการช่วยชีวิตหรือกู้ชีพ',
    grade: 4,
    thaiSummary: 'ต้องทำการช่วยชีวิตหรือกู้ชีพ Life-sustaining',
    thaiDetail: 'เกิดความคลาดเคลื่อนที่ทำให้ผู้ป่วยเข้าสู่ภาวะวิกฤตคุกคามต่อชีวิต และจำเป็นต้องได้รับการรักษาเพื่อช่วยชีวิตทันที เช่น CPR, ใส่ท่อช่วยหายใจ, ฉีด Adrenaline กู้ชีพ, ฟอกไตฉุกเฉิน',
    actionProtocol: 'Sentinel Event: รายงานด่วนผู้บริหารระดับสูงทันที และตั้งคณะกรรมการ RCA ภายใน 48 ชม.',
    theme: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-950',
      text: 'text-red-950'
    }
  },
  I: {
    title: 'ระดับ I - RM Grade 5 - High Risk',
    category: 'Error, Death - ผู้ป่วยเสียชีวิต',
    grade: 5,
    thaiSummary: 'ผู้ป่วยเสียชีวิต',
    thaiDetail: 'เกิดความคลาดเคลื่อนทางยาที่มีส่วนหรือเป็นสาเหตุโดยตรงทำให้ผู้ป่วยเสียชีวิต',
    actionProtocol: 'Sentinel Event ระดับสูงสุด: กระบวนการเยียวยาตาม ม.41 และทบทวน RCA ระดับองค์กร',
    theme: {
      bg: 'bg-purple-50',
      border: 'border-purple-400',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-950',
      text: 'text-purple-950'
    }
  }
};

interface ReportFormProps {
  initialData?: any;
  isEditMode?: boolean;
  onSuccess: (report: any) => void;
  onCancel?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel
}) => {
  const currentUser = store.getCurrentUser();
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const defaultDept = currentUser?.department_id || '';

  // 19 Standard Form Fields matching user's exact specification
  const [formData, setFormData] = useState<any>({
    patient_type: initialData?.patient_type || 'OPD', // 1. Patient Type: OPD / IPD / TELEMED (ลำดับ OPD IPD TELEMED)
    hn: initialData?.hn || '', // 2. HN
    incident_date: initialData?.incident_date || todayStr, // 3. วันที่เกิดเหตุ (Incident Date)
    incident_time: initialData?.incident_time || nowTime, // 4. เวลาเกิดเหตุ (Incident Time) 00:00 - 24:00 น.
    error_drug: initialData?.error_drug || '', // 5. ยาที่เกิดเหตุคลาดเคลื่อน (Error Drug)
    error_drug_strength: initialData?.error_drug_strength || '', // ความแรงของยาที่เกิดเหตุ
    intended_drug: initialData?.intended_drug || '', // 6. ยาที่ควรได้รับ (Intended Drug) (เว้นว่างได้หากไม่มีคู่ยา)
    intended_drug_strength: initialData?.intended_drug_strength || '', // ความแรงของยาที่ถูกต้อง
    process: initialData?.process || '', // 7. ขั้นตอนที่เกิดความคลาดเคลื่อน (ME Type) - ไม่แสดงข้อมูลไว้ก่อน
    me_subtype: initialData?.me_subtype || '', // 8. ชนิดความคลาดเคลื่อน - ไม่แสดงข้อมูลไว้ก่อน
    problem_description: initialData?.problem_description || '', // ลักษณะเหตุการณ์ที่เกิดขึ้น (ว่างได้)
    corrective_action: initialData?.corrective_action || '', // 9. การแก้ไขเบื้องต้น (ว่างได้)
    ncc_merp: initialData?.ncc_merp || '', // 11. ระดับความเสี่ยง NCC-MERP Severity (A - I) - ไม่แสดงข้อมูลไว้ก่อน
    rm_grade: initialData?.rm_grade || null,
    preventability: initialData?.preventability || '', // 12. ระดับความเสี่ยงที่ป้องกันได้ - ไม่แสดงข้อมูลไว้ก่อน
    cause_category: initialData?.cause_category || 'LASA', // 13. วิเคราะห์สาเหตุเบื้องต้น
    cause: initialData?.cause || '',
    origin_department_id: initialData?.origin_department_id || '', // 14. หน่วยงานที่เกิดความคลาดเคลื่อน - ไม่แสดงข้อมูลไว้ก่อน
    error_staff_reference: initialData?.error_staff_reference || '', // 15. เจ้าหน้าที่ที่เกี่ยวข้อง - ไม่แสดงข้อมูลไว้ก่อน
    consult_recipient_reference: initialData?.consult_recipient_reference || '', // 16. Specialist Staff (ว่างได้)
    detection_department_id: initialData?.detection_department_id || '', // 17. หน่วยงานตรวจพบ - ไม่แสดงข้อมูลไว้ก่อน
    reporter_reference: initialData?.reporter_reference || '', // 18. เจ้าหน้าที่ผู้ตรวจพบ - ไม่แสดงข้อมูลไว้ก่อน
    reported_date: initialData?.reported_date || todayStr, // 19. วันที่รายงาน
    recorded_by_reference: initialData?.recorded_by_reference || (currentUser?.display_name || '') // 20. ผู้บันทึก
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);

  // Search filter for ME Subtypes
  const [subtypeSearch, setSubtypeSearch] = useState('');

  // Search filter for Error Staff
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffList, setShowStaffList] = useState(false);

  // Autocomplete state for Error Drug & Intended Drug (Drug Formulary Generic Names)
  const [errorDrugSearch, setErrorDrugSearch] = useState(initialData?.error_drug || '');
  const [showErrorDrugList, setShowErrorDrugList] = useState(false);
  const [intendedSearch, setIntendedSearch] = useState(initialData?.intended_drug || '');
  const [showIntendedList, setShowIntendedList] = useState(false);

  useEffect(() => {
    if (initialData?.error_drug) setErrorDrugSearch(initialData.error_drug);
    if (initialData?.intended_drug) setIntendedSearch(initialData.intended_drug);
  }, [initialData]);

  // Master lists
  const departments = store.getDepartments();
  const allUsers = store.getUsers();
  const allSubtypes = store.getMeSubtypes();
  const drugCatalog = store.getDrugs();

  // Specialist Staff list: doctors flagged with is_specialist (for question 16)
  const specialistStaffList = useMemo(() => {
    return allUsers.filter(u => Boolean(u.is_specialist));
  }, [allUsers]);

  // Direct Search on Official Hospital Drug Catalog (517 registered formulary items)
  const filteredErrorDrugs = useMemo(() => {
    if (!errorDrugSearch.trim()) return drugCatalog.slice(0, 10);
    const q = errorDrugSearch.toLowerCase().trim();
    return drugCatalog.filter((d: any) =>
      d.name.toLowerCase().includes(q) ||
      (d.strength && d.strength.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [drugCatalog, errorDrugSearch]);

  const filteredIntendedDrugs = useMemo(() => {
    if (!intendedSearch.trim()) return drugCatalog.slice(0, 10);
    const q = intendedSearch.toLowerCase().trim();
    return drugCatalog.filter((d: any) =>
      d.name.toLowerCase().includes(q) ||
      (d.strength && d.strength.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [drugCatalog, intendedSearch]);

  // When ncc_merp changes, recompute rm_grade and ensure preventability >= ncc_merp (if already selected)
  useEffect(() => {
    if (!formData.ncc_merp) return;
    const computedGrade = computeRmGrade(formData.ncc_merp);
    const severityRank: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9 };
    const curRank = severityRank[formData.ncc_merp] || 1;

    setFormData((prev: any) => {
      if (!prev.preventability) {
        return {
          ...prev,
          rm_grade: computedGrade
        };
      }
      const prevRank = severityRank[prev.preventability] || 3;
      const validLevel = curRank > prevRank ? prev.ncc_merp : prev.preventability;
      return {
        ...prev,
        rm_grade: computedGrade,
        preventability: ['C', 'D', 'E', 'F', 'G', 'H', 'I'].includes(validLevel) ? validLevel : 'C'
      };
    });
  }, [formData.ncc_merp]);

  const originStaffList = useMemo(() => {
    return allUsers.filter(u => u.department_id === formData.origin_department_id);
  }, [allUsers, formData.origin_department_id]);

  const filteredOriginStaff = useMemo(() => {
    if (!staffSearch.trim()) return originStaffList;
    const q = staffSearch.toLowerCase().trim();
    return originStaffList.filter(u => {
      const clean = stripTitlePrefix(u.display_name).toLowerCase();
      const pos = (u.position || '').toLowerCase();
      return clean.includes(q) || pos.includes(q);
    });
  }, [originStaffList, staffSearch]);

  const detectionStaffList = useMemo(() => {
    return allUsers.filter(u => u.department_id === formData.detection_department_id);
  }, [allUsers, formData.detection_department_id]);

  // If process changes and subtype no longer matches, only adjust if already selected
  useEffect(() => {
    if (!formData.process) return;
    const availableSubtypes = allSubtypes.filter(m => m.process === formData.process);
    const currentMatches = availableSubtypes.some(m => m.code === formData.me_subtype);
    if (!currentMatches && availableSubtypes.length > 0 && formData.me_subtype) {
      setFormData((prev: any) => ({ ...prev, me_subtype: availableSubtypes[0].code }));
    }
  }, [formData.process, allSubtypes]);

  const filteredSubtypes = useMemo(() => {
    const processItems = allSubtypes.filter(m => m.process === formData.process);
    if (!subtypeSearch.trim()) return processItems;
    const q = subtypeSearch.toLowerCase().trim();
    return processItems.filter(m =>
      m.code.toLowerCase().includes(q) || m.label.toLowerCase().includes(q)
    );
  }, [allSubtypes, formData.process, subtypeSearch]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSelectErrorDrug = (drug: any) => {
    const name = typeof drug === 'string' ? drug : (drug?.name || '');
    const strength = typeof drug === 'object' && drug?.strength && drug.strength !== '-' ? drug.strength : '';
    const fullName = strength && !name.includes(strength) ? `${name} ${strength}` : name;
    setErrorDrugSearch(fullName);
    handleChange('error_drug', fullName);
    handleChange('error_drug_strength', strength);
    setShowErrorDrugList(false);
  };

  const handleSelectIntendedDrug = (drug: any) => {
    const name = typeof drug === 'string' ? drug : (drug?.name || '');
    const strength = typeof drug === 'object' && drug?.strength && drug.strength !== '-' ? drug.strength : '';
    const fullName = strength && !name.includes(strength) ? `${name} ${strength}` : name;
    setIntendedSearch(fullName);
    handleChange('intended_drug', fullName);
    handleChange('intended_drug_strength', strength);
    setShowIntendedList(false);
  };

  // Format time input helper (convert e.g. "23.59" -> "23:59")
  const handleTimeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let val = e.target.value.trim().replace('.', ':');
    if (/^\d{1,2}$/.test(val)) {
      val = `${val.padStart(2, '0')}:00`;
    } else if (/^\d{1,2}:\d{1,2}$/.test(val)) {
      const [h, m] = val.split(':');
      val = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    }
    handleChange('incident_time', val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Normalize time (replace . with :)
    const normalizedTime = (formData.incident_time || '').replace('.', ':').trim();

    const payload = {
      ...formData,
      incident_time: normalizedTime,
      error_drug: errorDrugSearch.trim(),
      error_drug_strength: (formData.error_drug_strength || '').trim(),
      intended_drug: intendedSearch.trim(),
      intended_drug_strength: (formData.intended_drug_strength || '').trim(),
      cause: `${formData.cause_category}${formData.cause ? ` - ${formData.cause}` : ''}`.trim()
    };

    const validation = validateReport(payload, isEditMode);
    const customErrors: Record<string, string> = { ...validation.errors };

    // 5. Error drug is required
    if (!payload.error_drug) {
      customErrors.error_drug = 'กรุณาระบุยาที่เกิดเหตุคลาดเคลื่อน (Error Drug)';
    }

    // 15. Error staff is required
    if (!payload.error_staff_reference) {
      customErrors.error_staff_reference = 'กรุณาระบุเจ้าหน้าที่ที่เกี่ยวข้อง หรือเลือก "ไม่ทราบเจ้าหน้าที่"';
    }

    // 18. Reporter is required
    if (!payload.reporter_reference) {
      customErrors.reporter_reference = 'กรุณาระบุเจ้าหน้าที่ผู้ตรวจพบ';
    }

    // Time validation (00:00 - 24:00)
    if (payload.incident_time) {
      const match = /^([01]\d|2[0-3]|24):([0-5]\d)$/.test(payload.incident_time);
      if (!match) {
        customErrors.incident_time = 'เวลาต้องอยู่ในช่วง 00:00 - 24:00 น. (เช่น 23.59)';
      }
    }

    if (Object.keys(customErrors).length > 0) {
      setErrors(customErrors);
      setIsSubmitting(false);

      const firstKey = Object.keys(customErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      let saved;
      if (isEditMode && initialData?.id) {
        saved = store.patchReport(initialData.id, payload);
      } else {
        saved = store.createReport(payload);
      }

      setSubmittedReport(saved);
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ _global: err.message || 'บันทึกรายงานไม่สำเร็จ' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndDuplicate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setDuplicateNotice(null);

    // Normalize time (replace . with :)
    const normalizedTime = (formData.incident_time || '').replace('.', ':').trim();

    // 1. Build and validate current report
    const payload = {
      ...formData,
      incident_time: normalizedTime,
      hn: formData.hn ? stripPiiClientSide(formData.hn) : '',
      error_drug: errorDrugSearch.trim(),
      error_drug_strength: (formData.error_drug_strength || '').trim(),
      intended_drug: intendedSearch.trim(),
      intended_drug_strength: (formData.intended_drug_strength || '').trim(),
      cause: `${formData.cause_category}${formData.cause ? ` - ${formData.cause}` : ''}`.trim(),
      reporter_reference: formData.reporter_reference,
      recorded_by_reference: formData.recorded_by_reference || (currentUser?.display_name || ''),
      status: 'pending',
      ever_verified: 0
    };

    const validation = validateReport(payload, isEditMode);
    const customErrors: Record<string, string> = { ...validation.errors };

    if (!payload.error_drug) {
      customErrors.error_drug = 'กรุณาระบุยาที่เกิดเหตุคลาดเคลื่อน';
    }

    if (!payload.error_staff_reference) {
      customErrors.error_staff_reference = 'กรุณาระบุเจ้าหน้าที่ที่เกี่ยวข้อง หรือเลือก "ไม่ทราบเจ้าหน้าที่"';
    }

    if (!payload.reporter_reference) {
      customErrors.reporter_reference = 'กรุณาระบุเจ้าหน้าที่ผู้ตรวจพบ';
    }

    if (payload.incident_time) {
      const match = /^([01]\d|2[0-3]|24):([0-5]\d)$/.test(payload.incident_time);
      if (!match) {
        customErrors.incident_time = 'เวลาต้องอยู่ในช่วง 00:00 - 24:00 น. (เช่น 23.59)';
      }
    }

    if (Object.keys(customErrors).length > 0) {
      setErrors(customErrors);
      setIsSubmitting(false);

      const firstKey = Object.keys(customErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const saved = isEditMode && initialData?.id
        ? store.patchReport(initialData.id, payload)
        : store.createReport(payload);

      // Duplicate report data for next step in the same incident:
      // Keep patient & drug info, but clear:
      // - process: ''
      // - me_subtype: ''
      // - origin_department_id: ''
      // - error_staff_reference: ''
      // - consult_recipient_reference: ''
      setFormData((prev: any) => ({
        ...prev,
        process: '',
        me_subtype: '',
        origin_department_id: '',
        error_staff_reference: '',
        consult_recipient_reference: ''
      }));
      setSubtypeSearch('');
      setErrors({});
      setDuplicateNotice(
        `✓ บันทึกรายงาน ${saved.report_no || saved.id} สำเร็จแล้ว! ข้อมูลผู้ป่วยและยาได้รับการคัดลอกมาแล้ว — กรุณาระบุ "ขั้นตอน", "ชนิดความคลาดเคลื่อน", และ "หน่วยงาน/เจ้าหน้าที่" สำหรับขั้นตอนถัดไป`
      );

      setTimeout(() => {
        const el = document.getElementById('field-process');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ _global: err.message || 'บันทึกรายงานไม่สำเร็จ' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNextReport = () => {
    setFormData({
      patient_type: 'OPD',
      hn: '',
      incident_date: todayStr,
      incident_time: nowTime,
      error_drug: '',
      error_drug_strength: '',
      intended_drug: '',
      intended_drug_strength: '',
      process: '',
      me_subtype: '',
      problem_description: '',
      corrective_action: '',
      ncc_merp: '',
      rm_grade: null,
      preventability: '',
      cause_category: 'LASA',
      cause: '',
      origin_department_id: '',
      error_staff_reference: '',
      consult_recipient_reference: '',
      detection_department_id: '',
      reporter_reference: '',
      reported_date: todayStr,
      recorded_by_reference: currentUser?.display_name || ''
    });
    setErrorDrugSearch('');
    setIntendedSearch('');
    setErrors({});
    setSubtypeSearch('');
    setSubmittedReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preventability levels available (C through I)
  const preventabilityLevels = ['C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const severityRank: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9 };
  const currentSeverityRank = severityRank[formData.ncc_merp] || 1;

  return (
    <div className="w-full space-y-6">
      {/* ส่วนหัวแบบฟอร์ม: ตกแต่งธีมสีและลูกแก้วเรืองแสงแบบปกหน้า Login */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-6 sm:p-7 shadow-lg border border-purple-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Decorative floating organic 3D spheres matching Login Cover theme */}
        <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-fuchsia-500 opacity-60 shadow-2xl absolute -bottom-14 -left-10 blur-[1px] pointer-events-none"></div>
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-purple-800 opacity-45 absolute -top-12 -right-8 blur-xs pointer-events-none"></div>
        <div className="w-28 h-28 rounded-full bg-fuchsia-500/25 absolute top-1/2 right-1/3 -translate-y-1/2 blur-lg pointer-events-none"></div>
        <div className="w-64 h-64 rounded-full bg-purple-500/20 blur-3xl absolute -top-16 -right-16 pointer-events-none"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-purple-100 text-[11px] font-semibold mb-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Medication Safety Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isEditMode ? 'แก้ไขรายงานความคลาดเคลื่อนทางยา' : 'บันทึกรายงานใหม่'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 font-normal leading-relaxed">
            ระบบบันทึกและบริหารจัดการความปลอดภัยทางยา ตามมาตรฐานสากล NCC-MERP
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 self-stretch md:self-auto shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-inner text-sm">
            {currentUser?.display_name?.charAt(0) || 'U'}
          </div>
          <div className="text-left text-xs">
            <div className="text-purple-200 font-medium">ผู้บันทึกระบบ</div>
            <div className="font-semibold text-white truncate max-w-[180px]">{currentUser?.display_name || 'ผู้ใช้งานระบบ'}</div>
          </div>
        </div>
      </div>

      {duplicateNotice && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{duplicateNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setDuplicateNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errors._global && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 shadow-sm animate-pulse">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-sm font-medium">{errors._global}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================
            ข้อมูลผู้ป่วยและวันเวลา
            ======================================================== */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">ข้อมูลผู้ป่วยและวันเวลา</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* 1. Patient Type: OPD / IPD / TELEMED (ลำดับ OPD IPD TELEMED) */}
            <div className="md:col-span-6" id="field-patient_type">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                1. Patient Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleChange('patient_type', 'OPD')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    formData.patient_type === 'OPD'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  OPD
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('patient_type', 'IPD')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    formData.patient_type === 'IPD'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  IPD
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('patient_type', 'TELEMED')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    formData.patient_type === 'TELEMED'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  TELEMED
                </button>
              </div>
              {errors.patient_type && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.patient_type}</p>}
            </div>

            {/* 2. HN */}
            <div className="md:col-span-6" id="field-hn">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                2. HN
              </label>
              <input
                type="text"
                placeholder="เช่น 000217057"
                value={formData.hn}
                onChange={(e) => handleChange('hn', e.target.value)}
                maxLength={20}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
              />
              {errors.hn && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.hn}</p>}
            </div>

            {/* 3. วันที่เกิดเหตุ (Incident Date) */}
            <div className="md:col-span-6" id="field-incident_date">
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>3. วันที่เกิดเหตุ (Incident Date)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                max={todayStr}
                value={formData.incident_date}
                onChange={(e) => handleChange('incident_date', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
              {errors.incident_date && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.incident_date}</p>}
            </div>

            {/* 4. เวลาเกิดเหตุ (Incident Time) */}
            <div className="md:col-span-6" id="field-incident_time">
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>4. เวลาเกิดเหตุ (Incident Time)</span>
              </label>
              <input
                type="text"
                placeholder="เช่น 23.59"
                value={formData.incident_time}
                onChange={(e) => handleChange('incident_time', e.target.value)}
                onBlur={handleTimeBlur}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
              />
              {errors.incident_time && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.incident_time}</p>}
            </div>
          </div>
        </div>

        {/* ========================================================
            รายละเอียดเหตุการณ์และการแก้ไข
            ======================================================== */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <Pill className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">รายละเอียดเหตุการณ์และการแก้ไข</h2>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 5. ยาที่เกิดเหตุคลาดเคลื่อน (Error Drug) */}
              <div className="relative" id="field-error_drug">
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-rose-500" />
                    <span>5. ยาที่เกิดเหตุคลาดเคลื่อน (Error Drug)</span>
                    <span className="text-rose-500">*</span>
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="พิมพ์ค้นหาชื่อยา เช่น Warfarin, Amlodipine, Ceftriaxone..."
                    value={errorDrugSearch}
                    onFocus={() => setShowErrorDrugList(true)}
                    onChange={(e) => {
                      setErrorDrugSearch(e.target.value);
                      handleChange('error_drug', e.target.value);
                      setShowErrorDrugList(true);
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-rose-50/25 border-2 border-rose-300 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/25 focus:border-rose-500 transition-all"
                  />
                  <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                  {errorDrugSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorDrugSearch('');
                        handleChange('error_drug', '');
                      }}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showErrorDrugList && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowErrorDrugList(false)}
                    />
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 max-h-60 overflow-y-auto divide-y divide-slate-100 p-1.5">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>บัญชียา</span>
                        <span className="text-[10px] text-slate-400 font-mono">ชื่อยา / ความแรง</span>
                      </div>
                      {filteredErrorDrugs.length > 0 ? (
                        filteredErrorDrugs.map((drug: any, idx: number) => (
                          <button
                            key={drug.id || idx}
                            type="button"
                            onClick={() => handleSelectErrorDrug(drug)}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-800 hover:bg-rose-50 hover:text-rose-900 rounded-xl transition-colors flex items-center justify-between gap-2"
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="font-bold text-slate-900 truncate">{drug.name}</span>
                              {drug.strength && drug.strength !== '-' && (
                                <span className="text-[11px] text-rose-700 font-semibold mt-0.5">
                                  ความแรง: <span className="font-mono">{drug.strength}</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {drug.is_had && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700">HAD</span>
                              )}
                              {drug.is_lasa && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700">LASA</span>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-xs text-slate-500 text-center font-medium">
                          สามารถพิมพ์ชื่อยาระบุได้โดยตรง
                        </div>
                      )}
                    </div>
                  </>
                )}

                {errors.error_drug && (
                  <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.error_drug}</p>
                )}
              </div>

              {/* 6. ยาที่ต้องการ (Intended Drug) */}
              <div className="relative" id="field-intended_drug">
                <label className="block text-sm font-bold text-emerald-800 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>6. ยาที่ต้องการ (Intended Drug)</span>
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="ระบุยาคู่เทียบ (ถ้ามี)..."
                    value={intendedSearch}
                    onFocus={() => setShowIntendedList(true)}
                    onChange={(e) => {
                      setIntendedSearch(e.target.value);
                      handleChange('intended_drug', e.target.value);
                      setShowIntendedList(true);
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-emerald-50/25 border-2 border-emerald-300 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all"
                  />
                  <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                  {intendedSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setIntendedSearch('');
                        handleChange('intended_drug', '');
                      }}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showIntendedList && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowIntendedList(false)}
                    />
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 max-h-60 overflow-y-auto divide-y divide-slate-100 p-1.5">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                        <span>บัญชียา</span>
                        <span className="text-[10px] text-emerald-600 font-mono">ชื่อยา / ความแรง</span>
                      </div>
                      {filteredIntendedDrugs.length > 0 ? (
                        filteredIntendedDrugs.map((drug: any, idx: number) => (
                          <button
                            key={drug.id || idx}
                            type="button"
                            onClick={() => handleSelectIntendedDrug(drug)}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl transition-colors flex items-center justify-between gap-2"
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="font-bold text-slate-900 truncate">{drug.name}</span>
                              {drug.strength && drug.strength !== '-' && (
                                <span className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                  ความแรง: <span className="font-mono">{drug.strength}</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {drug.is_had && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700">HAD</span>
                              )}
                              {drug.is_lasa && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700">LASA</span>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-xs text-slate-500 text-center font-medium">
                          สามารถพิมพ์ชื่อยาระบุได้โดยตรง
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 7. ขั้นตอนที่เกิดความคลาดเคลื่อน ( ME Type): 6 ขั้นตอน */}
            <div id="field-process">
              <label className="block text-sm font-bold text-slate-900 mb-2.5">
                7. ขั้นตอนที่เกิดความคลาดเคลื่อน ( ME Type) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
                {PROCESS_OPTIONS.map((proc: any) => {
                  const isSelected = formData.process === proc.code;
                  return (
                    <button
                      key={proc.code}
                      type="button"
                      onClick={() => {
                        handleChange('process', proc.code);
                        setSubtypeSearch('');
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-[1.02]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {proc.code}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div className="text-xs font-bold leading-tight">
                          {proc.english || proc.short}
                        </div>
                      </div>
                      <div className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500 font-medium'}`}>
                        {proc.thai || proc.short}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.process && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.process}</p>}
            </div>

            {/* 8. ชนิดความคลาดเคลื่อน */}
            <div id="field-me_subtype">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>8. ชนิดความคลาดเคลื่อน</span>
                  <span className="text-rose-500">*</span>
                </label>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="ค้นหาชนิดความคลาดเคลื่อน..."
                    value={subtypeSearch}
                    onChange={(e) => setSubtypeSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto border border-slate-300 rounded-2xl p-2 bg-slate-50/70 space-y-1.5">
                {filteredSubtypes.length > 0 ? (
                  filteredSubtypes.map((sub: any) => {
                    const isSelected = formData.me_subtype === sub.code;
                    return (
                      <label
                        key={sub.code}
                        onClick={() => handleChange('me_subtype', sub.code)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer text-xs transition-all border ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="me_subtype"
                          checked={isSelected}
                          onChange={() => handleChange('me_subtype', sub.code)}
                          className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1 font-medium">
                          <span className="font-mono font-bold text-indigo-700 mr-1.5">{sub.code}:</span>
                          <span>{cleanSubtypeLabel(sub.label)}</span>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    {!formData.process
                      ? 'กรุณาเลือกขั้นตอนที่เกิดความคลาดเคลื่อน (ข้อ 7) ก่อนเลือกชนิดความคลาดเคลื่อน'
                      : 'ไม่พบชนิดความคลาดเคลื่อนที่ตรงกับคำค้นหา'}
                  </div>
                )}
              </div>
              {errors.me_subtype && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.me_subtype}</p>}
            </div>

            {/* 9. ลักษณะเหตุการณ์ที่เกิดขึ้น & 10. การแก้ไขเบื้องต้น */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  9. ลักษณะเหตุการณ์ที่เกิดขึ้น
                </label>
                <textarea
                  rows={3}
                  placeholder="อธิบายเหตุการณ์ที่เกิดขึ้น เช่น ผู้ป่วยได้รับยาผิดขนาด, ลืมให้ยา..."
                  value={formData.problem_description}
                  onChange={(e) => handleChange('problem_description', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  10. การแก้ไขเบื้องต้น
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {CORRECTIVE_ACTION_OPTIONS.map((opt) => {
                    const isSelected = formData.corrective_action === opt || (formData.corrective_action && formData.corrective_action.includes(opt));
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (opt === 'อื่นๆ') {
                            if (!formData.corrective_action) {
                              handleChange('corrective_action', '');
                            }
                          } else {
                            handleChange('corrective_action', opt);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition text-left ${
                          isSelected
                            ? 'bg-purple-900 text-white border-purple-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  rows={3}
                  placeholder="คลิกเลือกตัวเลือกด้านบน หรือพิมพ์รายละเอียดการแก้ไขเบื้องต้น..."
                  value={formData.corrective_action}
                  onChange={(e) => handleChange('corrective_action', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            การประเมินระดับความเสี่ยง
            ======================================================== */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">การประเมินระดับความเสี่ยง</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* 11. ระดับความเสี่ยง NCC-MERP Severity */}
            <div id="field-ncc_merp">
              <label className="block text-sm font-bold text-slate-900 mb-2.5">
                11. ระดับความเสี่ยง NCC-MERP Severity <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {NCC_MERP_LEVELS.map((lvl) => {
                  const isSelected = formData.ncc_merp === lvl.code;
                  const isNearMiss = ['A', 'B'].includes(lvl.code);
                  const isNoHarm = ['C', 'D'].includes(lvl.code);
                  const isHarm = ['E', 'F'].includes(lvl.code);
                  const isSevere = ['G', 'H', 'I'].includes(lvl.code);

                  let colorClasses = 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100';
                  if (isSelected) {
                    if (isNearMiss) colorClasses = 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100 scale-105 font-bold';
                    else if (isNoHarm) colorClasses = 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100 scale-105 font-bold';
                    else if (isHarm) colorClasses = 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100 scale-105 font-bold';
                    else if (isSevere) colorClasses = 'bg-rose-700 text-white border-rose-700 shadow-md shadow-rose-100 scale-105 font-bold';
                  }

                  return (
                    <button
                      key={lvl.code}
                      type="button"
                      onClick={() => handleChange('ncc_merp', lvl.code)}
                      className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${colorClasses}`}
                    >
                      <span className="text-xl font-black tracking-tight font-mono">{lvl.code}</span>
                      <span className={`text-[10px] mt-0.5 line-clamp-1 font-semibold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                        {lvl.code === 'A' && 'Potential'}
                        {lvl.code === 'B' && 'ไม่ถึงผู้ป่วย'}
                        {lvl.code === 'C' && 'ไม่เกิดอันตราย'}
                        {lvl.code === 'D' && 'ต้องเฝ้าระวัง'}
                        {lvl.code === 'E' && 'อันตรายชั่วคราว'}
                        {lvl.code === 'F' && 'นอน รพ. นาน'}
                        {lvl.code === 'G' && 'อันตรายถาวร'}
                        {lvl.code === 'H' && 'กู้ชีพ'}
                        {lvl.code === 'I' && 'เสียชีวิต'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* คำอธิบายระดับความเสี่ยงเมื่อคลิกเลือก (NCC-MERP Severity Description) */}
              {NCC_MERP_DESCRIPTIONS[formData.ncc_merp] && (
                <div className={`mt-3.5 p-4 rounded-2xl border transition-all animate-in fade-in duration-200 ${NCC_MERP_DESCRIPTIONS[formData.ncc_merp].theme.bg} ${NCC_MERP_DESCRIPTIONS[formData.ncc_merp].theme.border}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2.5 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono tracking-tight shadow-2xs ${NCC_MERP_DESCRIPTIONS[formData.ncc_merp].theme.badgeBg} ${NCC_MERP_DESCRIPTIONS[formData.ncc_merp].theme.badgeText}`}>
                        ระดับ {formData.ncc_merp}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {NCC_MERP_DESCRIPTIONS[formData.ncc_merp].title}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      {NCC_MERP_DESCRIPTIONS[formData.ncc_merp].category}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className={`font-semibold leading-relaxed ${NCC_MERP_DESCRIPTIONS[formData.ncc_merp].theme.text}`}>
                      <span className="font-bold">คำอธิบาย:</span> {NCC_MERP_DESCRIPTIONS[formData.ncc_merp].thaiDetail}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-medium text-slate-700">
                      <span className="font-bold text-indigo-700">แนวทางปฏิบัติ:</span>
                      <span>{NCC_MERP_DESCRIPTIONS[formData.ncc_merp].actionProtocol}</span>
                    </div>
                  </div>
                </div>
              )}

              {errors.ncc_merp && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.ncc_merp}</p>}
            </div>

            {/* 12. ระดับความเสี่ยงที่ป้องกันได้ (Preventability) */}
            <div id="field-preventability">
              <label className="block text-sm font-bold text-slate-900 mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>12. ระดับความเสี่ยงที่ป้องกันได้ (Preventability)</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100 font-mono">
                  {formData.ncc_merp ? `เกณฑ์ ≥ ระดับ ${formData.ncc_merp}` : 'ระดับ C - I'}
                </span>
              </label>

              <div className="grid grid-cols-7 gap-2">
                {preventabilityLevels.map((lvl) => {
                  const isSelected = formData.preventability === lvl;
                  const rank = severityRank[lvl];
                  const isDisabled = rank < currentSeverityRank;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleChange('preventability', lvl)}
                      className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                        isDisabled
                          ? 'opacity-30 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 font-bold scale-105'
                          : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="text-lg font-black font-mono">{lvl}</span>
                    </button>
                  );
                })}
              </div>
              {errors.preventability && <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.preventability}</p>}
            </div>

            {/* 13. วิเคราะห์สาเหตุเบื้องต้น */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2.5">
                13. วิเคราะห์สาเหตุเบื้องต้น <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CAUSE_CATEGORY_OPTIONS.map((item) => {
                  const isSelected = formData.cause_category === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleChange('cause_category', item)}
                      className={`py-2.5 px-2.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white border-purple-900 shadow-xs'
                          : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {(formData.cause_category === 'อื่น ๆ' || formData.cause_category === 'อื่นๆ') && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="ระบุสาเหตุเพิ่มเติม..."
                    value={formData.cause}
                    onChange={(e) => handleChange('cause', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            หน่วยงานและบุคลากรที่เกี่ยวข้อง
            ======================================================== */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">หน่วยงานและบุคลากรที่เกี่ยวข้อง</h2>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* 14. หน่วยงานที่เกิดความคลาดเคลื่อน */}
              <div className="md:col-span-4" id="field-origin_department_id">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  14. หน่วยงานที่เกิดความคลาดเคลื่อน <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.origin_department_id}
                  onChange={(e) => {
                    const deptId = e.target.value;
                    handleChange('origin_department_id', deptId);
                    setStaffSearch('');
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value="">— เลือกหน่วยงานที่เกิดความคลาดเคลื่อน —</option>
                  {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.origin_department_id && (
                  <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.origin_department_id}</p>
                )}
              </div>

              {/* 15. เจ้าหน้าที่ที่เกี่ยวข้อง (+ ตัวเลือกไม่ทราบเจ้าหน้าที่) */}
              <div className="md:col-span-4" id="field-error_staff_reference">
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>15. เจ้าหน้าที่ที่เกี่ยวข้อง</span>
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <StaffCombobox
                  value={formData.error_staff_reference}
                  onChange={(val) => handleChange('error_staff_reference', val)}
                  users={originStaffList.length > 0 ? originStaffList : allUsers}
                  placeholder="พิมพ์ค้นหาชื่อ หรือตำแหน่งเจ้าหน้าที่..."
                  allowUnknownStaff={true}
                  error={errors.error_staff_reference}
                />
              </div>

              {/* 16. Specialist Staff */}
              <div className="md:col-span-4" id="field-consult_recipient_reference">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  16. Specialist Staff
                </label>
                <StaffCombobox
                  value={formData.consult_recipient_reference}
                  onChange={(val) => handleChange('consult_recipient_reference', val)}
                  users={specialistStaffList}
                  placeholder="พิมพ์ค้นหาชื่อ Specialist Staff..."
                  allowNoneOption={true}
                  noneLabel="— ไม่ระบุ / ไม่มี Specialist Staff —"
                />
              </div>

              {/* 17. หน่วยงานตรวจพบ */}
              <div className="md:col-span-4" id="field-detection_department_id">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  17. หน่วยงานตรวจพบ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.detection_department_id}
                  onChange={(e) => {
                    const deptId = e.target.value;
                    handleChange('detection_department_id', deptId);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value="">— เลือกหน่วยงานที่ตรวจพบ —</option>
                  {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.detection_department_id && (
                  <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errors.detection_department_id}</p>
                )}
              </div>

              {/* 18. เจ้าหน้าที่ผู้ตรวจพบ */}
              <div className="md:col-span-4" id="field-reporter_reference">
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>18. เจ้าหน้าที่ผู้ตรวจพบ</span>
                  <span className="text-rose-500">*</span>
                </label>
                <StaffCombobox
                  value={formData.reporter_reference}
                  onChange={(val) => handleChange('reporter_reference', val)}
                  users={detectionStaffList.length > 0 ? detectionStaffList : allUsers}
                  placeholder="พิมพ์ค้นหาชื่อผู้ตรวจพบ..."
                  error={errors.reporter_reference}
                />
              </div>

              {/* 19. วันที่รายงาน */}
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>19. วันที่รายงาน</span>
                  <span className="text-xs text-slate-500 font-medium">คำนวณอัตโนมัติ</span>
                </label>
                <input
                  type="date"
                  max={todayStr}
                  value={formData.reported_date}
                  onChange={(e) => handleChange('reported_date', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              {/* 20. ผู้บันทึก */}
              <div className="md:col-span-12 pt-2 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>20. ผู้บันทึก</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">ผู้ล็อกอินปัจจุบัน (สามารถค้นหาเปลี่ยนได้)</span>
                </label>
                <StaffCombobox
                  value={formData.recorded_by_reference}
                  onChange={(val) => handleChange('recorded_by_reference', val)}
                  users={allUsers}
                  placeholder="พิมพ์ค้นหาชื่อผู้บันทึก..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all"
            >
              ยกเลิก
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAndDuplicate}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            title="บันทึกรายงานนี้ และคัดลอกข้อมูลผู้ป่วย/ยาเพื่อบันทึกข้อผิดพลาดขั้นตอนอื่นในเหตุการณ์เดียวกัน"
          >
            <Copy className="w-4 h-4" />
            <span>บันทึกและคัดลอก</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 hover:from-purple-900 hover:to-indigo-900 text-white text-sm font-bold shadow-lg shadow-purple-950/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? 'กำลังบันทึกข้อมูล...'
              : isEditMode
              ? 'บันทึกการแก้ไข'
              : 'บันทึกรายงาน'}
          </button>
        </div>
      </form>

      {/* หน้าต่างสรุปผลสำเร็จหลังบันทึก */}
      {submittedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditMode ? 'อัปเดตรายงานเรียบร้อยแล้ว' : 'บันทึกรายงานความคลาดเคลื่อนสำเร็จ'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ระบบได้บันทึกรายงานเข้าสู่ระบบฐานข้อมูลเรียบร้อยแล้ว
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">รหัสรายงาน:</span>
                <span className="font-mono font-bold text-indigo-700">{submittedReport.report_no || submittedReport.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">1. Patient Type:</span>
                <span className="font-semibold text-slate-800">
                  {submittedReport.patient_type} {submittedReport.hn ? `(HN: ${submittedReport.hn})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">10. ระดับความเสี่ยง:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 font-bold">
                  ระดับ {submittedReport.ncc_merp} (Grade {submittedReport.rm_grade})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">7. ขั้นตอน (ME Type):</span>
                <span className="font-semibold text-slate-800">
                  {submittedReport.process} - {submittedReport.me_subtype}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">5. ยาที่เกิดเหตุคลาดเคลื่อน:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">
                  {submittedReport.error_drug}
                </span>
              </div>
              {submittedReport.intended_drug && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">6. ยาที่ควรได้รับ:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">
                    {submittedReport.intended_drug}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">วันและเวลาที่เกิดเหตุ:</span>
                <span className="font-semibold text-slate-800">
                  {submittedReport.incident_date} {submittedReport.incident_time ? `เวลา ${submittedReport.incident_time} น.` : ''}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleResetForNextReport}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  บันทึกรายงานถัดไปทันที
                </button>
              )}

              <button
                type="button"
                onClick={() => onSuccess(submittedReport)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isEditMode
                    ? 'w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
                    : 'flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                ดูรายการรายงานทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
