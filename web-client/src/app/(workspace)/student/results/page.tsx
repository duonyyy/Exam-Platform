"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
} from "lucide-react";

interface PastResultItem {
  attemptId: string;
  subjectCode: string;
  subjectName: string;
  sessionTitle: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  isPassed: boolean;
  totalQuestions: number;
  correctCount: number;
  durationMinutes: number;
}

const MOCK_PAST_RESULTS: PastResultItem[] = [
  {
    attemptId: "ATT-20261017-SV101-842",
    subjectCode: "IT4409",
    subjectName: "Lập trình Web Nâng Cao",
    sessionTitle: "Kiểm tra Giữa kỳ - Học kỳ I 2026",
    submittedAt: "08:52, 17/10/2026",
    score: 8.75,
    maxScore: 10.0,
    isPassed: true,
    totalQuestions: 40,
    correctCount: 35,
    durationMinutes: 52,
  },
  {
    attemptId: "ATT-20261010-SV101-301",
    subjectCode: "NET202",
    subjectName: "Mạng Máy Tính & An Ninh Hệ Thống",
    sessionTitle: "Đánh giá Thực hành Giữa kỳ",
    submittedAt: "10:45, 10/10/2026",
    score: 9.25,
    maxScore: 10.0,
    isPassed: true,
    totalQuestions: 40,
    correctCount: 37,
    durationMinutes: 48,
  },
  {
    attemptId: "ATT-20260928-SV101-112",
    subjectCode: "DB301",
    subjectName: "Cơ sở Dữ liệu Phân tán",
    sessionTitle: "Kiểm tra Quá trình 1",
    submittedAt: "14:30, 28/09/2026",
    score: 8.0,
    maxScore: 10.0,
    isPassed: true,
    totalQuestions: 30,
    correctCount: 24,
    durationMinutes: 40,
  },
];

export default function StudentResultsListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = MOCK_PAST_RESULTS.filter(
    (item) =>
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Lịch sử & Kết quả Bài thi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tra cứu kết quả các ca thi đã hoàn thành và xem lại chi tiết bài làm.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo môn học, ca thi..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Tổng số bài đã thi</div>
          <div className="text-2xl font-black text-slate-900 mt-1">03 ca thi</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">100% tỷ lệ đạt chuẩn</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Điểm trung bình tích lũy</div>
          <div className="text-2xl font-black text-blue-600 mt-1">8.67 / 10</div>
          <div className="text-[11px] text-slate-500 mt-1">Học lực: Giỏi</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Điểm cao nhất</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">9.25</div>
          <div className="text-[11px] text-slate-500 mt-1">Môn: Mạng Máy Tính</div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredResults.map((result) => (
          <div
            key={result.attemptId}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition group flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {result.subjectCode}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {result.subjectName}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Đạt
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                {result.sessionTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {result.submittedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {result.durationMinutes} phút
                </span>
                <span className="flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                  {result.correctCount}/{result.totalQuestions} câu đúng
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Điểm số</div>
                <div className="text-2xl font-black text-blue-600">
                  {result.score.toFixed(2)}
                  <span className="text-xs text-slate-400 font-normal"> / {result.maxScore}</span>
                </div>
              </div>

              <Link
                href={`/student/results/${result.attemptId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition group-hover:shadow-xs"
              >
                <span>Xem chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
