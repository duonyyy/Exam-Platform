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
import { useExamAttempt } from "@/features/exam-taking/hooks/useExamAttempt";
import { useSaveAnswer } from "@/features/exam-taking/hooks/useSaveAnswer";
import { useSubmitAttempt } from "@/features/exam-taking/hooks/useSubmitAttempt";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useProctoringCollector } from "@/features/proctoring/hooks/useProctoringCollector";
import { ExamWatermark } from "@/features/exam-taking/components/ExamWatermark";

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

  // Parse numeric attempt ID
  const rawAttemptId = typeof attemptId === "string" ? attemptId : String(attemptId);
  const numericAttemptId = !isNaN(Number(rawAttemptId))
    ? Number(rawAttemptId)
    : !isNaN(Number(rawAttemptId.replace("attempt-", "")))
    ? Number(rawAttemptId.replace("attempt-", ""))
    : undefined;

  const { data: attemptDetail, isLoading: isAttemptLoading } = useExamAttempt(numericAttemptId);
  const { data: currentUser } = useCurrentUser();
  const saveAnswerMutation = useSaveAnswer(numericAttemptId);
  const submitAttemptMutation = useSubmitAttempt(numericAttemptId);

  // Background Proctoring Event Collector (Phase 10)
  useProctoringCollector({
    attemptId: numericAttemptId ?? null,
    enabled: attemptDetail?.status === "in_progress",
  });

  // Dynamic Questions from server or fallback to mock
  const questions: Question[] =
    attemptDetail?.questions && attemptDetail.questions.length > 0
      ? attemptDetail.questions.map((q) => ({
          id: q.id,
          statement: q.question_text,
          points: q.points,
          type: q.question_type,
          options: q.options?.map((opt) => ({
            id: opt.id,
            text: opt.content,
          })),
        }))
      : MOCK_QUESTIONS;

  // Navigation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex] || questions[0];

  // Answers State: map questionId -> selectedOptionId | string | string[]
  const [answers, setAnswers] = useState<Record<number, any>>({});

  // Sync existing answers from server attempt
  useEffect(() => {
    if (attemptDetail?.answers && attemptDetail.answers.length > 0) {
      const initial: Record<number, any> = {};
      attemptDetail.answers.forEach((ans) => {
        initial[ans.question_id] = ans.selected_options;
      });
      setAnswers((prev) => ({ ...initial, ...prev }));
    }
  }, [attemptDetail?.answers]);

  // Flagged for review questions
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "offline">("saved");

  // Timer State (Server countdown)
  const [secondsRemaining, setSecondsRemaining] = useState(attemptDetail?.remaining_seconds ?? 2700);

  // Sync timer when server provides authoritative remaining seconds
  useEffect(() => {
    if (attemptDetail?.remaining_seconds !== undefined) {
      setSecondsRemaining(attemptDetail.remaining_seconds);
    }
  }, [attemptDetail?.remaining_seconds]);

  // Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Proctoring Toast Alert
  const [proctoringAlert, setProctoringAlert] = useState<string | null>(null);

  // Submit handler wrapped in useCallback for timer dependency
  const handleSubmitExam = useCallback(() => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (numericAttemptId) {
      submitAttemptMutation.mutate(undefined, {
        onSuccess: () => {
          router.push(`/exam/${attemptId}/receipt`);
        },
        onError: (err: any) => {
          setIsSubmitting(false);
          setSubmitError(
            err?.message || "Không thể nộp bài thi. Vui lòng kiểm tra lại kết nối mạng."
          );
        },
      });
    } else {
      setTimeout(() => {
        router.push(`/exam/${attemptId}/receipt`);
      }, 800);
    }
  }, [numericAttemptId, attemptId, router, submitAttemptMutation]);

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

  // Answer selection with real debounced server autosave
  const handleSelectOption = useCallback((questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSaveStatus("saving");

    if (numericAttemptId) {
      saveAnswerMutation.mutate(
        { question_id: questionId, selected_options: value },
        {
          onSuccess: () => setSaveStatus("saved"),
          onError: () => setSaveStatus("offline"),
        }
      );
    } else {
      setTimeout(() => {
        setSaveStatus("saved");
      }, 500);
    }
  }, [numericAttemptId, saveAnswerMutation]);

  const handleToggleMultipleOption = useCallback((questionId: number, optionId: string) => {
    const currentList: string[] = answers[questionId] || [];
    const updated = currentList.includes(optionId)
      ? currentList.filter((x) => x !== optionId)
      : [...currentList, optionId];
    handleSelectOption(questionId, updated);
  }, [answers, handleSelectOption]);

  // Keyboard shortcuts (A, B, C, D to answer; ArrowLeft / ArrowRight to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (submitModalOpen) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key) && currentQuestion) {
        if (currentQuestion.type === "single_choice") {
          const opt = currentQuestion.options?.find((o) => o.id.toUpperCase() === key);
          if (opt) {
            handleSelectOption(currentQuestion.id, opt.id);
          }
        } else if (currentQuestion.type === "multiple_choice") {
          const opt = currentQuestion.options?.find((o) => o.id.toUpperCase() === key);
          if (opt) {
            handleToggleMultipleOption(currentQuestion.id, opt.id);
          }
        }
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, questions.length, submitModalOpen, handleSelectOption, handleToggleMultipleOption]);

  // Listen to Proctoring Sensor: visibilitychange (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setProctoringAlert(
          "Cảnh báo: Bạn vừa rời khỏi màn hình làm bài! Hành vi này đã được ghi nhận tự động vào biên bản giám sát."
        );
        setTimeout(() => setProctoringAlert(null), 5000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalAnswered = questions.filter((q) => {
    const val = answers[q.id];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    return true;
  }).length;
  const progressPercent = Math.round((totalAnswered / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 select-none relative">
      {/* 0. DYNAMIC ANTI-CHEATING WATERMARK OVERLAY */}
      <ExamWatermark
        studentName={currentUser?.name || "Nguyễn Văn A"}
        studentCode={currentUser?.code || "SV2026101"}
        sessionCode={attemptDetail?.exam?.title || rawAttemptId}
      />

      {/* 1. FOCUS ROOM HEADER (Minimalist, Zero Distraction) */}
      <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Exam Title & Candidate Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-blue-700 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              TS
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {attemptDetail?.exam?.title || "Kiểm tra Giữa kỳ — Lập trình Web Nâng Cao"}
              </div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Thí sinh: <strong className="text-slate-800">{currentUser?.name || "Nguyễn Văn A"}</strong> • Mã SV: <strong className="text-slate-800">{currentUser?.code || "SV2026101"}</strong>
              </div>
            </div>
          </div>

          {/* Center: Countdown Clock (High-contrast, Tabular-nums) */}
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-[6px] border font-mono font-bold text-sm sm:text-base tabular-nums shadow-xs ${
                secondsRemaining < 300
                  ? "bg-amber-50 border-amber-300 text-amber-900 animate-pulse"
                  : "bg-slate-900 text-white border-slate-800"
              }`}
            >
              <Clock className={`w-4 h-4 ${secondsRemaining < 300 ? "text-amber-600" : "text-blue-400"}`} />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          {/* Right: Autosave Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-[6px] border ${
              saveStatus === "saving"
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : saveStatus === "offline"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                saveStatus === "saving"
                  ? "bg-blue-600 animate-ping"
                  : saveStatus === "offline"
                  ? "bg-rose-600"
                  : "bg-emerald-600"
              }`} />
              <span>
                {saveStatus === "saving"
                  ? "Đang lưu..."
                  : saveStatus === "offline"
                  ? "Mất mạng"
                  : "✓ Đã tự động lưu"}
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="max-w-7xl mx-auto mt-2">
          <div className="w-full bg-slate-100 rounded-[2px] h-1 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Proctoring Warning Toast */}
      {proctoringAlert && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-xs animate-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{proctoringAlert}</span>
        </div>
      )}

      {/* 2. MAIN EXAM WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Question Statement & Choices */}
        <div className="lg:col-span-8 bg-white rounded-[8px] border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between min-h-[520px]">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Câu hỏi {currentQuestion.id} / {questions.length}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-[4px] bg-blue-50 text-blue-700 border border-blue-200">
                  {currentQuestion.points} điểm
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  ({currentQuestion.type.replace("_", " ")})
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[6px] border transition ${
                  flagged[currentQuestion.id]
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "text-slate-600 border-slate-200/90 hover:bg-slate-50"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged[currentQuestion.id] ? "text-amber-600 fill-amber-500" : ""}`} />
                <span>{flagged[currentQuestion.id] ? "Đã đánh dấu" : "Đánh dấu xem lại"}</span>
              </button>
            </div>

            {/* Question Statement */}
            <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed mb-6">
              {currentQuestion.statement}
            </div>

            {/* Answer Choices (Sharp mechanical keys [A], [B], [C], [D]) */}
            <div className="space-y-2.5">
              {currentQuestion.type === "single_choice" &&
                currentQuestion.options?.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`flex items-center gap-3.5 p-3.5 rounded-[6px] border transition cursor-pointer select-none text-left ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-600 text-blue-950 font-medium ring-1 ring-blue-600/30"
                          : "border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 bg-white"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-[4px] text-xs font-bold flex items-center justify-center shrink-0 border transition ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0 stroke-[2.5]" />
                      )}
                    </div>
                  );
                })}

              {currentQuestion.type === "multiple_choice" &&
                currentQuestion.options?.map((opt) => {
                  const selectedList: string[] = answers[currentQuestion.id] || [];
                  const isSelected = selectedList.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleToggleMultipleOption(currentQuestion.id, opt.id)}
                      className={`flex items-center gap-3.5 p-3.5 rounded-[6px] border transition cursor-pointer select-none text-left ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-600 text-blue-950 font-medium ring-1 ring-blue-600/30"
                          : "border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 bg-white"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-[4px] text-xs font-bold flex items-center justify-center shrink-0 border transition ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0 stroke-[2.5]" />
                      )}
                    </div>
                  );
                })}

              {currentQuestion.type === "true_false" &&
                currentQuestion.options?.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`flex items-center gap-3.5 p-3.5 rounded-[6px] border transition cursor-pointer select-none text-left ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-600 text-blue-950 font-medium ring-1 ring-blue-600/30"
                          : "border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 bg-white"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-[4px] text-xs font-bold flex items-center justify-center shrink-0 border transition ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {opt.id === "true" ? "Đ" : "S"}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0 stroke-[2.5]" />
                      )}
                    </div>
                  );
                })}

              {currentQuestion.type === "short_answer" && (
                <div className="space-y-2 pt-2">
                  <label htmlFor="short-answer" className="text-xs text-slate-600 font-bold block">
                    Nhập câu trả lời ngắn:
                  </label>
                  <input
                    id="short-answer"
                    type="text"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
                    placeholder="Gõ câu trả lời của bạn vào đây..."
                    className="w-full px-3.5 py-2.5 rounded-[6px] border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              )}
            </div>

            {/* Hint for keyboard shortcuts */}
            <div className="mt-4 text-[11px] text-slate-600 flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded-[4px] bg-slate-100 border border-slate-200 font-mono text-[10px]">Phím tắt</span>
              <span>Bấm phím A, B, C, D trên bàn phím để chọn nhanh phương án • ← / → để chuyển câu.</span>
            </div>
          </div>

          {/* Question Navigation Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] text-xs font-semibold text-slate-700 border border-slate-200/90 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
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
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
            >
              <span>Câu tiếp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Question Palette (Sharp 32x32px grid, 3 states) */}
        <div className="lg:col-span-4 bg-white rounded-[8px] border border-slate-200/90 p-5 shadow-xs space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Danh sách câu hỏi
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Đã làm: <strong className="text-blue-700">{totalAnswered}</strong>/{questions.length}
            </span>
          </div>

          {/* Question Buttons Matrix (32x32px sharp buttons) */}
          <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAnswered =
                answers[q.id] !== undefined &&
                answers[q.id] !== "" &&
                (!Array.isArray(answers[q.id]) || answers[q.id].length > 0);
              const isCurrent = idx === currentIndex;
              const isFlagged = flagged[q.id];

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-[4px] text-xs font-bold transition flex items-center justify-center relative tabular-nums ${
                    isCurrent
                      ? "ring-2 ring-blue-600 ring-offset-1 bg-blue-700 text-white"
                      : isAnswered
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "bg-white text-slate-700 border border-slate-200/90 hover:border-slate-400"
                  }`}
                  title={`Câu ${idx + 1}`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend (3 clear states) */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-blue-600 border border-blue-600" />
              <span>Đã làm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-white border border-slate-300" />
              <span>Chưa làm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Đánh dấu</span>
            </div>
          </div>

          {/* Submit Exam Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-[6px] font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài thi</span>
            </button>
          </div>
        </div>
      </main>

      {/* 3. SUBMIT CONFIRMATION MODAL */}
      {submitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-[8px] max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-[6px] bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Xác nhận nộp bài thi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn đã hoàn thành <strong>{totalAnswered}/{questions.length}</strong> câu. 
                {questions.length - totalAnswered > 0 ? (
                  <span> Còn <strong>{questions.length - totalAnswered}</strong> câu chưa làm.</span>
                ) : (
                  <span> Bạn đã hoàn thành tất cả các câu hỏi.</span>
                )}
                {" "}Bạn có chắc chắn muốn nộp bài?
              </p>
            </div>

            {submitError && (
              <div className="p-3 rounded-[6px] bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left">
                <strong>Lỗi nộp bài:</strong> {submitError}
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-[6px] bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">ĐÃ LÀM</span>
                <span className="font-extrabold text-blue-700 text-base">{totalAnswered}</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-slate-500 block text-[10px] font-bold">CHƯA LÀM</span>
                <span className="font-extrabold text-slate-800 text-base">
                  {questions.length - totalAnswered}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">ĐÁNH DẤU</span>
                <span className="font-extrabold text-amber-700 text-base">
                  {Object.values(flagged).filter(Boolean).length}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting || submitAttemptMutation.isPending}
                onClick={() => setSubmitModalOpen(false)}
                className="py-2 px-3 rounded-[6px] text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
              >
                Quay lại làm tiếp
              </button>
              <button
                type="button"
                disabled={isSubmitting || submitAttemptMutation.isPending}
                onClick={handleSubmitExam}
                className="py-2 px-3 rounded-[6px] text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-70"
              >
                {isSubmitting || submitAttemptMutation.isPending ? (
                  <span>Đang ghi nhận...</span>
                ) : (
                  <>
                    <span>Xác nhận nộp bài</span>
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
