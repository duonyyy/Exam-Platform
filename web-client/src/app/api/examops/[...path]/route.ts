import { NextRequest, NextResponse } from "next/server";

// Default URL for ExamOps FastAPI Agent
const EXAMOPS_BASE_URL = process.env.INTERNAL_EXAMOPS_URL || "http://127.0.0.1:8001";
const EXAMOPS_API_KEY = process.env.EXAMOPS_API_KEY || "test-agent-key";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

// In-memory simulation store for graceful offline dev when Python agent service is not running
const simulatedTasks = new Map<string, any>();

export async function GET(request: NextRequest, context: RouteContext) {
  return handleProxyOrFallback(request, context, "GET");
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleProxyOrFallback(request, context, "POST");
}

async function handleProxyOrFallback(
  request: NextRequest,
  context: RouteContext,
  method: "GET" | "POST"
) {
  const { path } = await context.params;
  const subPath = path.join("/");
  const search = request.nextUrl.search;
  const targetUrl = `${EXAMOPS_BASE_URL}/${subPath}${search}`;

  let bodyText: string | null = null;
  let parsedBody: any = null;

  if (method === "POST") {
    bodyText = await request.text();
    try {
      parsedBody = JSON.parse(bodyText);
    } catch {
      parsedBody = null;
    }
  }

  // 1. Attempt to call live Python FastAPI ExamOps Service
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for LLM graph processing

    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-API-Key": EXAMOPS_API_KEY,
    };
    if (bodyText) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: bodyText || undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "X-ExamOps-Mode": "live",
      },
    });
  } catch (error) {
    // 2. Python agent is offline -> Fallback to intelligent deterministic simulator
    console.info(`[ExamOps Proxy] Live agent unreachable at ${EXAMOPS_BASE_URL}. Using high-fidelity deterministic simulator.`);
    return handleSimulatedResponse(subPath, method, parsedBody);
  }
}

/**
 * Intelligent deterministic simulation of ExamOps Agent 6-Step Loop
 * Mirrors: agentic-system/src/examops/
 */
