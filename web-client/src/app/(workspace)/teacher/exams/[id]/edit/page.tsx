"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Shuffle,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Award,
  Lock,
} from "lucide-react";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

interface ExamQuestionItem {
  id: string;
  questionId: string;
  order: number;
  content: string;
  topicName: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
}

interface AvailableQuestion {
  id: string;
  orderNumber: number;
  topicName: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  defaultPoints: number;
}

const INITIAL_EXAM_QUESTIONS: ExamQuestionItem[] = [
  {
    id: "eq-1",
    questionId: "q-1042",
    order: 1,
    content: "Trong kiến trúc RESTful API, phương thức HTTP nào có tính chất Idempotent và thường được sử dụng để cập nhật toàn bộ tài nguyên?",
    topicName: "HTTP & REST Architecture",
    points: 0.25,
    difficulty: "easy",
  },
  {
    id: "eq-2",
    questionId: "q-1043",
    order: 2,
    content: "Kể tên các nguy cơ bảo mật hàng đầu trong OWASP API Security Top 10 (2023)?",
    topicName: "Xác thực Sanctum & Phân quyền RBAC",
    points: 0.5,
    difficulty: "hard",
  },
  {
    id: "eq-3",
    questionId: "q-1044",
    order: 3,
    content: "Trong HTTP, mã trạng thái 204 No Content phản hồi hành động thành công nhưng không có dữ liệu trả về?",
    topicName: "HTTP & REST Architecture",
    points: 0.25,
    difficulty: "easy",
  },
];

const AVAILABLE_BANK_QUESTIONS: AvailableQuestion[] = [
  {
    id: "q-1089",
    orderNumber: 1089,
    topicName: "Xác thực Sanctum & Phân quyền RBAC",
    content: "Cơ chế CSRF Token hoạt động như thế nào trong Laravel đối với các ứng dụng Web và API?",
    difficulty: "medium",
    defaultPoints: 0.5,
  },
  {
    id: "q-1102",
    orderNumber: 1102,
    topicName: "Cơ sở dữ liệu quan hệ & Eloquent ORM",
    content: "Sự khác biệt căn bản giữa quan hệ hasOne và belongsTo trong Eloquent Model?",
    difficulty: "easy",
    defaultPoints: 0.25,
  },
  {
    id: "q-1105",
    orderNumber: 1105,
    topicName: "Tối ưu hiệu năng & Caching Redis",
    content: "Giải thích kỹ thuật Cache Aside Pattern và cách xử lý Cache Invalidation.",
    difficulty: "hard",
    defaultPoints: 0.5,
  },
];

