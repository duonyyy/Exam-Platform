"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Info,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Cpu,
  Share2,
  Workflow,
  Compass,
  Waves,
} from "lucide-react";
import {
  ThiSmartPattern,
  type ThiSmartPatternVariant,
} from "@/components/patterns/ThiSmartPattern";

interface VectorPatternInfo {
  id: ThiSmartPatternVariant;
  index: string;
  nameVi: string;
  nameEn: string;
  category: string;
  icon: React.ElementType;
  primaryColor: string;
  bestUsedIn: string;
  realWorldRoute: string;
  routeLabel: string;
  description: string;
  geometryNotes: string;
  defaultOpacity: number;
}

const VECTOR_PATTERNS: VectorPatternInfo[] = [
  {
    id: "dot-grid",
    index: "01",
    nameVi: "Lưới Chấm Tri Thức",
    nameEn: "Dot Grid Pattern",
    category: "Knowledge Matrix",
    icon: Compass,
    primaryColor: "#2563EB",
    bestUsedIn: "Cột thương hiệu Đăng nhập, Thẻ ca thi của sinh viên, Dashboard",
    realWorldRoute: "/login",
    routeLabel: "Xem tại Trang Đăng Nhập",
    description:
      "Ma trận 8 × 12 chấm tròn pastel với điểm nhấn các chấm Primary Blue (#2563EB) và Cyan Accent (#06B6D4). Tượng trưng cho các đơn vị kiến thức số hóa trong ngân hàng câu hỏi.",
    geometryNotes:
      "8 hàng × 12 cột, bán kính 4.8px - 7px, phân bổ toán học xác định, không gây lệch hydration SSR.",
    defaultOpacity: 0.85,
  },
  {
    id: "answer-choice-grid",
    index: "02",
    nameVi: "Họa Tiết Đáp Án Trắc Nghiệm",
    nameEn: "Answer Choice Grid",
    category: "Assessment Geometry",
    icon: GraduationCap,
    primaryColor: "#06B6D4",
    bestUsedIn: "Khối Hero Trang Chủ (Landing Page), Feature Showcase",
    realWorldRoute: "/",
    routeLabel: "Xem tại Trang Chủ (Hero)",
    description:
      "Lưới thẻ pill 3 cột × 4 hàng bo góc 31px với các nút radio được chọn (gradient xanh cyan) xen kẽ các ô viền rỗng. Khắc họa trực quan bản sắc thi cử trắc nghiệm hiện đại.",
    geometryNotes:
      "3 cột × 4 hàng pill bo tròn r=31px, radio 15px có chấm tâm 6px, gradient #2563EB → #06B6D4.",
    defaultOpacity: 0.85,
  },
  {
    id: "flowchart-topology",
    index: "03",
    nameVi: "Sơ Đồ Dòng Chảy & Mạng Lưới Tri Thức",
    nameEn: "Flowchart Topology & Academic Network",
    category: "Knowledge Topology",
    icon: Workflow,
    primaryColor: "#38BDF8",
    bestUsedIn: "Soạn đề thi mẫu (Blueprints & Assembler), Báo cáo kết quả, Biên lai",
    realWorldRoute: "/teacher/exams",
    routeLabel: "Xem tại Quản Lý Đề Thi",
    description:
      "Chùm 14 nodes tri thức nối bởi 21 cạnh mảnh và vầng hào quang phát sáng. Thể hiện tư duy kiến trúc ma trận câu hỏi, độ phân biệt đề thi và dòng chảy dữ liệu khảo thí chuẩn mực.",
    geometryNotes:
      "14 tọa độ nút chuẩn xác, bán kính 5px - 24px, 21 đường nối viền #38BDF8 / #93C5FD, 2 tâm hào quang.",
    defaultOpacity: 0.85,
  },
  {
    id: "circuit-board",
    index: "04",
    nameVi: "Vi Mạch Công Nghệ & Giám Sát AI",
    nameEn: "Circuit Board & AI Telemetry",
    category: "Telemetry & Security",
    icon: Cpu,
    primaryColor: "#06B6D4",
    bestUsedIn: "Trung tâm Giám sát Trực tiếp (Live Proctoring), Phòng điều hành AI",
    realWorldRoute: "/teacher/sessions/ses-842/monitor",
    routeLabel: "Xem tại Phòng Giám Sát",
    description:
      "Hệ thống vi mạch vi xử lý AI giám sát gian lận, các đường bus dữ liệu 45°/90°, chip xử lý trung tâm, các chân IC và điểm tiếp xúc testpad công nghệ cao.",
    geometryNotes:
      "Chip trung tâm rx=10px, 4 nhánh bus đa tuyến, 20+ điểm hàn solder vias có vòng khuyên đồng.",
    defaultOpacity: 0.85,
  },
  {
    id: "rounded-arc",
    index: "05",
    nameVi: "Cung Tròn Tập Trung & Quỹ Đạo",
    nameEn: "Rounded Arc Focus Field",
    category: "Focus Field",
    icon: ShieldCheck,
    primaryColor: "#2563EB",
    bestUsedIn: "Phòng thi Trực tuyến Focus Mode (Khu vực câu hỏi), Thẻ làm bài",
    realWorldRoute: "/exam/attempt-842",
    routeLabel: "Xem tại Phòng Thi Focus Mode",
    description:
      "Các cung bo tròn oversized quét mềm mại qua mép khung với nét stroke đa tầng gradient xanh dương và cyan. Tạo trường thị giác định hướng tập trung vào câu hỏi mà không gây phân tâm thí sinh.",
    geometryNotes:
      "3 cụm cung tròn quét lớn (Left cluster, Top-right, Bottom-right), stroke-width 92px - 170px kết hợp viền mảnh 1.5px.",
    defaultOpacity: 0.85,
  },
  {
    id: "soft-wave-divider",
    index: "06",
    nameVi: "Dải Sóng Phân Tầng Chuyển Tiếp",
    nameEn: "Soft Wave Organic Divider",
    category: "Section Transition",
    icon: Waves,
    primaryColor: "#38BDF8",
    bestUsedIn: "Chuyển tiếp phân đoạn Trang Chủ (giữa nền sáng và nền Dark Navy)",
    realWorldRoute: "/",
    routeLabel: "Xem tại Phân Đoạn Trang Chủ",
    description:
      "5 lớp sóng hữu cơ xếp tầng chuyển tiếp màu xanh dương êm dịu sang cyan với đường đỉnh sóng màu trắng sắc nét. Tạo chuyển động phân tầng mượt mà giữa các khối nội dung lớn.",
    geometryNotes:
      "5 layer đường cong Bezier C/Q, gradient fade, đỉnh sóng stroke #FFFFFF 4px sắc nét.",
    defaultOpacity: 0.85,
  },
  {
    id: "folded-ribbon-mesh",
    index: "07",
    nameVi: "Lưới Dải Gấp Thương Hiệu (Bonus Spec)",
    nameEn: "Folded Ribbon Brand Mesh",
    category: "Brand Architecture",
    icon: Layers,
    primaryColor: "#2563EB",
    bestUsedIn: "Banner sự kiện khảo thí, Section đồ họa nhận diện thương hiệu",
    realWorldRoute: "/design-system#patterns",
    routeLabel: "Xem tại Design System",
    description:
      "Các dải chéo rộng giao nhau mô phỏng nếp gấp chữ T và giấy thi với gradient Cyan → Blue mềm mại. Thể hiện tính tổ chức và tính xác thực của đề thi.",
    geometryNotes:
      "6 khối ribbon chéo đa giác bo góc gấp Q-curve, 3 linear gradient kết hợp clipPath.",
    defaultOpacity: 0.85,
  },
];

