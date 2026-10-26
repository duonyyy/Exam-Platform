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
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[8px] bg-slate-900 text-white shadow-xs border border-slate-800">
        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/teacher/sessions"
            className="p-2 rounded-[6px] bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                BÀN GIÁM SÁT CA THI TRỰC TIẾP (LIVE MONITOR)
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Lập trình Web Nâng Cao — Ca Giữa kỳ Nhóm 01 (IT4409)
            </h1>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-slate-800 text-xs font-mono font-bold text-slate-200 border border-slate-700 tabular-nums">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Giờ máy chủ: {currentTime}</span>
          </div>

          <button
            type="button"
            onClick={handleSimulateAlert}
            className="px-3 py-1.5 rounded-[6px] bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Giả lập cảnh báo tab</span>
          </button>

          <button
            type="button"
            onClick={() => alert("Đã gửi tin nhắn nhắc nhở chung đến màn hình toàn thể thí sinh!")}
            className="px-3 py-1.5 rounded-[6px] bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nhắc nhở chung</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards (Section 4.3 specs: Tổng thí sinh, Đang làm bài, Đã nộp bài, Cần chú ý) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Tổng số thí sinh</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">45</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sĩ số danh sách ca thi</div>
        </div>

        <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-blue-600">Đang làm bài</div>
          <div className="text-2xl font-black text-blue-700 mt-1 tabular-nums">38</div>
          <div className="text-[11px] text-slate-400 mt-0.5">84.4% đang trực tuyến</div>
        </div>

        <div className="p-4 rounded-[8px] bg-white border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-emerald-700">Đã nộp bài</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 tabular-nums">05</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Đã niêm phong an toàn</div>
        </div>

        <div className="p-4 rounded-[8px] bg-amber-50/40 border border-amber-200/90 shadow-xs">
          <div className="text-xs font-semibold text-amber-900">Cần chú ý</div>
          <div className="text-2xl font-black text-amber-900 mt-1 tabular-nums">02</div>
          <div className="text-[11px] text-amber-800 font-medium mt-0.5">Chuyển tab hoặc mất mạng</div>
        </div>
      </div>

      {/* Main Split: Candidate Roster (8 cols) & Live Event Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Candidate Roster (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[8px] border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Danh Sách Thí Sinh ({filteredCandidates.length})
            </h2>

            {/* Candidate filter pills */}
            <div className="flex items-center gap-1 text-xs font-semibold p-1 bg-slate-100 rounded-[6px]">
              <button
                type="button"
                onClick={() => setCandidateFilter("all")}
                className={`px-2.5 py-1 rounded-[4px] transition ${
                  candidateFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setCandidateFilter("in_progress")}
                className={`px-2.5 py-1 rounded-[4px] transition ${
                  candidateFilter === "in_progress" ? "bg-blue-700 text-white shadow-xs" : "text-slate-600"
                }`}
              >
                Đang thi
              </button>
              <button
                type="button"
                onClick={() => setCandidateFilter("flagged")}
                className={`px-2.5 py-1 rounded-[4px] transition ${
                  candidateFilter === "flagged" ? "bg-rose-700 text-white shadow-xs" : "text-slate-600"
                }`}
              >
                Cần chú ý
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
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-[6px] border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-[6px] border border-slate-200/90">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80">
                <tr>
                  <th className="px-3.5 py-2.5">Mã SV</th>
                  <th className="px-3.5 py-2.5">Họ và tên</th>
                  <th className="px-3.5 py-2.5">Tiến độ làm bài</th>
                  <th className="px-3.5 py-2.5">Thời gian</th>
                  <th className="px-3.5 py-2.5">Trạng thái phòng thi</th>
                  <th className="px-3.5 py-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((c) => {
                  const percent = Math.round((c.answeredCount / c.totalQuestions) * 100);

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50 transition ${
                        c.isFlagged ? "bg-amber-50/30" : ""
                      }`}
                    >
                      <td className="px-3.5 py-3 font-mono font-bold text-slate-800">
                        {c.studentId}
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.isFlagged && (
                            <Flag className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 min-w-[130px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500 tabular-nums">
                            <span>{c.answeredCount}/{c.totalQuestions} câu</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-[2px] h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-[2px] transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-slate-600 tabular-nums">
                        {c.timeRemaining}
                      </td>
                      <td className="px-3.5 py-3">
                        {/* 3 clear status colors: Green = Normal, Yellow = Warning/Tab, Red = Offline */}
                        {c.status === "in_progress" && c.warningCount === 0 && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ✓ Bình thường
                          </span>
                        )}
                        {c.status === "in_progress" && c.warningCount > 0 && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                            Rời màn hình ({c.warningCount} lần)
                          </span>
                        )}
                        {c.status === "offline" && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1 w-max">
                            <WifiOff className="w-2.5 h-2.5 text-rose-600" />
                            Mất mạng &gt;1 phút
                          </span>
                        )}
                        {c.status === "submitted" && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Đã nộp bài
                          </span>
                        )}
                        {c.status === "not_started" && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-slate-100 text-slate-500">
                            Chưa vào
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => alert(`Đã gửi tin nhắn nhắc nhở trực tiếp tới thí sinh ${c.name} (${c.studentId})!`)}
                            className="px-2 py-1 rounded-[4px] text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
                            title="Gửi tin nhắn nhắc nhở thí sinh"
                          >
                            Nhắc nhở
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFlag(c.id)}
                            className={`p-1.5 rounded-[4px] text-xs font-semibold transition border ${
                              c.isFlagged
                                ? "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                                : "text-slate-400 border-slate-200 hover:text-amber-700 hover:bg-slate-50"
                            }`}
                            title={c.isFlagged ? "Gỡ cờ theo dõi" : "Gắn cờ theo dõi"}
                          >
                            <Flag className={`w-3.5 h-3.5 ${c.isFlagged ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Proctoring Sensor Event Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[8px] border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Nhật Ký Cảm Biến Trực Tiếp
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 font-bold">
                TỰ ĐỘNG
              </span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {events.map((ev) => {
                let badgeStyle = "bg-slate-50 border-slate-200/80 text-slate-800";
                if (ev.severity === "high") badgeStyle = "bg-rose-50/70 border-rose-200 text-rose-900";
                else if (ev.severity === "medium") badgeStyle = "bg-amber-50/70 border-amber-200 text-amber-900";
                else if (ev.severity === "info") badgeStyle = "bg-emerald-50/70 border-emerald-200 text-emerald-900";

                return (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-[6px] border ${badgeStyle} space-y-1 text-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500 tabular-nums">
                        {ev.timestamp}
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {ev.studentId}
                      </span>
                    </div>

                    <p className="font-medium leading-snug">
                      {ev.message}
                    </p>

                    <div className="text-[10px] text-slate-500">
                      Thí sinh: <strong>{ev.studentName}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href={`/teacher/sessions/${sessionId}/results`}
              className="w-full py-2 rounded-[6px] text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <span>Xem báo cáo kết thúc phòng thi</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
