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
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

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
    }, 350);
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const currentQ = DEMO_QUESTIONS[currentIdx];
  const totalQuestions = 40; // demo shows 40 palette slots
  const answeredCount = Object.keys(answers).length;

  // Keyboard shortcuts (A, B, C, D to answer; ArrowLeft / ArrowRight to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (submitModalOpen || isSubmitted) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key) && currentQ) {
        const opt = currentQ.options.find((o) => o.key.toUpperCase() === key);
        if (opt) {
          handleSelectOption(currentQ.id, opt.key);
        }
      } else if (e.key === "ArrowLeft") {
        setCurrentIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIdx((prev) => Math.min(DEMO_QUESTIONS.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQ, submitModalOpen, isSubmitted]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 select-none">
      {/* Sandbox Demo Info Bar */}
      <div className="bg-blue-50 border-b border-blue-200/80 text-blue-900 px-4 py-1.5 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            <strong>Môi trường trải nghiệm phòng thi (Interactive Sandbox)</strong> — Toàn bộ quy trình đếm giờ, lưu nháp đáp án và bảng điều hướng câu hỏi đều hoạt động thực tế.
          </span>
        </div>
      </div>

      {/* Focus Mode Header (Disciplined, Zero Distraction) */}
      <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-[6px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
              title="Thoát phòng thi về trang chủ"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-[6px] bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              TS
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Nhập Môn Khoa Học Máy Tính &amp; Thuật Toán
              </div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Thí sinh: <strong className="text-slate-800">Nguyễn Văn A</strong> • Mã SV: <strong className="text-slate-800">SV202601</strong> • Mã đề: <strong>104</strong>
              </div>
            </div>
          </div>

          {/* Center: Countdown Clock */}
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-[6px] border font-mono font-bold text-sm sm:text-base tabular-nums shadow-xs ${
                timeLeft < 300
                  ? "bg-amber-50 border-amber-300 text-amber-900 animate-pulse"
                  : "bg-slate-900 text-white border-slate-800"
              }`}
            >
              <Timer className={`w-4 h-4 ${timeLeft < 300 ? "text-amber-600" : "text-blue-400"}`} />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Right: Autosave Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-[6px] border border-emerald-200 bg-emerald-50 text-emerald-800">
              <span className={`w-2 h-2 rounded-full ${saveStatus === "saving" ? "bg-blue-600 animate-ping" : "bg-emerald-600"}`} />
              <span>{saveStatus === "saving" ? "Đang lưu..." : "✓ Đã tự động lưu"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Focus Layout: 2 Columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question & Options (lg:col-span-8) */}
        <section className="lg:col-span-8 bg-white rounded-[8px] border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between min-h-[520px]">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Câu hỏi {currentQ.order} / {totalQuestions}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-[4px] bg-blue-50 text-blue-700 border border-blue-200">
                  {currentQ.points} điểm
                </span>
                <span className="text-xs text-slate-400">
                  (Single Choice)
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(currentQ.id)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[6px] border transition ${
                  flagged[currentQ.id]
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "text-slate-600 border-slate-200/90 hover:bg-slate-50"
                }`}
              >
                <span>{flagged[currentQ.id] ? "Đã đánh dấu" : "Đánh dấu xem lại"}</span>
              </button>
            </div>

            {/* Question Content */}
            <h2 className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed mb-6">
              {currentQ.content}
            </h2>

            {/* Options List (Sharp mechanical keys [A], [B], [C], [D]) */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.key;
                return (
                  <div
                    key={opt.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-[6px] border transition cursor-pointer select-none text-left ${
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
                      {opt.key}
                    </span>
                    <span className="text-sm leading-relaxed flex-1 pt-0.5">
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hint for keyboard shortcuts */}
            <div className="mt-4 text-[11px] text-slate-600 flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded-[4px] bg-slate-100 border border-slate-200 font-mono text-[10px]">Phím tắt</span>
              <span>Bấm phím A, B, C, D trên bàn phím để chọn nhanh phương án • ← / → để chuyển câu.</span>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] text-xs font-semibold text-slate-700 border border-slate-200/90 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <span className="text-xs text-slate-600">
              Câu {currentIdx + 1} / {DEMO_QUESTIONS.length}
            </span>

            <button
              type="button"
              disabled={currentIdx === DEMO_QUESTIONS.length - 1}
              onClick={() => setCurrentIdx((i) => i + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
            >
              <span>Câu tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Right Column: Question Navigator Palette & Submit (lg:col-span-4) */}
        <section className="lg:col-span-4 bg-white rounded-[8px] border border-slate-200/90 p-5 shadow-xs space-y-4 sticky top-20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Danh sách câu hỏi
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Đã làm: <strong className="text-blue-700">{answeredCount}</strong>/{totalQuestions}
              </span>
            </div>

            {/* 32x32px Palette Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const qNum = i + 1;
                const isAnswered = answers[qNum] !== undefined;
                const isCurrent = i === currentIdx;
                const isLoaded = i < DEMO_QUESTIONS.length;
                const isFlagged = flagged[qNum];

                return (
                  <button
                    key={qNum}
                    type="button"
                    disabled={!isLoaded}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-8 h-8 rounded-[4px] text-xs font-bold transition flex items-center justify-center relative tabular-nums ${
                      isCurrent
                        ? "ring-2 ring-blue-600 ring-offset-1 bg-blue-700 text-white"
                        : isAnswered
                        ? "bg-blue-600 text-white border border-blue-600"
                        : isLoaded
                        ? "bg-white text-slate-700 border border-slate-200/90 hover:border-slate-400"
                        : "bg-slate-100 border border-slate-200 text-slate-600 opacity-50 cursor-not-allowed"
                    }`}
                    title={`Câu ${qNum}`}
                  >
                    <span>{qNum}</span>
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
          </div>

          {/* Submit Action Block */}
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
        </section>
      </main>

      {/* Confirmation Modal */}
      {submitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-[8px] max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-[6px] bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Xác nhận nộp bài thi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn đã hoàn thành <strong>{answeredCount}/{totalQuestions}</strong> câu. Còn <strong>{totalQuestions - answeredCount}</strong> câu chưa làm. Bạn có chắc chắn muốn nộp bài?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="py-2 px-3 rounded-[6px] text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
              >
                Quay lại làm tiếp
              </button>
              <Link
                href="/exam/demo-attempt/receipt"
                className="py-2 px-3 rounded-[6px] text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Xác nhận nộp bài</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
