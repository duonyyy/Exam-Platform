"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { BrandDotPattern } from "@/components/patterns/BrandDotPattern";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 relative overflow-hidden">
      <BrandDotPattern opacity={0.05} color="#2563EB" gap={28} />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-10">
        <BrandLogo href="/" priority />
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang đăng nhập</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Khôi phục mật khẩu</h1>
            <p className="text-xs text-slate-500 mt-1">
              Nhập email hoặc mã định danh sinh viên để nhận liên kết xác thực đặt lại mật khẩu.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs leading-relaxed flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <span className="font-semibold text-sm">Yêu cầu đã được tiếp nhận!</span>
                <span>
                  Nếu email <strong>{email}</strong> tồn tại trên hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hòm thư của bạn.
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
                >
                  <span>Quay lại Đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email sinh viên / Cán bộ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu.vn"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Gửi liên kết khôi phục</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 text-center text-xs text-slate-500">
                Gặp sự cố với tài khoản?{" "}
                <span className="text-slate-700 font-semibold">
                  Liên hệ phòng Khảo thí cơ sở đào tạo.
                </span>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400 relative z-10">
        © 2026 ThiSmart • Phòng Khảo Thí &amp; Giám Sát Trực Tuyến.
      </footer>
    </div>
  );
}
