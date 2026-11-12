import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { getFullSubtypeLabel, NCC_MERP_LEVELS, PROCESS_OPTIONS } from '../../shared/form.js';
import { exportReportsToGoogleSheets } from '../services/googleWorkspace';
import { store } from '../services/store';

interface ReportListProps {
  onSelectReport: (report: any) => void;
  onEditReport: (report: any) => void;
  onNewReport: () => void;
  onOpenRcaTab?: () => void;
  googleUser: any;
}

export const ReportList: React.FC<ReportListProps> = ({
  onSelectReport,
  onEditReport,
  onNewReport,
  onOpenRcaTab,
  googleUser
}) => {
  const currentUser = store.getCurrentUser();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processFilter, setProcessFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [patientTypeFilter, setPatientTypeFilter] = useState('all');

  // Format drug and strength strictly as "ชื่อยา - ความแรง"
  const formatDrugStrength = (drugName?: string, strength?: string) => {
    if (!drugName) return '';
    const d = drugName.trim();
    const s = (strength || '').trim();
    if (!s || s === '-') return d;
    if (d.includes(`- ${s}`)) return d;
    if (d.includes(`(${s})`)) return d.replace(`(${s})`, `- ${s}`).trim();
    if (d.endsWith(s)) {
      const base = d.slice(0, d.length - s.length).trim();
      return base ? `${base} - ${s}` : d;
    }
    return `${d} - ${s}`;
  };

  // Date Range Filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Clinical Focus Toggles
  const [hadOnly, setHadOnly] = useState(false);
  const [lasaOnly, setLasaOnly] = useState(false);
  const [eUpOnly, setEUpOnly] = useState(false);

  // Dismissible E-up Banner State
  const [isEUpBannerDismissed, setIsEUpBannerDismissed] = useState(false);

  // Google Sheets Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessUrl, setExportSuccessUrl] = useState<string | null>(null);
  const [showConfirmExport, setShowConfirmExport] = useState(false);

  // Quick Date Range Presets
  const applyDatePreset = (preset: 'today' | 'month' | 'quarter' | 'year' | 'all') => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const today = now.toISOString().split('T')[0];

    if (preset === 'today') {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === 'month') {
      setStartDate(`${y}-${m}-01`);
      setEndDate(today);
    } else if (preset === 'quarter') {
      const qMonth = Math.floor(now.getMonth() / 3) * 3 + 1;
      setStartDate(`${y}-${String(qMonth).padStart(2, '0')}-01`);
      setEndDate(today);
    } else if (preset === 'year') {
      setStartDate(`${y}-01-01`);
      setEndDate(today);
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  // Load filtered reports
  const reports = store.getReports({
    status: statusFilter,
    process: processFilter,
    ncc_merp: severityFilter,
    patient_type: patientTypeFilter,
    search,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    hadOnly,
    lasaOnly,
    eUpOnly
  });

  const allEUpReports = store.getReports().filter(r => ['E', 'F', 'G', 'H', 'I'].includes(r.ncc_merp));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ยืนยันแล้ว</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>รอตรวจสอบ</span>
          </span>
        );
    }
  };

  // Severity Badge: Single Letter strictly without "Cat" prefix
  const getSeverityBadge = (level: string) => {
    let colorClass = 'bg-slate-100 text-slate-700 border-slate-300';
    if (level === 'A') colorClass = 'bg-slate-100 text-slate-800 border-slate-300 font-bold';
    else if (level === 'B') colorClass = 'bg-sky-100 text-sky-800 border-sky-300 font-extrabold';
    else if (level === 'C') colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold';
    else if (level === 'D') colorClass = 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold';
    else if (['E', 'F'].includes(level)) colorClass = 'bg-orange-100 text-orange-900 border-orange-400 ring-2 ring-orange-400/30 font-black';
    else if (['G', 'H'].includes(level)) colorClass = 'bg-rose-100 text-rose-900 border-rose-400 ring-2 ring-rose-400/30 font-black';
    else if (level === 'I') colorClass = 'bg-purple-100 text-purple-900 border-purple-400 ring-2 ring-purple-500/40 font-black';

    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-mono text-xs border ${colorClass} shadow-2xs`}>
        {level}
      </span>
    );
  };

  // Google Sheets Export
  const handleTriggerGoogleExport = () => {
    if (!googleUser) {
      alert('กรุณาเชื่อมต่อบัญชี Google ที่แถบด้านบนก่อนส่งออกข้อมูล');
      return;
    }
    setShowConfirmExport(true);
  };

  const handleConfirmGoogleExport = async () => {
    setShowConfirmExport(false);
    setIsExporting(true);
    setExportSuccessUrl(null);
    try {
      const res = await exportReportsToGoogleSheets(
        reports,
        `รายงานความคลาดเคลื่อนทางยา (${reports.length} รายการ)`
      );
      setExportSuccessUrl(res.spreadsheetUrl);
    } catch (err: any) {
      alert(`ส่งออกข้อมูลไปยัง Google Sheets ไม่สำเร็จ: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Local Excel Export
  const handleExportLocalExcel = () => {
    const exportData = reports.map(r => {
      const processObj = PROCESS_OPTIONS.find(p => p.code === r.process);
      const processFull = processObj ? processObj.label : (r.process || '');
      const subtypeFull = getFullSubtypeLabel(r.me_subtype) || r.me_subtype || '';

      const errDrugFull = formatDrugStrength(r.error_drug, r.error_drug_strength);
      const intendedDrugFull = formatDrugStrength(r.intended_drug, r.intended_drug_strength);

      return {
        'ประเภทผู้ป่วย': r.patient_type,
        'HN': r.hn,
        'วันที่เกิดเหตการณ์': r.incident_date,
        'ช่วงเวลาที่เกิด': r.incident_time,
        'ยาที่ถูก (ชื่อยา - ความแรง)': intendedDrugFull,
        'ยาที่ผิด (ชื่อยา - ความแรง)': errDrugFull,
        'ปัญหา': r.problem_description,
        'วิธีการแก้ไข': r.corrective_action || '',
        'ระดับความเสี่ยง': r.ncc_merp,
        'ความเสี่ยงที่ป้องกันได้': r.preventability || '',
        'หน่วยงานที่เกิด Error': r.origin_department_name || r.origin_department_id,
        'ผู้ที่เกิด Error': r.error_staff_reference || '',
        'Specialist Staff': r.consult_recipient_reference || '',
        'หน่วยงานที่รายงาน': r.detection_department_name || r.detection_department_id,
        'ผู้รายงาน': r.reporter_reference || '',
        'วันที่รายงาน': r.reported_date,
        'ขั้นตอน ME': processFull,
        'ชนิด ME': subtypeFull,
        'วิเคราะห์สาเหตุหลัก': r.cause || '',
        'ผู้บันทึก': r.recorded_by_reference || ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MedicationErrors');
    XLSX.writeFile(wb, `รายงานความคลาดเคลื่อนทางยา_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">

      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              ทะเบียนความคลาดเคลื่อน
            </h1>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              พบทั้งหมด {reports.length} รายการ
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportLocalExcel}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>ส่งออก Excel</span>
            </button>

            <button
              onClick={handleTriggerGoogleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{isExporting ? 'กำลังส่งออก...' : 'ส่งออก Google Sheets'}</span>
            </button>

            <button
              onClick={onNewReport}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-850 via-purple-900 to-indigo-900 hover:from-purple-950 hover:to-indigo-950 text-white rounded-2xl text-xs font-bold transition shadow-md shadow-purple-900/20 active:scale-95 cursor-pointer group"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 group-hover:bg-emerald-400 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
              <span>บันทึกรายงานใหม่</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-black text-[9px] tracking-wider uppercase shadow-xs">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input - Universal Keyword Search */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="พิมพ์ค้นหาคำสำคัญ เช่น HN, ชื่อยา, ความแรง, ชื่อเจ้าหน้าที่, แผนก/หน่วยงาน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Patient Type Filter */}
            <div className="md:col-span-2">
              <select
                value={patientTypeFilter}
                onChange={(e) => setPatientTypeFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition font-semibold"
              >
                <option value="all">ทุกประเภทผู้ป่วย</option>
                <option value="IPD">ผู้ป่วยใน (IPD)</option>
                <option value="OPD">ผู้ป่วยนอก (OPD)</option>
                <option value="TELEMED">TELEMED</option>
              </select>
            </div>

            {/* Process Filter */}
            <div className="md:col-span-2">
              <select
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              >
                <option value="all">ทุกขั้นตอน (ME Type)</option>
                {PROCESS_OPTIONS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.short}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div className="md:col-span-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              >
                <option value="all">ทุกระดับความรุนแรง</option>
                {NCC_MERP_LEVELS.map((lvl) => (
                  <option key={lvl.code} value={lvl.code}>
                    ระดับ {lvl.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอตรวจสอบ</option>
                <option value="verified">ยืนยันแล้ว</option>
              </select>
            </div>
          </div>

          {/* Quick Date Range Presets & Clinical Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                ช่วงวันที่:
              </span>
              <button
                type="button"
                onClick={() => {
                  applyDatePreset('today');
                }}
                className={`px-3 py-1 rounded-xl font-medium transition ${
                  startDate && startDate === endDate ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                วันนี้
              </button>
              <button
                type="button"
                onClick={() => {
                  applyDatePreset('all');
                }}
                className={`px-3 py-1 rounded-xl font-medium transition ${
                  !startDate && !endDate ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                ทั้งหมด
              </button>
              <div className="flex items-center gap-1.5 ml-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-xl">
                <span className="text-[11px] text-slate-500 font-medium">กำหนดเอง:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-[11px] text-slate-700 font-medium focus:outline-none"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-[11px] text-slate-700 font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setHadOnly(!hadOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  hadOnly
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                HAD
              </button>
              <button
                type="button"
                onClick={() => setLasaOnly(!lasaOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  lasaOnly
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                LASA
              </button>
              <button
                type="button"
                onClick={() => setEUpOnly(!eUpOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  eUpOnly
                    ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                E-UP
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">วันที่</th>
                <th className="py-3.5 px-4">HN</th>
                <th className="py-3.5 px-4">ขั้นตอน</th>
                <th className="py-3.5 px-4">ชื่อยา / ความแรง</th>
                <th className="py-3.5 px-4 text-center">ความรุนแรง</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectReport(report)}
                  >
                    {/* วันที่ */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{report.incident_date}</div>
                    </td>

                    {/* HN */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          report.patient_type === 'IPD'
                            ? 'bg-purple-100 text-purple-800'
                            : report.patient_type === 'TELEMED'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.patient_type}
                        </span>
                        <span className="font-mono text-slate-700 font-medium">
                          {report.hn || 'ไม่ระบุ'}
                        </span>
                      </div>
                    </td>

                    {/* ขั้นตอน */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{report.process}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{report.me_subtype}</div>
                    </td>

                    {/* ชื่อยา / ความแรง (ไอคอน X สำหรับยาผิด และ Check สำหรับยาถูก พร้อมแท็ก HAD / LASA) */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {(() => {
                        const isHadIncident = report.is_had || store.checkDrugHad(report.intended_drug) || store.checkDrugHad(report.error_drug);
                        const isLasaIncident = Boolean(report.lasa_info) || Boolean(store.checkDynamicLasaPair(report.intended_drug, report.error_drug));

                        return (
                          <div className="flex flex-col gap-0.5 items-start">
                            {report.error_drug ? (
                              <>
                                <div
                                  className="font-semibold text-rose-700 text-xs truncate max-w-full flex items-center"
                                  title={`ยาที่เกิดเหตุ: ${formatDrugStrength(report.error_drug, report.error_drug_strength)}`}
                                >
                                  <X className="w-3.5 h-3.5 text-rose-500 mr-1 shrink-0 select-none" strokeWidth={3} />
                                  <span className="truncate">{formatDrugStrength(report.error_drug, report.error_drug_strength)}</span>
                                </div>
                                {report.intended_drug && (
                                  <div
                                    className="font-semibold text-emerald-700 text-[11px] truncate max-w-full flex items-center mt-0.5"
                                    title={`ยาที่ถูกต้อง: ${formatDrugStrength(report.intended_drug, report.intended_drug_strength)}`}
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0 select-none" strokeWidth={3} />
                                    <span className="truncate">{formatDrugStrength(report.intended_drug, report.intended_drug_strength)}</span>
                                  </div>
                                )}
                              </>
                            ) : report.intended_drug ? (
                              <div
                                className="font-semibold text-emerald-700 text-xs truncate max-w-full flex items-center"
                                title={`ยาที่ถูกต้อง: ${formatDrugStrength(report.intended_drug, report.intended_drug_strength)}`}
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0 select-none" strokeWidth={3} />
                                <span className="truncate">{formatDrugStrength(report.intended_drug, report.intended_drug_strength)}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}

                            {/* Tags HAD / LASA */}
                            {(isHadIncident || isLasaIncident) && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                {isHadIncident && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                                    <ShieldAlert className="w-2.5 h-2.5 text-rose-600" />
                                    HAD
                                  </span>
                                )}
                                {isLasaIncident && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                                    <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                    LASA
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    {/* ความรุนแรง */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getSeverityBadge(report.ncc_merp)}
                    </td>

                    {/* สถานะ */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>

                    {/* รายละเอียด */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectReport(report)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูรายละเอียด</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-sm text-slate-600">ไม่พบรายงานที่ตรงกับเงื่อนไขการค้นหา</p>
                    <p className="text-xs text-slate-400 mt-1">ลองปรับเปลี่ยนตัวกรอง หรือสร้างรายงานใหม่</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Google Export */}
      {showConfirmExport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800">ยืนยันการส่งออกข้อมูลไปยัง Google Sheets</h4>
              <p className="text-xs text-slate-500 mt-1">
                ระบบจะสร้างสเปรดชีตใหม่ใน Google Drive ของคุณ บรรจุข้อมูลรายงานจำนวน {reports.length} รายการ
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmExport(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmGoogleExport}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200"
              >
                เริ่มส่งออกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Export Success Alert */}
      {exportSuccessUrl && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>ส่งออกข้อมูลไปยัง Google Sheets สำเร็จเรียบร้อยแล้ว</span>
          </div>
          <a
            href={exportSuccessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
          >
            เปิดดูใน Google Sheets
          </a>
        </div>
      )}
    </div>
  );
};
