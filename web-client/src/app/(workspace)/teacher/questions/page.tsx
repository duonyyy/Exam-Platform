"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Power,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { QuestionImportModal, QuestionItem } from "@/features/questions";


const MOCK_QUESTIONS: QuestionItem[] = [
  {
    id: "q-1042",
    orderNumber: 1042,
    subjectCode: "IT4409",
    subjectName: "Lập trình Web Nâng Cao",
    topicName: "Giao thức HTTP & REST Architecture",
    content: "Trong kiến trúc RESTful API, phương thức HTTP nào có tính chất Idempotent và thường được sử dụng để cập nhật toàn bộ tài nguyên?",
    type: "single_choice",
    difficulty: "easy",
    status: "ready",
    isUsedInExam: true,
    usedInExamCount: 2,
    options: [
      { key: "A", text: "POST" },
      { key: "B", text: "PUT" },
      { key: "C", text: "PATCH" },
      { key: "D", text: "DELETE" },
    ],
    correctAnswer: ["B"],
    explanation: "Phương thức PUT có tính chất idempotent và được định nghĩa bởi RFC 7231 để cập nhật toàn diện.",
  },
  {
    id: "q-1043",
    orderNumber: 1043,
    subjectCode: "IT4409",
    subjectName: "Lập trình Web Nâng Cao",
    topicName: "Xác thực Sanctum & Phân quyền RBAC",
    content: "Kể tên các lỗ hổng thuộc top 3 OWASP API Security Top 10 (2023)?",
    type: "multiple_choice",
    difficulty: "hard",
    status: "ready",
    isUsedInExam: false,
    usedInExamCount: 0,
    options: [
      { key: "A", text: "BOLA (Broken Object Level Authorization)" },
      { key: "B", text: "Broken Authentication" },
      { key: "C", text: "Broken Object Property Level Authorization" },
      { key: "D", text: "Buffer Overflow" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation: "Top 3 gồm BOLA, Broken Authentication và BOPLA.",
  },
  {
    id: "q-1044",
    orderNumber: 1044,
    subjectCode: "IT4409",
    subjectName: "Lập trình Web Nâng Cao",
    topicName: "Giao thức HTTP & REST Architecture",
    content: "Trong HTTP, mã trạng thái 204 No Content phản hồi hành động thành công nhưng không có dữ liệu trả về?",
    type: "true_false",
    difficulty: "easy",
    status: "ready",
    isUsedInExam: true,
    usedInExamCount: 1,
    options: [
      { key: "A", text: "Đúng" },
      { key: "B", text: "Sai" },
    ],
    correctAnswer: ["A"],
    explanation: "Chuẩn RFC quy định 204 không chứa message-body.",
  },
  {
    id: "q-1045",
    orderNumber: 1045,
    subjectCode: "CS201",
    subjectName: "Cấu trúc Dữ liệu & Giải thuật",
    topicName: "Độ phức tạp Big-O & Giải thuật sắp xếp",
    content: "Độ phức tạp thời gian trung bình của thuật toán QuickSort là O(n log n)?",
    type: "true_false",
    difficulty: "medium",
    status: "ready",
    isUsedInExam: true,
    usedInExamCount: 3,
    options: [
      { key: "A", text: "Đúng" },
      { key: "B", text: "Sai" },
    ],
    correctAnswer: ["A"],
    explanation: "Thời gian trung bình là O(n log n), xấu nhất là O(n^2) khi pivot không cân bằng.",
  },
  {
    id: "q-1046",
    orderNumber: 1046,
    subjectCode: "IT4409",
    subjectName: "Lập trình Web Nâng Cao",
    topicName: "Cơ sở dữ liệu quan hệ & Eloquent ORM",
    content: "Mô tả ngắn gọn cơ chế Eager Loading trong Eloquent ORM nhằm khắc phục vấn đề N+1 query.",
    type: "short_answer",
    difficulty: "medium",
    status: "disabled",
    isUsedInExam: false,
    usedInExamCount: 0,
    correctAnswer: ["with()", "Eager Loading"],
    explanation: "Sử dụng with() để truy vấn gom các khóa ngoại trong 1 câu lệnh IN(...).",
  },
];

export default function QuestionsBankPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>(MOCK_QUESTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const toggleQuestionStatus = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (q.isUsedInExam) {
            alert("BR-011: Câu hỏi này đang được sử dụng trong Đề thi, không thể vô hiệu hóa!");
            return q;
          }
          return {
            ...q,
            status: q.status === "ready" ? "disabled" : "ready",
          };
        }
        return q;
      })
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.orderNumber.toString().includes(searchTerm);
    const matchesSubject = selectedSubject === "all" || q.subjectCode === selectedSubject;
    const matchesType = selectedType === "all" || q.type === selectedType;
    const matchesDifficulty = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "all" || q.status === selectedStatus;

    return matchesSearch && matchesSubject && matchesType && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Ngân Hàng Câu Hỏi Khảo Thí
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản trị ngân hàng câu hỏi, phân cấp độ khó và kiểm duyệt trạng thái sẵn sàng (Ready).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-[8px] text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Nhập Excel Hàng Loạt
          </button>
          <Link href="/teacher/questions/new">
            <ThiSmartCtaButton variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              Soạn câu hỏi mới
            </ThiSmartCtaButton>
          </Link>
        </div>
      </div>

      {/* Multi-facet Filter Toolbar */}
      <div className="p-4 bg-white rounded-[8px] border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo nội dung, mã câu hỏi (#1042)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-[6px] border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-2 rounded-[6px] border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Tất cả Môn học</option>
              <option value="IT4409">IT4409 - Lập trình Web</option>
              <option value="CS201">CS201 - CTDL & GT</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-2 rounded-[6px] border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Tất cả Loại câu</option>
              <option value="single_choice">Trắc nghiệm 1 đáp án</option>
              <option value="multiple_choice">Nhiều đáp án</option>
              <option value="true_false">Đúng / Sai</option>
              <option value="short_answer">Điền khuyết / Tự luận ngắn</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-2 rounded-[6px] border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Mọi độ khó</option>
              <option value="easy">Dễ (Easy)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="hard">Khó (Hard)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-2 rounded-[6px] border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Tất cả Trạng thái</option>
              <option value="ready">Sẵn sàng (Ready)</option>
              <option value="disabled">Vô hiệu hóa (Disabled)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-500 px-1">
          Hiển thị {filteredQuestions.length} câu hỏi phù hợp
        </div>

        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className={`p-5 rounded-[8px] bg-white border border-slate-200/90 transition shadow-xs hover:border-slate-300 ${
              q.status === "disabled" ? "opacity-75 bg-slate-50/50" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-black bg-slate-900 text-white">
                    #{q.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {q.subjectCode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {q.topicName}
                  </span>

                  {/* Question Type Badge */}
                  <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {q.type === "single_choice"
                      ? "1 Đáp án"
                      : q.type === "multiple_choice"
                      ? "Nhiều đáp án"
                      : q.type === "true_false"
                      ? "Đúng/Sai"
                      : "Tự luận ngắn"}
                  </span>

                  {/* Difficulty Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[11px] font-semibold ${
                      q.difficulty === "easy"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : q.difficulty === "medium"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {q.difficulty === "easy" ? "Dễ" : q.difficulty === "medium" ? "Trung bình" : "Khó"}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${
                      q.status === "ready"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {q.status === "ready" ? "READY" : "DISABLED"}
                  </span>

                  {/* In exam notice */}
                  {q.isUsedInExam && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-[4px] border border-indigo-200">
                      <Lock className="w-3 h-3" />
                      Nằm trong {q.usedInExamCount} đề thi
                    </span>
                  )}
                </div>

                {/* Question Content */}
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {q.content}
                </h3>

                {/* Quick answer reference */}
                <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <span className="font-semibold text-emerald-700">Đáp án chuẩn:</span>
                  <span>{q.correctAnswer.join(", ")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-start">
                <button
                  type="button"
                  onClick={() => setPreviewQuestion(q)}
                  className="p-1.5 rounded-[6px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition border border-slate-200"
                  title="Xem trước câu hỏi"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <Link
                  href={`/teacher/questions/${q.id}/edit`}
                  className={`p-1.5 rounded-[6px] transition border ${
                    q.isUsedInExam
                      ? "text-slate-300 border-slate-100 pointer-events-none"
                      : "text-slate-500 border-slate-200 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  title={q.isUsedInExam ? "BR-011: Không thể sửa khi đã nằm trong đề" : "Sửa câu hỏi"}
                >
                  <Edit2 className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => toggleQuestionStatus(q.id)}
                  disabled={q.isUsedInExam}
                  className={`p-1.5 rounded-[6px] transition border ${
                    q.isUsedInExam
                      ? "text-slate-300 border-slate-100 cursor-not-allowed"
                      : q.status === "ready"
                      ? "text-slate-500 border-slate-200 hover:text-rose-600 hover:bg-rose-50"
                      : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  }`}
                  title={
                    q.isUsedInExam
                      ? "BR-011: Không thể tắt khi câu hỏi đã gắn vào đề"
                      : q.status === "ready"
                      ? "Vô hiệu hóa câu hỏi"
                      : "Kích hoạt câu hỏi"
                  }
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Question Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-[4px] text-xs font-black bg-blue-700 text-white">
                  #{previewQuestion.orderNumber}
                </span>
                <span className="text-xs font-bold text-slate-600">Xem trước hiển thị</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="text-sm font-bold text-slate-900 leading-relaxed">
                {previewQuestion.content}
              </div>

              {previewQuestion.options && (
                <div className="space-y-2">
                  {previewQuestion.options.map((opt) => {
                    const isCorrect = previewQuestion.correctAnswer.includes(opt.key);
                    return (
                      <div
                        key={opt.key}
                        className={`p-3 rounded-[6px] border text-xs font-medium flex items-center justify-between ${
                          isCorrect
                            ? "border-emerald-500 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-500/30"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{opt.key}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrect && (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-[4px]">
                            Đáp án đúng
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="p-3.5 rounded-[6px] bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <span className="font-bold">Giải thích đáp án: </span>
                {previewQuestion.explanation}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="px-4 py-2 rounded-[6px] text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Đóng xem trước
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Import Modal */}
      <QuestionImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={(count) => {
          // Can refresh or alert
        }}
      />
    </div>
  );
}
