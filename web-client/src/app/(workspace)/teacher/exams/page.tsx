"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  Award,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Edit2,
  Trash2,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

interface ExamTemplateItem {
  id: string;
  code: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  passScore: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  status: "ready" | "draft";
  updatedAt: string;
}

const MOCK_EXAM_TEMPLATES: ExamTemplateItem[] = [
  {
    id: "exam-101",
    code: "EXAM-IT4409-GK",
    title: "Đề thi Giữa kỳ - Lập trình Web Nâng Cao (Đề số 1)",
    subjectCode: "IT4409",
    subjectName: "Lập trình Web Nâng Cao",
    durationMinutes: 60,
    totalQuestions: 40,
    totalPoints: 10.0,
    passScore: 5.0,
    shuffleQuestions: true,
    shuffleOptions: true,
    status: "ready",
    updatedAt: "16/10/2026",
  },
  {
    id: "exam-102",
    code: "EXAM-CS201-CK",
    title: "Đề thi Kết thúc Học phần - Cấu trúc Dữ liệu & Giải thuật",
    subjectCode: "CS201",
    subjectName: "Cấu trúc Dữ liệu & Giải thuật",
    durationMinutes: 90,
    totalQuestions: 50,
    totalPoints: 10.0,
    passScore: 4.0,
    shuffleQuestions: true,
    shuffleOptions: false,
    status: "ready",
    updatedAt: "12/10/2026",
  },
  {
    id: "exam-103",
    code: "EXAM-DB301-QT2",
    title: "Đề thi Kiểm tra Quá trình 2 - CSDL Phân tán",
    subjectCode: "DB301",
    subjectName: "Cơ sở Dữ liệu Phân tán",
    durationMinutes: 45,
    totalQuestions: 25,
    totalPoints: 8.5, // Draft, incomplete
    passScore: 5.0,
    shuffleQuestions: false,
    shuffleOptions: false,
    status: "draft",
    updatedAt: "Hôm qua",
  },
];

export default function TeacherExamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filteredExams = MOCK_EXAM_TEMPLATES.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "all" || exam.subjectCode === subjectFilter;
    return matchesSearch && matchesSubject;
  });

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

      {/* Header with Topology Watermark Card */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border border-slate-200 shadow-xs">
        {/* Topology Pattern Overlay in Header */}
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
            Soạn & Thiết Kế Đề Thi Mẫu (Exam Blueprints)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Thiết kế cấu trúc đề thi, gán câu hỏi từ ngân hàng và thiết lập thuật toán xáo trộn ngẫu nhiên.
          </p>
        </div>

        <Link href="/teacher/exams/exam-new/edit" className="relative z-10">
          <ThiSmartCtaButton variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            Tạo đề thi mẫu mới
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
            placeholder="Tìm theo tiêu đề, mã đề thi..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Tất cả môn học</option>
          <option value="IT4409">IT4409 - Lập trình Web</option>
          <option value="CS201">CS201 - CTDL & GT</option>
          <option value="DB301">DB301 - CSDL Phân tán</option>
        </select>
      </div>

      {/* Exam Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {exam.subjectCode}
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    exam.status === "ready"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {exam.status === "ready" ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Sẵn sàng (10.0đ)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Bản nháp ({exam.totalPoints}đ)
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                  {exam.title}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  {exam.code}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-2 border-y border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.durationMinutes} phút</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.totalQuestions} câu hỏi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sàn: {exam.passScore}/10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.shuffleQuestions ? "Xáo trộn đề" : "Cố định"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Cập nhật: {exam.updatedAt}
              </span>

              <Link
                href={`/teacher/exams/${exam.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition"
              >
                <span>Chỉnh sửa cấu trúc</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
