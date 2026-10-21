"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/branding/BrandLogo";
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  FileText,
  Calendar,
  Radio,
  BarChart3,
  Users,
  ShieldCheck,
  FileCode,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  ExternalLink,
  Timer,
  LayoutDashboard,
  Layers,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  role: "student" | "teacher" | "admin" | "common";
}

const NAV_ITEMS: NavItem[] = [
  // Student
  {
    label: "Ca thi của tôi",
    href: "/student/exams",
    icon: Calendar,
    role: "student",
    badge: "1 Đang mở",
  },
  {
    label: "Kết quả bài thi",
    href: "/student/results/demo-attempt",
    icon: BarChart3,
    role: "student",
  },

  // Teacher
  {
    label: "Tổng quan Giảng viên",
    href: "/teacher",
    icon: LayoutDashboard,
    role: "teacher",
  },
  {
    label: "Môn học & Chủ đề",
    href: "/teacher/subjects",
    icon: BookOpen,
    role: "teacher",
  },
  {
    label: "Ngân hàng Câu hỏi",
    href: "/teacher/questions",
    icon: HelpCircle,
    role: "teacher",
    badge: "420",
  },
  {
    label: "Soạn Đề thi mẫu",
    href: "/teacher/exams",
    icon: FileText,
    role: "teacher",
  },
  {
    label: "Lập lịch Ca thi",
    href: "/teacher/sessions",
    icon: Calendar,
    role: "teacher",
  },
  {
    label: "Giám sát Trực tiếp",
    href: "/teacher/sessions/session-101/monitor",
    icon: Radio,
    role: "teacher",
    badge: "LIVE",
  },
  {
    label: "Phổ điểm & Báo cáo",
    href: "/teacher/sessions/session-101/results",
    icon: BarChart3,
    role: "teacher",
  },

  // Admin
  {
    label: "Tổng quan Quản trị",
    href: "/admin",
    icon: LayoutDashboard,
    role: "admin",
  },
  {
    label: "Quản trị Người dùng",
    href: "/admin/users",
    icon: Users,
    role: "admin",
  },
  {
    label: "Nhật ký Kiểm toán",
    href: "/admin/audit-logs",
    icon: ShieldCheck,
    role: "admin",
  },
  {
    label: "Cấu hình Hệ thống",
    href: "/admin/settings",
    icon: Settings,
    role: "admin",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activeRoleFilter, setActiveRoleFilter] = useState<"all" | "student" | "teacher" | "admin">("all");

  const filteredItems = NAV_ITEMS.filter((item) => {
    if (activeRoleFilter === "all") return true;
    return item.role === activeRoleFilter || item.role === "common";
  });

  return (
    <aside
      className={`h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header & Brand Logo */}
      <div>
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <div className="overflow-hidden">
            <BrandLogo href="/" compact={collapsed} priority className="h-8 w-auto" />
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Quick Filter (when expanded) */}
        {!collapsed && (
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Phân hệ truy cập
            </div>
            <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveRoleFilter("all")}
                className={`py-1 rounded-md transition text-center ${
                  activeRoleFilter === "all"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleFilter("student")}
                className={`py-1 rounded-md transition text-center ${
                  activeRoleFilter === "student"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                SV
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleFilter("teacher")}
                className={`py-1 rounded-md transition text-center ${
                  activeRoleFilter === "teacher"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                GV
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleFilter("admin")}
                className={`py-1 rounded-md transition text-center ${
                  activeRoleFilter === "admin"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                } ${collapsed ? "justify-center px-2" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.badge === "LIVE"
                        ? "bg-rose-50 text-rose-700 animate-pulse border border-rose-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Shortcuts */}
      <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
        <Link
          href="/exam/demo"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title="Phòng thi Focus Room"
        >
          <Timer className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Vào thi Focus Mode</span>}
        </Link>

        <Link
          href="/patterns"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50/70 border border-blue-200/60 hover:bg-blue-100/70 transition ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title="Triển Lãm 6 Vector Patterns"
        >
          <Layers className="w-4 h-4 shrink-0 text-blue-600" />
          {!collapsed && <span>6 Vector Patterns Lab</span>}
        </Link>

        <Link
          href="/design-system"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-white transition ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title="Design System Preview"
        >
          <Palette className="w-4 h-4 shrink-0 text-slate-400" />
          {!collapsed && <span>Design System</span>}
        </Link>
      </div>
    </aside>
  );
}
