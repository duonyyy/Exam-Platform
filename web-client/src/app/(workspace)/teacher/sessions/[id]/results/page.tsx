"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart3,
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  Award,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";

interface CandidateScoreItem {
  id: string;
  studentId: string;
  name: string;
  score: number;
  durationMinutes: number;
  warningCount: number;
  grade: "Xuất sắc" | "Giỏi" | "Khá" | "Trung bình" | "Chưa đạt";
  isPassed: boolean;
  attemptId: string;
}

const MOCK_RESULTS: CandidateScoreItem[] = [
  {
    id: "r-1",
    studentId: "SV2026104",
    name: "Phạm Minh D",
    score: 9.5,
    durationMinutes: 48,
    warningCount: 0,
    grade: "Xuất sắc",
    isPassed: true,
    attemptId: "ATT-SV104-01",
  },
  {
    id: "r-2",
    studentId: "SV2026101",
    name: "Nguyễn Văn A",
    score: 8.75,
    durationMinutes: 52,
    warningCount: 1,
    grade: "Giỏi",
    isPassed: true,
    attemptId: "ATT-SV101-01",
  },
  {
    id: "r-3",
    studentId: "SV2026102",
    name: "Trần Thị B",
    score: 7.75,
    durationMinutes: 55,
    warningCount: 0,
    grade: "Khá",
    isPassed: true,
    attemptId: "ATT-SV102-01",
  },
  {
    id: "r-4",
    studentId: "SV2026106",
    name: "Hoàng Thị Mai",
    score: 6.5,
    durationMinutes: 58,
    warningCount: 1,
    grade: "Trung bình",
    isPassed: true,
    attemptId: "ATT-SV106-01",
  },
  {
    id: "r-5",
    studentId: "SV2026103",
    name: "Lê Hoàng C",
    score: 4.25,
    durationMinutes: 60,
    warningCount: 3,
    grade: "Chưa đạt",
    isPassed: false,
    attemptId: "ATT-SV103-01",
  },
];

const HISTOGRAM_DATA = [
  { range: "0 - 2.0", count: 0, percent: 0 },
  { range: "2.0 - 4.0", count: 0, percent: 0 },
  { range: "4.0 - 6.0", count: 3, percent: 7 },
  { range: "6.0 - 8.0", count: 22, percent: 51 },
  { range: "8.0 - 10.0", count: 18, percent: 42 },
];

export default function TeacherSessionResultsPage() {
  const params = useParams();
  const sessionId = params?.id as string || "session-101";

  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  const filteredCandidates = MOCK_RESULTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === "all" || c.grade === gradeFilter;
    return matchesSearch && matchesGrade;
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
              Báo Cáo Điểm Số & Phổ Điểm Ca Thi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân tích phổ điểm, tính toán độ lệch chuẩn và đánh giá độ phân biệt đề thi.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Chức năng mô phỏng: Đang xuất file Excel kết quả ca thi!")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition shadow-xs hover:border-slate-300"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Xuất bảng điểm Excel</span>
        </button>
      </div>

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Dự thi</div>
          <div className="text-2xl font-black text-slate-900 mt-1">43 / 45</div>
          <div className="text-[11px] text-emerald-700 font-medium">95.5% tham gia</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Điểm trung bình</div>
          <div className="text-2xl font-black text-blue-600 mt-1">7.42</div>
          <div className="text-[11px] text-slate-400">Trung vị: 7.50</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Độ lệch chuẩn (SD)</div>
          <div className="text-2xl font-black text-slate-800 mt-1">1.15</div>
          <div className="text-[11px] text-slate-400">Độ phân biệt: Tốt</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Điểm cao nhất</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">9.75</div>
          <div className="text-[11px] text-slate-400">01 Thí sinh</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Điểm thấp nhất</div>
          <div className="text-2xl font-black text-rose-700 mt-1">4.25</div>
          <div className="text-[11px] text-slate-400">01 Thí sinh</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Tỷ lệ Đạt (Pass)</div>
          <div className="text-2xl font-black text-cyan-600 mt-1">93.0%</div>
          <div className="text-[11px] text-slate-400">40/43 sinh viên</div>
        </div>
      </div>

      {/* Score Distribution Histogram */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Biểu Đồ Phổ Điểm Ca Thi (Histogram)
        </h2>

        <div className="grid grid-cols-5 gap-3 pt-4">
          {HISTOGRAM_DATA.map((item) => (
            <div key={item.range} className="flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 rounded-xl h-44 flex items-end p-2 justify-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-lg transition-all duration-500 hover:opacity-90 flex flex-col items-center justify-between py-2 text-white font-bold text-xs shadow-xs"
                  style={{ height: `${Math.max(item.percent * 1.8, 15)}%` }}
                >
                  <span>{item.count}</span>
                  <span className="text-[10px] opacity-80">{item.percent}%</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 text-center">
                {item.range}
              </span>
            </div>
          ))}
        </div>
      </div>

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
                <th className="px-4 py-3">Thời gian làm</th>
                <th className="px-4 py-3">Cảnh báo</th>
                <th className="px-4 py-3">Xếp loại</th>
                <th className="px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{c.studentId}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-black text-blue-600">
                      {c.score.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.durationMinutes} phút</td>
                  <td className="px-4 py-3">
                    {c.warningCount > 0 ? (
                      <span className="text-rose-600 font-bold">{c.warningCount} cảnh báo</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isPassed
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {c.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/student/results/${c.attemptId}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <span>Xem bài</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
