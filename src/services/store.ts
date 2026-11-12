/**
 * Medication Error Reporting System (v0.4)
 * Client-Side D1-Compatible Database & State Store
 * Includes Master Data CRUD (Departments, Users, Error Subtypes),
 * Date-Range Filtering, HAD & LASA Auto-Detection, and E-up Harm Tracking.
 */

import {
  checkLasaPair,
  computeRmGrade,
  DEPARTMENTS as INITIAL_DEPTS,
  generateDeduplicationHashSync,
  isHighAlertDrug,
  ME_SUBTYPES as INITIAL_SUBTYPES,
  MOCK_USERS as INITIAL_USERS,
  INITIAL_POSITIONS,
  stripPiiClientSide,
  stripTitlePrefix,
  validateReport
} from '../../shared/form.js';
import { mapHosxpToProposed } from '../../worker/hosxp.js';
import { canEditReport, canViewReport, computeFieldDiff, validateTransition } from '../../worker/rules.js';
import { HOSPITAL_DRUG_CATALOG } from '../data/drugFormulary';

// Pre-seeded initial sample reports (simplified 2-status: pending and verified)
const INITIAL_REPORTS = [
  {
    id: 'me-101',
    report_no: 'ME-2026-00412',
    patient_type: 'IPD',
    hn: '000217057',
    incident_date: '2026-10-23',
    incident_time: '09:15',
    intended_drug: 'Ceftriaxone',
    intended_drug_strength: '1 g',
    error_drug: 'Cefazolin',
    error_drug_strength: '1 g',
    problem_description: 'พยาบาลวอร์ดได้รับ Cefazolin 1 g แทน Ceftriaxone 1 g ที่แพทย์สั่งใช้สำหรับผู้ป่วย ปอดอักเสบ ตรวจพบระหว่างขั้นตอนตรวจสอบก่อนบริหารยา',
    corrective_action: 'ส่งยาคืนห้องยาทันทีและได้รับ Ceftriaxone ที่ถูกต้องมาบริหารตามเวลา สัญญาณชีพปกติ',
    ncc_merp: 'B',
    rm_grade: 2,
    preventability: 'C',
    origin_department_id: 'dept-pharma',
    error_staff_reference: 'อิ่นแก้ว สิงห์แก้ว',
    consult_recipient_reference: 'ธงชัย ผลดี',
    detection_department_id: 'dept-ipd-male',
    reporter_reference: 'สง่าศรี เนาวฤทธิ์',
    reported_date: '2026-10-23',
    process: 'DIS',
    me_subtype: 'DIS-04',
    cause: 'บรรจุภัณฑ์คล้ายคลึงกัน (Look-Alike)',
    recorded_by_reference: 'สมพงษ์ วุฒิอดิเรก',
    rca_status: 'none',
    status: 'verified',
    ever_verified: 1,
    verified_by: 'สมพงษ์ วุฒิอดิเรก',
    verified_at: '2026-10-23T14:30:00Z',
    created_by: 'usr-ipdm-01',
    created_at: '2026-10-23T10:00:00Z',
    updated_at: '2026-10-23T14:30:00Z'
  },
  {
    id: 'me-102',
    report_no: 'ME-2026-00418',
    patient_type: 'OPD',
    hn: '000057367',
    incident_date: '2026-10-24',
    incident_time: '11:45',
    intended_drug: 'Amlodipine',
    intended_drug_strength: '5 mg',
    error_drug: 'Amlodipine',
    error_drug_strength: '10 mg',
    problem_description: 'แพทย์สั่งใช้ยาผิดความแรงในระบบ CPOE เภสัชกรตรวจพบระหว่างตรวจสอบใบสั่งยา',
    corrective_action: 'เภสัชกรประสานงานแพทย์ผู้สั่งใช้ยาเพื่อยืนยันขนาดยาที่ถูกต้องและแก้ไขก่อนส่งมอบ',
    ncc_merp: 'B',
    rm_grade: 2,
    preventability: 'D',
    origin_department_id: 'dept-med',
    error_staff_reference: 'วีระพงศ์ ดวงมณี',
    consult_recipient_reference: 'สิรดนัย วัฒนวงษ์คีรี',
    detection_department_id: 'dept-pharma',
    reporter_reference: 'ทศพร เตชะอัตตกุล',
    reported_date: '2026-10-24',
    process: 'PRE',
    me_subtype: 'PRE-03',
    cause: 'ความเร่งรีบในการเลือกระดับความแรงจากระบบคอมพิวเตอร์',
    recorded_by_reference: 'ทศพร เตชะอัตตกุล',
    rca_status: 'none',
    status: 'pending',
    ever_verified: 0,
    verified_by: null,
    verified_at: null,
    created_by: 'usr-ph-05',
    created_at: '2026-10-24T12:00:00Z',
    updated_at: '2026-10-24T12:00:00Z'
  },
  {
    id: 'me-103',
    report_no: 'ME-2026-00425',
    patient_type: 'IPD',
    hn: '000235958',
    incident_date: '2026-10-24',
    incident_time: '15:20',
    intended_drug: 'Potassium Chloride (KCl)',
    intended_drug_strength: '20 mEq/10 mL',
    error_drug: 'Potassium Chloride (KCl)',
    error_drug_strength: '40 mEq/20 mL',
    problem_description: 'คัดลอกคำสั่งยาในระบบ MAR ผิดขนาดความแรง ตรวจพบก่อนจัดเตรียมยา',
    corrective_action: 'หัวหน้าตึกทวนสอบคำสั่งแพทย์และแก้ไขให้ตรงตามคำสั่งเดิม',
    ncc_merp: 'B',
    rm_grade: 2,
    preventability: 'F',
    origin_department_id: 'dept-ipd-female',
    error_staff_reference: 'กมลวรรณ เกื้อทาน',
    consult_recipient_reference: 'ธงชัย ผลดี',
    detection_department_id: 'dept-ipd-female',
    reporter_reference: 'ศิริรัตน์ โหตรภวานนท์',
    reported_date: '2026-10-24',
    process: 'TRA',
    me_subtype: 'TRA-08',
    cause: 'ความเร่งรีบในการคัดลอกคำสั่งใช้ยาช่วงเปลี่ยนเวร',
    recorded_by_reference: 'ศิริรัตน์ โหตรภวานนท์',
    rca_status: 'none',
    status: 'pending',
    ever_verified: 0,
    verified_by: null,
    verified_at: null,
    created_by: 'usr-ipdf-01',
    created_at: '2026-10-24T16:00:00Z',
    updated_at: '2026-10-24T16:00:00Z'
  },
  {
    id: 'me-104',
    report_no: 'ME-2026-00430',
    patient_type: 'OPD',
    hn: 'HN69-01580',
    incident_date: '2026-10-25',
    incident_time: '08:40',
    intended_drug: 'Warfarin sodium',
    intended_drug_strength: '2 mg',
    error_drug: 'Warfarin sodium',
    error_drug_strength: '5 mg',
    problem_description: 'High Alert Drug & LASA incident: Prescribed 2 mg daily but 5 mg dispensed. Patient took 1 dose before noticing different lavender vs pink tablet color. Patient visited ER.',
    corrective_action: 'Patient evaluated at ER. Stat INR performed (INR 2.3 - within therapeutic range). Vitamin K1 held on standby. Patient provided correct 2 mg tablets.',
    ncc_merp: 'E',
    rm_grade: 3,
    preventability: 'E',
    origin_department_id: 'dept-pharma',
    error_staff_reference: 'user-rev2',
    consult_recipient_reference: 'user-doc1',
    detection_department_id: 'dept-er',
    reporter_reference: 'user-rep2',
    reported_date: '2026-10-25',
    process: 'DIS',
    me_subtype: 'DIS-03',
    cause: 'Different manufacturer brand packaging with similar appearance.',
    recorded_by_reference: 'user-rev2',
    rca_status: 'pending', // Requires RCA before verify!
    rca_team: '',
    rca_root_cause_type: '',
    rca_fishbone: null,
    rca_summary: '',
    rca_action_plan: '',
    rca_responsible: '',
    rca_due_date: '',
    rca_completed_at: null,
    rca_completed_by: null,
    status: 'pending',
    ever_verified: 0,
    verified_by: null,
    verified_at: null,
    created_by: 'user-rep2',
    created_at: '2026-10-25T09:10:00Z',
    updated_at: '2026-10-25T09:10:00Z'
  },
  {
    id: 'me-105',
    report_no: 'ME-2026-00438',
    patient_type: 'IPD',
    hn: 'HN69-01890',
    incident_date: '2026-10-24',
    incident_time: '21:00',
    intended_drug: 'Insulin Glargine (Lantus)',
    intended_drug_strength: '100 IU/mL',
    error_drug: 'Insulin Regular (Actrapid)',
    error_drug_strength: '100 IU/mL',
    problem_description: 'ผู้ป่วยเบาหวานได้รับ Actrapid ขนาด 20 units แทน Lantus ก่อนนอน เกิดภาวะน้ำตาลในเลือดต่ำรุนแรง (Hypoglycemia BS 42 mg/dL) ต้องให้ 50% Glucose และขยายเวลานอน รพ. เพิ่ม 2 วัน',
    corrective_action: 'ฉีด 50% Glucose 50 mL IV stat ผู้ป่วยฟื้นตัวระดับน้ำตาลปกติ ติดตามต่อเนื่อง 48 ชม.',
    ncc_merp: 'F',
    rm_grade: 3,
    preventability: 'F',
    origin_department_id: 'dept-ipd1',
    error_staff_reference: 'user-rep1',
    consult_recipient_reference: 'user-doc1',
    detection_department_id: 'dept-ipd1',
    reporter_reference: 'user-head-ipd',
    reported_date: '2026-10-25',
    process: 'ADM',
    me_subtype: 'ADM-02',
    cause: 'ขวด Insulin ชนิดฉีดก่อนนอนกับชนิดฉีดตามมื้ออาหารเก็บในตู้เย็นเดียวกัน ขาด 2-nurse double check',
    recorded_by_reference: 'user-head-ipd',
    rca_status: 'completed',
    rca_team: 'ทีมสหวิชาชีพ: ภญ.กัญญา, พว.อภิญญา, นพ.สมชาย, พว.ศิริพร',
    rca_root_cause_type: 'ด้านสิ่งแวดล้อมและบรรจุภัณฑ์ (Environment & LASA Packaging)',
    rca_fishbone: JSON.stringify({
      man: 'พยาบาลกะดึกเหนื่อยล้า ขาดการทำ 2-nurse independent double check',
      machine: 'ตู้เย็นเก็บยาในวอร์ดไม่มีช่องแบ่ง Insulin แต่ละชนิดชัดเจน',
      method: 'ไม่มีการแยกจุดเก็บ Basal vs Bolus insulin',
      material: 'ขวดยา Insulin ขนาดและรูปทรงคล้ายคลึงกัน (Look-Alike)',
      environment: 'แสงสว่างบริเวณเคาน์เตอร์เตรียมยาไม่เพียงพอในช่วงเวรดึก'
    }),
    rca_summary: 'ความสับสนของขวด Insulin ชนิดฉีดก่อนนอน (Lantus) กับชนิดฉีดตามมื้ออาหาร (Actrapid) เนื่องจากการจัดเก็บในตู้เย็นรวมช่องเดียวกัน และขาดการทวนสอบซ้ำแบบอิสระ',
    rca_action_plan: '1. จัดซื้อตะกร้าแยกสีสำหรับ Insulin แต่ละชนิด (Lantus สีเทา, Actrapid สีเหลือง) พร้อมป้ายเตือน High Alert Drug\n2. กำหนดนโยบาย Independent Double Check สองคนก่อนฉีด Insulin ทุกครั้ง บันทึกใน e-MAR\n3. ติดตั้งหลอดไฟเพิ่มความสว่างบริเวณเคาน์เตอร์เตรียมยาวอร์ด',
    rca_responsible: 'พว.อภิญญา (หน.วอร์ด) & ภญ.กัญญา (เภสัชกร)',
    rca_due_date: '2026-11-15',
    rca_completed_at: '2026-10-25T11:00:00Z',
    rca_completed_by: 'user-rev1',
    status: 'verified',
    ever_verified: 1,
    verified_by: 'user-admin',
    verified_at: '2026-10-25T11:30:00Z',
    created_by: 'user-rep1',
    created_at: '2026-10-24T22:30:00Z',
    updated_at: '2026-10-25T11:30:00Z'
  }
];

