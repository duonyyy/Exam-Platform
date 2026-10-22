"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  FileText,
  Calendar,
  Radio,
  BarChart3,
  Users,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartFeatureCard } from "@/components/motion/ThiSmartFeatureCard";

export default function TeacherDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Giảng viên phụ trách môn học
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bảng Điều Khiển Giảng Viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chào mừng trở lại, <span className="font-semibold text-slate-700">TS. Trần Minh Khoa</span>. Bạn có 1 ca thi đang diễn ra trực tiếp ngay lúc này.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Link href="/teacher/ai-assistant">
            <ThiSmartCtaButton variant="secondary" size="md">
              <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600" />
              Trợ lý Soạn Đề AI
            </ThiSmartCtaButton>
          </Link>
          <Link href="/teacher/questions/new">
            <ThiSmartCtaButton variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              Soạn câu hỏi mới
            </ThiSmartCtaButton>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Môn phụ trách</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">03</div>
          <div className="text-[11px] text-slate-400 mt-1">IT4409, CS201, DB301</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-cyan-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ngân hàng câu hỏi</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">420</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">94% trạng thái Ready</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Đề thi mẫu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">12</div>
          <div className="text-[11px] text-slate-400 mt-1">Đã kiểm duyệt cấu trúc</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Thí sinh đang thi</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">128</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-1">🔴 2 ca thi đồng thời</div>
        </div>
      </div>

      {/* Live Proctoring Hero Callout */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-7 shadow-lg overflow-hidden border border-blue-800/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Ca thi đang diễn ra trực tiếp (Live Proctoring)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Lập trình Web Nâng Cao — Ca Giữa kỳ Nhóm 01 (IT4409)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Khung giờ: 08:00 - 09:30 • 42/45 thí sinh đã kết nối • 3 sinh viên có cảnh báo rời màn hình.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/teacher/sessions/session-101/monitor"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 shadow-lg shadow-rose-900/30 transition active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Vào Giám Sát Trực Tiếp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action Modules (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Công Cụ Quản Lý Khảo Thí
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/teacher/subjects" className="block">
              <ThiSmartFeatureCard
                imageSrc="/brand/icons-3d/icon-hero-orbit.png"
                title="Môn học & Cây Chủ đề"
                description="Quản lý cây phân cấp học thuật, phân công giảng viên và thống kê lượng câu hỏi theo từng chủ đề."
                interactive
              />
            </Link>

            <Link href="/teacher/questions" className="block">
              <ThiSmartFeatureCard
                imageSrc="/brand/icons-3d/icon-question-bank.png"
                title="Ngân hàng Câu hỏi"
                description="Soạn thảo, kiểm duyệt độ khó, phân loại trắc nghiệm / tự luận và thiết lập đáp án đúng an toàn."
                interactive
              />
            </Link>

            <Link href="/teacher/exams" className="block">
              <ThiSmartFeatureCard
                imageSrc="/brand/icons-3d/icon-exam-creation.png"
                title="Thiết kế Đề thi Mẫu"
                description="Lắp ghép câu hỏi, cân đối phổ điểm 10.0, cấu hình xáo trộn thứ tự và tỷ lệ câu hỏi ngẫu nhiên."
                interactive
              />
            </Link>

            <Link href="/teacher/sessions" className="block">
              <ThiSmartFeatureCard
                imageSrc="/brand/icons-3d/icon-scheduling.png"
                title="Lập lịch & Ca thi"
                description="Mở ca thi, gán danh sách sinh viên, phân công giám thị và kiểm soát khung giờ vào phòng thi."
                interactive
              />
            </Link>
          </div>
        </div>

        {/* Recent Events & Logs (Right col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Hoạt động gần đây</span>
              <span className="text-xs font-normal text-slate-400">Thời gian thực</span>
            </h2>

            <div className="divide-y divide-slate-100 mt-4">
              <div className="py-3 first:pt-0">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-blue-600">Ca thi mới</span>
                  <span>10 phút trước</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  Đã xuất bản ca thi &quot;CS201 - Kỳ 2&quot; (45 sinh viên).
                </p>
              </div>

              <div className="py-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-emerald-600">Ngân hàng đề</span>
                  <span>45 phút trước</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  Bạn đã thêm 15 câu hỏi mới vào chủ đề &quot;REST Architecture&quot;.
                </p>
              </div>

              <div className="py-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-rose-600">Cảnh báo giám sát</span>
                  <span>08:42 hôm nay</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  Thí sinh SV103 rời khỏi toàn màn hình trong ca thi Web.
                </p>
              </div>

              <div className="py-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-indigo-600">Nộp bài thi</span>
                  <span>Hôm qua</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  Ca thi &quot;Lập trình C - K22&quot; hoàn tất 100% bài nộp.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/teacher/sessions/session-101/results"
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Xem báo cáo phổ điểm gần nhất</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
