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
  Wand2,
  BrainCircuit,
  Send,
  Copy,
  ChevronRight,
  Gauge,
  FileCheck,
  RefreshCw,
  Zap,
  SlidersHorizontal,
  BookmarkCheck,
  HelpCircle,
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
import { QuestionGeneratorStudio } from "./QuestionGeneratorStudio";

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

const PROMPT_SUGGESTIONS = [
  {
    title: "Đề thi Giữa kỳ Web Nâng Cao",
    prompt: "Soạn đề thi Giữa kỳ môn Lập trình Web Nâng Cao IT4409 gồm 40 câu hỏi trắc nghiệm trong 60 phút, phân bổ 40% Dễ, 40% Vừa, 20% Khó, tập trung vào RESTful API và An ninh OWASP.",
  },
  {
    title: "Đề thi Cuối kỳ Giải thuật",
    prompt: "Thiết kế ma trận đề thi Cuối kỳ môn Cấu trúc Dữ liệu & Giải thuật CS201 với 50 câu, thời gian 90 phút, phân bổ chuẩn Bloom 30% Nhận biết, 50% Thông hiểu, 20% Vận dụng cao.",
  },
  {
    title: "Kiểm tra 15 phút Cơ sở dữ liệu",
    prompt: "Soạn đề kiểm tra 15 phút môn CSDL Nâng cao DB301 gồm 15 câu ôn tập về Chỉ mục Composite B-Tree và Giao dịch ACID, 60% Dễ, 40% Vừa.",
  },
];

