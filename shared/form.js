/**
 * Medication Error Reporting System (v0.4 Simple Edition)
 * Shared Form Specification, Validation Rules, and Master Constants
 * Supports ES Modules (Browser, Cloudflare Workers, Node.js)
 */

export const PROCESS_OPTIONS = [
  { code: 'PRE', english: 'Prescribing', thai: 'สั่งใช้ยา', label: 'PRE: Prescribing (สั่งใช้ยา)', short: 'Prescribing' },
  { code: 'TRA', english: 'Transcribing', thai: 'คัดลอกคำสั่งใช้ยา', label: 'TRA: Transcribing (คัดลอกคำสั่งใช้ยา)', short: 'Transcribing' },
  { code: 'PDI', english: 'Pre-dispensing', thai: 'จัดและตรวจสอบก่อนจ่ายยา', label: 'PDI: Pre-dispensing (จัดและตรวจสอบก่อนจ่ายยา)', short: 'Pre-dispensing' },
  { code: 'DIS', english: 'Dispensing', thai: 'จ่ายยา', label: 'DIS: Dispensing (จ่ายยา)', short: 'Dispensing' },
  { code: 'ADM', english: 'Administration', thai: 'บริหารยา', label: 'ADM: Administration (บริหารยา)', short: 'Administration' },
  { code: 'PRO', english: 'Processing', thai: 'กระบวนการ', label: 'PRO: Processing (กระบวนการ)', short: 'Processing' },
];

// Initial Position Master List
export const INITIAL_POSITIONS = [
  'นายแพทย์',
  'เภสัชกร',
  'พยาบาลวิชาชีพ'
];


// Valid Report Statuses (Removed 'returned' as requested)
export const REPORT_STATUSES = ['pending', 'verified'];

// Hospital High Alert Drugs (HAD) Keyword Dictionary
export const HIGH_ALERT_DRUGS_KEYWORDS = [
  'insulin', 'actrapid', 'insulatard', 'mixtard', 'lantus', 'humalog', 'novorapid',
  'warfarin', 'coumadin',
  'heparin', 'enoxaparin', 'clexane', 'fondaparinux',
  'potassium chloride', 'kcl',
  'morphine', 'fentanyl', 'pethidine', 'tramadol',
  'digoxin',
  'adrenaline', 'epinephrine', 'norepinephrine', 'levophed', 'dopamine', 'dobutamine',
  'midazolam', 'dormicum', 'propofol',
  'methotrexate', 'chemo', 'fluorouracil', 'doxorubicin', 'cisplatin', 'cyclophosphamide',
  '50% glucose', 'hypertonic saline', '3% nacl', 'magnesium sulfate'
];

/**
 * Checks if a drug string belongs to High Alert Drugs (HAD)
 */
export function isHighAlertDrug(drugName) {
  if (!drugName || typeof drugName !== 'string') return false;
  const lower = drugName.toLowerCase();
  return HIGH_ALERT_DRUGS_KEYWORDS.some(kw => lower.includes(kw));
}

// Common Hospital Look-Alike Sound-Alike (LASA) Pairs
export const COMMON_LASA_PAIRS = [
  { drugA: 'Amlodipine 5 mg tab', drugB: 'Amlodipine 10 mg tab', note: 'Different strength / Same generic' },
  { drugA: 'Cefazolin 1 g vial', drugB: 'Ceftriaxone 1 g vial', note: 'Sound-alike Ceph 1st vs 3rd gen' },
  { drugA: 'Warfarin 2 mg tab (Lavender)', drugB: 'Warfarin 5 mg tab (Pink)', note: 'Packaging & look-alike color' },
  { drugA: 'Adrenaline 1 mg/1 mL amp', drugB: 'Atropine 0.6 mg/1 mL amp', note: 'Emergency drug LASA ampoules' },
  { drugA: 'Metformin 500 mg tab', drugB: 'Glipizide 5 mg tab', note: 'Oral hypoglycemic look-alike' },
  { drugA: 'Tramadol 50 mg cap', drugB: 'Omeprazole 20 mg cap', note: 'Capsule color confusion' },
  { drugA: 'Furosemide 20 mg/2 mL amp', drugB: 'Diazepam 10 mg/2 mL amp', note: 'Clear ampoule look-alike' }
];

/**
 * Checks if intended and error drugs form a LASA pair
 */
export function checkLasaPair(intended, error) {
  if (!intended || !error) return null;
  const normA = intended.toLowerCase().trim();
  const normB = error.toLowerCase().trim();
  return COMMON_LASA_PAIRS.find(p =>
    (normA.includes(p.drugA.toLowerCase()) && normB.includes(p.drugB.toLowerCase())) ||
    (normA.includes(p.drugB.toLowerCase()) && normB.includes(p.drugA.toLowerCase()))
  ) || null;
}

/**
 * Strip title prefixes (คำนำหน้า) from staff name
 */
export function stripTitlePrefix(name) {
  if (!name || typeof name !== 'string') return '';
  let cleaned = name.replace(/^\*/, '').trim();
  const prefixes = [
    'นายแพทย์', 'แพทย์หญิง', 'พยาบาลวิชาชีพ', 'เจ้าพนักงานเภสัชกรรม',
    'เภสัชกรหญิง', 'เภสัชกร', 'ทันตแพทย์หญิง', 'ทันตแพทย์',
    'น.ส.', 'นพ.', 'พญ.', 'ภก.', 'ภญ.', 'นศภ.', 'พว.', 'จพ.', 'ทพ.', 'ทญ.',
    'นาย', 'นางสาว', 'นาง', 'ดร.'
  ];
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix + ' ')) {
      cleaned = cleaned.slice((prefix + ' ').length).trim();
      break;
    } else if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length).trim();
      break;
    }
  }
  return cleaned;
}

/**
 * Clean ME subtype label (strip code like PRE-01:, TRA-02:, etc.)
 */
export function cleanSubtypeLabel(labelOrCode) {
  if (!labelOrCode || typeof labelOrCode !== 'string') return '';
  return labelOrCode.replace(/^[A-Z]{3}-\d+:\s*/, '').trim();
}

/**
 * Get full description with code and label for an ME subtype code or label
 */
export function getFullSubtypeLabel(codeOrLabel) {
  if (!codeOrLabel || typeof codeOrLabel !== 'string') return '';
  const trimmed = codeOrLabel.trim();
  const found = ME_SUBTYPES.find(
    s => s.code.toLowerCase() === trimmed.toLowerCase() ||
         s.label.toLowerCase().startsWith(trimmed.toLowerCase())
  );
  if (found) {
    return found.label;
  }
  return trimmed;
}


// Standard Question 10: การแก้ไขเบื้องต้น (Corrective Actions)
export const CORRECTIVE_ACTION_OPTIONS = [
  'แจ้งเจ้าหน้าที่แก้ไขยา/จัดยาใหม่ให้ถูกต้อง',
  'แก้ไขฉลากยาให้ครบถ้วน/ถูกต้อง',
  'แก้ไขข้อมูลในระบบให้ครบถ้วน/ถูกต้อง',
  'Consult แพทย์ เพื่อยืนยัน/แก้ไขคำสั่งยา แพทย์มีคำสั่งให้แก้ไขตามที่ consult',
  'ส่ง consult ตามระบบ รอคำตอบจากแพทย์',
  'หอผู้ป่วยแจ้งห้องยาเพื่อแก้ไข',
  'เจ้าหน้าที่เก็บยาที่ Off ออกจากหน้างาน',
  'แก้ไขไม่ได้ รอประสานผู้เกี่ยวข้อง',
  'อื่นๆ'
];

// Standard Question 13: วิเคราะห์สาเหตุเบื้องต้น
export const CAUSE_CATEGORY_OPTIONS = [
  'ไม่ปฏิบัติตามข้อตกลง',
  'บุคคลากรอายุงาน<6 เดือน',
  'ระบบคอมพิวเตอร์',
  'LASA',
  'อื่น ๆ'
];

