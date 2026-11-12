/**
 * Medication Error Reporting System (v0.4 Simple Edition)
 * HOSxP Smart Import & Two-Stage Review Logic
 */

import {
  computeRmGrade,
  generateDeduplicationHashSync,
  ME_SUBTYPES,
  stripPiiClientSide,
  validateReport
} from '../shared/form.js';

/**
 * Maps raw HOSxP row data into proposed 20 numbered form fields.
 */
/**
 * Maps raw HOSxP row data into proposed 20 numbered form fields.
 * Fully supports exact Thai export columns from hospital HOSxP:
 * - 'วันที่/เวลา' -> incident_date (YYYY-MM-DD) & incident_time (HH:MM)
 * - 'HN' -> hn
 * - 'ชื่อผู้ป่วย' -> STRIPPED client-side (Do not import)
 * - 'ผู้สั่งยา' -> error_staff_reference (Prescribing staff)
 * - 'แผนก' -> patient_type (OPD / IPD)
 * - 'ชื่อยา' -> intended_drug
 * - 'ขั้นตอนของความคลาดเคลื่อน' -> process (PRE, TRA, PDI, DIS, ADM, PRO)
 * - 'ชนิดความคลาดเคลื่อน' -> me_subtype (from 125 subtypes)
 * - 'ระดับความรุนแรง' -> ncc_merp (A-I) & rm_grade (1-5)
 * - 'หมายเหตุ' -> problem_description
 * - 'เจ้าหน้าที่' -> reporter_reference / recorded_by_reference
 */
