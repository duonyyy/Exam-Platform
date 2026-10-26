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
  CheckCircle2,
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
    action: "Nộp bài thi",
    details: "Chốt 38/40 câu hỏi • Điểm sơ bộ: 8.75 • Khóa bi quan hoàn tất",
    ipAddress: "192.168.1.45",
    status: "200 OK",
    severity: "info",
    payload: { endpoint: "POST /api/v1/exam-attempts/842/submit", attempt_id: 842, score: 8.75, idempotency_key: "idem-9831-af" },
  },
  {
    id: "log-2",
    timestamp: "08:41:02 - 17/10/2026",
    actor: "Lê Hoàng C (SV103)",
    actorRole: "student",
    action: "Rời màn hình / Chuyển tab",
    details: "Cảm biến ghi nhận sự kiện tab_hidden (Rời tab 12 giây)",
    ipAddress: "192.168.1.88",
    status: "201 Created",
    severity: "warning",
    payload: { endpoint: "POST /api/v1/exam-attempts/842/proctoring-events", event_type: "tab_hidden", duration_sec: 12, window_blurred: true },
  },
  {
    id: "log-3",
    timestamp: "08:15:30 - 17/10/2026",
    actor: "TS. Trần Minh Khoa",
    actorRole: "teacher",
    action: "Công bố ca thi",
    details: "Mở ca thi SES-IT4409 cho 45 sinh viên làm bài",
    ipAddress: "10.0.4.12",
    status: "200 OK",
    severity: "info",
    payload: { endpoint: "POST /api/v1/exam-sessions/101/publish", session_id: "session-101", questions_count: 40, students_count: 45 },
  },
  {
    id: "log-4",
    timestamp: "08:00:10 - 17/10/2026",
    actor: "Lê Hoàng Long",
    actorRole: "admin",
    action: "Đổi vai trò người dùng",
    details: "Phân vai trò tài khoản ID #45 từ Student thành Teacher",
    ipAddress: "10.0.1.2",
    status: "200 OK",
    severity: "critical",
    payload: { endpoint: "PUT /api/v1/admin/users/45/role", target_user_id: 45, old_role: "student", new_role: "teacher" },
  },
  {
    id: "log-5",
    timestamp: "07:55:00 - 17/10/2026",
    actor: "Hệ thống bảo vệ",
    actorRole: "system",
    action: "Đăng nhập thất bại liên tiếp",
    details: "Nhập sai mật khẩu 5 lần từ địa chỉ IP khả nghi • Kích hoạt giới hạn tốc độ",
    ipAddress: "203.113.152.1",
    status: "429 Rate Limit",
    severity: "critical",
    payload: { target_email: "admin@university.edu.vn", attempts_count: 5, blocked_minutes: 15 },
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Thanh Tra An Ninh &amp; Toàn Vẹn Khảo Thí</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Nhật Ký Kiểm Toán Toàn Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lưu vết truy cập API, tín hiệu cảm biến bất thường và mọi thao tác thay đổi phân quyền nhạy cảm.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Chức năng mô phỏng: Đang xuất dữ liệu nhật ký kiểm toán!")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Xuất nhật ký (CSV / JSON)</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-[8px] border border-slate-200/90 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tác nhân, hành động, IP..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[6px] border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-1.5 rounded-[6px] border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Mọi mức độ bảo mật</option>
          <option value="info">Thông tin (Info)</option>
          <option value="warning">Cảnh báo (Warning)</option>
          <option value="critical">Nghiêm trọng (Critical)</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-[8px] border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Tác nhân</th>
                <th className="px-4 py-3">Hành động</th>
                <th className="px-4 py-3">Chi tiết nghiệp vụ</th>
                <th className="px-4 py-3">Địa chỉ IP</th>
                <th className="px-4 py-3">Mã HTTP</th>
                <th className="px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{log.actor}</div>
                    <span className="text-[10px] text-slate-400 font-mono capitalize">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${
                        log.severity === "critical"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : log.severity === "warning"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {log.severity === "critical" && <ShieldAlert className="w-3 h-3 text-rose-600" />}
                      {log.severity === "warning" && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {log.severity === "info" && <CheckCircle2 className="w-3 h-3 text-slate-500" />}
                      <span>{log.action}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-sm">
                    {log.details}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">
                    {log.status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] text-slate-500 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition text-[11px] font-medium"
                      title="Xem dữ liệu kỹ thuật"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Xem</span>
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
          <div className="bg-white rounded-[8px] max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Chi Tiết Payload Nhật Ký</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedLog.action} • {selectedLog.timestamp}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-[6px] border border-slate-200">
              <div><strong className="text-slate-900">Tác nhân:</strong> {selectedLog.actor} ({selectedLog.actorRole})</div>
              <div><strong className="text-slate-900">Địa chỉ IP:</strong> {selectedLog.ipAddress}</div>
              <div><strong className="text-slate-900">Mô tả sự kiện:</strong> {selectedLog.details}</div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-1.5">Dữ liệu thô (Raw JSON):</div>
              <pre className="p-3 rounded-[6px] bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto max-h-60 border border-slate-800">
                {JSON.stringify(selectedLog.payload, null, 2)}
              </pre>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
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
