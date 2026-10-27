"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  Timer,
  LayoutDashboard,
  Layers,
  Shield,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  roles: Array<"student" | "teacher" | "admin">;
}

const NAV_ITEMS: NavItem[] = [
  // Student items
  {
    label: "Ca thi của tôi",
    href: "/student/exams",
    icon: Calendar,
    roles: ["student"],
  },
  {
    label: "Lịch sử & Kết quả",
    href: "/student/results",
    icon: BarChart3,
    roles: ["student"],
  },

  // Teacher items
  {
    label: "Tổng quan Giảng viên",
    href: "/teacher",
    icon: LayoutDashboard,
    roles: ["teacher"],
  },
  {
    label: "Môn học & Chủ đề",
    href: "/teacher/subjects",
    icon: BookOpen,
    roles: ["teacher", "admin"],
  },
  {
    label: "Ngân hàng Câu hỏi",
    href: "/teacher/questions",
    icon: HelpCircle,
    badge: "120+",
    roles: ["teacher", "admin"],
  },
  {
    label: "Trợ lý Soạn Đề AI",
    href: "/teacher/ai-assistant",
    icon: Sparkles,
    badge: "AI 2.0",
    roles: ["teacher", "admin"],
  },
  {
    label: "Soạn Đề thi mẫu",
    href: "/teacher/exams",
    icon: FileText,
    roles: ["teacher", "admin"],
  },
  {
    label: "Lập lịch Ca thi",
    href: "/teacher/sessions",
    icon: Calendar,
    roles: ["teacher", "admin"],
  },

  // Admin exclusive items
  {
    label: "Tổng quan Quản trị",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    label: "Quản trị Người dùng",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Nhật ký Kiểm toán & AI",
    href: "/admin/audit-logs",
    icon: ShieldCheck,
    roles: ["admin"],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const userRole = (currentUser?.role || "student") as "student" | "teacher" | "admin";

  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={`h-screen sticky top-0 bg-white border-r border-slate-200/90 transition-all duration-200 flex flex-col justify-between z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header & Brand Logo */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-16 px-4 border-b border-slate-200/90 flex items-center justify-between shrink-0">
          <div className="overflow-hidden">
            <BrandLogo href="/" compact={collapsed} priority className="h-7 w-auto" />
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-[6px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Authenticated Role Banner */}
        {!collapsed && (
          <div className="p-3 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  userRole === "admin"
                    ? "bg-purple-500"
                    : userRole === "teacher"
                    ? "bg-blue-500"
                    : "bg-emerald-500"
                }`}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {userRole === "admin"
                  ? "Phân hệ Quản trị"
                  : userRole === "teacher"
                  ? "Phân hệ Giảng viên"
                  : "Phân hệ Sinh viên"}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
              {currentUser?.name || "Người dùng đang đăng nhập"}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-2 space-y-0.5 overflow-y-auto flex-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200/70 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700 border border-transparent"
                } ${collapsed ? "justify-center px-2" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                  }`}
                />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold uppercase tracking-wider ${
                      item.badge === "LIVE"
                        ? "bg-rose-50 text-rose-700 animate-pulse border border-rose-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
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

      {/* Bottom Status & Shortcuts */}
      <div className="p-3 border-t border-slate-200/90 space-y-2 bg-slate-50/60 shrink-0">
        {!collapsed && (
          <div className="px-2 py-1.5 rounded-[6px] bg-white border border-slate-200/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">ThiSmart v2.6</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Bảo mật RBAC</span>
          </div>
        )}

        <div className="space-y-1">
          <Link
            href="/patterns"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-semibold text-blue-700 bg-blue-50/70 border border-blue-200/60 hover:bg-blue-100/70 transition ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="Triển Lãm 6 Vector Patterns"
          >
            <Layers className="w-4 h-4 shrink-0 text-blue-600" />
            {!collapsed && <span>6 Vector Patterns Lab</span>}
          </Link>

          <Link
            href="/design-system"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-white transition border border-transparent hover:border-slate-200 ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="Design System Preview"
          >
            <Palette className="w-4 h-4 shrink-0 text-slate-400" />
            {!collapsed && <span>Design System</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