export function mapHosxpToProposed(rawRow) {
  const p = {};
  const notes = [];

  // 1. Datetime mapping -> incident_date, reported_date, incident_time
  const dtRaw = rawRow['วันที่/เวลา'] || rawRow['วันที่ / เวลา'] || rawRow['วันที่/เวลาเกิดเหตุ'] ||
                rawRow.incident_datetime || rawRow.incident_date || rawRow.date || rawRow.datetime || rawRow.order_date || '';
  if (dtRaw) {
    const parsed = parseHosxpDateTime(dtRaw);
    if (parsed.date) {
      p.incident_date = parsed.date;
      p.reported_date = parsed.date;
      p.incident_time = parsed.time || '08:30';
    } else {
      notes.push('Could not parse date timestamp clearly; defaulted to today.');
      const today = new Date().toISOString().split('T')[0];
      p.incident_date = today;
      p.reported_date = today;
      p.incident_time = '08:30';
    }
  } else {
    const today = new Date().toISOString().split('T')[0];
    p.incident_date = today;
    p.reported_date = today;
    p.incident_time = '08:30';
  }

  // 2. Patient Type: ward/dept -> OPD / IPD
  const wardRaw = String(
    rawRow['แผนก'] || rawRow.ward || rawRow.ward_name || rawRow.department || rawRow.pt_type || rawRow.patient_type || ''
  ).trim().toLowerCase();

  if (wardRaw.includes('ipd') || wardRaw.includes('ward') || wardRaw.includes('ตึก') || wardRaw.includes('ใน') || wardRaw.includes('ผู้ป่วยใน')) {
    p.patient_type = 'IPD';
  } else {
    p.patient_type = 'OPD';
  }

  // 3. HN
  p.hn = String(rawRow['HN'] || rawRow.hn || rawRow.patient_hn || '').trim().slice(0, 20);

  // 4 & 5. Drugs
  p.intended_drug = String(
    rawRow['ชื่อยา'] || rawRow.intended_drug || rawRow.drug_intended || rawRow.drug_name || rawRow.medication || ''
  ).trim();

  let errDrug = String(rawRow.error_drug || rawRow.drug_error || rawRow.wrong_drug || '').trim();

  // 6. Problem description & smart error drug detection from 'หมายเหตุ'
  const noteRaw = String(
    rawRow['หมายเหตุ'] ||
    rawRow.problem_description ||
    rawRow.description ||
    rawRow.incident_detail ||
    rawRow.detail ||
    rawRow.error_detail ||
    'Medication error incident imported from HOSxP export'
  ).trim();

  p.problem_description = noteRaw;

  // Smart heuristic: if error_drug is empty and note mentions "จัด X เป็น Y"
  if (!errDrug && noteRaw) {
    const asMatch = noteRaw.match(/(?:จัด|สั่ง|ให้|เปลี่ยนเป็น)\s+.*?\s+เป็น\s+([A-Za-z0-9\s.+-]+)/i);
    if (asMatch && asMatch[1]) {
      errDrug = asMatch[1].trim();
      notes.push(`Suggested error drug '${errDrug}' parsed from note.`);
    }
  }
  p.error_drug = errDrug;

  // 7. Corrective action
  p.corrective_action = String(rawRow.corrective_action || rawRow.action_taken || rawRow.solve || '').trim();

  // 8. NCC-MERP & rm_grade
  const severityRaw = String(
    rawRow['ระดับความรุนแรง'] || rawRow['ความรุนแรง'] || rawRow.ncc_merp || rawRow.severity || rawRow.merp_category || rawRow.level || 'B'
  ).trim();

  // Extract Category letter A-I (handles e.g. "Category B: มีความคลาดเคลื่อน...", "B", "Cat E")
  const catMatch = severityRaw.match(/(?:Category|Cat|ระดับ|Grade)?\s*([A-I])(?::|\s|\b|$)/i);
  const detectedCategory = catMatch ? catMatch[1].toUpperCase() : 'B';
  const validLevels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  p.ncc_merp = validLevels.includes(detectedCategory) ? detectedCategory : 'B';
  p.rm_grade = computeRmGrade(p.ncc_merp);

  // E-up Sentinel Harm Tagging
  const isEUp = ['E', 'F', 'G', 'H', 'I'].includes(p.ncc_merp);
  p.rca_status = isEUp ? 'pending' : 'none';
  if (isEUp) {
    notes.push('⚠️ เคสระดับความรุนแรงสูง (E-up: Cat E-I): บังคับทำ RCA เชิงระบบก่อนจึงจะสามารถ Verify ได้');
  }

  // 9. Preventability
  const prevRaw = String(rawRow.preventability || rawRow.anticipated_severity || '').toUpperCase().trim();
  if (['C', 'D', 'E', 'F', 'G', 'H', 'I'].includes(prevRaw)) {
    p.preventability = prevRaw;
  } else {
    p.preventability = undefined;
  }

  // 17. Process (ME Type: PRE, TRA, PDI, DIS, ADM, PRO)
  const stepRaw = String(
    rawRow['ขั้นตอนของความคลาดเคลื่อน'] || rawRow['ขั้นตอน'] || rawRow.step || rawRow.process || rawRow.me_type || rawRow.stage || ''
  );
  p.process = mapStepToProcess(stepRaw);

  // 18. ME Subtype (125 standardized items)
  const subtypeRaw = String(
    rawRow['ชนิดความคลาดเคลื่อน'] || rawRow.me_subtype || rawRow.subtype || rawRow.error_type || rawRow.cause_type || ''
  );
  p.me_subtype = suggestMeSubtype(p.process, subtypeRaw);

  // 11. Error staff (ผู้สั่งยา / ผู้ทำให้เกิดความคลาดเคลื่อน)
  const staffPrescriber = String(
    rawRow['ผู้สั่งยา'] || rawRow['แพทย์ผู้สั่ง'] || rawRow['แพทย์'] || rawRow.doctor_name || rawRow.doctor || rawRow.prescriber || ''
  ).trim();
  if (staffPrescriber) {
    p.error_staff_reference = staffPrescriber;
  }

  // 15 & 20. Reporter (เจ้าหน้าที่ / ผู้บันทึก)
  const reporterRaw = String(
    rawRow['เจ้าหน้าที่'] || rawRow['ผู้รายงาน'] || rawRow.reporter || rawRow.reporter_name || rawRow.recorded_by || ''
  ).trim();
  if (reporterRaw) {
    p.reporter_reference = reporterRaw;
    p.recorded_by_reference = reporterRaw;
  }

  // 10 & 13. Departments:
  // Rule: Do NOT guess origin_department_id unless it is a Prescribing error with a recognized doctor.
  if (p.process === 'PRE' && staffPrescriber) {
    if (staffPrescriber.toLowerCase().includes('กุมาร') || staffPrescriber.toLowerCase().includes('ped')) {
      p.origin_department_id = 'dept-ped';
      notes.push(`Suggested origin department 'dept-ped' based on prescribing physician (${staffPrescriber}).`);
    } else {
      p.origin_department_id = 'dept-med';
      notes.push(`Suggested origin department 'dept-med' based on prescribing physician (${staffPrescriber}).`);
    }
  } else {
    p.origin_department_id = ''; // Reviewer must select
    notes.push('Origin Department requires reviewer assignment.');
  }

  // Detection department: default Pharmacy if detected during checking/dispensing
  p.detection_department_id = 'dept-pharma';

  // 19. Cause
  p.cause = String(rawRow.cause || rawRow.root_cause || rawRow.factor || '').trim();

  return { proposed: p, notes };
}

