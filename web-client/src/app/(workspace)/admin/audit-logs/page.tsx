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
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAdminAuditLogs } from "@/features/admin/hooks";

export default function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const { data, isLoading } = useAdminAuditLogs({ per_page: 50 });
  const logs = data?.data || [];

  const filteredLogs = logs.filter((l: any) => {
    const actorName = l.actor?.name?.toLowerCase() || "";
    const actorEmail = l.actor?.email?.toLowerCase() || "";
    const action = l.action?.toLowerCase() || "";
    const description = l.description?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      actorName.includes(term) ||
      actorEmail.includes(term) ||
      action.includes(term) ||
      description.includes(term);

    const matchesSeverity =
      severityFilter === "all" ||
      (severityFilter === "critical" && l.severity === "high") ||
      (severityFilter === "warning" && (l.severity === "medium" || l.severity === "low")) ||
      (severityFilter === "info" && l.severity === "info");

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
            Lưu vết sự kiện an ninh phòng thi, nhật ký AI Copilot và các thao tác phân quyền nhạy cảm.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-[8px] border border-slate-200/90 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo người thực hiện, hành động, mô tả sự kiện..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Tất cả mức độ</option>
          <option value="critical">🔴 Mức cao (High / Critical)</option>
          <option value="warning">🟡 Cảnh báo (Medium / Warning)</option>
          <option value="info">🔵 Thông tin (Info)</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Đang cập nhật luồng nhật ký an ninh...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <div className="text-sm font-bold text-slate-700">Không có bản ghi nhật ký phù hợp</div>
            <div className="text-xs text-slate-400 mt-1">
              Hệ thống chưa ghi nhận vi phạm an ninh nào trong khoảng thời gian này.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Nguồn / Phân loại</th>
                  <th className="py-3 px-4">Người thực hiện</th>
                  <th className="py-3 px-4">Hành động</th>
                  <th className="py-3 px-4">Chi tiết sự kiện</th>
                  <th className="py-3 px-4 text-center">Mức độ</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLogs.map((log: any) => {
                  const timeFormatted = log.timestamp
                    ? new Date(log.timestamp).toLocaleTimeString("vi-VN") +
                      " " +
                      new Date(log.timestamp).toLocaleDateString("vi-VN")
                    : "--";

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {timeFormatted}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.category === "ai_copilot" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            AI Copilot
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            Giám sát
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {log.actor?.name || "Hệ thống"}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {log.actor?.email || log.actor?.role || "System"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {log.action}
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="text-slate-700 line-clamp-2 leading-relaxed">
                          {log.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.severity === "high" || log.severity === "critical"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : log.severity === "medium" || log.severity === "warning"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết Nhật Ký */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">
                  Nhật ký #{selectedLog.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800">
                  {selectedLog.action}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500">Người thực hiện: </span>
                <span className="font-semibold text-slate-900">
                  {selectedLog.actor?.name || "Hệ thống"} ({selectedLog.actor?.email})
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-500">Thời gian: </span>
                <span className="font-mono text-slate-700">{selectedLog.timestamp}</span>
              </div>

              <div>
                <span className="font-bold text-slate-500">Mô tả sự kiện: </span>
                <p className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800">
                  {selectedLog.description}
                </p>
              </div>

              {selectedLog.proposal_hash && (
                <div>
                  <span className="font-bold text-slate-500">Proposal Hash (AI Verification): </span>
                  <div className="font-mono text-[11px] bg-slate-100 p-2 rounded-lg break-all text-slate-800 mt-1">
                    {selectedLog.proposal_hash}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition"
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
