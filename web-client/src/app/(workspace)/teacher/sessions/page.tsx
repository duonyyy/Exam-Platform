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
  Send,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";

interface ExamSessionItem {
  id: string;
  code: string;
  title: string;
  examTitle: string;
  subjectCode: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  assignedStudentsCount: number;
  proctorsCount: number;
  status: "draft" | "published" | "in_progress" | "closed";
}

const MOCK_SESSIONS: ExamSessionItem[] = [
  {
    id: "session-101",
    code: "SES-20261019-IT4409-01",
    title: "Kiểm tra Giữa kỳ - Nhóm 01 - Học kỳ I 2026",
    examTitle: "Đề thi Giữa kỳ - Lập trình Web Nâng Cao (Đề 1)",
    subjectCode: "IT4409",
    startAt: "08:00, 19/10/2026",
    endAt: "09:30, 19/10/2026",
    durationMinutes: 60,
    assignedStudentsCount: 45,
    proctorsCount: 2,
    status: "in_progress",
  },
  {
    id: "session-102",
    code: "SES-20261025-CS201-01",
    title: "Thi Kết thúc Học phần - Cấu trúc Dữ liệu Đợt 1",
    examTitle: "Đề thi Kết thúc Học phần - CS201",
    subjectCode: "CS201",
    startAt: "14:00, 25/10/2026",
    endAt: "15:45, 25/10/2026",
    durationMinutes: 90,
    assignedStudentsCount: 60,
    proctorsCount: 3,
    status: "published",
  },
  {
    id: "session-103",
    code: "SES-20261028-DB301-02",
    title: "Kiểm tra Quá trình 2 - CSDL Phân tán",
    examTitle: "Đề thi Kiểm tra Quá trình 2 - DB301",
    subjectCode: "DB301",
    startAt: "08:30, 28/10/2026",
    endAt: "09:30, 28/10/2026",
    durationMinutes: 45,
    assignedStudentsCount: 0,
    proctorsCount: 1,
    status: "draft",
  },
  {
    id: "session-104",
    code: "SES-20261010-NET202-01",
    title: "Đánh giá Thực hành Mạng Máy Tính",
    examTitle: "Đề thực hành Giữa kỳ NET202",
    subjectCode: "NET202",
    startAt: "10:00, 10/10/2026",
    endAt: "11:00, 10/10/2026",
    durationMinutes: 60,
    assignedStudentsCount: 42,
    proctorsCount: 2,
    status: "closed",
  },
];

export default function TeacherSessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSessions = MOCK_SESSIONS.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Quản Lý & Lập Lịch Ca Thi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lập lịch phòng thi, phân bổ danh sách sinh viên dự thi và chỉ định cán bộ coi thi.
          </p>
        </div>

        <Link href="/teacher/sessions/session-new/edit">
          <ThiSmartCtaButton variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            Lập lịch ca thi mới
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
            placeholder="Tìm theo tên ca thi, mã ca (SES-...)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="in_progress">🔴 Đang diễn ra (In Progress)</option>
          <option value="published">Đã công bố (Published)</option>
          <option value="draft">Bản nháp (Draft)</option>
          <option value="closed">Đã kết thúc (Closed)</option>
        </select>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-3">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className={`p-5 rounded-2xl bg-white border transition shadow-xs hover:border-blue-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
              session.status === "in_progress" ? "border-rose-300 ring-2 ring-rose-500/10" : "border-slate-200"
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {session.subjectCode}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  {session.code}
                </span>

                {/* Status Badges */}
                {session.status === "in_progress" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    ĐANG DIỄN RA (LIVE)
                  </span>
                )}

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
                <span>Đề thi: {session.examTitle}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {session.startAt} - {session.endAt} ({session.durationMinutes} phút)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {session.assignedStudentsCount} Thí sinh được gán
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  {session.proctorsCount} Cán bộ coi thi
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              {session.status === "in_progress" && (
                <Link
                  href={`/teacher/sessions/${session.id}/monitor`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition shadow-xs"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Vào phòng Giám sát</span>
                </Link>
              )}

              {session.status === "closed" && (
                <Link
                  href={`/teacher/sessions/${session.id}/results`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Báo cáo phổ điểm</span>
                </Link>
              )}

              <Link
                href={`/teacher/sessions/${session.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                <span>Cấu hình & Danh sách</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
