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
} from "lucide-react";

export default function AdminOverviewPage() {
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
            Giám sát thời gian thực hạ tầng tổ chức thi, kiểm soát tải lưu lượng cao điểm và phân quyền truy cập.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
          >
            <Users className="w-4 h-4" />
            <span>Quản trị tài khoản</span>
          </Link>
        </div>
      </div>

      {/* Campus-Wide Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng số sinh viên</span>
            <div className="w-8 h-8 rounded-[6px] bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">1,450</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>98.2% đã kích hoạt</span>
          </div>
        </div>

        <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Giảng viên phụ trách</span>
            <div className="w-8 h-8 rounded-[6px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">85</div>
          <div className="text-[11px] text-slate-500 mt-1">12 khoa và bộ môn</div>
        </div>

        <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Ca thi tuần này</span>
            <div className="w-8 h-8 rounded-[6px] bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">32</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
            <Radio className="w-3 h-3 text-blue-600" />
            <span>8 ca diễn ra hôm nay</span>
          </div>
        </div>

        <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Độ ổn định hệ thống</span>
            <div className="w-8 h-8 rounded-[6px] bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2 tracking-tight">99.98%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Không ghi nhận gián đoạn</div>
        </div>
      </div>

      {/* Real-time System Load & Concurrency Advisory */}
      <div className="p-5 rounded-[8px] bg-emerald-50/70 border border-emerald-200 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Trạng thái vận hành: Ổn định • 1,250 thí sinh đang đồng thời làm bài
              </h3>
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                BÌNH THƯỜNG
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Dung lượng tải CPU 28% • Băng thông mạng phản hồi tốt (&lt;45ms) • Dự báo ca thi cao điểm tiếp theo vào lúc <strong>08:00 sáng mai</strong> với <strong>650 thí sinh</strong>.
            </p>
          </div>
        </div>

        <Link
          href="/admin/settings"
          className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs shadow-xs transition shrink-0 inline-flex items-center gap-1.5"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Cấu hình tham số tải</span>
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
            Cập nhật cách đây 5 giây
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Database */}
          <div className="p-4 rounded-[6px] bg-slate-50/70 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                CSDL Khảo thí (Postgres)
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-1.5 py-0.5 rounded-[4px]">
                TỐI ƯU
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">18 / 100 kết nối</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full w-[18%]" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Độ trễ truy vấn:</span>
              <span className="font-mono font-semibold text-slate-700">1.8 ms</span>
            </div>
          </div>

          {/* Redis Cache */}
          <div className="p-4 rounded-[6px] bg-slate-50/70 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Bộ nhớ đệm & Lưu nháp
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-1.5 py-0.5 rounded-[4px]">
                99.4% HIT
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">42 MB / 2 GB</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full w-[4%]" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Hàng đợi lưu nháp:</span>
              <span className="font-mono font-semibold text-emerald-700">0 bài chờ (Trống)</span>
            </div>
          </div>

          {/* Workers */}
          <div className="p-4 rounded-[6px] bg-slate-50/70 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Máy chủ xử lý API
              </span>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100/80 border border-blue-300 px-1.5 py-0.5 rounded-[4px]">
                SẴN SÀNG
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">04 / 16 tiến trình</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full w-[25%]" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Thời gian phản hồi API:</span>
              <span className="font-mono font-semibold text-slate-700">45 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="group block p-5 rounded-[8px] bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-sm transition"
        >
          <div className="w-10 h-10 rounded-[6px] bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
              Quản trị người dùng & Phân quyền
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Phân vai trò (Admin, Teacher, Student), kích hoạt tài khoản sinh viên hoặc tạm khóa người dùng vi phạm.
          </p>
        </Link>

        <Link
          href="/admin/audit-logs"
          className="group block p-5 rounded-[8px] bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-sm transition"
        >
          <div className="w-10 h-10 rounded-[6px] bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Nhật ký kiểm toán & Thanh tra an ninh
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Thanh tra an ninh toàn bộ request, sự kiện giám sát phòng thi và các thao tác phân quyền nhạy cảm.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="group block p-5 rounded-[8px] bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-sm transition"
        >
          <div className="w-10 h-10 rounded-[6px] bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition">
            <Settings className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-900 transition">
              Cấu hình quy chuẩn khảo thí
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Thiết lập thời gian vào muộn tối đa, ngưỡng cảnh báo chuyển tab và chế độ bảo trì toàn hệ thống.
          </p>
        </Link>
      </div>
    </div>
  );
}
