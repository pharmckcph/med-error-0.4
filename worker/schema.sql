-- ========================================================
-- Medication Error Reporting System (v0.4 Simple Edition)
-- Cloudflare D1 (SQLite) Migration Schema
-- ========================================================

-- 1. Departments table
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Users table (Hospital staff with RBAC roles)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('reporter', 'reviewer', 'dept_head', 'admin')),
    department_id TEXT NOT NULL,
    position TEXT,
    email TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(department_id) REFERENCES departments(id)
);

-- 3. Master options (Dropdowns, standard categories, 125 ME subtypes)
CREATE TABLE IF NOT EXISTS master_options (
    category TEXT NOT NULL,
    code TEXT NOT NULL,
    label TEXT NOT NULL,
    parent_code TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY(category, code)
);

-- 4. Medication Error Events (20 Numbered Hospital Form Fields + system audit metadata)
CREATE TABLE IF NOT EXISTS error_events (
    id TEXT PRIMARY KEY,
    report_no TEXT NOT NULL UNIQUE,
    
    -- Field 1: Patient Type (OPD, IPD) [Required]
    patient_type TEXT NOT NULL CHECK(patient_type IN ('OPD', 'IPD')),
    
    -- Field 2: Hospital Number (HN, Max 20 chars)
    hn TEXT,
    
    -- Field 3: Incident Date (YYYY-MM-DD, cannot be future or after reported_date) [Required]
    incident_date TEXT NOT NULL,
    
    -- Field 4: Intended Drug
    intended_drug TEXT,
    
    -- Field 5: Error Drug
    error_drug TEXT,
    
    -- Field 6: Problem Description [Required]
    problem_description TEXT NOT NULL,
    
    -- Field 7: Corrective Action
    corrective_action TEXT,
    
    -- Field 8: NCC MERP Severity Category (A through I) [Required]
    ncc_merp TEXT NOT NULL CHECK(ncc_merp IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I')),
    
    -- Computed Risk Management Grade (1 to 5)
    rm_grade INTEGER NOT NULL CHECK(rm_grade BETWEEN 1 AND 5),
    
    -- Field 9: Preventability (Anticipated severity if not prevented: C through I, >= ncc_merp)
    preventability TEXT CHECK(preventability IN ('C', 'D', 'E', 'F', 'G', 'H', 'I')),
    
    -- Field 10: Origin Department ID [Required]
    origin_department_id TEXT NOT NULL,
    
    -- Field 11: Error Staff Reference (filtered by origin_department_id)
    error_staff_reference TEXT,
    
    -- Field 12: Consult Recipient Reference (Specialists / Doctors)
    consult_recipient_reference TEXT,
    
    -- Field 13: Detection Department ID [Required]
    detection_department_id TEXT NOT NULL,
    
    -- Field 14: Reporter Reference (filtered by detection_department_id)
    reporter_reference TEXT,
    
    -- Field 15: Reported Date (YYYY-MM-DD, cannot be future) [Required]
    reported_date TEXT NOT NULL,
    
    -- Field 16: Incident Time (HH:MM)
    incident_time TEXT,
    
    -- Field 17: Process (PRE, TRA, PDI, DIS, ADM, PRO) [Required]
    process TEXT NOT NULL CHECK(process IN ('PRE', 'TRA', 'PDI', 'DIS', 'ADM', 'PRO')),
    
    -- Field 18: ME Subtype (Standardized items filtered by process) [Required]
    me_subtype TEXT NOT NULL,
    
    -- Field 19: Root Cause
    cause TEXT,
    
    -- Field 20: Recorded by Reference
    recorded_by_reference TEXT,

    -- Risk Management & Root Cause Analysis (RCA) - Mandatory for E-up Sentinel Harm (Cat E-I)
    rca_status TEXT NOT NULL DEFAULT 'none' CHECK(rca_status IN ('none', 'pending', 'in_progress', 'completed')),
    rca_team TEXT,
    rca_root_cause_type TEXT,
    rca_fishbone TEXT, -- JSON payload of 5M factors (man, machine, method, material, environment)
    rca_summary TEXT,
    rca_action_plan TEXT,
    rca_responsible TEXT,
    rca_due_date TEXT,
    rca_completed_at TEXT,
    rca_completed_by TEXT,

    -- Legacy fields preserved for backward schema compatibility (read-only)
    work_day_type TEXT,
    incident_interval TEXT,
    
    -- Lifecycle & Verification (Removed 'returned' status)
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'verified')),
    ever_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    verified_at TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY(origin_department_id) REFERENCES departments(id),
    FOREIGN KEY(detection_department_id) REFERENCES departments(id),
    FOREIGN KEY(created_by) REFERENCES users(id),
    FOREIGN KEY(verified_by) REFERENCES users(id),
    FOREIGN KEY(rca_completed_by) REFERENCES users(id)
);