// Standard MySQL Query for HOSxP Export
export const HOSXP_EXPORT_SQL = `-- SQL Query สำหรับดึงข้อมูลอุบัติการณ์ความคลาดเคลื่อนทางยาจาก HOSxP
-- ให้ผลลัพธ์ตรงกับรูปแบบไฟล์ส่งออก (12 คอลัมน์มาตรฐาน)
-- นำคำสั่งนี้ไปรันใน HOSxP Custom Report หรือ Navicat / MySQL Studio

SELECT 
    @row_num := @row_num + 1 AS "ลำดับ",
    DATE_FORMAT(CONCAT(m.incident_date, ' ', COALESCE(m.incident_time, '08:30:00')), '%d/%m/%Y %H:%i:%s') AS "วันที่/เวลา",
    m.hn AS "HN",
    -- คำเตือน: ชื่อผู้ป่วยจะถูกตัดออกอัตโนมัติในฝั่งบราวเซอร์ (Client-side) ตามมาตรฐาน PDPA
    CONCAT(pt.pname, pt.fname, ' ', pt.lname) AS "ชื่อผู้ป่วย",
    COALESCE(doc.name, m.doctor_name, '') AS "ผู้สั่งยา",
    CASE 
        WHEN w.name IS NOT NULL THEN 'IPD' 
        WHEN m.pt_type = 'IPD' THEN 'IPD'
        ELSE 'OPD' 
    END AS "แผนก",
    d1.name AS "ชื่อยา",
    CASE 
        WHEN m.order_type = 'PRE' THEN 'ความคลาดเคลื่อนในการสั่งใช้ยา (Prescribing error ):'
        WHEN m.order_type = 'TRA' THEN 'ความคลาดเคลื่อนในการคัดลอกคำสั่ง (Transcribing error)'
        WHEN m.order_type = 'PDI' THEN 'ความคลาดเคลื่อนก่อนการจ่ายยา ( Pre-dispensing error)'
        WHEN m.order_type = 'DIS' THEN 'ความคลาดเคลื่อนในการจ่ายยา (Dispensing error)'
        WHEN m.order_type = 'ADM' THEN 'ความคลาดเคลื่อนในการบริหารยา (Administration error)'
        ELSE 'ความคลาดเคลื่อนก่อนการจ่ายยา ( Pre-dispensing error)'
    END AS "ขั้นตอนของความคลาดเคลื่อน",
    COALESCE(m.error_subtype_name, '') AS "ชนิดความคลาดเคลื่อน",
    CONCAT('Category ', m.severity_level, ': ', COALESCE(m.severity_desc, '')) AS "ระดับความรุนแรง",
    m.incident_note AS "หมายเหตุ",
    COALESCE(staff.name, m.reporter_name, '') AS "เจ้าหน้าที่"
FROM (SELECT @row_num := 0) r, med_error_incident m
LEFT JOIN patient pt ON pt.hn = m.hn
LEFT JOIN ward w ON w.ward = m.ward
LEFT JOIN drugitems d1 ON d1.icode = m.intended_icode
LEFT JOIN doctor doc ON doc.code = m.doctor_code
LEFT JOIN opduser staff ON staff.loginname = m.reporter_login
WHERE m.incident_date BETWEEN '2026-01-01' AND '2026-12-31'
ORDER BY m.incident_date DESC, m.incident_time DESC;
`;

export const NCC_MERP_LEVELS = [
  { code: 'A', rank: 1, grade: 1, label: 'A: มีโอกาสเกิดความคลาดเคลื่อน - Potential', color: 'gray' },
  { code: 'B', rank: 2, grade: 2, label: 'B: เกิดความคลาดเคลื่อนแต่ยังไม่ถึงผู้ป่วย - Error, no reach', color: 'blue' },
  { code: 'C', rank: 3, grade: 2, label: 'C: ยาถึงผู้ป่วยแต่ไม่ทำให้เกิดอันตราย - Reached, no harm', color: 'emerald' },
  { code: 'D', rank: 4, grade: 2, label: 'D: ยาถึงผู้ป่วยและต้องเฝ้าระวังเพิ่มเติม - Reached, monitoring required', color: 'amber' },
  { code: 'E', rank: 5, grade: 3, label: 'E: เกิดอันตรายชั่วคราวและต้องให้การรักษา - Temporary harm, treated', color: 'orange' },
  { code: 'F', rank: 6, grade: 3, label: 'F: เกิดอันตรายชั่วคราวและต้องนอน รพ. นานขึ้น - Temporary harm, prolonged stay', color: 'orange' },
  { code: 'G', rank: 7, grade: 4, label: 'G: เกิดอันตรายถาวรแก่ผู้ป่วย - Permanent harm', color: 'rose' },
  { code: 'H', rank: 8, grade: 4, label: 'H: ต้องกู้ชีพหรือช่วยชีวิต - Near fatal, intervention needed', color: 'red' },
  { code: 'I', rank: 9, grade: 5, label: 'I: ผู้ป่วยเสียชีวิต - Death', color: 'purple' },
];

export const PREVENTABILITY_OPTIONS = [
  { code: 'C', rank: 3, label: 'C - Reached patient, no harm' },
  { code: 'D', rank: 4, label: 'D - Reached patient, monitoring needed' },
  { code: 'E', rank: 5, label: 'E - Temporary harm, treatment required' },
  { code: 'F', rank: 6, label: 'F - Temporary harm, prolonged hospitalization' },
  { code: 'G', rank: 7, label: 'G - Permanent patient harm' },
  { code: 'H', rank: 8, label: 'H - Life-sustaining intervention needed' },
  { code: 'I', rank: 9, label: 'I - Patient death' },
];

export const NCC_MERP_RANK = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9
};

/**
 * Automatically computes rm_grade from ncc_merp severity:
 * A -> 1
 * B, C, D -> 2
 * E, F -> 3
 * G, H -> 4
 * I -> 5
 */
export function computeRmGrade(nccMerp) {
  if (!nccMerp) return 1;
  const upper = String(nccMerp).toUpperCase();
  if (upper === 'A') return 1;
  if (['B', 'C', 'D'].includes(upper)) return 2;
  if (['E', 'F'].includes(upper)) return 3;
  if (['G', 'H'].includes(upper)) return 4;
  if (upper === 'I') return 5;
  return 1;
}

/**
 * Filter preventability options based on NCC-MERP severity.
 * Options are restricted to C through I.
 * Rule: preventability must be >= ncc_merp.
 */
export function getValidPreventabilityOptions(nccMerp) {
  if (!nccMerp) return PREVENTABILITY_OPTIONS;
  const currentRank = NCC_MERP_RANK[String(nccMerp).toUpperCase()] || 1;
  return PREVENTABILITY_OPTIONS.filter(opt => opt.rank >= currentRank);
}

