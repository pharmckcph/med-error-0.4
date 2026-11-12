import React from 'react';
import {
  Code2,
  Database,
  FileCode,
  History,
  Shield,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { store } from '../services/store';

export const AuditLogViewer: React.FC = () => {
  const logs = store.getAuditLogs();

  return (
    <div className="w-full space-y-6">
      {/* Top Banner with Login Cover Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-6 sm:p-7 shadow-lg border border-purple-800/30">
        {/* Floating organic 3D spheres matching Login Cover theme */}
        <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-fuchsia-500 opacity-60 shadow-2xl absolute -bottom-14 -left-10 blur-[1px] pointer-events-none"></div>
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-purple-800 opacity-45 absolute -top-12 -right-8 blur-xs pointer-events-none"></div>
        <div className="w-28 h-28 rounded-full bg-fuchsia-500/25 absolute top-1/2 right-1/3 -translate-y-1/2 blur-lg pointer-events-none"></div>
        <div className="w-64 h-64 rounded-full bg-purple-500/20 blur-3xl absolute -top-16 -right-16 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-purple-100 text-[11px] font-semibold mb-1 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Medication Safety Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <History className="w-6 h-6 text-purple-300" />
              <span>LOG: ประวัติการเปลี่ยนแปลง (Audit Trail)</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal max-w-2xl">
              บันทึกทุกการกระทำ (Create, Update, Delete, Verify, RCA Update) ตามข้อกำหนดความปลอดภัยข้อมูลสากล
            </p>
          </div>
          <div className="relative z-10 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-semibold text-purple-100 self-start sm:self-auto shadow-xs">
            {logs.length} Log Entries
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-700" />
              <span>รายการบันทึกประวัติ (Audit Log Entries)</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} Log Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">วันเวลา (Timestamp)</th>
                <th className="py-3 px-4">ผู้กระทำ (Actor)</th>
                <th className="py-3 px-4">Entity & Action</th>
                <th className="py-3 px-4">รายละเอียดการเปลี่ยนแปลง (Changes Payload)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {new Date(log.created_at).toLocaleString('th-TH')}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-sans">
                    <span className="font-bold text-slate-900">{log.actor_name}</span>
                    <span className="text-[11px] text-slate-400 block">({log.actor_role})</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-slate-500 block font-mono mt-0.5">
                      {log.entity}:{log.entity_id}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-lg">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 max-h-24 overflow-y-auto">
                      {typeof log.changes === 'object' ? JSON.stringify(log.changes, null, 2) : String(log.changes)}
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-sans">
                    ยังไม่มีรายการบันทึกประวัติเพิ่มเติม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cloudflare D1 Architecture Reference Box */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 shadow-sm border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Database className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold">Cloudflare D1 SQLite Architecture Reference</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          โครงสร้างฐานข้อมูล Cloudflare D1 ออกแบบมาเพื่อประสิทธิภาพสูงและความปลอดภัยด้วย Prepared Statements ป้องกัน SQL Injection โดยสมบูรณ์ แบ่งออกเป็น 8 ตารางหลัก:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-blue-300 font-bold block mb-1">1. departments</span>
            <span className="text-slate-400 text-[11px]">id, code UNIQUE, name, active</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-blue-300 font-bold block mb-1">2. users</span>
            <span className="text-slate-400 text-[11px]">id, display_name, role CHECK, department_id, active</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-blue-300 font-bold block mb-1">3. master_options</span>
            <span className="text-slate-400 text-[11px]">category, code, label, parent_code, sort_order</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-blue-300 font-bold block mb-1">4. error_events</span>
            <span className="text-slate-400 text-[11px]">20 fields, report_no UNIQUE, status, rca_status, rca_summary, rca_action_plan</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-blue-300 font-bold block mb-1">5. process_rca_plans</span>
            <span className="text-slate-400 text-[11px]">process_code, analysis_title, root_cause_summary, action_plan, target_reduction_pct</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-blue-300 font-bold block mb-1">6. status_history</span>
            <span className="text-slate-400 text-[11px]">event_id, action, from_status, to_status, comment</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-blue-300 font-bold block mb-1">7. audit_log</span>
            <span className="text-slate-400 text-[11px]">entity, entity_id, action, changes JSON, actor_id</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 md:col-span-2 lg:col-span-2">
            <span className="text-blue-300 font-bold block mb-1">8. hosxp_rows (2-Stage Staging Queue)</span>
            <span className="text-slate-400 text-[11px]">source_key UNIQUE (SHA-256), filename, raw JSON, proposed JSON, notes JSON, status CHECK (review, imported, rejected)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