function handleSimulatedResponse(subPath: string, method: string, body: any) {
  // 1. Health check
  if (subPath === "health") {
    return NextResponse.json({
      status: "healthy",
      version: "0.1.0",
      environment: "local-simulated",
      model_provider: "mock-deterministic",
      mode: "simulated",
    });
  }

  // 2. Create Task: POST /api/v1/tasks
  if (subPath === "api/v1/tasks" && method === "POST") {
    const goal = body?.goal || "Thiết kế ma trận đề thi";
    const subject = body?.subject || "CS101";
    const constraints = body?.constraints || {};
    const threadId = body?.thread_id || `thread_${Math.random().toString(36).substring(2, 11)}`;
    const taskId = `task_${Math.random().toString(36).substring(2, 10)}`;

    const totalQuestions = Number(constraints.total_questions) || 40;
    const durationMinutes = Number(constraints.duration_minutes) || 60;
    const passScore = Number(constraints.pass_score ?? constraints.passing_score) || 5.0;
    const totalPoints = Number(constraints.total_points) || 10.0;
    const diff = constraints.difficulty_distribution || { easy: 40, medium: 40, hard: 20 };
    const topics = constraints.topics && constraints.topics.length > 0
      ? constraints.topics
      : [
          { topic_id: "TOPIC_01", topic_name: "Kiến trúc RESTful API & HTTP Methods", question_count: Math.round(totalQuestions * 0.35) },
          { topic_id: "TOPIC_02", topic_name: "Cơ sở Dữ liệu & Khóa bi quan Concurrency", question_count: Math.round(totalQuestions * 0.35) },
          { topic_id: "TOPIC_03", topic_name: "An ninh API & Chống IDOR/OWASP Top 10", question_count: totalQuestions - Math.round(totalQuestions * 0.7) },
        ];

    const blueprint = {
      title: constraints.title || `Ma trận Đề thi Mẫu ${subject}`,
      subject_id: subject,
      duration_minutes: durationMinutes,
      total_questions: totalQuestions,
      total_points: totalPoints,
      passing_score: passScore,
      difficulty_distribution: {
        easy: Number(diff.easy) || 40,
        medium: Number(diff.medium) || 40,
        hard: Number(diff.hard) || 20,
      },
      topic_distribution: topics,
    };

    const readinessReview = {
      status: "PASS",
      total_checks: 5,
      passed_checks: 5,
      failed_checks: 0,
      checks: [
        { check_name: "check_total_questions", status: "PASS", message: `Tổng số câu hỏi khớp chính xác: ${totalQuestions} câu.` },
        { check_name: "check_difficulty_sum", status: "PASS", message: `Phân bổ độ khó đạt chuẩn 100%: Dễ ${blueprint.difficulty_distribution.easy}%, Vừa ${blueprint.difficulty_distribution.medium}%, Khó ${blueprint.difficulty_distribution.hard}%.` },
        { check_name: "check_topic_coverage", status: "PASS", message: `Bao phủ đầy đủ ${topics.length} chủ đề trọng tâm của học phần.` },
        { check_name: "check_points_integrity", status: "PASS", message: `Thang điểm chuẩn mực: Tổng ${totalPoints} điểm, Điểm sàn đạt ${passScore} điểm.` },
        { check_name: "check_duration_feasibility", status: "PASS", message: `Thời lượng ${durationMinutes} phút đảm bảo trung bình ${(durationMinutes / totalQuestions).toFixed(1)} phút/câu.` },
      ],
      violations: [],
      recommendations: [
        "Nên bổ sung ít nhất 10 câu hỏi dự phòng vào ngân hàng đề trước khi xuất bản ca thi chính thức.",
      ],
    };

    const requiresWrite = constraints.requires_write === true || goal.toLowerCase().includes("lưu") || goal.toLowerCase().includes("ghi") || goal.toLowerCase().includes("tạo đề");

    let status = "COMPLETED";
    let summary = `Đã phân tích và thiết lập thành công Ma trận Đề thi cho môn học ${subject}.`;
    let proposal = null;

    if (requiresWrite) {
      status = "WAITING_FOR_APPROVAL";
      summary = `Đã thiết kế xong bản nháp đề thi. Đang tạm dừng tại Cổng Duyệt Human-in-the-Loop để chờ Giảng viên phê duyệt ghi vào hệ thống Exam Platform.`;
      proposal = {
        action: "write_exam_blueprint",
        arguments: {
          subject_id: subject,
          exam_title: blueprint.title,
          total_questions: totalQuestions,
          duration_minutes: durationMinutes,
          total_points: totalPoints,
          pass_score: passScore,
        },
        proposal_hash: require("crypto")
          .createHash("sha256")
          .update(JSON.stringify({ subject, title: blueprint.title, totalQuestions, durationMinutes }))
          .digest("hex"),
        proposed_by: "ExamOps-Agent-v0.1.0",
        reason: `Giảng viên đã yêu cầu ghi đề thi vào Exam Platform. Theo Hiến pháp AGENTS.md, thao tác ghi vào SoR bắt buộc phải có sự phê duyệt của Giảng viên.`,
      };
    }

    const taskData = {
      task_id: taskId,
      thread_id: threadId,
      status,
      summary,
      result: {
        blueprint,
        readiness_review: readinessReview,
        verification: {
          is_valid: true,
          checks_passed: ["schema_valid", "math_sum_100", "duration_positive", "points_positive"],
          checks_failed: [],
          is_terminal: !requiresWrite,
        },
      },
      proposal,
      errors: [],
    };

    simulatedTasks.set(threadId, taskData);

    return NextResponse.json(taskData, {
      status: 201,
      headers: { "X-ExamOps-Mode": "simulated" },
    });
  }

  // 3. Resume Task: POST /api/v1/tasks/{thread_id}/resume
  const resumeMatch = subPath.match(/^api\/v1\/tasks\/([^/]+)\/resume$/);
  if (resumeMatch && method === "POST") {
    const threadId = resumeMatch[1];
    const decision = body?.decision;
    const actor = body?.actor;

    const task = simulatedTasks.get(threadId);
    if (!task) {
      return NextResponse.json({ message: `Không tìm thấy tác vụ với thread_id ${threadId}` }, { status: 404 });
    }

    if (decision === "approve") {
      task.status = "COMPLETED";
      task.summary = `Phê duyệt thành công! Đề thi "${task.result?.blueprint?.title || "Mẫu"}" đã được Giảng viên (${actor?.actor_id || "Teacher"}) xác nhận ghi vào Hệ thống Khảo thí Exam Platform.`;
      task.proposal = null;
    } else {
      task.status = "REJECTED";
      task.summary = `Giảng viên đã từ chối phê duyệt ghi đề thi vào hệ thống. Tác vụ đã kết thúc ở trạng thái REJECTED.`;
      task.proposal = null;
    }

    simulatedTasks.set(threadId, task);

    return NextResponse.json(task, {
      status: 200,
      headers: { "X-ExamOps-Mode": "simulated" },
    });
  }

  // 4. Get Task: GET /api/v1/tasks/{thread_id}
  const getMatch = subPath.match(/^api\/v1\/tasks\/([^/]+)$/);
  if (getMatch && method === "GET") {
    const threadId = getMatch[1];
    const task = simulatedTasks.get(threadId);
    if (!task) {
      return NextResponse.json({ message: `Không tìm thấy tác vụ với thread_id ${threadId}` }, { status: 404 });
    }
    return NextResponse.json(task, {
      status: 200,
      headers: { "X-ExamOps-Mode": "simulated" },
    });
  }

  return NextResponse.json({ message: "Not found in simulated engine" }, { status: 404 });
}
