"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Timer,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  Clock,
  Cloud,
  AlertTriangle,
  RotateCcw,
  Layers,
  Lock,
} from "lucide-react";

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<
    "clock" | "navigator" | "autosave" | "submit"
  >("clock");

  const tabs = [
    {
      id: "clock" as const,
      label: "Đồng hồ máy chủ",
      icon: Clock,
      tag: "Server-Authoritative",
    },
    {
      id: "navigator" as const,
      label: "Question Navigator",
      icon: Layers,
      tag: "4 Trạng thái",
    },
    {
      id: "autosave" as const,
      label: "Tự động lưu 500ms",
      icon: Cloud,
      tag: "Idempotent Upsert",
    },
    {
      id: "submit" as const,
      label: "Quy trình nộp bài",
      icon: Send,
      tag: "Khóa bi quan",
    },
  ];

  return (
    <section id="showcase" className="py-16 md:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Phòng Thi Focus Mode</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trải nghiệm làm bài tập trung cao độ, an toàn tuyệt đối
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            ThiSmart loại bỏ mọi yếu tố gây xao nhãng của trình duyệt thông thường, cung cấp môi trường làm bài mượt mà, đồng bộ và bảo vệ bài thi của thí sinh trong từng giây.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-200" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Showcase Feature Container */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-10 shadow-sm">
          {/* Tab 1: Server Clock */}
          {activeTab === "clock" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Server-Authoritative Clock Synchronization</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Đồng hồ đếm ngược đồng bộ máy chủ — Triệt tiêu gian lận tua giờ
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Thay vì dựa vào đồng hồ hệ điều hành client (vốn có thể bị chỉnh sửa hoặc lag), hạn chót nộp bài được tính toán trực tiếp trên máy chủ backend:
                  <code className="block my-2 p-2.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs">
                    deadline = min(started_at + duration_minutes, session.end_at)
                  </code>
                  Client chỉ đảm nhận việc render đếm ngược hiển thị bằng font chữ có bề rộng cố định (tabular numbers). Khi hết giờ trên server, bài thi được tự động khóa nộp.
                </p>
                <ul className="space-y-2 text-sm text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Font số `tabular-nums` tránh hiện tượng co giật layout mỗi giây.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cảnh báo chuyển màu vàng/đỏ khi thời gian làm bài dưới 5 phút.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Độ trễ mạng được bù trừ buffer an toàn 15 giây theo chuẩn AGENTS.md.</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6">
                <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                      Client Clock vs Server Authority
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      In Sync (±0.02s)
                    </span>
                  </div>

                  <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <div className="text-xs text-slate-400 mb-1">Thời gian còn lại</div>
                    <div className="text-4xl sm:text-5xl font-mono font-bold tracking-widest text-cyan-400 tabular-nums">
                      00:44:59
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Thời hạn chót ca thi: 10:30:00 UTC+7 (Máy chủ xác nhận)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <div className="text-slate-400">Thời lượng ca thi</div>
                      <div className="text-slate-200 font-bold mt-0.5">45 phút</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <div className="text-slate-400">Trạng thái tự động nộp</div>
                      <div className="text-emerald-400 font-bold mt-0.5">Kích hoạt khi chạm 00:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Question Navigator */}
          {activeTab === "navigator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-800">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Interactive Question Navigator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Bảng điều hướng thông minh — Quản lý 40+ câu hỏi trong nháy mắt
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Thí sinh không bao giờ bị bỏ sót câu hỏi. Bảng điều hướng dạng lưới phân biệt rõ ràng 4 trạng thái thị giác theo chuẩn WCAG 2.2 AA (không chỉ dựa vào màu sắc mà có viền và nhãn trợ năng):
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2 font-semibold text-xs text-emerald-800 mb-1">
                      <span className="w-3 h-3 rounded-md bg-emerald-500" />
                      <span>Đã làm &amp; Đã lưu</span>
                    </div>
                    <p className="text-xs text-slate-500">Đáp án đã được server xác nhận qua Idempotent Upsert.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2 font-semibold text-xs text-blue-700 mb-1">
                      <span className="w-3 h-3 rounded-md bg-blue-600 ring-2 ring-blue-300" />
                      <span>Đang chọn hiện tại</span>
                    </div>
                    <p className="text-xs text-slate-500">Câu hỏi thí sinh đang đọc và thao tác trên màn hình.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2 font-semibold text-xs text-amber-800 mb-1">
                      <span className="w-3 h-3 rounded-md bg-amber-500" />
                      <span>Đánh dấu xem lại</span>
                    </div>
                    <p className="text-xs text-slate-500">Thí sinh ghim lại câu phân vân để kiểm tra trước khi nộp.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-600 mb-1">
                      <span className="w-3 h-3 rounded-md bg-slate-200" />
                      <span>Chưa trả lời</span>
                    </div>
                    <p className="text-xs text-slate-500">Dễ dàng quét và click nhảy thẳng đến câu chưa làm.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <span className="text-sm font-bold text-slate-800">Danh Sách Câu Hỏi (40 Câu)</span>
                  <span className="text-xs text-slate-500">Tiến độ: 28/40 (70%)</span>
                </div>

                <div className="grid grid-cols-8 gap-2">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const num = i + 1;
                    let style = "bg-slate-100 text-slate-600 border-slate-200";
                    if (num === 14) {
                      style = "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 font-bold";
                    } else if ([3, 9, 21].includes(num)) {
                      style = "bg-amber-100 text-amber-800 border-amber-300 font-bold";
                    } else if (num < 28) {
                      style = "bg-emerald-100 text-emerald-800 border-emerald-300 font-medium";
                    }

                    return (
                      <div
                        key={num}
                        className={`h-8 sm:h-9 rounded-lg border text-xs flex items-center justify-center ${style}`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>Nhấn phím số hoặc click trực tiếp để chuyển nhanh.</span>
                  <span className="font-semibold text-blue-600">Hỗ trợ phím tắt A-D</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Autosave */}
          {activeTab === "autosave" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Debounced Autosave (500ms) &amp; Idempotent Upsert</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Lưu nháp tức thời — Không sợ mất bài khi sập nguồn hay mất điện
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Mỗi hành động chọn đáp án được kích hoạt tự động với cơ chế hoãn nhịp (Debounce 500ms) để tối ưu lưu lượng mạng. Backend thực thi lệnh <strong>Idempotent Upsert</strong> trên cơ sở dữ liệu PostgreSQL 16:
                </p>
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                  <div className="text-slate-400">{"// Idempotent upsert logic"}</div>
                  <div>INSERT INTO attempt_answers (attempt_id, question_id, selected_options)</div>
                  <div>VALUES ($attemptId, $questionId, $options)</div>
                  <div className="text-cyan-400">ON CONFLICT (attempt_id, question_id)</div>
                  <div className="text-cyan-400">DO UPDATE SET selected_options = EXCLUDED.selected_options;</div>
                </div>
                <p className="text-sm text-slate-600">
                  Cho dù thí sinh gửi lại request 10 lần do mạng gián đoạn, dữ liệu vẫn tuyệt đối không bị trùng lặp hay xung đột.
                </p>
              </div>

              <div className="lg:col-span-6 space-y-3">
                {/* Visual states */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Trạng thái: Đã lưu trên máy chủ</div>
                      <div className="text-xs text-slate-500">Mã phản hồi HTTP 200 OK • Thời gian lưu: 10:14:22</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    Đã đồng bộ
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Trạng thái: Đang lưu... (Debouncing)</div>
                      <div className="text-xs text-slate-500">Đang đẩy payload lên POST /api/v1/attempts/answers</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    Đang gửi
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Trạng thái: Tạm lưu cục bộ (Offline retry)</div>
                      <div className="text-xs text-slate-500">Hàng đợi ngầm sẽ tự động thử lại khi có mạng trở lại</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    Chờ mạng
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Submit Flow */}
          {activeTab === "submit" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-100 text-purple-800">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pessimistic Locking in DB Transaction</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Quy trình nộp bài kiểm soát tranh chấp — Khóa bi quan chống double submit
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Khoảnh khắc thí sinh nộp bài là luồng nghiệp vụ sinh tử. Để tránh tình trạng thí sinh bấm nhiều lần (hoặc mạng lag gửi 2 request cùng lúc làm tính điểm trùng lặp), backend Laravel thực thi:
                </p>
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto space-y-1">
                  <div className="text-slate-400">{"// SubmitExamAttemptAction transaction"}</div>
                  <div>DB::transaction(function () use ($attemptId) &#123;</div>
                  <div className="text-cyan-300 pl-4">$attempt = ExamAttempt::where(&apos;id&apos;, $attemptId)</div>
                  <div className="text-amber-300 pl-8">-&gt;lockForUpdate()-&gt;firstOrFail();</div>
                  <div className="text-slate-400 pl-4">{"// Chỉ in_progress mới được tính điểm"}</div>
                  <div className="pl-4">$scorer-&gt;calculate($attempt);</div>
                  <div>&#125;);</div>
                </div>
                <p className="text-sm text-slate-600">
                  Bản ghi được khóa bi quan ngay lập tức. Mọi request nộp bài tiếp theo đều bị chặn với ngoại lệ an toàn, đảm bảo tính điểm chính xác 100%.
                </p>
              </div>

              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-base">Xác nhận nộp bài thi</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                    Ca thi 01
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm flex items-center justify-between">
                    <span className="text-slate-600">Tổng số câu trong đề:</span>
                    <span className="font-bold text-slate-900">40 câu</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex items-center justify-between">
                    <span className="text-emerald-800 font-medium">Đã hoàn thành và lưu:</span>
                    <span className="font-bold text-emerald-800">38 câu</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm flex items-center justify-between">
                    <span className="text-amber-800 font-medium">Còn đánh dấu xem lại:</span>
                    <span className="font-bold text-amber-800">2 câu</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
                  ⚠️ Sau khi xác nhận nộp bài, hệ thống sẽ chốt thời gian và chuyển sang bước chấm điểm tự động. Bạn không thể thay đổi đáp án sau khi đã nộp.
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href="/exam/demo"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm text-center transition shadow-sm"
                  >
                    Trải nghiệm trực tiếp demo
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Link to Exam Demo */}
        <div className="mt-8 text-center">
          <Link
            href="/exam/demo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Mở ngay Phòng Thi Demo để tương tác trực quan toàn bộ tính năng trên</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
