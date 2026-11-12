import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  History,
  Pill,
  Shield,
  ShieldAlert,
  Trash2,
  User,
  X,
  Check
} from 'lucide-react';
import { computeRmGrade, NCC_MERP_LEVELS, PROCESS_OPTIONS, stripTitlePrefix, cleanSubtypeLabel, getFullSubtypeLabel } from '../../shared/form.js';
import { store } from '../services/store';

interface ReportDetailModalProps {
  report: any;
  onClose: () => void;
  onEdit: (report: any) => void;
  onReportDeleted?: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report: initialReport,
  onClose,
  onEdit,
  onReportDeleted
}) => {
  const currentUser = store.getCurrentUser();
  const [currentReport, setCurrentReport] = useState<any>(initialReport);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const history = store.getStatusHistory(currentReport.id);
  const isCreator = currentReport.created_by === currentUser.id;

  const canEdit = (
    currentUser.role === 'admin' ||
    currentUser.role === 'reviewer' ||
    (currentReport.status === 'pending' && (isCreator || currentUser.role === 'dept_head'))
  );

  const canVerify = (
    currentReport.status === 'pending' &&
    (currentUser.role === 'reviewer' || currentUser.role === 'admin' || currentUser.role === 'dept_head')
  );

  const handleVerify = () => {
    if (isCreator && currentUser.role !== 'admin') {
      alert(
        'ห้ามยืนยันรายงานที่ตนเองเป็นผู้สร้าง\n' +
        'รายงานนี้จะต้องได้รับการตรวจสอบและยืนยันโดย Reviewer ท่านอื่น, หัวหน้าแผนก หรือ Admin เท่านั้น'
      );
      return;
    }

    if (currentUser.role === 'dept_head') {
      const isOwn = (
        currentReport.origin_department_id === currentUser.department_id ||
        currentReport.detection_department_id === currentUser.department_id
      );
      if (!isOwn) {
        alert('หัวหน้าแผนกสามารถตรวจสอบยืนยันได้เฉพาะรายงานในสังกัดแผนกของตนเองเท่านั้น');
        return;
      }
    }

    try {
      const updated = store.transitionReport(currentReport.id, 'verify');
      setCurrentReport(updated);
      alert('ยืนยันรายงานเรียบร้อยแล้ว');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = () => {
    if (currentUser.role !== 'admin') {
      alert('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่มีสิทธิ์ลบรายงาน');
      return;
    }

    if (!deleteReason.trim()) {
      alert('กรุณาระบุเหตุผลในการลบรายงาน เพื่อบันทึกประวัติลงระบบ LOG');
      return;
    }

    try {
      store.deleteReport(currentReport.id, deleteReason.trim());
      alert('ลบรายงานเรียบร้อยแล้ว พร้อมบันทึกประวัติลงระบบ LOG');
      if (onReportDeleted) {
        onReportDeleted();
      } else {
        onClose();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* ส่วนหัวหน้าต่าง */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
              ME
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold font-mono tracking-tight">{currentReport.report_no}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentReport.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {currentReport.status === 'verified' ? 'ยืนยันแล้ว' : 'รอตรวจสอบ'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                รายงานเมื่อ {currentReport.reported_date} • สร้างโดย {currentReport.creator_name} ({currentReport.creator_role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canVerify && (
              <button
                onClick={handleVerify}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ยืนยันรายงาน</span>
              </button>
            )}

            {canEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(currentReport);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>แก้ไขรายงาน</span>
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบรายงาน</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Form Detailed View Organized into 4 Groups */}
          <div className="space-y-6">
            {/* ข้อมูลผู้ป่วยและวันเวลา */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1.5 border-b border-indigo-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                </span>
                <span>ข้อมูลผู้ป่วยและวันเวลา</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">1. Patient Type</span>
                  <span className="font-bold text-slate-900">
                    {currentReport.patient_type === 'IPD'
                      ? 'IPD'
                      : currentReport.patient_type === 'TELEMED'
                      ? 'TELEMED'
                      : 'OPD'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">2. HN</span>
                  <span className="font-bold text-slate-900 font-mono">{currentReport.hn || '-'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">3. วันที่เกิดเหตุ (Incident Date)</span>
                  <span className="font-semibold text-slate-900">{currentReport.incident_date}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">4. เวลาเกิดเหตุ (Incident Time)</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {currentReport.incident_time ? `${currentReport.incident_time} น.` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* รายละเอียดเหตุการณ์และการแก้ไข */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1.5 border-b border-indigo-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Pill className="w-3.5 h-3.5 text-indigo-600" />
                </span>
                <span>รายละเอียดเหตุการณ์และการแก้ไข</span>
              </h3>

              {/* Drugs Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200">
                  <span className="text-[11px] text-rose-800 block font-bold mb-1">
                    5. ยาที่เกิดเหตุคลาดเคลื่อน (Error Drug)
                  </span>
                  <div className="flex items-center">
                    <span className="font-bold text-rose-950 text-sm flex items-center">
                      <X className="w-4 h-4 text-rose-500 mr-1.5 shrink-0" strokeWidth={3} />
                      {currentReport.error_drug
                        ? (currentReport.error_drug_strength && !currentReport.error_drug.includes(currentReport.error_drug_strength)
                            ? `${currentReport.error_drug} - ${currentReport.error_drug_strength}`
                            : currentReport.error_drug)
                        : '-'}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 block font-bold mb-1">
                    6. ยาที่ต้องการ (Intended Drug)
                  </span>
                  <div className="flex items-center">
                    <span className="font-bold text-emerald-900 text-sm flex items-center">
                      <Check className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" strokeWidth={3} />
                      {currentReport.intended_drug
                        ? (currentReport.intended_drug_strength && !currentReport.intended_drug.includes(currentReport.intended_drug_strength)
                            ? `${currentReport.intended_drug} - ${currentReport.intended_drug_strength}`
                            : currentReport.intended_drug)
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ME Type & Subtype */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    7. ขั้นตอนที่เกิดความคลาดเคลื่อน ( ME Type)
                  </span>
                  <span className="font-bold text-indigo-700">
                    {(() => {
                      const p = PROCESS_OPTIONS.find(opt => opt.code === currentReport.process);
                      return p ? `${p.code} - ${p.thai} (${p.english})` : (currentReport.process || '-');
                    })()}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    8. ชนิดความคลาดเคลื่อน
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {getFullSubtypeLabel(currentReport.me_subtype)}
                  </span>
                </div>
              </div>

              {/* Text Descriptions */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-600 block font-bold mb-1">
                    9. ลักษณะเหตุการณ์ที่เกิดขึ้น
                  </span>
                  <p className="text-slate-900 whitespace-pre-wrap font-medium">
                    {currentReport.problem_description || '-'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-600 block font-bold mb-1">
                    10. การแก้ไขเบื้องต้น
                  </span>
                  <p className="text-slate-900 whitespace-pre-wrap font-medium">
                    {currentReport.corrective_action || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* การประเมินระดับความเสี่ยง */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1.5 border-b border-indigo-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                </span>
                <span>การประเมินระดับความเสี่ยง</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    11. ระดับความเสี่ยง NCC-MERP Severity
                  </span>
                  <span className="font-black text-slate-900 font-mono text-base">
                    ระดับ {currentReport.ncc_merp}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                    (RM Grade {currentReport.rm_grade})
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    12. ระดับความเสี่ยงที่ป้องกันได้ (Preventability)
                  </span>
                  <span className="font-black text-slate-900 font-mono text-base">
                    ระดับ {currentReport.preventability || '-'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    13. วิเคราะห์สาเหตุเบื้องต้น
                  </span>
                  <span className="font-bold text-indigo-700 text-sm">
                    {currentReport.cause_category || currentReport.cause || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* หน่วยงานและบุคลากรที่เกี่ยวข้อง */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1.5 border-b border-indigo-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                </span>
                <span>หน่วยงานและบุคลากรที่เกี่ยวข้อง</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    14. หน่วยงานที่เกิดความคลาดเคลื่อน
                  </span>
                  <span className="font-semibold text-slate-900">
                    {currentReport.origin_department_name}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    15. เจ้าหน้าที่ที่เกี่ยวข้อง
                  </span>
                  <span className="font-semibold text-slate-900">
                    {currentReport.error_staff_reference === 'ไม่ทราบเจ้าหน้าที่'
                      ? '⚠️ ไม่ทราบเจ้าหน้าที่'
                      : stripTitlePrefix(currentReport.error_staff_reference) || 'ไม่ทราบเจ้าหน้าที่'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    16. Specialist Staff
                  </span>
                  <span className="font-semibold text-slate-900">
                    {stripTitlePrefix(currentReport.consult_recipient_reference) || '-'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    17. หน่วยงานตรวจพบ
                  </span>
                  <span className="font-semibold text-slate-900">
                    {currentReport.detection_department_name}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    18. เจ้าหน้าที่ผู้ตรวจพบ
                  </span>
                  <span className="font-semibold text-slate-900">
                    {stripTitlePrefix(currentReport.reporter_reference) || '-'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    19. วันที่รายงาน
                  </span>
                  <span className="font-semibold text-slate-900">
                    {currentReport.reported_date}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 md:col-span-3">
                  <span className="text-[11px] text-slate-500 block font-semibold">
                    20. ผู้บันทึก
                  </span>
                  <span className="font-semibold text-slate-900">
                    {stripTitlePrefix(currentReport.recorded_by_reference) || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ประวัติสถานะรายงาน (LOG) */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <History className="w-4 h-4 text-indigo-600" />
              <span>ประวัติการเปลี่ยนสถานะและการตรวจสอบ (LOG)</span>
            </div>

            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={h.id || i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 capitalize">
                        {h.action === 'verify' ? 'ยืนยันรายงาน' : h.action === 'create' ? 'สร้างรายงาน' : h.action}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{new Date(h.created_at).toLocaleString('th-TH')}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      โดย: <span className="font-semibold text-slate-800">{h.actor_name}</span> ({h.actor_role})
                    </p>
                    {h.comment && (
                      <p className="mt-1 p-2 bg-white rounded border border-slate-200 text-slate-700 italic">
                        &quot;{h.comment}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>

      {/* Admin Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800">ยืนยันการลบรายงาน</h4>
              <p className="text-xs text-slate-500 mt-1">
                การลบรายงานจะถูกบันทึกประวัติและเหตุผลลงสู่ระบบ LOG โดยอัตโนมัติ
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เหตุผลในการลบรายงาน <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="ระบุเหตุผล เช่น ข้อมูลซ้ำซ้อน, กรอกข้อมูลทดสอบ หรือบันทึกผิดพลาด..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
