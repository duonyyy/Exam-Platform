"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ShieldCheck,
  Server,
  Activity,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  Zap,
  Settings,
} from "lucide-react";
import { ThiSmartFeatureCard } from "@/components/motion/ThiSmartFeatureCard";

export default function AdminOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Quản trị viên Cấp cao (System Administrator)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bảng Điều Khiển Quản Trị Toàn Trường
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Giám sát vận hành hạ tầng khảo thí, quản trị phân quyền RBAC và kiểm soát tải lưu lượng cao điểm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
          >
            <Users className="w-4 h-4" />
            <span>Quản trị tài khoản</span>
          </Link>
        </div>
      </div>

      {/* Campus-Wide Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng số Sinh viên</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">1,450</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">98.2% tài khoản kích hoạt</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng số Giảng viên</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">85</div>
          <div className="text-[11px] text-slate-400 mt-1">12 khoa đào tạo</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-cyan-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ca thi tuần này</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">32</div>
          <div className="text-[11px] text-slate-400 mt-1">Kỳ thi Đánh giá Giữa kỳ</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-200 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tỷ lệ API Uptime</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">99.98%</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">SLA ổn định xuất sắc</div>
        </div>
      </div>

      {/* High-Concurrency Peak Load Advisory Banner */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-300/60 text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 border border-amber-300/50 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950">
              Dự Báo Tải Đỉnh Trực Tuyến: Khung giờ 08:00 - 10:00 Ngày Mai
            </h3>
            <p className="text-xs text-amber-900/80 mt-1 max-w-2xl leading-relaxed">
              Hệ thống ghi nhận có <strong>4 ca thi đồng thời</strong> với tổng cộng <strong>650 thí sinh</strong> truy cập.
              Khuyến nghị cấu hình tối thiểu <strong>4 PHP-FPM Workers</strong> và kiểm tra kết nối Redis session/cache pool.
            </p>
          </div>
        </div>

        <Link
          href="/admin/settings"
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition shrink-0"
        >
          Cấu hình Tham số Tải
        </Link>
      </div>

      {/* System Health Indicators */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          Tình Trạng Hạ Tầng & Dịch Vụ Cốt Lõi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                PostgreSQL 16 Pool
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                HEALTHY
              </span>
            </div>
            <div className="text-xl font-black text-slate-900">18 / 100 Conn</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full w-[18%]" />
            </div>
            <div className="text-[10px] text-slate-400">Transaction Isolation: Read Committed</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Redis 7 Cache Cluster
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                98.4% HIT
              </span>
            </div>
            <div className="text-xl font-black text-slate-900">42 MB / 2 GB</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div className="bg-emerald-600 h-1.5 rounded-full w-[4%]" />
            </div>
            <div className="text-[10px] text-slate-400">Debounced Autosave & Cache Queue</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-600" />
                PHP 8.3 FPM Workers
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                IDLE
              </span>
            </div>
            <div className="text-xl font-black text-slate-900">04 Active / 16 Max</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div className="bg-purple-600 h-1.5 rounded-full w-[25%]" />
            </div>
            <div className="text-[10px] text-slate-400">OPcache enabled • Memory limit: 256M</div>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/admin/users" className="block">
          <ThiSmartFeatureCard
            imageSrc="/brand/icons-3d/icon-user-roles.png"
            title="Quản trị Người dùng"
            description="Phân vai trò (Admin, Teacher, Student), kích hoạt tài khoản hoặc tạm khóa người dùng vi phạm."
            interactive
          />
        </Link>

        <Link href="/admin/audit-logs" className="block">
          <ThiSmartFeatureCard
            imageSrc="/brand/icons-3d/icon-security-shield.png"
            title="Nhật ký Kiểm toán"
            description="Thanh tra an ninh toàn bộ request, sự kiện giám sát phòng thi và các thao tác nhạy cảm."
            interactive
          />
        </Link>

        <Link href="/admin/settings" className="block">
          <ThiSmartFeatureCard
            imageSrc="/brand/icons-3d/icon-integrations.png"
            title="Cấu hình Tham số Hệ thống"
            description="Thiết lập thời gian vào muộn, ngưỡng cảnh báo chuyển tab và chế độ bảo trì toàn hệ thống."
            interactive
          />
        </Link>
      </div>
    </div>
  );
}