/**
 * Parses diverse date-time string formats from HOSxP and Excel
 * Accurately splits into incident_date (YYYY-MM-DD) and incident_time (HH:MM).
 */
function parseHosxpDateTime(dtStr) {
  try {
    if (!dtStr) return { date: null, time: null };

    // If JavaScript Date object (e.g. from SheetJS dateNF)
    if (dtStr instanceof Date && !isNaN(dtStr.getTime())) {
      const y = dtStr.getFullYear();
      const m = String(dtStr.getMonth() + 1).padStart(2, '0');
      const d = String(dtStr.getDate()).padStart(2, '0');
      const hh = String(dtStr.getHours()).padStart(2, '0');
      const mm = String(dtStr.getMinutes()).padStart(2, '0');
      return { date: `${y}-${m}-${d}`, time: `${hh}:${mm}` };
    }

    const str = String(dtStr).trim();
    // Handles '25/10/2026 9:49:01', '25/10/2026 13:55:59', '2026-10-24 09:30:00' or '2026-10-24T09:30'
    const parts = str.split(/[ T]/);
    let datePart = parts[0] || '';
    let timeRaw = parts.slice(1).join(' ').trim();

    // Parse Time: e.g. '9:49:01' -> '09:49'
    let timePart = '08:30';
    if (timeRaw) {
      const tSegments = timeRaw.split(':');
      if (tSegments.length >= 2) {
        const hh = tSegments[0].trim().padStart(2, '0');
        const mm = tSegments[1].trim().padStart(2, '0');
        timePart = `${hh}:${mm}`;
      } else if (tSegments.length === 1 && tSegments[0]) {
        timePart = `${tSegments[0].trim().padStart(2, '0')}:00`;
      }
    }

    // Handle Thai Buddhist calendar year if > 2500 (e.g. 2569 -> 2026)
    if (datePart && datePart.includes('-')) {
      const dp = datePart.split('-');
      if (dp.length === 3) {
        let y = parseInt(dp[0], 10);
        if (y > 2500) y -= 543;
        datePart = `${y}-${dp[1].padStart(2, '0')}-${dp[2].padStart(2, '0')}`;
      }
    } else if (datePart && datePart.includes('/')) {
      // DD/MM/YYYY
      const dp = datePart.split('/');
      if (dp.length === 3) {
        let y = parseInt(dp[2], 10);
        if (y > 2500) y -= 543;
        datePart = `${y}-${dp[1].padStart(2, '0')}-${dp[0].padStart(2, '0')}`;
      }
    }

    return { date: datePart || null, time: timePart };
  } catch (err) {
    return { date: null, time: null };
  }
}

/**
 * Maps raw step keywords or Thai descriptions to standard ME process code
 */