// Initial HOSxP Smart Import Queue matching real hospital data from user screenshot
const INITIAL_HOSXP_QUEUE = [
  {
    id: 'hosxp-q-01',
    source_key: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    filename: 'HOSxP_Export_20261025.xlsx',
    row_no: 1,
    raw: {
      'ลำดับ': 1,
      'วันที่/เวลา': '25/10/2026 9:49:01',
      'HN': '000235958',
      'ผู้สั่งยา': 'พญ.วราดา เครือประดิษฐ์',
      'แผนก': 'IPD',
      'ชื่อยา': 'traMADol CAP (ทDu3,C30)',
      'ขั้นตอนของความคลาดเคลื่อน': 'ความคลาดเคลื่อนก่อนการจ่ายยา ( Pre-dispensing error)',
      'ชนิดความคลาดเคลื่อน': '',
      'ระดับความรุนแรง': 'Category B: มีความคลาดเคลื่อนเกิดขึ้นแต่ไม่เป็นอันตรายต่อผู้ป่วย เนื่องจากความคลาดเคลื่อนไปไม่ถึงผู้ป่วย',
      'หมายเหตุ': 'ไม่ได้จัดยา',
      'เจ้าหน้าที่': 'นายอนุภาพ ภูหลัก'
    },
    proposed: {
      patient_type: 'IPD',
      hn: '000235958',
      incident_date: '2026-10-25',
      incident_time: '09:49',
      intended_drug: 'traMADol CAP (ทDu3,C30)',
      error_drug: '',
      problem_description: 'ไม่ได้จัดยา',
      corrective_action: '',
      ncc_merp: 'B',
      rm_grade: 2,
      preventability: 'C',
      process: 'PDI',
      me_subtype: 'PDI-15',
      error_staff_reference: 'พญ.วราดา เครือประดิษฐ์',
      reporter_reference: 'นายอนุภาพ ภูหลัก',
      recorded_by_reference: 'นายอนุภาพ ภูหลัก',
      origin_department_id: '',
      detection_department_id: 'dept-pharma',
      reported_date: '2026-10-25',
      rca_status: 'none'
    },
    notes: ['Origin Department requires reviewer assignment.'],
    status: 'review',
    event_id: null,
    reject_reason: null,
    reviewed_by: null,
    reviewed_at: null,
    created_by: 'user-rev1',
    created_at: '2026-10-25T09:50:00Z'
  },
  {
    id: 'hosxp-q-02',
    source_key: '5f4dcc3b5aa765d61d8327deb882cf992b321a67b54f9797b47eed54cb06f0ce',
    filename: 'HOSxP_Export_20261025.xlsx',
    row_no: 2,
    raw: {
      'ลำดับ': 2,
      'วันที่/เวลา': '25/10/2026 13:55:59',
      'HN': '000217057',
      'ผู้สั่งยา': 'พญ.จิรสุดา คำภีระ',
      'แผนก': 'OPD',
      'ชื่อยา': 'Guaifenesine Syr. 60ml (ทA,น2)',
      'ขั้นตอนของความคลาดเคลื่อน': 'ความคลาดเคลื่อนก่อนการจ่ายยา ( Pre-dispensing error)',
      'ชนิดความคลาดเคลื่อน': 'จัดยาผิดชนิด',
      'ระดับความรุนแรง': 'Category B: มีความคลาดเคลื่อนเกิดขึ้นแต่ไม่เป็นอันตรายต่อผู้ป่วย เนื่องจากความคลาดเคลื่อนไปไม่ถึงผู้ป่วย',
      'หมายเหตุ': 'ธนาวัฒน์ จัด Guaifenesine syp เป็น Cetririzine',
      'เจ้าหน้าที่': 'นางทศพร เดชอัตตกุล'
    },
    proposed: {
      patient_type: 'OPD',
      hn: '000217057',
      incident_date: '2026-10-25',
      incident_time: '13:55',
      intended_drug: 'Guaifenesine Syr. 60ml (ทA,น2)',
      error_drug: 'Cetririzine',
      problem_description: 'ธนาวัฒน์ จัด Guaifenesine syp เป็น Cetririzine',
      corrective_action: '',
      ncc_merp: 'B',
      rm_grade: 2,
      preventability: 'C',
      process: 'PDI',
      me_subtype: 'PDI-01',
      error_staff_reference: 'พญ.จิรสุดา คำภีระ',
      reporter_reference: 'นางทศพร เดชอัตตกุล',
      recorded_by_reference: 'นางทศพร เดชอัตตกุล',
      origin_department_id: '',
      detection_department_id: 'dept-pharma',
      reported_date: '2026-10-25',
      rca_status: 'none'
    },
    notes: ["Suggested error drug 'Cetririzine' parsed from note.", 'Origin Department requires reviewer assignment.'],
    status: 'review',
    event_id: null,
    reject_reason: null,
    reviewed_by: null,
    reviewed_at: null,
    created_by: 'user-rev1',
    created_at: '2026-10-25T14:00:00Z'
  },
  {
    id: 'hosxp-q-03',
    source_key: '9a3b8c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    filename: 'HOSxP_Export_20261025.xlsx',
    row_no: 3,
    raw: {
      'ลำดับ': 3,
      'วันที่/เวลา': '25/10/2026 14:23:11',
      'HN': '000057367',
      'ผู้สั่งยา': 'นพ.วีระพงศ์ ดวงมณี',
      'แผนก': 'OPD',
      'ชื่อยา': 'HCTZ (ลดความดันโลหิต)\nhydroCHLOROthiazide (ทBu1,C10)',
      'ขั้นตอนของความคลาดเคลื่อน': 'ความคลาดเคลื่อนในการสั่งใช้ยา (Prescribing error ):',
      'ชนิดความคลาดเคลื่อน': 'สั่งใช้ยาผิดชนิด',
      'ระดับความรุนแรง': 'Category B: มีความคลาดเคลื่อนเกิดขึ้นแต่ไม่เป็นอันตรายต่อผู้ป่วย เนื่องจากความคลาดเคลื่อนไปไม่ถึงผู้ป่วย',
      'หมายเหตุ': 'ปรับยาระว่าง visit NCD refill แพทย์ Rm ผิด visit ไม่ใช่ยาที่ปรับล่าสุด',
      'เจ้าหน้าที่': 'นายอนุภาพ ภูหลัก'
    },
    proposed: {
      patient_type: 'OPD',
      hn: '000057367',
      incident_date: '2026-10-25',
      incident_time: '14:23',
      intended_drug: 'HCTZ (ลดความดันโลหิต) hydroCHLOROthiazide (ทBu1,C10)',
      error_drug: '',
      problem_description: 'ปรับยาระว่าง visit NCD refill แพทย์ Rm ผิด visit ไม่ใช่ยาที่ปรับล่าสุด',
      corrective_action: '',
      ncc_merp: 'B',
      rm_grade: 2,
      preventability: 'D',
      process: 'PRE',
      me_subtype: 'PRE-01',
      error_staff_reference: 'นพ.วีระพงศ์ ดวงมณี',
      reporter_reference: 'นายอนุภาพ ภูหลัก',
      recorded_by_reference: 'นายอนุภาพ ภูหลัก',
      origin_department_id: 'dept-med',
      detection_department_id: 'dept-pharma',
      reported_date: '2026-10-25',
      rca_status: 'none'
    },
    notes: ["Suggested origin department 'dept-med' based on prescribing physician (นพ.วีระพงศ์ ดวงมณี)."],
    status: 'review',
    event_id: null,
    reject_reason: null,
    reviewed_by: null,
    reviewed_at: null,
    created_by: 'user-rev1',
    created_at: '2026-10-25T14:30:00Z'
  }
];