export default function ExamAssemblerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [title, setTitle] = useState("Đề thi Giữa kỳ - Lập trình Web Nâng Cao (Đề số 1)");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passScore, setPassScore] = useState(5.0);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  const [selectedQuestions, setSelectedQuestions] = useState<ExamQuestionItem[]>(INITIAL_EXAM_QUESTIONS);
  const [availableQuestions, setAvailableQuestions] = useState<AvailableQuestion[]>(AVAILABLE_BANK_QUESTIONS);
  const [searchBank, setSearchBank] = useState("");

  const totalPoints = selectedQuestions.reduce((sum, q) => sum + q.points, 0);
  const isPointsBalanced = Math.abs(totalPoints - 10.0) < 0.001;

  const handleMoveOrder = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === selectedQuestions.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...selectedQuestions];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // renumber orders
    const reordered = updated.map((q, i) => ({ ...q, order: i + 1 }));
    setSelectedQuestions(reordered);
  };

  const handlePointsChange = (index: number, points: number) => {
    const updated = [...selectedQuestions];
    updated[index].points = points;
    setSelectedQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    const removed = selectedQuestions[index];
    const updated = selectedQuestions.filter((_, i) => i !== index);
    const reordered = updated.map((q, i) => ({ ...q, order: i + 1 }));
    setSelectedQuestions(reordered);

    // Return to available bank
    setAvailableQuestions([
      ...availableQuestions,
      {
        id: removed.questionId,
        orderNumber: parseInt(removed.questionId.replace("q-", "")) || 9999,
        topicName: removed.topicName,
        content: removed.content,
        difficulty: removed.difficulty,
        defaultPoints: removed.points,
      },
    ]);
  };

  const handleAddQuestionToExam = (bankQuestion: AvailableQuestion) => {
    const newExamQuestion: ExamQuestionItem = {
      id: `eq-${Date.now()}`,
      questionId: bankQuestion.id,
      order: selectedQuestions.length + 1,
      content: bankQuestion.content,
      topicName: bankQuestion.topicName,
      points: bankQuestion.defaultPoints,
      difficulty: bankQuestion.difficulty,
    };

    setSelectedQuestions([...selectedQuestions, newExamQuestion]);
    setAvailableQuestions(availableQuestions.filter((q) => q.id !== bankQuestion.id));
  };

  const handleSave = () => {
    router.push("/teacher/exams");
  };

  return (
    <div className="relative max-w-7xl mx-auto space-y-6 pb-16">
      {/* Background Flowchart Topology Pattern (Exam matrix & data flow: 0.12 opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10 rounded-3xl"
      >
        <ThiSmartPattern
          variant="flowchart-topology"
          opacity={0.12}
          showBackground={false}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/exams"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Thiết Kế Đề Thi Mẫu (Assembler)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cân đối cơ cấu điểm số, xáo trộn câu hỏi và lắp ghép từ ngân hàng câu hỏi.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Lưu cấu hình đề thi</span>
        </button>
      </div>

      {/* Exam Blueprint Parameters Card */}
      <div className="relative overflow-hidden p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Topology Pattern Overlay in Parameters Card */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        >
          <ThiSmartPattern
            variant="flowchart-topology"
            opacity={0.16}
            showBackground={false}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiêu đề Đề thi Mẫu *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Môn học áp dụng
            </label>
            <input
              type="text"
              disabled
              value="IT4409 — Lập trình Web Nâng Cao"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Thời lượng (Phút)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Điểm sàn Đạt (Pass)
            </label>
            <input
              type="number"
              step="0.5"
              value={passScore}
              onChange={(e) => setPassScore(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="shuffleQ"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="shuffleQ" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Xáo trộn câu hỏi
            </label>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="shuffleOpt"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="shuffleOpt" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Xáo trộn phương án
            </label>
          </div>
        </div>

        {/* Live Total Points Tracker */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
            isPointsBalanced
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {isPointsBalanced ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>
              Tổng số câu hỏi: <strong className="font-bold">{selectedQuestions.length} câu</strong> • Tổng điểm lũy kế:{" "}
              <strong className="font-bold">{totalPoints.toFixed(2)} / 10.0 điểm</strong>
            </span>
          </div>

          <div>
            {isPointsBalanced ? (
              <span className="font-bold text-emerald-700">✓ Thang điểm chuẩn 10.0</span>
            ) : (
              <span className="font-bold text-amber-800">
                {totalPoints < 10.0
                  ? `Thiếu ${(10.0 - totalPoints).toFixed(2)}đ`
                  : `Vượt quá ${(totalPoints - 10.0).toFixed(2)}đ`}
              </span>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Assembler Two Columns: Selected Questions (Left 7) & Question Bank Picker (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selected in Exam (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Danh sách câu hỏi trong đề ({selectedQuestions.length})
            </h2>
            <span className="text-xs text-slate-400">Kéo / bấm mũi tên để đổi thứ tự</span>
          </div>

          <div className="space-y-2.5">
            {selectedQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, "up")}
                      disabled={idx === 0}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {q.order}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, "down")}
                      disabled={idx === selectedQuestions.length - 1}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {q.questionId}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">
                        {q.topicName}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {q.content}
                    </p>
                  </div>
                </div>

                {/* Points input & remove */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 font-medium">Điểm:</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="10"
                      value={q.points}
                      onChange={(e) => handlePointsChange(idx, Number(e.target.value))}
                      className="w-16 px-2 py-1 text-xs rounded-lg border border-slate-200 text-center font-bold text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Xóa khỏi đề thi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Picker (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Ngân hàng câu hỏi sẵn sàng
            </h2>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchBank}
                onChange={(e) => setSearchBank(e.target.value)}
                placeholder="Tìm câu hỏi theo nội dung, mã..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {availableQuestions.map((bq) => (
                <div
                  key={bq.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      #{bq.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {bq.topicName}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-800 leading-snug">
                    {bq.content}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-slate-500">
                      Mặc định: {bq.defaultPoints}đ
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddQuestionToExam(bq)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition"
                    >
                      <Plus className="w-3 h-3" />
                      Gán vào đề
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
