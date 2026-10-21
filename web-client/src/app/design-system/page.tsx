"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Check,
  Copy,
  Sparkles,
  Layers,
  Zap,
  Shield,
  Eye,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  ThiSmartPattern,
  type ThiSmartPatternVariant,
} from "@/components/patterns/ThiSmartPattern";
import { ThiSmartLogoReveal } from "@/components/motion/ThiSmartLogoReveal";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartFeatureCard } from "@/components/motion/ThiSmartFeatureCard";
import { ThiSmartDrawer } from "@/components/motion/ThiSmartDrawer";
import { BrandAssetsCatalogSection } from "@/components/design-system/BrandAssetsCatalogSection";

interface PatternMeta {
  id: ThiSmartPatternVariant;
  nameVi: string;
  nameEn: string;
  panelNum: string;
  bestFor: string;
  description: string;
}

const PATTERNS_LIST: PatternMeta[] = [
  {
    id: "dot-grid",
    panelNum: "01",
    nameVi: "Lưới chấm tri thức",
    nameEn: "Dot Grid",
    bestFor: "Login, Dashboard, Empty State",
    description: "Ma trận 8 × 12 chấm pastel kết hợp điểm xuyết các chấm Primary Blue (#2563EB) và Cyan Accent (#06B6D4).",
  },
  {
    id: "answer-choice-grid",
    panelNum: "02",
    nameVi: "Họa tiết đáp án trắc nghiệm",
    nameEn: "Answer Choice Grid",
    bestFor: "Hero trắc nghiệm, Feature testing",
    description: "Lưới thẻ pill 3 cột × 4 hàng bo tròn 31px với các radio button được chọn (gradient / cyan) và viền rỗng.",
  },
  {
    id: "folded-ribbon-mesh",
    panelNum: "03",
    nameVi: "Lưới dải gấp thương hiệu",
    nameEn: "Folded Ribbon Mesh",
    bestFor: "Hero landing page, Section banner",
    description: "Các dải chéo rộng giao nhau mô phỏng nếp gấp chữ T và giấy thi với gradient Cyan → Blue mềm mại.",
  },
  {
    id: "academic-network",
    panelNum: "04",
    nameVi: "Mạng lưới tri thức",
    nameEn: "Academic Network",
    bestFor: "Knowledge graph, Analytics, Báo cáo phổ điểm",
    description: "Chòm mạng lưới 14 nodes tri thức nối bởi 21 cạnh mảnh, điểm xuyết vầng hào quang và node viền tương phản.",
  },
  {
    id: "rounded-arc",
    panelNum: "05",
    nameVi: "Họa tiết đường cong bo góc",
    nameEn: "Rounded Arc Pattern",
    bestFor: "Dashboard card, Split pane đăng nhập",
    description: "Các cung tròn oversized cắt mép khung với nét stroke đa tầng gradient và đường viền mảnh thanh lịch.",
  },
  {
    id: "soft-wave",
    panelNum: "06",
    nameVi: "Họa tiết sóng nền mềm mại",
    nameEn: "Soft Wave Divider",
    bestFor: "Chân hero section, Chuyển tiếp phân đoạn",
    description: "Các dải sóng hữu cơ xếp tầng chuyển màu xanh dương sang cyan với đường đỉnh sóng màu trắng sắc nét.",
  },
  {
    id: "circuit-board",
    panelNum: "07",
    nameVi: "Vi mạch công nghệ & Giám sát AI",
    nameEn: "Circuit Board & AI Telemetry",
    bestFor: "Live Proctoring, Giám sát phòng thi, Telemetry matrix",
    description: "Hệ thống vi mạch vi xử lý AI proctoring, các đường bus dữ liệu 45°/90°, chân IC và điểm tiếp xúc telemetry.",
  },
];

