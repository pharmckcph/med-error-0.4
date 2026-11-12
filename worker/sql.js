/**
 * Medication Error Reporting System (v0.4 Simple Edition)
 * Cloudflare D1 Prepared Statement Queries & Transactions
 */

import { DEPARTMENTS, MOCK_USERS, ME_SUBTYPES, NCC_MERP_LEVELS, PROCESS_OPTIONS } from '../shared/form.js';

export class DatabaseService {
  constructor(d1) {
    this.d1 = d1;
  }

  /**
   * Run schema migrations and seed master data if empty
   */
  async seedMasterData() {
    // Check if departments exist
    const { results } = await this.d1.prepare('SELECT COUNT(*) as count FROM departments').all();
    if (results && results[0] && results[0].count > 0) {
      return; // Already seeded
    }

    // Seed departments
    const deptStmt = this.d1.prepare(
      'INSERT OR IGNORE INTO departments (id, code, name, active) VALUES (?, ?, ?, 1)'
    );
    const deptBatch = DEPARTMENTS.map(d => deptStmt.bind(d.id, d.code, d.name));
    if (deptBatch.length) await this.d1.batch(deptBatch);

    // Seed users
    const userStmt = this.d1.prepare(
      'INSERT OR IGNORE INTO users (id, display_name, role, department_id, position, email, active) VALUES (?, ?, ?, ?, ?, ?, 1)'
    );
    const userBatch = MOCK_USERS.map(u => userStmt.bind(u.id, u.display_name, u.role, u.department_id, u.position || '', u.email || ''));
    if (userBatch.length) await this.d1.batch(userBatch);

    // Seed master_options
    const optStmt = this.d1.prepare(
      'INSERT OR IGNORE INTO master_options (category, code, label, parent_code, sort_order, active) VALUES (?, ?, ?, ?, ?, 1)'
    );
    const optBatch = [];
    PROCESS_OPTIONS.forEach((p, idx) => {
      optBatch.push(optStmt.bind('process', p.code, p.label, null, idx));
    });
    NCC_MERP_LEVELS.forEach((n, idx) => {
      optBatch.push(optStmt.bind('ncc_merp', n.code, n.label, null, idx));
    });
    ME_SUBTYPES.forEach((m, idx) => {
      optBatch.push(optStmt.bind('me_subtype', m.code, m.label, m.process, idx));
    });

    if (optBatch.length) {
      // Chunk batches to avoid D1 limits
      const chunkSize = 50;
      for (let i = 0; i < optBatch.length; i += chunkSize) {
        await this.d1.batch(optBatch.slice(i, i + chunkSize));
      }
    }
  }

  async getDepartments() {
    const { results } = await this.d1.prepare('SELECT * FROM departments WHERE active = 1 ORDER BY name ASC').all();
    return results || [];
  }

  async getUsers() {
    const { results } = await this.d1.prepare(
      `SELECT u.*, d.name as department_name, d.code as department_code 
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       WHERE u.active = 1 
       ORDER BY u.role, u.display_name ASC`
    ).all();
    return results || [];
  }

  async getUserById(id) {
    return await this.d1.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
  }

  async listReports(filterUser, params = {}) {
    let sql = `
      SELECT 
        e.*,
        od.name as origin_department_name,
        dd.name as detection_department_name,
        cu.display_name as creator_name,
        cu.role as creator_role,
        vu.display_name as verifier_name
      FROM error_events e
      LEFT JOIN departments od ON e.origin_department_id = od.id
      LEFT JOIN departments dd ON e.detection_department_id = dd.id
      LEFT JOIN users cu ON e.created_by = cu.id
      LEFT JOIN users vu ON e.verified_by = vu.id
      WHERE 1=1
    `;
    const bindings = [];

    // RBAC Filter
    if (filterUser) {
      if (filterUser.role === 'reporter') {
        sql += ' AND e.created_by = ?';
        bindings.push(filterUser.id);
      } else if (filterUser.role === 'dept_head') {
        sql += ' AND (e.origin_department_id = ? OR e.detection_department_id = ? OR cu.department_id = ?)';
        bindings.push(filterUser.department_id, filterUser.department_id, filterUser.department_id);
      }
      // Reviewer & Admin can view all
    }

    if (params.status) {
      sql += ' AND e.status = ?';
      bindings.push(params.status);
    }
    if (params.process) {
      sql += ' AND e.process = ?';
      bindings.push(params.process);
    }
    if (params.ncc_merp) {
      sql += ' AND e.ncc_merp = ?';
      bindings.push(params.ncc_merp);
    }
    if (params.search) {
      sql += ' AND (e.report_no LIKE ? OR e.hn LIKE ? OR e.intended_drug LIKE ? OR e.error_drug LIKE ? OR e.problem_description LIKE ?)';
      const term = `%${params.search}%`;
      bindings.push(term, term, term, term, term);
    }

    sql += ' ORDER BY e.created_at DESC LIMIT ? OFFSET ?';
    bindings.push(Number(params.limit) || 100, Number(params.offset) || 0);

    const stmt = this.d1.prepare(sql);
    const { results } = await stmt.bind(...bindings).all();
    return results || [];
  }

