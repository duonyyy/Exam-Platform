"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Timer,
  CheckCircle2,
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Cloud,
  CloudOff,
  Send,
  Eye,
  Check,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

interface Question {
  id: number;
  statement: string;
  points: number;
  type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
  options?: { id: string; text: string }[];
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    statement: "Trong kiến trúc RESTful API, phương thức HTTP nào có tính chất Idempotent và thường được sử dụng để cập nhật toàn bộ một tài nguyên?",
    points: 0.25,
    type: "single_choice",
    options: [
      { id: "A", text: "POST" },
      { id: "B", text: "PUT" },
      { id: "C", text: "PATCH" },
      { id: "D", text: "DELETE" },
    ],
  },
  {
    id: 2,
    statement: "Mã trạng thái HTTP 204 No Content biểu thị điều gì sau khi máy chủ xử lý thành công yêu cầu?",
    points: 0.25,
    type: "single_choice",
    options: [
      { id: "A", text: "Yêu cầu thành công nhưng không có nội dung body trả về." },
      { id: "B", text: "Tài nguyên không tìm thấy trên hệ thống." },
      { id: "C", text: "Máy chủ đang chuyển tiếp hướng tài nguyên." },
      { id: "D", text: "Xảy ra xung đột phiên bản dữ liệu." },
    ],
  },
  {
    id: 3,
    statement: "Những nguy cơ nào sau đây thuộc bảng xếp hạng OWASP API Security Top 10? (Chọn tất cả các đáp án đúng)",
    points: 0.5,
    type: "multiple_choice",
    options: [
      { id: "A", text: "BOLA / IDOR (Broken Object Level Authorization)" },
      { id: "B", text: "Broken Authentication" },
      { id: "C", text: "Server-Side Request Forgery (SSRF)" },
      { id: "D", text: "Sử dụng font chữ không có bản quyền thương mại" },
    ],
  },
  {
    id: 4,
    statement: "Trong cơ chế kiểm soát tranh chấp đồng thời, Pessimistic Locking (Khóa bi quan `lockForUpdate()`) là giải pháp bắt buộc cho nghiệp vụ Nộp bài thi (Submit Exam Attempt).",
    points: 0.25,
    type: "true_false",
    options: [
      { id: "true", text: "Đúng (True)" },
      { id: "false", text: "Sai (False)" },
    ],
  },
  {
    id: 5,
    statement: "Giao thức bảo mật tầng truyền vận TLS/SSL mã hóa dữ liệu giữa trình duyệt thí sinh và máy chủ khảo thí ThiSmart được viết tắt là gì?",
    points: 0.25,
    type: "short_answer",
  },
  {
    id: 6,
    statement: "Để ngăn chặn tấn công Double-Submit khi thí sinh bấm nút Nộp bài nhiều lần liên tiếp, Backend cần sử dụng cơ chế nào sau đây?",
    points: 0.25,
    type: "single_choice",
    options: [
      { id: "A", text: "Header Idempotency-Key kết hợp Database Transaction và Khóa bi quan" },
      { id: "B", text: "Tăng thời gian timeout của Nginx lên 500 giây" },
      { id: "C", text: "Xóa toàn bộ cache Redis của sinh viên" },
      { id: "D", text: "Tắt hoàn toàn JavaScript ở trình duyệt" },
    ],
  },
  {
    id: 7,
    statement: "Trong chuẩn RESTful API, Endpoint nào sau đây tuân thủ đúng nguyên tắc danh từ số nhiều và chuẩn hoá đường dẫn?",
    points: 0.25,
    type: "single_choice",
    options: [
      { id: "A", text: "GET /api/v1/exam-attempts/{id}/answers" },
      { id: "B", text: "GET /api/v1/getAnswersOfAttempt?id=12" },
      { id: "C", text: "POST /api/v1/deleteAttemptAnswerById" },
      { id: "D", text: "PUT /api/v1/edit_attempt_answer" },
    ],
  },
  {
    id: 8,
    statement: "Đặc tả kỹ thuật Zero-Leakage Policy quy định payload câu hỏi trả về cho Thí sinh làm bài TUYỆT ĐỐI KHÔNG ĐƯỢC chứa những trường thông tin nào?",
    points: 0.25,
    type: "single_choice",
    options: [
      { id: "A", text: "Trường correct_answer (Đáp án đúng) và explanation (Giải thích)" },
      { id: "B", text: "Nội dung câu hỏi statement" },
      { id: "C", text: "Danh sách các lựa chọn options" },
      { id: "D", text: "Mã định danh câu hỏi question_id" },
    ],
  },
];

