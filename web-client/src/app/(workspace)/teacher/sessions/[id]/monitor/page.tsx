"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Radio,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  WifiOff,
  Maximize2,
  ShieldAlert,
  Send,
  Flag,
  Search,
  Bell,
  RefreshCw,
  Power,
  ArrowLeft,
  Eye,
  Filter,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

interface StudentProctorStatus {
  id: string;
  studentId: string;
  name: string;
  answeredCount: number;
  totalQuestions: number;
  status: "in_progress" | "submitted" | "offline" | "not_started";
  warningCount: number;
  timeRemaining: string;
  isFlagged: boolean;
}

interface ProctorEvent {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  type: "tab_hidden" | "fullscreen_exit" | "network_offline" | "submitted" | "flagged";
  severity: "low" | "medium" | "high" | "info";
  message: string;
}

const INITIAL_CANDIDATES: StudentProctorStatus[] = [
  {
    id: "c-1",
    studentId: "SV2026101",
    name: "Nguyễn Văn A",
    answeredCount: 32,
    totalQuestions: 40,
    status: "in_progress",
    warningCount: 1,
    timeRemaining: "18:24",
    isFlagged: false,
  },
  {
    id: "c-2",
    studentId: "SV2026102",
    name: "Trần Thị B",
    answeredCount: 28,
    totalQuestions: 40,
    status: "in_progress",
    warningCount: 0,
    timeRemaining: "18:24",
    isFlagged: false,
  },
  {
    id: "c-3",
    studentId: "SV2026103",
    name: "Lê Hoàng C",
    answeredCount: 12,
    totalQuestions: 40,
    status: "offline",
    warningCount: 2,
    timeRemaining: "18:24",
    isFlagged: true,
  },
  {
    id: "c-4",
    studentId: "SV2026104",
    name: "Phạm Minh D",
    answeredCount: 40,
    totalQuestions: 40,
    status: "submitted",
    warningCount: 0,
    timeRemaining: "--:--",
    isFlagged: false,
  },
  {
    id: "c-5",
    studentId: "SV2026105",
    name: "Đỗ Gia Hưng",
    answeredCount: 0,
    totalQuestions: 40,
    status: "not_started",
    warningCount: 0,
    timeRemaining: "60:00",
    isFlagged: false,
  },
  {
    id: "c-6",
    studentId: "SV2026106",
    name: "Hoàng Thị Mai",
    answeredCount: 35,
    totalQuestions: 40,
    status: "in_progress",
    warningCount: 1,
    timeRemaining: "18:24",
    isFlagged: false,
  },
];

const INITIAL_EVENTS: ProctorEvent[] = [
  {
    id: "ev-1",
    timestamp: "08:41:02",
    studentId: "SV2026103",
    studentName: "Lê Hoàng C",
    type: "tab_hidden",
    severity: "medium",
    message: "Rời khỏi tab thi (tab_hidden)",
  },
  {
    id: "ev-2",
    timestamp: "08:40:15",
    studentId: "SV2026104",
    studentName: "Phạm Minh D",
    type: "submitted",
    severity: "info",
    message: "Nộp bài thi thành công (40/40)",
  },
  {
    id: "ev-3",
    timestamp: "08:38:50",
    studentId: "SV2026101",
    studentName: "Nguyễn Văn A",
    type: "fullscreen_exit",
    severity: "medium",
    message: "Thoát chế độ Toàn màn hình (fullscreen_exit)",
  },
  {
    id: "ev-4",
    timestamp: "08:35:10",
    studentId: "SV2026103",
    studentName: "Lê Hoàng C",
    type: "network_offline",
    severity: "high",
    message: "Mất kết nối mạng tạm thời (offline)",
  },
];