// Standardized Hospital Medication Error Subtypes matching Chiang Khong Crown Prince Hospital Master
export const ME_SUBTYPES = [
  // --- PRE (Prescribing error) - 19 items ---
  { process: 'PRE', code: 'PRE-01', label: 'PRE-01: สั่งยาจำนวนมากกว่าที่ควรได้รับ' },
  { process: 'PRE', code: 'PRE-02', label: 'PRE-02: สั่งยาจำนวนน้อยกว่าที่ควรได้รับ' },
  { process: 'PRE', code: 'PRE-03', label: 'PRE-03: สั่งยาผิดความแรง' },
  { process: 'PRE', code: 'PRE-04', label: 'PRE-04: สั่งยาผิดชนิด' },
  { process: 'PRE', code: 'PRE-05', label: 'PRE-05: สั่งยาผิดรูปแบบ' },
  { process: 'PRE', code: 'PRE-06', label: 'PRE-06: สั่งยาผิดคน' },
  { process: 'PRE', code: 'PRE-07', label: 'PRE-07: สั่งใช้ยาผิดวิธีใช้ ผิดเวลา' },
  { process: 'PRE', code: 'PRE-08', label: 'PRE-08: สั่งยาผิดขนาดการรักษา (dose)' },
  { process: 'PRE', code: 'PRE-09', label: 'PRE-09: สั่งยาที่ไม่ควรได้รับ' },
  { process: 'PRE', code: 'PRE-10', label: 'PRE-10: สั่งยาไม่ครบ/ไม่ได้ทำ Medication reconcile ยาเดิม' },
  { process: 'PRE', code: 'PRE-11', label: 'PRE-11: สั่งยากลุ่ม/ชนิดเดียวกันซ้ำซ้อน' },
  { process: 'PRE', code: 'PRE-12', label: 'PRE-12: สั่งยาไม่ระบุวิธีใช้' },
  { process: 'PRE', code: 'PRE-13', label: 'PRE-13: สั่งยาที่ผู้ป่วยมีประวัติแพ้อย่างชัดเจน' },
  { process: 'PRE', code: 'PRE-14', label: 'PRE-14: สั่งยาที่เป็นคู่ Fatal Drug interaction' },
  { process: 'PRE', code: 'PRE-15', label: 'PRE-15: สั่งยาที่มีข้อห้ามใช้ในผู้ป่วย(ตับ/ไต/ตั้งครรภ์/ให้นมบุตร)' },
  { process: 'PRE', code: 'PRE-16', label: 'PRE-16: สั่งยาโดยใช้คำย่อที่ไม่เป็นไปตามข้อตกลง' },
  { process: 'PRE', code: 'PRE-17', label: 'PRE-17: สั่งยาเดิมไม่ระบุชื่อยา' },
  { process: 'PRE', code: 'PRE-18', label: 'PRE-18: สั่งยาที่มีข้อห้ามใช้ในผู้ป่วย (ตับ/ไต/ตั้งครรภ์/ให้นมบุตร)' },
  { process: 'PRE', code: 'PRE-19', label: 'PRE-19: สั่งยาไม่ตรงกับข้อมูลใน EMR/Progress note' },

  // --- TRA (Transcription error) - 16 items ---
  { process: 'TRA', code: 'TRA-01', label: 'TRA-01: คัดลอกไม่ครบ/ไม่ได้คัดลอก' },
  { process: 'TRA', code: 'TRA-02', label: 'TRA-02: คัดลอกผิดวิธีใช้ ผิดเวลา' },
  { process: 'TRA', code: 'TRA-03', label: 'TRA-03: คัดลอก ผิดจำนวนมากกว่าที่ควรได้รับ' },
  { process: 'TRA', code: 'TRA-04', label: 'TRA-04: คัดลอก ผิดจำนวนน้อยกว่าที่ควรได้รับ' },
  { process: 'TRA', code: 'TRA-05', label: 'TRA-05: คัดลอกยาที่ไม่ควรได้รับ' },
  { process: 'TRA', code: 'TRA-06', label: 'TRA-06: คัดลอกไม่ตรงกับขนาดที่แพทย์สั่ง' },
  { process: 'TRA', code: 'TRA-07', label: 'TRA-07: คัดลอกยาผิดขนาดการรักษา (dose)' },
  { process: 'TRA', code: 'TRA-08', label: 'TRA-08: คัดลอกผิดความแรง' },
  { process: 'TRA', code: 'TRA-09', label: 'TRA-09: คัดลอกผิดชนิด' },
  { process: 'TRA', code: 'TRA-10', label: 'TRA-10: คัดลอกยากลุ่ม/ชนิดเดียวกันซ้ำซ้อน' },
  { process: 'TRA', code: 'TRA-11', label: 'TRA-11: คัดลอกผิดคน' },
  { process: 'TRA', code: 'TRA-12', label: 'TRA-12: คัดลอกผิดรูปแบบ' },
  { process: 'TRA', code: 'TRA-13', label: 'TRA-13: คัดลอกยาที่เป็นคู่ Fatal Drug interaction' },
  { process: 'TRA', code: 'TRA-14', label: 'TRA-14: คัดลอกยาที่ผู้ป่วยมีประวัติแพ้อย่างชัดเจน' },
  { process: 'TRA', code: 'TRA-15', label: 'TRA-15: คัดลอกยาไม่ระบุวิธีใช้ ความถี่' },
  { process: 'TRA', code: 'TRA-16', label: 'TRA-16: คัดลอกยาที่มีีข้อห้ามใช้ในผู้ป่วย (ตับ/ไต/ตั้งครรภ์/ให้นมบุตร)' },

  // --- PDI (Pre-dispensing error) - 39 items ---
  { process: 'PDI', code: 'PDI-01', label: 'PDI-01: IPD ตรวจสอบฉลากยา ผิดวิธีใช้ ผิดเวลา' },
  { process: 'PDI', code: 'PDI-02', label: 'PDI-02: IPD ตรวจสอบฉลากผิด จำนวนมากกว่าที่ควรได้รับ' },
  { process: 'PDI', code: 'PDI-03', label: 'PDI-03: IPD ตรวจสอบฉลากผิด จำนวนน้อยกว่าที่ควรได้รับ' },
  { process: 'PDI', code: 'PDI-04', label: 'PDI-04: IPD ตรวจสอบฉลากยา ผิดขนาด' },
  { process: 'PDI', code: 'PDI-05', label: 'PDI-05: IPD ตรวจสอบฉลากยา ผิดชนิด' },
  { process: 'PDI', code: 'PDI-06', label: 'PDI-06: IPD ตรวจสอบฉลากยา ผิดความแรง' },
  { process: 'PDI', code: 'PDI-07', label: 'PDI-07: IPD ตรวจสอบฉลากยา ผิดรูปแบบ' },
  { process: 'PDI', code: 'PDI-08', label: 'PDI-08: IPD ตรวจสอบฉลากยา ผิดคน' },
  { process: 'PDI', code: 'PDI-09', label: 'PDI-09: IPD ตรวจสอบฉลากยา ไม่ครบรายการ' },
  { process: 'PDI', code: 'PDI-10', label: 'PDI-10: IPD ตรวจสอบฉลาก ยากลุ่ม/ชนิดเดียวกันซ้ำซ้อน' },
  { process: 'PDI', code: 'PDI-11', label: 'PDI-11: IPD ตรวจสอบฉลากแล้ว ยังส่งจัดยาที่สั่ง Off แล้ว /แพทย์ไม่มีคำสั่ง' },
  { process: 'PDI', code: 'PDI-12', label: 'PDI-12: IPD ไม่ระบุวันที่หยุดยาใน Medication profile' },
  { process: 'PDI', code: 'PDI-13', label: 'PDI-13: จัดยาจำนวนน้อยกว่าที่ควรได้รับ' },
  { process: 'PDI', code: 'PDI-14', label: 'PDI-14: จัดยาจำนวนมากกว่าที่ควรได้รับ' },
  { process: 'PDI', code: 'PDI-15', label: 'PDI-15: จัดยาผิดชนิด' },
  { process: 'PDI', code: 'PDI-16', label: 'PDI-16: จัดยาผิดความแรง' },
  { process: 'PDI', code: 'PDI-17', label: 'PDI-17: จัดยาผิดรูปแบบ' },
  { process: 'PDI', code: 'PDI-18', label: 'PDI-18: จัดยาผิดคน' },
  { process: 'PDI', code: 'PDI-19', label: 'PDI-19: จัดยาหลายยี่ห้อในซองเดียวกัน' },
  { process: 'PDI', code: 'PDI-20', label: 'PDI-20: จัดยาไม่ครบรายการ/ไม่ได้จัดยา' },
  { process: 'PDI', code: 'PDI-21', label: 'PDI-21: จัดยาที่ฉลากระบุว่าไม่จัด' },
  { process: 'PDI', code: 'PDI-22', label: 'PDI-22: จัดยากลุ่ม/ชนิดเดียวกันซ้ำซ้อน' },
  { process: 'PDI', code: 'PDI-23', label: 'PDI-23: จัดยาที่เป็นคู่ Fatal Drug interaction' },
  { process: 'PDI', code: 'PDI-24', label: 'PDI-24: จัดยาที่ผู้ป่วยมีประวัติแพ้อย่างชัดเจน' },
  { process: 'PDI', code: 'PDI-25', label: 'PDI-25: OPD ตรวจสอบยา ผิดจำนวนมากกว่าที่ควรได้รับ' },
  { process: 'PDI', code: 'PDI-26', label: 'PDI-26: OPD ตรวจสอบยา ผิดจำนวนน้อยกว่าที่ควรได้รับ' },
  { process: 'PDI', code: 'PDI-27', label: 'PDI-27: OPD ตรวจสอบยา ผิดความแรง' },
  { process: 'PDI', code: 'PDI-28', label: 'PDI-28: OPD ตรวจสอบยา ผิดชนิด' },
  { process: 'PDI', code: 'PDI-29', label: 'PDI-29: OPD ตรวจสอบยา ผิดรูปแบบ' },
  { process: 'PDI', code: 'PDI-30', label: 'PDI-30: OPD ตรวจสอบยา ผิดคน' },
  { process: 'PDI', code: 'PDI-31', label: 'PDI-31: OPD ตรวจสอบยา ผิดวิธีใช้ ผิดเวลา' },
  { process: 'PDI', code: 'PDI-32', label: 'PDI-32: OPD ตรวจสอบยาผิดขนาดการรักษา (dose)' },
  { process: 'PDI', code: 'PDI-33', label: 'PDI-33: OPD ตรวจสอบยาที่ไม่ควรได้รับ' },
  { process: 'PDI', code: 'PDI-34', label: 'PDI-34: OPD ตรวจสอบยาไม่ครบ/ไม่ได้ทำ Medication reconcile ยาเดิม' },
  { process: 'PDI', code: 'PDI-35', label: 'PDI-35: OPD ตรวจสอบยา กลุ่ม/ชนิดเดียวกันซ้ำซ้อน' },
  { process: 'PDI', code: 'PDI-36', label: 'PDI-36: OPD ตรวจสอบยา ไม่ระบุวิธีใช้' },
  { process: 'PDI', code: 'PDI-37', label: 'PDI-37: OPD ตรวจสอบยา ที่ผู้ป่วยมีประวัติแพ้อย่างชัดเจน' },
  { process: 'PDI', code: 'PDI-38', label: 'PDI-38: OPD ตรวจสอบยา ที่เป็นคู่ Fatal Drug interaction' },
  { process: 'PDI', code: 'PDI-39', label: 'PDI-39: OPD ตรวจสอบยาที่มีข้อห้ามใช้ในผู้ป่วย(ตับ/ไต/ตั้งครรภ์/ให้นมบุตร)' },

  // --- DIS (Dispensing error) - 16 items ---
  { process: 'DIS', code: 'DIS-01', label: 'DIS-01: จ่ายยา ผิดจำนวนมากกว่าที่ควรได้รับ' },
  { process: 'DIS', code: 'DIS-02', label: 'DIS-02: จ่ายยา ผิดจำนวนน้อยกว่าที่ควรได้รับ' },
  { process: 'DIS', code: 'DIS-03', label: 'DIS-03: จ่ายยา ผิดความแรง' },
  { process: 'DIS', code: 'DIS-04', label: 'DIS-04: จ่ายยา ผิดชนิด' },
  { process: 'DIS', code: 'DIS-05', label: 'DIS-05: จ่ายยา ผิดรูปแบบ' },
  { process: 'DIS', code: 'DIS-06', label: 'DIS-06: จ่ายยา ผิดคน' },
  { process: 'DIS', code: 'DIS-07', label: 'DIS-07: จ่ายยา ผิดวิธีใช้ ผิดเวลา' },
  { process: 'DIS', code: 'DIS-08', label: 'DIS-08: จ่ายยา ผิดขนาดการรักษา (dose)' },
  { process: 'DIS', code: 'DIS-09', label: 'DIS-09: จ่ายยาที่ไม่ควรได้รับ/ยาที่สั่งOff' },
  { process: 'DIS', code: 'DIS-10', label: 'DIS-10: จ่ายยาไม่ครบ/ไม่จ่ายยาที่ควรได้รับ' },
  { process: 'DIS', code: 'DIS-11', label: 'DIS-11: จ่ายยากลุ่ม/ชนิดเดียวกันซ้ำซ้อน' },
  { process: 'DIS', code: 'DIS-12', label: 'DIS-12: จ่ายยาที่ฉลากยาไม่สมบูรณ์' },
  { process: 'DIS', code: 'DIS-13', label: 'DIS-13: จ่ายยาที่ผู้ป่วยมีประวัติแพ้อย่างชัดเจน' },
  { process: 'DIS', code: 'DIS-14', label: 'DIS-14: จ่ายยาที่เป็นคู่ Fatal Drug interaction' },
  { process: 'DIS', code: 'DIS-15', label: 'DIS-15: จ่ายยาที่มีข้อห้ามใช้ในผู้ป่วย(ตับ/ไต/ตั้งครรภ์/ให้นมบุตร)' },
  { process: 'DIS', code: 'DIS-16', label: 'DIS-16: จ่ายยาโดยไม่ได้ตรวจสอบ Medication reconcile' },

  // --- ADM (Administration error) - 23 items ---
  { process: 'ADM', code: 'ADM-01', label: 'ADM-01: ไม่ลงชื่อ/เวลาบริหารยาผู้ป่วยในระบบ' },
  { process: 'ADM', code: 'ADM-02', label: 'ADM-02: ไม่ได้ให้ยา/ให้ยาจำนวนครั้งน้อยกว่าที่สั่ง' },
  { process: 'ADM', code: 'ADM-03', label: 'ADM-03: ให้ยาจำนวนครั้งมากกว่าที่สั่ง' },
  { process: 'ADM', code: 'ADM-04', label: 'ADM-04: ให้ยาผิดเวลา (คลาดเคลื่อนมากกว่า 1 ชั่วโมง)' },
  { process: 'ADM', code: 'ADM-05', label: 'ADM-05: การบริหารยา stat เกิน 30 นาที (ไม่เป็นไปตามแนวทางปฏิบัติ)' },
  { process: 'ADM', code: 'ADM-06', label: 'ADM-06: ให้ยาที่แพทย์ไม่ได้สั่งแพทย์/สั่งOffแล้ว' },
  { process: 'ADM', code: 'ADM-07', label: 'ADM-07: ให้ยาผิดขนาด' },
  { process: 'ADM', code: 'ADM-08', label: 'ADM-08: ให้ยาผิดความแรง' },
  { process: 'ADM', code: 'ADM-09', label: 'ADM-09: ให้ยาผิดชนิด' },
  { process: 'ADM', code: 'ADM-10', label: 'ADM-10: ให้ยาผิด Route' },
  { process: 'ADM', code: 'ADM-11', label: 'ADM-11: ให้ยากลุ่มเดียวกันซ้ำซ้อน' },
  { process: 'ADM', code: 'ADM-12', label: 'ADM-12: ยาเตรียมผสมที่ไม่ถูกต้อง/ไม่เข้ากัน/ผิดเทคนิค' },
  { process: 'ADM', code: 'ADM-13', label: 'ADM-13: ให้ยา/สารน้ำ rate ช้ากว่าที่กำหนด' },
  { process: 'ADM', code: 'ADM-14', label: 'ADM-14: ให้ยา/สารน้ำ rate เร็วกว่าที่กำหนด' },
  { process: 'ADM', code: 'ADM-15', label: 'ADM-15: ไม่ระบุเวลาให้/หมดของยา สารน้ำ' },
  { process: 'ADM', code: 'ADM-16', label: 'ADM-16: ให้ยาฉีด/สารน้ำ โดยไม่ระบุวิธีใช้ ความแรง ความถี่' },
  { process: 'ADM', code: 'ADM-17', label: 'ADM-17: ไม่ระบุสัดส่วนในการผสมยา' },
  { process: 'ADM', code: 'ADM-18', label: 'ADM-18: ไม่จัดเตรียมยาเพื่อบริหารตามคำสั่งแพทย์' },
  { process: 'ADM', code: 'ADM-19', label: 'ADM-19: สารน้ำ/ยาฉีด ไม่ระบุชื่อผู้ป่วย' },
  { process: 'ADM', code: 'ADM-20', label: 'ADM-20: สารน้ำ/ยาฉีด ระบุชื่อยาผิด' },
  { process: 'ADM', code: 'ADM-21', label: 'ADM-21: ให้ยาโดยอุปกรณ์ไม่เหมาะสม' },
  { process: 'ADM', code: 'ADM-22', label: 'ADM-22: ให้ยาที่มีประวัติแพ้ยาอย่างชัดเจน' },
  { process: 'ADM', code: 'ADM-23', label: 'ADM-23: ให้ยาที่เป็นคู่ Fatal Drug interaction' },

  // --- PRO (Processing error) - 12 items ---
  { process: 'PRO', code: 'PRO-01', label: 'PRO-01: ไม่ปฏิบัติตามระบบนัดหมาย' },
  { process: 'PRO', code: 'PRO-02', label: 'PRO-02: ไม่ปฏิบัติตามระบบส่งต่อผู้ป่วยตามจุดบริการ' },
  { process: 'PRO', code: 'PRO-03', label: 'PRO-03: ไม่ปฏิบัติตามระบบการตรวจสอบข้อมูลก่อน Refer' },
  { process: 'PRO', code: 'PRO-04', label: 'PRO-04: ไม่ปฏิบัติตามระบบสำรองยา Floor stock' },
  { process: 'PRO', code: 'PRO-05', label: 'PRO-05: ไม่ปฏิบัติตามระบบสำรองยา Emergency box' },
  { process: 'PRO', code: 'PRO-06', label: 'PRO-06: ไม่ปฏิบัติตามระบบยาเสพติด' },
  { process: 'PRO', code: 'PRO-07', label: 'PRO-07: ไม่ปฏิบัติตามระบบคืนยา' },
  { process: 'PRO', code: 'PRO-08', label: 'PRO-08: ไม่ปฏิบัติตามระบบป้องกันการแพ้ยาซ้ำ' },
  { process: 'PRO', code: 'PRO-09', label: 'PRO-09: ไม่ปฏิบัติตามระบบ Medication reconcile' },
  { process: 'PRO', code: 'PRO-10', label: 'PRO-10: ไม่ปฏิบัติตามระบบการสั่งยา DUE' },
  { process: 'PRO', code: 'PRO-11', label: 'PRO-11: ไม่ปฏิบัติตามระบบการเบิก/จ่ายยา stat' },
  { process: 'PRO', code: 'PRO-12', label: 'PRO-12: IPD ไม่ระบุวันที่หยุดยา/ยาครบใน Medication profile' },
];