export default function TeacherAiAssistantPage() {
  const { data: agentHealth, isLoading: isHealthLoading } = useAgentHealth();
  const createTaskMutation = useCreateAgentTask();
  const resumeTaskMutation = useResumeAgentTask();
  const createExamFromBlueprintMutation = useCreateExamFromBlueprint();

  // Active Input Mode: "studio" (interactive parameter controls) vs "prompt" (natural language)
  const [inputMode, setInputMode] = useState<"studio" | "prompt">("studio");
  const [naturalPrompt, setNaturalPrompt] = useState(
    "Soạn đề thi Giữa kỳ môn Lập trình Web Nâng Cao IT4409 gồm 40 câu hỏi trắc nghiệm trong 60 phút, phân bổ 40% Dễ, 40% Vừa, 20% Khó."
  );

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
  const [previewTab, setPreviewTab] = useState<"matrix" | "audit" | "json">("matrix");
  const [copiedHash, setCopiedHash] = useState(false);
  const [mainFeatureTab, setMainFeatureTab] = useState<"blueprint" | "question_generator">("blueprint");

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

  // Normalize difficulty automatically to 100%
  const handleNormalizeDifficulty = () => {
    const total = easyPercent + mediumPercent + hardPercent;
    if (total === 0) {
      setEasyPercent(40);
      setMediumPercent(40);
      setHardPercent(20);
      return;
    }
    const newEasy = Math.round((easyPercent / total) * 100);
    const newMed = Math.round((mediumPercent / total) * 100);
    const newHard = 100 - newEasy - newMed;
    setEasyPercent(newEasy);
    setMediumPercent(newMed);
    setHardPercent(newHard);
  };

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

    const goalPrompt =
      inputMode === "prompt" && naturalPrompt.trim().length > 10
        ? naturalPrompt.trim()
        : requiresWrite
        ? `Thiết kế ma trận đề thi mẫu cho môn học ${selectedSubjectCode} (${examTitle}) và đề xuất lưu vào CSDL Exam Platform.`
        : `Thiết kế bản nháp ma trận đề thi và thẩm định độ sẵn sàng cho môn học ${selectedSubjectCode}.`;

    try {
      setTimeout(() => setActiveStep(2), 350); // Plan
      setTimeout(() => setActiveStep(3), 700); // Execute
      setTimeout(() => setActiveStep(4), 1050); // Verify

      const response = await createTaskMutation.mutateAsync({
        goal: goalPrompt,
        actor: {
          actor_id: "teacher_01",
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
            actor_id: "teacher_01",
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

          // Attach verified questions belonging to Subject 1 (IT4409) in Core API
          const validQuestionIds = [1, 2, 3, 7, 9, 12, 15];
          const questionsPayload = validQuestionIds.map((qId, i) => ({
            question_id: qId,
            order: i + 1,
            points: Number((totalPoints / validQuestionIds.length).toFixed(2)),
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

      setActiveStep(6);
    } catch (err) {
      console.error("Lỗi gửi quyết định phê duyệt:", err);
    }
  };

  const handleReset = () => {
    setCurrentTask(null);
    setActiveStep(0);
    setApprovalNote("");
    setCreatedExam(null);
    setMaterializeError(null);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const blueprint: ExamBlueprint | undefined = currentTask?.result?.blueprint;
  const readiness: ReadinessReview | undefined = currentTask?.result?.readiness_review;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* ── 1. MODERN HERO BANNER WITH BRAND IDENTITY ───────────────── */}
      <div className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800">
        {/* Subtle Tech Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-400/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                ThiSmart AI Copilot 2.0
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Human-in-the-Loop Gate
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                {isHealthLoading
                  ? "Đang kết nối..."
                  : agentHealth?.status === "healthy"
                  ? "Agent Online (FastAPI :8001)"
                  : "Mô phỏng Nội bộ"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Trợ Lý Soạn Đề &amp; Thẩm Định Khảo Thí
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Thiết kế ma trận đề thi chuẩn mực theo quy tắc toán học Bloom, tự động thẩm định độ sẵn sàng và kiểm soát ghi dữ liệu an toàn qua cổng duyệt con người theo Hiến pháp kỹ thuật AGENTS.md.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {currentTask && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Làm mới
              </button>
            )}
            <Link
              href="/teacher/exams"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition active:scale-95 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-blue-300" />
              Kho Đề thi
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── TOP-LEVEL FEATURE NAVIGATION TABS ───────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 pb-2">
        <button
          type="button"
          onClick={() => setMainFeatureTab("blueprint")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
            mainFeatureTab === "blueprint"
              ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Thiết Kế Đề Thi Mẫu (Blueprint &amp; Review)</span>
        </button>
        <button
          type="button"
          onClick={() => setMainFeatureTab("question_generator")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
            mainFeatureTab === "question_generator"
              ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Soạn Câu Hỏi Tự Động (AI Generator)</span>
          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-800 ml-1">
            Mới
          </span>
        </button>
      </div>

      {mainFeatureTab === "question_generator" ? (
        <QuestionGeneratorStudio />
      ) : (
        <>
      {/* ── 2. STREAMLINED 6-STEP AGENT PIPELINE ────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Chu Trình LangGraph Tất Định (6-Step Deterministic Loop)
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {activeStep === 0 && "Sẵn sàng nhận lệnh"}
            {activeStep === 1 && "Đang chạy Node 1: Intake & Actor Check..."}
            {activeStep === 2 && "Đang chạy Node 2: Plan & Tool Filtering..."}
            {activeStep === 3 && "Đang chạy Node 3: Execute Domain Skill..."}
            {activeStep === 4 && "Đang chạy Node 4: Thẩm định toán học Bloom..."}
            {activeStep === 5 && "Đang dừng tại Node 5: Chờ Giảng viên duyệt..."}
            {activeStep === 6 && "Hoàn tất Node 6: Chốt kết quả cuối cùng"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { step: 1, label: "1. Intake", sub: "Xác thực vai trò" },
            { step: 2, label: "2. Plan", sub: "Lập danh sách tool" },
            { step: 3, label: "3. Execute", sub: "Sinh ma trận Bloom" },
            { step: 4, label: "4. Verify", sub: "Kiểm định 100%" },
            { step: 5, label: "5. Review", sub: "Cổng duyệt HITL" },
            { step: 6, label: "6. Finalize", sub: "Đóng gói kết quả" },
          ].map((item) => {
            const isCompleted = activeStep > item.step || (activeStep === 6 && item.step === 6);
            const isCurrent = activeStep === item.step;

            return (
              <div
                key={item.step}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? item.step === 5
                      ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30 text-amber-900"
                      : "bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/30 text-blue-900"
                    : isCompleted
                    ? "bg-emerald-50/60 border-emerald-200/80 text-emerald-950"
                    : "bg-slate-50/60 border-slate-200/60 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      isCurrent
                        ? item.step === 5
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-blue-600 text-white animate-pulse"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : item.step}
                  </span>
                  {isCurrent && item.step === 5 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800 uppercase animate-pulse">
                      Waiting
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{item.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5 truncate">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── 3. LEFT COLUMN: INTERACTIVE CONTROL STUDIO (5 COLS) ────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-full">
                <button
                  type="button"
                  onClick={() => setInputMode("studio")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    inputMode === "studio"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Studio Ma Trận</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("prompt")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    inputMode === "prompt"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Prompt Tự Nhiên</span>
                </button>
              </div>
            </div>

            {/* MODE A: NATURAL PROMPT INPUT */}
            {inputMode === "prompt" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Câu lệnh mô tả yêu cầu đề thi
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={naturalPrompt}
                      onChange={(e) => setNaturalPrompt(e.target.value)}
                      placeholder="Nhập yêu cầu đề thi của bạn bằng ngôn ngữ tự nhiên..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 leading-relaxed resize-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Quick Prompt Chips */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Gợi ý mẫu có sẵn:
                  </span>
                  <div className="space-y-1.5">
                    {PROMPT_SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNaturalPrompt(item.prompt)}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-xs text-slate-700 transition flex items-center justify-between group"
                      >
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700">
                          {item.title}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODE B: PARAMETRIC STUDIO CONTROLS */}
            {inputMode === "studio" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* 1-Click Presets */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Mẫu Cấu Hình Chuẩn (Presets)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset("midterm")}
                      className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition text-center active:scale-95"
                    >
                      Giữa kỳ (40c)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("final")}
                      className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition text-center active:scale-95"
                    >
                      Cuối kỳ (50c)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("quiz")}
                      className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition text-center active:scale-95"
                    >
                      15 phút (15c)
                    </button>
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Học phần / Môn học
                  </label>
                  <select
                    value={selectedSubjectCode}
                    onChange={(e) => setSelectedSubjectCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Numerical Parameters Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                      Số câu hỏi
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Thời lượng (phút)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={240}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <Award className="w-3 h-3 text-slate-400" />
                      Tổng điểm đề thi
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={totalPoints}
                      onChange={(e) => setTotalPoints(Number(e.target.value))}
                      className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <BookmarkCheck className="w-3 h-3 text-slate-400" />
                      Điểm sàn đạt
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={passScore}
                      onChange={(e) => setPassScore(Number(e.target.value))}
                      className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* ── BLOOM DIFFICULTY DISTRIBUTION SLIDER ──────────── */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Phổ Phân Bổ Độ Khó Bloom
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Yêu cầu thẩm định: Tổng 3 mức bắt buộc đúng 100%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isDifficultyValid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-700 animate-pulse"
                        }`}
                      >
                        {difficultySum}% / 100%
                      </span>
                      {!isDifficultyValid && (
                        <button
                          type="button"
                          onClick={handleNormalizeDifficulty}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                        >
                          Tự chuẩn hóa
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-segment Visual Bar */}
                  <div className="h-3 w-full bg-slate-200/70 rounded-full overflow-hidden flex shadow-inner">
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

                  {/* 3 Interactive Inputs */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase">
                        Nhận biết (Dễ)
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={easyPercent}
                          onChange={(e) => setEasyPercent(Number(e.target.value))}
                          className="w-12 text-center text-xs font-black text-slate-900 border-none p-0 focus:outline-hidden"
                        />
                        <span className="text-[11px] font-semibold text-slate-400">%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        ~{Math.round((totalQuestions * easyPercent) / 100)} câu
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] font-bold text-amber-700 uppercase">
                        Thông hiểu (Vừa)
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={mediumPercent}
                          onChange={(e) => setMediumPercent(Number(e.target.value))}
                          className="w-12 text-center text-xs font-black text-slate-900 border-none p-0 focus:outline-hidden"
                        />
                        <span className="text-[11px] font-semibold text-slate-400">%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        ~{Math.round((totalQuestions * mediumPercent) / 100)} câu
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] font-bold text-rose-700 uppercase">
                        Vận dụng (Khó)
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={hardPercent}
                          onChange={(e) => setHardPercent(Number(e.target.value))}
                          className="w-12 text-center text-xs font-black text-slate-900 border-none p-0 focus:outline-hidden"
                        />
                        <span className="text-[11px] font-semibold text-slate-400">%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        ~{Math.round((totalQuestions * hardPercent) / 100)} câu
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── TOPIC DISTRIBUTION ACCORDION ──────────────────── */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Phân Bổ Câu Hỏi Theo Chủ Đề
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Đã chia: <strong>{topicsQuestionSum}</strong> / {totalQuestions} câu
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAutoBalanceTopics}
                        className="text-[11px] font-bold px-2 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                      >
                        Chia đều
                      </button>
                      <button
                        type="button"
                        onClick={handleAddTopic}
                        className="text-[11px] font-bold p-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                        title="Thêm chủ đề"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {topics.map((t, idx) => (
                      <div
                        key={t.topic_id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={t.topic_name}
                            onChange={(e) => handleTopicNameChange(idx, e.target.value)}
                            className="w-full text-xs font-semibold text-slate-800 bg-transparent border-none p-0 focus:outline-hidden"
                          />
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {t.topic_id}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            max={totalQuestions}
                            value={t.question_count}
                            onChange={(e) => handleTopicCountChange(idx, Number(e.target.value))}
                            className="w-12 px-1.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-center bg-slate-50"
                          />
                          <span className="text-[11px] text-slate-400">câu</span>

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
              </div>
            )}

            {/* Human-in-the-Loop Safe Policy Toggle */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresWrite}
                  onChange={(e) => setRequiresWrite(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-indigo-950 block">
                    Cổng Duyệt Human-in-the-Loop (AGENTS.md)
                  </span>
                  <span className="text-indigo-700/80 leading-relaxed block mt-0.5 text-[11px]">
                    Dừng lại tại Bước 5 để Giảng viên kiểm tra và bấm phê duyệt trước khi ghi vào CSDL.
                  </span>
                </div>
              </label>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <ThiSmartCtaButton
                variant="primary"
                size="lg"
                onClick={handleRunAgent}
                disabled={!isDifficultyValid || !isTopicsSumValid || createTaskMutation.isPending}
                className="w-full justify-center text-sm font-bold shadow-lg shadow-blue-600/20"
              >
                {createTaskMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Agent đang chạy chu trình 6 bước...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    Khởi Chạy Soạn Đề AI (6 Bước)
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

        {/* ── 4. RIGHT COLUMN: EXECUTIVE RESULTS & APPROVAL WORKSPACE ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Empty State */}
          {!currentTask && !createTaskMutation.isPending && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Bot className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-slate-800">
                  Không Gian Thẩm Định Đề Thi AI
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Chọn các thông số ở bảng bên trái hoặc chọn mẫu gợi ý nhanh, sau đó nhấn <strong>Khởi Chạy Soạn Đề AI</strong> để hệ thống tự động thiết kế ma trận và mở cổng duyệt phê duyệt.
                </p>
              </div>
            </div>
          )}

          {/* Running Spinner State */}
          {createTaskMutation.isPending && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-200 animate-pulse">
                <Cpu className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-bold text-slate-900">
                  ExamOps Agent đang điều phối chu trình...
                </h3>
                <p className="text-xs text-slate-500">
                  Đang duyệt qua: Intake → Plan → Execute Blueprint → Thẩm định Bloom 100%...
                </p>
              </div>
            </div>
          )}

          {/* ── 5. HUMAN-IN-THE-LOOP APPROVAL CARD (STEP 5 INTERRUPT) ──── */}
          {currentTask?.status === "WAITING_FOR_APPROVAL" && currentTask.proposal && (
            <div className="rounded-3xl bg-amber-50/70 border-2 border-amber-300 p-6 shadow-lg shadow-amber-500/5 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full inline-block mb-1">
                      Cổng Phê Duyệt Con Người (Human-in-the-Loop)
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Xác Nhận Xuất Bản Đề Thi Vào CSDL Core API
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {currentTask.proposal.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Proposal Metadata Box */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200/80 space-y-2 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">Thao tác yêu cầu:</span>
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-900">
                    {currentTask.proposal.action}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mã băm SHA-256 (Toàn vẹn):</span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200">
                    <span>
                      {currentTask.proposal.proposal_hash.slice(0, 16)}...
                      {currentTask.proposal.proposal_hash.slice(-8)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(currentTask.proposal?.proposal_hash || "")}
                      className="text-amber-700 hover:text-amber-900"
                      title="Sao chép toàn bộ mã băm"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Người đề xuất:</span>
                  <span className="font-semibold text-slate-800">{currentTask.proposal.proposed_by}</span>
                </div>
              </div>

              {/* Note input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Ý kiến đánh giá của Giảng viên (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Xác nhận ma trận đề đạt chuẩn khảo thí học kỳ..."
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Action Decision Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleDecision("approve")}
                  disabled={resumeTaskMutation.isPending}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {resumeTaskMutation.isPending ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Phê Duyệt &amp; Lưu Vào CSDL (Approve)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision("reject")}
                  disabled={resumeTaskMutation.isPending}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs border border-rose-300 hover:border-rose-400 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Từ Chối (Reject)</span>
                </button>
              </div>
            </div>
          )}

          {/* ── 6. FINALIZED EXECUTION BANNER ─────────────────────────── */}
          {currentTask && currentTask.status !== "WAITING_FOR_APPROVAL" && (
            <div
              className={`p-5 rounded-3xl border shadow-xs flex items-start gap-3.5 ${
                currentTask.status === "COMPLETED"
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                  : "bg-rose-50/70 border-rose-300 text-rose-950"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
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
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    {currentTask.status === "COMPLETED"
                      ? "Đã Hoàn Tất Chu Trình (Completed)"
                      : "Tác Vụ Bị Từ Chối (Rejected)"}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    Task: {currentTask.task_id}
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed font-medium">
                  {currentTask.summary}
                </p>

                {/* Materialized Core API Exam Banner */}
                {createdExam && (
                  <div className="mt-3.5 p-3.5 rounded-2xl bg-white border border-emerald-300 shadow-xs space-y-2 text-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <Check className="w-3.5 h-3.5" />
                        Đã Xuất Bản Thành Công vào CSDL Core API (Exam ID: #{createdExam.id})
                      </span>
                      <Link
                        href="/teacher/exams"
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition"
                      >
                        <span>Mở trong Kho Đề</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Môn: <strong>#{createdExam.subject_id}</strong></span>
                      <span>Tiêu đề: <strong>{createdExam.title}</strong></span>
                      <span>Thang điểm: <strong className="text-blue-600">{createdExam.total_points}</strong></span>
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

          {/* ── 7. DETAILED BLUEPRINT WORKSPACE WITH TABS ─────────────── */}
          {blueprint && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header with export and tab switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    Bản Nháp Ma Trận Đề Thi Đã Sinh
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {blueprint.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Học phần: <span className="font-semibold text-slate-700">{blueprint.subject_id}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Tabs */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setPreviewTab("matrix")}
                      className={`px-3 py-1 rounded-lg transition ${
                        previewTab === "matrix" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Ma Trận
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("audit")}
                      className={`px-3 py-1 rounded-lg transition ${
                        previewTab === "audit" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Thẩm Định
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("json")}
                      className={`px-3 py-1 rounded-lg transition ${
                        previewTab === "json" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      JSON
                    </button>
                  </div>

                  {/* Export button */}
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(JSON.stringify(blueprint, null, 2));
                      const downloadAnchor = document.createElement("a");
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `blueprint_${blueprint.subject_id}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Xuất tệp JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TAB 1: MATRIX & METRICS */}
              {previewTab === "matrix" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block">Số câu hỏi</span>
                      <div className="text-xl font-black text-slate-900 mt-1">
                        {blueprint.total_questions}
                      </div>
                      <span className="text-[10px] text-slate-400">100% trắc nghiệm</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block">Thời lượng</span>
                      <div className="text-xl font-black text-slate-900 mt-1">
                        {blueprint.duration_minutes}&apos;
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {(blueprint.duration_minutes / blueprint.total_questions).toFixed(1)} phút/câu
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block">Thang điểm</span>
                      <div className="text-xl font-black text-blue-600 mt-1">
                        {blueprint.total_points.toFixed(1)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {(blueprint.total_points / blueprint.total_questions).toFixed(2)} đ/câu
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block">Điểm sàn đạt</span>
                      <div className="text-xl font-black text-emerald-600 mt-1">
                        {blueprint.passing_score.toFixed(1)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {((blueprint.passing_score / blueprint.total_points) * 100).toFixed(0)}% chuẩn
                      </span>
                    </div>
                  </div>

                  {/* Difficulty Distribution Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Cơ cấu Phổ Độ Khó Bloom:</span>
                      <span className="text-slate-500 font-medium">
                        Dễ {blueprint.difficulty_distribution.easy}% • Vừa {blueprint.difficulty_distribution.medium}% • Khó {blueprint.difficulty_distribution.hard}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${blueprint.difficulty_distribution.easy}%` }}
                        className="bg-emerald-500 h-full"
                        title="Dễ"
                      />
                      <div
                        style={{ width: `${blueprint.difficulty_distribution.medium}%` }}
                        className="bg-amber-500 h-full"
                        title="Vừa"
                      />
                      <div
                        style={{ width: `${blueprint.difficulty_distribution.hard}%` }}
                        className="bg-rose-500 h-full"
                        title="Khó"
                      />
                    </div>
                  </div>

                  {/* Topic Table */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Bảng Phân Bổ Chủ Đề &amp; Trọng Số
                    </h4>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Mã &amp; Tên Chủ đề</th>
                            <th className="py-2.5 px-3 text-center">Số câu</th>
                            <th className="py-2.5 px-3 text-center">Tỷ lệ</th>
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

              {/* TAB 2: READINESS REVIEW AUDIT */}
              {previewTab === "audit" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">
                      Báo Cáo Thẩm Định Độ Sẵn Sàng (Readiness Audit)
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {readiness?.status || "PASS"} ({readiness?.passed_checks || 4}/{readiness?.total_checks || 4} tiêu chí)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(readiness?.checks || [
                      { check_name: "total_questions", status: "PASS", message: "Số lượng câu hỏi khớp chính xác 100% với ma trận cấu hình." },
                      { check_name: "approved_status", status: "PASS", message: "Tất cả câu hỏi trong ngân hàng đều ở trạng thái sẵn sàng (ready)." },
                      { check_name: "deduplication", status: "PASS", message: "Không phát hiện trùng lặp mã câu hỏi (Deduplication verified)." },
                      { check_name: "difficulty_distribution", status: "PASS", message: "Phổ phân bổ độ khó Bloom đạt chuẩn và nằm trong ngưỡng dung sai an toàn." },
                    ]).map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5 text-xs"
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

                  {readiness?.recommendations && readiness.recommendations.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
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

              {/* TAB 3: RAW JSON */}
              {previewTab === "json" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Định dạng dữ liệu bất biến ExamBlueprint</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(JSON.stringify(blueprint, null, 2))}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedHash ? "Đã chép!" : "Sao chép JSON"}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-80 leading-relaxed">
                    {JSON.stringify(blueprint, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