-- 4b. High-Volume Process RCA & Systemic CAPA Plans
CREATE TABLE IF NOT EXISTS process_rca_plans (
    id TEXT PRIMARY KEY,
    process_code TEXT NOT NULL CHECK(process_code IN ('PRE', 'TRA', 'PDI', 'DIS', 'ADM', 'PRO')),
    analysis_title TEXT NOT NULL,
    top_subtypes TEXT, -- JSON array of top contributing subtype codes
    root_cause_summary TEXT NOT NULL,
    action_plan TEXT NOT NULL,
    target_reduction_pct INTEGER DEFAULT 50,
    responsible_team TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('planned', 'in_progress', 'completed', 'active')),
    target_date TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(created_by) REFERENCES users(id)
);

-- 5. Status transition history (Audit trail for verify and reopen)
CREATE TABLE IF NOT EXISTS status_history (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('create', 'verify', 'reopen', 'update')),
    from_status TEXT,
    to_status TEXT,
    comment TEXT,
    actor_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(event_id) REFERENCES error_events(id) ON DELETE CASCADE,
    FOREIGN KEY(actor_id) REFERENCES users(id)
);

-- 6. Audit log for record changes
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    changes TEXT, -- JSON payload of before & after or patched diff
    actor_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(actor_id) REFERENCES users(id)
);

-- 7. HOSxP Smart Import Staging Queue
CREATE TABLE IF NOT EXISTS hosxp_rows (
    id TEXT PRIMARY KEY,
    source_key TEXT NOT NULL UNIQUE, -- SHA-256 hash of (datetime + hn + drug + step)
    filename TEXT NOT NULL,
    row_no INTEGER NOT NULL,
    raw TEXT NOT NULL, -- JSON string of PII-stripped raw row
    proposed TEXT NOT NULL, -- JSON string of mapped 20 fields
    notes TEXT, -- JSON string of parser warnings / suggested mappings
    status TEXT NOT NULL DEFAULT 'review' CHECK(status IN ('review', 'imported', 'rejected')),
    event_id TEXT, -- Associated error_events ID once approved
    reject_reason TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(event_id) REFERENCES error_events(id),
    FOREIGN KEY(reviewed_by) REFERENCES users(id),
    FOREIGN KEY(created_by) REFERENCES users(id)
);

-- Indices for rapid queries & filtering
CREATE INDEX IF NOT EXISTS idx_error_events_status ON error_events(status);
CREATE INDEX IF NOT EXISTS idx_error_events_origin ON error_events(origin_department_id);
CREATE INDEX IF NOT EXISTS idx_error_events_detection ON error_events(detection_department_id);
CREATE INDEX IF NOT EXISTS idx_error_events_created_by ON error_events(created_by);
CREATE INDEX IF NOT EXISTS idx_error_events_incident_date ON error_events(incident_date);
CREATE INDEX IF NOT EXISTS idx_status_history_event_id ON status_history(event_id);
CREATE INDEX IF NOT EXISTS idx_hosxp_source_key ON hosxp_rows(source_key);
CREATE INDEX IF NOT EXISTS idx_hosxp_status ON hosxp_rows(status);
