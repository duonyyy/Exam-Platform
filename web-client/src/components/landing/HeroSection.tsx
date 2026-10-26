"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Timer,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

export function HeroSection() {
  const [seconds, setSeconds] = useState(2699); // 44:59 live preview

  // Live ticking countdown for the floating telemetry badge
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 2700));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/40 via-slate-50/80 to-white">
      {/* 1. Vector Background Pattern: Answer Choice Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10"
      >
        <ThiSmartPattern
          variant="answer-choice-grid"
          opacity={0.16}
          showBackground={false}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Seamless gradient transition to next section */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-0"
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-200/35 via-cyan-100/20 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (7 cols): Headline, Storytelling & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Hệ Thống Khảo Thí &amp; Giám Sát Trực Tuyến Chuẩn Mực</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.12]">
              Tổ chức kỳ thi thông minh.{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Đánh giá chính xác hơn.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Hệ thống khảo thí số tập trung, bảo vệ toàn vẹn bài làm của thí sinh và tự động hóa toàn diện quy trình tổ chức thi cho các trường đại học, viện đào tạo.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/exam/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[6px] font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-[0.99] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Timer className="w-4 h-4" />
                <span>Trải nghiệm phòng thi ngay</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <a
                href="#product-preview"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[6px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition active:scale-[0.99] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span>Xem giao diện thực tế</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Institutional Trust Metrics */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">40+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Câu hỏi / Đề thi mẫu</div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 tracking-tight">500ms</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Tự động lưu nháp</div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Đồng hồ máy chủ</div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Centerpiece Artwork & Interactive Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Backlight for Artwork */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-cyan-400/20 to-transparent rounded-[8px] blur-2xl transform -rotate-3 scale-95 pointer-events-none" />

            <div className="relative w-full max-w-[520px] aspect-[16/10] sm:aspect-[16/11] lg:aspect-auto flex items-center justify-center">
              {/* Official Master 3D Artwork */}
              <Image
                src="/brand/illustrations/illustration-hero-3d-exam-orbit.webp"
                alt="ThiSmart Platform Centerpiece — Nền tảng khảo thí số & Quỹ đạo đề thi"
                width={800}
                height={450}
                priority
                className="w-full h-auto object-contain drop-shadow-md select-none transition-transform duration-300 hover:scale-[1.01]"
              />

              {/* Floating Live Badge 1: Server-Authoritative Clock */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-slate-900/95 text-white p-3 rounded-[8px] border border-slate-800 shadow-md backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-300">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Đồng hồ máy chủ
                  </div>
                  <div className="font-mono text-sm font-bold text-cyan-400 tabular-nums">
                    {formatTime(seconds)}
                  </div>
                </div>
              </div>

              {/* Floating Live Badge 2: Autosave Status */}
              <div className="absolute -bottom-3 -left-2 sm:-left-4 bg-white/95 text-slate-900 px-3.5 py-2.5 rounded-[8px] border border-slate-200/90 shadow-md backdrop-blur-md flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Đã lưu trên máy chủ
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Đồng bộ tức thì (500ms)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
