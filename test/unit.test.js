/**
 * Medication Error Reporting System (v0.4 Simple Edition)
 * Comprehensive Node.js Unit Test Suite
 * Run with: node --test test/unit.test.js
 */

import assert from 'node:assert';
import test, { describe, it } from 'node:test';

import {
  checkLasaPair,
  computeRmGrade,
  generateDeduplicationHashSync,
  getValidPreventabilityOptions,
  isHighAlertDrug,
  stripPiiClientSide,
  validateReport
} from '../shared/form.js';
import { mapHosxpToProposed } from '../worker/hosxp.js';
import { canEditReport, canViewReport, validateTransition } from '../worker/rules.js';

describe('1. Form Specification & Validation Tests', () => {
  const validReportSample = {
    patient_type: 'IPD',
    hn: 'HN69001234',
    incident_date: '2026-10-24',
    intended_drug: 'Metformin 500 mg tab',
    error_drug: 'Glipizide 5 mg tab',
    problem_description: 'Patient received Glipizide instead of Metformin resulting in mild hypoglycemia.',
    corrective_action: 'Hypoglycemia treated with 50% Glucose IV; order corrected.',
    ncc_merp: 'E',
    preventability: 'E',
    origin_department_id: 'dept-pharma',
    error_staff_reference: 'user-rev1',
    consult_recipient_reference: 'user-doc1',
    detection_department_id: 'dept-ipd1',
    reporter_reference: 'user-rep1',
    reported_date: '2026-10-24',
    incident_time: '10:15',
    process: 'DIS',
    me_subtype: 'DIS-02',
    cause: 'Similar packaging on dispensing shelf.',
    recorded_by_reference: 'user-rev1'
  };

  it('passes validation with a valid 20-field report', () => {
    const res = validateReport(validReportSample);
    assert.strictEqual(res.valid, true, `Errors: ${JSON.stringify(res.errors)}`);
  });

  it('fails when required fields are missing', () => {
    const incomplete = { ...validReportSample };
    delete incomplete.patient_type;
    delete incomplete.incident_date;
    delete incomplete.problem_description;
    delete incomplete.ncc_merp;
    delete incomplete.origin_department_id;
    delete incomplete.detection_department_id;
    delete incomplete.process;
    delete incomplete.me_subtype;

    const res = validateReport(incomplete);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.patient_type);
    assert.ok(res.errors.incident_date);
    assert.ok(res.errors.problem_description);
    assert.ok(res.errors.ncc_merp);
    assert.ok(res.errors.origin_department_id);
    assert.ok(res.errors.detection_department_id);
    assert.ok(res.errors.process);
    assert.ok(res.errors.me_subtype);
  });

  it('calculates rm_grade accurately from NCC MERP category', () => {
    assert.strictEqual(computeRmGrade('A'), 1);
    assert.strictEqual(computeRmGrade('B'), 2);
    assert.strictEqual(computeRmGrade('C'), 2);
    assert.strictEqual(computeRmGrade('D'), 2);
    assert.strictEqual(computeRmGrade('E'), 3);
    assert.strictEqual(computeRmGrade('F'), 3);
    assert.strictEqual(computeRmGrade('G'), 4);
    assert.strictEqual(computeRmGrade('H'), 4);
    assert.strictEqual(computeRmGrade('I'), 5);
  });

  it('enforces preventability >= ncc_merp rule', () => {
    // If ncc_merp is 'E', preventability must be >= 'E' (E, F, G, H, I)
    const validE = { ...validReportSample, ncc_merp: 'E', preventability: 'E' };
    assert.strictEqual(validateReport(validE).valid, true);

    const validG = { ...validReportSample, ncc_merp: 'E', preventability: 'G' };
    assert.strictEqual(validateReport(validG).valid, true);

    // Preventability 'C' < 'E' -> must fail
    const invalidC = { ...validReportSample, ncc_merp: 'E', preventability: 'C' };
    const res = validateReport(invalidC);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.preventability);
  });

  it('restricts preventability options strictly to C through I', () => {
    const invalidA = { ...validReportSample, preventability: 'A' };
    assert.strictEqual(validateReport(invalidA).valid, false);

    const invalidB = { ...validReportSample, preventability: 'B' };
    assert.strictEqual(validateReport(invalidB).valid, false);

    const validOptionsForE = getValidPreventabilityOptions('E');
    assert.deepStrictEqual(validOptionsForE.map(o => o.code), ['E', 'F', 'G', 'H', 'I']);
  });

  it('rejects incident_date after reported_date', () => {
    const badDate = {
      ...validReportSample,
      incident_date: '2026-10-25',
      reported_date: '2026-10-24'
    };
    const res = validateReport(badDate);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.incident_date);
  });

  it('supports partial patch validation without overwriting non-targeted fields', () => {
    const patch = { corrective_action: 'Patient monitored for 24h.' };
    const res = validateReport(patch, true);
    assert.strictEqual(res.valid, true);
  });
});

