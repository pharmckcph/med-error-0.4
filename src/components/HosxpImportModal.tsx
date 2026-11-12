import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  COMMON_DRUGS,
  computeRmGrade,
  getValidPreventabilityOptions,
  HOSXP_EXPORT_SQL,
  NCC_MERP_LEVELS,
  PROCESS_OPTIONS,
  stripPiiClientSide,
  validateReport
} from '../../shared/form.js';
import { store } from '../services/store';

export const HosxpImportModal: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const currentUser = store.getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isReviewerOrAdmin = ['reviewer', 'admin'].includes(currentUser.role);

  // Queue state
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'queue' | 'sql'>('queue');
  const [copiedSql, setCopiedSql] = useState(false);
  const [queueFilter, setQueueFilter] = useState<'review' | 'imported' | 'rejected' | 'all'>('review');
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // Upload results & staging notification
  const [uploadFeedback, setUploadFeedback] = useState<{
    stagedCount: number;
    duplicateCount: number;
    duplicates: any[];
  } | null>(null);

  // Reject Reason Modal
  const [rejectModal, setRejectModal] = useState<{ open: boolean; rowId: string; reason: string; error?: string }>({
    open: false,
    rowId: '',
    reason: ''
  });

  // Edit / Approve Proposed Form inside Review Queue
  const [reviewFormData, setReviewFormData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const queue = isReviewerOrAdmin ? store.getHosxpQueue(queueFilter) : [];

  // Download Sample HOSxP File for instant testing (Matching exact hospital format)
  const handleDownloadSampleFile = () => {
    const sampleRows = [
      {
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
      },
      {
        'ลำดับ': 2,
        'วันที่/เวลา': '25/10/2026 13:55:59',
        'HN': '000217057',
        'ชื่อผู้ป่วย': 'ด.ช.ชนภัทร งามเริง',
        'ผู้สั่งยา': 'พญ.จิรสุดา คำภีระ',
        'แผนก': 'OPD',
        'ชื่อยา': 'Guaifenesine Syr. 60ml (ทA,น2)',
        'ขั้นตอนของความคลาดเคลื่อน': 'ความคลาดเคลื่อนก่อนการจ่ายยา ( Pre-dispensing error)',
        'ชนิดความคลาดเคลื่อน': 'จัดยาผิดชนิด',
        'ระดับความรุนแรง': 'Category B: มีความคลาดเคลื่อนเกิดขึ้นแต่ไม่เป็นอันตรายต่อผู้ป่วย เนื่องจากความคลาดเคลื่อนไปไม่ถึงผู้ป่วย',
        'หมายเหตุ': 'ธนาวัฒน์ จัด Guaifenesine syp เป็น Cetririzine',
        'เจ้าหน้าที่': 'นางทศพร เดชอัตตกุล'
      },
      {
        'ลำดับ': 3,
        'วันที่/เวลา': '25/10/2026 14:23:11',
        'HN': '000057367',
        'ชื่อผู้ป่วย': 'นางจันทร์ อินต๊ะวงค์',
        'ผู้สั่งยา': 'นพ.วีระพงศ์ ดวงมณี',
        'แผนก': 'OPD',
        'ชื่อยา': 'HCTZ (ลดความดันโลหิต) hydroCHLOROthiazide (ทBu1,C10)',
        'ขั้นตอนของความคลาดเคลื่อน': 'ความคลาดเคลื่อนในการสั่งใช้ยา (Prescribing error ):',
        'ชนิดความคลาดเคลื่อน': 'สั่งใช้ยาผิดชนิด',
        'ระดับความรุนแรง': 'Category B: มีความคลาดเคลื่อนเกิดขึ้นแต่ไม่เป็นอันตรายต่อผู้ป่วย เนื่องจากความคลาดเคลื่อนไปไม่ถึงผู้ป่วย',
        'หมายเหตุ': 'ปรับยาระว่าง visit NCD refill แพทย์ Rm ผิด visit ไม่ใช่ยาที่ปรับล่าสุด',
        'เจ้าหน้าที่': 'นายอนุภาพ ภูหลัก'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HOSxP_Export');
    XLSX.writeFile(wb, 'sample_hosxp_export.xlsx');
  };

  // Handle file selection and client-side parsing via SheetJS
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson = XLSX.utils.sheet_to_json(ws);

        if (!rawJson || rawJson.length === 0) {
          alert('ไฟล์ที่เลือกไม่มีข้อมูล (Empty spreadsheet)');
          return;
        }

        // Stage into Store
        const res = store.stageHosxpRows(file.name, rawJson);
        setUploadFeedback(res);
        setActiveSubTab('queue');
        setQueueFilter('review');
      } catch (err: any) {
        alert(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectRowToReview = (row: any) => {
    setSelectedRow(row);
    setReviewFormData({
      ...row.proposed,
      // Ensure origin department is initialized if missing
      origin_department_id: row.proposed.origin_department_id || 'dept-pharma',
      detection_department_id: row.proposed.detection_department_id || 'dept-pharma',
      reported_date: row.proposed.reported_date || new Date().toISOString().split('T')[0]
    });
    setValidationErrors({});
  };

  const handleApproveRow = () => {
    if (!selectedRow || !reviewFormData) return;

    try {
      const created = store.approveHosxpRow(selectedRow.id, reviewFormData);
      setSelectedRow(null);
      setReviewFormData(null);
      setValidationErrors({});
      alert(`อนุมัติและสร้างรายงานร่างสำเร็จ! เลขที่ ${created.report_no} (สถานะ Pending)\nระบบได้บันทึกข้อมูลตามช่องที่ระบุ และพร้อมให้ผู้รายงานตรวจสอบ/เพิ่มเติมข้อมูลในช่องอื่นได้`);
    } catch (e: any) {
      alert(e.message || 'เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleQuickApprove = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const created = store.approveHosxpRow(row.id, row.proposed);
      alert(`นำเข้าสำเร็จ! สร้างรายงานร่าง ${created.report_no} (สถานะ Pending) แล้ว`);
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการนำเข้า');
    }
  };

  const handleBulkApprove = () => {
    const pendingReviewItems = queue.filter(q => q.status === 'review');
    if (pendingReviewItems.length === 0) {
      alert('ไม่มีรายการที่รอการตรวจทานในคิว');
      return;
    }
    if (!window.confirm(`ต้องการอนุมัติรายการทั้งหมด ${pendingReviewItems.length} แถว เข้าสู่ระบบเป็นรายงานร่าง (Pending) หรือไม่?\nระบบจะจัดข้อมูลใส่ตามช่องที่กำหนดไว้ และให้ผู้รายงานตรวจสอบ/เติมข้อมูลเพิ่มเติมภายหลัง`)) {
      return;
    }

    try {
      const approved = store.bulkApproveHosxp(pendingReviewItems.map(q => q.id));
      alert(`สร้างรายงานร่างสำเร็จทั้งหมด ${approved.length} รายการ (สถานะ Pending) เรียบร้อยแล้ว!`);
      setSelectedRow(null);
      setReviewFormData(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExecuteReject = () => {
    if (!rejectModal.reason || !rejectModal.reason.trim()) {
      setRejectModal(prev => ({ ...prev, error: 'กรุณาระบุเหตุผลในการปฏิเสธ (Mandatory reject reason)' }));
      return;
    }

    try {
      store.rejectHosxpRow(rejectModal.rowId, rejectModal.reason);
      setRejectModal({ open: false, rowId: '', reason: '' });
      setSelectedRow(null);
    } catch (e: any) {
      setRejectModal(prev => ({ ...prev, error: e.message }));
    }
  };

  const handleRestore = (rowId: string) => {
    try {
      store.restoreHosxpRow(rowId);
      if (selectedRow?.id === rowId) {
        setSelectedRow(store.getHosxpQueue('all').find(h => h.id === rowId));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (!isReviewerOrAdmin) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            ระบบนำเข้า HOSxP สงวนสิทธิ์เฉพาะ Reviewer และ Admin
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            ตามนโยบายความปลอดภัยและข้อกำหนด RBAC เฉพาะผู้ตรวจสอบ (Reviewer) และผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเข้าถึงคิวตรวจสอบและอนุมัตินำเข้าข้อมูลจาก HOSxP
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">ผู้ใช้งานปัจจุบัน:</span>
            <span className="font-bold text-slate-900">{currentUser.display_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">บทบาทปัจจุบัน:</span>
            <span className="font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded">{currentUser.role}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              store.setCurrentUser('user-reviewer');
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <UserCheck className="w-4 h-4" />
            <span>สลับเป็นผู้ตรวจทาน (ภญ.กัญญา - Reviewer)</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              ย้อนกลับ
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-sm border border-blue-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                2-Stage Safe Staging
              </span>
              <h2 className="text-xl font-bold tracking-tight">HOSxP Smart Import & Review Queue</h2>
            </div>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              กระบวนการนำเข้า 2 ขั้นตอน: ถอดถอนข้อมูลส่วนบุคคล (Strip PII) และสร้าง SHA-256 Hash ตรวจสอบความซ้ำซ้อนในเบราว์เซอร์ ก่อนนำเข้าคิวให้ Reviewer ตรวจทานเคียงข้างข้อมูลดิบ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSampleFile}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/20 transition"
              title="ดาวน์โหลดไฟล์ตัวอย่าง HOSxP Excel เพื่อทดสอบการนำเข้าทันที"
            >
              <Download className="w-4 h-4 text-blue-300" />
              <span>ดาวน์โหลดไฟล์ตัวอย่าง (.xlsx)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>อัปโหลดไฟล์ HOSxP (.xlsx, .csv)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'queue'
                ? 'bg-white text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            คิวตรวจสอบ (Human Review Queue: {queue.length})
          </button>
          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'upload'
                ? 'bg-white text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            วิธีการทำงาน & นโยบายความปลอดภัย PII
          </button>
          <button
            onClick={() => setActiveSubTab('sql')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'sql'
                ? 'bg-white text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            📋 SQL Query สำหรับ HOSxP
          </button>
        </div>
      </div>

      {/* Upload Feedback Toast */}
      {uploadFeedback && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-blue-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">
                นำเข้าข้อมูลสู่คิวตรวจสอบสำเร็จ {uploadFeedback.stagedCount} รายการ!
              </p>
              <p className="text-xs text-blue-700">
                ตรวจพบและข้ามข้อมูลซ้ำ (Deduplicated) จำนวน {uploadFeedback.duplicateCount} รายการ โดยอิงจาก Hash (Datetime + HN + Drug + Step)
              </p>
            </div>
          </div>
          <button
            onClick={() => setUploadFeedback(null)}
            className="text-blue-500 hover:text-blue-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {activeSubTab === 'sql' ? (
        /* HOSxP Export SQL Query Card */
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span>คำสั่ง SQL สำหรับดึงข้อมูลอุบัติการณ์จาก HOSxP (MySQL / MariaDB)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                รันในเมนู HOSxP Report Query หรือโปรแกรมจัดการฐานข้อมูลเพื่อส่งออกเป็นไฟล์ Excel นำเข้าสู่ระบบนี้
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(HOSXP_EXPORT_SQL);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2000);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap"
            >
              <span>{copiedSql ? 'คัดลอกสำเร็จ! ✓' : 'คัดลอกคำสั่ง SQL'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {HOSXP_EXPORT_SQL}
          </pre>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 space-y-2">
            <div className="font-bold text-xs">คำแนะนำการนำเข้า (Mapping Instructions):</div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-800">
              <li>คอลัมน์ <code>ward_name</code> จะถูกแมปเข้าฟิลด์ 1 (Patient Type: IPD หรือ OPD) อัตโนมัติ</li>
              <li>คอลัมน์ <code>process_step</code> จะถูกแปลงเป็นรหัสมาตรฐาน 6 ขั้นตอน (PRE, TRA, PDI, DIS, ADM, PRO)</li>
              <li>ระบบจะคำนวณ SHA-256 Hash จาก Datetime + HN + Drug + Step เพื่อป้องกันการบันทึกซ้ำซ้อน 100%</li>
            </ul>
          </div>
        </div>
      ) : activeSubTab === 'upload' ? (
        /* Explanatory Policy Card */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs text-slate-600">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>กระบวนการ Stage 1 และ Stage 2 ของ HOSxP Smart Import</span>
          </h3>
          <p>
            1. <strong>Stage 1 (Upload & Client-side Deduplication):</strong> ไฟล์ที่ผู้ใช้เลือกจะถูกอ่านในเบราว์เซอร์ผ่าน SheetJS และตัดฟิลด์ข้อมูลส่วนบุคคล (Patient Name, CID, โทรศัพท์) ทิ้งทันที จากนั้นสร้าง SHA-256 Hash จาก <code>datetime + hn + drug + step</code> เพื่อป้องกันการนำเข้าซ้ำซ้อนในตาราง <code>hosxp_rows</code>
          </p>
          <p>
            2. <strong>Stage 2 (Human Review Queue):</strong> Reviewer จะตรวจสอบข้อมูลเคียงคู่กับตารางข้อมูลดิบ เพื่อยืนยันหรือแก้ไขฟิลด์ทั้ง 20 ข้อ (ระบบจะไม่คาดเดาแผนกต้นเหตุ เว้นแต่เป็นข้อผิดพลาดจากการสั่งยาที่มีแพทย์เฉพาะทางระบุชัดเจน)
          </p>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <strong>หมายเหตุความปลอดภัย:</strong> เฉพาะผู้มีบทบาท Reviewer และ Admin เท่านั้นที่สามารถเข้าถึงหน้า HOSxP Review Queue และดำเนินการ Approve / Reject ได้
          </div>
        </div>
      ) : (
        /* Review Queue Table & Side-by-Side Inspector */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">สถานะคิว:</span>
              <div className="inline-flex bg-slate-100 p-0.5 rounded-lg text-xs">
                {(['review', 'imported', 'rejected', 'all'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setQueueFilter(st)}
                    className={`px-3 py-1 rounded-md font-semibold transition capitalize ${
                      queueFilter === st
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'review' ? 'รอการตรวจทาน (Review)' : st === 'imported' ? 'อนุมัติแล้ว (Imported)' : st === 'rejected' ? 'ปฏิเสธแล้ว (Rejected)' : 'ทั้งหมด'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {queue.some(q => q.status === 'review') && (
                <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  title="สร้างรายงานร่าง Pending สำหรับรายการที่รอตรวจทั้งหมด"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>อนุมัติทั้งหมดเป็น Pending ({queue.filter(q => q.status === 'review').length})</span>
                </button>
              )}
              <span className="text-xs text-slate-400">
                พบ {queue.length} รายการในคิว
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Queue List (5 cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto">
              {queue.map((row) => (
                <div
                  key={row.id}
                  onClick={() => handleSelectRowToReview(row)}
                  className={`p-4 rounded-2xl border cursor-pointer transition text-xs space-y-2 ${
                    selectedRow?.id === row.id
                      ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        {row.raw?.hn || row.proposed?.hn || 'No HN'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px]">
                        Row #{row.row_no}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {row.status === 'review' && (
                        <button
                          onClick={(e) => handleQuickApprove(row, e)}
                          title="นำเข้าเป็นรายงานร่างทันที"
                          className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] border border-emerald-300 transition"
                        >
                          + นำเข้า
                        </button>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          row.status === 'imported'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>

                  <div className="font-medium text-slate-800 truncate">
                    {row.proposed?.intended_drug || row.raw?.drug_name || 'ไม่ระบุชื่อยา'}
                  </div>

                  <p className="text-slate-500 line-clamp-2">
                    {row.proposed?.problem_description || row.raw?.detail || '-'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>{row.proposed?.incident_date} {row.proposed?.incident_time}</span>
                    <span className="font-mono font-semibold text-blue-700">{row.proposed?.process}</span>
                  </div>
                </div>
              ))}

              {queue.length === 0 && (
                <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold">ไม่มีรายการในคิวตรวจสอบ</p>
                  <p className="text-[11px] mt-1">อัปโหลดไฟล์ HOSxP หรือดาวน์โหลดไฟล์ตัวอย่างเพื่อทดสอบ</p>
                </div>
              )}
            </div>

            {/* Right Side-by-Side Inspector (7 cols) */}
            <div className="lg:col-span-7">
              {selectedRow ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                  {/* Top Bar with actions */}
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          ตรวจสอบแถวที่ #{selectedRow.row_no}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          (Source Key: {selectedRow.source_key?.slice(0, 12)}...)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        จากไฟล์: {selectedRow.filename}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedRow.status === 'review' && (
                        <>
                          <button
                            onClick={() => setRejectModal({ open: true, rowId: selectedRow.id, reason: '' })}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition"
                          >
                            ปฏิเสธ (Reject)
                          </button>
                          <button
                            onClick={handleApproveRow}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                          >
                            อนุมัติและสร้างรายงาน (Approve)
                          </button>
                        </>
                      )}

                      {selectedRow.status === 'rejected' && (
                        <button
                          onClick={() => handleRestore(selectedRow.id)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
                        >
                          กู้คืนกลับสู่คิว (Restore to Review)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reject Reason Banner if already rejected */}
                  {selectedRow.status === 'rejected' && selectedRow.reject_reason && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                      <strong>เหตุผลที่ปฏิเสธ:</strong> {selectedRow.reject_reason}
                    </div>
                  )}

                  {/* Inspector Tabs / Side-by-Side */}
                  <div className="space-y-4 text-xs">
                    {/* Raw vs Proposed Comparison Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 flex justify-between">
                        <span>ข้อมูลดิบ HOSxP (PII Stripped)</span>
                        <span className="text-blue-700">ฟิลด์ 20 ข้อที่แมปอัตโนมัติ (Proposed)</span>
                      </div>

                      <div className="p-4 grid grid-cols-2 gap-4 divide-x divide-slate-100 bg-slate-50/50">
                        {/* Left: Raw */}
                        <div className="space-y-2 font-mono text-[11px] text-slate-600 overflow-x-auto">
                          <div><strong>datetime:</strong> {selectedRow.raw?.incident_datetime || selectedRow.raw?.date || '-'}</div>
                          <div><strong>ward:</strong> {selectedRow.raw?.ward || '-'}</div>
                          <div><strong>hn:</strong> {selectedRow.raw?.hn || '-'}</div>
                          <div><strong>drug_name:</strong> {selectedRow.raw?.intended_drug || selectedRow.raw?.drug_name || '-'}</div>
                          <div><strong>step:</strong> {selectedRow.raw?.step || '-'}</div>
                          <div><strong>severity:</strong> {selectedRow.raw?.severity || '-'}</div>
                          <div><strong>detail:</strong> {selectedRow.raw?.problem_description || selectedRow.raw?.detail || '-'}</div>
                          <div><strong>doctor:</strong> {selectedRow.raw?.doctor_name || selectedRow.raw?.doctor || '-'}</div>
                        </div>

                        {/* Right: Editable Review Form Fields */}
                        <div className="pl-4 space-y-3">
                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">
                              1. Patient Type (OPD/IPD) *
                            </label>
                            <select
                              value={reviewFormData.patient_type}
                              onChange={(e) => setReviewFormData({ ...reviewFormData, patient_type: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded p-1.5"
                            >
                              <option value="OPD">OPD</option>
                              <option value="IPD">IPD</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">
                              17. Process (ขั้นตอน ME) *
                            </label>
                            <select
                              value={reviewFormData.process}
                              onChange={(e) => setReviewFormData({ ...reviewFormData, process: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded p-1.5"
                            >
                              {PROCESS_OPTIONS.map((p) => (
                                <option key={p.code} value={p.code}>{p.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">
                              18. ME Subtype (กรองตาม Process) *
                            </label>
                            <select
                              value={reviewFormData.me_subtype}
                              onChange={(e) => setReviewFormData({ ...reviewFormData, me_subtype: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded p-1.5"
                            >
                              {store.getMeSubtypes().filter(m => m.process === reviewFormData.process).map((m) => (
                                <option key={m.code} value={m.code}>[{m.code}] {m.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">
                              10. Origin Department (หน่วยงานต้นเหตุ) *
                            </label>
                            <select
                              value={reviewFormData.origin_department_id}
                              onChange={(e) => setReviewFormData({ ...reviewFormData, origin_department_id: e.target.value })}
                              className={`w-full bg-white border rounded p-1.5 ${
                                validationErrors.origin_department_id ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                              }`}
                            >
                              <option value="">-- โปรดเลือกแผนกต้นเหตุ --</option>
                              {store.getDepartments().map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                            {validationErrors.origin_department_id && (
                              <p className="text-[10px] text-rose-600 mt-0.5">{validationErrors.origin_department_id}</p>
                            )}
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">
                              8. NCC-MERP Severity *
                            </label>
                            <select
                              value={reviewFormData.ncc_merp}
                              onChange={(e) => setReviewFormData({
                                ...reviewFormData,
                                ncc_merp: e.target.value,
                                rm_grade: computeRmGrade(e.target.value)
                              })}
                              className="w-full bg-white border border-slate-300 rounded p-1.5"
                            >
                              {NCC_MERP_LEVELS.map((n) => (
                                <option key={n.code} value={n.code}>ระดับ {n.code} (Grade {n.grade})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parser Notes */}
                    {selectedRow.notes && selectedRow.notes.length > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                        <div className="font-bold flex items-center gap-1.5 mb-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>บันทึกและคำแนะนำจากระบบ (Parser Suggestions):</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {selectedRow.notes.map((n: string, i: number) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
                  <div>
                    <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold">เลือกรายการในคิวทางซ้ายเพื่อตรวจสอบ</p>
                    <p className="text-xs mt-1">Reviewer สามารถตรวจสอบ แก้ไขฟิลด์ และอนุมัติเป็นรายงานทางการได้</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              ปฏิเสธรายการ HOSxP (Reject Staged Row)
            </h3>

            {rejectModal.error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {rejectModal.error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระบุเหตุผลในการปฏิเสธ (Mandatory Reason) *
              </label>
              <textarea
                rows={3}
                placeholder="เช่น ข้อมูลไม่ใช่อุบัติการณ์ทางยา, ข้อมูลซ้ำซ้อน, บันทึกผิดพลาด..."
                value={rejectModal.reason}
                onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value, error: undefined }))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, rowId: '', reason: '' })}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleExecuteReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
