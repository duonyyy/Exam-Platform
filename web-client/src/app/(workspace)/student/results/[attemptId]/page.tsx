"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Calendar,
  Award,
  BarChart3,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookOpen,
  Share2,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartFeatureCard } from "@/components/motion/ThiSmartFeatureCard";

interface ReviewQuestion {
  id: string;
  order: number;
  content: string;
  type: "single_choice" | "multiple_choice" | "true_false";
  points: number;
  userAnswer: string[];
  correctAnswer: string[];
  isCorrect: boolean;
  explanation: string;
  options: { key: string; text: string }[];
}

const MOCK_RESULT_DATA = {
  attemptId: "ATT-20261017-SV101-842",
  sessionTitle: "Kiểm tra Giữa kỳ - Lập trình Web Nâng Cao (IT4409)",
  studentName: "Nguyễn Văn A",
  studentId: "SV2026101",
  subjectCode: "IT4409",
  subjectName: "Lập trình Web Nâng Cao",
  score: 8.75,
  maxScore: 10.0,
  passScore: 5.0,
  isPassed: true,
  submittedAt: "08:52:14 - 17/10/2026",
  durationMinutes: 52,
  totalQuestions: 40,
  correctCount: 35,
  incorrectCount: 3,
  skippedCount: 2,
  showExplanation: true,
  questions: [
    {
      id: "q-1",
      order: 1,
      content: "Trong kiến trúc RESTful API, phương thức HTTP nào có tính chất Idempotent và thường được sử dụng để cập nhật toàn bộ tài nguyên?",
      type: "single_choice" as const,
      points: 0.25,
      userAnswer: ["B"],
      correctAnswer: ["B"],
      isCorrect: true,
      explanation: "Phương thức PUT có tính chất idempotent và theo chuẩn RFC 7231 được dùng để thay thế toàn bộ biểu diễn của tài nguyên mục tiêu.",
      options: [
        { key: "A", text: "POST" },
        { key: "B", text: "PUT" },
        { key: "C", text: "PATCH" },
        { key: "D", text: "OPTIONS" },
      ],
    },
    {
      id: "q-2",
      order: 2,
      content: "Giao thức truyền dữ liệu an toàn nào sử dụng cổng mặc định 443 và mã hóa dữ liệu truyền tải giữa trình duyệt và máy chủ?",
      type: "single_choice" as const,
      points: 0.25,
      userAnswer: ["A"],
      correctAnswer: ["B"],
      isCorrect: false,
      explanation: "HTTPS (Hypertext Transfer Protocol Secure) sử dụng TLS/SSL và hoạt động trên cổng tiêu chuẩn 443 để bảo vệ dữ liệu khỏi rò rỉ và can thiệp.",
      options: [
        { key: "A", text: "FTP (File Transfer Protocol)" },
        { key: "B", text: "HTTPS (Hypertext Transfer Protocol Secure)" },
        { key: "C", text: "SSH (Secure Shell)" },
        { key: "D", text: "Telnet" },
      ],
    },
    {
      id: "q-3",
      order: 3,
      content: "Những tiêu chuẩn an ninh nào thuộc top khuyến nghị hàng đầu trong OWASP API Security Top 10?",
      type: "multiple_choice" as const,
      points: 0.5,
      userAnswer: ["A", "C"],
      correctAnswer: ["A", "B", "C"],
      isCorrect: false,
      explanation: "BOLA (Broken Object Level Authorization), Broken Authentication, và Broken Object Property Level Authorization đều nằm trong top đầu bảng xếp hạng OWASP API Security 2023.",
      options: [
        { key: "A", text: "BOLA (Broken Object Level Authorization)" },
        { key: "B", text: "Broken Object Property Level Authorization" },
        { key: "C", text: "Broken Authentication" },
        { key: "D", text: "Buffer Overflow trong C/C++" },
      ],
    },
    {
      id: "q-4",
      order: 4,
      content: "Trong Laravel, Middleware `auth:sanctum` được dùng để xác thực token dạng Bearer Token cho các API stateless?",
      type: "true_false" as const,
      points: 0.25,
      userAnswer: ["A"],
      correctAnswer: ["A"],
      isCorrect: true,
      explanation: "Laravel Sanctum cung cấp hệ thống xác thực gọn nhẹ cho SPAs, ứng dụng di động và API tokens đơn giản.",
      options: [
        { key: "A", text: "Đúng" },
        { key: "B", text: "Sai" },
      ],
    },
    {
      id: "q-5",
      order: 5,
      content: "Mã trạng thái HTTP 204 No Content phản hồi hành động xử lý thành công nhưng không có body dữ liệu trả về?",
      type: "true_false" as const,
      points: 0.25,
      userAnswer: ["A"],
      correctAnswer: ["A"],
      isCorrect: true,
      explanation: "Mã 204 chỉ ra rằng máy chủ đã hoàn thành thành công yêu cầu và không có nội dung bổ sung để gửi trong phần thân phản hồi.",
      options: [
        { key: "A", text: "Đúng" },
        { key: "B", text: "Sai" },
      ],
    },
  ],
};

