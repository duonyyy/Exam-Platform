"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  Check,
  ExternalLink,
  BookOpen,
  Sliders,
  Save,
  RefreshCw,
  HelpCircle,
  CheckSquare,
  Square,
  ChevronRight,
  ListOrdered,
  FileQuestion,
} from "lucide-react";
import { useSubjects, useSubjectTopics } from "@/features/academic/hooks";
import { useCreateQuestion } from "@/features/exams/hooks";

interface GeneratedOption {
  id: string;
  content: string;
}

interface GeneratedQuestion {
  question_text: string;
  question_type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
  difficulty: "easy" | "medium" | "hard";
  options: GeneratedOption[];
  correct_answer: string | string[];
  explanation: string;
}

export function QuestionGeneratorStudio() {
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const subjects = useMemo(() => subjectsData?.data || [], [subjectsData?.data]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const { data: topicsData, isLoading: isLoadingTopics } = useSubjectTopics(selectedSubjectId);
  const topics = useMemo(() => topicsData?.data || [], [topicsData?.data]);

  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(undefined);
  const [customTopicName, setCustomTopicName] = useState<string>("");
  const [useCustomTopic, setUseCustomTopic] = useState<boolean>(false);

  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<"mixed" | "easy" | "medium" | "hard">("mixed");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "single_choice",
    "multiple_choice",
    "true_false",
    "short_answer",
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessCount, setSaveSuccessCount] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const createQuestionMutation = useCreateQuestion();

  // Auto-select first subject when loaded
  useEffect(() => {
    if (subjects.length > 0 && selectedSubjectId === undefined) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Auto-select first topic when loaded
  useEffect(() => {
    if (topics.length > 0) {
      setSelectedTopicId(topics[0].id);
      setCustomTopicName(topics[0].name);
    } else {
      setSelectedTopicId(undefined);
    }
  }, [topics]);

  const toggleType = (t: string) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((item) => item !== t));
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setSaveSuccessCount(null);
    setSaveError(null);

    const currentSubj = subjects.find((s) => s.id === selectedSubjectId);
    const currentTop = topics.find((t) => t.id === selectedTopicId);
    const effectiveTopic = useCustomTopic
      ? customTopicName || "Kiến thức chuyên ngành"
      : currentTop?.name || customTopicName || "Kiến thức tổng quát";

    try {
      const res = await fetch("/api/examops/api/v1/agent/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_name: currentSubj ? `${currentSubj.code} - ${currentSubj.name}` : "Học phần tổng quát",
          topic_name: effectiveTopic,
          count: questionCount,
          difficulty,
          question_types: selectedTypes,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || errJson.message || `Lỗi máy chủ (${res.status})`);
      }

      const data = await res.json();
      const items: GeneratedQuestion[] = data.questions || [];
      setGeneratedQuestions(items);
      setSelectedIndices(new Set(items.map((_, i) => i)));
    } catch (err: any) {
      setGenerationError(err.message || "Không thể kết nối đến Trợ lý AI. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelectQuestion = (idx: number) => {
    const next = new Set(selectedIndices);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setSelectedIndices(next);
  };

  const handleSelectAll = () => {
    if (selectedIndices.size === generatedQuestions.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(generatedQuestions.map((_, i) => i)));
    }
  };

  const handleSaveToBank = async () => {
    if (selectedIndices.size === 0) return;
    if (!selectedTopicId) {
      setSaveError("Vui lòng chọn một Chủ đề thuộc Môn học trước khi lưu vào Ngân hàng câu hỏi.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccessCount(null);

    let saved = 0;
    try {
      for (const idx of selectedIndices) {
        const q = generatedQuestions[idx];
        if (!q) continue;

        const payload: any = {
          topic_id: selectedTopicId,
          question_text: q.question_text,
          question_type: q.question_type,
          difficulty: q.difficulty,
          explanation: q.explanation || undefined,
        };

        if (q.question_type === "short_answer") {
          payload.correct_answer =
            typeof q.correct_answer === "string" ? q.correct_answer : String(q.correct_answer[0] || "");
        } else {
          payload.options = q.options;
          payload.correct_answer = q.correct_answer;
        }

        await createQuestionMutation.mutateAsync(payload);
        saved++;
      }
      setSaveSuccessCount(saved);
    } catch (err: any) {
      setSaveError(err.message || "Có lỗi xảy ra khi lưu một số câu hỏi vào cơ sở dữ liệu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── 1. CONFIGURATION STUDIO & AI CONTROLS ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Cấu Hình Yêu Cầu Câu Hỏi</h2>
              <p className="text-xs text-slate-500">Thiết lập tham số để AI sinh bộ câu hỏi chính xác</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Môn Học (Học phần)</label>
              {isLoadingSubjects ? (
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ) : (
                <select
                  value={selectedSubjectId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value ? Number(e.target.value) : undefined;
                    setSelectedSubjectId(id);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Topic Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Chủ Đề (Topic)</label>
                <button
                  type="button"
                  onClick={() => setUseCustomTopic(!useCustomTopic)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  {useCustomTopic ? "Chọn từ danh mục" : "Nhập chủ đề tự do"}
                </button>
              </div>

              {useCustomTopic ? (
                <input
                  type="text"
                  value={customTopicName}
                  onChange={(e) => setCustomTopicName(e.target.value)}
                  placeholder="Nhập tên chủ đề hoặc chuyên đề thi cử..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              ) : isLoadingTopics ? (
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ) : topics.length > 0 ? (
                <select
                  value={selectedTopicId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value ? Number(e.target.value) : undefined;
                    setSelectedTopicId(id);
                    const t = topics.find((item) => item.id === id);
                    if (t) setCustomTopicName(t.name);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                  Môn học này chưa có chủ đề. Hãy chọn tùy chọn &quot;Nhập chủ đề tự do&quot;.
                </div>
              )}
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Số lượng câu hỏi</label>
                <span className="text-xs font-extrabold text-blue-600 px-2 py-0.5 rounded-lg bg-blue-50">
                  {questionCount} câu
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 câu</span>
                <span>5 câu</span>
                <span>10 câu</span>
              </div>
            </div>

            {/* Difficulty Target */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Độ khó mục tiêu</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "mixed", label: "Hỗn hợp" },
                  { id: "easy", label: "Dễ" },
                  { id: "medium", label: "Trung bình" },
                  { id: "hard", label: "Khó" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition ${
                      difficulty === item.id
                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500/20"
                        : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Types */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Định dạng câu hỏi chấp nhận</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "single_choice", label: "Trắc nghiệm đơn (1 đáp án)" },
                  { id: "multiple_choice", label: "Nhiều lựa chọn (N đáp án)" },
                  { id: "true_false", label: "Đúng / Sai" },
                  { id: "short_answer", label: "Trả lời ngắn" },
                ].map((type) => {
                  const isChecked = selectedTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleType(type.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2 ${
                        isChecked
                          ? "bg-blue-50/60 border-blue-400 text-blue-900"
                          : "bg-slate-50/60 border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 text-white ${
                          isChecked ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </span>
                      <span className="text-[11px] font-semibold leading-tight">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-60 transition"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Đang Phân Tích &amp; Soạn Thảo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Sinh Bộ Câu Hỏi Bằng AI</span>
              </>
            )}
          </button>

          {generationError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{generationError}</span>
            </div>
          )}
        </div>

        {/* Right Preview: Generated Questions List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Kết Quả Soạn Thảo ({generatedQuestions.length} câu)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Xem trước, kiểm định đáp án và chọn câu hỏi để lưu vào Ngân Hàng
                  </p>
                </div>
              </div>

              {generatedQuestions.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                  >
                    {selectedIndices.size === generatedQuestions.length ? (
                      <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>
                      {selectedIndices.size === generatedQuestions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToBank}
                    disabled={isSaving || selectedIndices.size === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 disabled:opacity-50 transition"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu {selectedIndices.size} câu vào Ngân Hàng</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Notification when saved successfully */}
            {saveSuccessCount !== null && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    Đã lưu thành công {saveSuccessCount} câu hỏi vào Ngân hàng dữ liệu!
                  </span>
                </div>
                <Link
                  href="/teacher/questions"
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold underline shrink-0"
                >
                  <span>Xem Ngân Hàng Câu Hỏi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {saveError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Empty State */}
            {generatedQuestions.length === 0 && !isGenerating && (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <FileQuestion className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-700">Chưa có câu hỏi nào được sinh</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thiết lập môn học, số lượng và độ khó ở cột bên trái rồi bấm &quot;Sinh Bộ Câu Hỏi Bằng AI&quot; để bắt đầu.
                  </p>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {isGenerating && (
              <div className="space-y-4 py-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-slate-200 rounded w-1/4" />
                      <div className="h-4 bg-slate-200 rounded w-16" />
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="space-y-2 pt-2">
                      <div className="h-8 bg-white rounded-xl border border-slate-200/60" />
                      <div className="h-8 bg-white rounded-xl border border-slate-200/60" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Questions List */}
            {generatedQuestions.length > 0 && !isGenerating && (
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {generatedQuestions.map((q, idx) => {
                  const isSelected = selectedIndices.has(idx);
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-white border-blue-300 shadow-xs ring-1 ring-blue-500/10"
                          : "bg-slate-50/60 border-slate-200/80 opacity-75"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleSelectQuestion(idx)}
                          className="mt-1 text-slate-500 hover:text-blue-600 transition"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        <div className="flex-1 space-y-3">
                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Câu {idx + 1}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                q.difficulty === "easy"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : q.difficulty === "medium"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {q.difficulty === "easy" ? "Dễ" : q.difficulty === "medium" ? "Trung bình" : "Khó"}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {q.question_type === "single_choice"
                                ? "Trắc nghiệm đơn"
                                : q.question_type === "multiple_choice"
                                ? "Nhiều lựa chọn"
                                : q.question_type === "true_false"
                                ? "Đúng / Sai"
                                : "Trả lời ngắn"}
                            </span>
                          </div>

                          {/* Question text */}
                          <p className="text-xs font-bold text-slate-900 leading-relaxed">
                            {q.question_text}
                          </p>

                          {/* Options or Answer */}
                          {q.options && q.options.length > 0 ? (
                            <div className="space-y-1.5">
                              {q.options.map((opt) => {
                                const isCorrect = Array.isArray(q.correct_answer)
                                  ? q.correct_answer.includes(opt.id)
                                  : q.correct_answer === opt.id;
                                return (
                                  <div
                                    key={opt.id}
                                    className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                                      isCorrect
                                        ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                                        : "bg-slate-50 border-slate-200/80 text-slate-700"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                                          isCorrect
                                            ? "bg-emerald-600 text-white"
                                            : "bg-slate-200 text-slate-600"
                                        }`}
                                      >
                                        {opt.id.replace("opt_", "").toUpperCase()}
                                      </span>
                                      <span>{opt.content}</span>
                                    </div>
                                    {isCorrect && (
                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                        Đáp án đúng
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-300 text-xs text-emerald-950 space-y-1">
                              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                                Đáp án chính xác:
                              </span>
                              <div className="font-bold">{String(q.correct_answer)}</div>
                            </div>
                          )}

                          {/* Explanation */}
                          {q.explanation && (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                              <span className="font-bold text-slate-700">Giải thích: </span>
                              <span>{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
