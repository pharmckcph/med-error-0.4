import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  Layers,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Tag,
  Target,
  Trash2,
  TrendingDown,
  UserCheck,
  Users,
  X
} from 'lucide-react';
import { NCC_MERP_LEVELS, PROCESS_OPTIONS } from '../../shared/form.js';
import { store } from '../services/store';

export const RiskManagementRca: React.FC<{
  onSelectReportToView?: (reportId: string) => void;
}> = ({ onSelectReportToView }) => {
  const currentUser = store.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'eup' | 'process'>('eup');
  const [searchQuery, setSearchQuery] = useState('');
  const [rcaStatusFilter, setRcaStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Active month selector for monthly systemic plan monitoring
  const currentMonthKey = new Date().toISOString().slice(0, 7); // e.g. "2026-10"
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  // Selected E-up report for RCA investigation modal
  const [selectedEUpReport, setSelectedEUpReport] = useState<any>(null);
  const [rcaFormData, setRcaFormData] = useState({
    rca_team: '',
    rca_root_cause_type: 'ด้านระบบงาน / ขั้นตอนปฏิบัติ (System & Workflow)',
    fishbone_man: '',
    fishbone_machine: '',
    fishbone_method: '',
    fishbone_material: '',
    fishbone_environment: '',
    rca_summary: '',
    rca_action_plan: '',
    rca_responsible: '',
    rca_due_date: ''
  });

  // State for new Process RCA Plan modal
  const [processPlanModalOpen, setProcessPlanModalOpen] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    process_code: 'PDI',
    analysis_title: '',
    top_subtypes: '',
    root_cause_summary: '',
    action_plan: '',
    target_reduction_pct: 50,
    responsible_team: '',
    target_date: '',
    status: 'active'
  });

  // Fetch all reports
  const allReports = store.getReports();
  const eUpReports = allReports.filter(r => ['E', 'F', 'G', 'H', 'I'].includes(r.ncc_merp));
  const [processRcaPlans, setProcessRcaPlans] = useState(store.getProcessRcaPlans());

  // Metrics
  const totalEUpCount = eUpReports.length;
  const pendingRcaCount = eUpReports.filter(r => r.rca_status !== 'completed').length;
  const completedRcaCount = eUpReports.filter(r => r.rca_status === 'completed').length;

  // Monthly reports filter for Process RCA
  const monthlyReports = allReports.filter(r => {
    const d = r.incident_date || r.reported_date;
    return d && d.startsWith(selectedMonth);
  });

  // Process volume calculation (active month and all time)
  const processCounts: Record<string, number> = { PRE: 0, TRA: 0, PDI: 0, DIS: 0, ADM: 0, PRO: 0 };
  const monthlyProcessCounts: Record<string, number> = { PRE: 0, TRA: 0, PDI: 0, DIS: 0, ADM: 0, PRO: 0 };
  // Subtype breakdown per process for monthly analysis
  const monthlySubtypesByProcess: Record<string, Record<string, number>> = {
    PRE: {}, TRA: {}, PDI: {}, DIS: {}, ADM: {}, PRO: {}
  };

  allReports.forEach(r => {
    if (r.process && processCounts[r.process] !== undefined) {
      processCounts[r.process]++;
    }
  });

  monthlyReports.forEach(r => {
    if (r.process && monthlyProcessCounts[r.process] !== undefined) {
      monthlyProcessCounts[r.process]++;
      if (r.me_subtype) {
        if (!monthlySubtypesByProcess[r.process][r.me_subtype]) {
          monthlySubtypesByProcess[r.process][r.me_subtype] = 0;
        }
        monthlySubtypesByProcess[r.process][r.me_subtype]++;
      }
    }
  });

  const totalReportsCount = allReports.length || 1;
  const sortedProcesses = Object.entries(processCounts).sort((a, b) => b[1] - a[1]);
  const topProcessCode = sortedProcesses[0] ? sortedProcesses[0][0] : 'PDI';
  const topProcessCount = sortedProcesses[0] ? sortedProcesses[0][1] : 0;
  const topProcessPct = Math.round((topProcessCount / totalReportsCount) * 100);
  const topProcessMeta = PROCESS_OPTIONS.find(p => p.code === topProcessCode);

  // Check which processes in the active month have incidents but NO RCA plan created this month
  const processesNeedingMonthlyPlan = PROCESS_OPTIONS.filter(proc => {
    const count = monthlyProcessCounts[proc.code] || 0;
    if (count === 0) return false;
    // Check if there is an existing plan for this process created or active
    const hasPlan = processRcaPlans.some(p => p.process_code === proc.code);
    return !hasPlan;
  });

  // Refresh plans helper
  const refreshPlans = () => {
    setProcessRcaPlans([...store.getProcessRcaPlans()]);
  };

  const handleTogglePlanStatus = (id: string) => {
    store.toggleProcessRcaStatus(id);
    refreshPlans();
  };

  // Filter E-up reports
  let filteredEUpReports = eUpReports;
  if (rcaStatusFilter !== 'all') {
    filteredEUpReports = filteredEUpReports.filter(r =>
      rcaStatusFilter === 'completed' ? r.rca_status === 'completed' : r.rca_status !== 'completed'
    );
  }
  if (searchQuery.trim()) {
    const term = searchQuery.toLowerCase().trim();
    filteredEUpReports = filteredEUpReports.filter(r =>
      (r.report_no && r.report_no.toLowerCase().includes(term)) ||
      (r.hn && r.hn.toLowerCase().includes(term)) ||
      (r.intended_drug && r.intended_drug.toLowerCase().includes(term)) ||
      (r.error_drug && r.error_drug.toLowerCase().includes(term)) ||
      (r.problem_description && r.problem_description.toLowerCase().includes(term))
    );
  }

  // Open RCA investigation modal
  const handleOpenRcaModal = (report: any) => {
    setSelectedEUpReport(report);
    let parsedFishbone: any = {};
    if (report.rca_fishbone) {
      try {
        parsedFishbone = typeof report.rca_fishbone === 'string'
          ? JSON.parse(report.rca_fishbone)
          : report.rca_fishbone;
      } catch (e) {
        parsedFishbone = {};
      }
    }

    setRcaFormData({
      rca_team: report.rca_team || `ทีมสหวิชาชีพ: ${currentUser.display_name}`,
      rca_root_cause_type: report.rca_root_cause_type || 'ด้านระบบงาน / ขั้นตอนปฏิบัติ (System & Workflow)',
      fishbone_man: parsedFishbone.man || '',
      fishbone_machine: parsedFishbone.machine || '',
      fishbone_method: parsedFishbone.method || '',
      fishbone_material: parsedFishbone.material || '',
      fishbone_environment: parsedFishbone.environment || '',
      rca_summary: report.rca_summary || '',
      rca_action_plan: report.rca_action_plan || '',
      rca_responsible: report.rca_responsible || currentUser.display_name,
      rca_due_date: report.rca_due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    });
  };

  // Save RCA investigation
  const handleSaveRca = () => {
    if (!selectedEUpReport) return;

    if (!rcaFormData.rca_summary.trim() || !rcaFormData.rca_action_plan.trim()) {
      alert('กรุณากรอก "สรุปสาเหตุรากเหง้า (Root Cause Summary)" และ "มาตรการแก้ไขเชิงระบบ (CAPA Action Plan)" ให้ครบถ้วน');
      return;
    }

    try {
      const fishboneObj = {
        man: rcaFormData.fishbone_man.trim(),
        machine: rcaFormData.fishbone_machine.trim(),
        method: rcaFormData.fishbone_method.trim(),
        material: rcaFormData.fishbone_material.trim(),
        environment: rcaFormData.fishbone_environment.trim()
      };

      store.updateReportRca(selectedEUpReport.id, {
        rca_status: 'completed',
        rca_team: rcaFormData.rca_team.trim(),
        rca_root_cause_type: rcaFormData.rca_root_cause_type,
        rca_fishbone: JSON.stringify(fishboneObj),
        rca_summary: rcaFormData.rca_summary.trim(),
        rca_action_plan: rcaFormData.rca_action_plan.trim(),
        rca_responsible: rcaFormData.rca_responsible.trim(),
        rca_due_date: rcaFormData.rca_due_date
      });

      alert('บันทึกผลการวิเคราะห์ RCA เรียบร้อยแล้ว! ปลดล็อคสถานะให้สามารถยืนยัน (Verify) รายงานได้');
      setSelectedEUpReport(null);
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการบันทึก RCA');
    }
  };

  // Quick verify from within RCA view if completed
  const handleVerifyReport = (report: any) => {
    try {
      store.transitionReport(report.id, 'verify');
      alert(`ยืนยันรายงาน ${report.report_no} สำเร็จ!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save new Process RCA Plan
  const handleCreateProcessPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanForm.analysis_title.trim() || !newPlanForm.root_cause_summary.trim() || !newPlanForm.action_plan.trim()) {
      alert('กรุณากรอกข้อมูลมาตรการให้ครบถ้วน');
      return;
    }

    try {
      const subArray = newPlanForm.top_subtypes
        ? newPlanForm.top_subtypes.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      store.saveProcessRcaPlan({
        ...newPlanForm,
        top_subtypes: subArray
      });

      alert('บันทึกแผนงานเชิงระบบสำหรับกระบวนการสำเร็จ');
      setProcessPlanModalOpen(false);
      setNewPlanForm({
        process_code: topProcessCode,
        analysis_title: '',
        top_subtypes: '',
        root_cause_summary: '',
        action_plan: '',
        target_reduction_pct: 50,
        responsible_team: '',
        target_date: '',
        status: 'active'
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 via-orange-50/60 to-amber-50/40 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <ShieldAlert className="h-3.5 w-3.5" />
                ระบบบริหารความเสี่ยงทางยา (Risk Management)
              </span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                Hospital Safety Goal
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              การจัดการความเสี่ยง & การวิเคราะห์สาเหตุรากเหง้า (RCA)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              ควบคุมความเสี่ยง 2 ระดับ: <span className="font-semibold text-rose-700">1) บังคับทำ RCA ทุกเคสความรุนแรงสูง (E-up)</span> ก่อน Verify และ{' '}
              <span className="font-semibold text-amber-700">2) วิเคราะห์เชิงระบบในขั้นตอนที่มีอุบัติการณ์สูง (High-Volume Process)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setNewPlanForm(prev => ({ ...prev, process_code: topProcessCode }));
                setProcessPlanModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              เพิ่มแผนป้องกันเชิงระบบ (Process CAPA)
            </button>
          </div>
        </div>

        {/* Key Risk Indicators Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-rose-200 bg-white/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800">เคสความรุนแรงสูง (E-up: Cat E-I)</span>
              <ShieldAlert className="h-4 w-4 text-rose-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-700">{totalEUpCount}</span>
              <span className="text-xs text-slate-500">เคสทั้งหมด</span>
            </div>
            <p className="mt-1 text-xs text-rose-600">เกิดอันตรายต่อผู้ป่วย / เฝ้าระวังใกล้ชิด</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">รอดำเนินการ RCA</span>
              <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600">{pendingRcaCount}</span>
              <span className="text-xs text-slate-500">เคสค้างวิเคราะห์</span>
            </div>
            <p className="mt-1 text-xs text-amber-700 font-medium">⚠️ ล็อคระบบ ไม่สามารถ Verify ได้จนกว่าจะทำ RCA</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">ทำ RCA ครบถ้วนแล้ว</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600">{completedRcaCount}</span>
              <span className="text-xs text-slate-500">เคสพร้อมปิดความเสี่ยง</span>
            </div>
            <p className="mt-1 text-xs text-emerald-700">มีมาตรการป้องกันเชิงระบบ (CAPA)</p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-800">ขั้นตอนอุบัติการณ์สูงสุด</span>
              <BarChart3 className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-700">{topProcessCode}</span>
              <span className="text-sm font-bold text-slate-700">({topProcessPct}%)</span>
            </div>
            <p className="mt-1 truncate text-xs text-indigo-700" title={topProcessMeta?.label}>
              {topProcessMeta?.short || topProcessCode} ({topProcessCount} ครั้ง)
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('eup')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'eup'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>1. เคสความรุนแรงสูง E-up (บังคับทำ RCA รายเคส)</span>
          {pendingRcaCount > 0 && (
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">
              {pendingRcaCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('process')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'process'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>2. วิเคราะห์ขั้นตอนที่มีอุบัติการณ์สูง (High-Volume Process RCA)</span>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">
            {processRcaPlans.length} แผน
          </span>
        </button>
      </div>

      {/* TAB 1: E-up Sentinel Harm Cases */}
      {activeTab === 'eup' && (
        <div className="space-y-4">
          {/* Information & Filters Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">สถานะ RCA:</span>
              <button
                onClick={() => setRcaStatusFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  rcaStatusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด ({totalEUpCount})
              </button>
              <button
                onClick={() => setRcaStatusFilter('pending')}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  rcaStatusFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Clock className="h-3 w-3" />
                รอดำเนินการ RCA ({pendingRcaCount})
              </button>
              <button
                onClick={() => setRcaStatusFilter('completed')}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  rcaStatusFilter === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle className="h-3 w-3" />
                ทำ RCA เสร็จแล้ว ({completedRcaCount})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหา HN, ยา, เลขรายงาน..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-1.5 pl-9 pr-3 text-xs focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* E-up Incident Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 font-semibold text-slate-700">
                    <th className="py-3 px-4">เลขที่รายงาน</th>
                    <th className="py-3 px-4">วันเวลา / ผู้ป่วย</th>
                    <th className="py-3 px-4">ยาที่เกิดเหตุ (Intended vs Error)</th>
                    <th className="py-3 px-4 text-center">ระดับความรุนแรง</th>
                    <th className="py-3 px-4">ขั้นตอนที่เกิด</th>
                    <th className="py-3 px-4 text-center">สถานะการทำ RCA</th>
                    <th className="py-3 px-4 text-center">สถานะรายงาน</th>
                    <th className="py-3 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEUpReports.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        ไม่พบรายงานความรุนแรงสูง (E-up) ตามเงื่อนไขที่เลือก
                      </td>
                    </tr>
                  ) : (
                    filteredEUpReports.map(report => {
                      const isCompleted = report.rca_status === 'completed';
                      return (
                        <tr key={report.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {report.report_no}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{report.incident_date} {report.incident_time}</div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <span>HN: {report.hn || '-'}</span>
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                                {report.patient_type}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-medium text-emerald-800">{report.intended_drug || '-'}</div>
                            {report.error_drug && (
                              <div className="font-medium text-rose-700">❌ {report.error_drug}</div>
                            )}
                            <div className="mt-1 flex flex-wrap gap-1">
                              {report.is_had && (
                                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                                  HAD
                                </span>
                              )}
                              {report.lasa_info && (
                                <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                                  LASA
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center justify-center rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-extrabold text-rose-800 border border-rose-300 ring-2 ring-rose-400/30">
                              {report.ncc_merp}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                              {report.process}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                                <CheckCircle className="h-3 w-3" />
                                ทำ RCA ครบถ้วน
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                                <Clock className="h-3 w-3" />
                                รอดำเนินการ RCA
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                report.status === 'verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {report.status === 'verified' ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenRcaModal(report)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs transition active:scale-95 ${
                                  isCompleted
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    : 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-400/40'
                                }`}
                              >
                                {isCompleted ? 'ดู/แก้ไข RCA' : '⚡ บันทึก RCA'}
                              </button>

                              {report.status === 'pending' && (
                                <button
                                  onClick={() => handleVerifyReport(report)}
                                  title="ยืนยันรายงาน (หน้าที่ของรีวิวเวอร์)"
                                  className="rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs transition bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                                >
                                  Verify
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: High-Volume Process RCA Matrix */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          {/* Month Selector for Process RCA */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">เดือนที่วิเคราะห์แผน RCA ประจำเดือน:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 focus:border-indigo-500 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-medium">
                (พบอุบัติการณ์ทั้งหมด {monthlyReports.length} ครั้งในเดือนนี้)
              </span>
            </div>

            <button
              onClick={() => {
                setNewPlanForm(prev => ({
                  ...prev,
                  process_code: topProcessCode,
                  analysis_title: `แผน RCA ป้องกันเชิงระบบประจำเดือน ${selectedMonth} [${topProcessCode}]`
                }));
                setProcessPlanModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              + สร้างแผน RCA ประจำเดือน
            </button>
          </div>

          {/* Monthly Unresolved Alerts: Process with incidents but NO RCA Plan */}
          {processesNeedingMonthlyPlan.length > 0 && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>แจ้งเตือนค้างจัดทำแผน RCA ประจำเดือน ({selectedMonth}):</span>
              </div>
              <p className="text-xs text-amber-800">
                พบขั้นตอนที่มีอุบัติการณ์ในเดือนนี้ แต่ยังไม่ได้จัดทำแผน RCA เชิงระบบประจำเดือน กรุณาจัดทำแผนเพื่อวิเคราะห์และป้องกันข้อผิดพลาดซ้ำ:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {processesNeedingMonthlyPlan.map(proc => {
                  const cnt = monthlyProcessCounts[proc.code] || 0;
                  const topSubs = Object.entries(monthlySubtypesByProcess[proc.code] || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([name, c]) => `${name} (${c} ครั้ง)`)
                    .join(', ');

                  return (
                    <div
                      key={proc.code}
                      className="flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs shadow-2xs"
                    >
                      <span className="font-bold text-slate-900">{proc.code} ({proc.short}):</span>
                      <span className="font-extrabold text-amber-700">{cnt} ครั้ง</span>
                      <button
                        onClick={() => {
                          setNewPlanForm({
                            process_code: proc.code,
                            analysis_title: `แผน RCA ลดอุบัติการณ์ขั้นตอน ${proc.short} ประจำเดือน ${selectedMonth}`,
                            top_subtypes: topSubs,
                            root_cause_summary: `อุบัติการณ์สะสม ${cnt} ครั้งในเดือน ${selectedMonth}`,
                            action_plan: '',
                            target_reduction_pct: 50,
                            responsible_team: `ทีมงาน ${proc.short}`,
                            target_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                            status: 'active'
                          });
                          setProcessPlanModalOpen(true);
                        }}
                        className="rounded-lg bg-amber-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-700 transition"
                      >
                        + สร้างแผนทันที
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top High Volume Alert Banner */}
          <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-sky-50 to-white p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-bold text-white">
                    High Volume Analysis
                  </span>
                  <span className="text-xs text-indigo-900 font-medium">
                    วิเคราะห์ความถี่ Subtypes แต่ละขั้นตอน (Swiss Cheese Model)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-indigo-950">
                  ขั้นตอนที่มีอุบัติการณ์สะสมสูงสุด: <span className="underline decoration-indigo-400">{topProcessMeta?.label}</span>
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  ถึงแม้อุบัติการณ์ส่วนใหญ่ในขั้นตอนนี้จะไม่ก่ออันตรายร้ายแรง (ระดับ B-C) แต่ความถี่ที่เกิดขึ้นสะสมสูงถึง{' '}
                  <span className="font-bold text-indigo-800">{topProcessCount} ครั้ง ({topProcessPct}% ของทั้ง รพ.)</span> ชี้ชัดว่ามี
                  จุดอ่อนในกระบวนการทำงานที่จำเป็นต้องทำ RCA เชิงระบบเพื่อป้องกันความเสียหาย
                </p>
              </div>

              <button
                onClick={() => {
                  setNewPlanForm(prev => ({
                    ...prev,
                    process_code: topProcessCode,
                    analysis_title: `แผน RCA เชิงระบบขั้นตอน ${topProcessCode}`
                  }));
                  setProcessPlanModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition"
              >
                <Plus className="h-4 w-4" />
                สร้างแผน RCA เชิงระบบ ({topProcessCode})
              </button>
            </div>

            {/* Visual Process Volume Distribution Bars */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {PROCESS_OPTIONS.map(opt => {
                const count = processCounts[opt.code] || 0;
                const mCount = monthlyProcessCounts[opt.code] || 0;
                const pct = Math.round((count / totalReportsCount) * 100);
                const isTop = opt.code === topProcessCode;
                return (
                  <div
                    key={opt.code}
                    className={`rounded-2xl p-3 border transition ${
                      isTop
                        ? 'border-indigo-400 bg-white shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isTop ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {opt.code}
                      </span>
                      {isTop && (
                        <span className="rounded bg-indigo-100 px-1 text-[10px] font-bold text-indigo-700">
                          TOP #1
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-900">{count}</span>
                      <span className="text-[11px] font-semibold text-slate-500">สะสม</span>
                    </div>
                    <div className="text-[10px] text-indigo-700 font-semibold">
                      เดือนนี้: {mCount} ครั้ง
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isTop ? 'bg-indigo-600' : 'bg-slate-400'}`}
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                      <span className="truncate">{opt.short}</span>
                      <span className="font-semibold">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtype Breakdown per Process (High Volume Subtypes) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  สถิติอุบัติการณ์ตามชนิดย่อย (Subtype Ranking) ประจำเดือน {selectedMonth}
                </h3>
                <p className="text-xs text-slate-500">
                  วิเคราะห์ Subtypes ที่มีความถี่สูงที่สุดในแต่ละขั้นตอนเพื่อสร้างแผน RCA ที่ตรงจุด
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROCESS_OPTIONS.map(proc => {
                const subs = Object.entries(monthlySubtypesByProcess[proc.code] || {}).sort((a, b) => b[1] - a[1]);
                const totalInProc = monthlyProcessCounts[proc.code] || 0;

                return (
                  <div key={proc.code} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-lg bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
                          {proc.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{proc.short}</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-700">{totalInProc} เคส</span>
                    </div>

                    {subs.length === 0 ? (
                      <p className="text-center py-4 text-xs text-slate-400">ยังไม่มีรายงานในเดือนนี้</p>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        {subs.slice(0, 5).map(([subName, count], idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200/80">
                            <span className="font-medium text-slate-700 truncate pr-2" title={subName}>
                              {subName}
                            </span>
                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 shrink-0">
                              {count} ครั้ง
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Existing Systemic Process CAPA Plans */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                มาตรการป้องกันเชิงระบบตามกระบวนการ (Systemic CAPA Plans)
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                รวม {processRcaPlans.length} มาตรการ
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {processRcaPlans.map(plan => {
                const proc = PROCESS_OPTIONS.find(p => p.code === plan.process_code);
                const isCompleted = plan.status === 'completed';
                return (
                  <div
                    key={plan.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                          <Layers className="h-3.5 w-3.5" />
                          {plan.process_code} - {proc?.short || plan.process_code}
                        </span>

                        <button
                          onClick={() => handleTogglePlanStatus(plan.id)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title="คลิกเพื่อสลับสถานะ"
                        >
                          {isCompleted ? '✓ เสร็จสิ้นแล้ว' : '⏳ กำลังดำเนินการ (Active)'}
                        </button>
                      </div>

                      <h4 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
                        {plan.analysis_title}
                      </h4>

                      {/* Top Subtypes tags */}
                      {plan.top_subtypes && plan.top_subtypes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {plan.top_subtypes.map((sub: string, i: number) => (
                            <span
                              key={i}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
                          <span className="font-bold text-slate-900">สรุปสาเหตุรากเหง้า 5M:</span>{' '}
                          {plan.root_cause_summary}
                        </div>
                        <div className="rounded-xl bg-emerald-50/60 p-3 text-emerald-950 border border-emerald-100">
                          <span className="font-bold text-emerald-900">มาตรการแก้ไขเชิงระบบ (CAPA):</span>
                          <div className="mt-1 whitespace-pre-line text-xs font-normal">
                            {plan.action_plan}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div>
                        <span className="font-medium text-slate-700">ผู้รับผิดชอบ:</span> {plan.responsible_team}
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.target_date && (
                          <span>ครบกำหนด: {plan.target_date}</span>
                        )}
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-700 font-bold">
                          เป้าลดลง {plan.target_reduction_pct || 50}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Comprehensive E-up RCA Investigation Form */}
      {selectedEUpReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative my-8 w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50 via-orange-50 to-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-0.5 text-xs font-bold text-white shadow-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  แบบบันทึกการวิเคราะห์สาเหตุรากเหง้า (RCA Investigation)
                </span>
                <h3 className="mt-1.5 text-lg font-bold text-slate-900">
                  {selectedEUpReport.report_no} - ระดับความรุนแรง {selectedEUpReport.ncc_merp} (Sentinel Harm)
                </h3>
              </div>

              <button
                onClick={() => setSelectedEUpReport(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6 text-xs">
              {/* Event Context Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">วันเวลาเกิดเหตุ:</span>
                    <span>{selectedEUpReport.incident_date} {selectedEUpReport.incident_time}</span>
                    <span className="rounded bg-slate-200 px-2 py-0.5 font-bold text-slate-700">
                      {selectedEUpReport.patient_type}
                    </span>
                    <span>HN: {selectedEUpReport.hn}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">กระบวนการ:</span>
                    <span className="rounded bg-indigo-100 px-2 py-0.5 font-bold text-indigo-800">
                      {selectedEUpReport.process}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-bold text-emerald-800">ยาที่ถูกต้อง:</span>{' '}
                    <span>{selectedEUpReport.intended_drug || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-rose-700">ยาที่คลาดเคลื่อน:</span>{' '}
                    <span>{selectedEUpReport.error_drug || '-'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">ลักษณะเหตุการณ์ที่เกิดขึ้น:</span>
                  <p className="mt-1 text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                    {selectedEUpReport.problem_description}
                  </p>
                </div>
              </div>

              {/* RCA Section 1: Team & Root Cause Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ทีมสหวิชาชีพร่วมวิเคราะห์ RCA (Multidisciplinary Team) *
                  </label>
                  <input
                    type="text"
                    value={rcaFormData.rca_team}
                    onChange={e => setRcaFormData({ ...rcaFormData, rca_team: e.target.value })}
                    placeholder="เช่น ภญ.กัญญา, พญ.วราดา, พว.อภิญญา"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">ควรประกอบด้วยผู้เกี่ยวข้องอย่างน้อย 2 สายวิชาชีพ</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ประเภทสาเหตุหลักเชิงระบบ (Primary Cause Category) *
                  </label>
                  <select
                    value={rcaFormData.rca_root_cause_type}
                    onChange={e => setRcaFormData({ ...rcaFormData, rca_root_cause_type: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    <option value="ด้านระบบงาน / ขั้นตอนปฏิบัติ (System & Workflow)">
                      ด้านระบบงาน / ขั้นตอนปฏิบัติ (System & Workflow)
                    </option>
                    <option value="ด้านสิ่งแวดล้อม / บรรจุภัณฑ์ LASA (Environment & LASA Packaging)">
                      ด้านสิ่งแวดล้อม / บรรจุภัณฑ์ LASA (Environment & LASA Packaging)
                    </option>
                    <option value="ด้านการสื่อสารและการประสานงาน (Communication & Handover)">
                      ด้านการสื่อสารและการประสานงาน (Communication & Handover)
                    </option>
                    <option value="ด้านเทคโนโลยี / ระบบสารสนเทศ CPOE (Technology & IT)">
                      ด้านเทคโนโลยี / ระบบสารสนเทศ CPOE (Technology & IT)
                    </option>
                    <option value="ด้านสมรรถนะ / ความรู้และการฝึกอบรม (Staff Training & Competency)">
                      ด้านสมรรถนะ / ความรู้และการฝึกอบรม (Staff Training & Competency)
                    </option>
                  </select>
                </div>
              </div>

              {/* RCA Section 2: 5M Fishbone Analysis */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-slate-900 text-sm">การวิเคราะห์ปัจจัยเชิงระบบ (5M Fishbone Framework)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  มองข้ามการกล่าวโทษบุคคล (No-blame culture) มุ่งเน้นการทบทวนจุดอ่อนในระบบ 5 ด้าน
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">1. ด้านบุคลากร (Man / Staff Factors)</label>
                    <input
                      type="text"
                      placeholder="เช่น ภาระงานหนาแน่น, เวรดึกเหนื่อยล้า, เร่งรีบ"
                      value={rcaFormData.fishbone_man}
                      onChange={e => setRcaFormData({ ...rcaFormData, fishbone_man: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">2. ด้านเครื่องมือ/อุปกรณ์ (Machine / IT Systems)</label>
                    <input
                      type="text"
                      placeholder="เช่น CPOE ไม่มีระบบเตือน, เครื่องสแกนบาร์โค้ดไม่อยู่ที่จุดจ่าย"
                      value={rcaFormData.fishbone_machine}
                      onChange={e => setRcaFormData({ ...rcaFormData, fishbone_machine: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">3. ด้านกระบวนการ/วิธีปฏิบัติ (Method / Workflow)</label>
                    <input
                      type="text"
                      placeholder="เช่น ขาดขั้นตอน Independent Double Check, การส่งเวรไม่เป็นทางการ"
                      value={rcaFormData.fishbone_method}
                      onChange={e => setRcaFormData({ ...rcaFormData, fishbone_method: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">4. ด้านตัวยา/ฉลาก/บรรจุภัณฑ์ (Material / Drug Packaging)</label>
                    <input
                      type="text"
                      placeholder="เช่น ขวดคล้ายกันมาก (Look-Alike), ฉลากตัวหนังสือเล็ก"
                      value={rcaFormData.fishbone_material}
                      onChange={e => setRcaFormData({ ...rcaFormData, fishbone_material: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">5. ด้านสภาพแวดล้อม (Environment / Workstation)</label>
                    <input
                      type="text"
                      placeholder="เช่น แสงสว่างไม่เพียงพอ, เสียงรบกวนบ่อยครั้ง, การจัดเก็บยาในตู้เย็นปะปนกัน"
                      value={rcaFormData.fishbone_environment}
                      onChange={e => setRcaFormData({ ...rcaFormData, fishbone_environment: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* RCA Section 3: Root Cause Summary */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  บทสรุปสาเหตุรากเหง้าเชิงระบบ (Root Cause Consensus Summary) *
                </label>
                <textarea
                  rows={3}
                  value={rcaFormData.rca_summary}
                  onChange={e => setRcaFormData({ ...rcaFormData, rca_summary: e.target.value })}
                  placeholder="อธิบายสรุปสาเหตุรากเหง้าที่ทีมค้นพบ และเหตุใดระบบดักจับ (Defense Barrier) เดิมจึงไม่สามารถป้องกันได้..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* RCA Section 4: CAPA Action Plan */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  มาตรการแก้ไขและป้องกันเชิงระบบ (CAPA Action Plan) *
                </label>
                <textarea
                  rows={3}
                  value={rcaFormData.rca_action_plan}
                  onChange={e => setRcaFormData({ ...rcaFormData, rca_action_plan: e.target.value })}
                  placeholder="ระบุข้อกำหนดการปรับปรุงระบบที่เป็นรูปธรรม เช่น 1. แยกตู้เก็บ 2. บังคับ Double Check 3. อัปเดต CPOE..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* RCA Section 5: Responsible & Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">ผู้รับผิดชอบหลักในการติดตามมาตรการ (Lead Owner)</label>
                  <input
                    type="text"
                    value={rcaFormData.rca_responsible}
                    onChange={e => setRcaFormData({ ...rcaFormData, rca_responsible: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">กำหนดแล้วเสร็จ (Target Completion Date)</label>
                  <input
                    type="date"
                    value={rcaFormData.rca_due_date}
                    onChange={e => setRcaFormData({ ...rcaFormData, rca_due_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                เมื่อบันทึกแล้ว รายงานจะเปลี่ยนสถานะเป็น "RCA เสร็จสมบูรณ์" และปลดล็อคให้ยืนยัน (Verify) ได้
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEUpReport(null)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveRca}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-rose-700 transition active:scale-95"
                >
                  <Save className="h-4 w-4" />
                  บันทึกผลการวิเคราะห์ RCA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Systemic Process CAPA Plan */}
      {processPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="border-b border-indigo-100 bg-indigo-50/80 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-700" />
                <h3 className="text-base font-bold text-slate-900">
                  เพิ่มมาตรการแก้ไขเชิงระบบสำหรับขั้นตอนที่มีอุบัติการณ์สูง (Process CAPA)
                </h3>
              </div>
              <button
                onClick={() => setProcessPlanModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProcessPlan} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">ขั้นตอนกระบวนการ (Process Step) *</label>
                  <select
                    value={newPlanForm.process_code}
                    onChange={e => setNewPlanForm({ ...newPlanForm, process_code: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white"
                  >
                    {PROCESS_OPTIONS.map(p => (
                      <option key={p.code} value={p.code}>
                        {p.code} - {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">เป้าหมายลดอุบัติการณ์ (%) *</label>
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={newPlanForm.target_reduction_pct}
                    onChange={e => setNewPlanForm({ ...newPlanForm, target_reduction_pct: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">ชื่อโครงการ / มาตรการเชิงระบบ *</label>
                <input
                  type="text"
                  placeholder="เช่น การบังคับใช้ 2D Barcode Verification ก่อนจ่ายยาผู้ป่วยนอก"
                  value={newPlanForm.analysis_title}
                  onChange={e => setNewPlanForm({ ...newPlanForm, analysis_title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">ชนิดย่อยที่พบบ่อย (Subtypes - คั่นด้วยจุลภาค)</label>
                <input
                  type="text"
                  placeholder="เช่น PDI-01 (จัดยาผิดชนิด), PDI-02 (จัดยาผิดความแรง)"
                  value={newPlanForm.top_subtypes}
                  onChange={e => setNewPlanForm({ ...newPlanForm, top_subtypes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">สรุปการวิเคราะห์สาเหตุเชิงระบบ (5M Summary) *</label>
                <textarea
                  rows={2}
                  placeholder="วิเคราะห์สาเหตุว่าทำไมขั้นตอนนี้ถึงเกิดอุบัติการณ์บ่อยครั้ง เช่น ชั้นวางใกล้กัน, แสงสว่าง, ชั่วโมงเร่งด่วน..."
                  value={newPlanForm.root_cause_summary}
                  onChange={e => setNewPlanForm({ ...newPlanForm, root_cause_summary: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">แผนปฏิบัติการแก้ไขและป้องกัน (Action Plan) *</label>
                <textarea
                  rows={3}
                  placeholder="ระบุข้อกำหนดมาตรการ เช่น 1. ติดป้าย Tall Man 2. ยิงบาร์โค้ด 3. ปรับหมุนเวียนเวร..."
                  value={newPlanForm.action_plan}
                  onChange={e => setNewPlanForm({ ...newPlanForm, action_plan: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">ทีมงานที่รับผิดชอบ *</label>
                  <input
                    type="text"
                    placeholder="เช่น ทีมเภสัชกรรมจ่ายยาผู้ป่วยนอก & ทีม IT"
                    value={newPlanForm.responsible_team}
                    onChange={e => setNewPlanForm({ ...newPlanForm, responsible_team: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">กำหนดเป้าหมายเวลา</label>
                  <input
                    type="date"
                    value={newPlanForm.target_date}
                    onChange={e => setNewPlanForm({ ...newPlanForm, target_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProcessPlanModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
                >
                  บันทึกแผนงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
