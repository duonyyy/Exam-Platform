"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  Shield,
  Clock,
  AlertTriangle,
  Server,
  Bell,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("ThiSmart — Cổng Khảo Thí & Giám Sát Thông Minh");
  const [institutionName, setInstitutionName] = useState("Đại học Quốc Gia — Phòng Khảo Thí");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [defaultLateMinutes, setDefaultLateMinutes] = useState(15);
  const [networkBufferSeconds, setNetworkBufferSeconds] = useState(15);
  const [maxWarningBeforeFlag, setMaxWarningBeforeFlag] = useState(3);
  const [enforceFullscreen, setEnforceFullscreen] = useState(true);
  const [blockDevTools, setBlockDevTools] = useState(true);
  const [singleSessionPerStudent, setSingleSessionPerStudent] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Cấu Hình Hệ Thống Khảo Thí
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Thiết lập tham số toàn trường, chính sách phòng thi và các ngưỡng cảm biến an ninh.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Lưu cấu hình hệ thống</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công các thay đổi cấu hình vào bộ nhớ máy chủ!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* General Information */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            Thông Tin Nền Tảng & Tổ Chức
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên nền tảng (Platform Title)
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đơn vị chủ quản / Trường đại học
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Chế độ Bảo trì (Maintenance Mode)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tạm dừng tất cả ca thi mới và chỉ cho phép Admin đăng nhập.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Examination Policies */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Quy Chuẩn Thời Gian & Máy Chủ (Server-Authoritative Clock)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thời gian cho phép vào muộn mặc định (Phút)
              </label>
              <input
                type="number"
                value={defaultLateMinutes}
                onChange={(e) => setDefaultLateMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Sau thời gian này, nút Vào thi bị khóa (BR-004)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thời gian đệm trễ mạng (Network Buffer)
              </label>
              <input
                type="number"
                value={networkBufferSeconds}
                onChange={(e) => setNetworkBufferSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Bù trừ độ trễ mạng khi nộp bài: 15 giây (BR-015)
              </span>
            </div>
          </div>
        </div>

        {/* Anti-Cheat & Proctoring Thresholds */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Chính Sách Giám Sát Cảm Biến & An Ninh
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ngưỡng cảnh báo trước khi tự động gắn cờ vi phạm (Flag for review)
              </label>
              <input
                type="number"
                value={maxWarningBeforeFlag}
                onChange={(e) => setMaxWarningBeforeFlag(Number(e.target.value))}
                className="w-full max-w-xs px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Số lần chuyển tab hoặc thoát fullscreen trước khi thông báo giám thị
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceFullscreen}
                  onChange={(e) => setEnforceFullscreen(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Bắt buộc kích hoạt chế độ Toàn màn hình (Fullscreen Focus Mode)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockDevTools}
                  onChange={(e) => setBlockDevTools(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Chặn mở phím F12 và phát hiện Console DevTools</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={singleSessionPerStudent}
                  onChange={(e) => setSingleSessionPerStudent(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Ngăn chặn đăng nhập song song 1 tài khoản trên nhiều thiết bị</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