// Initial High-Volume Process RCA and Systemic Action Plans
const INITIAL_PROCESS_RCA_PLANS = [
  {
    id: 'prca-01',
    process_code: 'PDI',
    analysis_title: 'มาตรการลดความคลาดเคลื่อนขั้นตอนก่อนการจ่ายยา (PDI) ด้วยระบบ Barcode Scanning & Tall Man Lettering',
    top_subtypes: ['PDI-01 (จัดยาผิดชนิด)', 'PDI-02 (จัดยาผิดความแรง)', 'PDI-15 (จัดยาไม่ครบรายการ)'],
    root_cause_summary: 'จากการวิเคราะห์ 5M พบว่าการจัดเก็บยา Look-Alike ในชั้นวางติดกัน, ป้ายชื่อยาตัวอักษรเล็ก, และภาระงานหนาแน่นช่วงเวลา 10:00 - 12:00 น. ส่งผลให้เกิดความคลาดเคลื่อนในการจัดยาก่อนส่งมอบ',
    action_plan: '1. ติดสติกเกอร์ Tall Man lettering แยกกลุ่มยา LASA บนชั้นวาง\n2. บังคับยิงบาร์โค้ด 2D DataMatrix หน้าซองยาเทียบกับใบสั่งยาก่อนจัดใส่ตะกร้า\n3. จัดระบบพักหมุนเวียนเจ้าหน้าที่จัดยาไม่เกิน 2 ชั่วโมงต่อเนื่อง เพื่อลดความเมื่อยล้า',
    target_reduction_pct: 50,
    responsible_team: 'ภญ.กัญญา (หน.ห้องยา) & ทีมเภสัชกรจ่ายยาผู้ป่วยนอก',
    status: 'in_progress',
    target_date: '2026-11-30',
    created_by: 'user-admin',
    created_at: '2026-10-24T08:00:00Z',
    updated_at: '2026-10-25T09:00:00Z'
  },
  {
    id: 'prca-02',
    process_code: 'PRE',
    analysis_title: 'การปรับปรุงระบบ CPOE Alert และ Default Dose ป้องกัน Prescribing Error สำหรับแพทย์ประจำบ้าน',
    top_subtypes: ['PRE-01 (สั่งยาผิดชนิด)', 'PRE-10 (ไม่ปรับขนาดยาตามการทำงานของไต)', 'PRE-18 (สั่งยาชื่อพ้อง LASA)'],
    root_cause_summary: 'แพทย์เลือกรายการยาจากเมนูดรอปดาวน์ที่ชื่อคล้ายกันโดยไม่ได้อ่านขนาดยาชัดเจน และระบบ CPOE เดิมยังไม่เชื่อมโยงค่า eGFR แบบ Real-time alert',
    action_plan: '1. ปรับปรุง CPOE ให้มี Pop-up เตือนสีแดงเมื่อสั่งยา Renal risk ในผู้ป่วย eGFR < 30 mL/min\n2. แสดงชื่อสามัญทางยา (Generic Name) ตัวหนาใหญ่ และกำหนด Max Daily Dose บังคับยืนยัน\n3. อบรมแนวทางการใช้ยาปลอดภัยสำหรับแพทย์จบใหม่ทุก 6 เดือน',
    target_reduction_pct: 60,
    responsible_team: 'นพ.สมชาย (ประธาน PTC) & ศูนย์ IT',
    status: 'active',
    target_date: '2026-12-15',
    created_by: 'user-admin',
    created_at: '2026-10-23T14:00:00Z',
    updated_at: '2026-10-25T10:00:00Z'
  }
];

// Initial Drug Master Catalog with HAD (High Alert Drug) Flags (Hospital Formulary)
const INITIAL_DRUGS = HOSPITAL_DRUG_CATALOG;

// Initial Monthly Prescription Volume Denominator (OPD & IPD count per month)
const INITIAL_MONTHLY_PRESCRIPTIONS: Record<string, { opd: number; ipd: number; notes?: string }> = {
  '2026-05': { opd: 14200, ipd: 3100, notes: 'พฤษภาคม 2569' },
  '2026-06': { opd: 13800, ipd: 2950, notes: 'มิถุนายน 2569' },
  '2026-07': { opd: 14500, ipd: 3200, notes: 'กรกฎาคม 2569' },
  '2026-08': { opd: 15100, ipd: 3350, notes: 'สิงหาคม 2569' },
  '2026-09': { opd: 14900, ipd: 3280, notes: 'กันยายน 2569' },
  '2026-10': { opd: 15400, ipd: 3420, notes: 'ตุลาคม 2569 (เดือนปัจจุบัน)' }
};

export interface LasaPair {
  id: string;
  drugA: string;
  drugB: string;
  similarity_type: 'look_alike' | 'sound_alike' | 'both';
  tallmanA?: string;
  tallmanB?: string;
  category?: string;
  note: string;
  created_at: string;
  updated_at?: string;
}

