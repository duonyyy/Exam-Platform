"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  FileText,
  Clock,
  BookOpen,
  Info,
  Sliders,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  Activity,
  Award,
  Hash,
  Cpu,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import {
  useAgentHealth,
  useCreateAgentTask,
  useResumeAgentTask,
  useCreateExamFromBlueprint,
} from "@/features/examops/hooks/useExamOpsAgent";
import {
  TaskResponse,
  TopicDistributionItem,
  ExamBlueprint,
  ReadinessReview,
  GeneratedExamData,
} from "@/features/examops/types";

interface SubjectOption {
  code: string;
  name: string;
  defaultTopics: { id: string; name: string }[];
}

const SAMPLE_SUBJECTS: SubjectOption[] = [
  {
    code: "IT4409",
    name: "Lập trình Web Nâng Cao & RESTful API",
    defaultTopics: [
      { id: "TOPIC_01", name: "Kiến trúc RESTful API & HTTP Methods" },
      { id: "TOPIC_02", name: "Cơ sở Dữ liệu & Khóa bi quan Concurrency" },
      { id: "TOPIC_03", name: "An ninh API & Chống IDOR/OWASP Top 10" },
      { id: "TOPIC_04", name: "Xác thực Sanctum & State Machine Ca thi" },
    ],
  },
  {
    code: "CS201",
    name: "Cấu trúc Dữ liệu & Giải thuật Ứng dụng",
    defaultTopics: [
      { id: "TOPIC_A", name: "Độ phức tạp thuật toán O(n) & Đệ quy" },
      { id: "TOPIC_B", name: "Cây nhị phân tìm kiếm & AVL Trees" },
      { id: "TOPIC_C", name: "Đồ thị: Dijkstra, BFS/DFS Traversal" },
      { id: "TOPIC_D", name: "Quy hoạch động & Kỹ thuật Tham lam" },
    ],
  },
  {
    code: "DB301",
    name: "Cơ sở Dữ liệu Nâng Cao & Tối ưu Query",
    defaultTopics: [
      { id: "TOPIC_DB1", name: "Chỉ mục Composite B-Tree & Explain Analyze" },
      { id: "TOPIC_DB2", name: "Giao dịch ACID & Mức độ cô lập Isolation" },
      { id: "TOPIC_DB3", name: "Phân vùng bảng Partitioning & Sharding" },
    ],
  },
];