// Common hospital drug list for datalist autocomplete
export const COMMON_DRUGS = [
  'Paracetamol 500 mg tab',
  'Amoxicillin 500 mg cap',
  'Amoxicillin + Clavulanic acid 1 g tab',
  'Augmentin (Amoxicillin/Clavulanate) 1.2 g inj',
  'Ceftriaxone 1 g vial',
  'Cefazolin 1 g vial',
  'Meropenem 1 g vial',
  'Vancomycin 500 mg vial',
  'Gentamicin 80 mg/2 mL amp',
  'Amlodipine 5 mg tab',
  'Amlodipine 10 mg tab',
  'Enalapril 5 mg tab',
  'Losartan 50 mg tab',
  'Atenolol 50 mg tab',
  'Metoprolol tartrate 100 mg tab',
  'Furosemide 40 mg tab',
  'Furosemide 20 mg/2 mL amp',
  'Metformin 500 mg tab',
  'Metformin 850 mg tab',
  'Glipizide 5 mg tab',
  'Insulin Regular (Actrapid) 100 IU/mL vial',
  'Insulin NPH (Insulatard) 100 IU/mL vial',
  'Insulin Mixtard 70/30 100 IU/mL vial',
  'Insulin Glargine (Lantus) 100 IU/mL solostar',
  'Aspirin 81 mg enteric-coated tab',
  'Clopidogrel 75 mg tab',
  'Warfarin sodium 2 mg tab',
  'Warfarin sodium 3 mg tab',
  'Warfarin sodium 5 mg tab',
  'Enoxaparin (Clexane) 40 mg/0.4 mL prefilled syr',
  'Heparin sodium 25,000 IU/5 mL vial',
  'Morphine sulfate 10 mg/1 mL amp',
  'Fentanyl 100 mcg/2 mL amp',
  'Pethidine HCl 50 mg/1 mL amp',
  'Tramadol 50 mg cap',
  'Tramadol 100 mg/2 mL amp',
  'Diazepam 5 mg tab',
  'Diazepam 10 mg/2 mL amp',
  'Midazolam 5 mg/1 mL amp',
  'Potassium Chloride (KCl) 20 mEq/10 mL inj (HAD)',
  '10% Calcium Gluconate 10 mL amp',
  '50% Glucose 50 mL vial',
  'Atropine sulfate 0.6 mg/1 mL amp',
  'Adrenaline (Epinephrine) 1 mg/1 mL amp',
  'Norepinephrine 4 mg/4 mL amp',
  'Dopamine HCl 250 mg/10 mL amp',
  'Omeprazole 20 mg cap',
  'Omeprazole 40 mg vial for inj',
  'Pantoprazole 40 mg vial for inj',
  'Dimenhydrinate 50 mg tab',
  'Dimenhydrinate 50 mg/1 mL amp',
  'Ondansetron 8 mg/4 mL amp',
  'Metoclopramide 10 mg tab',
  'Salbutamol 2 mg tab',
  'Berodual respules (Fenoterol/Ipratropium)',
];

