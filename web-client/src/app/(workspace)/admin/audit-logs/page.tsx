"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
  Eye,
  FileCode,
  X,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: "student" | "teacher" | "admin" | "system";
  action: string;
  details: string;
  ipAddress: string;
  status: string;
  severity: "info" | "warning" | "critical";
  payload?: Record<string, any>;
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    timestamp: "08:52:14 - 17/10/2026",
    actor: "Nguyễn Văn A (SV101)",
    actorRole: "student",
    action: "Submit Attempt",
    details: "POST /api/v1/exam-attempts/842/submit • Chốt 38/40 câu",
    ipAddress: "192.168.1.45",
    status: "200 OK",
    severity: "info",
    payload: { attempt_id: 842, score: 8.75, idempotency_key: "idem-9831-af" },
  },
  {
    id: "log-2",
    timestamp: "08:41:02 - 17/10/2026",
    actor: "Lê Hoàng C (SV103)",
    actorRole: "student",
    action: "Sensor Alert (Proctoring)",
    details: "Cảm biến ghi nhận sự kiện tab_hidden (Rời tab 12 giây)",
    ipAddress: "192.168.1.88",
    status: "201 Created",
    severity: "warning",
    payload: { event_type: "tab_hidden", duration_sec: 12, window_blurred: true },
  },
  {
    id: "log-3",
    timestamp: "08:15:30 - 17/10/2026",
    actor: "TS. Trần Minh Khoa",
    actorRole: "teacher",
    action: "Publish Exam Session",
    details: "Chuyển trạng thái ca thi SES-IT4409 sang PUBLISHED (45 SV)",
    ipAddress: "10.0.4.12",
    status: "200 OK",
    severity: "info",
    payload: { session_id: "session-101", questions_count: 40, students_count: 45 },
  },
  {
    id: "log-4",
    timestamp: "08:00:10 - 17/10/2026",
    actor: "Lê Hoàng Long",
    actorRole: "admin",
    action: "Change User Role",
    details: "Phân vai trò người dùng ID #45 từ Student -> Teacher",
    ipAddress: "10.0.1.2",
    status: "200 OK",
    severity: "critical",
    payload: { target_user_id: 45, old_role: "student", new_role: "teacher" },
  },
  {
    id: "log-5",
    timestamp: "07:55:00 - 17/10/2026",
    actor: "Anonymous",
    actorRole: "system",
    action: "Failed Login Attempt",
    details: "Đăng nhập sai mật khẩu 5 lần liên tiếp từ IP khả nghi",
    ipAddress: "203.113.152.1",
    status: "429 Too Many Requests",
    severity: "critical",
    payload: { email: "admin@university.edu.vn", rate_limit_hit: true },
  },
];

export default function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = MOCK_AUDIT_LOGS.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.includes(searchTerm);
    const matchesSeverity = severityFilter === "all" || l.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Nhật Ký Kiểm Toán & Thanh Tra An Ninh
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lưu vết toàn bộ truy vết API, sự kiện cảm biến gian lận và các thao tác thay đổi phân quyền hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Chức năng mô phỏng: Đang xuất file JSON audit log!")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Log Audit (CSV/JSON)</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tác nhân, hành động, IP..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Mọi mức độ (Severity)</option>
          <option value="info">Thông tin (Info)</option>
          <option value="warning">Cảnh báo (Warning)</option>
          <option value="critical">Nghiêm trọng (Critical)</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Thời gian</th>
                <th className="px-5 py-3.5">Tác nhân</th>
                <th className="px-5 py-3.5">Hành động</th>
                <th className="px-5 py-3.5">Chi tiết sự kiện</th>
                <th className="px-5 py-3.5">Địa chỉ IP</th>
                <th className="px-5 py-3.5">Mã HTTP</th>
                <th className="px-5 py-3.5 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{log.actor}</div>
                    <span className="text-[10px] text-slate-400 font-medium capitalize">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        log.severity === "critical"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : log.severity === "warning"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {log.severity === "critical" && <ShieldAlert className="w-3 h-3" />}
                      {log.severity === "warning" && <AlertTriangle className="w-3 h-3" />}
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-700">
                    {log.status}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Xem dữ liệu JSON"
                    >
                      <FileCode className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Chi Tiết Payload Nhật Ký</h3>
                <p className="text-xs text-slate-500">{selectedLog.action} • {selectedLog.timestamp}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div><strong>Tác nhân:</strong> {selectedLog.actor}</div>
              <div><strong>Địa chỉ IP:</strong> {selectedLog.ipAddress}</div>
              <div><strong>Hành động:</strong> {selectedLog.details}</div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-1">Dữ liệu thô (Raw Payload):</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto max-h-60">
                {JSON.stringify(selectedLog.payload, null, 2)}
              </pre>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
