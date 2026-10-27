"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  Clock,
  Users,
  Radio,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { useExamSessions } from "@/features/exams/hooks";

export default function TeacherSessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useExamSessions({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const sessions = data?.data || [];

  const filteredSessions = sessions.filter((s: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      String(s.id).includes(term) ||
      (s.exam?.title && s.exam.title.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Quản Lý &amp; Lập Lịch Ca Thi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lập lịch phòng thi, phân bổ danh sách sinh viên dự thi và giám sát tiến độ coi thi trực tiếp.
          </p>
        </div>

        <Link href="/teacher/exams">
          <ThiSmartCtaButton variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            Chọn đề thi để lập ca
          </ThiSmartCtaButton>
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên ca thi, mã ca thi..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã công bố (Published)</option>
          <option value="draft">Bản nháp (Draft)</option>
          <option value="closed">Đã kết thúc (Closed)</option>
        </select>
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">Đang truy vấn lịch ca thi...</span>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <div className="text-sm font-bold text-slate-700">Chưa có ca thi nào được tạo</div>
          <div className="text-xs text-slate-400 mt-1">
            Bấm &quot;Chọn đề thi để lập ca&quot; để lên lịch tổ chức thi cho sinh viên.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session: any) => {
            const subjectCode = session.exam?.subject?.code || "IT";
            const startFormatted = new Date(session.start_at).toLocaleString("vi-VN");
            const endFormatted = new Date(session.end_at).toLocaleTimeString("vi-VN");

            return (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 transition shadow-xs hover:border-blue-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {subjectCode}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      SES-{session.id}
                    </span>

                    {session.status === "published" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3" />
                        ĐÃ XUẤT BẢN
                      </span>
                    )}

                    {session.status === "draft" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3 h-3" />
                        BẢN NHÁP
                      </span>
                    )}

                    {session.status === "closed" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        ĐÃ KẾT THÚC
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {session.title}
                  </h3>

                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Đề thi: {session.exam?.title || `#${session.exam_id}`}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {startFormatted} - {endFormatted} ({session.exam?.duration_minutes ?? 60} phút)
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {session.assignments_count ?? 0} Thí sinh được gán
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <Link
                    href={`/teacher/sessions/${session.id}/results`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Báo cáo phổ điểm</span>
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
