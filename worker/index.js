/**
 * Medication Error Reporting System (v0.4 Simple Edition)
 * Main Cloudflare Worker API Router (ES Modules)
 */

import { computeRmGrade, validateReport } from '../shared/form.js';
import { stageHosxpBatch } from './hosxp.js';
import { canEditReport, canViewReport, computeFieldDiff, validateTransition } from './rules.js';
import { DatabaseService } from './sql.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    try {
      // Initialize database service with Cloudflare D1
      // In Worker environment, D1 binding is typically env.DB
      const db = new DatabaseService(env.DB);
      
      // Seed master data on cold start if needed
      await db.seedMasterData();

      // Development / Staging Authentication Header
      const userId = request.headers.get('X-User-Id') || 'user-admin';
      const currentUser = await db.getUserById(userId) || (await db.getUsers())[0];

      // Route Dispatcher
      const pathname = url.pathname;

      // 1. Current user / Auth me
      if (pathname === '/api/me' && method === 'GET') {
        return jsonResponse({ user: currentUser });
      }

      // 2. Departments
      if (pathname === '/api/departments' && method === 'GET') {
        const departments = await db.getDepartments();
        return jsonResponse({ departments });
      }

      // 3. Users list
      if (pathname === '/api/users' && method === 'GET') {
        const users = await db.getUsers();
        return jsonResponse({ users });
      }

      // 4. Reports list (RBAC filtered)
      if (pathname === '/api/reports' && method === 'GET') {
        const params = {
          status: url.searchParams.get('status') || '',
          process: url.searchParams.get('process') || '',
          ncc_merp: url.searchParams.get('ncc_merp') || '',
          search: url.searchParams.get('search') || '',
          limit: url.searchParams.get('limit') || 100,
          offset: url.searchParams.get('offset') || 0,
        };
        const reports = await db.listReports(currentUser, params);
        return jsonResponse({ reports });
      }

      // 5. Create Report (All 20 fields validated)
      if (pathname === '/api/reports' && method === 'POST') {
        const body = await request.json();
        
        // Compute rm_grade automatically
        body.rm_grade = computeRmGrade(body.ncc_merp);

        // Validate payload
        const validation = validateReport(body, false);
        if (!validation.valid) {
          return jsonResponse({ error: 'Validation failed', details: validation.errors }, 400);
        }

        const created = await db.createReport(body, currentUser.id);
        return jsonResponse({ report: created, message: 'Report created successfully.' }, 201);
      }

      // 6. Single Report detail
      const singleReportMatch = pathname.match(/^\/api\/reports\/([^/]+)$/);
      if (singleReportMatch) {
        const reportId = singleReportMatch[1];
        const report = await db.getReportById(reportId);
        if (!report) {
          return jsonResponse({ error: 'Report not found' }, 404);
        }

        // Check RBAC View permission
        if (!canViewReport(currentUser, report)) {
          return jsonResponse({ error: 'Forbidden: You do not have permission to view this report.' }, 403);
        }

        if (method === 'GET') {
          const history = await db.getReportStatusHistory(reportId);
          return jsonResponse({ report, history });
        }

        // PATCH: modify fields (Patch only modified fields, never overwrite with null)
        if (method === 'PATCH') {
          if (!canEditReport(currentUser, report)) {
            return jsonResponse({ error: 'Forbidden: You do not have permission to edit this report in its current status.' }, 403);
          }

          const patchBody = await request.json();
          if (patchBody.ncc_merp) {
            patchBody.rm_grade = computeRmGrade(patchBody.ncc_merp);
          }

          // Validate patched fields only
          const validation = validateReport(patchBody, true);
          if (!validation.valid) {
            return jsonResponse({ error: 'Validation failed', details: validation.errors }, 400);
          }

          const updated = await db.patchReport(reportId, patchBody, currentUser.id, report);
          return jsonResponse({ report: updated, message: 'Report updated successfully.' });
        }
      }

      // 7. Status transitions (/api/reports/:id/transition)
      const transitionMatch = pathname.match(/^\/api\/reports\/([^/]+)\/transition$/);
      if (transitionMatch && method === 'POST') {
        const reportId = transitionMatch[1];
        const report = await db.getReportById(reportId);
        if (!report) return jsonResponse({ error: 'Report not found' }, 404);

        const { action, comment } = await request.json();
        const check = validateTransition(currentUser, report, action, comment);
        if (!check.allowed) {
          return jsonResponse({ error: check.error }, 403);
        }

        const transitioned = await db.transitionReport(
          reportId,
          action,
          report.status,
          check.newStatus,
          comment,
          currentUser.id
        );
        return jsonResponse({ report: transitioned, message: `Report transitioned to ${check.newStatus} successfully.` });
      }

      // 8. HOSxP Stage 1 upload batch
      if (pathname === '/api/hosxp/stage' && method === 'POST') {
        if (!['reviewer', 'admin'].includes(currentUser.role)) {
          return jsonResponse({ error: 'Forbidden: Only Reviewers and Admins can access HOSxP Smart Import.' }, 403);
        }

        const { filename, rows } = await request.json();
        if (!rows || !Array.isArray(rows) || rows.length === 0) {
          return jsonResponse({ error: 'No data rows provided' }, 400);
        }

        // Query existing source keys in D1 to prevent duplicate staging
        const allPossibleKeys = rows.map(r => {
          const dt = r.incident_datetime || r.incident_date || r.date || r.datetime || '';
          const hn = r.hn || r.patient_hn || '';
          const drug = r.intended_drug || r.drug_name || r.medication || '';
          const step = r.step || r.process || '';
          return `${dt}|${hn}|${drug}|${step}`;
        });
        const existingKeySet = await db.getExistingSourceKeys(allPossibleKeys);

        const { staged, duplicates, errors } = stageHosxpBatch(rows, filename || 'hosxp_export.xlsx', currentUser, existingKeySet);

        if (staged.length > 0) {
          await db.insertHosxpRows(staged);
        }

        return jsonResponse({
          stagedCount: staged.length,
          duplicateCount: duplicates.length,
          duplicates,
          errors,
          message: `Staged ${staged.length} records into Review Queue (${duplicates.length} duplicates skipped).`
        });
      }

      // 9. HOSxP Review Queue
      if (pathname === '/api/hosxp/queue' && method === 'GET') {
        if (!['reviewer', 'admin'].includes(currentUser.role)) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }
        const status = url.searchParams.get('status') || 'review';
        const queue = await db.listHosxpQueue(status);
        return jsonResponse({ queue });
      }

      // 10. HOSxP Row Action: Approve
      const approveMatch = pathname.match(/^\/api\/hosxp\/([^/]+)\/approve$/);
      if (approveMatch && method === 'POST') {
        if (!['reviewer', 'admin'].includes(currentUser.role)) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }
        const hosxpId = approveMatch[1];
        const hosxpRow = await db.getHosxpRowById(hosxpId);
        if (!hosxpRow) return jsonResponse({ error: 'Staged row not found' }, 404);

        const proposedBody = await request.json();
        proposedBody.rm_grade = computeRmGrade(proposedBody.ncc_merp);

        // Must strictly validate all 20 fields before creating official report
        const validation = validateReport(proposedBody, false);
        if (!validation.valid) {
          return jsonResponse({ error: 'Cannot approve: missing required form fields', details: validation.errors }, 400);
        }

        const officialReport = await db.approveHosxpRow(hosxpId, proposedBody, currentUser.id);
        return jsonResponse({ report: officialReport, message: 'Row approved and official error event created.' });
      }

      // 11. HOSxP Row Action: Reject
      const rejectMatch = pathname.match(/^\/api\/hosxp\/([^/]+)\/reject$/);
      if (rejectMatch && method === 'POST') {
        if (!['reviewer', 'admin'].includes(currentUser.role)) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }
        const hosxpId = rejectMatch[1];
        const { reason } = await request.json();
        if (!reason || !String(reason).trim()) {
          return jsonResponse({ error: 'Mandatory reject reason is required' }, 400);
        }
        const updated = await db.rejectHosxpRow(hosxpId, reason, currentUser.id);
        return jsonResponse({ row: updated, message: 'Row rejected.' });
      }

      // 12. HOSxP Row Action: Restore
      const restoreMatch = pathname.match(/^\/api\/hosxp\/([^/]+)\/restore$/);
      if (restoreMatch && method === 'POST') {
        if (!['reviewer', 'admin'].includes(currentUser.role)) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }
        const hosxpId = restoreMatch[1];
        const updated = await db.restoreHosxpRow(hosxpId, currentUser.id);
        return jsonResponse({ row: updated, message: 'Row restored to review status.' });
      }

      // 13. Audit logs
      if (pathname === '/api/audit-logs' && method === 'GET') {
        const logs = await db.listAuditLogs(100);
        return jsonResponse({ logs });
      }

      // 14. Analytics summary
      if (pathname === '/api/analytics' && method === 'GET') {
        const allReports = await db.listReports(currentUser, { limit: 500 });
        const byProcess = {};
        const bySeverity = {};
        const byStatus = { pending: 0, verified: 0, returned: 0 };

        allReports.forEach(r => {
          byProcess[r.process] = (byProcess[r.process] || 0) + 1;
          bySeverity[r.ncc_merp] = (bySeverity[r.ncc_merp] || 0) + 1;
          if (byStatus[r.status] !== undefined) byStatus[r.status]++;
        });

        return jsonResponse({
          total: allReports.length,
          byProcess,
          bySeverity,
          byStatus
        });
      }

      return jsonResponse({ error: 'Endpoint not found' }, 404);

    } catch (err) {
      console.error('Worker API error:', err);
      return jsonResponse({ error: 'Internal Server Error', message: err.message }, 500);
    }
  }
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders()
    }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id'
  };
}