// Hospital departments matching Chiang Khong Crown Prince Hospital Master
export const DEPARTMENTS = [
  { id: 'dept-pharma', code: 'PHAR', name: 'กลุ่มงานเภสัชกรรม' },
  { id: 'dept-ipd-male', code: 'IPD-M', name: 'งานพยาบาลผู้ป่วยในชาย' },
  { id: 'dept-ipd-female', code: 'IPD-F', name: 'งานพยาบาลผู้ป่วยในหญิง' },
  { id: 'dept-psych', code: 'PSY', name: 'กลุ่มงานจิตเวชและยาเสพติด' },
  { id: 'dept-med', code: 'MED', name: 'องค์กรแพทย์' },
  { id: 'dept-opd', code: 'OPD', name: 'งานการพยาบาลผู้ป่วยนอก' },
  { id: 'dept-er', code: 'ER', name: 'งานการพยาบาลอุบัติเหตุฉุกเฉินและนิติเวช' },
  { id: 'dept-lr', code: 'LR', name: 'ผู้คลอด' },
  { id: 'dept-or', code: 'OR', name: 'ห้องผ่าตัด' },
  { id: 'dept-pcdc', code: 'PCDC', name: 'งานควบคุมและป้องกันโรค' },
  { id: 'dept-community', code: 'COM', name: 'งานรักษาพยาบาลในชุมชน' }
];