export default function VectorPatternsShowcasePage() {
  const [selectedBg, setSelectedBg] = useState<"light" | "white" | "dark" | "gradient">("white");
  const [globalOpacity, setGlobalOpacity] = useState<number>(1);
  const [showBackground, setShowBackground] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"grid" | "cinema">("grid");
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(0);

  const currentPattern = VECTOR_PATTERNS[selectedPatternIndex];

  const handleCopyCode = (id: string) => {
    const snippet = `<ThiSmartPattern variant="${id}" opacity={${globalOpacity}} showBackground={${showBackground}} />`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectBg = (bg: "light" | "white" | "dark" | "gradient") => {
    setSelectedBg(bg);
    if (bg === "dark" || bg === "gradient") {
      setShowBackground(false);
    } else if (bg === "white") {
      setShowBackground(true);
    }
  };

  const getBgStyle = () => {
    switch (selectedBg) {
      case "dark":
        return "bg-slate-900 border-slate-800 text-white";
      case "light":
        return "bg-slate-100 border-slate-200 text-slate-900";
      case "gradient":
        return "bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border-blue-900/60 text-white";
      case "white":
      default:
        return "bg-white border-slate-200 text-slate-900";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition"
              title="Về Trang Chủ"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                  ThiSmart Vector Lab
                </span>
                <span className="text-xs text-slate-400 font-mono">v1.0 • Pure SVG</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Triển Lãm 6 Vector Background Patterns
              </h1>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/design-system#patterns"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Design System</span>
            </Link>

            <Link
              href="/exam/demo"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-xs"
            >
              <span>Xem Phòng Thi Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Global Interactive Control Console */}
        <div className="bg-slate-100/90 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("grid")}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "grid"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Xem lưới toàn bộ (6 Panels)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cinema")}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "cinema"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Chế độ Studio chiếu rộng</span>
              </button>
            </div>

            {/* Background Theme Switcher */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 hidden sm:inline">Màu nền khung:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleSelectBg("white")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedBg === "white"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Trắng (White)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectBg("light")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedBg === "light"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Xám pastel
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectBg("dark")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedBg === "dark"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Dark Navy
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectBg("gradient")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedBg === "gradient"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Gradient Đêm
                </button>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Độ rõ (Opacity):</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={globalOpacity}
                  onChange={(e) => setGlobalOpacity(parseFloat(e.target.value))}
                  className="w-24 sm:w-32 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-mono font-bold text-blue-600 w-10 text-right">
                  {Math.round(globalOpacity * 100)}%
                </span>
              </div>
            </div>

            {/* Show/Hide Default SVG Background */}
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showBackground}
                onChange={(e) => setShowBackground(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Nền gốc SVG</span>
            </label>
          </div>
        </div>
      </header>

      {/* 3. Main Content Showcase */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Intro Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Design System Spec • Single Source of Truth
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Toàn bộ Vector Patterns Khảo Thí &amp; Giám Sát ThiSmart
            </h2>
            <p className="text-sm text-blue-50 leading-relaxed">
              Tất cả 6+ vector patterns được dựng bằng toán học hình học thuần túy (SVG path, circle, rect, gradient).
              Đảm bảo <strong>100% độ sắc nét ở mọi độ phân giải màn hình</strong>, tương thích chế độ tối/sáng,
              zero click interception (không chắn chuột) và chuẩn trợ năng WCAG 2.2 AA.
            </p>
          </div>
        </div>

        {/* MODE A: GRID VIEW (All 6 Patterns) */}
        {activeTab === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VECTOR_PATTERNS.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Pattern Canvas Box */}
                  <div className={`relative h-60 w-full overflow-hidden border-b ${getBgStyle()}`}>
                    <div className="absolute inset-0">
                      <ThiSmartPattern
                        variant={item.id}
                        opacity={globalOpacity}
                        showBackground={showBackground}
                        className="w-full h-full object-cover transition-opacity duration-150"
                      />
                    </div>

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black font-mono shadow-xs border border-white/10">
                        {item.index}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-xs border border-slate-200">
                        {item.category}
                      </span>
                    </div>

                    {/* Quick Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(item.id)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition"
                      title="Copy React Code Snippet"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Pattern Info Card */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: item.primaryColor }}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">
                            {item.nameVi}
                          </h3>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {item.nameEn}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Route Usage Link */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        variant=&quot;{item.id}&quot;
                      </span>

                      <Link
                        href={item.realWorldRoute}
                        className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition"
                      >
                        <span>{item.routeLabel}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODE B: CINEMA / STUDIO VIEW (Large Full-Viewport Inspection) */}
        {activeTab === "cinema" && (
          <div className="space-y-6">
            {/* Horizontal Pattern Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {VECTOR_PATTERNS.map((item, idx) => {
                const IconComp = item.icon;
                const isSelected = selectedPatternIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPatternIndex(idx)}
                    className={`px-4 py-2.5 rounded-2xl border text-xs font-bold shrink-0 transition flex items-center gap-2 ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>
                      {item.index}. {item.nameVi}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Big Studio Canvas */}
            <div
              className={`relative h-[480px] sm:h-[560px] w-full rounded-3xl overflow-hidden border shadow-xl flex flex-col justify-between ${getBgStyle()}`}
            >
              {/* Pattern Full Canvas */}
              <div className="absolute inset-0">
                <ThiSmartPattern
                  variant={currentPattern.id}
                  opacity={globalOpacity}
                  showBackground={showBackground}
                  className="w-full h-full object-cover transition-opacity duration-150"
                />
              </div>

              {/* Top Controls Overlay */}
              <div className="relative z-10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-xs font-black font-mono shadow-md border border-white/10">
                    Panel {currentPattern.index}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md border border-slate-200">
                    {currentPattern.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(currentPattern.id)}
                  className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200 flex items-center gap-2 transition"
                >
                  {copiedId === currentPattern.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Đã copy mã JSX!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy React Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Info HUD Card */}
              <div className="relative z-10 p-6">
                <div className="max-w-2xl bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-xl space-y-3 text-slate-900">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black tracking-tight text-slate-900">
                      {currentPattern.nameVi} — {currentPattern.nameEn}
                    </h3>
                    <Link
                      href={currentPattern.realWorldRoute}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition"
                    >
                      <span>Mở màn hình thực tế</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentPattern.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div>
                      <strong>Vị trí áp dụng:</strong> {currentPattern.bestUsedIn}
                    </div>
                    <div>
                      <strong>Thông số hình học:</strong> {currentPattern.geometryNotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Technical Specs & Usage Guide Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Bảng Tham Chiếu Kỹ Thuật (Developer Quick Reference)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cách sử dụng component `ThiSmartPattern` trong toàn bộ mã nguồn `web-client`.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Zero Click Interception (pointer-events-none)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Variant ID</th>
                  <th className="py-3 px-4">Tên Tiếng Việt</th>
                  <th className="py-3 px-4">Vị trí Nghiệp Vụ</th>
                  <th className="py-3 px-4">Độ mờ khuyến nghị</th>
                  <th className="py-3 px-4">Mã nhúng mẫu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {VECTOR_PATTERNS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      &quot;{item.id}&quot;
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.nameVi}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.bestUsedIn}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      0.08 — 0.25
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <code>&lt;ThiSmartPattern variant=&quot;{item.id}&quot; /&gt;</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            ThiSmart Design System • <strong>Vector Background Patterns Lab v1.0</strong>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600 transition">
              Trang Chủ
            </Link>
            <span>•</span>
            <Link href="/exam/demo" className="hover:text-blue-600 transition">
              Phòng Thi Focus Mode
            </Link>
            <span>•</span>
            <Link href="/teacher/sessions/ses-842/monitor" className="hover:text-blue-600 transition">
              Live Proctoring
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