const INITIAL_LASA_PAIRS: LasaPair[] = [
  {
    id: 'lasa-1',
    drugA: 'Daflon 500 mg tab',
    drugB: 'Dilantin 100 mg cap',
    similarity_type: 'both',
    tallmanA: 'DAFLON 500 mg tab',
    tallmanB: 'DILANTIN 100 mg cap',
    category: 'Oral',
    note: 'ชื่อพ้องและขึ้นต้นด้วยอักษรคล้ายกัน เม็ดยา/แคปซูลต่างกลุ่มบำบัด แยกจุดจัดเก็บเด็ดขาด',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-2',
    drugA: 'Tramadol 50 mg cap',
    drugB: 'Trazodone 50 mg tab',
    similarity_type: 'sound_alike',
    tallmanA: 'traMADol 50 mg cap',
    tallmanB: 'traZODone 50 mg tab',
    category: 'Oral',
    note: 'ชื่อพ้องเสียงคล้าย (Sound-Alike) ให้สังเกต Tall Man Letters MAD vs ZOD',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-3',
    drugA: 'Cefazolin 1 g vial',
    drugB: 'Ceftriaxone 1 g vial',
    similarity_type: 'both',
    tallmanA: 'cefaZOLIN 1 g vial',
    tallmanB: 'cefTRIAXONE 1 g vial',
    category: 'Injections',
    note: 'ยาปฏิชีวนะกลุ่ม Cephalosporin ไวอัลคล้ายกัน ตรวจสอบ Generation และ Indication ก่อนจ่าย',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-4',
    drugA: 'Amlodipine 5 mg tab',
    drugB: 'Amlodipine 10 mg tab',
    similarity_type: 'look_alike',
    tallmanA: 'Amlodipine 5 mg tab',
    tallmanB: 'Amlodipine 10 mg tab',
    category: 'Oral',
    note: 'ยาตัวเดียวกันแต่ขนาดยาต่างกัน (5 vs 10 mg) แผงยาคล้ายกันมาก ตรวจสอบขนาดยาทุกครั้ง',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-5',
    drugA: 'Adrenaline 1 mg/1 mL amp',
    drugB: 'Atropine 0.6 mg/1 mL amp',
    similarity_type: 'both',
    tallmanA: 'ADRENALINE 1 mg/1 mL amp',
    tallmanB: 'ATROPINE 0.6 mg/1 mL amp',
    category: 'Emergency',
    note: 'ยาช่วยชีวิตฉุกเฉิน หลอดแก้วใสขนาด 1 mL คล้ายกันมาก ติดสติกเกอร์แยกกล่องจัดเก็บ',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-6',
    drugA: 'Hydralazine 25 mg tab',
    drugB: 'Hydroxyzine 25 mg tab',
    similarity_type: 'sound_alike',
    tallmanA: 'hydrALAZINE 25 mg tab',
    tallmanB: 'hydrOXYzine 25 mg tab',
    category: 'Oral',
    note: 'ยาลดความดัน (ALAZINE) vs ยาแก้แพ้/แก้คัน (OXYzine) เสี่ยงสลับหากอ่านลายมือหวัด',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-7',
    drugA: 'Metformin 500 mg tab',
    drugB: 'Glipizide 5 mg tab',
    similarity_type: 'look_alike',
    tallmanA: 'Metformin 500 mg tab',
    tallmanB: 'Glipizide 5 mg tab',
    category: 'Oral',
    note: 'ยาลดน้ำตาลในเลือด เม็ดกลมขาวคล้ายกัน ระวังผู้ป่วยสลับยาที่บ้าน',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-8',
    drugA: 'Dopamine 250 mg/10 mL',
    drugB: 'Dobutamine 250 mg/20 mL',
    similarity_type: 'both',
    tallmanA: 'DOPamine 250 mg',
    tallmanB: 'DOBUTamine 250 mg',
    category: 'Injections',
    note: 'ยา Inotrope กลุ่มวิกฤติ ใช้ Tall Man Letters: DOPamine vs DOBUTamine และ Double Check อัตราดริป',
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 'lasa-9',
    drugA: 'Warfarin 2 mg tab (Lavender)',
    drugB: 'Warfarin 5 mg tab (Pink)',
    similarity_type: 'look_alike',
    tallmanA: 'Warfarin 2 mg (Lavender)',
    tallmanB: 'Warfarin 5 mg (Pink)',
    category: 'High Alert',
    note: 'ยาต้านการแข็งตัวของเลือด เสี่ยงภาวะเลือดออกรุนแรงหากได้รับผิดขนาด ตรวจสอบสีเม็ดยาและค่า INR',
    created_at: '2026-05-01T08:00:00Z'
  }
];

class LocalStore {
  private reports: any[] = [];
  private hosxpQueue: any[] = [];
  private auditLogs: any[] = [];
  private statusHistories: any[] = [];
  private departments: any[] = [];
  private users: any[] = [];
  private meSubtypes: any[] = [];
  private processRcaPlans: any[] = [];
  private drugs: any[] = [];
  private lasaPairs: LasaPair[] = [];
  private positions: string[] = [];
  private monthlyPrescriptions: Record<string, { opd: number; ipd: number; notes?: string }> = {};
  private currentUser: any = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedReports = localStorage.getItem('med_error_reports_v5');
      const savedHosxp = localStorage.getItem('med_error_hosxp_v5');
      const savedUser = localStorage.getItem('med_error_current_user_v5');
      const savedDepts = localStorage.getItem('med_error_departments_v5');
      const savedUsers = localStorage.getItem('med_error_users_v5');
      const savedSubtypes = localStorage.getItem('med_error_subtypes_v5');
      const savedProcessRca = localStorage.getItem('med_error_process_rca_v5');
      const savedDrugs = localStorage.getItem('med_error_drugs_v6') || localStorage.getItem('med_error_drugs_v5');
      const savedPrescriptions = localStorage.getItem('med_error_prescriptions_v5');
      const savedPositions = localStorage.getItem('med_error_positions_v1');

      this.reports = savedReports ? JSON.parse(savedReports) : [...INITIAL_REPORTS];
      this.hosxpQueue = savedHosxp ? JSON.parse(savedHosxp) : [...INITIAL_HOSXP_QUEUE];
      this.departments = savedDepts ? JSON.parse(savedDepts) : [...INITIAL_DEPTS];
      this.users = savedUsers ? JSON.parse(savedUsers) : [...INITIAL_USERS];
      this.meSubtypes = savedSubtypes ? JSON.parse(savedSubtypes) : [...INITIAL_SUBTYPES];
      this.processRcaPlans = savedProcessRca ? JSON.parse(savedProcessRca) : [...INITIAL_PROCESS_RCA_PLANS];
      let loadedDrugs = [...INITIAL_DRUGS];
      if (savedDrugs) {
        try {
          const parsed = JSON.parse(savedDrugs);
          if (Array.isArray(parsed) && parsed.length >= 200) {
            loadedDrugs = parsed;
          }
        } catch {
          loadedDrugs = [...INITIAL_DRUGS];
        }
      }
      this.drugs = loadedDrugs;
      const savedLasa = localStorage.getItem('med_error_lasa_pairs_v2');
      this.lasaPairs = savedLasa ? JSON.parse(savedLasa) : [...INITIAL_LASA_PAIRS];
      this.monthlyPrescriptions = savedPrescriptions ? JSON.parse(savedPrescriptions) : { ...INITIAL_MONTHLY_PRESCRIPTIONS };
      
      let loadedPositions = savedPositions ? JSON.parse(savedPositions) : [...INITIAL_POSITIONS];
      // Filter out 'Specialist Staff' from positions list (Specialist Staff is handled via doctor checkbox)
      loadedPositions = loadedPositions.filter((p: string) => p !== 'Specialist Staff');
      if (loadedPositions.length === 0) {
        loadedPositions = [...INITIAL_POSITIONS];
      }
      this.positions = loadedPositions;

      // Normalize users: strip position, ensure Admins (อนุภาพ, ธัญยพร, กฤติกา: pass 654321) and default pass 123456
      this.users = this.users.map((u: any) => {
        let name = u.display_name || '';
        if (name.includes('ธันยพร')) {
          name = 'ธัญยพร เจริญผล';
        }
        const isAdmin = ['อนุภาพ', 'ธัญยพร', 'กฤติกา'].some(adminName => name.includes(adminName));
        return {
          ...u,
          display_name: name,
          position: '',
          role: isAdmin ? 'admin' : u.role,
          password: isAdmin ? '654321' : (u.password || '123456'),
          is_specialist: Boolean(u.is_specialist)
        };
      });

