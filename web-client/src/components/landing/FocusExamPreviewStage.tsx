"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Timer,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { AnswerGridPattern } from "@/components/patterns/AnswerGridPattern";

export function FocusExamPreviewStage() {
  const [selectedOption, setSelectedOption] = useState<string>("A");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [seconds, setSeconds] = useState(2699); // 44:59
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Live countdown
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

  const handleSelectOption = (key: string) => {
    setSelectedOption(key);
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
    }, 450);
  };

  return (
    <section id="product-preview" className="relative py-16 md:py-24 bg-white border-y border-slate-200 overflow-hidden">
      <AnswerGridPattern opacity={0.04} color="#2563EB" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Laptop className="w-3.5 h-3.5 text-blue-600" />
            <span>Trải Nghiệm Phòng Thi Focus Mode Trực Quan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Giao diện làm bài tập trung, bảo vệ trọn vẹn từng câu trả lời
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Thí sinh thao tác trực tiếp trên giao diện tĩnh lặng. Mỗi lượt chọn phương án được đồng bộ tức thì lên máy chủ qua cơ chế Idempotent Upsert.
          </p>
        </div>

        {/* Centerpiece Product Preview Stage */}
        <div className="relative">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-indigo-600/15 rounded-3xl blur-md opacity-70" />

          <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/8 overflow-hidden">
            {/* Focus Room Mockup Topbar */}
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                  T
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>Nhập môn Khoa học Máy tính &amp; Thuật toán</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-normal">
                      Đề thi Học kỳ 1 — Ca 01
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">Thí sinh: SV20260101 • Nguyễn Văn A</div>
                </div>
              </div>

              {/* Status & Clock */}
              <div className="flex items-center gap-3">
                {/* Autosave status indicator */}
                <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                  {saveStatus === "saving" ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                      <span className="text-blue-300">Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Đã lưu trên máy chủ</span>
                    </>
                  )}
                </div>

                {/* Tabular countdown timer */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950 border border-blue-800 text-blue-200 font-mono text-sm font-bold">
                  <Timer className="w-4 h-4 text-cyan-400" />
                  <span className="tabular-nums tracking-wider">{formatTime(seconds)}</span>
                </div>

                <Link
                  href="/exam/demo"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
                >
                  <span>Mở toàn màn hình</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Focus Room Mockup Body */}
            <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/60 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Question Content (8 cols) */}
              <div className="lg:col-span-8 bg-white p-5 sm:p-7 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      Câu {activeQuestion} / 40
                    </span>
                    <span className="text-xs text-slate-500">Trọng số: 0.25 điểm • Một đáp án đúng</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition border ${
                      isBookmarked
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500 text-amber-600" : ""}`} />
                    <span>{isBookmarked ? "Đã đánh dấu xem lại" : "Đánh dấu xem lại"}</span>
                  </button>
                </div>

                <div className="text-slate-900 font-medium text-base sm:text-lg leading-relaxed">
                  Độ phức tạp thời gian trong trường hợp xấu nhất (Worst-case time complexity) của thuật toán <strong className="text-blue-600 font-semibold">Tìm kiếm Nhị phân (Binary Search)</strong> trên một mảng đã sắp xếp gồm <em>n</em> phần tử là bao nhiêu?
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-1">
                  {[
                    {
                      key: "A",
                      text: "O(log n) — Do không gian tìm kiếm được chia đôi sau mỗi lần so sánh phần tử ở giữa.",
                    },
                    {
                      key: "B",
                      text: "O(n) — Do thuật toán phải duyệt tuần tự qua từng phần tử khi giá trị nằm ở cuối mảng.",
                    },
                    {
                      key: "C",
                      text: "O(n log n) — Do phải thực hiện thao tác chia mảng thành các mảng con đệ quy.",
                    },
                    {
                      key: "D",
                      text: "O(1) — Do luôn tìm thấy phần tử cần tìm ngay trong phép truy xuất đầu tiên.",
                    },
                  ].map((option) => {
                    const isSelected = selectedOption === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handleSelectOption(option.key)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition flex items-start gap-3.5 ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-600 text-slate-900 shadow-sm ring-1 ring-blue-600/30"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {option.key}
                        </span>
                        <span className="text-sm sm:text-base leading-snug">{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                  <span>💡 Bạn có thể click chọn thử đáp án bên trên để xem phản hồi tự động lưu trực tiếp.</span>
                  <Link
                    href="/exam/demo"
                    className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>Vào phòng thi hoàn chỉnh</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Question Navigator (4 cols) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Bảng điều hướng câu hỏi
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">Đã trả lời: 1 / 40</span>
                  </div>

                  {/* Grid of question buttons */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => {
                      const isCurrent = activeQuestion === num;
                      const isAnswered = num === 1 && selectedOption !== "";
                      const isMarked = num === 3 || (num === 1 && isBookmarked);

                      let style = "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100";
                      if (isCurrent) {
                        style = "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300";
                      } else if (isAnswered) {
                        style = "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold";
                      } else if (isMarked) {
                        style = "bg-amber-50 border-amber-200 text-amber-800 font-semibold";
                      }

                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setActiveQuestion(num)}
                          className={`h-9 rounded-lg border text-xs font-medium transition flex items-center justify-center ${style}`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span>Đang chọn ({activeQuestion})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Đã lưu (1)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Xem lại (1)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span>Chưa làm (38)</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/exam/demo"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trải nghiệm phòng thi đầy đủ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
