import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  Award,
  Briefcase,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Layers,
  ListPlus,
  Pill,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { COMMON_LASA_PAIRS, HIGH_ALERT_DRUGS_KEYWORDS, PROCESS_OPTIONS, stripTitlePrefix, cleanSubtypeLabel } from '../../shared/form.js';
import { store, type LasaPair } from '../services/store';
const getHadClinicalInfo = (drugName: string) => {
  const lower = drugName.toLowerCase();
  if (lower.includes('potassium') || lower.includes('kcl')) {
    return {
      group: 'Electrolytes เข้มข้น',
      risk: 'หัวใจเต้นผิดจังหวะรุนแรง / Cardiac Arrest',
      protocol: 'ห้ามฉีด IV Push เด็ดขาด, เจือจางและใช้ Infusion pump เท่านั้น',
      antidote: 'Calcium gluconate, Insulin + D50W, Kayexalate'
    };
  }
  if (lower.includes('insulin')) {
    return {
      group: 'Insulin (กลุ่มเบาหวาน)',
      risk: 'ภาวะน้ำตาลในเลือดต่ำเฉียบพลัน (Hypoglycemia) โคม่า',
      protocol: 'ใช้เข็มฉีด Insulin syringe เท่านั้น, Double Check ขนาดยาและระดับน้ำตาล',
      antidote: 'Glucose / Dextrose 50%, Glucagon'
    };
  }
  if (lower.includes('heparin') || lower.includes('enoxaparin')) {
    return {
      group: 'Anticoagulant (ยาต้านการแข็งตัวของเลือด)',
      risk: 'เลือดออกรุนแรงในอวัยวะสำคัญ (Severe Hemorrhage)',
      protocol: 'ทวนสอบค่า aPTT / Anti-Xa, ตรวจสอบหน่วย Unit ชัดเจน',
      antidote: 'Protamine sulfate'
    };
  }
  if (lower.includes('warfarin')) {
    return {
      group: 'Anticoagulant (ยาต้านการแข็งตัวของเลือดชนิดกิน)',
      risk: 'ภาวะเลือดออกผิดปกติ, เลือดออกในสมอง',
      protocol: 'ทวนสอบค่า INR ล่าสุด, สติกเกอร์สีเตือนขนาดเม็ด 2/3/5 mg',
      antidote: 'Vitamin K1 (Phytomenadione), FFP, Prothrombin Complex'
    };
  }
  if (lower.includes('morphine') || lower.includes('fentanyl') || lower.includes('pethidine')) {
    return {
      group: 'Opioid Analgesics (ยาแก้ปวดเสพติด)',
      risk: 'กดการหายใจ (Respiratory depression), หมดสติ, ความดันตก',
      protocol: 'ประเมิน Sedation score & RR ก่อน-หลังให้ยา, Double Check บันทึกยาสารเสพติด',
      antidote: 'Naloxone injection'
    };
  }
  if (lower.includes('adrenaline') || lower.includes('epinephrine') || lower.includes('noradrenaline') || lower.includes('norepinephrine') || lower.includes('dopamine') || lower.includes('dobutamine')) {
    return {
      group: 'Inotropes & Vasopressors',
      risk: 'ความดันโลหิตสูงรุนแรง, กล้ามเนื้อหัวใจขาดเลือด, Extravasation tissue necrosis',
      protocol: 'ให้ทาง Central line เมื่อเป็นไปได้, ติดตาม BP & EKG ต่อเนื่อง',
      antidote: 'Phentolamine (สำหรับ Extravasation), Vasodilator'
    };
  }
  if (lower.includes('digoxin')) {
    return {
      group: 'Cardiac Glycoside',
      risk: 'ภาวะพิษจากดิจิทาลิส (Digoxin toxicity), Arrhythmia',
      protocol: 'ทวนสอบ Serum Digoxin level & Serum K+, ตรวจ HR ก่อนให้ยา',
      antidote: 'Digoxin-specific Fab fragments (DigiFab)'
    };
  }
  if (lower.includes('methotrexate') || lower.includes('fluorouracil') || lower.includes('cisplatin') || lower.includes('cyclophosphamide')) {
    return {
      group: 'Chemotherapy / Cytotoxic',
      risk: 'กดไขกระดูกรุนแรง, เป็นพิษต่อเซลล์สิ่งแวดล้อม',
      protocol: 'เตรียมในตู้ Biosafety cabinet, Double check พื้นที่ผิวกาย (BSA) โดยเภสัชกร 2 ท่าน',
      antidote: 'Leucovorin (สำหรับ MTX), Mesna (สำหรับ Cyclophosphamide)'
    };
  }
  return {
    group: 'High Alert Drug ทั่วไป',
    risk: 'ผลข้างเคียงร้ายแรงหากได้รับยาผิดขนาดหรือผิดวิธี',
    protocol: 'Independent Double Check ก่อนจ่ายยาและก่อนบริหารยาแก่ผู้ป่วย',
    antidote: 'ตามดุลยพินิจของแพทย์เฉพาะทางและศูนย์พิษวิทยา'
  };
};