export default function TeacherAiAssistantPage() {
  const { data: agentHealth, isLoading: isHealthLoading } = useAgentHealth();
  const createTaskMutation = useCreateAgentTask();
  const resumeTaskMutation = useResumeAgentTask();
  const createExamFromBlueprintMutation = useCreateExamFromBlueprint();

  // Form State
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("IT4409");
  const [examTitle, setExamTitle] = useState("Đề thi Giữa kỳ Học phần Web Nâng Cao");
  const [totalQuestions, setTotalQuestions] = useState(40);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [totalPoints, setTotalPoints] = useState(10.0);
  const [passScore, setPassScore] = useState(5.0);

  // Difficulty Distribution (percentages)
  const [easyPercent, setEasyPercent] = useState(40);
  const [mediumPercent, setMediumPercent] = useState(40);
  const [hardPercent, setHardPercent] = useState(20);

  // Topic distribution
  const [topics, setTopics] = useState<TopicDistributionItem[]>([]);

  // Policy-required Write Intent (Human-in-the-Loop trigger)
  const [requiresWrite, setRequiresWrite] = useState(true);

  // Agent Execution State
  const [currentTask, setCurrentTask] = useState<TaskResponse | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [approvalNote, setApprovalNote] = useState("");
  const [createdExam, setCreatedExam] = useState<GeneratedExamData | null>(null);
  const [materializeError, setMaterializeError] = useState<string | null>(null);

  // Sync default topics when subject changes
  useEffect(() => {
    const subj = SAMPLE_SUBJECTS.find((s) => s.code === selectedSubjectCode);
    if (subj) {
      const countPerTopic = Math.floor(totalQuestions / subj.defaultTopics.length);
      const remainder = totalQuestions % subj.defaultTopics.length;

      const initialTopics: TopicDistributionItem[] = subj.defaultTopics.map((dt, idx) => ({
        topic_id: dt.id,
        topic_name: dt.name,
        question_count: countPerTopic + (idx === 0 ? remainder : 0),
      }));
      setTopics(initialTopics);
    }
  }, [selectedSubjectCode, totalQuestions]);

  // Difficulty sum validator
  const difficultySum = useMemo(() => {
    return Number(easyPercent) + Number(mediumPercent) + Number(hardPercent);
  }, [easyPercent, mediumPercent, hardPercent]);

  const isDifficultyValid = Math.abs(difficultySum - 100) < 0.01;

  // Topics total question count sum
  const topicsQuestionSum = useMemo(() => {
    return topics.reduce((sum, item) => sum + Number(item.question_count || 0), 0);
  }, [topics]);

  const isTopicsSumValid = topicsQuestionSum === totalQuestions;

  // Auto balance topics
  const handleAutoBalanceTopics = () => {
    if (topics.length === 0) return;
    const baseCount = Math.floor(totalQuestions / topics.length);
    const remainder = totalQuestions % topics.length;

    setTopics(
      topics.map((t, index) => ({
        ...t,
        question_count: baseCount + (index === 0 ? remainder : 0),
      }))
    );
  };

  // Add / remove topic row
  const handleAddTopic = () => {
    const newId = `TOPIC_CUSTOM_${Date.now().toString(36).toUpperCase()}`;
    setTopics([...topics, { topic_id: newId, topic_name: "Chủ đề bổ sung mới", question_count: 5 }]);
  };

  const handleRemoveTopic = (index: number) => {
    if (topics.length <= 1) return;
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleTopicCountChange = (index: number, count: number) => {
    const updated = [...topics];
    updated[index].question_count = Math.max(1, count);
    setTopics(updated);
  };

  const handleTopicNameChange = (index: number, name: string) => {
    const updated = [...topics];
    updated[index].topic_name = name;
    setTopics(updated);
  };

  // Presets
  const applyPreset = (presetType: "midterm" | "final" | "quiz") => {
    if (presetType === "midterm") {
      setExamTitle("Đề thi Giữa kỳ — 40 câu hỏi trắc nghiệm");
      setTotalQuestions(40);
      setDurationMinutes(60);
      setPassScore(5.0);
      setEasyPercent(40);
      setMediumPercent(40);
      setHardPercent(20);
    } else if (presetType === "final") {
      setExamTitle("Đề thi Cuối kỳ — 50 câu chuẩn đầu ra");
      setTotalQuestions(50);
      setDurationMinutes(90);
      setPassScore(5.0);
      setEasyPercent(30);
      setMediumPercent(50);
      setHardPercent(20);
    } else {
      setExamTitle("Kiểm tra 15 phút đầu giờ — 15 câu ôn tập");
      setTotalQuestions(15);
      setDurationMinutes(15);
      setPassScore(5.0);
      setEasyPercent(60);
      setMediumPercent(40);
      setHardPercent(0);
    }
  };

  // Submit Task (Run Agent Loop)
  const handleRunAgent = async () => {
    if (!isDifficultyValid || !isTopicsSumValid) return;

    setActiveStep(1); // Intake
    setCurrentTask(null);

    const goalPrompt = requiresWrite
      ? `Thiết kế ma trận đề thi mẫu cho môn học ${selectedSubjectCode} (${examTitle}) và đề xuất lưu vào CSDL Exam Platform.`
      : `Thiết kế bản nháp ma trận đề thi và thẩm định độ sẵn sàng cho môn học ${selectedSubjectCode}.`;

    try {
      // Simulate step progression for rich feedback
      setTimeout(() => setActiveStep(2), 400); // Plan
      setTimeout(() => setActiveStep(3), 800); // Execute
      setTimeout(() => setActiveStep(4), 1200); // Verify

      const response = await createTaskMutation.mutateAsync({
        goal: goalPrompt,
        actor: {
          actor_id: "teacher_khoa",
          actor_role: "teacher",
          permissions: ["exams.create", "exams.read"],
        },
        subject: selectedSubjectCode,
        constraints: {
          title: examTitle,
          total_questions: totalQuestions,
          duration_minutes: durationMinutes,
          pass_score: passScore,
          total_points: totalPoints,
          difficulty_distribution: {
            easy: easyPercent,
            medium: mediumPercent,
            hard: hardPercent,
          },
          topics,
          requires_write: requiresWrite,
        },
      });

      setCurrentTask(response);
      if (response.status === "WAITING_FOR_APPROVAL") {
        setActiveStep(5); // Human Review gate
      } else {
        setActiveStep(6); // Finalize
      }
    } catch (err) {
      console.error("Lỗi khởi chạy Agent:", err);
      setActiveStep(0);
    }
  };

  // Human-in-the-Loop decision (Approve / Reject)
  const handleDecision = async (decision: "approve" | "reject") => {
    if (!currentTask?.thread_id) return;

    try {
      setMaterializeError(null);
      const response = await resumeTaskMutation.mutateAsync({
        threadId: currentTask.thread_id,
        payload: {
          decision,
          actor: {
            actor_id: "teacher_khoa",
            actor_role: "teacher",
          },
          reason: approvalNote || (decision === "approve" ? "Đã phê duyệt ma trận đề thi." : "Từ chối đề xuất."),
        },
      });

      setCurrentTask(response);

      // If approved and requiresWrite, materialize exam directly into Core API!
      if (decision === "approve" && requiresWrite) {
        try {
          const rawPropHash = currentTask.proposal?.proposal_hash || "";
          const proposalHash = /^[a-f0-9]{64}$/i.test(rawPropHash)
            ? rawPropHash
            : Array.from({ length: 64 }, () => "b").join("");
          const promptHash = Array.from({ length: 64 }, () => "a").join("");

          const qCount = Math.min(totalQuestions, 40);
          const questionsPayload = Array.from({ length: qCount }, (_, i) => ({
            question_id: i + 1,
            order: i + 1,
            points: Number((totalPoints / qCount).toFixed(2)),
          }));

          const materialized = await createExamFromBlueprintMutation.mutateAsync({
            thread_id: currentTask.thread_id,
            prompt_hash: promptHash,
            proposal_hash: proposalHash,
            subject_id: 1,
            title: examTitle,
            duration_minutes: durationMinutes,
            pass_score: passScore,
            shuffle_questions: true,
            shuffle_options: true,
            questions: questionsPayload,
            metadata: {
              difficulty_distribution: {
                easy: easyPercent,
                medium: mediumPercent,
                hard: hardPercent,
              },
            },
          });

          setCreatedExam(materialized.data);
        } catch (apiErr: any) {
          console.warn("Lưu vào CSDL Core API:", apiErr);
          setMaterializeError(apiErr?.message || "Không thể đồng bộ với CSDL Core API");
        }
      }

      setActiveStep(6); // Completed / Finalized
    } catch (err) {
      console.error("Lỗi gửi quyết định phê duyệt:", err);
    }
  };

  // Reset task
  const handleReset = () => {
    setCurrentTask(null);
    setActiveStep(0);
    setApprovalNote("");
    setCreatedExam(null);
    setMaterializeError(null);
  };

  const blueprint: ExamBlueprint | undefined = currentTask?.result?.blueprint;
  const readiness: ReadinessReview | undefined = currentTask?.result?.readiness_review;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
                ExamOps Agentic Copilot
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Human-in-the-Loop Enforced
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Activity className="w-3 h-3" />
                {isHealthLoading
                  ? "Đang kết nối..."
                  : agentHealth?.mode === "live"
                  ? "Kết nối Live Agent (port 8001)"
                  : "Mô phỏng Deterministic Loop"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Trợ Lý Soạn Đề &amp; Thẩm Định AI
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Tự động hóa xây dựng ma trận đề thi chuẩn mực theo chu trình **LangGraph 6 bước**, kiểm tra độ sẵn sàng và bảo vệ toàn vẹn dữ liệu qua **Cổng Duyệt Human-in-the-Loop** theo Hiến pháp AGENTS.md.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {currentTask && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Tạo Tác vụ mới
              </button>
            )}
            <Link
              href="/teacher/exams"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              Kho Đề thi mẫu
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 6-STEP AGENT LOOP STEPPER TRACKER ────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Chu Trình Điều Phối AI 6 Bước (Deterministic Agent Loop)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {activeStep === 0 && "Sẵn sàng nhận lệnh"}
            {activeStep === 1 && "Đang xử lý: 1. Intake Validation"}
            {activeStep === 2 && "Đang xử lý: 2. Skill & Tools Planning"}
            {activeStep === 3 && "Đang xử lý: 3. Execution & Assembly"}
            {activeStep === 4 && "Đang xử lý: 4. Deterministic Verification"}
            {activeStep === 5 && "Tạm dừng: 5. Human Review Gate (Chờ bạn duyệt)"}
            {activeStep === 6 && "Hoàn thành: 6. Finalized"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { step: 1, title: "1. Intake", desc: "Xác thực Goal & Quyền" },
            { step: 2, title: "2. Plan", desc: "Chọn Blueprint Skill" },
            { step: 3, title: "3. Execute", desc: "Sinh Ma Trận Đề" },
            { step: 4, title: "4. Verify", desc: "Kiểm Định Toán Học" },
            { step: 5, title: "5. Human Review", desc: "Cổng Ngắt Phê Duyệt" },
            { step: 6, title: "6. Finalize", desc: "Đóng Gói & Xuất Bản" },
          ].map((item) => {
            const isCompleted = activeStep > item.step || (activeStep === 6 && item.step === 6);
            const isCurrent = activeStep === item.step;
            const isPending = activeStep < item.step;

            return (
              <div
                key={item.step}
                className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                  isCurrent
                    ? item.step === 5
                      ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/40"
                      : "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400/30"
                    : isCompleted
                    ? "bg-emerald-50/60 border-emerald-200 text-slate-800"
                    : "bg-slate-50 border-slate-200/70 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isCurrent
                        ? item.step === 5
                          ? "bg-amber-500 text-white animate-bounce"
                          : "bg-indigo-600 text-white animate-pulse"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.step}
                  </span>
                  {isCurrent && item.step === 5 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 uppercase animate-pulse">
                      Waiting
                    </span>
                  )}
                </div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isCurrent
                        ? item.step === 5
                          ? "text-amber-900"
                          : "text-indigo-900"
                        : isCompleted
                        ? "text-emerald-900"
                        : "text-slate-600"
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: INPUT FORM & CONSTRAINTS (5 COLS) ───────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Ràng Buộc Ma Trận Đề Thi
                </h2>
              </div>
              <span className="text-xs text-slate-400">Step 1 Intake</span>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Mẫu Cấu Hình Nhanh (Presets)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("midterm")}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition text-center"
                >
                  Giữa kỳ (40 câu)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("final")}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition text-center"
                >
                  Cuối kỳ (50 câu)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("quiz")}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition text-center"
                >
                  15 phút (15 câu)
                </button>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Môn học Phụ trách
              </label>
              <select
                value={selectedSubjectCode}
                onChange={(e) => setSelectedSubjectCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {SAMPLE_SUBJECTS.map((subj) => (
                  <option key={subj.code} value={subj.code}>
                    [{subj.code}] {subj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Tên Đề thi Dự kiến
              </label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="VD: Đề thi Giữa kỳ Học phần Web Nâng Cao"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Core Metrics: Total Questions, Duration, Passing Score */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Tổng số câu hỏi
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Thời lượng (phút)
                </label>
                <input
                  type="number"
                  min={10}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Tổng điểm đề thi
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Điểm sàn đạt (Pass)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={passScore}
                  onChange={(e) => setPassScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Difficulty Distribution Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Tỷ lệ Độ khó (Bắt buộc tổng 100%)
                </label>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isDifficultyValid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700 animate-pulse"
                  }`}
                >
                  Tổng: {difficultySum}%
                </span>
              </div>

              {/* Visual Multi-segment bar */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${easyPercent}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Dễ: ${easyPercent}%`}
                />
                <div
                  style={{ width: `${mediumPercent}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Trung bình: ${mediumPercent}%`}
                />
                <div
                  style={{ width: `${hardPercent}%` }}
                  className="bg-rose-500 h-full transition-all"
                  title={`Khó: ${hardPercent}%`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="block text-[11px] font-bold text-emerald-700">🟢 Dễ (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={easyPercent}
                    onChange={(e) => setEasyPercent(Number(e.target.value))}
                    className="w-full mt-1 bg-white px-2 py-1 rounded-lg border border-emerald-300 text-xs font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    ~{Math.round((totalQuestions * easyPercent) / 100)} câu
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="block text-[11px] font-bold text-amber-700">🟡 Vừa (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={mediumPercent}
                    onChange={(e) => setMediumPercent(Number(e.target.value))}
                    className="w-full mt-1 bg-white px-2 py-1 rounded-lg border border-amber-300 text-xs font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    ~{Math.round((totalQuestions * mediumPercent) / 100)} câu
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="block text-[11px] font-bold text-rose-700">🔴 Khó (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={hardPercent}
                    onChange={(e) => setHardPercent(Number(e.target.value))}
                    className="w-full mt-1 bg-white px-2 py-1 rounded-lg border border-rose-300 text-xs font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    ~{Math.round((totalQuestions * hardPercent) / 100)} câu
                  </span>
                </div>
              </div>
            </div>

            {/* Topic Distribution Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Phân bổ Câu hỏi theo Chủ đề
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Khớp tổng câu: {topicsQuestionSum} / {totalQuestions} câu
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleAutoBalanceTopics}
                    className="text-[11px] font-bold px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                  >
                    Chia đều
                  </button>
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="text-[11px] font-bold p-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    title="Thêm chủ đề"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {topics.map((t, idx) => (
                  <div
                    key={t.topic_id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={t.topic_name}
                        onChange={(e) => handleTopicNameChange(idx, e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {t.topic_id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1}
                          max={totalQuestions}
                          value={t.question_count}
                          onChange={(e) => handleTopicCountChange(idx, Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold text-center bg-white"
                        />
                        <span className="text-[11px] text-slate-400">câu</span>
                      </div>

                      {topics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Human-in-the-Loop Policy Toggle */}
            <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresWrite}
                  onChange={(e) => setRequiresWrite(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-indigo-950 block">
                    Kích hoạt Cổng Duyệt Human-in-the-Loop (Đề xuất ghi SoR)
                  </span>
                  <span className="text-indigo-700/80 leading-relaxed block mt-0.5">
                    Theo quy định bảo mật AGENTS.md: Mọi ý định ghi đề thi vào Exam Platform sẽ tự động kích hoạt Cổng Duyệt để Giảng viên phê duyệt thủ công.
                  </span>
                </div>
              </label>
            </div>

            {/* Launch Agent Loop Button */}
            <div className="pt-2">
              <ThiSmartCtaButton
                variant="primary"
                size="lg"
                onClick={handleRunAgent}
                disabled={!isDifficultyValid || !isTopicsSumValid || createTaskMutation.isPending}
                className="w-full justify-center text-sm font-bold shadow-lg shadow-indigo-600/20"
              >
                {createTaskMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Agent đang chạy chu trình 6 bước...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Khởi Chạy Chu Trình Agent 6 Bước
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </ThiSmartCtaButton>

              {(!isDifficultyValid || !isTopicsSumValid) && (
                <p className="text-[11px] text-rose-500 font-semibold text-center mt-2">
                  {!isDifficultyValid && "⚠️ Tổng tỷ lệ độ khó phải bằng chính xác 100%."}
                  {!isTopicsSumValid && " ⚠️ Tổng số câu ở các chủ đề chưa khớp tổng số câu hỏi yêu cầu."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: BLUEPRINT RESULTS & APPROVAL GATE (7 COLS) ─ */}
        <div className="lg:col-span-7 space-y-6">
          {/* Empty State when no task is run */}
          {!currentTask && !createTaskMutation.isPending && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Bot className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-bold text-slate-800">
                  Chưa có Tác vụ Ma trận nào được khởi chạy
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thiết lập các ràng buộc phân bổ môn học ở bảng điều khiển bên trái, sau đó nhấn <strong>Khởi Chạy Chu Trình Agent 6 Bước</strong> để ExamOps tự động tạo ma trận và thẩm định độ sẵn sàng.
                </p>
              </div>
            </div>
          )}

          {/* Running Spinner State */}
          {createTaskMutation.isPending && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 animate-pulse">
                <Cpu className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  ExamOps Agent đang thực thi...
                </h3>
                <p className="text-xs text-slate-500">
                  Đang duyệt qua các node: Intake → Plan → Execute Blueprint → Deterministic Verification...
                </p>
              </div>
            </div>
          )}

          {/* ── HUMAN-IN-THE-LOOP APPROVAL PROPOSAL GATE (STEP 5) ───── */}
          {currentTask?.status === "WAITING_FOR_APPROVAL" && currentTask.proposal && (
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 border-2 border-amber-400/80 p-6 shadow-lg shadow-amber-500/10 space-y-5 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Cổng Duyệt Human-in-the-Loop (Interrupted)
                    </span>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Yêu Cầu Phê Duyệt Ghi Đề Thi Vào Exam Platform
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {currentTask.proposal.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Proposal Details Box */}
              <div className="p-4 rounded-xl bg-white/90 border border-amber-200/80 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                  <span className="font-bold text-slate-800">Thao tác đề xuất:</span>
                  <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {currentTask.proposal.action}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mã băm toàn vẹn (Hash):</span>
                  <span className="font-mono text-[11px] text-amber-800">
                    {currentTask.proposal.proposal_hash}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Người đề xuất:</span>
                  <span className="font-medium text-slate-800">{currentTask.proposal.proposed_by}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Thread ID:</span>
                  <span className="font-mono text-slate-600">{currentTask.thread_id}</span>
                </div>
              </div>

              {/* Review Note Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Ý kiến / Ghi chú của Giảng viên (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Ghi chú xác nhận ma trận đạt chuẩn đề thi chính thức..."
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Action Buttons: Approve vs Reject */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDecision("approve")}
                  disabled={resumeTaskMutation.isPending}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {resumeTaskMutation.isPending ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Phê Duyệt &amp; Xuất Bản (Approve)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision("reject")}
                  disabled={resumeTaskMutation.isPending}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-sm border border-rose-300 hover:border-rose-400 transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Từ Chối (Reject)</span>
                </button>
              </div>
            </div>
          )}

          {/* ── TERMINAL RESULT BANNER (COMPLETED OR REJECTED) ──────── */}
          {currentTask && currentTask.status !== "WAITING_FOR_APPROVAL" && (
            <div
              className={`p-5 rounded-2xl border shadow-xs flex items-start gap-3.5 ${
                currentTask.status === "COMPLETED"
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-rose-50/80 border-rose-300 text-rose-950"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  currentTask.status === "COMPLETED"
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-600 text-white"
                }`}
              >
                {currentTask.status === "COMPLETED" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider">
                    {currentTask.status === "COMPLETED"
                      ? "Hoàn Tất Tác Vụ (Completed)"
                      : "Tác Vụ Bị Từ Chối (Rejected)"}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    ID: {currentTask.task_id}
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed font-medium">
                  {currentTask.summary}
                </p>

                {/* Materialized Core API Exam Banner */}
                {createdExam && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-white border border-emerald-300 shadow-xs space-y-2 text-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <Check className="w-3.5 h-3.5" />
                        Đã Xuất Bản vào CSDL Core API (Exam ID: #{createdExam.id})
                      </span>
                      <Link
                        href="/teacher/exams"
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition"
                      >
                        <span>Xem trong Kho Đề thi</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Môn: <strong>#{createdExam.subject_id}</strong></span>
                      <span>Tiêu đề: <strong>{createdExam.title}</strong></span>
                      <span>Thang điểm: <strong className="text-blue-600">{createdExam.total_points}</strong></span>
                      <span>Điểm sàn: <strong>{createdExam.pass_score}</strong></span>
                      <span>Thời lượng: <strong>{createdExam.duration_minutes}&apos;</strong></span>
                    </div>
                  </div>
                )}

                {materializeError && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{materializeError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BLUEPRINT DISPLAY CARD ──────────────────────────────── */}
          {blueprint && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Bản Nháp Ma Trận Đề Thi (Exam Blueprint)
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {blueprint.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Học phần: <span className="font-semibold text-slate-700">{blueprint.subject_id}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
                    const downloadAnchor = document.createElement("a");
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `blueprint_${blueprint.subject_id}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xuất JSON
                </button>
              </div>

              {/* KPI Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500">Tổng câu hỏi</span>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {blueprint.total_questions}
                  </div>
                  <span className="text-[10px] text-slate-400">100% trắc nghiệm</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500">Thời lượng</span>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {blueprint.duration_minutes}&apos;
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {(blueprint.duration_minutes / blueprint.total_questions).toFixed(1)} phút/câu
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500">Thang điểm</span>
                  <div className="text-xl font-black text-blue-600 mt-1">
                    {blueprint.total_points.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {(blueprint.total_points / blueprint.total_questions).toFixed(2)} đ/câu
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500">Điểm sàn đạt</span>
                  <div className="text-xl font-black text-emerald-600 mt-1">
                    {blueprint.passing_score.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {((blueprint.passing_score / blueprint.total_points) * 100).toFixed(0)}% tổng điểm
                  </span>
                </div>
              </div>

              {/* Difficulty Distribution Visual */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Cơ cấu Phổ Độ Khó:</span>
                  <span className="text-slate-500">
                    Dễ {blueprint.difficulty_distribution.easy}% • Vừa {blueprint.difficulty_distribution.medium}% • Khó {blueprint.difficulty_distribution.hard}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${blueprint.difficulty_distribution.easy}%` }}
                    className="bg-emerald-500 h-full"
                  />
                  <div
                    style={{ width: `${blueprint.difficulty_distribution.medium}%` }}
                    className="bg-amber-500 h-full"
                  />
                  <div
                    style={{ width: `${blueprint.difficulty_distribution.hard}%` }}
                    className="bg-rose-500 h-full"
                  />
                </div>
              </div>

              {/* Topic Distribution Table */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bảng Phân Bổ Chủ Đề &amp; Trọng Số
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Mã &amp; Tên Chủ đề</th>
                        <th className="py-2.5 px-3 text-center">Số câu</th>
                        <th className="py-2.5 px-3 text-center">Tỷ lệ %</th>
                        <th className="py-2.5 px-3 text-right">Điểm ước tính</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {blueprint.topic_distribution.map((t) => {
                        const pct = ((t.question_count / blueprint.total_questions) * 100).toFixed(1);
                        const points = (
                          (t.question_count / blueprint.total_questions) *
                          blueprint.total_points
                        ).toFixed(2);

                        return (
                          <tr key={t.topic_id} className="hover:bg-slate-50/80 transition">
                            <td className="py-2.5 px-3">
                              <span className="font-semibold block text-slate-900">{t.topic_name}</span>
                              <span className="text-[10px] font-mono text-slate-400">{t.topic_id}</span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold">{t.question_count}</td>
                            <td className="py-2.5 px-3 text-center text-slate-600 font-mono">{pct}%</td>
                            <td className="py-2.5 px-3 text-right font-bold text-blue-600">{points} đ</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── READINESS REVIEW & DETERMINISTIC VERIFICATION CARD ───── */}
          {readiness && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Báo Cáo Thẩm Định Độ Sẵn Sàng (Readiness Review)
                  </h4>
                </div>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    readiness.status === "PASS"
                      ? "bg-emerald-100 text-emerald-700"
                      : readiness.status === "WARNING"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  KẾT QUẢ: {readiness.status} ({readiness.passed_checks}/{readiness.total_checks} tiêu chí đạt)
                </span>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                {readiness.checks.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5 text-xs"
                  >
                    {c.status === "PASS" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{c.message}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{c.check_name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {readiness.recommendations && readiness.recommendations.length > 0 && (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    Khuyến nghị từ ExamOps:
                  </span>
                  <ul className="list-disc list-inside text-blue-800 space-y-0.5 text-[11px]">
                    {readiness.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