function mapStepToProcess(rawStep) {
  const s = String(rawStep || '').toLowerCase().trim();
  if (s === 'adm' || s.includes('admin') || s.includes('บริหาร') || s.includes('ให้ยา')) return 'ADM';
  if (s === 'pdi' || s.includes('pre-dispens') || s.includes('ก่อนการจ่าย') || s.includes('จัดยา') || s.includes('pre-disp') || s.includes('predisp')) return 'PDI';
  if (s === 'dis' || s.includes('dispens') || s.includes('จ่ายยา') || s.includes('การจ่ายยา')) return 'DIS';
  if (s === 'tra' || s.includes('transcrib') || s.includes('คัดลอก') || s.includes('บันทึกคำสั่ง')) return 'TRA';
  if (s === 'pre' || s.includes('prescrib') || s.includes('สั่งใช้ยา') || s.includes('สั่งยา') || s.includes('สั่ง')) return 'PRE';
  if (s === 'pro' || s.includes('บันทึก') || s.includes('ติดตาม') || s.includes('monitor')) return 'PRO';
  return 'PRE';
}

/**
 * Suggests best-match ME subtype code within process
 */
function suggestMeSubtype(processCode, rawSubtype) {
  const list = ME_SUBTYPES.filter(item => item.process === processCode);
  if (!rawSubtype || !rawSubtype.trim()) {
    return list[0]?.code || `${processCode}-01`;
  }

  const query = rawSubtype.toLowerCase().trim();
  const directMatch = list.find(item =>
    item.code.toLowerCase() === query ||
    item.label.toLowerCase().includes(query)
  );

  if (directMatch) return directMatch.code;

  // Keyword fuzzy matches
  if (query.includes('wrong drug') || query.includes('ผิดชนิด')) {
    return list.find(i => i.code.endsWith('-01'))?.code || list[0]?.code || `${processCode}-01`;
  }
  if (query.includes('dose') || query.includes('ขนาด') || query.includes('strength') || query.includes('ความแรง')) {
    return list.find(i => i.code.endsWith('-02'))?.code || list[0]?.code || `${processCode}-01`;
  }
  if (query.includes('omission') || query.includes('ขาด') || query.includes('ลืม') || query.includes('ไม่ได้จัด')) {
    return list.find(i => i.label.toLowerCase().includes('omission') || i.label.includes('ตกหล่น') || i.label.includes('ขาด'))?.code || list[0]?.code || `${processCode}-01`;
  }

  return list[0]?.code || `${processCode}-01`;
}

/**
 * Process a batch of uploaded HOSxP rows for Stage 1 staging.
 */
export function stageHosxpBatch(rows, filename, user, existingKeysSet) {
  const staged = [];
  const duplicates = [];
  const errors = [];

  rows.forEach((row, idx) => {
    try {
      const stripped = stripPiiClientSide(row);
      const rowNo = idx + 1;

      const dt = stripped['วันที่/เวลา'] || stripped['วันที่ / เวลา'] || stripped.incident_datetime || stripped.incident_date || stripped.date || stripped.datetime || '';
      const hn = stripped['HN'] || stripped.hn || stripped.patient_hn || '';
      const drug = stripped['ชื่อยา'] || stripped.intended_drug || stripped.drug_name || stripped.medication || '';
      const step = stripped['ขั้นตอนของความคลาดเคลื่อน'] || stripped['ขั้นตอน'] || stripped.step || stripped.process || '';

      const sourceKey = generateDeduplicationHashSync(dt, hn, drug, step);

      if (existingKeysSet.has(sourceKey)) {
        duplicates.push({ rowNo, sourceKey, dt, hn, drug });
        return;
      }

      const { proposed, notes } = mapHosxpToProposed(stripped);

      staged.push({
        id: `hosxp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        source_key: sourceKey,
        filename,
        row_no: rowNo,
        raw: JSON.stringify(stripped),
        proposed: JSON.stringify(proposed),
        notes: JSON.stringify(notes),
        status: 'review',
        event_id: null,
        reject_reason: null,
        reviewed_by: null,
        reviewed_at: null,
        created_by: user.id,
        created_at: new Date().toISOString()
      });

      // Avoid duplicates within the same batch
      existingKeysSet.add(sourceKey);
    } catch (err) {
      errors.push({ rowNo: idx + 1, error: err.message });
    }
  });

  return { staged, duplicates, errors };
}