describe('2. RBAC & Workflow Transition Tests', () => {
  const reporterUser = { id: 'user-rep1', role: 'reporter', department_id: 'dept-opd' };
  const reporterUser2 = { id: 'user-rep2', role: 'reporter', department_id: 'dept-er' };
  const reviewerUser1 = { id: 'user-rev1', role: 'reviewer', department_id: 'dept-pharma' };
  const reviewerUser2 = { id: 'user-rev2', role: 'reviewer', department_id: 'dept-pharma' };
  const deptHeadUser = { id: 'user-head-ipd', role: 'dept_head', department_id: 'dept-ipd1' };
  const adminUser = { id: 'user-admin', role: 'admin', department_id: 'dept-qa' };

  const pendingReport = {
    id: 'rpt-001',
    created_by: 'user-rep1',
    creator_department_id: 'dept-opd',
    origin_department_id: 'dept-opd',
    detection_department_id: 'dept-pharma',
    status: 'pending'
  };

  const verifiedReport = {
    ...pendingReport,
    id: 'rpt-002',
    status: 'verified',
    ever_verified: 1
  };

  it('restricts report visibility according to user role', () => {
    // Reporter can view only own
    assert.strictEqual(canViewReport(reporterUser, pendingReport), true);
    assert.strictEqual(canViewReport(reporterUser2, pendingReport), false);

    // Reviewer can view all
    assert.strictEqual(canViewReport(reviewerUser1, pendingReport), true);

    // Dept head can view only reports in their department
    assert.strictEqual(canViewReport(deptHeadUser, pendingReport), false); // Dept is IPD1, report is OPD/PHARMA
    const ownDeptReport = { ...pendingReport, origin_department_id: 'dept-ipd1' };
    assert.strictEqual(canViewReport(deptHeadUser, ownDeptReport), true);

    // Admin can view all
    assert.strictEqual(canViewReport(adminUser, pendingReport), true);
  });

  it('prevents self-verification for creators (must be verified by another reviewer or admin)', () => {
    const reviewReportCreatedByRev1 = {
      ...pendingReport,
      created_by: 'user-rev1'
    };

    // Reviewer 1 created it, so Reviewer 1 CANNOT self-verify
    const selfVerify = validateTransition(reviewerUser1, reviewReportCreatedByRev1, 'verify');
    assert.strictEqual(selfVerify.allowed, false);
    assert.match(selfVerify.error, /Self-verification forbidden/);

    // Reviewer 2 (different reviewer) CAN verify
    const peerVerify = validateTransition(reviewerUser2, reviewReportCreatedByRev1, 'verify');
    assert.strictEqual(peerVerify.allowed, true);
    assert.strictEqual(peerVerify.newStatus, 'verified');

    // Admin bypasses self-verification restriction
    const adminCreatedReport = { ...pendingReport, created_by: 'user-admin' };
    const adminSelfVerify = validateTransition(adminUser, adminCreatedReport, 'verify');
    assert.strictEqual(adminSelfVerify.allowed, true);
  });

  it('disallows reopen across all roles (reports once verified are permanent)', () => {
    // Reopen attempt must fail
    const reopenHead = validateTransition(deptHeadUser, verifiedReport, 'reopen', 'Need to review again');
    assert.strictEqual(reopenHead.allowed, false);

    const reopenRev = validateTransition(reviewerUser1, verifiedReport, 'reopen', 'New evidence surfaced');
    assert.strictEqual(reopenRev.allowed, false);
    assert.match(reopenRev.error, /not supported|permanent/i);
  });
});

describe('3. High Alert Drugs (HAD) & LASA Pair Detection', () => {
  it('correctly detects High Alert Drugs (Insulin, Warfarin, KCl, Fentanyl)', () => {
    assert.strictEqual(isHighAlertDrug('Warfarin sodium 2 mg tab'), true);
    assert.strictEqual(isHighAlertDrug('Potassium Chloride 20 mEq/10 mL'), true);
    assert.strictEqual(isHighAlertDrug('Insulin Regular (Actrapid)'), true);
    assert.strictEqual(isHighAlertDrug('Fentanyl 100 mcg amp'), true);
    assert.strictEqual(isHighAlertDrug('Paracetamol 500 mg tab'), false);
    assert.strictEqual(isHighAlertDrug('Amoxicillin 500 mg cap'), false);
  });

  it('detects recognized Look-Alike Sound-Alike (LASA) drug pairs', () => {
    const pair1 = checkLasaPair('Amlodipine 5 mg tab', 'Amlodipine 10 mg tab');
    assert.ok(pair1);
    assert.match(pair1.note, /Different strength/);

    const pair2 = checkLasaPair('Ceftriaxone 1 g vial', 'Cefazolin 1 g vial');
    assert.ok(pair2);

    const notPair = checkLasaPair('Paracetamol 500 mg tab', 'Amoxicillin 500 mg cap');
    assert.strictEqual(notPair, null);
  });
});