      // Require explicit login - default to null if no valid saved session
      const sessionActive = sessionStorage.getItem('med_error_active_session_id');
      if (sessionActive) {
        const found = this.users.find(u => u.id === sessionActive);
        this.currentUser = found || null;
      } else {
        this.currentUser = null;
      }
    } catch (e) {
      this.reports = [...INITIAL_REPORTS];
      this.hosxpQueue = [...INITIAL_HOSXP_QUEUE];
      this.departments = [...INITIAL_DEPTS];
      this.users = INITIAL_USERS.map((u: any) => {
        let name = u.display_name || '';
        if (name.includes('ธันยพร')) name = 'ธัญยพร เจริญผล';
        const isAdmin = ['อนุภาพ', 'ธัญยพร', 'กฤติกา'].some(adminName => name.includes(adminName));
        return {
          ...u,
          display_name: name,
          position: '',
          role: isAdmin ? 'admin' : u.role,
          password: isAdmin ? '654321' : '123456',
          is_specialist: Boolean(u.is_specialist)
        };
      });
      this.meSubtypes = [...INITIAL_SUBTYPES];
      this.processRcaPlans = [...INITIAL_PROCESS_RCA_PLANS];
      this.drugs = [...INITIAL_DRUGS];
      this.lasaPairs = [...INITIAL_LASA_PAIRS];
      this.positions = [];
      this.monthlyPrescriptions = { ...INITIAL_MONTHLY_PRESCRIPTIONS };
      this.currentUser = null;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('med_error_reports_v5', JSON.stringify(this.reports));
      localStorage.setItem('med_error_hosxp_v5', JSON.stringify(this.hosxpQueue));
      if (this.currentUser) {
        localStorage.setItem('med_error_current_user_v5', this.currentUser.id);
        sessionStorage.setItem('med_error_active_session_id', this.currentUser.id);
      } else {
        localStorage.removeItem('med_error_current_user_v5');
        sessionStorage.removeItem('med_error_active_session_id');
      }
      localStorage.setItem('med_error_departments_v5', JSON.stringify(this.departments));
      localStorage.setItem('med_error_users_v5', JSON.stringify(this.users));
      localStorage.setItem('med_error_subtypes_v5', JSON.stringify(this.meSubtypes));
      localStorage.setItem('med_error_process_rca_v5', JSON.stringify(this.processRcaPlans));
      localStorage.setItem('med_error_drugs_v6', JSON.stringify(this.drugs));
      localStorage.setItem('med_error_lasa_pairs_v2', JSON.stringify(this.lasaPairs));
      localStorage.setItem('med_error_positions_v1', JSON.stringify(this.positions));
      localStorage.setItem('med_error_prescriptions_v5', JSON.stringify(this.monthlyPrescriptions));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }

  public getCurrentUser() {
    return this.currentUser;
  }

  public setCurrentUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.saveToStorage();
    }
    return this.currentUser;
  }

  public login(nameOrId: string, password: string): { success: boolean; user?: any; error?: string } {
    const rawTrimmed = (nameOrId || '').trim();
    const trimmed = rawTrimmed.toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'กรุณาพิมพ์ชื่อ - นามสกุลผู้ใช้งาน' };
    }
    const cleanQuery = stripTitlePrefix(trimmed).toLowerCase();

    // Find in existing master staff list
    let user = this.users.find(u => {
      const uName = (u.display_name || '').toLowerCase();
      const uClean = stripTitlePrefix(uName).toLowerCase();
      return (
        u.id.toLowerCase() === trimmed ||
        uName === trimmed ||
        uClean === cleanQuery ||
        (cleanQuery.length >= 3 && (uName.includes(trimmed) || uClean.includes(cleanQuery) || trimmed.includes(uClean)))
      );
    });

    const isAdmin = ['อนุภาพ', 'ธัญยพร', 'กฤติกา'].some(a => 
      rawTrimmed.includes(a) || (user && user.display_name.includes(a))
    );

    const isPasswordCorrect = isAdmin
      ? (password === '654321' || password === '1654321')
      : (password === '123456' || (user && password === user.password));

    if (!isPasswordCorrect) {
      return {
        success: false,
        error: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง'
      };
    }

    // If new staff member types their name with valid password (123456), onboard them smoothly
    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        display_name: rawTrimmed,
        role: isAdmin ? 'admin' : 'reporter',
        department_id: 'dept-pharma',
        position: 'เจ้าหน้าที่',
        password: isAdmin ? '654321' : '123456',
        is_specialist: false
      };
      this.users.push(user);
    }

    if (isAdmin && user.role !== 'admin') {
      user.role = 'admin';
    }

    this.currentUser = user;
    this.saveToStorage();
    return { success: true, user };
  }

  public logout() {
    this.currentUser = null;
    try {
      localStorage.removeItem('med_error_current_user_v5');
      sessionStorage.removeItem('med_error_active_session_id');
    } catch {}
  }

  // --- Master Data CRUD: Departments ---
  public getDepartments() {
    return this.departments;
  }

  public addDepartment(dept: { code: string; name: string }) {
    const newDept = {
      id: `dept-${Date.now()}`,
      code: dept.code.toUpperCase().trim(),
      name: dept.name.trim()
    };
    this.departments.push(newDept);
    this.addAuditLog('departments', newDept.id, 'create', newDept);
    this.saveToStorage();
    return newDept;
  }

  public updateDepartment(id: string, patch: { code?: string; name?: string }) {
    const idx = this.departments.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.departments[idx] = { ...this.departments[idx], ...patch };
      this.addAuditLog('departments', id, 'update', patch);
      this.saveToStorage();
      return this.departments[idx];
    }
    return null;
  }

  public deleteDepartment(id: string) {
    this.departments = this.departments.filter(d => d.id !== id);
    this.addAuditLog('departments', id, 'delete', { id });
    this.saveToStorage();
  }

  // --- Master Data CRUD: Users ---
  public getUsers() {
    return this.users;
  }

  public addUser(user: { display_name: string; role: string; department_id: string; position?: string; is_specialist?: boolean; email?: string; password?: string }) {
    const cleanName = user.display_name.trim();
    const isAdmin = ['อนุภาพ', 'ธัญยพร', 'ธันยพร', 'กฤติกา'].some(a => cleanName.includes(a));
    const newUser = {
      id: `user-${Date.now()}`,
      display_name: cleanName,
      role: isAdmin ? 'admin' : user.role,
      department_id: user.department_id,
      position: '',
      is_specialist: Boolean(user.is_specialist),
      email: user.email || '',
      password: user.password?.trim() || (isAdmin ? '654321' : '123456')
    };
    this.users.push(newUser);
    this.addAuditLog('users', newUser.id, 'create', newUser);
    this.saveToStorage();
    return newUser;
  }

  public updateUser(id: string, patch: any) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...patch };
      if (this.currentUser && this.currentUser.id === id) {
        this.currentUser = this.users[idx];
      }
      this.addAuditLog('users', id, 'update', patch);
      this.saveToStorage();
      return this.users[idx];
    }
    return null;
  }

  public deleteUser(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.addAuditLog('users', id, 'delete', { id });
    this.saveToStorage();
  }

  public updatePassword(userId: string, newPassword: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;
    user.password = newPassword.trim();
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = { ...this.currentUser, password: newPassword.trim() };
    }
    this.addAuditLog('users', userId, 'update_password', { userId });
    this.saveToStorage();
    return true;
  }

  // --- Master Data CRUD: Positions (ตำแหน่งงาน) ---
  public getPositions(): string[] {
    return this.positions;
  }

  public addPosition(name: string): string {
    const trimmed = name.trim();
    if (!trimmed || this.positions.includes(trimmed)) return trimmed;
    this.positions.push(trimmed);
    this.addAuditLog('positions', trimmed, 'create', { name: trimmed });
    this.saveToStorage();
    return trimmed;
  }

  public updatePosition(oldName: string, newName: string): boolean {
    const trimmedOld = oldName.trim();
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedOld === trimmedNew) return false;
    const idx = this.positions.indexOf(trimmedOld);
    if (idx === -1) return false;

    this.positions[idx] = trimmedNew;
    // Cascade update all users holding this position
    let updatedUsersCount = 0;
    this.users = this.users.map(u => {
      if (u.position === trimmedOld) {
        updatedUsersCount++;
        return { ...u, position: trimmedNew };
      }
      return u;
    });

    this.addAuditLog('positions', trimmedOld, 'update', { oldName: trimmedOld, newName: trimmedNew, affected_users: updatedUsersCount });
    this.saveToStorage();
    return true;
  }

  public deletePosition(name: string): boolean {
    const trimmed = name.trim();
    const beforeCount = this.positions.length;
    this.positions = this.positions.filter(p => p !== trimmed);
    if (this.positions.length !== beforeCount) {
      this.addAuditLog('positions', trimmed, 'delete', { name: trimmed });
      this.saveToStorage();
      return true;
    }
    return false;
  }


  // --- Master Data CRUD: ME Subtypes ---
  public getMeSubtypes(process?: string) {
    if (!process || process === 'all') return this.meSubtypes;
    return this.meSubtypes.filter(m => m.process === process);
  }

  public addMeSubtype(item: { process: string; code: string; label: string }) {
    const newItem = {
      process: item.process,
      code: item.code.trim(),
      label: item.label.trim()
    };
    this.meSubtypes.push(newItem);
    this.addAuditLog('master_options', newItem.code, 'create', newItem);
    this.saveToStorage();
    return newItem;
  }

  public updateMeSubtype(code: string, patch: { label?: string; process?: string }) {
    const idx = this.meSubtypes.findIndex(m => m.code === code);
    if (idx !== -1) {
      this.meSubtypes[idx] = { ...this.meSubtypes[idx], ...patch };
      this.addAuditLog('master_options', code, 'update', patch);
      this.saveToStorage();
      return this.meSubtypes[idx];
    }
    return null;
  }

  public deleteMeSubtype(code: string) {
    this.meSubtypes = this.meSubtypes.filter(m => m.code !== code);
    this.addAuditLog('master_options', code, 'delete', { code });
    this.saveToStorage();
  }

  // --- Master Data CRUD: Drugs & HAD (High Alert Drugs) ---
  public getDrugs() {
    return this.drugs;
  }

  public addDrug(drug: { name: string; strength?: string; is_had?: boolean; is_lasa?: boolean; generic_name?: string; dosage_form?: string; category?: string }) {
    const newDrug = {
      id: `drug-${Date.now()}`,
      name: drug.name.trim(),
      generic_name: drug.generic_name ? drug.generic_name.trim() : drug.name.trim(),
      strength: drug.strength ? drug.strength.trim() : '',
      dosage_form: drug.dosage_form || 'Tablet',
      is_had: Boolean(drug.is_had),
      is_lasa: Boolean(drug.is_lasa),
      category: drug.category || 'General'
    };
    this.drugs.push(newDrug);
    this.addAuditLog('master_drugs', newDrug.id, 'create', newDrug);
    this.saveToStorage();
    return newDrug;
  }

  public updateDrug(id: string, patch: any) {
    const idx = this.drugs.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.drugs[idx] = { ...this.drugs[idx], ...patch };
      this.addAuditLog('master_drugs', id, 'update', patch);
      this.saveToStorage();
      return this.drugs[idx];
    }
    return null;
  }

  public toggleHadStatus(id: string) {
    const idx = this.drugs.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.drugs[idx].is_had = !this.drugs[idx].is_had;
      this.addAuditLog('master_drugs', id, 'toggle_had', { is_had: this.drugs[idx].is_had });
      this.saveToStorage();
      return this.drugs[idx];
    }
    return null;
  }

  public toggleLasaStatus(id: string) {
    const idx = this.drugs.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.drugs[idx].is_lasa = !this.drugs[idx].is_lasa;
      this.addAuditLog('master_drugs', id, 'toggle_lasa', { is_lasa: this.drugs[idx].is_lasa });
      this.saveToStorage();
      return this.drugs[idx];
    }
    return null;
  }

  public setDrugHadStatus(id: string, isHad: boolean) {
    const idx = this.drugs.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.drugs[idx].is_had = isHad;
      this.addAuditLog('master_drugs', id, 'set_had', { is_had: isHad });
      this.saveToStorage();
      return this.drugs[idx];
    }
    return null;
  }

  public setDrugLasaStatus(id: string, isLasa: boolean) {
    const idx = this.drugs.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.drugs[idx].is_lasa = isLasa;
      this.addAuditLog('master_drugs', id, 'set_lasa', { is_lasa: isLasa });
      this.saveToStorage();
      return this.drugs[idx];
    }
    return null;
  }

  public deleteDrug(id: string) {
    this.drugs = this.drugs.filter(d => d.id !== id);
    this.addAuditLog('master_drugs', id, 'delete', { id });
    this.saveToStorage();
  }

  public checkDrugHad(drugName: string): boolean {
    if (!drugName || typeof drugName !== 'string') return false;
    if (isHighAlertDrug(drugName)) return true;
    const lower = drugName.toLowerCase().trim();
    return this.drugs.some(d => d.is_had && (lower.includes(d.name.toLowerCase()) || (d.generic_name && lower.includes(d.generic_name.toLowerCase()))));
  }

  // --- Master Data CRUD: LASA Pairs Management ---
  public getLasaPairs(): LasaPair[] {
    return this.lasaPairs;
  }

  public addLasaPair(pair: { drugA: string; drugB: string; similarity_type?: 'look_alike' | 'sound_alike' | 'both'; tallmanA?: string; tallmanB?: string; category?: string; note?: string }): LasaPair {
    const newPair: LasaPair = {
      id: `lasa-${Date.now()}`,
      drugA: pair.drugA.trim(),
      drugB: pair.drugB.trim(),
      similarity_type: pair.similarity_type || 'both',
      tallmanA: pair.tallmanA?.trim() || pair.drugA.trim(),
      tallmanB: pair.tallmanB?.trim() || pair.drugB.trim(),
      category: pair.category || 'General',
      note: pair.note?.trim() || '',
      created_at: new Date().toISOString()
    };
    this.lasaPairs.unshift(newPair);

    // Automatically flag is_lasa on matching drugs
    const normA = newPair.drugA.toLowerCase();
    const normB = newPair.drugB.toLowerCase();
    this.drugs.forEach(d => {
      const dName = d.name.toLowerCase();
      if (dName.includes(normA) || normA.includes(dName) || dName.includes(normB) || normB.includes(dName)) {
        d.is_lasa = true;
      }
    });

    this.addAuditLog('lasa_pairs', newPair.id, 'create', newPair);
    this.saveToStorage();
    return newPair;
  }

  public updateLasaPair(id: string, patch: Partial<LasaPair>): LasaPair | null {
    const idx = this.lasaPairs.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.lasaPairs[idx] = {
        ...this.lasaPairs[idx],
        ...patch,
        updated_at: new Date().toISOString()
      };
      this.addAuditLog('lasa_pairs', id, 'update', patch);
      this.saveToStorage();
      return this.lasaPairs[idx];
    }
    return null;
  }

  public deleteLasaPair(id: string) {
    this.lasaPairs = this.lasaPairs.filter(p => p.id !== id);
    this.addAuditLog('lasa_pairs', id, 'delete', { id });
    this.saveToStorage();
  }

  public checkDynamicLasaPair(intended?: string, error?: string): any {
    if (!intended || !error) return null;
    const normA = intended.toLowerCase().trim();
    const normB = error.toLowerCase().trim();

    const customMatch = this.lasaPairs.find(p =>
      (normA.includes(p.drugA.toLowerCase()) && normB.includes(p.drugB.toLowerCase())) ||
      (normA.includes(p.drugB.toLowerCase()) && normB.includes(p.drugA.toLowerCase()))
    );
    if (customMatch) {
      return {
        drugA: customMatch.drugA,
        drugB: customMatch.drugB,
        tallmanA: customMatch.tallmanA,
        tallmanB: customMatch.tallmanB,
        similarity_type: customMatch.similarity_type,
        note: customMatch.note || 'คู่ยา LASA ที่กำหนดโดยโรงพยาบาล'
      };
    }

    return checkLasaPair(intended, error);
  }

  // --- Monthly Prescription Volume Denominator Methods ---
  public getAllMonthlyPrescriptions() {
    return this.monthlyPrescriptions;
  }

  public getMonthlyPrescriptions(monthKey?: string) {
    if (!monthKey) {
      const now = new Date();
      monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    return this.monthlyPrescriptions[monthKey] || { opd: 15000, ipd: 3000, notes: '' };
  }

  public setMonthlyPrescriptions(monthKey: string, opd: number, ipd: number, notes?: string) {
    this.monthlyPrescriptions[monthKey] = {
      opd: Math.max(0, Number(opd) || 0),
      ipd: Math.max(0, Number(ipd) || 0),
      notes: notes || '',
    };
    this.addAuditLog('prescription_volume', monthKey, 'update', this.monthlyPrescriptions[monthKey]);
    this.saveToStorage();
    return this.monthlyPrescriptions[monthKey];
  }

  // --- Reports Query with Date Range & Clinical Filters ---
  public getReports(filters: {
    status?: string;
    process?: string;
    ncc_merp?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    patient_type?: string;
    hadOnly?: boolean;
    lasaOnly?: boolean;
    eUpOnly?: boolean;
  } = {}) {
    // 1. RBAC filter
    let visible = this.reports.filter(r => canViewReport(this.currentUser, r));

    // 2. Status filter
    if (filters.status && filters.status !== 'all') {
      visible = visible.filter(r => r.status === filters.status);
    }

    // 2.1 Patient Type filter (IPD, OPD, TELEMED)
    if (filters.patient_type && filters.patient_type !== 'all') {
      visible = visible.filter(r => r.patient_type === filters.patient_type);
    }

    // 3. Process filter
    if (filters.process && filters.process !== 'all') {
      visible = visible.filter(r => r.process === filters.process);
    }

    // 4. Severity filter
    if (filters.ncc_merp && filters.ncc_merp !== 'all') {
      visible = visible.filter(r => r.ncc_merp === filters.ncc_merp);
    }

    // 5. Date Range filter (YYYY-MM-DD on incident_date or reported_date)
    if (filters.startDate) {
      visible = visible.filter(r => (r.incident_date || r.reported_date) >= filters.startDate!);
    }
    if (filters.endDate) {
      visible = visible.filter(r => (r.incident_date || r.reported_date) <= filters.endDate!);
    }

    // 6. Clinical Focus Filters
    if (filters.hadOnly) {
      visible = visible.filter(r => this.checkDrugHad(r.intended_drug) || this.checkDrugHad(r.error_drug));
    }
    if (filters.lasaOnly) {
      visible = visible.filter(r =>
        Boolean(this.checkDynamicLasaPair(r.intended_drug, r.error_drug)) ||
        (r.me_subtype && r.me_subtype.includes('PRE-18')) ||
        (r.problem_description && (r.problem_description.includes('LASA') || r.problem_description.includes('คล้าย')))
      );
    }
    if (filters.eUpOnly) {
      visible = visible.filter(r => ['E', 'F', 'G', 'H', 'I'].includes(r.ncc_merp));
    }

    // 7. Universal Search query (matches HN, drug, strength, person name, department, subtype, cause, etc.)
    if (filters.search) {
      const term = filters.search.toLowerCase().trim();
      visible = visible.filter(r => {
        const originDept = (this.departments.find(d => d.id === r.origin_department_id)?.name || '').toLowerCase();
        const detectDept = (this.departments.find(d => d.id === r.detection_department_id)?.name || '').toLowerCase();
        return (
          (r.report_no && r.report_no.toLowerCase().includes(term)) ||
          (r.hn && r.hn.toLowerCase().includes(term)) ||
          (r.patient_type && r.patient_type.toLowerCase().includes(term)) ||
          (r.intended_drug && r.intended_drug.toLowerCase().includes(term)) ||
          (r.intended_drug_strength && r.intended_drug_strength.toLowerCase().includes(term)) ||
          (r.error_drug && r.error_drug.toLowerCase().includes(term)) ||
          (r.error_drug_strength && r.error_drug_strength.toLowerCase().includes(term)) ||
          (r.problem_description && r.problem_description.toLowerCase().includes(term)) ||
          (r.error_staff_reference && r.error_staff_reference.toLowerCase().includes(term)) ||
          (r.consult_recipient_reference && r.consult_recipient_reference.toLowerCase().includes(term)) ||
          (r.reporter_reference && r.reporter_reference.toLowerCase().includes(term)) ||
          (r.recorded_by_reference && r.recorded_by_reference.toLowerCase().includes(term)) ||
          (r.verified_by && String(r.verified_by).toLowerCase().includes(term)) ||
          (originDept && originDept.includes(term)) ||
          (detectDept && detectDept.includes(term)) ||
          (r.me_subtype && r.me_subtype.toLowerCase().includes(term)) ||
          (r.cause && r.cause.toLowerCase().includes(term))
        );
      });
    }

    return visible.map(r => this.enrichReport(r));
  }

  public getReportById(id: string) {
    const report = this.reports.find(r => r.id === id);
    if (!report) return null;
    if (!canViewReport(this.currentUser, report)) {
      throw new Error('Access denied: You do not have permission to view this report.');
    }
    return this.enrichReport(report);
  }

  private enrichReport(r: any) {
    const originDept = this.departments.find(d => d.id === r.origin_department_id);
    const detectDept = this.departments.find(d => d.id === r.detection_department_id);
    const creator = this.users.find(u => u.id === r.created_by);
    const verifier = this.users.find(u => u.id === r.verified_by);
    const rcaCompleter = this.users.find(u => u.id === r.rca_completed_by);
    const isHad = this.checkDrugHad(r.intended_drug) || this.checkDrugHad(r.error_drug);
    const lasaMatch = this.checkDynamicLasaPair(r.intended_drug, r.error_drug);
    const isEUp = ['E', 'F', 'G', 'H', 'I'].includes(r.ncc_merp);

    return {
      ...r,
      origin_department_name: originDept?.name || r.origin_department_id,
      detection_department_name: detectDept?.name || r.detection_department_id,
      creator_name: creator?.display_name || r.created_by,
      creator_role: creator?.role || '',
      verifier_name: verifier?.display_name || '',
      rca_completed_by_name: rcaCompleter?.display_name || '',
      is_had: isHad,
      lasa_info: lasaMatch,
      is_e_up: isEUp,
      rca_status: r.rca_status || (isEUp ? 'pending' : 'none'),
      rca_team: r.rca_team || '',
      rca_root_cause_type: r.rca_root_cause_type || '',
      rca_fishbone: r.rca_fishbone || null,
      rca_summary: r.rca_summary || '',
      rca_action_plan: r.rca_action_plan || '',
      rca_responsible: r.rca_responsible || '',
      rca_due_date: r.rca_due_date || '',
      rca_completed_at: r.rca_completed_at || null
    };
  }

  public createReport(payload: any) {
    payload.rm_grade = computeRmGrade(payload.ncc_merp);
    const validation = validateReport(payload, false);
    if (!validation.valid) {
      throw { message: 'Validation failed', errors: validation.errors };
    }

    const id = `me-${Date.now()}`;
    const reportNo = `ME-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    const now = new Date().toISOString();

    const newReport = {
      ...payload,
      id,
      report_no: reportNo,
      status: 'pending',
      ever_verified: 0,
      verified_by: null,
      verified_at: null,
      created_by: this.currentUser.id,
      created_at: now,
      updated_at: now
    };

    this.reports.unshift(newReport);
    this.addAuditLog('error_events', id, 'create', newReport);
    this.addStatusHistory(id, 'create', null, 'pending', 'Initial report created');
    this.saveToStorage();

    return this.enrichReport(newReport);
  }

  public patchReport(id: string, patchFields: any) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Report not found');
    const existing = this.reports[index];

    if (!canEditReport(this.currentUser, existing)) {
      throw new Error('Forbidden: You do not have permission to edit this report in its current state.');
    }

    if (patchFields.ncc_merp) {
      patchFields.rm_grade = computeRmGrade(patchFields.ncc_merp);
    }

    const validation = validateReport(patchFields, true);
    if (!validation.valid) {
      throw { message: 'Validation failed', errors: validation.errors };
    }

    const diff = computeFieldDiff(existing, patchFields);
    const updated = {
      ...existing,
      ...patchFields,
      updated_at: new Date().toISOString()
    };

    this.reports[index] = updated;
    this.addAuditLog('error_events', id, 'update', diff);
    this.saveToStorage();

    return this.enrichReport(updated);
  }

  public transitionReport(id: string, action: string, comment?: string) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Report not found');
    const report = this.reports[index];

    const check = validateTransition(this.currentUser, report, action, comment);
    if (!check.allowed) {
      throw new Error(check.error || 'Transition not allowed');
    }

    const now = new Date().toISOString();
    const updated = {
      ...report,
      status: check.newStatus,
      updated_at: now
    };

    if (action === 'verify') {
      updated.ever_verified = 1;
      updated.verified_by = this.currentUser.id;
      updated.verified_at = now;
    }

    this.reports[index] = updated;
    this.addStatusHistory(id, action, report.status, check.newStatus, comment || null);
    this.addAuditLog('error_events', id, action, { fromStatus: report.status, toStatus: check.newStatus, comment });
    this.saveToStorage();

    return this.enrichReport(updated);
  }

  public deleteReport(id: string, reason?: string) {
    if (this.currentUser.role !== 'admin') {
      throw new Error('Forbidden: Only System Administrators can delete reports.');
    }
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Report not found');
    const removed = this.reports[idx];
    this.reports.splice(idx, 1);
    this.addAuditLog('error_events', id, 'delete', {
      report_no: removed.report_no,
      deleted_by: this.currentUser.display_name,
      reason: reason || 'ลบรายงานโดยผู้ดูแลระบบ (Admin)'
    });
    this.saveToStorage();
    return true;
  }

  // --- Risk Management & Root Cause Analysis (RCA) Methods ---
  public updateReportRca(id: string, rcaPayload: any) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Report not found');
    const existing = this.reports[idx];

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      rca_status: rcaPayload.rca_status || 'completed',
      rca_team: rcaPayload.rca_team !== undefined ? rcaPayload.rca_team : existing.rca_team,
      rca_root_cause_type: rcaPayload.rca_root_cause_type !== undefined ? rcaPayload.rca_root_cause_type : existing.rca_root_cause_type,
      rca_fishbone: rcaPayload.rca_fishbone !== undefined ? rcaPayload.rca_fishbone : existing.rca_fishbone,
      rca_summary: rcaPayload.rca_summary !== undefined ? rcaPayload.rca_summary : existing.rca_summary,
      rca_action_plan: rcaPayload.rca_action_plan !== undefined ? rcaPayload.rca_action_plan : existing.rca_action_plan,
      rca_responsible: rcaPayload.rca_responsible !== undefined ? rcaPayload.rca_responsible : existing.rca_responsible,
      rca_due_date: rcaPayload.rca_due_date !== undefined ? rcaPayload.rca_due_date : existing.rca_due_date,
      rca_completed_at: now,
      rca_completed_by: this.currentUser.id,
      updated_at: now
    };

    this.reports[idx] = updated;
    this.addAuditLog('error_events', id, 'rca_update', {
      rca_status: updated.rca_status,
      rca_summary: updated.rca_summary,
      rca_action_plan: updated.rca_action_plan
    });
    this.saveToStorage();

    return this.enrichReport(updated);
  }

  // --- High-Volume Process RCA Matrix Methods ---
  public getProcessRcaPlans() {
    return this.processRcaPlans;
  }

  public saveProcessRcaPlan(plan: any) {
    const now = new Date().toISOString();
    if (plan.id) {
      const idx = this.processRcaPlans.findIndex(p => p.id === plan.id);
      if (idx !== -1) {
        this.processRcaPlans[idx] = {
          ...this.processRcaPlans[idx],
          ...plan,
          updated_at: now
        };
        this.addAuditLog('process_rca_plans', plan.id, 'update', plan);
        this.saveToStorage();
        return this.processRcaPlans[idx];
      }
    }

    const newPlan = {
      ...plan,
      id: plan.id || `prca-${Date.now()}`,
      created_by: this.currentUser.id,
      created_at: now,
      updated_at: now
    };
    this.processRcaPlans.unshift(newPlan);
    this.addAuditLog('process_rca_plans', newPlan.id, 'create', newPlan);
    this.saveToStorage();
    return newPlan;
  }

  public deleteProcessRcaPlan(id: string) {
    this.processRcaPlans = this.processRcaPlans.filter(p => p.id !== id);
    this.addAuditLog('process_rca_plans', id, 'delete', { id });
    this.saveToStorage();
  }

  public toggleProcessRcaStatus(id: string) {
    const idx = this.processRcaPlans.findIndex(p => p.id === id);
    if (idx !== -1) {
      const current = this.processRcaPlans[idx].status;
      const newStatus = (current === 'completed' || current === 'done') ? 'in_progress' : 'completed';
      this.processRcaPlans[idx].status = newStatus;
      this.processRcaPlans[idx].updated_at = new Date().toISOString();
      this.addAuditLog('process_rca_plans', id, 'toggle_status', { status: newStatus });
      this.saveToStorage();
      return this.processRcaPlans[idx];
    }
    return null;
  }

  // --- HOSxP Staging Queue Methods ---
  public getHosxpQueue(statusFilter: string = 'review') {
    if (!['reviewer', 'admin'].includes(this.currentUser.role)) {
      return [];
    }
    if (!statusFilter || statusFilter === 'all') return this.hosxpQueue;
    return this.hosxpQueue.filter(h => h.status === statusFilter);
  }

  public stageHosxpRows(filename: string, rawRows: any[]) {
    if (!['reviewer', 'admin'].includes(this.currentUser.role)) {
      throw new Error('Only Reviewers and Admins can import HOSxP rows.');
    }

    const existingKeys = new Set(this.hosxpQueue.map(h => h.source_key));
    const staged: any[] = [];
    const duplicates: any[] = [];

    rawRows.forEach((row, idx) => {
      const stripped = stripPiiClientSide(row);
      const dt = stripped['วันที่/เวลา'] || stripped['วันที่ / เวลา'] || stripped.incident_datetime || stripped.incident_date || stripped.date || stripped.datetime || '';
      const hn = stripped['HN'] || stripped.hn || stripped.patient_hn || '';
      const drug = stripped['ชื่อยา'] || stripped.intended_drug || stripped.drug_name || stripped.medication || '';
      const step = stripped['ขั้นตอนของความคลาดเคลื่อน'] || stripped['ขั้นตอน'] || stripped.step || stripped.process || '';

      const key = generateDeduplicationHashSync(dt, hn, drug, step);

      if (existingKeys.has(key)) {
        duplicates.push({ rowNo: idx + 1, hn, drug, step });
        return;
      }

      const { proposed, notes } = mapHosxpToProposed(stripped);
      const stagedItem = {
        id: `hosxp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        source_key: key,
        filename,
        row_no: idx + 1,
        raw: stripped,
        proposed,
        notes,
        status: 'review',
        event_id: null,
        reject_reason: null,
        reviewed_by: null,
        reviewed_at: null,
        created_by: this.currentUser.id,
        created_at: new Date().toISOString()
      };

      staged.push(stagedItem);
      existingKeys.add(key);
    });

    this.hosxpQueue.unshift(...staged);
    this.saveToStorage();

    return {
      stagedCount: staged.length,
      duplicateCount: duplicates.length,
      duplicates
    };
  }

  public approveHosxpRow(hosxpId: string, customData: any = {}) {
    if (!['reviewer', 'admin'].includes(this.currentUser.role)) {
      throw new Error('Only Reviewers and Admins can approve HOSxP rows.');
    }

    const index = this.hosxpQueue.findIndex(h => h.id === hosxpId);
    if (index === -1) throw new Error('HOSxP staged item not found');

    const staged = this.hosxpQueue[index];
    const proposed = staged.proposed || {};
    const raw = staged.raw || {};
    const fallbackDate = new Date().toISOString().split('T')[0];

    // Combine custom overrides, proposed extraction, and safe defaults so creation never blocks
    const candidateData: any = {
      patient_type: customData.patient_type || proposed.patient_type || 'OPD',
      hn: (customData.hn || proposed.hn || raw.HN || raw.hn || '').trim() || '-',
      incident_date: customData.incident_date || proposed.incident_date || fallbackDate,
      incident_time: customData.incident_time || proposed.incident_time || '08:30',
      intended_drug: customData.intended_drug || proposed.intended_drug || raw['ชื่อยา'] || 'รอระบุชื่อยา',
      error_drug: customData.error_drug || proposed.error_drug || '-',
      problem_description: (customData.problem_description || proposed.problem_description || raw['หมายเหตุ'] || 'นำเข้าจาก HOSxP (รอตรวจสอบรายละเอียด)').trim(),
      corrective_action: (customData.corrective_action || proposed.corrective_action || 'รอระบุเพิ่มเติม').trim(),
      ncc_merp: customData.ncc_merp || proposed.ncc_merp || 'B',
      preventability: customData.preventability || proposed.preventability || 'C',
      origin_department_id: customData.origin_department_id || proposed.origin_department_id || 'dept-pharma',
      detection_department_id: customData.detection_department_id || proposed.detection_department_id || 'dept-pharma',
      process: customData.process || proposed.process || 'PDI',
      me_subtype: customData.me_subtype || proposed.me_subtype || 'PDI-01',
      cause: (customData.cause || proposed.cause || 'นำเข้าจาก HOSxP').trim(),
      error_staff_reference: (customData.error_staff_reference || proposed.error_staff_reference || raw['ผู้สั่งยา'] || '').trim(),
      consult_recipient_reference: (customData.consult_recipient_reference || proposed.consult_recipient_reference || '').trim(),
      reporter_reference: (customData.reporter_reference || proposed.reporter_reference || raw['เจ้าหน้าที่'] || this.currentUser.display_name).trim(),
      recorded_by_reference: this.currentUser.display_name,
      reported_date: customData.reported_date || proposed.reported_date || fallbackDate
    };

    // Ensure valid subtype matching process
    const validSubtypes = this.getMeSubtypes(candidateData.process);
    if (!validSubtypes.some(s => s.code === candidateData.me_subtype)) {
      candidateData.me_subtype = validSubtypes[0]?.code || `${candidateData.process}-01`;
    }

    // Ensure preventability is >= ncc_merp
    const nccRank = (candidateData.ncc_merp && ['E', 'F', 'G', 'H', 'I'].includes(candidateData.ncc_merp)) ? candidateData.ncc_merp : 'C';
    if (!candidateData.preventability || candidateData.preventability < nccRank) {
      candidateData.preventability = nccRank;
    }

    const createdReport = this.createReport(candidateData);

    const now = new Date().toISOString();
    this.hosxpQueue[index] = {
      ...this.hosxpQueue[index],
      status: 'imported',
      event_id: createdReport.id,
      reviewed_by: this.currentUser.id,
      reviewed_at: now
    };

    this.saveToStorage();
    return createdReport;
  }

  public bulkApproveHosxp(hosxpIds: string[]) {
    if (!['reviewer', 'admin'].includes(this.currentUser.role)) {
      throw new Error('Only Reviewers and Admins can approve HOSxP rows.');
    }
    const approved: any[] = [];
    for (const id of hosxpIds) {
      try {
        const report = this.approveHosxpRow(id, {});
        approved.push(report);
      } catch (err) {
        console.warn(`Bulk approve skip for ${id}:`, err);
      }
    }
    return approved;
  }

  public rejectHosxpRow(hosxpId: string, reason: string) {
    if (!['reviewer', 'admin'].includes(this.currentUser.role)) {
      throw new Error('Only Reviewers and Admins can reject HOSxP rows.');
    }
    if (!reason || !reason.trim()) {
      throw new Error('A mandatory reject reason is required.');
    }

    const index = this.hosxpQueue.findIndex(h => h.id === hosxpId);
    if (index === -1) throw new Error('HOSxP staged item not found');

    const now = new Date().toISOString();
    this.hosxpQueue[index] = {
      ...this.hosxpQueue[index],
      status: 'rejected',
      reject_reason: reason.trim(),
      reviewed_by: this.currentUser.id,
      reviewed_at: now
    };

    this.saveToStorage();
    return this.hosxpQueue[index];
  }

  public restoreHosxpRow(hosxpId: string) {
    if (!['reviewer', 'admin'].includes(this.currentUser.role)) {
      throw new Error('Only Reviewers and Admins can restore HOSxP rows.');
    }

    const index = this.hosxpQueue.findIndex(h => h.id === hosxpId);
    if (index === -1) throw new Error('HOSxP staged item not found');

    const now = new Date().toISOString();
    this.hosxpQueue[index] = {
      ...this.hosxpQueue[index],
      status: 'review',
      reject_reason: null,
      reviewed_by: this.currentUser.id,
      reviewed_at: now
    };

    this.saveToStorage();
    return this.hosxpQueue[index];
  }

  public getStatusHistory(eventId: string) {
    return this.statusHistories
      .filter(h => h.event_id === eventId)
      .map(h => {
        const actor = this.users.find(u => u.id === h.actor_id);
        return {
          ...h,
          actor_name: actor?.display_name || h.actor_id,
          actor_role: actor?.role || ''
        };
      });
  }

  public getAuditLogs() {
    return this.auditLogs.map(a => {
      const actor = this.users.find(u => u.id === a.actor_id);
      return {
        ...a,
        actor_name: actor?.display_name || a.actor_id,
        actor_role: actor?.role || ''
      };
    });
  }

  private addAuditLog(entity: string, entityId: string, action: string, changes: any) {
    this.auditLogs.unshift({
      id: `al-${Date.now()}`,
      entity,
      entity_id: entityId,
      action,
      changes,
      actor_id: this.currentUser.id,
      created_at: new Date().toISOString()
    });
  }

  private addStatusHistory(eventId: string, action: string, fromStatus: any, toStatus: any, comment: any) {
    this.statusHistories.push({
      id: `sh-${Date.now()}`,
      event_id: eventId,
      action,
      from_status: fromStatus,
      to_status: toStatus,
      comment,
      actor_id: this.currentUser.id,
      created_at: new Date().toISOString()
    });
  }

  public resetDemoData() {
    this.reports = [...INITIAL_REPORTS];
    this.hosxpQueue = [...INITIAL_HOSXP_QUEUE];
    this.departments = [...INITIAL_DEPTS];
    this.users = [...INITIAL_USERS];
    this.meSubtypes = [...INITIAL_SUBTYPES];
    this.auditLogs = [];
    this.statusHistories = [];
    this.saveToStorage();
  }
}

export const store = new LocalStore();
