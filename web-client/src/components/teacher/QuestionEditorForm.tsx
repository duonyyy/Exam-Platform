"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";

interface OptionInput {
  key: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionEditorProps {
  initialData?: {
    id?: string;
    subject: string;
    topic: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    difficulty: "easy" | "medium" | "hard";
    content: string;
    options: OptionInput[];
    explanation: string;
  };
  isEditMode?: boolean;
}

export function QuestionEditorForm({ initialData, isEditMode = false }: QuestionEditorProps) {
  const router = useRouter();

  const [subject, setSubject] = useState(initialData?.subject || "IT4409");
  const [topic, setTopic] = useState(initialData?.topic || "top-1");
  const [questionType, setQuestionType] = useState<
    "single_choice" | "multiple_choice" | "true_false" | "short_answer"
  >(initialData?.type || "single_choice");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    initialData?.difficulty || "easy"
  );
  const [content, setContent] = useState(
    initialData?.content ||
      "Trong giao thức HTTP/1.1, phương thức nào sau đây mang tính an toàn (Safe Method) và không làm thay đổi tài nguyên trên máy chủ?"
  );
  const [explanation, setExplanation] = useState(
    initialData?.explanation ||
      "Phương thức GET chỉ đọc dữ liệu và không làm thay đổi trạng thái server (RFC 7231)."
  );

  const [options, setOptions] = useState<OptionInput[]>(
    initialData?.options || [
      { key: "A", text: "POST", isCorrect: false },
      { key: "B", text: "GET", isCorrect: true },
      { key: "C", text: "PUT", isCorrect: false },
      { key: "D", text: "DELETE", isCorrect: false },
    ]
  );

  const handleOptionChange = (idx: number, text: string) => {
    const updated = [...options];
    updated[idx].text = text;
    setOptions(updated);
  };

  const handleCorrectToggle = (idx: number) => {
    if (questionType === "single_choice" || questionType === "true_false") {
      setOptions(
        options.map((opt, i) => ({
          ...opt,
          isCorrect: i === idx,
        }))
      );
    } else if (questionType === "multiple_choice") {
      const updated = [...options];
      updated[idx].isCorrect = !updated[idx].isCorrect;
      setOptions(updated);
    }
  };

