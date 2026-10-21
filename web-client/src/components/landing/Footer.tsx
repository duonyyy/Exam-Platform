import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { Lock, ShieldCheck, CheckCircle2, Sparkles, Terminal, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo theme="dark" withTagline={true} href="/" />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Hệ thống khảo thí trực tuyến và giám sát thông minh thế hệ mới. Đem lại sự tĩnh lặng cho thí sinh, sự chuẩn xác cho giảng viên và sự tin cậy cho nhà trường.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Next.js 15 App Router</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Laravel 13 REST API</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>PostgreSQL 16 ACID</span>
              </span>
            </div>
          </div>

          {/* Col 1: Tính Năng */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Tính Năng Cốt Lõi
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Ngân hàng câu hỏi JSONB
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Quản lý ma trận đề thi
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-white transition">
                  Phòng thi Focus Room
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-white transition">
                  Tự động lưu 500ms
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Ghi nhận sự kiện trình duyệt
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Chấm điểm &amp; Phổ điểm
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Giải Pháp & Vai Trò */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Giải Pháp Theo Vai Trò
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  Thí sinh (Student)
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  Giảng viên &amp; Giám thị (Teacher)
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  Quản trị viên hệ thống (Admin)
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition">
                  Quy trình 4 bước tổ chức
                </a>
              </li>
              <li>
                <Link href="/exam/demo" className="text-cyan-400 hover:text-cyan-300 transition font-semibold">
                  Phòng thi Demo trực quan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: An Ninh & Kỹ Thuật */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Bảo Mật &amp; Kỹ Thuật
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#security" className="hover:text-white transition">
                  Bảo mật đề thi &amp; đáp án
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition">
                  Đồng hồ chuẩn hóa máy chủ
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition">
                  Khóa an toàn khi nộp bài
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition">
                  Phân quyền truy cập đa tầng
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition">
                  Nhật ký giám sát khách quan
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Cổng đăng nhập hệ thống
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong className="text-slate-300">ThiSmart</strong>. All rights reserved. Hệ thống khảo thí trực tuyến chuẩn mực.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bảo mật đề thi</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Target WCAG 2.2 AA</span>
            </span>
            <span>•</span>
            <span className="text-slate-400">Academic SaaS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
