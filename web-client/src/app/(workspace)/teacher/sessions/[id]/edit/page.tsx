"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Send,
  Plus,
  Trash2,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface AssignedStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  status: "assigned";
}

const INITIAL_STUDENTS: AssignedStudent[] = [
  { id: "as-1", studentId: "SV2026101", name: "Nguyễn Văn A", email: "vana@student.edu.vn", status: "assigned" },
  { id: "as-2", studentId: "SV2026102", name: "Trần Thị B", email: "thib@student.edu.vn", status: "assigned" },
  { id: "as-3", studentId: "SV2026103", name: "Lê Hoàng C", email: "hoangc@student.edu.vn", status: "assigned" },
  { id: "as-4", studentId: "SV2026104", name: "Phạm Minh D", email: "minhd@student.edu.vn", status: "assigned" },
  { id: "as-5", studentId: "SV2026105", name: "Đỗ Gia Hưng", email: "giahung@student.edu.vn", status: "assigned" },
];

export default function SessionSchedulerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [title, setTitle] = useState("Kiểm tra Giữa kỳ - Nhóm 01 - Học kỳ I 2026");
  const [examId, setExamId] = useState("exam-101");
  const [startAt, setStartAt] = useState("2026-10-25T08:00");
  const [endAt, setEndAt] = useState("2026-10-25T09:30");
  const [allowLateMinutes, setAllowLateMinutes] = useState(15);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [sessionStatus, setSessionStatus] = useState<"draft" | "published">("draft");

  const [students, setStudents] = useState<AssignedStudent[]>(INITIAL_STUDENTS);
  const [studentSearch, setStudentSearch] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newSvId, setNewSvId] = useState("");
  const [newSvName, setNewSvName] = useState("");
  const [newSvEmail, setNewSvEmail] = useState("");

  const [publishAlert, setPublishAlert] = useState<string | null>(null);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvId || !newSvName) return;

    setStudents([
      ...students,
      {
        id: `as-${Date.now()}`,
        studentId: newSvId.toUpperCase(),
        name: newSvName,
        email: newSvEmail || `${newSvId.toLowerCase()}@student.edu.vn`,
        status: "assigned",
      },
    ]);

    setNewSvId("");
    setNewSvName("");
    setNewSvEmail("");
    setShowAddStudentModal(false);
  };

  const handleRemoveStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handlePublishSession = () => {
    // FSM rule UC-SESSION-PUBLISH: exam.questions_count > 0 and assigned_students > 0
    if (students.length === 0) {
      setPublishAlert("Không thể xuất bản ca thi: Chưa có thí sinh nào được gán vào ca thi!");
      return;
    }

    setSessionStatus("published");
    setPublishAlert(null);
    alert("Ca thi đã được xuất bản (Published) thành công! Thí sinh được gán đã có thể thấy trong lịch thi.");
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/sessions"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Lập Lịch Ca Thi & Phân Bổ Thí Sinh
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  sessionStatus === "published"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {sessionStatus === "published" ? "PUBLISHED" : "DRAFT"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cấu hình khung giờ tổ chức, đề thi áp dụng và phân công thí sinh dự thi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePublishSession}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Xuất bản ca thi (Publish)</span>
          </button>
        </div>
      </div>

      {publishAlert && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{publishAlert}</span>
          </div>
          <button onClick={() => setPublishAlert(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Thông tin thời gian & Đề thi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên ca thi hiển thị *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Đề thi mẫu liên kết (Blueprint) *
            </label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="exam-101">Đề số 1: Lập trình Web Nâng Cao (40 câu - 60 phút - 10.0đ)</option>
              <option value="exam-102">Đề số 2: Lập trình Web Dự phòng (40 câu - 60 phút - 10.0đ)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Thời điểm bắt đầu (start_at)
            </label>
            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Thời điểm kết thúc (end_at)
            </label>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cho phép vào muộn (Phút)
            </label>
            <input
              type="number"
              value={allowLateMinutes}
              onChange={(e) => setAllowLateMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số lần làm bài tối đa
            </label>
            <input
              type="number"
              disabled
              value={maxAttempts}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Proctor Assignment */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Cán bộ coi thi & Giám thị (Proctors)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">TS. Trần Minh Khoa</div>
              <div className="text-[11px] text-blue-700 font-medium">Trưởng ca thi (Chính)</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">Chính</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">ThS. Lê Hoàng Long</div>
              <div className="text-[11px] text-slate-500 font-medium">Giám thị hỗ trợ</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Phụ</span>
          </div>
        </div>
      </div>

      {/* Students Assignment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Danh sách thí sinh được gán ({students.length})
            </h2>
            <p className="text-xs text-slate-400">
              Chỉ các sinh viên có trong danh sách mới được phép truy cập và bắt đầu lượt thi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert("Chức năng mô phỏng: Đã tải lên file Excel sinh viên")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nhập Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddStudentModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm sinh viên</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder="Tìm theo mã sinh viên, họ tên..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Mã SV</th>
                <th className="px-4 py-3">Họ và tên</th>
                <th className="px-4 py-3">Email trường</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((sv) => (
                <tr key={sv.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{sv.studentId}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{sv.name}</td>
                  <td className="px-4 py-3 text-slate-500">{sv.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ĐÃ PHÂN BỔ
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(sv.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Gỡ khỏi ca thi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Sinh Viên */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Gán Sinh Viên Vào Ca Thi</h3>
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã sinh viên *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SV2026106"
                  value={newSvId}
                  onChange={(e) => setNewSvId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Hải Nam"
                  value={newSvName}
                  onChange={(e) => setNewSvName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="namhh@student.edu.vn"
                  value={newSvEmail}
                  onChange={(e) => setNewSvEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Gán vào ca thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
