"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Timer,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface Question {
  id: number;
  order: number;
  points: number;
  content: string;
  type: "single_choice" | "multiple_choice";
  options: { key: string; label: string }[];
}

const DEMO_QUESTIONS: Question[] = [
  {
    id: 1,
    order: 1,
    points: 0.25,
    type: "single_choice",
    content:
      "Phương thức HTTP nào dưới đây bắt buộc phải có tính chất Idempotent theo chuẩn RFC 9110 và kiến trúc RESTful API?",
    options: [
      { key: "A", label: "POST — Luôn tạo mới tài nguyên và không idempotent." },
      { key: "B", label: "PUT — Thay thế toàn bộ tài nguyên, gửi nhiều lần cho cùng kết quả." },
      { key: "C", label: "PATCH — Luôn cập nhật cục bộ và không được phép idempotent." },
      { key: "D", label: "OPTIONS — Chỉ dùng cho Websocket handshake." },
    ],
  },
  {
    id: 2,
    order: 2,
    points: 0.25,
    type: "single_choice",
    content:
      "Tại sao hệ thống Exam Platform sử dụng khóa bi quan (Pessimistic Locking `lockForUpdate()`) trong Database Transaction khi nộp bài thi (`SubmitExamAttemptAction`)?",
    options: [
      { key: "A", label: "Để tăng tốc độ truy vấn SELECT của sinh viên khác." },
      { key: "B", label: "Để khóa dòng attempt, ngăn chặn tuyệt đối tình trạng race condition và double submit khi mạng lag." },
      { key: "C", label: "Vì PostgreSQL không hỗ trợ ACID nếu không có khóa bi quan." },
      { key: "D", label: "Để ngăn database tự động ghi log vào ổ cứng." },
    ],
  },
  {
    id: 3,
    order: 3,
    points: 0.25,
    type: "single_choice",
    content:
      "Chính sách bảo mật Zero-Leakage đối với đề thi trực tuyến trong `AGENTS.md` yêu cầu điều gì đối với API JSON trả về cho thí sinh đang làm bài?",
    options: [
      { key: "A", label: "Được phép trả về correct_answer nhưng mã hóa Base64." },
      { key: "B", label: "Loại bỏ hoàn toàn trường correct_answer và explanation thông qua QuestionStudentResource." },
      { key: "C", label: "Chỉ ẩn correct_answer đối với câu hỏi trắc nghiệm nhiều đáp án." },
      { key: "D", label: "Gửi kèm đáp án đúng trong cookie mã hóa AES-256." },
    ],
  },
  {
    id: 4,
    order: 4,
    points: 0.25,
    type: "single_choice",
    content:
      "Cơ chế nào được khuyến nghị trong Hiến pháp Kỹ thuật để bảo vệ sinh viên trước lỗ hổng IDOR (Insecure Direct Object References)?",
    options: [
      { key: "A", label: "Sử dụng Laravel Policy để kiểm tra quyền sở hữu ($user->id === $attempt->student_id)." },
      { key: "B", label: "Ẩn ID trên URL bằng cách dùng POST cho toàn bộ API." },
      { key: "C", label: "Kiểm tra role admin tại Controller là đủ." },
      { key: "D", label: "Mã hóa ID thành token MD5 ngẫu nhiên." },
    ],
  },
];

export default function FocusExamDemoPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved">("saved");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId: number, key: string) => {
    setSaveStatus("saving");
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
    setTimeout(() => {
      setSaveStatus("saved");
    }, 400);
  };

  const currentQ = DEMO_QUESTIONS[currentIdx];
  const totalQuestions = 40; // demo shows 40 palette slots
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Focus Mode Header (Distraction-Free) */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Thoát phòng thi về trang chủ"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">
                Môn: Lập Trình Web Nâng Cao
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Ca thi K21-WEB-01
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Thí sinh: <span className="text-slate-200 font-medium">Nguyễn Văn A (SV202601)</span> • Mã đề: 104
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Autosave badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
            {saveStatus === "saving" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-300">Đang lưu...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-300">🟢 Đã đồng bộ đáp án</span>
              </>
            )}
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 shadow-inner">
            <Timer className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="font-mono text-base sm:text-lg font-bold text-indigo-200">
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Focus Layout: 2 Columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question & Options (lg:col-span-8) */}
        <section className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 backdrop-blur-sm">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                  Câu hỏi {currentQ.order} / {totalQuestions}
                </span>
                <span className="text-xs text-slate-400">
                  Thang điểm: <strong className="text-slate-200">{currentQ.points} điểm</strong>
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Single Choice
              </span>
            </div>

            {/* Question Content */}
            <h2 className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed mb-8">
              {currentQ.content}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-4 ${
                      isSelected
                        ? "bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span className="text-sm sm:text-base leading-normal pt-0.5">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-800 mt-8">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <span className="text-xs text-slate-400">
              Trang {currentIdx + 1} trên {DEMO_QUESTIONS.length} (demo)
            </span>

            <button
              type="button"
              disabled={currentIdx === DEMO_QUESTIONS.length - 1}
              onClick={() => setCurrentIdx((i) => i + 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>Câu sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Right Column: Question Navigator Palette & Submit (lg:col-span-4) */}
        <section className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <span>Bảng Điều Hướng Câu Hỏi</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {answeredCount}/{totalQuestions} đã làm
              </span>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const qNum = i + 1;
                const isAnswered = answers[qNum] !== undefined;
                const isCurrent = i === currentIdx;
                const isLoaded = i < DEMO_QUESTIONS.length;

                return (
                  <button
                    key={qNum}
                    type="button"
                    disabled={!isLoaded}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition border ${
                      isCurrent
                        ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 font-bold"
                        : ""
                    } ${
                      isAnswered
                        ? "bg-blue-600 border-blue-500 text-white"
                        : isLoaded
                        ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-900 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    {qNum < 10 ? `0${qNum}` : qNum}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 mt-4 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600"></span> Đã chọn
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span> Chưa làm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded ring-2 ring-indigo-400 bg-slate-800"></span> Đang xem
              </span>
            </div>
          </div>

          {/* Submit Action Block */}
          <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm("Bạn có chắc chắn muốn nộp bài thi? Thao tác này không thể hoàn tác.")) {
                  setIsSubmitted(true);
                  alert("Bài thi đã được ghi nhận và gửi lên máy chủ an toàn!");
                }
              }}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>NỘP BÀI THI CHÍNH THỨC</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Hệ thống sử dụng Server-Authoritative Clock. Khi hết giờ, bài thi sẽ được tự động nộp.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
