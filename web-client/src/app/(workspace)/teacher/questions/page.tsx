"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { QuestionImportModal } from "@/features/questions";
import { useQuestions } from "@/features/exams/hooks";
import { useSubjects } from "@/features/academic/hooks";

export default function QuestionsBankPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [previewQuestion, setPreviewQuestion] = useState<any | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Live queries
  const { data: subjectsData } = useSubjects();
  const subjects = subjectsData?.data || [];

  const { data: questionsData, isLoading } = useQuestions({
    search: searchTerm || undefined,
    difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    per_page: 50,
  });

  const rawQuestions = questionsData?.data || [];

  // Filter client side by subject and question_type if needed
  const filteredQuestions = rawQuestions.filter((q: any) => {
    const matchesSubject =
      selectedSubject === "all" ||
      String(q.topic?.subject?.id) === selectedSubject ||
      q.topic?.subject?.code === selectedSubject;
    const matchesType = selectedType === "all" || q.question_type === selectedType;
    return matchesSubject && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Ngân Hàng Câu Hỏi Khảo Thí
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản trị kho câu hỏi trắc nghiệm, tự luận, kiểm soát trạng thái sẵn sàng và lịch sử gắn đề thi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Nhập Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nội dung câu hỏi..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={String(sub.id)}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              <option value="all">Tất cả độ khó</option>
              <option value="easy">Dễ (Easy)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="hard">Khó (Hard)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-semibold">Đang truy vấn ngân hàng câu hỏi...</span>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <div className="text-sm font-bold text-slate-700">Không tìm thấy câu hỏi phù hợp</div>
            <div className="text-xs text-slate-400 mt-1">
              Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc môn học / độ khó.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Mã #</th>
                  <th className="py-3 px-4">Môn &amp; Chủ đề</th>
                  <th className="py-3 px-4">Nội dung câu hỏi</th>
                  <th className="py-3 px-4 text-center">Loại</th>
                  <th className="py-3 px-4 text-center">Độ khó</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredQuestions.map((q: any) => {
                  const subjectCode = q.topic?.subject?.code || "GEN";
                  const topicName = q.topic?.name || "Chung";

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                        #{q.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800">
                            {subjectCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px] mt-0.5">
                          {topicName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-medium text-slate-900 line-clamp-2 leading-relaxed">
                          {q.question_text}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          {q.question_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            q.difficulty === "easy"
                              ? "bg-emerald-50 text-emerald-700"
                              : q.difficulty === "medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.status === "ready"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {q.status === "ready" ? "Sẵn sàng" : "Đã khóa"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setPreviewQuestion(q)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Xem chi tiết đáp án"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết / Đáp Án Câu Hỏi */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">
                  Câu hỏi #{previewQuestion.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800">
                  {previewQuestion.topic?.subject?.code || "GEN"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nội dung câu hỏi:
              </div>
              <div className="text-sm font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {previewQuestion.question_text}
              </div>
            </div>

            {previewQuestion.options && previewQuestion.options.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Các phương án lựa chọn:
                </div>
                <div className="space-y-1.5">
                  {previewQuestion.options.map((opt: any) => {
                    const isCorrect =
                      previewQuestion.correct_answer === opt.id ||
                      (Array.isArray(previewQuestion.correct_answer) &&
                        previewQuestion.correct_answer.includes(opt.id));

                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                          isCorrect
                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isCorrect ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {opt.id.slice(-1).toUpperCase()}
                        </span>
                        <div className="flex-1 mt-0.5">{opt.content}</div>
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Đáp án đúng
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {previewQuestion.explanation && (
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs">
                <span className="font-bold text-blue-900">Giải thích: </span>
                <span className="text-blue-800">{previewQuestion.explanation}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      <QuestionImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