  async getReportById(id) {
    const sql = `
      SELECT 
        e.*,
        od.name as origin_department_name,
        dd.name as detection_department_name,
        cu.display_name as creator_name,
        cu.department_id as creator_department_id,
        vu.display_name as verifier_name
      FROM error_events e
      LEFT JOIN departments od ON e.origin_department_id = od.id
      LEFT JOIN departments dd ON e.detection_department_id = dd.id
      LEFT JOIN users cu ON e.created_by = cu.id
      LEFT JOIN users vu ON e.verified_by = vu.id
      WHERE e.id = ?
    `;
    return await this.d1.prepare(sql).bind(id).first();
  }

  async getReportStatusHistory(eventId) {
    const sql = `
      SELECT h.*, u.display_name as actor_name, u.role as actor_role
      FROM status_history h
      LEFT JOIN users u ON h.actor_id = u.id
      WHERE h.event_id = ?
      ORDER BY h.created_at ASC
    `;
    const { results } = await this.d1.prepare(sql).bind(eventId).all();
    return results || [];
  }

  async createReport(report, actorId) {
    const id = report.id || `me-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const reportNo = report.report_no || `ME-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    const now = new Date().toISOString();

    const insertSql = `
      INSERT INTO error_events (
        id, report_no, patient_type, hn, incident_date, intended_drug, error_drug,
        problem_description, corrective_action, ncc_merp, rm_grade, preventability,
        origin_department_id, error_staff_reference, consult_recipient_reference,
        detection_department_id, reporter_reference, reported_date, incident_time,
        process, me_subtype, cause, recorded_by_reference, work_day_type, incident_interval,
        status, ever_verified, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?, ?)
    `;

    const stmt = this.d1.prepare(insertSql).bind(
      id,
      reportNo,
      report.patient_type,
      report.hn || null,
      report.incident_date,
      report.intended_drug || null,
      report.error_drug || null,
      report.problem_description,
      report.corrective_action || null,
      report.ncc_merp,
      report.rm_grade,
      report.preventability || null,
      report.origin_department_id,
      report.error_staff_reference || null,
      report.consult_recipient_reference || null,
      report.detection_department_id,
      report.reporter_reference || null,
      report.reported_date,
      report.incident_time || '08:30',
      report.process,
      report.me_subtype,
      report.cause || null,
      report.recorded_by_reference || null,
      report.work_day_type || null,
      report.incident_interval || null,
      actorId,
      now,
      now
    );

    const historyStmt = this.d1.prepare(
      `INSERT INTO status_history (id, event_id, action, from_status, to_status, comment, actor_id, created_at)
       VALUES (?, ?, 'create', NULL, 'pending', 'Initial report submitted', ?, ?)`
    ).bind(`sh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, id, actorId, now);

    const auditStmt = this.d1.prepare(
      `INSERT INTO audit_log (id, entity, entity_id, action, changes, actor_id, created_at)
       VALUES (?, 'error_events', ?, 'create', ?, ?, ?)`
    ).bind(`al-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, id, JSON.stringify(report), actorId, now);

    await this.d1.batch([stmt, historyStmt, auditStmt]);
    return await this.getReportById(id);
  }

