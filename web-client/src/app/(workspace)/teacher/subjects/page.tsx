"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  FolderTree,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  X,
  Loader2,
} from "lucide-react";
import {
  useSubjects,
  useSubjectTopics,
  useCreateSubject,
  useCreateTopic,
} from "@/features/academic/hooks";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";

function SubjectTopicsList({
  subjectId,
  isOwner,
  onOpenAddTopic,
}: {
  subjectId: number;
  isOwner: boolean;
  onOpenAddTopic: (subId: number) => void;
}) {
  const { data, isLoading } = useSubjectTopics(subjectId);
  const topics = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6 text-xs text-slate-400 gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>Đang tải danh sách chủ đề...</span>
      </div>
    );
  }

  return (
    <div className="p-5 bg-slate-50/60 border-t border-slate-200 space-y-3">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
        <span className="flex items-center gap-1.5">
          <FolderTree className="w-3.5 h-3.5" />
          Danh sách Chủ đề kiến thức ({topics.length})
        </span>
        {isOwner && (
          <button
            type="button"
            onClick={() => onOpenAddTopic(subjectId)}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 normal-case font-semibold text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm chủ đề mới
          </button>
        )}
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-400">
          Chưa có chủ đề nào. Bấm &quot;Thêm chủ đề mới&quot; để tạo chương mục kiến thức.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {topics.map((top, idx) => (
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
                    {top.questions_count ?? 0} câu hỏi ngân hàng
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/teacher/questions?topic_id=${top.id}`}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                >
                  Xem câu hỏi
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubjectsPage() {
  const { data: currentUser } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOwnerOnly, setFilterOwnerOnly] = useState(false);
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<Record<number, boolean>>({});

  // Query live subjects
  const { data, isLoading } = useSubjects(searchTerm);
  const subjects = data?.data || [];

  // Mutations
  const createSubjectMutation = useCreateSubject();
  const createTopicMutation = useCreateTopic();

  // Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubDesc, setNewSubDesc] = useState("");

  const [activeSubjectForTopic, setActiveSubjectForTopic] = useState<number | null>(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");

  const toggleSubject = (id: number) => {
    setExpandedSubjectIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;

    await createSubjectMutation.mutateAsync({
      code: newSubCode.trim().toUpperCase(),
      name: newSubName.trim(),
      description: newSubDesc.trim(),
    });

    setNewSubCode("");
    setNewSubName("");
    setNewSubDesc("");
    setShowSubjectModal(false);
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubjectForTopic || !newTopicName) return;

    await createTopicMutation.mutateAsync({
      subjectId: activeSubjectForTopic,
      data: {
        name: newTopicName.trim(),
        description: newTopicDesc.trim(),
      },
    });

    setNewTopicName("");
    setNewTopicDesc("");
    setActiveSubjectForTopic(null);
  };

  const filteredSubjects = subjects.filter((sub) => {
    if (!filterOwnerOnly) return true;
    return sub.owner_teacher_id === currentUser?.id || sub.created_by === currentUser?.id;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">Đang tải danh sách môn học từ hệ thống...</span>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <div className="text-sm font-bold text-slate-700">Chưa có môn học nào</div>
          <div className="text-xs text-slate-400 mt-1">
            Bấm &quot;Tạo Môn học mới&quot; để thiết lập chương trình học đầu tiên.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubjects.map((sub) => {
            const isExpanded = !!expandedSubjectIds[sub.id];
            const isOwner =
              sub.owner_teacher_id === currentUser?.id ||
              sub.created_by === currentUser?.id ||
              currentUser?.role === "admin";

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
                        {isOwner && (
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Bạn phụ trách
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                        {sub.description || "Chưa có mô tả chi tiết."}
                      </p>
                    </div>
                  </div>

                  {/* Metrics & Expand toggle */}
                  <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
                    <div className="flex items-center gap-4 text-center">
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Chủ đề</div>
                        <div className="text-sm font-bold text-slate-800">
                          {sub.topics_count ?? 0}
                        </div>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Topics Sub-list (when expanded) */}
                {isExpanded && (
                  <SubjectTopicsList
                    subjectId={sub.id}
                    isOwner={isOwner}
                    onOpenAddTopic={(id) => setActiveSubjectForTopic(id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

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
                  Tên môn học *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kiến trúc Máy tính, Lập trình Web..."
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả đề cương môn học
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả mục tiêu môn học, kiến thức cốt lõi..."
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createSubjectMutation.isPending}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {createSubjectMutation.isPending ? "Đang tạo..." : "Tạo môn học"}
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
              <h3 className="text-base font-bold text-slate-900">Thêm Chủ Đề Kiến Thức</h3>
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
                  Tên chủ đề kiến thức *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tầng Giao vận TCP/UDP..."
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả chủ đề
                </label>
                <textarea
                  rows={2}
                  placeholder="Phạm vi kiến thức thuộc chủ đề này..."
                  value={newTopicDesc}
                  onChange={(e) => setNewTopicDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSubjectForTopic(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createTopicMutation.isPending}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {createTopicMutation.isPending ? "Đang thêm..." : "Thêm chủ đề"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