// Hospital Staff Users matching Chiang Khong Crown Prince Hospital Master
export const MOCK_USERS = [
  // --- กลุ่มงานเภสัชกรรม (23 ท่าน) ---
  { id: 'usr-ph-01', display_name: 'สมพงษ์ วุฒิอดิเรก', role: 'admin', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-02', display_name: 'อิ่นแก้ว สิงห์แก้ว', role: 'reviewer', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-03', display_name: 'ธวัชชาติ เก้าเอี้ยน', role: 'reviewer', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-04', display_name: 'ธิดารัตน์ วุฒิอดิเรก', role: 'reviewer', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-05', display_name: 'ทศพร เตชะอัตตกุล', role: 'reviewer', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-06', display_name: 'กฤติกา สุภารินทร์', role: 'admin', department_id: 'dept-pharma', is_specialist: false, password: '654321' },
  { id: 'usr-ph-07', display_name: 'อนุภาพ ภูหลัก', role: 'admin', department_id: 'dept-pharma', is_specialist: false, password: '654321' },
  { id: 'usr-ph-08', display_name: 'อาภากร สุภาศรี', role: 'reviewer', department_id: 'dept-pharma', is_specialist: false, password: '123456' },
  { id: 'usr-ph-09', display_name: 'อานันท์ สิงห์สถิตย์', role: 'reviewer', department_id: 'dept-pharma', is_specialist: false, password: '123456' },
  { id: 'usr-ph-10', display_name: 'ณพรรณอร กิตติกรณ์รัตน์', role: 'reporter', department_id: 'dept-pharma', is_specialist: false, password: '123456' },
  { id: 'usr-ph-11', display_name: 'เมธาวี เจริญทรัพย์', role: 'reporter', department_id: 'dept-pharma', is_specialist: false, password: '123456' },
  { id: 'usr-ph-12', display_name: 'เมธาพร ศรีเสน', role: 'reporter', department_id: 'dept-pharma', is_specialist: false, password: '123456' },
  { id: 'usr-ph-13', display_name: 'นพมาศ ยอดวงค์', role: 'reporter', department_id: 'dept-pharma', is_specialist: false, password: '123456' },
  { id: 'usr-ph-14', display_name: 'ธัญยพร เจริญผล', role: 'admin', department_id: 'dept-pharma', is_specialist: false, password: '654321' },
  { id: 'usr-ph-15', display_name: 'ศุภณัฐ ชัยธิ', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-16', display_name: 'ประกายดาว กันนิกา', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-17', display_name: 'สมคิด สุวรรณทา', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-18', display_name: 'ธนาวัฒน์ คัชมาตย์', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-19', display_name: 'ศุภสิทธิ์ ศิริวงค์', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-20', display_name: 'กิตติรัตน์ วงค์ชัย', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-21', display_name: 'ณัฐนันท์ ปัญญาเหมือง', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-22', display_name: 'มณีฉาย ก้อนดง', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },
  { id: 'usr-ph-23', display_name: 'นักศึกษาเภสัช', role: 'reporter', department_id: 'dept-pharma', position: 'เภสัชกร', is_specialist: false },

  // --- งานพยาบาลผู้ป่วยในชาย (19 ท่าน) ---
  { id: 'usr-ipdm-01', display_name: 'สง่าศรี เนาวฤทธิ์', role: 'dept_head', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-02', display_name: 'วารุณี โนวิชัย', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-03', display_name: 'บัณฑิตา วงค์งาม', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-04', display_name: 'จันทกานต์ พรมภิภักดิ์', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-05', display_name: 'กุลณัฐ ไชยสี', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-06', display_name: 'อลิชา ชัยพนัส', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-07', display_name: 'ธนวัฒน์ ปัญญาไว', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-08', display_name: 'หัสนัย ทุ่งเก้า', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-09', display_name: 'กมนมณี วงค์ชัย', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-10', display_name: 'เสาวลักษณ์ พินชัย', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-11', display_name: 'นันทิชา เก่งการทำ', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-12', display_name: 'สุนิษา กาเปี้ย', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-13', display_name: 'นริศรา ช่างหมึก', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-14', display_name: 'พลอยชมพู ศรีไสยเพชร', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-15', display_name: 'นันทนา สมจิตต์', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-16', display_name: 'จุฑามาศ ชนะพจน์', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-17', display_name: 'ณัฐชา หะสิตะ', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-18', display_name: 'ปณิดา ไชยสิทธิ์', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdm-19', display_name: 'ธัญลักษณ์ บุญระวงค์', role: 'reporter', department_id: 'dept-ipd-male', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- งานพยาบาลผู้ป่วยในหญิง (20 ท่าน) ---
  { id: 'usr-ipdf-01', display_name: 'ศิริรัตน์ โหตรภวานนท์', role: 'dept_head', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-02', display_name: 'จินตนา แสงเพชร์', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-03', display_name: 'กมลวรรณ เกื้อทาน', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-04', display_name: 'ศุภกานต์ ยาวิเริง', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-05', display_name: 'รัตติกาล วงค์ชัย', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-06', display_name: 'เกตุศิรินทร์ อินต๊ะวงศ์', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-07', display_name: 'นภัสวรรณ ยามเลย', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-08', display_name: 'อภิณีย์ วงค์ชัย', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-09', display_name: 'วัลนิภา ชัยวงค์', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-10', display_name: 'กัญญารัตน์ นาราษฏร์', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-11', display_name: 'จิตรสินี วงศ์ชัย', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-12', display_name: 'สุณิสา ธิวงศ์', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-13', display_name: 'ศุภาพิชญ์ ยวงจา', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-14', display_name: 'เตือนใจ กันทา', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-15', display_name: 'วิมลณัฐ มั่นคง', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-16', display_name: 'โชติกา ธนอัศวนนท์', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-17', display_name: 'ตวิษา จันทฤทธิ์', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-18', display_name: 'พิมพ์พิชชา บุตรดี', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-19', display_name: 'ปภาวรินทร์ เจริญสุข', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-ipdf-20', display_name: 'ขวัญฤทัย มินทะขัติ', role: 'reporter', department_id: 'dept-ipd-female', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- กลุ่มงานจิตเวชและยาเสพติด (5 ท่าน) ---
  { id: 'usr-psy-01', display_name: 'พัชราวรรณ ปัญญาวงศ์', role: 'dept_head', department_id: 'dept-psych', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-psy-02', display_name: 'ศตวรรษ ขันต๊ะ', role: 'reporter', department_id: 'dept-psych', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-psy-03', display_name: 'รมย์มณี พลสาร', role: 'reporter', department_id: 'dept-psych', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-psy-04', display_name: 'วธูสิริ ตาซิว', role: 'reporter', department_id: 'dept-psych', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-psy-05', display_name: 'ลัดดาวรรณ เขื่อนศิริ', role: 'reporter', department_id: 'dept-psych', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- องค์กรแพทย์ (20 ท่าน, แพทย์ทั้งหมดมีตำแหน่ง นายแพทย์ โดยมี 9 ท่านเป็น Specialist Staff) ---
  { id: 'usr-doc-01', display_name: 'นพปฎล พรรณราย', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-02', display_name: 'ธงชัย ผลดี', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-03', display_name: 'อัชฌา จิตตรง', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-04', display_name: 'สิโรดม มาดาวิศิษฎ์', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-05', display_name: 'วีระพงศ์ ดวงมณี', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-06', display_name: 'สิรดนัย วัฒนวงษ์คีรี', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-07', display_name: 'ธีรพล ทนงกิจ', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-08', display_name: 'ณฐพล มณีรัตน์', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-09', display_name: 'อภิชญา วิรุฬห์ศรี', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-10', display_name: 'จิรสุตา คำภีระ', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-11', display_name: 'ศุภณัฐ สวรรค์พรม', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-12', display_name: 'เบญญากร ใจหงษ์', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-13', display_name: 'วราดา เครือประดิษฐ์', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-14', display_name: 'วรัญญา จินา', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-15', display_name: 'พัชราภรณ์ มีทรัพย์', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-16', display_name: 'วสันต์ชัย ใจกลม', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-17', display_name: 'ภวิศร์ชนม์ รุ่งรัชตเวช', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-18', display_name: 'ชญานุช ประเสริฐธิติพงษ์', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: true },
  { id: 'usr-doc-19', display_name: 'ชัชรีย์ เต็งเจริญพงศ์ธร', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },
  { id: 'usr-doc-20', display_name: 'Intern 1', role: 'reporter', department_id: 'dept-med', position: 'นายแพทย์', is_specialist: false },

  // --- งานการพยาบาลผู้ป่วยนอก (22 ท่าน) ---
  { id: 'usr-opd-01', display_name: 'วิไลวรรณ มาคำ', role: 'dept_head', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-02', display_name: 'พัชรินทร์ สิทธิกรรณ์', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-03', display_name: 'อมรรัตน์ ปวงมะณี', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-04', display_name: 'จิตรทิวา เทพวงศ์', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-05', display_name: 'ทาริกา อำมาตย์มณี', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-06', display_name: 'นันทนัช มาดาวิศิษฎ์', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-07', display_name: 'บัวลอย ภูหลัก', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-08', display_name: 'นิภา อนุลม', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-09', display_name: 'วีรวรรณ เทพบินการ', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-10', display_name: 'รพีพร โนจิตร', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-11', display_name: 'พรทิพย์ พาสคอลล์', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-12', display_name: 'ปฐวี สุขกาย', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-13', display_name: 'รจนา ทาเหล็ก', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-14', display_name: 'มะลิวัลย์ ก๋าแก้ว', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-15', display_name: 'นงนุช พรมเมือง', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-16', display_name: 'อุษณีย์ ประเสริฐ', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-17', display_name: 'อัญชณา ชูยัง', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-18', display_name: 'ธัญญลักษณ์ ริจนา', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-19', display_name: 'อภิญญา จันต๊ะคาด', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-20', display_name: 'สุภัคพร นวลใส', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-21', display_name: 'อนันตญา ก๋าทองทุ่ง', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-opd-22', display_name: 'มานิตย์ เขื่อนล้อม', role: 'reporter', department_id: 'dept-opd', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- งานการพยาบาลอุบัติเหตุฉุกเฉินและนิติเวช (23 ท่าน) ---
  { id: 'usr-er-01', display_name: 'มยุรี พิทักษ์ปรีดากุล', role: 'dept_head', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-02', display_name: 'ฤทธิรงค์ บุญตันตา', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-03', display_name: 'บุษบา เดชะ', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-04', display_name: 'ดวงสมร ธิชาญ', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-05', display_name: 'นันทิชา ไชยยะ', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-06', display_name: 'ศศิธร จินะราช', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-07', display_name: 'สุมินตรา อานุ', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-08', display_name: 'ปลายฝน หลวงมณี', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-09', display_name: 'สุรทิน จินะราช', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-10', display_name: 'สมชาติ ไชยลังการ', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-11', display_name: 'เสาวลักษ์ แสงงาม', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-12', display_name: 'นรรัตน์ จันต๊ะวงค์', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-13', display_name: 'พิศมัย จินะการ', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-14', display_name: 'วรรณวิภา แก้วระกา', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-15', display_name: 'มาริสา สุวรรณทา', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-16', display_name: 'ชญานี ตั้งการ', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-17', display_name: 'ชนณิกานต์ มหาชัย', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-18', display_name: 'อรุโณทัย จันทิมา', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-19', display_name: 'กาญจณมาศ กณะบุตร', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-20', display_name: 'พงศกร หมื่นแก้ว', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-21', display_name: 'สายฤดี เดชดอน', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-22', display_name: 'ยลธิดา แสงเพชร์', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-er-23', display_name: 'อภิสมัย วงค์ชัย', role: 'reporter', department_id: 'dept-er', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- ผู้คลอด (12 ท่าน) ---
  { id: 'usr-lr-01', display_name: 'สุรารักษ์ เนียมปุก', role: 'dept_head', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-02', display_name: 'เพ็ญจันทร์ ชัยชนะ', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-03', display_name: 'รัตติกาล รัตนประยูร', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-04', display_name: 'จุฑามาศ สมฤทธิ์', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-05', display_name: 'วราภรณ์ วิลังคะ', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-06', display_name: 'ขวัญฤดี พูลสมบัติ', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-07', display_name: 'ศรัญญา อานุ', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-08', display_name: 'ธัญลักษณ์ ภิญญา', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-09', display_name: 'พิมพ์พรรณ สำนวนเย็น', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-10', display_name: 'สุภาพร มรคานันท์', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-11', display_name: 'แววดาว สุวรรณทา', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-lr-12', display_name: 'วันทนา จันทะพรม', role: 'reporter', department_id: 'dept-lr', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- ห้องผ่าตัด (13 ท่าน) ---
  { id: 'usr-or-01', display_name: 'ยุทธการ หาญกา', role: 'dept_head', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-02', display_name: 'ภัคพร หน่อใส', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-03', display_name: 'ทัศนีย์ กำเนิด', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-04', display_name: 'เยาวเรศ สถานเดิม', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-05', display_name: 'สุชญา เพชรพรรณ', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-06', display_name: 'สินีภัค สมทะนะ', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-07', display_name: 'นาญิกา จำปาคำ', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-08', display_name: 'ภัณฑิรา บุตรดี', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-09', display_name: 'รัตน์ชดาพร แสงงาม', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-10', display_name: 'ณัฐวุฒิ มีอาหาร', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-11', display_name: 'พรภิมล ทะพรม', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-12', display_name: 'ณัฐกุณ ไชยลิ้นฟ้า', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-or-13', display_name: 'สุภาภรณ์ วราเลิศพนา', role: 'reporter', department_id: 'dept-or', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- งานควบคุมและป้องกันโรค (9 ท่าน) ---
  { id: 'usr-pcdc-01', display_name: 'นิภา จักรสมศักดิ์', role: 'dept_head', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-02', display_name: 'ยุพา อรัญชัย', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-03', display_name: 'สถาพร มังคลาด', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-04', display_name: 'ประสงค์ หมื่นจันทร์', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-05', display_name: 'น้ำทิพย์ ชัยยะ', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-06', display_name: 'อดิภา เลิศทอง', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-07', display_name: 'พรณิกา สุวรรณทา', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-08', display_name: 'ปราโมทย์ ขำอินทร์', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-pcdc-09', display_name: 'พนัส หลานวงษ์', role: 'reporter', department_id: 'dept-pcdc', position: 'พยาบาลวิชาชีพ', is_specialist: false },

  // --- งานรักษาพยาบาลในชุมชน (5 ท่าน) ---
  { id: 'usr-com-01', display_name: 'ชินกร มาคำ', role: 'dept_head', department_id: 'dept-community', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-com-02', display_name: 'รัชชานนท์ อะโนมา', role: 'reporter', department_id: 'dept-community', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-com-03', display_name: 'สุทธิพร แก้วก๋า', role: 'reporter', department_id: 'dept-community', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-com-04', display_name: 'ศักดิ์ชัย แสนวงค์คำ', role: 'reporter', department_id: 'dept-community', position: 'พยาบาลวิชาชีพ', is_specialist: false },
  { id: 'usr-com-05', display_name: 'วรรณิกา ชุ่มวงศ์', role: 'reporter', department_id: 'dept-community', position: 'พยาบาลวิชาชีพ', is_specialist: false }
];

/**
 * Strips PII (Patient Name, address, phone) from HOSxP raw row client-side.
 * Strictly removes patient identifiable information (ชื่อผู้ป่วย) to ensure PDPA compliance.
 */
export function stripPiiClientSide(row) {
  if (!row || typeof row !== 'object') return {};
  const clean = { ...row };
  const piiKeys = [
    'patientname', 'patient_name', 'ptname', 'pname', 'fname', 'lname', 'fullname',
    'cid', 'idcard', 'citizenid', 'citizen_id', 'phone', 'tel', 'telephone', 'mobile',
    'address', 'addrpart', 'moopart', 'id_card',
    // Thai PII keys
    'ชื่อผู้ป่วย', 'ผู้ป่วย', 'ชื่อสกุล', 'ชื่อ-สกุล', 'ชื่อ', 'นามสกุล',
    'เลขบัตรประชาชน', 'บัตรประชาชน', 'เบอร์โทร', 'เบอร์โทรศัพท์', 'ที่อยู่'
  ];

  for (const k of Object.keys(clean)) {
    const rawKey = k.trim().toLowerCase();
    const normalized = rawKey.replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
    const isPii = piiKeys.some(pii => {
      const pNorm = pii.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
      return normalized === pNorm || normalized.includes('ชื่อผู้ป่วย') || normalized.includes('patientname') || normalized.includes('patient_name');
    });
    if (isPii) {
      delete clean[k];
    }
  }
  return clean;
}

/**
 * Generates deduplication hash from datetime + hn + drug + step.
 * In browser: uses crypto.subtle or fallback.
 * In Node: can use crypto module or fallback.
 */
export async function generateDeduplicationHash(datetime, hn, drug, step) {
  const normDt = String(datetime || '').trim().toLowerCase();
  const normHn = String(hn || '').trim().toLowerCase();
  const normDrug = String(drug || '').trim().toLowerCase();
  const normStep = String(step || '').trim().toLowerCase();
  const rawString = `${normDt}|${normHn}|${normDrug}|${normStep}`;

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple 64-char deterministic hash
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < rawString.length; i++) {
    const ch = rawString.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (p1 + p2 + p1 + p2 + p1 + p2 + p1 + p2).slice(0, 64);
}

/**
 * Synchronous hash generator for environments where async cannot be used
 */
export function generateDeduplicationHashSync(datetime, hn, drug, step) {
  const normDt = String(datetime || '').trim().toLowerCase();
  const normHn = String(hn || '').trim().toLowerCase();
  const normDrug = String(drug || '').trim().toLowerCase();
  const normStep = String(step || '').trim().toLowerCase();
  const rawString = `${normDt}|${normHn}|${normDrug}|${normStep}`;

  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  let h3 = 0x85ebca6b;
  let h4 = 0xc2b2ae35;
  for (let i = 0; i < rawString.length; i++) {
    const ch = rawString.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }
  const s1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const s2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const s3 = (h3 >>> 0).toString(16).padStart(8, '0');
  const s4 = (h4 >>> 0).toString(16).padStart(8, '0');
  return (s1 + s2 + s3 + s4 + s1 + s2 + s3 + s4).slice(0, 64);
}

/**
 * Validates a medication error report against all 20 numbered form fields.
 * If isPatch is true, only validates fields that are present in payload.
 */
export function validateReport(data, isPatch = false) {
  const errors = {};
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _global: 'Invalid report payload' } };
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to check if field is under evaluation
  const shouldCheck = (field) => {
    if (!isPatch) return true;
    return Object.prototype.hasOwnProperty.call(data, field);
  };

  // 1. patient_type: Select ('OPD', 'IPD', 'TELEMED') [Required]
  if (shouldCheck('patient_type')) {
    if (!data.patient_type) {
      errors.patient_type = 'Patient Type is required (OPD, IPD, or TELEMED).';
    } else if (!['OPD', 'IPD', 'TELEMED'].includes(data.patient_type)) {
      errors.patient_type = 'Patient Type must be OPD, IPD, or TELEMED.';
    }
  }

  // 2. hn: Text (Max 20 chars)
  if (shouldCheck('hn') && data.hn) {
    if (String(data.hn).length > 20) {
      errors.hn = 'HN must not exceed 20 characters.';
    }
  }

  // 3. incident_date: Date (YYYY-MM-DD, cannot be in future or after reported_date) [Required]
  if (shouldCheck('incident_date')) {
    if (!data.incident_date) {
      errors.incident_date = 'Incident Date is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.incident_date)) {
      errors.incident_date = 'Incident Date must be in YYYY-MM-DD format.';
    } else if (data.incident_date > todayStr) {
      errors.incident_date = 'Incident Date cannot be in the future.';
    }
  }

  // 15. reported_date: Date (YYYY-MM-DD, defaults to today, cannot be in future) [Required]
  if (shouldCheck('reported_date')) {
    if (!data.reported_date) {
      errors.reported_date = 'Reported Date is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.reported_date)) {
      errors.reported_date = 'Reported Date must be in YYYY-MM-DD format.';
    } else if (data.reported_date > todayStr) {
      errors.reported_date = 'Reported Date cannot be in the future.';
    }
  }

  // Cross-date check: incident_date cannot be after reported_date
  if (data.incident_date && data.reported_date) {
    if (data.incident_date > data.reported_date) {
      errors.incident_date = 'Incident Date cannot be after Reported Date.';
    }
  }

  // 6. problem_description: Textarea (Optional per user brief)
  if (shouldCheck('problem_description') && data.problem_description) {
    if (String(data.problem_description).length > 5000) {
      errors.problem_description = 'Problem Description is too long.';
    }
  }

  // 8. ncc_merp: Select (Severity A-I) [Required]
  if (shouldCheck('ncc_merp')) {
    if (!data.ncc_merp) {
      errors.ncc_merp = 'NCC MERP severity category is required.';
    } else if (!['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].includes(String(data.ncc_merp).toUpperCase())) {
      errors.ncc_merp = 'NCC MERP must be one of categories A through I.';
    }
  }

  // 9. preventability: Select (C through I, >= ncc_merp)
  if (shouldCheck('preventability') && data.preventability) {
    const prev = String(data.preventability).toUpperCase();
    if (!['C', 'D', 'E', 'F', 'G', 'H', 'I'].includes(prev)) {
      errors.preventability = 'Preventability options are strictly restricted to C through I.';
    } else if (data.ncc_merp) {
      const nccRank = NCC_MERP_RANK[String(data.ncc_merp).toUpperCase()] || 1;
      const prevRank = NCC_MERP_RANK[prev] || 1;
      if (prevRank < nccRank) {
        errors.preventability = `Preventability (${prev}) must be greater than or equal to actual NCC MERP severity (${data.ncc_merp}).`;
      }
    }
  }

  // 10. origin_department_id: Department Select [Required]
  if (shouldCheck('origin_department_id')) {
    if (!data.origin_department_id) {
      errors.origin_department_id = 'Origin Department is required.';
    }
  }

  // 13. detection_department_id: Department Select [Required]
  if (shouldCheck('detection_department_id')) {
    if (!data.detection_department_id) {
      errors.detection_department_id = 'Detection Department is required.';
    }
  }

  // 17. process: Select (PRE, TRA, PDI, DIS, ADM, PRO) [Required]
  if (shouldCheck('process')) {
    if (!data.process) {
      errors.process = 'Process (ME Type) is required.';
    } else if (!['PRE', 'TRA', 'PDI', 'DIS', 'ADM', 'PRO'].includes(String(data.process).toUpperCase())) {
      errors.process = 'Process must be one of PRE, TRA, PDI, DIS, ADM, PRO.';
    }
  }

  // 18. me_subtype: Select (dynamically filtered by process) [Required]
  if (shouldCheck('me_subtype')) {
    if (!data.me_subtype) {
      errors.me_subtype = 'Medication Error Subtype is required.';
    } else if (data.process) {
      const matched = ME_SUBTYPES.find(item => item.code === data.me_subtype);
      if (matched && matched.process !== data.process) {
        errors.me_subtype = `ME Subtype (${data.me_subtype}) does not belong to process (${data.process}).`;
      }
    }
  }

  // 16. incident_time: Time (HH:MM format if provided)
  if (shouldCheck('incident_time') && data.incident_time) {
    if (!/^\d{2}:\d{2}$/.test(data.incident_time)) {
      errors.incident_time = 'Incident Time must be in HH:MM format.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
