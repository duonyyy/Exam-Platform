"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Shield,
  GraduationCap,
  Users,
  ExternalLink,
} from "lucide-react";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/useAuth";

export function TopBar() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();

  // Identify current section from pathname and authenticated user
  const currentSection = pathname.startsWith("/teacher")
    ? {
        role: "Giảng viên",
        name: currentUser?.name || "TS. Lê Hoàng Nam",
        code: currentUser?.code || "GV0001",
        icon: Users,
        color: "text-blue-600 bg-blue-50",
      }
    : pathname.startsWith("/admin")
    ? {
        role: "Quản trị viên",
        name: currentUser?.name || "System Administrator",
        code: currentUser?.code || "AD0001",
        icon: Shield,
        color: "text-purple-600 bg-purple-50",
      }
    : {
        role: "Sinh viên",
        name: currentUser?.name || "Nguyễn Văn An",
        code: currentUser?.code || "SV20260001",
        icon: GraduationCap,
        color: "text-cyan-700 bg-cyan-50 border border-cyan-200/60",
      };

  const Icon = currentSection.icon;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Breadcrumbs / Section Info */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${currentSection.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium leading-none">
            Phân hệ: <span className="font-semibold text-slate-700">{currentSection.role}</span>
          </div>
          <div className="text-sm font-bold text-slate-900 tracking-tight mt-0.5">
            Cổng Khảo Thí &amp; Giám Sát ThiSmart
          </div>
        </div>
      </div>

      {/* Right: Quick Role Switch, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <Link
            href="/student/exams"
            className={`px-2.5 py-1 rounded-lg transition ${
              pathname.startsWith("/student")
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sinh viên
          </Link>
          <Link
            href="/teacher"
            className={`px-2.5 py-1 rounded-lg transition ${
              pathname.startsWith("/teacher")
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Giảng viên
          </Link>
          <Link
            href="/admin"
            className={`px-2.5 py-1 rounded-lg transition ${
              pathname.startsWith("/admin")
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quản trị
          </Link>
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative"
          aria-label="Thông báo"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {currentSection.code.slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentSection.name}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {currentSection.code} • {currentSection.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setProfileOpen(false)}
            >
              <div className="p-2.5 border-b border-slate-100 text-xs">
                <div className="font-bold text-slate-900">{currentSection.name}</div>
                <div className="text-slate-500">{currentSection.code}</div>
              </div>
              <div className="py-1">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đổi tài khoản đăng nhập</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Về trang chủ Landing</span>
                </Link>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition disabled:opacity-50 text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>{logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