export const MasterManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'depts' | 'users' | 'positions' | 'subtypes' | 'drugs' | 'had_lasa'>('depts');

  // Departments State
  const [departments, setDepartments] = useState(store.getDepartments());
  const [newDept, setNewDept] = useState({ code: '', name: '' });
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editDeptData, setEditDeptData] = useState({ code: '', name: '' });

  // Positions State (ตำแหน่งงาน & Specialist Staff)
  const [positions, setPositions] = useState<string[]>(store.getPositions());
  const [newPositionName, setNewPositionName] = useState('');
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [editPositionName, setEditPositionName] = useState('');

  // Users State (No Email, No Title Prefix, No Position)
  const [users, setUsers] = useState(store.getUsers());
  const [userDeptFilter, setUserDeptFilter] = useState('all');
  const [userKeywordSearch, setUserKeywordSearch] = useState('');
  const [newUser, setNewUser] = useState({
    display_name: '',
    role: 'reporter',
    department_id: departments[0]?.id || '',
    is_specialist: false,
    password: ''
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<any>({});
  const [showPasswordIds, setShowPasswordIds] = useState<Set<string>>(new Set());
  const toggleShowPassword = (id: string) => {
    setShowPasswordIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const [selectedHadDrugId, setSelectedHadDrugId] = useState('');

  // Subtypes State
  const [selectedProcess, setSelectedProcess] = useState('PRE');
  const [subtypes, setSubtypes] = useState(store.getMeSubtypes());
  const [newSubtype, setNewSubtype] = useState({ code: '', label: '', process: 'PRE' });

  // Drugs State (Simplified: ชื่อยา / ความแรง, HAD และ LASA จัดการผ่านบัญชีเฉพาะ)
  const [drugs, setDrugs] = useState(store.getDrugs());
  const [drugSearch, setDrugSearch] = useState('');
  const [drugFilter, setDrugFilter] = useState<'all' | 'had_or_lasa' | 'had' | 'lasa'>('all');
  const [drugPage, setDrugPage] = useState(1);
  const drugPageSize = 35;

  const filteredDrugs = useMemo(() => {
    return drugs
      .filter(d => {
        if (drugFilter === 'had_or_lasa') return d.is_had || d.is_lasa;
        if (drugFilter === 'had') return d.is_had;
        if (drugFilter === 'lasa') return d.is_lasa;
        return true;
      })
      .filter(d => {
        if (!drugSearch.trim()) return true;
        const term = drugSearch.toLowerCase().trim();
        return (
          d.name.toLowerCase().includes(term) ||
          (d.generic_name && d.generic_name.toLowerCase().includes(term)) ||
          (d.strength && d.strength.toLowerCase().includes(term))
        );
      });
  }, [drugs, drugFilter, drugSearch]);

  const totalDrugPages = Math.max(1, Math.ceil(filteredDrugs.length / drugPageSize));
  const paginatedDrugs = useMemo(() => {
    const start = (drugPage - 1) * drugPageSize;
    return filteredDrugs.slice(start, start + drugPageSize);
  }, [filteredDrugs, drugPage]);

  const [newDrug, setNewDrug] = useState({
    name: '',
    strength: ''
  });
  const [editingDrugId, setEditingDrugId] = useState<string | null>(null);
  const [editDrugData, setEditDrugData] = useState<any>({});

  // LASA Pairs & HAD Registry State & Handlers
  const [lasaPairs, setLasaPairs] = useState(store.getLasaPairs());
  const [hadLasaSubTab, setHadLasaSubTab] = useState<'lasa_pairs' | 'had_registry' | 'had_guidelines'>('lasa_pairs');
  const [lasaSearch, setLasaSearch] = useState('');
  const [hadSearch, setHadSearch] = useState('');
  const [newPair, setNewPair] = useState({
    drugA: '',
    drugB: '',
    similarity_type: 'both' as 'look_alike' | 'sound_alike' | 'both',
    tallmanA: '',
    tallmanB: '',
    category: 'Oral Tablet',
    note: ''
  });
  const [editingPairId, setEditingPairId] = useState<string | null>(null);
  const [editPairData, setEditPairData] = useState<any>({});

  const filteredLasaPairs = useMemo(() => {
    if (!lasaSearch.trim()) return lasaPairs;
    const term = lasaSearch.toLowerCase().trim();
    return lasaPairs.filter(p =>
      p.drugA.toLowerCase().includes(term) ||
      p.drugB.toLowerCase().includes(term) ||
      (p.tallmanA && p.tallmanA.toLowerCase().includes(term)) ||
      (p.tallmanB && p.tallmanB.toLowerCase().includes(term)) ||
      (p.note && p.note.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term))
    );
  }, [lasaPairs, lasaSearch]);

  const filteredHadDrugs = useMemo(() => {
    const hadList = drugs.filter(d => d.is_had);
    if (!hadSearch.trim()) return hadList;
    const term = hadSearch.toLowerCase().trim();
    return hadList.filter(d =>
      d.name.toLowerCase().includes(term) ||
      (d.strength && d.strength.toLowerCase().includes(term)) ||
      (d.generic_name && d.generic_name.toLowerCase().includes(term))
    );
  }, [drugs, hadSearch]);

  const handleAddLasaPair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPair.drugA.trim() || !newPair.drugB.trim()) {
      alert('กรุณากรอกชื่อยาทั้ง 2 ตัวที่จะจับคู่ LASA');
      return;
    }
    store.addLasaPair({
      drugA: newPair.drugA,
      drugB: newPair.drugB,
      similarity_type: newPair.similarity_type,
      tallmanA: newPair.tallmanA || newPair.drugA,
      tallmanB: newPair.tallmanB || newPair.drugB,
      category: newPair.category,
      note: newPair.note
    });
    setLasaPairs([...store.getLasaPairs()]);
    setDrugs([...store.getDrugs()]);
    setNewPair({
      drugA: '',
      drugB: '',
      similarity_type: 'both',
      tallmanA: '',
      tallmanB: '',
      category: 'Oral Tablet',
      note: ''
    });
  };

  const handleSaveEditPair = (id: string) => {
    if (!editPairData.drugA?.trim() || !editPairData.drugB?.trim()) return;
    store.updateLasaPair(id, editPairData);
    setLasaPairs([...store.getLasaPairs()]);
    setEditingPairId(null);
  };

  const handleDeleteLasaPair = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบการจับคู่ยา LASA นี้?')) {
      store.deleteLasaPair(id);
      setLasaPairs([...store.getLasaPairs()]);
    }
  };

  // Drug Handlers
  const handleAddDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.name.trim()) return;
    store.addDrug({
      name: newDrug.name.trim(),
      strength: newDrug.strength.trim(),
      is_had: false,
      is_lasa: false
    });
    setDrugs([...store.getDrugs()]);
    setNewDrug({
      name: '',
      strength: ''
    });
  };

  const handleAddDrugToHad = (drugId: string) => {
    if (!drugId) return;
    store.setDrugHadStatus(drugId, true);
    setDrugs([...store.getDrugs()]);
    setSelectedHadDrugId('');
  };

  const handleToggleHad = (id: string) => {
    store.toggleHadStatus(id);
    setDrugs([...store.getDrugs()]);
  };

  const handleToggleLasa = (id: string) => {
    store.toggleLasaStatus(id);
    setDrugs([...store.getDrugs()]);
  };

  const handleSaveEditDrug = (id: string) => {
    store.updateDrug(id, editDrugData);
    setDrugs([...store.getDrugs()]);
    setEditingDrugId(null);
  };

  const handleDeleteDrug = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการยานี้ออกจากระบบ?')) {
      store.deleteDrug(id);
      setDrugs([...store.getDrugs()]);
    }
  };

  // --- Department Handlers ---
  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.code || !newDept.name) return;
    store.addDepartment(newDept);
    setDepartments([...store.getDepartments()]);
    setNewDept({ code: '', name: '' });
  };

  const handleSaveEditDept = (id: string) => {
    store.updateDepartment(id, editDeptData);
    setDepartments([...store.getDepartments()]);
    setEditingDeptId(null);
  };

  const handleDeleteDept = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหน่วยงานนี้?')) {
      store.deleteDepartment(id);
      setDepartments([...store.getDepartments()]);
    }
  };

  // --- User Handlers ---
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.display_name.trim()) return;
    store.addUser({
      display_name: stripTitlePrefix(newUser.display_name.trim()),
      role: newUser.role,
      department_id: newUser.department_id || departments[0]?.id || '',
      is_specialist: Boolean(newUser.is_specialist),
      password: newUser.password ? newUser.password.trim() : (newUser.role === 'admin' ? '654321' : '123456')
    });
    setUsers([...store.getUsers()]);
    setNewUser({
      display_name: '',
      role: 'reporter',
      department_id: departments[0]?.id || '',
      is_specialist: false,
      password: ''
    });
  };

  const handleSaveEditUser = (id: string) => {
    const payload = { ...editUserData };
    if (payload.display_name) {
      payload.display_name = stripTitlePrefix(payload.display_name.trim());
    }
    store.updateUser(id, payload);
    setUsers([...store.getUsers()]);
    setEditingUserId(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเจ้าหน้าที่ท่านนี้?')) {
      store.deleteUser(id);
      setUsers([...store.getUsers()]);
    }
  };

  // --- Position Handlers ---
  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositionName.trim()) return;
    store.addPosition(newPositionName.trim());
    setPositions([...store.getPositions()]);
    setNewPositionName('');
  };

  const handleSaveEditPosition = (oldName: string) => {
    if (!editPositionName.trim()) return;
    store.updatePosition(oldName, editPositionName.trim());
    setPositions([...store.getPositions()]);
    setUsers([...store.getUsers()]);
    setEditingPosition(null);
    setEditPositionName('');
  };

  const handleDeletePosition = (name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่ง "${name}"?`)) {
      try {
        store.deletePosition(name);
        setPositions([...store.getPositions()]);
        setUsers([...store.getUsers()]);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // --- Subtype Handlers ---
  const handleAddSubtype = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtype.code || !newSubtype.label) return;
    store.addMeSubtype({ ...newSubtype, process: selectedProcess });
    setSubtypes([...store.getMeSubtypes()]);
    setNewSubtype({ code: '', label: '', process: selectedProcess });
  };

  const handleDeleteSubtype = (code: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบชนิดย่อย ${code}?`)) {
      store.deleteMeSubtype(code);
      setSubtypes([...store.getMeSubtypes()]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner with Login Cover Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-6 sm:p-7 shadow-lg border border-purple-800/30">
        {/* Floating organic 3D spheres matching Login Cover theme */}
        <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-fuchsia-500 opacity-60 shadow-2xl absolute -bottom-14 -left-10 blur-[1px] pointer-events-none"></div>
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-purple-800 opacity-45 absolute -top-12 -right-8 blur-xs pointer-events-none"></div>
        <div className="w-28 h-28 rounded-full bg-fuchsia-500/25 absolute top-1/2 right-1/3 -translate-y-1/2 blur-lg pointer-events-none"></div>
        <div className="w-64 h-64 rounded-full bg-purple-500/20 blur-3xl absolute -top-16 -right-16 pointer-events-none"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-purple-100 text-[11px] font-semibold mb-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Medication Safety Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-purple-300" />
            <span>ตั้งค่าข้อมูลหลัก (Master Data & Clinical Settings)</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal max-w-2xl">
            จัดการหน่วยงาน, เจ้าหน้าที่และบทบาท (รวม Specialist Staff), ตัวเลือกชนิดความคลาดเคลื่อน, บัญชียา และการจับคู่ยา HAD/LASA
          </p>
        </div>
      </div>

      {/* Navigation Tabs Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        {/* Master Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('depts')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl transition cursor-pointer ${
              activeTab === 'depts' ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs' : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>หน่วยงาน</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl transition cursor-pointer ${
              activeTab === 'users' ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs' : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>เจ้าหน้าที่</span>
          </button>

          <button
            onClick={() => setActiveTab('subtypes')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl transition cursor-pointer ${
              activeTab === 'subtypes' ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs' : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span>ชนิดความคลาดเคลื่อน</span>
          </button>

          <button
            onClick={() => setActiveTab('drugs')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl transition cursor-pointer ${
              activeTab === 'drugs' ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs' : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>บัญชียา</span>
          </button>

          <button
            onClick={() => setActiveTab('had_lasa')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl transition cursor-pointer ${
              activeTab === 'had_lasa' ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs' : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>บัญชี HAD</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Departments */}
      {activeTab === 'depts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Dept Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>เพิ่มหน่วยงานใหม่</span>
            </h3>
            <form onSubmit={handleAddDept} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">รหัสหน่วยงาน (Code) *</label>
                <input
                  type="text"
                  placeholder="เช่น IPD3, NICU, DENT"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ชื่อหน่วยงาน (Department Name) *</label>
                <input
                  type="text"
                  placeholder="เช่น หอผู้ป่วยวิกฤตทารกแรกเกิด (NICU)"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs transition"
              >
                เพิ่มหน่วยงาน (Add Department)
              </button>
            </form>
          </div>

          {/* Dept List Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 font-bold text-xs text-slate-700 border-b border-slate-200 flex justify-between">
              <span>รายชื่อหน่วยงาน</span>
              <span>{departments.length} หน่วยงาน</span>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">รหัส</th>
                    <th className="py-2.5 px-4">ชื่อหน่วยงาน</th>
                    <th className="py-2.5 px-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {editingDeptId === d.id ? (
                          <input
                            type="text"
                            value={editDeptData.code}
                            onChange={(e) => setEditDeptData({ ...editDeptData, code: e.target.value })}
                            className="p-1 border border-blue-400 rounded w-20 uppercase font-mono"
                          />
                        ) : (
                          d.code
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {editingDeptId === d.id ? (
                          <input
                            type="text"
                            value={editDeptData.name}
                            onChange={(e) => setEditDeptData({ ...editDeptData, name: e.target.value })}
                            className="p-1 border border-blue-400 rounded w-full"
                          />
                        ) : (
                          d.name
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {editingDeptId === d.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleSaveEditDept(d.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingDeptId(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingDeptId(d.id);
                                setEditDeptData({ code: d.code, name: d.name });
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDept(d.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Staff */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add User Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>เพิ่มเจ้าหน้าที่ใหม่</span>
            </h3>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ชื่อ-สกุล (ไม่ต้องใส่คำนำหน้า) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น อารีย์ สุขใจ"
                  value={newUser.display_name}
                  onChange={(e) => setNewUser({ ...newUser, display_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">หน่วยงานที่สังกัด (Department) *</label>
                <select
                  value={newUser.department_id}
                  onChange={(e) => setNewUser({ ...newUser, department_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">บทบาทสิทธิ์ (RBAC Role) *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                >
                  <option value="reporter">Reporter (ผู้รายงานทั่วไป)</option>
                  <option value="dept_head">Dept Head (หัวหน้าแผนก)</option>
                  <option value="reviewer">Reviewer (ผู้ตรวจสอบ/เภสัชกร)</option>
                  <option value="admin">Admin (ผู้ดูแลระบบสูงสุด)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">รหัสผ่านเริ่มต้น (Password)</label>
                <input
                  type="text"
                  placeholder="ค่าเริ่มต้น 123456 (Admin: 654321)"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              {/* Checkbox for Specialist Staff */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  checked={newUser.is_specialist}
                  onChange={(e) => setNewUser({ ...newUser, is_specialist: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>เป็น Specialist Staff (สำหรับตัวเลือกข้อ 16)</span>
              </label>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs transition active:scale-95"
              >
                เพิ่มเจ้าหน้าที่ (Add Staff)
              </button>
            </form>
          </div>

          {/* Users List Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 font-bold text-xs text-slate-700 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span>รายชื่อเจ้าหน้าที่ ({users.length} คน)</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเจ้าหน้าที่..."
                  value={userKeywordSearch}
                  onChange={(e) => setUserKeywordSearch(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none w-48 sm:w-64"
                />
                <Users className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">ชื่อ-สกุล</th>
                    <th className="py-2.5 px-4">หน่วยงาน</th>
                    <th className="py-2.5 px-4">บทบาท (Role)</th>
                    <th className="py-2.5 px-4">Specialist Staff</th>
                    <th className="py-2.5 px-4">Password</th>
                    <th className="py-2.5 px-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter(u => {
                      if (userKeywordSearch.trim()) {
                        const q = userKeywordSearch.toLowerCase().trim();
                        const cleanName = stripTitlePrefix(u.display_name).toLowerCase();
                        return cleanName.includes(q);
                      }
                      return true;
                    })
                    .map((u) => {
                    const dept = departments.find(d => d.id === u.department_id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        {/* 1. ชื่อ-สกุล */}
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {editingUserId === u.id ? (
                            <input
                              type="text"
                              value={editUserData.display_name}
                              onChange={(e) => setEditUserData({ ...editUserData, display_name: e.target.value })}
                              className="p-1 border border-blue-400 rounded w-full text-xs font-bold"
                              placeholder="ชื่อ-สกุล"
                            />
                          ) : (
                            <span className="font-bold text-slate-900">{stripTitlePrefix(u.display_name)}</span>
                          )}
                        </td>

                        {/* 2. หน่วยงาน */}
                        <td className="py-3 px-4">
                          {editingUserId === u.id ? (
                            <select
                              value={editUserData.department_id || ''}
                              onChange={(e) => setEditUserData({ ...editUserData, department_id: e.target.value })}
                              className="p-1 border border-blue-400 rounded text-xs w-full"
                            >
                              {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.name} ({d.code})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="font-medium text-slate-700">
                              <span>{dept?.name || 'ไม่ระบุหน่วยงาน'}</span>
                              <span className="text-[10px] text-slate-400 font-mono ml-1">
                                ({dept?.code || '-'})
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 3. บทบาท (Role) */}
                        <td className="py-3 px-4">
                          {editingUserId === u.id ? (
                            <select
                              value={editUserData.role}
                              onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                              className="p-1 border border-blue-400 rounded text-xs font-semibold"
                            >
                              <option value="reporter">Reporter</option>
                              <option value="dept_head">Dept Head</option>
                              <option value="reviewer">Reviewer</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                              {u.role}
                            </span>
                          )}
                        </td>

                        {/* 4. Specialist Staff */}
                        <td className="py-3 px-4">
                          {editingUserId === u.id ? (
                            <label className="flex items-center gap-1.5 text-[11px] font-medium text-amber-900 cursor-pointer bg-amber-50 p-1 rounded border border-amber-200">
                              <input
                                type="checkbox"
                                checked={Boolean(editUserData.is_specialist)}
                                onChange={(e) => setEditUserData({ ...editUserData, is_specialist: e.target.checked })}
                                className="rounded text-indigo-600 w-3.5 h-3.5"
                              />
                              <span>Specialist Staff</span>
                            </label>
                          ) : (
                            u.is_specialist ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                                Specialist Staff
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )
                          )}
                        </td>

                        {/* 5. Password */}
                        <td className="py-3 px-4">
                          {editingUserId === u.id ? (
                            <input
                              type="text"
                              value={editUserData.password ?? ''}
                              onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                              className="p-1 border border-blue-400 rounded text-xs font-mono w-24"
                              placeholder="รหัสผ่าน"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {showPasswordIds.has(u.id) ? (u.password || '123456') : '••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleShowPassword(u.id)}
                                className="text-slate-400 hover:text-slate-700 transition p-0.5"
                                title={showPasswordIds.has(u.id) ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                              >
                                {showPasswordIds.has(u.id) ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </td>

                        {/* 6. จัดการ */}
                        <td className="py-3 px-4 text-right">
                          {editingUserId === u.id ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleSaveEditUser(u.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                title="บันทึก"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                title="ยกเลิก"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingUserId(u.id);
                                  setEditUserData({ ...u });
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Positions (ตำแหน่งงาน) */}
      {activeTab === 'positions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Position Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>เพิ่มตำแหน่งงานใหม่</span>
            </h3>
            <p className="text-xs text-slate-500">
              ตำแหน่งงานที่เพิ่มจะปรากฏในรายการตัวเลือกของเจ้าหน้าที่ (เช่น นายแพทย์, เภสัชกร, พยาบาลวิชาชีพ) โดยแพทย์เฉพาะทาง (Specialist Staff) สามารถเปิด/ปิดได้จากแท็บเจ้าหน้าที่
            </p>
            <form onSubmit={handleAddPosition} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ชื่อตำแหน่งงาน *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นักรังสีการแพทย์, นักกายภาพบำบัด..."
                  value={newPositionName}
                  onChange={(e) => setNewPositionName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs transition active:scale-95"
              >
                เพิ่มตำแหน่งงาน (Add Position)
              </button>
            </form>
          </div>

          {/* Positions List Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 font-bold text-xs text-slate-700 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>ตำแหน่งงานทั้งหมด ({positions.length} ตำแหน่ง)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                แพทย์, เภสัชกร, พยาบาลวิชาชีพ
              </span>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">ชื่อตำแหน่งงาน</th>
                    <th className="py-2.5 px-4 text-center">จนท. ในสังกัด</th>
                    <th className="py-2.5 px-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {positions.map((pos) => {
                    const countUsers = users.filter(u => u.position === pos).length;
                    const isEditing = editingPosition === pos;

                    return (
                      <tr key={pos} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editPositionName}
                                onChange={(e) => setEditPositionName(e.target.value)}
                                className="p-1 border border-blue-400 rounded w-full text-xs"
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-slate-900">{pos}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-bold text-[11px]">
                            {countUsers} คน
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleSaveEditPosition(pos)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingPosition(null);
                                  setEditPositionName('');
                                }}
                                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingPosition(pos);
                                  setEditPositionName(pos);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="แก้ไขชื่อตำแหน่ง"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePosition(pos)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                title="ลบตำแหน่ง"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: ME Subtypes */}
      {activeTab === 'subtypes' && (
        <div className="space-y-4">
          {/* Process Filter */}
          <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-600">เลือกขั้นตอน (Process):</span>
            <div className="inline-flex bg-slate-100 p-0.5 rounded-lg">
              {PROCESS_OPTIONS.map((p) => (
                <button
                  key={p.code}
                  onClick={() => setSelectedProcess(p.code)}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    selectedProcess === p.code ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p.code} ({subtypes.filter(s => s.process === p.code).length})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Subtype */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>เพิ่มชนิดย่อยในขั้นตอน [{selectedProcess}]</span>
              </h3>
              <form onSubmit={handleAddSubtype} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">รหัส Subtype (Code) *</label>
                  <input
                    type="text"
                    placeholder={`เช่น ${selectedProcess}-26`}
                    value={newSubtype.code}
                    onChange={(e) => setNewSubtype({ ...newSubtype, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">คำอธิบายความคลาดเคลื่อน (Label) *</label>
                  <textarea
                    rows={3}
                    placeholder="เช่น สั่งยาเกินขนาดสูงสุดต่อวัน (Exceeds daily max dose)"
                    value={newSubtype.label}
                    onChange={(e) => setNewSubtype({ ...newSubtype, label: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  เพิ่มชนิดย่อย (Add Subtype)
                </button>
              </form>
            </div>

            {/* Subtypes List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">รหัส</th>
                    <th className="py-2.5 px-4">รายละเอียดความคลาดเคลื่อน</th>
                    <th className="py-2.5 px-4 text-right">ลบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subtypes.filter(s => s.process === selectedProcess).map((s) => (
                    <tr key={s.code} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {s.code}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {cleanSubtypeLabel(s.label)}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteSubtype(s.code)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Drugs Master Management (Simplified to exactly 4 fields: ชื่อยา / ความแรง / HAD / LASA) */}
      {activeTab === 'drugs' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">กรองสถานะ:</span>
              <button
                onClick={() => { setDrugFilter('all'); setDrugPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  drugFilter === 'all' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด ({drugs.length})
              </button>
              <button
                onClick={() => { setDrugFilter('had_or_lasa'); setDrugPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  drugFilter === 'had_or_lasa' ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-600/30' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>HAD หรือ LASA ({drugs.filter(d => d.is_had || d.is_lasa).length})</span>
              </button>
              <button
                onClick={() => { setDrugFilter('had'); setDrugPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  drugFilter === 'had' ? 'bg-rose-700 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>เฉพาะ HAD ({drugs.filter(d => d.is_had).length})</span>
              </button>
              <button
                onClick={() => { setDrugFilter('lasa'); setDrugPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  drugFilter === 'lasa' ? 'bg-amber-700 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>เฉพาะ LASA ({drugs.filter(d => d.is_lasa).length})</span>
              </button>
            </div>

            <div className="relative w-full sm:w-72 text-xs">
              <input
                type="text"
                placeholder="ค้นหาชื่อยา..."
                value={drugSearch}
                onChange={e => { setDrugSearch(e.target.value); setDrugPage(1); }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-3 pr-3 font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Drug Form (Exactly 4 Fields) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 pb-2 border-b border-slate-100">
                <Plus className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900">เพิ่มรายการยาในคลัง</h3>
              </div>

              <form onSubmit={handleAddDrug} className="space-y-4 text-xs">
                {/* 1. ชื่อยา */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    1. ชื่อยา <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น Warfarin sodium, Ceftriaxone, Amlodipine"
                    value={newDrug.name}
                    onChange={e => setNewDrug({ ...newDrug, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium text-slate-800 focus:border-indigo-500"
                  />
                </div>

                {/* 2. ความแรง */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    2. ความแรง
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 2 mg, 5 mg, 1 g, 100 IU/mL"
                    value={newDrug.strength}
                    onChange={e => setNewDrug({ ...newDrug, strength: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium text-slate-800 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 hover:opacity-95 text-white rounded-xl font-bold shadow-xs transition active:scale-95 cursor-pointer mt-2"
                  >
                    + บันทึกรายการยาเข้าคลัง
                  </button>
                </div>
              </form>
            </div>

            {/* Drugs List Table (Exactly 4 Data Columns: ชื่อยา / ความแรง / HAD / LASA + จัดการ) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold sticky top-0 bg-white">
                    <tr>
                      <th className="py-3 px-4">ชื่อยา</th>
                      <th className="py-3 px-4">ความแรง</th>
                      <th className="py-3 px-4 text-center">HAD</th>
                      <th className="py-3 px-4 text-center">LASA</th>
                      <th className="py-3 px-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDrugs.length > 0 ? (
                      paginatedDrugs.map(d => {
                        const isEditing = editingDrugId === d.id;
                        return (
                          <tr key={d.id} className="hover:bg-slate-50/70 transition">
                            {/* 1. ชื่อยา */}
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editDrugData.name}
                                  onChange={e => setEditDrugData({ ...editDrugData, name: e.target.value })}
                                  className="w-full border border-indigo-400 rounded-lg px-2 py-1 text-xs font-semibold"
                                />
                              ) : (
                                <div className="font-bold text-slate-900">{d.name}</div>
                              )}
                            </td>

                            {/* 2. ความแรง */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editDrugData.strength}
                                  onChange={e => setEditDrugData({ ...editDrugData, strength: e.target.value })}
                                  className="w-full border border-indigo-400 rounded-lg px-2 py-1 text-xs"
                                />
                              ) : (
                                <div className="font-semibold text-slate-800">{d.strength || '-'}</div>
                              )}
                            </td>

                            {/* 3. HAD */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleHad(d.id)}
                                title="คลิกเพื่อเปิด/ปิดสถานะ HAD"
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition active:scale-95 cursor-pointer ${
                                  d.is_had
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {d.is_had ? (
                                  <>
                                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                                    <span>HAD</span>
                                  </>
                                ) : (
                                  <span>-</span>
                                )}
                              </button>
                            </td>

                            {/* 4. LASA */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleLasa(d.id)}
                                title="คลิกเพื่อเปิด/ปิดสถานะ LASA"
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition active:scale-95 cursor-pointer ${
                                  d.is_lasa
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {d.is_lasa ? (
                                  <>
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>LASA</span>
                                  </>
                                ) : (
                                  <span>-</span>
                                )}
                              </button>
                            </td>

                            {/* การจัดการ */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleSaveEditDrug(d.id)}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingDrugId(null)}
                                    className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingDrugId(d.id);
                                      setEditDrugData({ ...d });
                                    }}
                                    className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDrug(d.id)}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          ไม่พบรายการยาที่ตรงกับเงื่อนไขการค้นหา
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div>
                  แสดง{' '}
                  <span className="font-bold text-slate-800">
                    {filteredDrugs.length > 0 ? (drugPage - 1) * drugPageSize + 1 : 0}
                  </span>{' '}
                  -{' '}
                  <span className="font-bold text-slate-800">
                    {Math.min(drugPage * drugPageSize, filteredDrugs.length)}
                  </span>{' '}
                  จากทั้งหมด{' '}
                  <span className="font-bold text-slate-800">{filteredDrugs.length}</span>{' '}
                  รายการ
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDrugPage(p => Math.max(1, p - 1))}
                    disabled={drugPage <= 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="หน้าก่อนหน้า"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="font-semibold text-slate-700 px-2">
                    หน้า {drugPage} / {totalDrugPages}
                  </span>
                  <button
                    onClick={() => setDrugPage(p => Math.min(totalDrugPages, p + 1))}
                    disabled={drugPage >= totalDrugPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="หน้าถัดไป"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: HAD & LASA Management */}
      {activeTab === 'had_lasa' && (
        <div className="space-y-6">
          {/* Sub Navigation Bar for HAD & LASA Module */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setHadLasaSubTab('lasa_pairs')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer ${
                  hadLasaSubTab === 'lasa_pairs'
                    ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4 text-amber-300" />
                <span>บัญชีคู่ยา LASA & ตั้งค่าจับคู่ยา</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    hadLasaSubTab === 'lasa_pairs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {lasaPairs.length} คู่
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHadLasaSubTab('had_registry')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer ${
                  hadLasaSubTab === 'had_registry'
                    ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>บัญชี HAD ยาเสี่ยงสูง</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    hadLasaSubTab === 'had_registry' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {drugs.filter(d => d.is_had).length} รายการ
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHadLasaSubTab('had_guidelines')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer ${
                  hadLasaSubTab === 'had_guidelines'
                    ? 'bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>HAD Keywords & แนวทางป้องกัน</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium px-2">
              มาตรฐานความปลอดภัยทางยา HA / NCC-MERP
            </div>
          </div>

          {/* Subtab 1: LASA Pairs Registry & Configuration */}
          {hadLasaSubTab === 'lasa_pairs' && (
            <div className="space-y-6">
              {/* Form: Add New LASA Pair */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-sm">ตั้งค่าจับคู่ยา LASA ใหม่ (Add LASA Pair)</h3>
                      <p className="text-[11px] font-normal text-slate-500">
                        กำหนดคู่ยาชื่อพ้องมองคล้าย ระบบจะขึ้นป้ายเตือนอัตโนมัติเมื่อระบุชื่อยาคู่นี้ในใบรายงาน
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    รองรับ Tall Man Lettering
                  </span>
                </div>

                <form onSubmit={handleAddLasaPair} className="space-y-4 text-xs">
                  {/* Datalist autocomplete from hospital formulary */}
                  <datalist id="catalog-drugs-autocomplete">
                    {drugs.map((d) => (
                      <option key={d.id} value={d.strength ? `${d.name} ${d.strength}` : d.name} />
                    ))}
                  </datalist>

                  <div className="bg-purple-50/70 text-purple-900 border border-purple-200 p-2.5 rounded-xl text-[11px] flex items-center gap-2">
                    <Pill className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>
                      💡 <strong>เชื่อมโยงบัญชียาอัตโนมัติ:</strong> พิมพ์หรือเลือกชื่อยาจากบัญชียาโรงพยาบาลได้โดยตรง เมื่อบันทึกการจับคู่ ยาทั้งสองตัวจะถูกกำหนดสถานะเป็นยา <strong>LASA</strong> ในบัญชียาโดยอัตโนมัติ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Drug A */}
                    <div className="p-3.5 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-rose-900 font-bold">
                        <span>ยาตัวที่ 1 (Drug A) *</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 rounded text-rose-700">คู่ที่ 1</span>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">ชื่อยา / ขนาดยา (เลือกจากบัญชียา) *</label>
                        <input
                          type="text"
                          required
                          list="catalog-drugs-autocomplete"
                          placeholder="พิมพ์เพื่อค้นหาจากบัญชียา เช่น Daflon 500 mg"
                          value={newPair.drugA}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewPair(prev => ({
                              ...prev,
                              drugA: val,
                              tallmanA: prev.tallmanA ? prev.tallmanA : val
                            }));
                          }}
                          className="w-full bg-white border border-rose-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">ตัวอักษรเด่น Tall Man Letters (ถ้ามี)</label>
                        <input
                          type="text"
                          placeholder="เช่น DAFLON 500 mg หรือ traMADol"
                          value={newPair.tallmanA}
                          onChange={(e) => setNewPair({ ...newPair, tallmanA: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-rose-800 focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>

                    {/* Drug B */}
                    <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                        <span>ยาตัวที่ 2 (Drug B) *</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 rounded text-emerald-700">คู่ที่ 2</span>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">ชื่อยา / ขนาดยา (เลือกจากบัญชียา) *</label>
                        <input
                          type="text"
                          required
                          list="catalog-drugs-autocomplete"
                          placeholder="พิมพ์เพื่อค้นหาจากบัญชียา เช่น Dilantin 100 mg"
                          value={newPair.drugB}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewPair(prev => ({
                              ...prev,
                              drugB: val,
                              tallmanB: prev.tallmanB ? prev.tallmanB : val
                            }));
                          }}
                          className="w-full bg-white border border-emerald-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">ตัวอักษรเด่น Tall Man Letters (ถ้ามี)</label>
                        <input
                          type="text"
                          placeholder="เช่น DILANTIN 100 mg หรือ traZODone"
                          value={newPair.tallmanB}
                          onChange={(e) => setNewPair({ ...newPair, tallmanB: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">ลักษณะความคล้าย (Similarity Type) *</label>
                      <select
                        value={newPair.similarity_type}
                        onChange={(e: any) => setNewPair({ ...newPair, similarity_type: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold text-slate-800 focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="both">⚡ ทั้งชื่อพ้องและมองคล้าย (Both)</option>
                        <option value="look_alike">👀 มองคล้าย บรรจุภัณฑ์คล้าย (Look-Alike)</option>
                        <option value="sound_alike">🔊 ชื่อพ้อง ออกเสียงคล้าย (Sound-Alike)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">หมวดหมู่ / รูปแบบยา (Category)</label>
                      <select
                        value={newPair.category}
                        onChange={(e) => setNewPair({ ...newPair, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="Oral Tablet">ยารับประทาน (Oral Tablet / Capsule)</option>
                        <option value="Injections">ยาฉีด (IV / IM Injections)</option>
                        <option value="Syrup / Liquid">ยาน้ำ / สารละลาย (Syrup / Solution)</option>
                        <option value="Topical / Eye">ยาใช้ภายนอก / ยาหยอดตา (Topical / Drops)</option>
                        <option value="Chemotherapy">ยาเคมีบำบัด (Chemotherapy)</option>
                        <option value="High Alert Drugs">ยากลุ่มเสี่ยงสูง (High Alert Drugs)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold text-slate-700 block mb-1">ข้อควรระวังและแนวทางป้องกันความสับสน</label>
                      <input
                        type="text"
                        placeholder="เช่น แยกจุดเก็บ, ติดสติกเกอร์ Tall Man เตือน"
                        value={newPair.note}
                        onChange={(e) => setNewPair({ ...newPair, note: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 hover:opacity-95 text-white font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>บันทึกการจับคู่ยา (Save LASA Pair)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* LASA Configured Pairs List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-sm text-slate-900">
                      บัญชีคู่ยา LASA ที่กำหนดในระบบ ({filteredLasaPairs.length} คู่)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ค้นหาคู่ยา, ชื่อ Tall Man, ข้อควรระวัง..."
                      value={lasaSearch}
                      onChange={(e) => setLasaSearch(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none w-56 sm:w-72"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                  </div>
                </div>

                <div className="p-4 divide-y divide-slate-100 space-y-4">
                  {filteredLasaPairs.length > 0 ? (
                    filteredLasaPairs.map((pair) => {
                      const isEditing = editingPairId === pair.id;
                      return (
                        <div
                          key={pair.id}
                          className="pt-4 first:pt-0 pb-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                        >
                          {isEditing ? (
                            <div className="w-full space-y-3 p-3 bg-purple-50/50 rounded-xl border border-purple-200 text-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="font-bold text-slate-700 block mb-1">ยาตัวที่ 1 (Drug A)</label>
                                  <input
                                    type="text"
                                    value={editPairData.drugA || ''}
                                    onChange={(e) => setEditPairData({ ...editPairData, drugA: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded p-1.5"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 block mb-1">Tall Man Letters A</label>
                                  <input
                                    type="text"
                                    value={editPairData.tallmanA || ''}
                                    onChange={(e) => setEditPairData({ ...editPairData, tallmanA: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 block mb-1">ยาตัวที่ 2 (Drug B)</label>
                                  <input
                                    type="text"
                                    value={editPairData.drugB || ''}
                                    onChange={(e) => setEditPairData({ ...editPairData, drugB: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded p-1.5"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 block mb-1">Tall Man Letters B</label>
                                  <input
                                    type="text"
                                    value={editPairData.tallmanB || ''}
                                    onChange={(e) => setEditPairData({ ...editPairData, tallmanB: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 block mb-1">ลักษณะความคล้าย</label>
                                  <select
                                    value={editPairData.similarity_type || 'both'}
                                    onChange={(e: any) => setEditPairData({ ...editPairData, similarity_type: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded p-1.5"
                                  >
                                    <option value="both">ทั้งชื่อพ้องและมองคล้าย (Both)</option>
                                    <option value="look_alike">มองคล้าย (Look-Alike)</option>
                                    <option value="sound_alike">ชื่อพ้อง (Sound-Alike)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 block mb-1">ข้อควรระวัง / แนวทางป้องกัน</label>
                                  <input
                                    type="text"
                                    value={editPairData.note || ''}
                                    onChange={(e) => setEditPairData({ ...editPairData, note: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded p-1.5"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditPair(pair.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>บันทึก</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPairId(null)}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>ยกเลิก</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-2 flex-1">
                                {/* Drug Pair Header Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <div className="inline-flex items-center gap-2 p-2 bg-rose-50 border border-rose-200 rounded-xl">
                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                    <span className="font-mono font-bold text-rose-950 text-xs">
                                      {pair.tallmanA || pair.drugA}
                                    </span>
                                  </div>

                                  <div className="p-1 rounded-full bg-purple-100 text-purple-800">
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                  </div>

                                  <div className="inline-flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="font-mono font-bold text-emerald-950 text-xs">
                                      {pair.tallmanB || pair.drugB}
                                    </span>
                                  </div>

                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      pair.similarity_type === 'both'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : pair.similarity_type === 'sound_alike'
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                                    }`}
                                  >
                                    {pair.similarity_type === 'both'
                                      ? '⚡ ทั้งชื่อพ้องและมองคล้าย'
                                      : pair.similarity_type === 'sound_alike'
                                      ? '🔊 ชื่อพ้อง (Sound-Alike)'
                                      : '👀 มองคล้าย (Look-Alike)'}
                                  </span>

                                  {pair.category && (
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold border border-slate-200">
                                      {pair.category}
                                    </span>
                                  )}
                                </div>

                                {/* Note */}
                                {pair.note && (
                                  <div className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                    <span>
                                      <strong className="font-bold">ข้อควรระวัง:</strong> {pair.note}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPairId(pair.id);
                                    setEditPairData({ ...pair });
                                  }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition cursor-pointer"
                                  title="แก้ไขคู่ยานี้"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLasaPair(pair.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition cursor-pointer"
                                  title="ลบการจับคู่นี้"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      ไม่พบคู่ยา LASA ที่ตรงกับเงื่อนไขการค้นหา
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: HAD Registry (High Alert Drugs) */}
          {hadLasaSubTab === 'had_registry' && (
            <div className="space-y-6">
              {/* Add Drug to HAD from Hospital Formulary */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-rose-700">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">เพิ่มยาความเสี่ยงสูงเข้าบัญชี HAD (เลือกจากข้อมูลบัญชียา)</h3>
                      <p className="text-[11px] text-slate-500">เลือกรายการยาที่มีอยู่ในบัญชียาโรงพยาบาล เพื่อกำหนดเป็นยาความเสี่ยงสูง (High Alert Drug) ทันที</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 self-start sm:self-auto">
                    HAD Formulary Integration
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex-1">
                    <select
                      value={selectedHadDrugId}
                      onChange={(e) => setSelectedHadDrugId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:border-rose-500 focus:outline-none"
                    >
                      <option value="">-- เลือกยาจากบัญชียาที่ยังไม่ได้เป็น HAD ({drugs.filter(d => !d.is_had).length} รายการ) --</option>
                      {drugs
                        .filter(d => !d.is_had)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} {d.strength ? `(${d.strength})` : ''}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={!selectedHadDrugId}
                    onClick={() => handleAddDrugToHad(selectedHadDrugId)}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ เพิ่มเข้าบัญชี HAD</span>
                  </button>
                </div>
              </div>

              {/* HAD Overview summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-rose-700 block">ยากลุ่มเสี่ยงสูงทั้งหมด</span>
                  <span className="text-2xl font-black text-rose-950 font-mono">
                    {drugs.filter(d => d.is_had).length}
                  </span>
                  <span className="text-[10px] text-rose-600 block mt-0.5">ในบัญชียาโรงพยาบาล</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-amber-700 block">Electrolytes & Inotropes</span>
                  <span className="text-2xl font-black text-amber-950 font-mono">
                    {drugs.filter(d => d.is_had && (d.name.toLowerCase().includes('kcl') || d.name.toLowerCase().includes('potassium') || d.name.toLowerCase().includes('adrenaline') || d.name.toLowerCase().includes('dopamine'))).length}
                  </span>
                  <span className="text-[10px] text-amber-600 block mt-0.5">ยาฉีดวิกฤติ / หัวใจ</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-blue-700 block">Anticoagulants & Insulin</span>
                  <span className="text-2xl font-black text-blue-950 font-mono">
                    {drugs.filter(d => d.is_had && (d.name.toLowerCase().includes('warfarin') || d.name.toLowerCase().includes('heparin') || d.name.toLowerCase().includes('insulin'))).length}
                  </span>
                  <span className="text-[10px] text-blue-600 block mt-0.5">เสี่ยงตกเลือด / น้ำตาลต่ำ</span>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-purple-700 block">Opioids & Narcotics</span>
                  <span className="text-2xl font-black text-purple-950 font-mono">
                    {drugs.filter(d => d.is_had && (d.name.toLowerCase().includes('morphine') || d.name.toLowerCase().includes('fentanyl') || d.name.toLowerCase().includes('pethidine'))).length}
                  </span>
                  <span className="text-[10px] text-purple-600 block mt-0.5">ระงับปวดเสพติด</span>
                </div>
              </div>

              {/* HAD Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span className="font-bold text-sm text-slate-900">
                      บัญชี HAD และแนวทางความปลอดภัยทางคลินิก ({filteredHadDrugs.length} รายการ)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ค้นหายาเสี่ยงสูง, ความแรง..."
                      value={hadSearch}
                      onChange={(e) => setHadSearch(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none w-56 sm:w-72"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase">
                      <tr>
                        <th className="py-3 px-4 font-bold">ชื่อยา & ขนาดยา</th>
                        <th className="py-3 px-4 font-bold">กลุ่มยาเสี่ยงสูง</th>
                        <th className="py-3 px-4 font-bold">ความเสี่ยงวิกฤติทางคลินิก</th>
                        <th className="py-3 px-4 font-bold">มาตรการ Double Check & ป้องกัน</th>
                        <th className="py-3 px-4 font-bold">สารต้านพิษ (Antidote)</th>
                        <th className="py-3 px-4 text-center font-bold">สถานะ HAD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHadDrugs.length > 0 ? (
                        filteredHadDrugs.map((d) => {
                          const info = getHadClinicalInfo(d.name);
                          return (
                            <tr key={d.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900">{d.name}</div>
                                {d.strength && (
                                  <div className="text-[11px] text-slate-500 font-mono">{d.strength}</div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-semibold text-[11px]">
                                  {info.group}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-800 font-medium">
                                {info.risk}
                              </td>
                              <td className="py-3 px-4 text-slate-700">
                                <div className="flex items-start gap-1">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{info.protocol}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium text-purple-900">
                                {info.antidote}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    store.setDrugHadStatus(d.id, false);
                                    setDrugs([...store.getDrugs()]);
                                  }}
                                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 transition cursor-pointer"
                                  title="คลิกเพื่อปลดสถานะ HAD ออกจากยานี้"
                                >
                                  นำออกจาก HAD
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            ไม่พบรายการยาเสี่ยงสูงที่ตรงกับการค้นหา
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 3: Guidelines & Keywords */}
          {hadLasaSubTab === 'had_guidelines' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HAD Keywords Cloud */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-700 pb-2 border-b border-slate-100">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="font-bold text-sm">คลังคำค้นยากลุ่มเสี่ยงสูง (High Alert Drugs - Auto-Keywords)</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ระบบจะทำการตรวจจับอัตโนมัติ (Auto-tagging) และขึ้นป้ายเตือนสีแดงทันทีเมื่อระบุชื่อยาที่มีคำเหล่านี้:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {HIGH_ALERT_DRUGS_KEYWORDS.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-mono font-bold"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* HA Safety Standard */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-bold text-sm">แนวทางความปลอดภัยตามมาตรฐาน HA Thailand</h3>
                </div>
                <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80">
                    <strong className="text-purple-950 font-bold block mb-1">
                      1. มาตรการ Tall Man Lettering
                    </strong>
                    ใช้ตัวพิมพ์ใหญ่ในส่วนคำที่สะกดต่างกัน เพื่อเน้นความแตกต่างของคู่ยาที่มีชื่อหรือการสะกดใกล้เคียงกัน ป้องกันการหยิบยาผิดพลาด
                  </div>
                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80">
                    <strong className="text-rose-950 font-bold block mb-1">
                      2. Independent Double Check
                    </strong>
                    ยากลุ่ม HAD ทุกชนิดต้องผ่านการตรวจสอบอิสระ 2 บุคคล (แพทย์/เภสัชกร หรือ พยาบาล 2 ท่าน) ทวนสอบผู้ป่วย, ชื่อยา, ขนาดยา, อัตราไหล และเส้นทางการให้ยา
                  </div>
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                    <strong className="text-amber-950 font-bold block mb-1">
                      3. การแยกตำแหน่งจัดเก็บทางกายภาพ (Physical Separation)
                    </strong>
                    คู่ยา LASA ห้ามจัดเก็บติดกันบนชั้นวางยา ให้แยกชั้น หรือติดสติกเกอร์สีเตือนชัดเจน
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