describe('3. HOSxP Smart Import & Deduplication Tests', () => {
  it('strips PII (Patient Name, CID, Phone, and Thai ชื่อผู้ป่วย) client-side', () => {
    const raw = {
      hn: 'HN12345',
      'ชื่อผู้ป่วย': 'นาย สมศักดิ์ มีสุข',
      patient_name: 'นาย สมศักดิ์ มีสุข',
      ptname: 'นาย สมศักดิ์ มีสุข',
      cid: '1509900012345',
      phone: '0812345678',
      drug_name: 'Paracetamol 500 mg',
      step: 'Dispensing'
    };

    const clean = stripPiiClientSide(raw);
    assert.strictEqual(clean.hn, 'HN12345');
    assert.strictEqual(clean.drug_name, 'Paracetamol 500 mg');
    assert.strictEqual(clean['ชื่อผู้ป่วย'], undefined, 'Thai patient name must be stripped client-side');
    assert.strictEqual(clean.patient_name, undefined);
    assert.strictEqual(clean.ptname, undefined);
    assert.strictEqual(clean.cid, undefined);
    assert.strictEqual(clean.phone, undefined);
  });

  it('generates consistent deduplication hash from datetime + hn + drug + step', () => {
    const hash1 = generateDeduplicationHashSync('2026-10-24 10:00', 'HN123', 'Amlodipine', 'PRE');
    const hash2 = generateDeduplicationHashSync('2026-10-24 10:00', 'HN123', 'Amlodipine', 'PRE');
    const hashDiff = generateDeduplicationHashSync('2026-10-24 10:01', 'HN123', 'Amlodipine', 'PRE');

    assert.strictEqual(hash1, hash2);
    assert.notStrictEqual(hash1, hashDiff);
    assert.strictEqual(typeof hash1, 'string');
    assert.ok(hash1.length >= 32);
  });

  it('maps exact Thai HOSxP export row (from hospital screenshot) and splits datetime into date and time accurately', () => {
    const rawRow = {
      'ลำดับ': 1,
      'วันที่/เวลา': '25/10/2026 9:49:01',
      'HN': '000235958',
      'ชื่อผู้ป่วย': 'นายชาญณวัตร อินทรวงศ์',
      'ผู้สั่งยา': 'พญ.วราดา เครือประดิษฐ์',
      'แผนก': 'IPD',
      'ชื่อยา': 'traMADol CAP (ทDu3,C30)',
      'ขั้นตอนของความคลาดเคลื่อน': 'ความคลาดเคลื่อนก่อนการจ่ายยา ( Pre-dispensing error)',
      'ชนิดความคลาดเคลื่อน': '',
      'ระดับความรุนแรง': 'Category B: มีความคลาดเคลื่อนเกิดขึ้นแต่ไม่เป็นอันตรายต่อผู้ป่วย เนื่องจากความคลาดเคลื่อนไปไม่ถึงผู้ป่วย',
      'หมายเหตุ': 'ไม่ได้จัดยา',
      'เจ้าหน้าที่': 'นายอนุภาพ ภูหลัก'
    };

    const clean = stripPiiClientSide(rawRow);
    assert.strictEqual(clean['ชื่อผู้ป่วย'], undefined, 'Patient name must be stripped for PDPA');

    const { proposed } = mapHosxpToProposed(clean);
    assert.strictEqual(proposed.incident_date, '2026-10-25', 'Date must be YYYY-MM-DD');
    assert.strictEqual(proposed.incident_time, '09:49', 'Time must be HH:MM padded');
    assert.strictEqual(proposed.hn, '000235958');
    assert.strictEqual(proposed.patient_type, 'IPD');
    assert.strictEqual(proposed.intended_drug, 'traMADol CAP (ทDu3,C30)');
    assert.strictEqual(proposed.process, 'PDI');
    assert.strictEqual(proposed.ncc_merp, 'B');
    assert.strictEqual(proposed.rm_grade, 2);
    assert.strictEqual(proposed.problem_description, 'ไม่ได้จัดยา');
    assert.strictEqual(proposed.error_staff_reference, 'พญ.วราดา เครือประดิษฐ์');
    assert.strictEqual(proposed.reporter_reference, 'นายอนุภาพ ภูหลัก');
  });

  it('allows Reviewer to verify E-up reports while RCA is reviewed separately in Risk Management', () => {
    const reviewer2 = { id: 'user-rev2', role: 'reviewer', department_id: 'dept-pharma' };

    const eUpReport = {
      id: 'rpt-eup-01',
      created_by: 'user-rep1',
      origin_department_id: 'dept-opd',
      detection_department_id: 'dept-pharma',
      status: 'pending',
      ncc_merp: 'E',
      rca_status: 'pending'
    };

    // Reviewer verification of clinical report data succeeds
    const resVerify = validateTransition(reviewer2, eUpReport, 'verify');
    assert.strictEqual(resVerify.allowed, true);
    assert.strictEqual(resVerify.newStatus, 'verified');
  });
});
