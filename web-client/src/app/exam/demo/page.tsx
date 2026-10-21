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
      "Độ phức tạp thời gian trong trường hợp xấu nhất (Worst-case time complexity) của thuật toán Tìm kiếm Nhị phân (Binary Search) trên mảng đã sắp xếp gồm n phần tử là gì?",
    options: [
      { key: "A", label: "O(log n) — Do không gian tìm kiếm được chia đôi sau mỗi phép so sánh." },
      { key: "B", label: "O(n) — Do phải duyệt tuần tự qua từng phần tử khi giá trị nằm ở cuối mảng." },
      { key: "C", label: "O(n log n) — Do phải thực hiện chia mảng đệ quy liên tục." },
      { key: "D", label: "O(1) — Luôn tìm thấy phần tử ngay trong bước kiểm tra đầu tiên." },
    ],
  },
  {
    id: 2,
    order: 2,
    points: 0.25,
    type: "single_choice",
    content:
      "Cấu trúc dữ liệu nào hoạt động theo nguyên lý LIFO (Last-In-First-Out — Vào sau, Ra trước) và thường được ứng dụng để quản lý ngăn xếp lệnh gọi hàm (Call Stack)?",
    options: [
      { key: "A", label: "Hàng đợi (Queue — Hoạt động theo nguyên lý FIFO)." },
      { key: "B", label: "Ngăn xếp (Stack — Thao tác push/pop tại đỉnh)." },
      { key: "C", label: "Danh sách liên kết đơn (Singly Linked List)." },
      { key: "D", label: "Cây nhị phân tìm kiếm (Binary Search Tree)." },
    ],
  },
  {
    id: 3,
    order: 3,
    points: 0.25,
    type: "single_choice",
    content:
      "Giao thức nào dưới đây hoạt động ở tầng Giao vận (Transport Layer), cung cấp cơ chế kết nối tin cậy và kiểm soát luồng dữ liệu thông qua cơ chế bắt tay 3 bước (3-way handshake)?",
    options: [
      { key: "A", label: "UDP (User Datagram Protocol — Không hướng kết nối)." },
      { key: "B", label: "TCP (Transmission Control Protocol — Hướng kết nối tin cậy)." },
      { key: "C", label: "IP (Internet Protocol — Định tuyến gói tin ở tầng Mạng)." },
      { key: "D", label: "HTTP (Hypertext Transfer Protocol — Giao thức tầng Ứng dụng)." },
    ],
  },
  {
    id: 4,
    order: 4,
    points: 0.25,
    type: "single_choice",
    content:
      "Trong logic toán học, mệnh đề phản đảo (contrapositive) của mệnh đề kéo theo P → Q có dạng nào dưới đây và luôn có cùng bảng chân trị (tương đương logic)?",
    options: [
      { key: "A", label: "¬Q → ¬P (Phủ định hệ quả suy ra phủ định tiền đề)." },
      { key: "B", label: "Q → P (Mệnh đề đảo, không tương đương logic)." },
      { key: "C", label: "¬P → ¬Q (Mệnh đề nghịch, không tương đương logic)." },
      { key: "D", label: "P ∧ ¬Q (Phủ định của mệnh đề kéo theo)." },
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
      {/* Sandbox Demo Banner */}
      <div className="bg-blue-600/15 border-b border-blue-500/30 text-blue-200 px-4 py-2 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            <strong>Môi trường trải nghiệm phòng thi (Interactive Sandbox)</strong> — Toàn bộ quy trình đếm giờ, lưu nháp đáp án và bảng điều hướng câu hỏi đều hoạt động thực tế.
          </span>
        </div>
      </div>

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
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 hidden sm:flex items-center justify-center text-white font-black text-xs font-sans shadow-sm">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">
                Môn: Nhập Môn Khoa Học Máy Tính &amp; Thuật Toán
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                Ca K21-CS-01
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Thí sinh: <span className="text-slate-200 font-medium">Nguyễn Văn A (SV202601)</span> • Mã đề: 104 • <span className="text-cyan-400 font-medium">ThiSmart Focus</span>
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
                <span className="text-emerald-300 font-medium">Đã đồng bộ đáp án</span>
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
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition"
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
