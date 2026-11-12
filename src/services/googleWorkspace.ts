/**
 * Google Workspace (Drive & Sheets) Integration Service
 * Uses Firebase Auth to sign in and obtain client-side OAuth access token.
 * Token is cached in memory ONLY (never stored in localStorage).
 */

import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { getFullSubtypeLabel, PROCESS_OPTIONS } from '../../shared/form.js';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export function initAuth(
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
}

export async function googleSignIn(): Promise<{ user: User; accessToken: string } | null> {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token from Firebase credential.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err: any) {
    console.error('Google Sign-in error:', err);
    throw err;
  } finally {
    isSigningIn = false;
  }
}

export async function googleSignOut(): Promise<void> {
  await signOut(auth);
  cachedAccessToken = null;
}

export function getCachedToken(): string | null {
  return cachedAccessToken;
}

/**
 * Creates a new Google Spreadsheet in the user's Google Drive and populates it with Medication Error reports.
 */
export async function exportReportsToGoogleSheets(
  reports: any[],
  customTitle?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  if (!cachedAccessToken) {
    throw new Error('Please sign in with Google to export to Google Sheets.');
  }

  const title = customTitle || `Medication Error Reports - ${new Date().toISOString().split('T')[0]}`;

  // 1. Create Spreadsheet via Google Sheets API v4
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: 'Medication Errors',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Spreadsheet: ${errText}`);
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = spreadsheet.spreadsheetUrl;

  // 2. Prepare Rows
  const headers = [
    'Report No',
    'Status',
    'Patient Type',
    'HN',
    'Incident Date',
    'Incident Time',
    'Process (ME Type)',
    'ME Subtype',
    'NCC-MERP Severity',
    'RM Grade',
    'Preventability',
    'ยาที่ถูก (ชื่อยา + ความแรง)',
    'ยาที่ผิด (ชื่อยา + ความแรง)',
    'Problem Description',
    'Corrective Action',
    'Origin Department',
    'Detection Department',
    'Reporter Reference',
    'Reported Date',
    'Root Cause',
    'Created At',
    'Verified By'
  ];

  const rowsData = reports.map(r => {
    const processObj = PROCESS_OPTIONS.find(p => p.code === r.process);
    const processFull = processObj ? processObj.label : (r.process || '');
    const subtypeFull = getFullSubtypeLabel(r.me_subtype) || r.me_subtype || '';

    const errDrugFull = r.error_drug
      ? (r.error_drug_strength && !r.error_drug.includes(r.error_drug_strength) ? `${r.error_drug} ${r.error_drug_strength}` : r.error_drug)
      : '';
    const intendedDrugFull = r.intended_drug
      ? (r.intended_drug_strength && !r.intended_drug.includes(r.intended_drug_strength) ? `${r.intended_drug} ${r.intended_drug_strength}` : r.intended_drug)
      : '';

    return [
      r.report_no || '',
      (r.status || '').toUpperCase(),
      r.patient_type || '',
      r.hn || '',
      r.incident_date || '',
      r.incident_time || '',
      processFull,
      subtypeFull,
      r.ncc_merp || '',
      r.rm_grade ? `Grade ${r.rm_grade}` : '',
      r.preventability || '',
      intendedDrugFull,
      errDrugFull,
      r.problem_description || '',
      r.corrective_action || '',
      r.origin_department_name || r.origin_department_id || '',
      r.detection_department_name || r.detection_department_id || '',
      r.reporter_reference || '',
      r.reported_date || '',
      r.cause || '',
      r.created_at || '',
      r.verifier_name || ''
    ];
  });

  const valueRange = {
    range: 'Medication Errors!A1',
    majorDimension: 'ROWS',
    values: [headers, ...rowsData]
  };

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Medication Errors!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(valueRange)
    }
  );

  if (!appendRes.ok) {
    const errText = await appendRes.text();
    throw new Error(`Failed to append data to Google Sheet: ${errText}`);
  }

  return { spreadsheetId, spreadsheetUrl };
}
