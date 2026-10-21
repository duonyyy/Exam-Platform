"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FolderTree,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  HelpCircle,
  FileText,
  User,
  CheckCircle2,
  X,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";

interface TopicItem {
  id: string;
  name: string;
  code: string;
  questionsCount: number;
}

interface SubjectItem {
  id: string;
  code: string;
  name: string;
  description: string;
  ownerTeacher: string;
  isOwner: boolean;
  topicsCount: number;
  questionsCount: number;
  examsCount: number;
  topics: TopicItem[];
}

const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: "sub-1",
    code: "IT4409",
    name: "Lập trình Web Nâng Cao",
    description: "Kiến trúc RESTful API, Laravel 13, Next.js 15, PostgreSQL và bảo mật xác thực OWASP.",
    ownerTeacher: "TS. Trần Minh Khoa",
    isOwner: true,
    topicsCount: 4,
    questionsCount: 240,
    examsCount: 3,
    topics: [
      { id: "top-1", name: "Giao thức HTTP & REST Architecture", code: "TOP-01", questionsCount: 65 },
      { id: "top-2", name: "Cơ sở dữ liệu quan hệ & Eloquent ORM", code: "TOP-02", questionsCount: 75 },
      { id: "top-3", name: "Xác thực Sanctum & Phân quyền RBAC", code: "TOP-03", questionsCount: 50 },
      { id: "top-4", name: "Tối ưu hiệu năng & Caching Redis", code: "TOP-04", questionsCount: 50 },
    ],
  },
  {
    id: "sub-2",
    code: "CS201",
    name: "Cấu trúc Dữ liệu & Giải thuật",
    description: "Giải thuật tìm kiếm, sắp xếp, cây nhị phân cân bằng, đồ thị và độ phức tạp tính toán.",
    ownerTeacher: "TS. Trần Minh Khoa",
    isOwner: true,
    topicsCount: 3,
    questionsCount: 120,
    examsCount: 2,
    topics: [
      { id: "top-5", name: "Độ phức tạp Big-O & Giải thuật sắp xếp", code: "TOP-05", questionsCount: 40 },
      { id: "top-6", name: "Cây nhị phân tìm kiếm & AVL Trees", code: "TOP-06", questionsCount: 45 },
      { id: "top-7", name: "Đồ thị (BFS, DFS, Dijkstra)", code: "TOP-07", questionsCount: 35 },
    ],
  },
  {
    id: "sub-3",
    code: "DB301",
    name: "Cơ sở Dữ liệu Phân tán",
    description: "Mô hình CAP, Replication, Sharding, Concurrency Control và chuẩn ACID trong PostgreSQL.",
    ownerTeacher: "ThS. Lê Hoàng Long",
    isOwner: false,
    topicsCount: 2,
    questionsCount: 60,
    examsCount: 1,
    topics: [
      { id: "top-8", name: "Mô hình ACID & Khóa bi quan Concurrency", code: "TOP-08", questionsCount: 30 },
      { id: "top-9", name: "Replication & Sharding trong DB", code: "TOP-09", questionsCount: 30 },
    ],
  },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOwnerOnly, setFilterOwnerOnly] = useState(false);
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<Record<string, boolean>>({
    "sub-1": true,
    "sub-2": false,
  });

  // Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubDesc, setNewSubDesc] = useState("");

  const [activeSubjectForTopic, setActiveSubjectForTopic] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState("");

  const toggleSubject = (id: string) => {
    setExpandedSubjectIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;

    const newSub: SubjectItem = {
      id: `sub-${Date.now()}`,
      code: newSubCode.toUpperCase(),
      name: newSubName,
      description: newSubDesc || "Chưa có mô tả chi tiết.",
      ownerTeacher: "TS. Trần Minh Khoa",
      isOwner: true,
      topicsCount: 0,
      questionsCount: 0,
      examsCount: 0,
      topics: [],
    };

    setSubjects([newSub, ...subjects]);
    setNewSubCode("");
    setNewSubName("");
    setNewSubDesc("");
    setShowSubjectModal(false);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName || !activeSubjectForTopic) return;

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === activeSubjectForTopic) {
          const newTopic: TopicItem = {
            id: `top-${Date.now()}`,
            name: newTopicName,
            code: `TOP-${sub.topics.length + 1}`.padStart(6, "0"),
            questionsCount: 0,
          };
          return {
            ...sub,
            topicsCount: sub.topicsCount + 1,
            topics: [...sub.topics, newTopic],
          };
        }
        return sub;
      })
    );

    setNewTopicName("");
    setActiveSubjectForTopic(null);
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOwner = filterOwnerOnly ? s.isOwner : true;
    return matchesSearch && matchesOwner;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Page Title & Top CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Quản Lý Môn Học & Chủ Đề Kiến Thức
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xây dựng cây phân cấp môn học, phân loại chủ đề và quản lý ngân hàng câu hỏi phụ thuộc.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSubjectModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Môn học mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã môn (IT4409), tên môn học..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterOwnerOnly(!filterOwnerOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              filterOwnerOnly
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filterOwnerOnly ? "✓ Môn tôi phụ trách" : "Tất cả môn"}
          </button>
        </div>
      </div>

      {/* Subjects Accordion Cards */}
      <div className="space-y-4">
        {filteredSubjects.map((sub) => {
          const isExpanded = !!expandedSubjectIds[sub.id];

          return (
            <div
              key={sub.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition"
            >
              {/* Subject Header Card */}
              <div
                onClick={() => toggleSubject(sub.id)}
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white to-slate-50/50 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-blue-600 text-white">
                        {sub.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                      {sub.isOwner && (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Bạn phụ trách
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                      {sub.description}
                    </p>
                    <div className="text-xs text-slate-400">
                      Giảng viên: <span className="font-semibold text-slate-600">{sub.ownerTeacher}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics & Expand toggle */}
                <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
                  <div className="flex items-center gap-4 text-center">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Chủ đề</div>
                      <div className="text-sm font-bold text-slate-800">{sub.topicsCount}</div>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Câu hỏi</div>
                      <div className="text-sm font-bold text-blue-600">{sub.questionsCount}</div>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Đề mẫu</div>
                      <div className="text-sm font-bold text-slate-800">{sub.examsCount}</div>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Topics Sub-list (when expanded) */}
              {isExpanded && (
                <div className="p-5 bg-slate-50/60 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                    <span className="flex items-center gap-1.5">
                      <FolderTree className="w-3.5 h-3.5" />
                      Danh sách Chủ đề kiến thức ({sub.topics.length})
                    </span>
                    {sub.isOwner && (
                      <button
                        type="button"
                        onClick={() => setActiveSubjectForTopic(sub.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 normal-case font-semibold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm chủ đề mới
                      </button>
                    )}
                  </div>

                  {sub.topics.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Chưa có chủ đề nào. Bấm &quot;Thêm chủ đề mới&quot; để tạo chương mục kiến thức.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {sub.topics.map((top, idx) => (
                        <div
                          key={top.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{top.name}</div>
                              <div className="text-[11px] text-slate-400">
                                {top.questionsCount} câu hỏi ngân hàng
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/teacher/questions?topic_id=${top.id}`}
                              className="px-2 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                            >
                              Xem câu hỏi
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Tạo Môn Học */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Tạo Môn Học Mới</h3>
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã môn học (Subject Code) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: IT4409, CS201..."
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên môn học đầy đủ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lập trình Web Nâng Cao"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả vắn tắt nội dung
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả mục tiêu, kiến trúc học phần..."
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
                >
                  Tạo môn học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Chủ Đề */}
      {activeSubjectForTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Thêm Chủ Đề Mới</h3>
              <button
                type="button"
                onClick={() => setActiveSubjectForTopic(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên chủ đề / Chương mục *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Xác thực JWT & Laravel Sanctum"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSubjectForTopic(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
                >
                  Thêm chủ đề
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
