"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Monitor,
  Wifi,
  ArrowRight,
  HelpCircle,
  Eye,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";

import { useStartAttempt } from "@/features/student/hooks/useStartAttempt";

export default function ExamInstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params?.id || "session-101";

  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const startAttemptMutation = useStartAttempt();

  const handleStartExam = () => {
    if (!agreed) return;
    setErrorMessage(null);

    // If numeric session ID from backend
    if (!isNaN(Number(examId))) {
      startAttemptMutation.mutate(Number(examId), {
        onError: (err: any) => {
          setErrorMessage(
            err?.message || "Không thể khởi tạo ca thi. Vui lòng kiểm tra lại thời gian hoặc liên hệ cán bộ coi thi."
          );
        },
      });
      return;
    }

    // Demo/Mock fallback
    router.push(`/exam/attempt-${examId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/student/exams"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách ca thi</span>
      </Link>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Không thể bắt đầu làm bài</p>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Title & 3D Illustration */}
        <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <span>Preflight Checklist • SCR-STU-02</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hướng Dẫn &amp; Điều Kiện Dự Thi
            </h1>
            <p className="text-sm text-slate-500">
              Môn thi: <strong className="text-slate-800">Lập trình Web Nâng Cao (IT4409)</strong> • Ca thi giữa kỳ
            </p>
          </div>

          <div className="relative w-28 h-28 shrink-0 hidden sm:flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            <Image
              src="/brand/illustrations/focus-exam-room-3d.png"
              alt="Phòng thi Focus Mode"
              width={112}
              height={112}
              className="w-full h-full object-contain animate-float drop-shadow-md select-none"
            />
          </div>
        </div>

        {/* 2 Columns: Exam Specs & Preflight Check */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Specs */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Thông số bài thi</span>
            </h3>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Thời lượng làm bài:</span>
                <span className="font-bold text-slate-900">60 phút</span>
              </li>
              <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Số lượng câu hỏi:</span>
                <span className="font-bold text-slate-900">40 câu trắc nghiệm</span>
              </li>
              <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Điểm sàn đạt:</span>
                <span className="font-bold text-slate-900">5.0 / 10.0</span>
              </li>
              <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Cho phép vào muộn:</span>
                <span className="font-bold text-slate-900">Tối đa 15 phút</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Số lần thi:</span>
                <span className="font-bold text-blue-600">01 lần duy nhất</span>
              </li>
            </ul>
          </div>

          {/* Preflight Technical Checklist */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kiểm tra thiết bị &amp; môi trường</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>Kết nối mạng Internet</span>
                </div>
                <span className="font-semibold text-emerald-700">Ổn định (Online)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                  <Monitor className="w-4 h-4 text-emerald-600" />
                  <span>Trình duyệt web chuẩn</span>
                </div>
                <span className="font-semibold text-emerald-700">Hỗ trợ đầy đủ</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Đồng hồ máy chủ</span>
                </div>
                <span className="font-semibold text-blue-600">Đã đồng bộ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proctoring Rules Box */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Quy chế giám sát trực tuyến (Proctoring Rules)</span>
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed text-slate-700">
            <li>
              Thí sinh <strong>không được thoát toàn màn hình hoặc chuyển tab</strong> trong suốt thời gian thi.
            </li>
            <li>
              Mọi hành vi chuyển cửa sổ, chụp màn hình hoặc ngắt kết nối sẽ được ghi nhận vào <strong>Nhật ký giám sát (Telemetry)</strong>.
            </li>
            <li>
              Hệ thống <strong>tự động lưu đáp án sau mỗi 500ms</strong> khi bạn bấm chọn phương án.
            </li>
            <li>
              Khi bộ đếm giờ máy chủ chạm mốc 00:00, bài thi sẽ <strong>tự động khóa và nộp về máy chủ</strong>.
            </li>
          </ol>
        </div>

        {/* Commitment Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              Tôi xác nhận đã đọc kỹ quy chế phòng thi, kiểm tra đầy đủ thiết bị và cam kết <strong>làm bài trung thực, không sử dụng tài liệu trái phép hoặc nhờ người thi hộ</strong>.
            </span>
          </label>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/student/exams"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition text-center"
          >
            Hủy và quay lại
          </Link>
          <ThiSmartCtaButton
            disabled={!agreed || startAttemptMutation.isPending}
            onClick={handleStartExam}
            className="w-full sm:w-auto text-sm py-3 px-8 justify-center shadow-lg"
          >
            <span>{startAttemptMutation.isPending ? "Đang mở phòng thi..." : "Bắt đầu làm bài thi"}</span>
            <ArrowRight className="w-4 h-4" />
          </ThiSmartCtaButton>
        </div>
      </div>
    </div>
  );
}
