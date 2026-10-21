"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  User,
  Timer,
  ChevronRight,
  FileCheck,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartFeatureCard } from "@/components/motion/ThiSmartFeatureCard";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

interface ExamSessionItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  startAt: string;
  endAt: string;
  instructor: string;
  status: "active_now" | "upcoming" | "completed";
  score?: number;
  maxScore?: number;
}

const MOCK_EXAMS: ExamSessionItem[] = [
  {
    id: "session-101",
    subjectCode: "IT4409",
    subjectName: "Lập trình Web Nâng Cao",
    title: "Kiểm tra Giữa kỳ - Học kỳ I 2026",
    durationMinutes: 60,
    totalQuestions: 40,
    startAt: "08:00 - 09:30, Hôm nay",
    endAt: "09:30",
    instructor: "TS. Trần Minh Khoa",
    status: "active_now",
  },
  {
    id: "session-102",
    subjectCode: "CS201",
    subjectName: "Cấu trúc Dữ liệu & Giải thuật",
    title: "Thi Kết thúc Học phần - Đợt 1",
    durationMinutes: 90,
    totalQuestions: 50,
    startAt: "14:00 - 15:45, Ngày 20/10/2026",
    endAt: "15:45",
    instructor: "PGS.TS. Nguyễn Văn Hùng",
    status: "upcoming",
  },
  {
    id: "session-103",
    subjectCode: "DB301",
    subjectName: "Cơ sở Dữ liệu Phân tán",
    title: "Kiểm tra Quá trình 2",
    durationMinutes: 45,
    totalQuestions: 30,
    startAt: "08:00 Ngày 15/10/2026",
    endAt: "08:45",
    instructor: "ThS. Lê Hoàng Long",
    status: "completed",
    score: 8.75,
    maxScore: 10.0,
  },
  {
    id: "session-104",
    subjectCode: "NET202",
    subjectName: "Mạng Máy Tính & An Ninh Hệ Thống",
    title: "Đánh giá Thực hành Giữa kỳ",
    durationMinutes: 60,
    totalQuestions: 40,
    startAt: "10:00 Ngày 10/10/2026",
    endAt: "11:00",
    instructor: "TS. Vũ Mạnh Thắng",
    status: "completed",
    score: 9.25,
    maxScore: 10.0,
  },
];

export default function StudentExamsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "upcoming" | "completed">("all");

  const activeExam = MOCK_EXAMS.find((e) => e.status === "active_now");

  const filteredExams = MOCK_EXAMS.filter((exam) => {
    if (activeTab === "active") return exam.status === "active_now";
    if (activeTab === "upcoming") return exam.status === "upcoming";
    if (activeTab === "completed") return exam.status === "completed";
    return true;
  });

  return (
    <div className="relative max-w-6xl mx-auto space-y-8">
      {/* Background Academic Network Pattern (Ambient Depth: 0.14 opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10 rounded-3xl"
      >
        <ThiSmartPattern
          variant="academic-network"
          opacity={0.14}
          showBackground={false}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ca thi của tôi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Danh sách ca thi chính thức bạn được phân công tham gia tại hệ thống ThiSmart.
        </p>
      </div>

      {/* Hero Banner: Current Active Exam */}
      {activeExam && (
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-blue-900/50">
          {/* Vector Dot Grid Pattern Overlay (Visible & Crisp: 0.22 opacity) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
          >
            <ThiSmartPattern
              variant="dot-grid"
              opacity={0.22}
              showBackground={false}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Ca thi đang mở • Vào thi ngay</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeExam.subjectName} ({activeExam.subjectCode})
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                {activeExam.title} • Thời lượng: <strong>{activeExam.durationMinutes} phút</strong> •{" "}
                {activeExam.totalQuestions} câu hỏi trắc nghiệm
              </p>
              <div className="text-xs text-slate-400 flex items-center gap-4">
                <span>Khung giờ: {activeExam.startAt}</span>
                <span>•</span>
                <span>Cán bộ coi thi: {activeExam.instructor}</span>
              </div>
            </div>

            <div className="shrink-0">
              <ThiSmartCtaButton
                href={`/student/exams/${activeExam.id}/instructions`}
                className="text-sm py-3 px-6 shadow-xl"
              >
                <span>Vào phòng thi ngay</span>
                <ArrowRight className="w-4 h-4" />
              </ThiSmartCtaButton>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Tất cả ca thi ({MOCK_EXAMS.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === "active"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Đang mở (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === "upcoming"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Sắp diễn ra (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === "completed"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Đã hoàn thành (2)
        </button>
      </div>

      {/* Exam List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredExams.map((exam) => (
          <ThiSmartFeatureCard
            key={exam.id}
            className="p-6 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {exam.subjectCode}
                </span>

                {exam.status === "active_now" && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Đang mở</span>
                  </span>
                )}
                {exam.status === "upcoming" && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Sắp thi
                  </span>
                )}
                {exam.status === "completed" && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Đã hoàn thành
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {exam.subjectName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{exam.title}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Thời lượng: {exam.durationMinutes} phút ({exam.totalQuestions} câu hỏi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Lịch thi: {exam.startAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Cán bộ: {exam.instructor}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              {exam.status === "completed" && exam.score !== undefined ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-slate-400">Điểm số:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {exam.score}
                  </span>
                  <span className="text-xs text-slate-400">/ {exam.maxScore}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Chưa bắt đầu</span>
              )}

              {exam.status === "active_now" ? (
                <Link
                  href={`/student/exams/${exam.id}/instructions`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  <span>Làm bài</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : exam.status === "completed" ? (
                <Link
                  href={`/student/results/${exam.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  <span>Xem kết quả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href={`/student/exams/${exam.id}/instructions`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 bg-slate-50 hover:bg-slate-100 transition"
                >
                  <span>Xem quy chế</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </ThiSmartFeatureCard>
        ))}
      </div>
    </div>
  );
}
