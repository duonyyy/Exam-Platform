"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart3,
  ArrowLeft,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { ExportReportButtons } from "@/features/results";
import { useSessionResults } from "@/features/exams/hooks";

export default function TeacherSessionResultsPage() {
  const params = useParams();
  const rawSessionId = params?.id as string || "1";
  const numericSessionId = Number(rawSessionId.replace(/\D/g, "")) || 1;

  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  const { data, isLoading } = useSessionResults(numericSessionId);
  const liveResults = data?.data;

  // Scoreboard candidates from API
  const scoreboard = liveResults?.scoreboard || [];
  const stats = liveResults?.statistics;
  const summary = liveResults?.summary;
  const histogram = liveResults?.histogram || [];
  const sessionTitle = liveResults?.session?.title || `Ca thi #${numericSessionId}`;

  const filteredCandidates = scoreboard.filter((c: any) => {
    const nameMatch = !searchTerm || (c.student_name && c.student_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const idMatch = !searchTerm || (c.student_id && String(c.student_id).includes(searchTerm));
    const gradeMatch = gradeFilter === "all" || c.grade === gradeFilter;
    return (nameMatch || idMatch) && gradeMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/sessions"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Báo Cáo Điểm Số &amp; Phổ Điểm Ca Thi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {sessionTitle} • Phân tích phổ điểm, tính toán độ lệch chuẩn và đánh giá độ phân biệt.
            </p>
          </div>
        </div>

        <ExportReportButtons sessionId={numericSessionId} sessionTitle={sessionTitle} />
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">Đang tổng hợp báo cáo phổ điểm thời gian thực...</span>
        </div>
      ) : (
        <>
          {/* Statistical Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Dự thi</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {summary?.total_participants ?? 0} / {summary?.total_assigned ?? 0}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {summary?.attendance_rate ?? 0}% tham gia
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Điểm trung bình</div>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {stats?.avg_score !== undefined ? Number(stats.avg_score).toFixed(2) : "--"}
              </div>
              <div className="text-[11px] text-slate-400">
                Trung vị: {stats?.median_score !== undefined ? Number(stats.median_score).toFixed(2) : "--"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Độ lệch chuẩn (SD)</div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {stats?.std_deviation !== undefined ? Number(stats.std_deviation).toFixed(2) : "--"}
              </div>
              <div className="text-[11px] text-slate-400">Độ phân biệt</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Điểm cao nhất</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {stats?.max_score !== undefined ? Number(stats.max_score).toFixed(2) : "--"}
              </div>
              <div className="text-[11px] text-slate-400">Thủ khoa ca thi</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Điểm thấp nhất</div>
              <div className="text-2xl font-black text-rose-700 mt-1">
                {stats?.min_score !== undefined ? Number(stats.min_score).toFixed(2) : "--"}
              </div>
              <div className="text-[11px] text-slate-400">Điểm sàn</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Tỷ lệ Đạt (Pass)</div>
              <div className="text-2xl font-black text-cyan-600 mt-1">
                {stats?.pass_rate !== undefined ? `${stats.pass_rate}%` : "--"}
              </div>
              <div className="text-[11px] text-slate-400">
                {stats?.passed_count ?? 0} sinh viên đạt
              </div>
            </div>
          </div>

          {/* Score Distribution Histogram */}
          {histogram.length > 0 && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Biểu Đồ Phổ Điểm Ca Thi (Histogram)
              </h2>

              <div className="grid grid-cols-5 gap-3 pt-4">
                {histogram.map((item: any) => (
                  <div key={item.range_label || item.range} className="flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-xl h-44 flex items-end p-2 justify-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-lg transition-all duration-500 hover:opacity-90 flex flex-col items-center justify-between py-2 text-white font-bold text-xs shadow-xs"
                        style={{ height: `${Math.max((item.percent || 0) * 1.8, 15)}%` }}
                      >
                        <span>{item.count}</span>
                        <span className="text-[10px] opacity-80">{item.percent}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 text-center">
                      {item.range_label || item.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Candidate Score Table */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Bảng Điểm Chi Tiết Thí Sinh ({filteredCandidates.length})
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm thí sinh..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="all">Mọi xếp loại</option>
                  <option value="Xuất sắc">Xuất sắc</option>
                  <option value="Giỏi">Giỏi</option>
                  <option value="Khá">Khá</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Chưa đạt">Chưa đạt</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">STT</th>
                    <th className="px-4 py-3">Mã SV</th>
                    <th className="px-4 py-3">Họ và tên</th>
                    <th className="px-4 py-3">Điểm số</th>
                    <th className="px-4 py-3">Thời gian nộp</th>
                    <th className="px-4 py-3">Cảnh báo</th>
                    <th className="px-4 py-3">Xếp loại</th>
                    <th className="px-4 py-3 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        Chưa có dữ liệu bài nộp cho ca thi này.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c: any, idx: number) => (
                      <tr key={c.student_id || idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-semibold text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">
                          {c.student_code || `SV${c.student_id}`}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{c.student_name}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-black text-blue-600">
                            {c.score !== null && c.score !== undefined ? Number(c.score).toFixed(2) : "--"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {c.submitted_at ? new Date(c.submitted_at).toLocaleTimeString("vi-VN") : "Chưa nộp"}
                        </td>
                        <td className="px-4 py-3">
                          {(c.violation_count || c.warningCount || 0) > 0 ? (
                            <span className="text-rose-600 font-bold">
                              {c.violation_count || c.warningCount} cảnh báo
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.is_passed
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {c.grade || (c.is_passed ? "Đạt" : "Chưa đạt")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {c.attempt_id ? (
                            <Link
                              href={`/exam/${c.attempt_id}`}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                              <span>Xem bài</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          ) : (
                            <span className="text-slate-400">--</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
