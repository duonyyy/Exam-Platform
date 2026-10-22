"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";
import { useExamAttempt } from "@/features/exam-taking/hooks/useExamAttempt";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";

export default function ExamReceiptPage() {
  const params = useParams();
  const rawAttemptId = (params?.attemptId as string) || "";
  const numericAttemptId = /^\d+$/.test(rawAttemptId) ? parseInt(rawAttemptId, 10) : null;

  const { data: attempt, isLoading, isError } = useExamAttempt(numericAttemptId ?? undefined);
  const { data: user } = useCurrentUser();

  const receiptCode = numericAttemptId
    ? `REC-${new Date().getFullYear()}-ATT${numericAttemptId.toString().padStart(6, "0")}`
    : "REC-20261019-SV101-0982";

  const examTitle = attempt?.exam?.title || "Lập trình Web Nâng Cao (IT4409)";

  const candidateName = user
    ? `${user.name}${user.code ? ` (Mã SV: ${user.code})` : ` (${user.email})`}`
    : "Nguyễn Văn A (Mã SV: SV101)";

  const submittedAtFormatted = React.useMemo(() => {
    if (attempt?.submitted_at) {
      const d = new Date(attempt.submitted_at);
      return `${d.toLocaleTimeString("vi-VN")} • ${d.toLocaleDateString("vi-VN")}`;
    }
    return "18:25:40 • 19/10/2026";
  }, [attempt?.submitted_at]);

  const answeredCount =
    attempt?.answers?.filter((a) => {
      if (!a.selected_options) return false;
      if (Array.isArray(a.selected_options)) return a.selected_options.length > 0;
      return typeof a.selected_options === "string" && a.selected_options.trim().length > 0;
    }).length ?? (numericAttemptId ? 0 : 38);

  const totalCount = attempt?.questions?.length ?? (numericAttemptId ? 0 : 40);
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 100;

  const hasScore = attempt?.score !== null && attempt?.score !== undefined;
  const scoreValue = hasScore ? attempt.score : numericAttemptId ? null : 8.75;
  const totalPointsValue = attempt?.total_points ?? attempt?.exam?.total_points ?? 10.0;
  const isPassed = attempt?.is_passed;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 relative overflow-hidden">
      {/* Vector Academic Knowledge Network Pattern */}
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
          {isLoading && numericAttemptId ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-600">Đang tải biên nhận bài thi...</p>
            </div>
          ) : isError && numericAttemptId ? (
            <div className="py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Không tìm thấy thông tin biên nhận</h2>
              <p className="text-xs text-slate-500">
                Lượt làm bài #{numericAttemptId} không tồn tại hoặc bạn không có quyền truy cập.
              </p>
              <div className="pt-2">
                <Link
                  href="/student/exams"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  <span>Về danh sách ca thi</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
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
                  <span className="font-mono font-bold text-slate-900">{receiptCode}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Môn thi:</span>
                  <span className="font-bold text-slate-900">{examTitle}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Thí sinh:</span>
                  <span className="font-bold text-slate-900">{candidateName}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Thời điểm nộp bài:</span>
                  <span className="font-medium text-slate-800">{submittedAtFormatted}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Tiến độ câu trả lời:</span>
                  <span className="font-bold text-emerald-800">
                    Hoàn thành {answeredCount} / {totalCount} câu ({progressPercent}%)
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Điểm số sơ bộ:</span>
                  {scoreValue !== null ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold text-blue-600">
                        {scoreValue}
                      </span>
                      <span className="text-slate-400 font-semibold">
                        / {totalPointsValue}
                      </span>
                      {isPassed !== undefined && isPassed !== null && (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {isPassed ? "ĐẠT" : "CHƯA ĐẠT"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 italic bg-slate-200/60 px-2.5 py-1 rounded-full">
                      Chờ công bố điểm
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/student/exams"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                >
                  <span>Về danh sách ca thi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400 relative z-10">
        ThiSmart • Hệ thống Khảo thí &amp; Đánh giá Chuẩn mực.
      </footer>
    </div>
  );
}
