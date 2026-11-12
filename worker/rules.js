/**
 * Medication Error Reporting System (v0.4 Simple Edition)
 * Backend Business Logic & RBAC Rules
 */

/**
 * Checks if a user is permitted to view a given medication error report.
 */
export function canViewReport(user, report) {
  if (!user || !report) return false;

  // 1. Admin: full visibility
  if (user.role === 'admin') return true;

  // 2. Reviewer: can view ALL reports across all departments
  if (user.role === 'reviewer') return true;

  // 3. Department Head: can view reports ONLY within their own department
  if (user.role === 'dept_head') {
    return (
      report.origin_department_id === user.department_id ||
      report.detection_department_id === user.department_id ||
      report.creator_department_id === user.department_id
    );
  }

  // 4. Reporter: can view ONLY their own reports
  if (user.role === 'reporter') {
    return report.created_by === user.id;
  }

  return false;
}

/**
 * Checks if a user is permitted to edit / update a report's fields.
 */
export function canEditReport(user, report) {
  if (!user || !report) return false;

  // 1. Admin: full editing rights
  if (user.role === 'admin') return true;

  // 2. Reviewer: can edit ANY report at ANY time (even when verified), keeping an audit trail
  if (user.role === 'reviewer') return true;

  // 3. Department Head: only within their own department, and only while pending
  if (user.role === 'dept_head') {
    const isOwnDept = (
      report.origin_department_id === user.department_id ||
      report.detection_department_id === user.department_id ||
      report.creator_department_id === user.department_id
    );
    return isOwnDept && report.status === 'pending';
  }

  // 4. Reporter: only their own reports while in pending status
  if (user.role === 'reporter') {
    return report.created_by === user.id && report.status === 'pending';
  }

  return false;
}

/**
 * Validates and executes a report status transition.
 * Transitions supported:
 * - 'verify': pending -> verified
 * - 'reopen': verified -> pending
 */
export function validateTransition(user, report, action, comment) {
  if (!user || !report || !action) {
    return { allowed: false, error: 'User, report, and action are required.' };
  }

  const currentStatus = report.status;
  const isCreator = report.created_by === user.id;

  switch (action) {
    case 'verify': {
      if (currentStatus !== 'pending') {
        return { allowed: false, error: `Cannot verify report in '${currentStatus}' status. Must be 'pending'.` };
      }

      // Self-verification restriction: Reviewers and Dept Heads CANNOT self-verify
      if (isCreator && user.role !== 'admin') {
        return {
          allowed: false,
          error: 'Self-verification forbidden: Reports you created or imported must be verified by another Reviewer, Department Head, or Admin.'
        };
      }

      // Department check for Dept Head
      if (user.role === 'dept_head') {
        const isOwnDept = (
          report.origin_department_id === user.department_id ||
          report.detection_department_id === user.department_id ||
          report.creator_department_id === user.department_id
        );
        if (!isOwnDept) {
          return { allowed: false, error: 'Department Heads can only verify reports belonging to their department.' };
        }
        return { allowed: true, newStatus: 'verified' };
      }

      if (['reviewer', 'admin'].includes(user.role)) {
        return { allowed: true, newStatus: 'verified' };
      }

      return { allowed: false, error: 'You do not have permission to verify reports.' };
    }

    default:
      return { allowed: false, error: `Action '${action}' is not supported. Reports once verified are permanent.` };
  }
}

/**
 * Computes audit diff between original record and updated fields.
 */
export function computeFieldDiff(oldRecord, patchData) {
  const changes = {};
  for (const [key, newVal] of Object.entries(patchData)) {
    if (Object.prototype.hasOwnProperty.call(oldRecord, key)) {
      const oldVal = oldRecord[key];
      if (oldVal !== newVal) {
        changes[key] = { from: oldVal, to: newVal };
      }
    }
  }
  return changes;
}