export default function StudentExamResultPage() {
  const params = useParams();
  const attemptId = params?.attemptId as string || MOCK_RESULT_DATA.attemptId;
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({
    "q-1": true,
    "q-2": true,
    "q-3": true,
  });

  const toggleExplanation = (id: string) => {
    setExpandedExplanations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = MOCK_RESULT_DATA.questions.filter((q) => {
    if (filter === "correct") return q.isCorrect;
    if (filter === "incorrect") return !q.isCorrect;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/exams"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách ca thi</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            In kết quả
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ĐÃ CÔNG BỐ KẾT QUẢ CHÍNH THỨC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {MOCK_RESULT_DATA.sessionTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Nộp lúc: {MOCK_RESULT_DATA.submittedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                Thời gian làm: {MOCK_RESULT_DATA.durationMinutes} phút
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                Mã bài thi: {attemptId}
              </span>
            </div>
          </div>

          {/* Big Score Box */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 min-w-[200px] justify-center md:justify-end">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-cyan-200 font-semibold mb-1">
                Điểm tổng kết
              </div>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                {MOCK_RESULT_DATA.score.toFixed(2)}
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                Thang điểm 10.0 • <span className="text-emerald-300 font-bold">ĐẠT (PASS)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">Số câu đúng</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {MOCK_RESULT_DATA.correctCount} / {MOCK_RESULT_DATA.totalQuestions}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tỷ lệ 87.5%</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">Số câu sai</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">
              {MOCK_RESULT_DATA.incorrectCount} câu
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Bị trừ 0.75 điểm</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">Chưa làm / Bỏ qua</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">
              {MOCK_RESULT_DATA.skippedCount} câu
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Không tính điểm</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">Xếp loại học lực</div>
            <div className="text-lg font-bold text-cyan-300 mt-0.5">Giỏi</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Top 15% ca thi</div>
          </div>
        </div>
      </div>

      {/* Question Details Header & Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Chi tiết câu hỏi & Đáp án đối soát
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ca thi cho phép xem giải thích chi tiết và đáp án tham chiếu từ giảng viên.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả ({MOCK_RESULT_DATA.questions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("correct")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === "correct" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Đúng ({MOCK_RESULT_DATA.questions.filter((q) => q.isCorrect).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("incorrect")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === "incorrect" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sai ({MOCK_RESULT_DATA.questions.filter((q) => !q.isCorrect).length})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 mt-5">
          {filteredQuestions.map((q) => {
            const isExpanded = !!expandedExplanations[q.id];
            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all p-5 ${
                  q.isCorrect
                    ? "border-emerald-200/80 bg-emerald-50/20"
                    : "border-rose-200/80 bg-rose-50/20"
                }`}
              >
                {/* Question Item Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                        q.isCorrect
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {q.order}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        q.isCorrect
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {q.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đúng (+{q.points}đ)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Chưa đúng (0đ)
                        </>
                      )}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {q.type === "single_choice"
                        ? "Trắc nghiệm 1 đáp án"
                        : q.type === "multiple_choice"
                        ? "Nhiều đáp án"
                        : "Đúng / Sai"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExplanation(q.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <span>Thu gọn</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Xem giải thích</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Question Prompt */}
                <div className="text-sm font-semibold text-slate-900 mt-3 leading-relaxed">
                  {q.content}
                </div>

                {/* Option Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5">
                  {q.options.map((opt) => {
                    const isUserChoice = q.userAnswer.includes(opt.key);
                    const isRealCorrect = q.correctAnswer.includes(opt.key);

                    let itemStyle = "border-slate-200 bg-white text-slate-700";
                    if (isRealCorrect && isUserChoice) {
                      itemStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/30";
                    } else if (isRealCorrect && !isUserChoice) {
                      itemStyle = "border-emerald-400 bg-emerald-50/50 text-emerald-800 border-dashed";
                    } else if (!isRealCorrect && isUserChoice) {
                      itemStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400/30";
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium ${itemStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{opt.key}.</span>
                          <span>{opt.text}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-[11px]">
                          {isUserChoice && (
                            <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Bạn chọn
                            </span>
                          )}
                          {isRealCorrect && (
                            <span className="text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                              Đáp án đúng
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isExpanded && (
                  <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-blue-900">Giải thích từ giảng viên:</div>
                      <div className="leading-relaxed text-blue-900/90">{q.explanation}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
