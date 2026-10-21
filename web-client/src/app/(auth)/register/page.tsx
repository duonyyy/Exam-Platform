"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("Đại học Quốc gia");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <BrandLogo href="/" priority />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 mb-3 border border-cyan-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng ký Thí sinh</h1>
            <p className="text-sm text-slate-500 mt-1">
              Đăng ký tài khoản dự thi chính thức trên nền tảng ThiSmart
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-emerald-900">Yêu cầu đã được ghi nhận</h2>
              <p className="text-sm text-emerald-800">
                Thông tin sinh viên <strong>{fullName}</strong> ({studentCode}) đã được đồng bộ. Phòng Khảo Thí sẽ đối soát danh sách sinh viên trước khi kích hoạt.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
                >
                  Đến trang Đăng nhập
                </Link>
                <Link
                  href="/exam/demo"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Trải nghiệm Phòng Thi Demo ngay</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                  Họ và tên thí sinh
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="studentCode" className="block text-sm font-medium text-slate-700 mb-1">
                  Mã số sinh viên (MSSV)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    id="studentCode"
                    type="text"
                    required
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="SV20260101"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email học viện / Trường học
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
                    placeholder="nguyenvana@university.edu.vn"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-slate-700 mb-1">
                  Cơ sở đào tạo / Trường Đại học
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    id="institution"
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Lưu ý:</span> Tài khoản sau khi đăng ký sẽ được đối soát tự động với danh sách phân bổ phòng thi (`session_assignments`) của giảng viên hoặc nhà trường.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition flex items-center justify-center gap-2"
              >
                <span>Xác nhận đăng ký tài khoản</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-400">
        © 2026 ThiSmart • Phòng Khảo Thí &amp; Giám Sát Trực Tuyến
      </footer>
    </div>
  );
}
