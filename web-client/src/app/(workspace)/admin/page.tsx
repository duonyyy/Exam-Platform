"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Calendar,
  ShieldCheck,
  Server,
  Activity,
  ArrowRight,
  Database,
  Cpu,
  Zap,
  Settings,
  CheckCircle2,
  Clock,
  Radio,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { useAdminDashboardStats } from "@/features/admin/hooks";

export default function AdminOverviewPage() {
  const { data, isLoading } = useAdminDashboardStats();
  const stats = data?.data;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quản trị viên Cấp cao • Hệ Thống Khảo Thí</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bảng Điều Khiển Vận Hành Toàn Trường
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Giám sát thời gian thực hạ tầng tổ chức thi, số lượng người dùng và nhật ký an ninh hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition shadow-xs"
          >
            <Users className="w-4 h-4" />
            <span>Quản trị tài khoản</span>
          </Link>
        </div>
      </div>

      {/* Campus-Wide Metrics Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="text-xs font-semibold">Đang cập nhật chỉ số vận hành thời gian thực...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Tổng số sinh viên</span>
              <div className="w-8 h-8 rounded-[6px] bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {stats?.users.students ?? 0}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{stats?.users.total ?? 0} tổng tài khoản</span>
            </div>
          </div>

          <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Giảng viên phụ trách</span>
              <div className="w-8 h-8 rounded-[6px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {stats?.users.teachers ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats?.academics.total_subjects ?? 0} môn học hoạt động
            </div>
          </div>

          <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Ngân hàng câu hỏi</span>
              <div className="w-8 h-8 rounded-[6px] bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {stats?.academics.total_questions ?? 0}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
              <span>{stats?.academics.total_topics ?? 0} chủ đề kiến thức</span>
            </div>
          </div>

          <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Ca thi &amp; Lượt làm bài</span>
              <div className="w-8 h-8 rounded-[6px] bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2 tracking-tight">
              {stats?.exams.total_sessions ?? 0}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              {stats?.attempts.total_attempts ?? 0} lượt nộp bài
            </div>
          </div>
        </div>
      )}

      {/* Real-time System Load & Concurrency Advisory */}
      <div className="p-5 rounded-[8px] bg-emerald-50/70 border border-emerald-200 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Trạng thái vận hành: Ổn định • {stats?.attempts.in_progress ?? 0} thí sinh đang trực tiếp làm bài
              </h3>
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                BÌNH THƯỜNG
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Cảnh báo an ninh hôm nay: <strong>{stats?.security_alerts_today ?? 0}</strong> • Hệ thống bảo vệ phòng thi và giám sát AI Copilot đang hoạt động.
            </p>
          </div>
        </div>

        <Link
          href="/admin/audit-logs"
          className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs shadow-xs transition shrink-0 inline-flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Xem nhật ký an ninh</span>
        </Link>
      </div>

      {/* Core Infrastructure & Services Health */}
      <div className="bg-white rounded-[8px] border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Tình trạng dịch vụ cốt lõi</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Tự động cập nhật mỗi 30s
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Database */}
          <div className="p-4 rounded-[6px] bg-slate-50/70 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                CSDL Khảo thí (Postgres/SQLite)
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-1.5 py-0.5 rounded-[4px]">
                KẾT NỐI OK
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {stats?.academics.total_questions ?? 0} câu hỏi
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full w-full" />
            </div>
          </div>

          {/* AI Copilot */}
          <div className="p-4 rounded-[6px] bg-slate-50/70 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                ExamOps AI Copilot
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-1.5 py-0.5 rounded-[4px]">
                PORT 8001
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">Gemini 3.5 Flash</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full w-full" />
            </div>
          </div>

          {/* Core API */}
          <div className="p-4 rounded-[6px] bg-slate-50/70 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Laravel 13 REST API
              </span>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100/80 border border-blue-300 px-1.5 py-0.5 rounded-[4px]">
                PORT 8000
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">58 Endpoints /v1</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/users"
          className="group block p-5 rounded-[8px] bg-white border border-slate-200/90 shadow-xs hover:border-purple-400 hover:shadow-sm transition"
        >
          <div className="w-10 h-10 rounded-[6px] bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition">
              Quản trị người dùng &amp; Phân quyền
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Phân vai trò (Admin, Teacher, Student), kích hoạt tài khoản sinh viên hoặc tạm khóa người dùng vi phạm.
          </p>
        </Link>

        <Link
          href="/admin/audit-logs"
          className="group block p-5 rounded-[8px] bg-white border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-sm transition"
        >
          <div className="w-10 h-10 rounded-[6px] bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Nhật ký kiểm toán &amp; AI Copilot
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Thanh tra an ninh toàn bộ sự kiện giám sát phòng thi, duyệt blueprint AI và truy vết tác vụ hệ thống.
          </p>
        </Link>
      </div>
    </div>
  );
}