export default function LiveProctoringConsolePage() {
  const params = useParams();
  const sessionId = params?.id as string || "session-101";

  const [candidates, setCandidates] = useState<StudentProctorStatus[]>(INITIAL_CANDIDATES);
  const [events, setEvents] = useState<ProctorEvent[]>(INITIAL_EVENTS);
  const [candidateFilter, setCandidateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState("08:42:15");

  // Simulated live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
          d.getSeconds()
        ).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFlag = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newFlag = !c.isFlagged;
          if (newFlag) {
            setEvents((ev) => [
              {
                id: `ev-${Date.now()}`,
                timestamp: currentTime,
                studentId: c.studentId,
                studentName: c.name,
                type: "flagged",
                severity: "high",
                message: `Giám thị gắn cờ đối soát nghi vấn cho thí sinh ${c.studentId}`,
              },
              ...ev,
            ]);
          }
          return { ...c, isFlagged: newFlag };
        }
        return c;
      })
    );
  };

  const handleSimulateAlert = () => {
    const randomEvent: ProctorEvent = {
      id: `ev-${Date.now()}`,
      timestamp: currentTime,
      studentId: "SV2026106",
      studentName: "Hoàng Thị Mai",
      type: "tab_hidden",
      severity: "medium",
      message: "Cảnh báo cảm biến: Chuyển cửa sổ (blur / alt+tab)",
    };

    setEvents([randomEvent, ...events]);
    setCandidates((prev) =>
      prev.map((c) =>
        c.studentId === "SV2026106"
          ? { ...c, warningCount: c.warningCount + 1 }
          : c
      )
    );
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      candidateFilter === "all"
        ? true
        : candidateFilter === "flagged"
        ? c.isFlagged
        : c.status === candidateFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative max-w-7xl mx-auto space-y-6 pb-16">
      {/* Background Circuit Board Pattern (Ambient Depth: 0.14 opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10 rounded-3xl"
      >
        <ThiSmartPattern
          variant="circuit-board"
          opacity={0.14}
          showBackground={false}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top Bar with Live Telemetry Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white shadow-lg border border-slate-800">
        {/* High-Tech Circuit Board Pattern overlay in Telemetry Command Center (0.25 opacity) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        >
          <ThiSmartPattern
            variant="circuit-board"
            opacity={0.25}
            showBackground={false}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/teacher/sessions"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-black tracking-wider text-rose-400 uppercase">
                TRUNG TÂM GIÁM SÁT TRỰC TIẾP (LIVE PROCTORING)
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              Lập trình Web Nâng Cao — Ca Giữa kỳ Nhóm 01 (IT4409)
            </h1>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono font-bold text-cyan-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Server Clock: {currentTime}</span>
          </div>

          <button
            type="button"
            onClick={handleSimulateAlert}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Mô phỏng Sensor Alert</span>
          </button>

          <button
            type="button"
            onClick={() => alert("Đã gửi thông báo nhắc nhở toàn thể phòng thi!")}
            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Phát loa thông báo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Được gán</div>
          <div className="text-2xl font-black text-slate-900 mt-1">45 thí sinh</div>
          <div className="text-[11px] text-slate-400 mt-0.5">100% sĩ số lớp</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-blue-600">Đang làm bài</div>
          <div className="text-2xl font-black text-blue-600 mt-1">38</div>
          <div className="text-[11px] text-slate-400 mt-0.5">84.4% đang kết nối</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-emerald-700">Đã nộp bài</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">05</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Đã chốt điểm</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Chưa vào phòng</div>
          <div className="text-2xl font-black text-slate-700 mt-1">02</div>
          <div className="text-[11px] text-amber-800 font-medium mt-0.5">Còn 5p hạn muộn</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-rose-200/80 shadow-xs bg-rose-50/20">
          <div className="text-xs font-semibold text-rose-700">Cảnh báo vi phạm</div>
          <div className="text-2xl font-black text-rose-700 mt-1">04</div>
          <div className="text-[11px] text-rose-600 font-bold mt-0.5">1 thí sinh bị cờ</div>
        </div>
      </div>

      {/* Main Split: Candidate Roster (70%) & Live Event Feed (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate Roster (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Danh Sách Thí Sinh Dự Thi ({filteredCandidates.length})
            </h2>

            {/* Candidate filter pills */}
            <div className="flex items-center gap-1 text-xs font-semibold p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setCandidateFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  candidateFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setCandidateFilter("in_progress")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  candidateFilter === "in_progress" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
                }`}
              >
                Đang thi
              </button>
              <button
                type="button"
                onClick={() => setCandidateFilter("flagged")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  candidateFilter === "flagged" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600"
                }`}
              >
                Gắn cờ (Flagged)
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm thí sinh theo mã hoặc họ tên..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5">Mã SV</th>
                  <th className="px-3.5 py-2.5">Họ và tên</th>
                  <th className="px-3.5 py-2.5">Tiến độ bài thi</th>
                  <th className="px-3.5 py-2.5">Thời gian</th>
                  <th className="px-3.5 py-2.5">Trạng thái</th>
                  <th className="px-3.5 py-2.5 text-right">Giám sát</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((c) => {
                  const percent = Math.round((c.answeredCount / c.totalQuestions) * 100);

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50 transition ${
                        c.isFlagged ? "bg-rose-50/30" : ""
                      }`}
                    >
                      <td className="px-3.5 py-3 font-mono font-bold text-slate-800">
                        {c.studentId}
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.isFlagged && (
                            <Flag className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 min-w-[140px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                            <span>{c.answeredCount}/{c.totalQuestions} câu</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-slate-600">
                        {c.timeRemaining}
                      </td>
                      <td className="px-3.5 py-3">
                        {c.status === "in_progress" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Đang thi
                          </span>
                        )}
                        {c.status === "offline" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-max">
                            <WifiOff className="w-2.5 h-2.5" />
                            Mất kết nối
                          </span>
                        )}
                        {c.status === "submitted" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ✓ Đã nộp
                          </span>
                        )}
                        {c.status === "not_started" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Chưa vào
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleFlag(c.id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                            c.isFlagged
                              ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                              : "text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          }`}
                          title={c.isFlagged ? "Gỡ cờ vi phạm" : "Gắn cờ kiểm tra"}
                        >
                          <Flag className={`w-3.5 h-3.5 ${c.isFlagged ? "fill-current" : ""}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Proctoring Sensor Event Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Dòng Sự Kiện Cảm Biến
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold animate-pulse">
                LIVE SSE
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {events.map((ev) => {
                let badgeStyle = "bg-slate-100 text-slate-700";
                if (ev.severity === "high") badgeStyle = "bg-rose-50 text-rose-800 border border-rose-200";
                else if (ev.severity === "medium") badgeStyle = "bg-amber-50 text-amber-800 border border-amber-200";
                else if (ev.severity === "info") badgeStyle = "bg-emerald-50 text-emerald-800 border border-emerald-200";

                return (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">
                        {ev.timestamp}
                      </span>
                      <span className="font-bold text-slate-700">
                        {ev.studentId}
                      </span>
                    </div>

                    <p className="font-medium text-slate-800 leading-snug">
                      {ev.message}
                    </p>

                    <div className="text-[10px] text-slate-400">
                      Thí sinh: {ev.studentName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href={`/teacher/sessions/${sessionId}/results`}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <span>Xem báo cáo kết thúc phòng thi</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
