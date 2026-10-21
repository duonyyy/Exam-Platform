"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  FileCheck,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

export default function ExamReceiptPage() {
  const params = useParams();
  const attemptId = params?.attemptId || "attempt-842";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 relative overflow-hidden">
      {/* Vector Academic Knowledge Network Pattern (Clear & Visible: 0.16 opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10"
      >
        <ThiSmartPattern
          variant="academic-network"
          opacity={0.16}
          showBackground={false}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-100/50 via-cyan-50/30 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-6 text-center">
          {/* 3D Graduation Cap & Success Badge */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center mb-2">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl -z-10 animate-pulse pointer-events-none" />
            <Image
              src="/brand/icons-3d/icon-graduation-cap.png"
              alt="Hoàn thành bài thi"
              width={96}
              height={96}
              className="w-24 h-24 object-contain animate-float drop-shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 border-2 border-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Nộp bài thi thành công
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Biên Nhận Nộp Bài Điện Tử
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Bài thi của bạn đã được ghi nhận nguyên vẹn vào cơ sở dữ liệu máy chủ và xác thực toàn vẹn bằng chữ ký số.
            </p>
          </div>

          {/* Receipt Card Details */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Mã biên nhận:</span>
              <span className="font-mono font-bold text-slate-900">
                REC-20261019-SV101-0982
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Môn thi:</span>
              <span className="font-bold text-slate-900">
                Lập trình Web Nâng Cao (IT4409)
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Thí sinh:</span>
              <span className="font-bold text-slate-900">
                Nguyễn Văn A (Mã SV: SV101)
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Thời điểm nộp bài:</span>
              <span className="font-medium text-slate-800">
                18:25:40 • 19/10/2026
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Tiến độ câu trả lời:</span>
              <span className="font-bold text-emerald-800">
                Hoàn thành 38 / 40 câu (95%)
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500">Điểm số sơ bộ:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-blue-600">8.75</span>
                <span className="text-slate-400 font-semibold">/ 10.0</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/student/results/${attemptId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
            >
              <span>Xem chi tiết bài làm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/student/exams"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <span>Về danh sách ca thi</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400 relative z-10">
        ThiSmart • Hệ thống Khảo thí &amp; Đánh giá Chuẩn mực.
      </footer>
    </div>
  );
}