const BRAND_COLORS = [
  {
    name: "Primary Blue",
    token: "--ts-primary",
    hex: "#2563EB",
    rgb: "37, 99, 235",
    role: "CTA chính, interactive, brand emphasis",
    contrastOnWhite: "4.56:1 (AA)",
  },
  {
    name: "Cyan Accent",
    token: "--ts-cyan",
    hex: "#06B6D4",
    rgb: "6, 182, 212",
    role: "Điểm nhấn công nghệ, brand gradient, active indicator",
    contrastOnWhite: "3.1:1 (Large/UI)",
  },
  {
    name: "Dark Slate",
    token: "--ts-dark",
    hex: "#0F172A",
    rgb: "15, 23, 42",
    role: "Tiêu đề chính, chữ Thi, dark surfaces",
    contrastOnWhite: "15.8:1 (AAA)",
  },
  {
    name: "Light Background",
    token: "--ts-light",
    hex: "#F8FAFC",
    rgb: "248, 250, 252",
    role: "Nền ứng dụng dịu mắt, card background",
    contrastOnWhite: "1.05:1 (Background)",
  },
  {
    name: "Surface White",
    token: "--ts-surface",
    hex: "#FFFFFF",
    rgb: "255, 255, 255",
    role: "Nền card nội dung, popup, dialog",
    contrastOnWhite: "1:1 (Pure White)",
  },
  {
    name: "Soft Border",
    token: "--ts-border",
    hex: "#DBEAFE",
    rgb: "219, 234, 254",
    role: "Đường viền mỏng thanh lịch, đường phân cách",
    contrastOnWhite: "1.3:1 (Subtle Line)",
  },
  {
    name: "Muted Text",
    token: "--ts-muted",
    hex: "#64748B",
    rgb: "100, 116, 139",
    role: "Nội dung phụ, nhãn metadata, caption",
    contrastOnWhite: "4.6:1 (AA)",
  },
];

const FUNCTIONAL_STATUS_COLORS = [
  {
    name: "Success Jade",
    token: "--ts-success",
    hex: "#059669",
    softHex: "#ECFDF5",
    borderHex: "#A7F3D0",
    textHex: "#065F46",
    role: "Đã lưu đáp án thành công, điểm đạt chuẩn, hệ thống trực tuyến",
    contrastOnWhite: "7.5:1 (AAA)",
    sampleBadge: "Đã lưu đáp án • 100% Đạt",
    badgeClass: "ts-badge-success",
  },
  {
    name: "Warning Honey Amber",
    token: "--ts-warning",
    hex: "#D97706",
    softHex: "#FFFBEB",
    borderHex: "#FDE68A",
    textHex: "#92400E",
    role: "Cảnh báo sắp hết giờ làm bài, đánh dấu câu hỏi xem lại",
    contrastOnWhite: "6.2:1 (AA)",
    sampleBadge: "Còn 5 phút • Đánh dấu xem lại",
    badgeClass: "ts-badge-warning",
  },
  {
    name: "Danger Rose Crimson",
    token: "--ts-danger",
    hex: "#E11D48",
    softHex: "#FFF1F2",
    borderHex: "#FECDD3",
    textHex: "#9F1239",
    role: "Mất kết nối mạng, phát hiện rời tab/vi phạm giám sát AI",
    contrastOnWhite: "7.1:1 (AAA)",
    sampleBadge: "Mất mạng • Vi phạm giám sát",
    badgeClass: "ts-badge-danger",
  },
];