export default function FocusExamRoomPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params?.attemptId || "attempt-842";

  // Navigation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = MOCK_QUESTIONS[currentIndex];

  // Answers State: map questionId -> selectedOptionId | string | string[]
  const [answers, setAnswers] = useState<Record<number, any>>({
    1: "B",
    2: "A",
  });

  // Flagged for review questions
  const [flagged, setFlagged] = useState<Record<number, boolean>>({
    3: true,
  });

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "offline">("saved");

  // Timer State (Server countdown ~45:00)
  const [secondsRemaining, setSecondsRemaining] = useState(2695);

  // Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proctoring Toast Alert
  const [proctoringAlert, setProctoringAlert] = useState<string | null>(null);

  // Submit handler wrapped in useCallback for timer dependency
  const handleSubmitExam = useCallback(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Redirect to submission receipt screen
      router.push(`/exam/${attemptId}/receipt`);
    }, 800);
  }, [attemptId, router]);

  // Live Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmitExam]);

  // Listen to Proctoring Sensor: visibilitychange (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setProctoringAlert(
          "Cảnh báo: Bạn vừa rời khỏi màn hình thi! Hành vi đã được ghi nhận vào Nhật ký giám sát (Telemetry)."
        );
        setTimeout(() => setProctoringAlert(null), 5000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Answer selection with debounced autosave simulation
  const handleSelectOption = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSaveStatus("saving");

    // Simulate 500ms debounced server persistence
    setTimeout(() => {
      setSaveStatus("saved");
    }, 500);
  };

  const handleToggleMultipleOption = (questionId: number, optionId: string) => {
    const currentList: string[] = answers[questionId] || [];
    const updated = currentList.includes(optionId)
      ? currentList.filter((x) => x !== optionId)
      : [...currentList, optionId];
    handleSelectOption(questionId, updated);
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalAnswered = Object.keys(answers).length;
  const progressPercent = Math.round((totalAnswered / MOCK_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900 select-none relative overflow-hidden">
      {/* Ambient Focus Field Background Pattern (opacity: 0.03) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10"
      >
        <ThiSmartPattern
          variant="rounded-arc"
          opacity={0.12}
          showBackground={false}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 1. FOCUS ROOM HEADER (Minimalist, Zero Distraction) */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Mark & Subject */}
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-mark.png"
              alt="ThiSmart Logo Mark"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Lập trình Web Nâng Cao (IT4409)
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                Thí sinh: <strong>Nguyễn Văn A</strong> • Mã SV: <strong>SV101</strong>
              </div>
            </div>
          </div>

          {/* Server-Authoritative Clock & Autosave Badge */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Autosave Status Feedback */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
              {saveStatus === "saving" && (
                <span className="text-blue-600 flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  <Cloud className="w-3.5 h-3.5 animate-pulse" />
                  <span>Đang lưu...</span>
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã lưu tất cả thay đổi</span>
                </span>
              )}
              {saveStatus === "offline" && (
                <span className="text-rose-800 flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-medium">
                  <CloudOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mất mạng</span>
                </span>
              )}
            </div>

            {/* Countdown Clock */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base tabular-nums shadow-xs ${
                secondsRemaining < 300
                  ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <Timer className="w-4 h-4 text-blue-600" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="max-w-7xl mx-auto mt-2">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Proctoring Warning Toast (if user switches tab) */}
      {proctoringAlert && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 text-amber-900 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md shadow-xs animate-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{proctoringAlert}</span>
        </div>
      )}

      {/* 2. MAIN EXAM WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Question Statement & Choices */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[520px] relative overflow-hidden">
          {/* Rounded Arc Focus Field Pattern (0.04 opacity - minimal, zero-distraction) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
          >
            <ThiSmartPattern
              variant="rounded-arc"
              opacity={0.09}
              showBackground={false}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  Câu hỏi {currentQuestion.id} / {MOCK_QUESTIONS.length}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {currentQuestion.points} điểm
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  ({currentQuestion.type.replace("_", " ")})
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                  flagged[currentQuestion.id]
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged[currentQuestion.id] ? "text-amber-600 fill-amber-500" : ""}`} />
                <span>{flagged[currentQuestion.id] ? "Đã đánh dấu xem lại" : "Đánh dấu xem lại"}</span>
              </button>
            </div>

            {/* Question Statement */}
            <div className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed mb-6">
              {currentQuestion.statement}
            </div>

            {/* Answer Choices */}
            <div className="space-y-3">
              {currentQuestion.type === "single_choice" &&
                currentQuestion.options?.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition select-none ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-600 text-blue-900 shadow-xs"
                          : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-semibold">{opt.id}.</span>
                      <span className="text-sm flex-1 leading-snug">{opt.text}</span>
                    </label>
                  );
                })}

              {currentQuestion.type === "multiple_choice" &&
                currentQuestion.options?.map((opt) => {
                  const selectedList: string[] = answers[currentQuestion.id] || [];
                  const isSelected = selectedList.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleToggleMultipleOption(currentQuestion.id, opt.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition select-none ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-600 text-blue-900 shadow-xs"
                          : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-semibold">{opt.id}.</span>
                      <span className="text-sm flex-1 leading-snug">{opt.text}</span>
                    </label>
                  );
                })}

              {currentQuestion.type === "true_false" &&
                currentQuestion.options?.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition select-none ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-600 text-blue-900 shadow-xs"
                          : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-semibold">{opt.text}</span>
                    </label>
                  );
                })}

              {currentQuestion.type === "short_answer" && (
                <div className="space-y-2 pt-2">
                  <label htmlFor="short-answer" className="text-xs text-slate-500 font-semibold block">
                    Nhập câu trả lời ngắn:
                  </label>
                  <input
                    id="short-answer"
                    type="text"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
                    placeholder="Nhập câu trả lời của bạn..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Question Navigation Footer */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const copy = { ...answers };
                delete copy[currentQuestion.id];
                setAnswers(copy);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Xóa câu trả lời
            </button>

            <button
              type="button"
              disabled={currentIndex === MOCK_QUESTIONS.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Câu tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Question Palette & Submit Action */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-24">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bảng điều hướng câu hỏi
              </span>
              <span className="text-xs text-slate-500">
                Đã làm: <strong>{totalAnswered}</strong>/{MOCK_QUESTIONS.length}
              </span>
            </div>

            {/* Question Buttons Matrix */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {MOCK_QUESTIONS.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";
                const isCurrent = idx === currentIndex;
                const isFlagged = flagged[q.id];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-11 rounded-xl text-xs font-bold transition flex items-center justify-center relative ${
                      isCurrent
                        ? "ring-2 ring-blue-600 ring-offset-2 bg-blue-600 text-white shadow-sm"
                        : isAnswered
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <span>{q.id.toString().padStart(2, "0")}</span>
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 pt-4 border-t border-slate-100 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-50 border border-blue-200" />
                <span>Đã làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-50 border border-slate-200" />
                <span>Chưa làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Đánh dấu</span>
              </div>
            </div>
          </div>

          {/* Submit Exam Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài thi</span>
            </button>
          </div>
        </div>
      </main>

      {/* 3. SUBMIT CONFIRMATION MODAL (SCR-STU-04) */}
      {submitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Xác nhận nộp bài thi
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn có chắc chắn muốn nộp bài thi ngay bây giờ? Sau khi nộp, bạn sẽ không thể thay đổi bất kỳ đáp án nào.
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">ĐÃ LÀM</span>
                <span className="font-extrabold text-blue-600 text-base">{totalAnswered}</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">CHƯA LÀM</span>
                <span className="font-extrabold text-slate-700 text-base">
                  {MOCK_QUESTIONS.length - totalAnswered}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">ĐÁNH DẤU</span>
                <span className="font-extrabold text-amber-700 text-base">
                  {Object.values(flagged).filter(Boolean).length}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setSubmitModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Quay lại làm tiếp
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitExam}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-md"
              >
                {isSubmitting ? (
                  <span>Đang ghi nhận...</span>
                ) : (
                  <>
                    <span>Xác nhận nộp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
