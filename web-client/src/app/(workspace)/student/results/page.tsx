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
  Loader2,
  HelpCircle,
} from "lucide-react";
import { useStudentAttempts } from "@/features/student/hooks/useStudentAttempts";

export default function StudentResultsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useStudentAttempts();

  const attempts = data?.data || [];

  const filteredResults = attempts.filter((item: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const subName = item.subject?.name?.toLowerCase() || "";
    const subCode = item.subject?.code?.toLowerCase() || "";
    const sessionTitle = item.session?.title?.toLowerCase() || "";
    return subName.includes(term) || subCode.includes(term) || sessionTitle.includes(term);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-blue-600" />
          Lịch Sử &amp; Kết Quả Làm Bài
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hồ sơ bài thi đã nộp, bảng điểm chi tiết và chứng nhận kết quả qua từng kỳ thi.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo môn học, tên ca thi..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Results List */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">Đang truy vấn lịch sử làm bài...</span>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <div className="text-sm font-bold text-slate-700">Chưa có kết quả bài thi nào</div>
          <div className="text-xs text-slate-400 mt-1">
            Các lượt làm bài sau khi bạn hoàn thành và nộp sẽ được lưu trữ và tổng hợp tại đây.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((item: any) => {
            const subjectCode = item.subject?.code || "GEN";
            const subjectName = item.subject?.name || "Môn học";
            const sessionTitle = item.session?.title || "Ca thi";
            const submittedFormatted = item.submitted_at
              ? new Date(item.submitted_at).toLocaleString("vi-VN")
              : "Đang làm bài";

            return (
              <div
                key={item.attempt_id}
                className="p-5 rounded-2xl bg-white border border-slate-200 transition shadow-xs hover:border-blue-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {subjectCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{subjectName}</h3>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    {sessionTitle}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Nộp lúc: {submittedFormatted}
                    </span>
                    <span className="font-mono text-slate-400">
                      Lượt thi #{item.attempt_id}
                    </span>
                  </div>
                </div>

                {/* Score badge & Detail button */}
                <div className="flex items-center gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">
                      {item.score !== null ? Number(item.score).toFixed(2) : "--"}
                      <span className="text-xs font-normal text-slate-400">
                        /{item.total_points ?? 10}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] font-bold">
                      {item.is_passed ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đạt yêu cầu
                        </span>
                      ) : item.score !== null ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Chưa đạt sàn
                        </span>
                      ) : (
                        <span className="text-amber-600">Đang chấm điểm</span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/exam/${item.attempt_id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    <span>Xem lại phòng thi</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
