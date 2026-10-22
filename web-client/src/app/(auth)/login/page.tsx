"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import {
  ShieldCheck,
  GraduationCap,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  KeyRound,
  Clock,
} from "lucide-react";
import { BrandDotPattern } from "@/components/patterns/BrandDotPattern";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";
import { useLogin } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("student@university.edu.vn");
  const [password, setPassword] = useState("Student@123");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const loginMutation = useLogin();

  const handleRoleSelect = (role: "student" | "teacher" | "admin") => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === "student") {
      setEmail("student@university.edu.vn");
      setPassword("Student@123");
    } else if (role === "teacher") {
      setEmail("teacher.nguyen@university.edu.vn");
      setPassword("Teacher@123");
    } else {
      setEmail("admin@thismart.internal");
      setPassword("Admin@123");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoginMessage(null);

    loginMutation.mutate(
      { email, password },
      {
        onError: (err: any) => {
          setErrorMessage(
            err?.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
          );
        },
        onSuccess: (data) => {
          setLoginMessage(
            `Đăng nhập thành công! Đang chuyển hướng đến không gian làm việc của ${data.data.user.name}...`
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 relative overflow-hidden">
      {/* Background Brand Pattern */}
      <BrandDotPattern opacity={0.04} color="#2563EB" gap={28} />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-10">
        <BrandLogo href="/" priority />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </header>

      {/* Main Container: 2-column on desktop, single-column on mobile */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Desktop Left Brand Column (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-8 flex-col justify-between relative overflow-hidden">
            {/* Vector Dot Grid Pattern (Tinh tế, hiện đại) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
            >
              <ThiSmartPattern
                variant="dot-grid"
                opacity={0.24}
                showBackground={false}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-0" />
            
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <Image
                  src="/brand/app-icon-squircle-3d.png"
                  alt="ThiSmart 3D Mark"
                  width={64}
                  height={64}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20">
                  Academic SaaS
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
                  ThiSmart Platform
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Thi thông minh. Đánh giá chính xác.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Xác thực an toàn chuẩn Bearer Token</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Phân quyền đa tầng chống truy cập chéo</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Đồng hồ máy chủ bảo vệ hạn chót ca thi</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400">
              Hệ thống khảo thí trực tuyến &amp; giám sát thông minh thế hệ mới.
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            {/* Form Header */}
            <div className="text-center sm:text-left mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 mb-2 lg:hidden p-1">
                <Image
                  src="/brand/app-icon-squircle-3d.png"
                  alt="ThiSmart Logo"
                  width={40}
                  height={40}
                  className="w-full h-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng nhập ThiSmart</h1>
              <p className="text-sm text-slate-500 mt-1">
                Cổng Khảo Thí &amp; Giám Sát Trực Tuyến Chuẩn Hoá
              </p>
            </div>

            {/* Quick Demo Credentials */}
            <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tài khoản mẫu trải nghiệm (Demo Credentials)
                </span>
                <span className="text-[11px] text-slate-500">Tự động điền</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("student")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
                    selectedRole === "student"
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 mb-1" />
                  <span>Thí sinh</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("teacher")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
                    selectedRole === "teacher"
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <Users className="w-4 h-4 mb-1" />
                  <span>Giảng viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("admin")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
                    selectedRole === "admin"
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mb-1" />
                  <span>Quản trị viên</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5">
                💡 Quyền hạn và phạm vi truy cập thực tế được quản trị bằng Bearer Token từ máy chủ.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            {loginMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>{loginMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email hoặc Mã định danh
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    placeholder="name@university.edu.vn"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Mật khẩu
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Tính năng khôi phục mật khẩu liên hệ quản trị viên cơ sở đào tạo theo chính sách AGENTS.md.");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ghi nhớ phiên đăng nhập</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loginMutation.isPending ? (
                  <span>Đang xác thực...</span>
                ) : (
                  <>
                    <span>Đăng nhập hệ thống</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo CTA */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href="/exam/demo"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Vào thẳng Phòng Thi Demo (Không cần tài khoản)</span>
              </Link>

              <div className="text-center text-xs text-slate-500">
                Chưa có tài khoản sinh viên?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Đăng ký dự thi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-400 relative z-10">
        © 2026 ThiSmart • Phòng Khảo Thí &amp; Giám Sát Trực Tuyến. Tuân thủ Hiến pháp Kỹ thuật AGENTS.md.
      </footer>
    </div>
  );
}