  const addOption = () => {
    const nextKey = String.fromCharCode(65 + options.length);
    setOptions([...options, { key: nextKey, text: "", isCorrect: false }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== idx);
    // Re-key A, B, C...
    const rekeyed = updated.map((opt, i) => ({
      ...opt,
      key: String.fromCharCode(65 + i),
    }));
    setOptions(rekeyed);
  };

  const handleTypeChange = (newType: typeof questionType) => {
    setQuestionType(newType);
    if (newType === "true_false") {
      setOptions([
        { key: "A", text: "Đúng (True)", isCorrect: true },
        { key: "B", text: "Sai (False)", isCorrect: false },
      ]);
    } else if (newType === "short_answer") {
      setOptions([]);
    } else if (options.length < 2) {
      setOptions([
        { key: "A", text: "", isCorrect: true },
        { key: "B", text: "", isCorrect: false },
      ]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save success
    router.push("/teacher/questions");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/questions"
            className="p-2 rounded-[6px] border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isEditMode ? "Biên Tập Câu Hỏi #1042" : "Soạn Thảo Câu Hỏi Mới"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập nội dung, loại câu hỏi và phương án đối soát trong ngân hàng đề.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>{isEditMode ? "Cập nhật thay đổi" : "Lưu vào ngân hàng"}</span>
        </button>
      </div>

      {/* Two Column Layout: Editor (Left) & Realtime Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[8px] border border-slate-200/90 p-6 shadow-xs space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Cấu hình câu hỏi
          </h2>

          {/* Subject & Topic Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[6px] border border-slate-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="IT4409">IT4409 - Lập trình Web Nâng Cao</option>
                <option value="CS201">CS201 - Cấu trúc Dữ liệu & Giải thuật</option>
                <option value="DB301">DB301 - Cơ sở Dữ liệu Phân tán</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề kiến thức</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[6px] border border-slate-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="top-1">HTTP & REST Architecture</option>
                <option value="top-2">Cơ sở dữ liệu quan hệ & ORM</option>
                <option value="top-3">Xác thực Sanctum & RBAC</option>
                <option value="top-4">Tối ưu hiệu năng & Redis</option>
              </select>
            </div>
          </div>

          {/* Type & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Loại câu hỏi</label>
              <select
                value={questionType}
                onChange={(e) => handleTypeChange(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-[6px] border border-slate-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="single_choice">Trắc nghiệm 1 đáp án (Single choice)</option>
                <option value="multiple_choice">Nhiều đáp án (Multiple choice)</option>
                <option value="true_false">Đúng / Sai (True/False)</option>
                <option value="short_answer">Điền từ / Tự luận ngắn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Độ khó (3 mức chuẩn)</label>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "medium", "hard"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-1.5 rounded-[6px] text-xs font-bold border transition capitalize ${
                      difficulty === lvl
                        ? lvl === "easy"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : lvl === "medium"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-rose-50 text-rose-800 border-rose-300"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {lvl === "easy" ? "Dễ" : lvl === "medium" ? "Trung bình" : "Khó"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Nội dung câu hỏi *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung đề bài câu hỏi..."
              className="w-full px-3 py-2 text-xs rounded-[6px] border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 leading-relaxed font-sans"
            />
          </div>

          {/* Options Management (if not short_answer) */}
          {questionType !== "short_answer" && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Danh sách Phương án & Chọn Đáp án đúng *
                </label>
                {questionType !== "true_false" && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm phương án
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div
                    key={opt.key}
                    className="flex items-center gap-2 p-2 rounded-[6px] border border-slate-200/90 bg-slate-50/50"
                  >
                    <button
                      type="button"
                      onClick={() => handleCorrectToggle(idx)}
                      className={`w-7 h-7 rounded-[4px] text-xs font-bold flex items-center justify-center shrink-0 transition ${
                        opt.isCorrect
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
                      }`}
                      title={opt.isCorrect ? "Đáp án đúng" : "Đánh dấu là đáp án đúng"}
                    >
                      {opt.key}
                    </button>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Nội dung phương án ${opt.key}...`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-[4px] border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />

                    {questionType !== "true_false" && options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="p-1.5 rounded-[4px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Giải thích chi tiết (Explanation)
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Giải thích lý do tại sao đáp án trên là chính xác (Thí sinh chỉ thấy sau khi có kết quả)..."
              className="w-full px-3 py-2 text-xs rounded-[6px] border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 leading-relaxed"
            />
          </div>
        </div>

        {/* Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-white rounded-[8px] border border-slate-200/90 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                Mô phỏng phòng thi (Live Preview)
              </h2>
              <span className="text-[10px] font-semibold text-slate-400">
                Giao diện thí sinh
              </span>
            </div>

            {/* Simulated Question Card identical to Student Focus Room */}
            <div className="p-4 rounded-[6px] bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-700 text-white">
                  CÂU HỎI
                </span>
                <span
                  className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                    difficulty === "easy"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : difficulty === "medium"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {difficulty === "easy" ? "DỄ" : difficulty === "medium" ? "TRUNG BÌNH" : "KHÓ"}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                {content || "Chưa nhập nội dung câu hỏi..."}
              </div>

              {/* Options */}
              {questionType !== "short_answer" ? (
                <div className="space-y-2 pt-1">
                  {options.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-2.5 rounded-[6px] border text-xs font-medium flex items-center justify-between ${
                        opt.isCorrect
                          ? "border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500/30"
                          : "border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-[4px] text-xs font-bold flex items-center justify-center shrink-0 border ${
                          opt.isCorrect
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {opt.key}
                        </span>
                        <span>{opt.text || `[Phương án ${opt.key}]`}</span>
                      </div>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-[4px]">
                          ĐÁP ÁN ĐÚNG
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-[6px] border border-dashed border-slate-300 bg-white text-xs text-slate-400 italic">
                  Thí sinh sẽ nhập đoạn văn bản đối soát trực tiếp.
                </div>
              )}

              {/* Explanation preview */}
              {explanation && (
                <div className="mt-3 p-2.5 rounded-[6px] bg-blue-50 border border-blue-200 text-xs text-blue-950">
                  <span className="font-bold">💡 Giải thích: </span>
                  {explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