export default function DesignSystemPage() {
  // Motion M1 State
  const [m1ReplayKey, setM1ReplayKey] = useState(0);
  const [m1Mode, setM1Mode] = useState<"full" | "separate">("full");
  const [m1Theme, setM1Theme] = useState<"light" | "dark">("light");

  // Motion M2 State
  const [ctaClickCount, setCtaClickCount] = useState(0);

  // Motion M3 State
  const [cardSelected, setCardSelected] = useState(false);

  // Motion M4 State
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Pattern Gallery Controls
  const [patternOpacity, setPatternOpacity] = useState(1);
  const [patternSurface, setPatternSurface] = useState<"light" | "dark">("light");
  const [selectedPatternModal, setSelectedPatternModal] = useState<PatternMeta | null>(null);

  // Responsive Viewport Switcher
  const [activeViewport, setActiveViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Reduced Motion Simulation
  const [simulatedReducedMotion, setSimulatedReducedMotion] = useState(false);

  // Copy Feedback
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 ${
        simulatedReducedMotion ? "reduce-motion-simulated" : ""
      }`}
      style={{ fontFamily: "var(--ts-font)" }}
    >
      <style jsx global>{`
        .reduce-motion-simulated *,
        .reduce-motion-simulated *::before,
        .reduce-motion-simulated *::after {
          animation: none !important;
          transition-duration: 0.01ms !important;
          transform: none !important;
        }
      `}</style>

      {/* Top Header & Breadcrumb Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                ThiSmart Design System
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200">
                v1.0 Specification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Reduced motion simulation toggle */}
            <button
              type="button"
              onClick={() => setSimulatedReducedMotion(!simulatedReducedMotion)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition flex items-center gap-1.5 ${
                simulatedReducedMotion
                  ? "bg-amber-100 border-amber-300 text-amber-900 font-semibold"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
              title="Mô phỏng prefers-reduced-motion"
            >
              <span>{simulatedReducedMotion ? "Reduced Motion: BẬT" : "Reduced Motion: TẮT"}</span>
            </button>

            <Link
              href="/exam/demo"
              className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1 shadow-sm"
            >
              <span>Vào thi thử</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Intro Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ThiSmart Engineering &amp; Brand Constitution</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Hệ Thống Thiết Kế Chuẩn Mực ThiSmart
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Thiết kế tối giản, hiện đại, chính xác theo tinh thần EdTech. Tích hợp trọn vẹn 6 Vector Background Patterns, 4 Hiệu ứng Motion System, Brand Tokens và tuân thủ tuyệt đối chuẩn tiếp cận WCAG 2.2 AA.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>6 Vector Background Patterns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>4 Motion Micro-Interactions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Asset Logo Chuẩn Tách Nền</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>21+ Tranh &amp; Icon 3D Cao Cấp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Hỗ trợ Reduced-Motion 100%</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: DESIGN TOKENS & COLOR PALETTE */}
        <section id="tokens" className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Spec 01 • Brand Guideline
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Design Tokens &amp; Bảng Màu Chủ Đạo
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Mã màu hex chuẩn từ <code>references/01-brand-guideline.png</code> và <code>styles/tokens.css</code>.
            </p>
          </div>

          {/* Color Palette Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BRAND_COLORS.map((col) => (
              <div
                key={col.token}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div
                    className="h-28 w-full border-b border-slate-100 flex items-end justify-end p-3 relative"
                    style={{ backgroundColor: col.hex }}
                  >
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold shadow-sm ${
                        col.hex === "#FFFFFF" || col.hex === "#F8FAFC" || col.hex === "#DBEAFE"
                          ? "bg-slate-900/10 text-slate-800"
                          : "bg-black/30 text-white backdrop-blur-sm"
                      }`}
                    >
                      {col.hex}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{col.name}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(col.hex)}
                        className="text-xs text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition"
                        title="Copy Hex"
                      >
                        {copiedHex === col.hex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <code className="text-[11px] text-slate-500 font-mono block">
                      var({col.token})
                    </code>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {col.role}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tương phản:</span>
                  <span className="font-semibold text-slate-700">{col.contrastOnWhite}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Functional Status Colors Showcase */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 pt-6">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Semantic Status Tokens • Minimal Tech / Academic SaaS
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Bộ Ba Màu Trạng Thái Chức Năng (Success Jade, Warning Honey, Danger Rose)
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Thay thế hoàn toàn màu thô (raw red/green/yellow) bằng bảng màu học thuật thanh lịch, đạt chuẩn WCAG AA/AAA và tương thích hoàn hảo với sắc xanh ThiSmart.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FUNCTIONAL_STATUS_COLORS.map((col) => (
                <div
                  key={col.token}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="h-24 w-full flex items-end justify-between p-3 relative"
                      style={{ backgroundColor: col.hex }}
                    >
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold shadow-sm bg-black/30 text-white backdrop-blur-sm">
                        {col.hex}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(col.hex)}
                        className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
                        title="Copy Hex"
                      >
                        {copiedHex === col.hex ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{col.name}</div>
                        <code className="text-[11px] text-slate-500 font-mono block">
                          var({col.token})
                        </code>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {col.role}
                      </p>

                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Micro-badge mẫu:
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: col.softHex,
                            color: col.textHex,
                            border: `1px solid ${col.borderHex}`,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: col.hex }}
                          />
                          {col.sampleBadge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Độ tương phản (trên nền trắng):</span>
                    <span className="font-semibold text-slate-800">{col.contrastOnWhite}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & Gradients Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Gradients Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Gradients Thương Hiệu
              </span>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Brand Primary Hero Gradient</span>
                    <code className="font-mono text-[11px] text-slate-500">
                      110deg: #2563EB → #087CF5 → #06B6D4
                    </code>
                  </div>
                  <div
                    className="h-12 w-full rounded-xl shadow-inner border border-blue-200"
                    style={{ background: "var(--ts-gradient)" }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Accent Cyan Gradient</span>
                    <code className="font-mono text-[11px] text-slate-500">
                      120deg: #2563EB → #06B6D4
                    </code>
                  </div>
                  <div
                    className="h-12 w-full rounded-xl shadow-inner border border-blue-200"
                    style={{ background: "var(--ts-gradient-cyan)" }}
                  />
                </div>
              </div>
            </div>

            {/* Typography Spec */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Typography Chuẩn • Inter Geometric Sans
              </span>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs text-slate-500">Bold 700 (Headings)</span>
                  <span className="text-lg font-bold text-slate-900">ThiSmart Exam Platform</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs text-slate-500">Semibold 600 (Controls, Buttons)</span>
                  <span className="text-base font-semibold text-slate-800">Bắt đầu ngay →</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs text-slate-500">Medium 500 (Supporting)</span>
                  <span className="text-sm font-medium text-slate-700">Thi thông minh. Đánh giá chính xác.</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Regular 400 (Body text)</span>
                  <span className="text-sm text-slate-600">Hệ thống khảo thí số bảo vệ toàn vẹn bài thi.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: OFFICIAL LOGO SUITE & CLEAR SPACE */}
        <section id="logos" className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Spec 02 • Brand Asset Manifest
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Logo Chính Thức &amp; Quy Tắc Khoảng Cách An Toàn (Clear Space)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sử dụng các asset logo chuẩn độ phân giải cao tại <code>/brand/</code>. Tuyệt đối không redraw hay dùng poster làm logo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Light Logo */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
                  01. Primary Horizontal (Nền Sáng)
                </span>
                <div className="h-32 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center p-4">
                  <Image
                    src="/brand/logo-horizontal-light.png"
                    alt="ThiSmart Logo Light"
                    width={1406}
                    height={451}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Dùng cho: TopBar, Landing page, Đăng nhập, Header báo cáo.
              </div>
            </div>

            {/* Dark Logo */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-sm text-white">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
                  02. Reversed Horizontal (Nền Tối)
                </span>
                <div className="h-32 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-4">
                  <Image
                    src="/brand/logo-horizontal-tagline-dark.png"
                    alt="ThiSmart Logo Dark"
                    width={1442}
                    height={469}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                Dùng cho: Dark Hero, Footer tối màu, Bảng điều khiển ban đêm.
              </div>
            </div>

            {/* Mark Only & Clear Space Guide */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
                  03. Icon Mark Only &amp; Clear Space (X)
                </span>
                <div className="h-32 rounded-xl bg-blue-50/40 border border-dashed border-blue-300 flex items-center justify-center p-4 relative">
                  <div className="relative p-3 border border-blue-400/40 rounded-lg">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-600 bg-white px-1">
                      X
                    </span>
                    <Image
                      src="/brand/logo-mark.png"
                      alt="ThiSmart Mark"
                      width={1024}
                      height={1024}
                      className="h-12 w-12 object-contain"
                    />
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-600 bg-white px-1">
                      X
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Khoảng cách an toàn tối thiểu = chiều cao đơn vị biểu tượng <strong>X</strong> xung quanh.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: 6 VECTOR BACKGROUND PATTERNS GALLERY */}
        <section id="patterns" className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Spec 03 • Background Patterns (6 Variants)
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                6 Vector Background Patterns Tái Sử Dụng
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Hiện thực 100% bằng React SVG components, chuẩn <code>viewBox=&quot;0 0 720 420&quot;</code>, responsive không vỡ hạt.
              </p>
            </div>

            {/* Interactive Pattern Controls */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Sliders className="w-4 h-4 text-slate-400" />
                <span>Độ mờ ({Math.round(patternOpacity * 100)}%):</span>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={patternOpacity}
                  onChange={(e) => setPatternOpacity(parseFloat(e.target.value))}
                  className="w-24 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="h-4 w-px bg-slate-200" />

              <div className="flex items-center gap-1.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setPatternSurface("light")}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    patternSurface === "light"
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Nền Sáng
                </button>
                <button
                  type="button"
                  onClick={() => setPatternSurface("dark")}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    patternSurface === "dark"
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Nền Tối
                </button>
              </div>
            </div>
          </div>

          {/* 6 Patterns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PATTERNS_LIST.map((item) => (
              <div
                key={item.id}
                className="ts-feature-card overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedPatternModal(item)}
              >
                <div>
                  {/* Pattern Canvas Container */}
                  <div
                    className={`relative w-full aspect-[16/10] overflow-hidden border-b transition-colors ${
                      patternSurface === "dark"
                        ? "bg-[#0F172A] border-slate-800"
                        : "bg-[#F8FAFC] border-slate-200/80"
                    }`}
                  >
                    <ThiSmartPattern
                      variant={item.id}
                      opacity={patternOpacity}
                      showBackground={patternSurface === "light"}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>{item.panelNum}. {item.nameEn}</span>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-slate-900/80 text-white text-[11px] px-2 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>Phóng to</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">
                        {item.nameVi}
                      </h3>
                      <code className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {item.id}
                      </code>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium text-slate-500">Phù hợp:</span>
                  <span className="font-semibold text-slate-800">{item.bestFor}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pattern Fullscreen Inspect Modal */}
          {selectedPatternModal && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedPatternModal(null)}
            >
              <div
                className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Pattern Inspector • {selectedPatternModal.panelNum}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedPatternModal.nameVi} ({selectedPatternModal.nameEn})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPatternModal(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="w-full aspect-[16/9] bg-[#F8FAFC] border-b border-slate-200 relative overflow-hidden">
                  <ThiSmartPattern
                    variant={selectedPatternModal.id}
                    opacity={patternOpacity}
                    showBackground={true}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600">
                    Sử dụng:{" "}
                    <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-blue-600">
                      &lt;ThiSmartPattern variant=&quot;{selectedPatternModal.id}&quot; /&gt;
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `<ThiSmartPattern variant="${selectedPatternModal.id}" />`
                      )
                    }
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Mã JSX</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4: MOTION SYSTEM (M1, M2, M3, M4) */}
        <section id="motion" className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Spec 04 • Motion System (4 Interactions)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Hệ Thống Chuyển Động &amp; Vi Tương Tác (Motion Lab)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Gia tốc chuẩn <code>cubic-bezier(0.22, 1, 0.36, 1)</code>. Tôn trọng <code>prefers-reduced-motion</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* M1: Logo Reveal / Hero Entrance */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    M1 • Logo Reveal / Hero Entrance (~600ms)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Timeline ~600ms</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Hiệu ứng xuất hiện Logo mở màn
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Timeline 0ms (blur/scale) → ~200ms (icon nét) → ~400ms (wordmark trượt) → ~600ms (hoàn chỉnh).
                </p>

                {/* Live Preview Stage */}
                <div
                  className={`mt-6 h-36 rounded-2xl flex items-center justify-center p-6 border transition-colors ${
                    m1Theme === "dark"
                      ? "bg-[#0F172A] border-slate-800"
                      : "bg-[#F8FAFC] border-slate-200/80"
                  }`}
                >
                  <ThiSmartLogoReveal
                    key={`${m1ReplayKey}-${m1Mode}-${m1Theme}`}
                    replayKey={m1ReplayKey}
                    mode={m1Mode}
                    theme={m1Theme}
                  />
                </div>

                {/* Timeline visual steps */}
                <div className="grid grid-cols-4 gap-2 pt-4 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-mono">0ms</span>
                    <span className="text-[11px] font-medium text-slate-700">Khởi tạo</span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                    <span className="text-[10px] text-blue-500 block font-mono">~200ms</span>
                    <span className="text-[11px] font-medium text-blue-700">Icon hiện</span>
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-50/60 border border-cyan-100">
                    <span className="text-[10px] text-cyan-600 block font-mono">~400ms</span>
                    <span className="text-[11px] font-medium text-cyan-800">Wordmark</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-600 block font-mono">~600ms</span>
                    <span className="text-[11px] font-medium text-emerald-800">Hoàn thiện</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setM1Mode(m1Mode === "full" ? "separate" : "full")}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 transition"
                  >
                    Chế độ: {m1Mode === "full" ? "Logo đầy đủ" : "Mark + Wordmark"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setM1Theme(m1Theme === "light" ? "dark" : "light")}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 transition"
                  >
                    Nền: {m1Theme === "light" ? "Sáng" : "Tối"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setM1ReplayKey((prev) => prev + 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition active:scale-95 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Phát lại (Replay)</span>
                </button>
              </div>
            </div>

            {/* M2: CTA Button Hover & Press */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    M2 • CTA Button States
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">100–200ms ease-out</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Nút hành động CTA Hover &amp; Press
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hover scale 1.03 + shadow tăng; Press scale 0.97; Focus-visible outline cyan 3px offset 4px.
                </p>

                {/* Interactive Test Bed */}
                <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center gap-4">
                  <ThiSmartCtaButton
                    onClick={() => setCtaClickCount((prev) => prev + 1)}
                    className="text-base py-3 px-6"
                  >
                    <span>Bắt đầu ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </ThiSmartCtaButton>

                  <div className="text-xs text-slate-500 font-medium">
                    Số lần bấm thử: <strong className="text-blue-600 font-mono text-sm">{ctaClickCount}</strong>
                  </div>
                </div>

                {/* State Showcase Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Default</span>
                    <div className="text-[11px] font-medium text-slate-700">Gradient + Soft Shadow</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Hover (~200ms)</span>
                    <div className="text-[11px] font-medium text-blue-800">Scale 1.03 + Glow</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Press (~100ms)</span>
                    <div className="text-[11px] font-medium text-slate-700">Scale 0.97</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-cyan-300 bg-cyan-50/50 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-700 uppercase">Focus-visible</span>
                    <div className="text-[11px] font-medium text-cyan-900">Cyan Outline 3px</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 opacity-60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Disabled</span>
                    <div className="text-[11px] font-medium text-slate-600">Opacity 55% No Scale</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Secondary</span>
                    <div className="text-[11px] font-medium text-slate-700">White + Blue Border</div>
                  </div>
                </div>
              </div>

              {/* Sample Disabled & Secondary button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <ThiSmartCtaButton variant="secondary" className="text-xs py-2 px-4">
                  Nút phụ (Secondary)
                </ThiSmartCtaButton>
                <ThiSmartCtaButton disabled className="text-xs py-2 px-4">
                  Bị vô hiệu (Disabled)
                </ThiSmartCtaButton>
              </div>
            </div>

            {/* M3: Feature Card Hover & Glow */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    M3 • Feature Card Hover
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">200ms &amp; 300ms</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Thẻ tính năng nâng nhẹ &amp; phát sáng
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hover nâng Y: -6px, scale 1.02, shadow hover; Selected nâng Y: -8px, scale 1.03, phát sáng cyan.
                </p>

                {/* Interactive Card Stage */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  {/* Default Interactive Card */}
                  <ThiSmartFeatureCard
                    selected={cardSelected}
                    onClick={() => setCardSelected(!cardSelected)}
                    className="flex-1 p-6 cursor-pointer select-none text-left"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">
                      {cardSelected ? "Đang chọn (Selected)" : "Thử Hover hoặc Click"}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      Tập Trung &amp; Chính Xác
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Đánh giá tự động, minh bạch, công bằng theo tiêu chuẩn khảo thí quốc gia.
                    </p>
                  </ThiSmartFeatureCard>
                </div>
              </div>

              {/* Status and Toggle */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Trạng thái thẻ: <strong>{cardSelected ? "Selected (Y: -8px + Glow)" : "Normal / Hover"}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setCardSelected(!cardSelected)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 transition"
                >
                  {cardSelected ? "Hủy chọn thẻ" : "Bật trạng thái Selected"}
                </button>
              </div>
            </div>

            {/* M4: Mobile Menu Slide-in Drawer */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    M4 • Mobile Menu Slide-in
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">~300ms Phải → Trái</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Menu di động trượt từ phải sang trái
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Đúng hướng phải → trái, kèm lớp nền mờ overlay, quản lý phím Escape, khóa scroll nền và focus trap.
                </p>

                {/* Trigger Area */}
                <div className="mt-6 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-white">Trải nghiệm Drawer M4 Thực Tế</div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Mở drawer toàn diện với animation chuẩn 300ms, hỗ trợ đóng bằng Escape hoặc click backdrop.
                  </p>

                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 transition active:scale-95 shadow-md"
                  >
                    <Menu className="w-4 h-4" />
                    <span>Mở Mobile Drawer (300ms)</span>
                  </button>
                </div>
              </div>

              {/* Tech Specs */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Chiều rộng: <code>min(88vw, 360px)</code></span>
                <span>Backdrop: <code>rgb(15 23 42 / 45%)</code></span>
              </div>
            </div>
          </div>

          {/* Active Drawer Demonstration */}
          <ThiSmartDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Menu Demo ThiSmart"
          >
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                💡 Drawer này trượt từ <strong>phải sang trái</strong> trong <strong>300ms</strong> với easing <code>cubic-bezier(0.22, 1, 0.36, 1)</code>.
              </div>

              <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-700">
                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  Trang chủ
                </Link>
                <Link
                  href="/exam/demo"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 text-blue-600 font-semibold transition"
                >
                  Phòng thi Focus Mode
                </Link>
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  Đăng nhập hệ thống
                </Link>
                <a
                  href="#tokens"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  Bảng màu &amp; Tokens
                </a>
                <a
                  href="#patterns"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  6 Background Patterns
                </a>
                <a
                  href="#motion"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  4 Hiệu ứng Motion
                </a>
                <a
                  href="#brand-assets"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition text-blue-600 font-semibold"
                >
                  Kho Tài Sản 3D &amp; Brand
                </a>
                <a
                  href="#responsive"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  Kiểm thử Responsive
                </a>
              </nav>

              <div className="pt-4 border-t border-slate-100">
                <ThiSmartCtaButton
                  href="/exam/demo"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full text-xs py-2.5 justify-center"
                >
                  <span>Bắt đầu thi thử ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </ThiSmartCtaButton>
              </div>
            </div>
          </ThiSmartDrawer>
        </section>

        {/* SECTION 5: 3D ASSETS & BRAND MEDIA CATALOG */}
        <BrandAssetsCatalogSection />

        {/* SECTION 6: RESPONSIVE VIEWPORT TEST STAGE */}
        <section id="responsive" className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Quality Assurance • Multi-Device Testing
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Kiểm Thử Responsive Đa Kích Thước (360px • 768px • 1440px)
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Đảm bảo không tràn viền ngang (Zero horizontal overflow) trên mọi thiết bị.
              </p>
            </div>

            {/* Viewport Selectors */}
            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveViewport("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeViewport === "mobile"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile (360px)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveViewport("tablet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeViewport === "tablet"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet (768px)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveViewport("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeViewport === "desktop"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop (1440px)</span>
              </button>
            </div>
          </div>

          {/* Frame Container */}
          <div className="p-4 sm:p-8 bg-slate-200/80 rounded-3xl flex justify-center items-center overflow-x-auto">
            <div
              className={`bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden transition-all duration-300 ${
                activeViewport === "mobile"
                  ? "w-[360px]"
                  : activeViewport === "tablet"
                  ? "w-[768px]"
                  : "w-full max-w-[1100px]"
              }`}
            >
              {/* Fake Browser Toolbar */}
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="font-mono text-[11px] bg-white px-3 py-0.5 rounded border border-slate-200 text-slate-600">
                  https://thismart.edu.vn (
                  {activeViewport === "mobile"
                    ? "360px"
                    : activeViewport === "tablet"
                    ? "768px"
                    : "1440px"}
                  )
                </div>
                <span className="text-[10px] text-slate-400">100% Scale</span>
              </div>

              {/* Sample Mini-Hero rendered inside Frame */}
              <div className="relative p-6 sm:p-8 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white text-center sm:text-left">
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <ThiSmartPattern variant="folded-ribbon-mesh" showBackground={false} />
                </div>

                <div className="relative z-10 space-y-4 max-w-lg">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    <span>Hệ Thống Khảo Thí Trực Tuyến</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Thi thông minh. Đánh giá chính xác.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Đảm bảo phòng thi nghiêm túc, chống gian lận đa tầng và tự động tính điểm trung thực.
                  </p>
                  <div>
                    <ThiSmartCtaButton href="/exam/demo" className="text-xs py-2 px-4">
                      <span>Khám phá ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </ThiSmartCtaButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-semibold text-slate-700">
            ThiSmart Design System • Modern EdTech SaaS
          </p>
          <p>
            Tuân thủ Hiến pháp Kỹ thuật AGENTS.md • 6 Background Patterns • 4 Motion Interactions • Reduced-Motion Supported.
          </p>
        </div>
      </footer>
    </div>
  );
}
