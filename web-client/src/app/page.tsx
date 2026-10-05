import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  Users,
  Timer,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  FileCheck2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 backdrop-blur-md bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Exam Platform
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                v1.0 Ready
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 mr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Next.js 15 App Router</span>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Đăng nhập
            </Link>
            <Link
              href="/exam/demo"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
            >
              <span>Phòng thi Focus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 w-full flex flex-col gap-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Đã cấu hình trọn bộ Vibe Coding Tooling & MCP Suite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Nền Tảng Thi Trực Tuyến &{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Giám Sát Chuẩn Enterprise
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Hệ thống sát hạch số hóa toàn diện với kiến trúc phân tầng sạch:
            Backend <strong className="text-white">Laravel 13 REST API</strong>,
            Frontend <strong className="text-white">Next.js 15 App Router</strong>,
            chống gian lận cảm biến trình duyệt và bảo mật Zero-Leakage.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/exam/demo"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <Timer className="w-5 h-5" />
              <span>Trải nghiệm Phòng Thi Focus Mode</span>
            </Link>
            <a
              href="#architecture"
              className="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              Xem Kiến Trúc & Sơ Đồ
            </a>
          </div>
        </section>

        {/* 3 Core Roles Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Thí Sinh (Student)</h2>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Truy cập danh sách ca thi được chỉ định, giao diện làm bài tập trung không xao nhãng, tự động lưu đáp án real-time (Debounced 500ms).
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Bảo vệ Zero-Leakage (không lộ đáp án)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Thu thập cảm biến hành vi (Proctoring)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Server-Authoritative Clock (chống tua giờ)
              </li>
            </ul>
          </div>

          {/* Teacher */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Giảng Viên (Teacher)</h2>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Soạn thảo ngân hàng câu hỏi 4 định dạng JSONB, duyệt đề thi, thiết lập ca thi kèm danh sách sinh viên và giám sát thi trực tiếp.
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Vòng đời câu hỏi: Draft $\rightarrow$ Approved
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Máy trạng thái FSM ca thi an toàn
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Bảng điểm phổ học tập và thống kê
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Quản Trị Viên (Admin)</h2>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Toàn quyền quản lý danh mục môn học, chủ đề, người dùng, phân quyền RBAC đa cấp và kiểm toán nhật ký toàn hệ thống (Audit Logs).
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Phân quyền kép Role Middleware + Policy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Khóa bi quan Pessimistic Lock khi nộp bài
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Bảo vệ chống IDOR và OWASP API Top 10
              </li>
            </ul>
          </div>
        </section>

        {/* System & Architecture Stack */}
        <section
          id="architecture"
          className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-indigo-400" />
                <span>Trạng Thái Hạ Tầng & Sẵn Sàng Vibe Coding</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Monorepo chuẩn hóa với 2 khối ứng dụng độc lập, hợp đồng API và bộ công cụ MCP.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Architecture Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Backend Core</span>
              </div>
              <div className="font-bold text-slate-100">Laravel 13 API</div>
              <div className="text-xs text-slate-500 mt-1">PHP 8.3-FPM / Stateless Sanctum</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Frontend Client</span>
              </div>
              <div className="font-bold text-slate-100">Next.js 15 App Router</div>
              <div className="text-xs text-slate-500 mt-1">React 19 / Tailwind / TanStack Query</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Cơ Sở Dữ Liệu</span>
              </div>
              <div className="font-bold text-slate-100">PostgreSQL 16</div>
              <div className="text-xs text-slate-500 mt-1">13 Bảng / JSONB / Lock Bi Quan</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                <span>Vibe Coding MCP</span>
              </div>
              <div className="font-bold text-slate-100">6 Workspace MCPs</div>
              <div className="text-xs text-slate-500 mt-1">Shadcn, Playwright, Draw.io, Postman</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-black/40 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Exam Platform Monorepo. Tuân thủ Hiến pháp Kỹ thuật AGENTS.md.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Zero-Leakage Policy
            </span>
            <span>•</span>
            <span>REST API /api/v1</span>
            <span>•</span>
            <span>DoD Checked</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