  async patchReport(id, patchFields, actorId, oldRecord) {
    const allowedKeys = [
      'patient_type', 'hn', 'incident_date', 'intended_drug', 'error_drug',
      'problem_description', 'corrective_action', 'ncc_merp', 'rm_grade', 'preventability',
      'origin_department_id', 'error_staff_reference', 'consult_recipient_reference',
      'detection_department_id', 'reporter_reference', 'reported_date', 'incident_time',
      'process', 'me_subtype', 'cause', 'recorded_by_reference'
    ];

    const setClauses = [];
    const bindings = [];
    const changes = {};

    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(patchFields, key)) {
        const val = patchFields[key];
        setClauses.push(`${key} = ?`);
        bindings.push(val !== undefined ? val : null);
        if (oldRecord[key] !== val) {
          changes[key] = { from: oldRecord[key], to: val };
        }
      }
    }

    if (setClauses.length === 0) return oldRecord;

    const now = new Date().toISOString();
    setClauses.push('updated_at = ?');
    bindings.push(now);
    bindings.push(id);

    const updateSql = `UPDATE error_events SET ${setClauses.join(', ')} WHERE id = ?`;
    const updateStmt = this.d1.prepare(updateSql).bind(...bindings);

    const auditStmt = this.d1.prepare(
      `INSERT INTO audit_log (id, entity, entity_id, action, changes, actor_id, created_at)
       VALUES (?, 'error_events', ?, 'update', ?, ?, ?)`
    ).bind(`al-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, id, JSON.stringify(changes), actorId, now);

    await this.d1.batch([updateStmt, auditStmt]);
    return await this.getReportById(id);
  }

  async transitionReport(id, action, fromStatus, toStatus, comment, actorId) {
    const now = new Date().toISOString();
    const batch = [];

    let updateSql = 'UPDATE error_events SET status = ?, updated_at = ?';
    const bindings = [toStatus, now];

    if (action === 'verify') {
      updateSql += ', ever_verified = 1, verified_by = ?, verified_at = ?';
      bindings.push(actorId, now);
    }
    updateSql += ' WHERE id = ?';
    bindings.push(id);

    batch.push(this.d1.prepare(updateSql).bind(...bindings));

    const historySql = `
      INSERT INTO status_history (id, event_id, action, from_status, to_status, comment, actor_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    batch.push(
      this.d1.prepare(historySql).bind(
        `sh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        id,
        action,
        fromStatus,
        toStatus,
        comment || null,
        actorId,
        now
      )
    );

    const auditSql = `
      INSERT INTO audit_log (id, entity, entity_id, action, changes, actor_id, created_at)
      VALUES (?, 'error_events', ?, ?, ?, ?, ?)
    `;
    batch.push(
      this.d1.prepare(auditSql).bind(
        `al-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        id,
        action,
        JSON.stringify({ fromStatus, toStatus, comment }),
        actorId,
        now
      )
    );

    await this.d1.batch(batch);
    return await this.getReportById(id);
  }

  // --- HOSxP Staging Queue Queries ---
  async getExistingSourceKeys(keys) {
    if (!keys || keys.length === 0) return new Set();
    const placeholders = keys.map(() => '?').join(',');
    const sql = `SELECT source_key FROM hosxp_rows WHERE source_key IN (${placeholders})`;
    const { results } = await this.d1.prepare(sql).bind(...keys).all();
    return new Set((results || []).map(r => r.source_key));
  }

  async insertHosxpRows(rows) {
    if (!rows || rows.length === 0) return;
    const stmt = this.d1.prepare(`
      INSERT INTO hosxp_rows (
        id, source_key, filename, row_no, raw, proposed, notes, status,
        event_id, reject_reason, reviewed_by, reviewed_at, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const batch = rows.map(r => stmt.bind(
      r.id, r.source_key, r.filename, r.row_no, r.raw, r.proposed, r.notes,
      r.status, r.event_id, r.reject_reason, r.reviewed_by, r.reviewed_at, r.created_by, r.created_at
    ));

    const chunkSize = 25;
    for (let i = 0; i < batch.length; i += chunkSize) {
      await this.d1.batch(batch.slice(i, i + chunkSize));
    }
  }

  async listHosxpQueue(status = 'review') {
    let sql = `
      SELECT h.*, u.display_name as creator_name, r.display_name as reviewer_name
      FROM hosxp_rows h
      LEFT JOIN users u ON h.created_by = u.id
      LEFT JOIN users r ON h.reviewed_by = r.id
    `;
    const bindings = [];
    if (status && status !== 'all') {
      sql += ' WHERE h.status = ?';
      bindings.push(status);
    }
    sql += ' ORDER BY h.created_at DESC, h.row_no ASC LIMIT 150';
    const { results } = await this.d1.prepare(sql).bind(...bindings).all();
    return (results || []).map(r => ({
      ...r,
      raw: JSON.parse(r.raw || '{}'),
      proposed: JSON.parse(r.proposed || '{}'),
      notes: JSON.parse(r.notes || '[]')
    }));
  }

  async getHosxpRowById(id) {
    const row = await this.d1.prepare('SELECT * FROM hosxp_rows WHERE id = ?').bind(id).first();
    if (!row) return null;
    return {
      ...row,
      raw: JSON.parse(row.raw || '{}'),
      proposed: JSON.parse(row.proposed || '{}'),
      notes: JSON.parse(row.notes || '[]')
    };
  }

  async approveHosxpRow(hosxpId, validReportData, reviewerId) {
    const now = new Date().toISOString();
    // 1. Create error_events record
    const createdReport = await this.createReport(validReportData, reviewerId);

    // 2. Update hosxp_rows status to 'imported' and link event_id
    const updateStmt = this.d1.prepare(`
      UPDATE hosxp_rows 
      SET status = 'imported', event_id = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).bind(createdReport.id, reviewerId, now, hosxpId);

    await updateStmt.run();
    return createdReport;
  }

  async rejectHosxpRow(hosxpId, reason, reviewerId) {
    const now = new Date().toISOString();
    const stmt = this.d1.prepare(`
      UPDATE hosxp_rows 
      SET status = 'rejected', reject_reason = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).bind(reason, reviewerId, now, hosxpId);
    await stmt.run();
    return await this.getHosxpRowById(hosxpId);
  }

  async restoreHosxpRow(hosxpId, reviewerId) {
    const now = new Date().toISOString();
    const stmt = this.d1.prepare(`
      UPDATE hosxp_rows 
      SET status = 'review', reject_reason = NULL, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).bind(reviewerId, now, hosxpId);
    await stmt.run();
    return await this.getHosxpRowById(hosxpId);
  }

  async listAuditLogs(limit = 100) {
    const sql = `
      SELECT a.*, u.display_name as actor_name, u.role as actor_role
      FROM audit_log a
      LEFT JOIN users u ON a.actor_id = u.id
      ORDER BY a.created_at DESC LIMIT ?
    `;
    const { results } = await this.d1.prepare(sql).bind(limit).all();
    return results || [];
  }
}
