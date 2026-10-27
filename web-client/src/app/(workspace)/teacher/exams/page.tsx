"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Clock,
  Award,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";
import { useExams } from "@/features/exams/hooks";
import { useSubjects } from "@/features/academic/hooks";

export default function TeacherExamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const { data: subjectsData } = useSubjects();
  const subjects = subjectsData?.data || [];

  const { data: examsData, isLoading } = useExams({
    subject_id: subjectFilter !== "all" ? Number(subjectFilter) : undefined,
    search: searchTerm || undefined,
  });

  const exams = examsData?.data || [];

  const filteredExams = exams.filter((exam: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = exam.title.toLowerCase().includes(term);
    const codeMatch = exam.subject?.code?.toLowerCase().includes(term);
    return titleMatch || codeMatch;
  });

  return (
    <div className="relative max-w-7xl mx-auto space-y-6 pb-16">
      {/* Background Flowchart Topology Pattern */}
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

      {/* Header with Topology Watermark Card */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border border-slate-200 shadow-xs">
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

        <div className="relative z-10">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Soạn &amp; Thiết Kế Đề Thi Mẫu (Exam Blueprints)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Thiết kế cấu trúc đề thi, gán câu hỏi từ ngân hàng và thiết lập thuật toán xáo trộn ngẫu nhiên.
          </p>
        </div>

        <Link href="/teacher/ai-assistant" className="relative z-10">
          <ThiSmartCtaButton variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            Tạo đề thi bằng AI Copilot
          </ThiSmartCtaButton>
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề, mã môn học..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Tất cả môn học</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={String(sub.id)}>
              {sub.code} - {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Exam Templates Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">Đang tải danh sách đề thi...</span>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <div className="text-sm font-bold text-slate-700">Chưa có đề thi mẫu nào</div>
          <div className="text-xs text-slate-400 mt-1">
            Bấm &quot;Tạo đề thi bằng AI Copilot&quot; để tạo đề thi chuẩn cấu trúc từ ngân hàng câu hỏi.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam: any) => {
            const isReady = Number(exam.total_points) >= 10;

            return (
              <div
                key={exam.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {exam.subject?.code || `Môn #${exam.subject_id}`}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isReady
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isReady ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Sẵn sàng ({exam.total_points}đ)
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          Bản nháp ({exam.total_points}đ)
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                      {exam.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">
                      Mã đề: EXAM-{exam.id}
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-2 border-y border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.duration_minutes} phút</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.questions_count ?? 0} câu hỏi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sàn: {exam.pass_score}/10</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.shuffle_questions ? "Xáo trộn đề" : "Cố định"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    ID: #{exam.id}
                  </span>

                  <Link
                    href={`/teacher/sessions`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition"
                  >
                    <span>Lập lịch ca thi</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
