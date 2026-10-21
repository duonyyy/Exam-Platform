"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  FileSpreadsheet,
  Timer,
  Cloud,
  Eye,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shuffle,
  ShieldAlert,
  Layers,
  HelpCircle,
  FileText,
  Sliders,
} from "lucide-react";

export function FeaturesSection() {
  const [activeQuestionFormat, setActiveQuestionFormat] = useState<
    "single_choice" | "multiple_choice" | "true_false" | "short_answer"
  >("single_choice");

  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Năng Lực Cốt Lõi Của Nền Tảng</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bộ công cụ khảo thí số toàn diện, thiết kế có chiều sâu
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Không chỉ là bảng điều khiển đơn thuần, ThiSmart giải quyết trọn vẹn từng khâu từ ngân hàng câu hỏi, tạo đề, tổ chức thi đến bảo mật và thống kê học thuật.
          </p>
        </div>

        {/* Asymmetric Bento Grid for 6 Feature Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* GROUP 1: Ngân hàng câu hỏi (Span 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  JSONB Schema Ready
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                1. Ngân hàng câu hỏi phân tầng học thuật
              </h3>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                Tổ chức cây tri thức theo Môn học (`Subject`) và Chủ đề (`Topic`). Hỗ trợ 4 định dạng câu hỏi chuẩn hóa lưu trữ dưới dạng JSONB hiệu năng cao, quản lý trạng thái vòng đời câu hỏi (`ready`, `disabled`).
              </p>

              {/* Interactive Format Switcher */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 mr-1">4 Định dạng:</span>
                  {[
                    { key: "single_choice", label: "Một đáp án (Single)" },
                    { key: "multiple_choice", label: "Nhiều đáp án (Multi)" },
                    { key: "true_false", label: "Đúng / Sai" },
                    { key: "short_answer", label: "Điền ngắn (Text)" },
                  ].map((fmt) => (
                    <button
                      key={fmt.key}
                      type="button"
                      onClick={() => setActiveQuestionFormat(fmt.key as any)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                        activeQuestionFormat === fmt.key
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5 font-mono">
                  {activeQuestionFormat === "single_choice" && (
                    <>
                      <div className="text-blue-600 font-semibold">{"// Trắc nghiệm 1 đáp án đúng (Radio)"}</div>
                      <div className="text-slate-700 font-sans">
                        &quot;Phương thức HTTP nào an toàn (Safe) và Idempotent?&quot;
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Options: [A: GET (Đúng), B: POST, C: DELETE, D: PATCH]
                      </div>
                    </>
                  )}
                  {activeQuestionFormat === "multiple_choice" && (
                    <>
                      <div className="text-cyan-600 font-semibold">{"// Trắc nghiệm chọn nhiều đáp án (Checkbox)"}</div>
                      <div className="text-slate-700 font-sans">
                        &quot;Những tính chất nào thuộc chuẩn ACID trong PostgreSQL?&quot;
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Options: [A: Atomicity, B: Consistency, C: Isolation, D: Durability]
                      </div>
                    </>
                  )}
                  {activeQuestionFormat === "true_false" && (
                    <>
                      <div className="text-emerald-600 font-semibold">{"// Câu hỏi nhị phân Đúng / Sai"}</div>
                      <div className="text-slate-700 font-sans">
                        &quot;Laravel Form Request tự động chặn request không hợp lệ với mã 422?&quot;
                      </div>
                      <div className="text-slate-500 text-[11px]">Đáp án: Đúng (True)</div>
                    </>
                  )}
                  {activeQuestionFormat === "short_answer" && (
                    <>
                      <div className="text-purple-600 font-semibold">{"// Câu hỏi trả lời ngắn (Chuỗi ký tự)"}</div>
                      <div className="text-slate-700 font-sans">
                        &quot;Tên phương thức khóa dòng bi quan trong Laravel Eloquent là gì?&quot;
                      </div>
                      <div className="text-slate-500 text-[11px]">Đáp án đối soát: lockForUpdate</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Chỉ câu hỏi trạng thái `ready` mới được gán vào đề thi.</span>
              <span className="font-semibold text-slate-700">Chống sửa câu hỏi khi ca đang thi</span>
            </div>
          </div>

          {/* GROUP 2: Xây dựng & Quản lý Đề thi (Span 5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  Exam Blueprint
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                2. Soạn đề &amp; Quản lý ma trận thi
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Đề thi mẫu (`Exam`) được thiết kế độc lập với ca thi thực tế. Giảng viên cấu hình ma trận điểm, thời lượng làm bài và cơ chế xáo trộn.
              </p>

              <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Thời lượng làm bài:</span>
                  <span className="font-bold text-slate-900">45 – 90 phút (Linh hoạt)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Điểm sàn đạt yêu cầu:</span>
                  <span className="font-bold text-emerald-700">5.0 / 10.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Cơ chế xáo trộn (Shuffle):</span>
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Xáo thứ tự câu &amp; phương án</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Bảng liên kết:</span>
                  <span className="font-mono text-slate-700">exam_questions(order, points)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Đề thi tái sử dụng được cho nhiều ca thi</span>
              <span className="font-semibold text-indigo-600">Tự động tính thang điểm</span>
            </div>
          </div>

          {/* GROUP 3: Focus Exam Room (Span 6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Timer className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300">
                  Zero Distraction
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                3. Phòng thi tập trung (Focus Exam Room)
              </h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Thiết kế loại bỏ 100% thanh điều hướng bên ngoài, liên kết mạng xã hội hoặc menu hệ thống gây xao nhãng. Chế độ toàn màn hình tối ưu sự tập trung của thí sinh vào bài làm.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-400">Layout độc lập</div>
                  <div className="text-white font-semibold mt-1">Ẩn Sidebar &amp; TopBar</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-400">Bảo vệ phiên thi</div>
                  <div className="text-cyan-300 font-semibold mt-1">F5 khôi phục nguyên vẹn</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Đạt tiêu chuẩn trải nghiệm yên tĩnh</span>
              <Link href="/exam/demo" className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1">
                <span>Vào phòng demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* GROUP 4: Tự động lưu đáp án (Span 6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  500ms Debounce
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                4. Tự động lưu đáp án an toàn tuyệt đối
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Thí sinh không cần bấm &quot;Lưu&quot; thủ công từng câu. Mọi thao tác chọn lựa được gửi ngầm với cơ chế Idempotent Upsert trên cặp khóa `attempt_id + question_id`.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Không nhân bản bản ghi dù mạng giật lag hoặc bấm liên tục.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hàng đợi offline tự động retry khi kết nối được phục hồi.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Độ trễ phản hồi dưới 100ms</span>
              <span className="font-semibold text-emerald-600">Không mất bài làm</span>
            </div>
          </div>

          {/* GROUP 5: Giám sát kỳ thi (Span 6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700">
                  Telemetry Logger
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                5. Giám sát sự kiện trình duyệt khách quan
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Hệ thống thu thập các tín hiệu hành vi trình duyệt như rời tab (`visibilitychange`), thoát toàn màn hình (`fullscreen_exit`), mất tiêu điểm (`blur`) để lưu vào nhật ký giám sát (`proctoring_events`).
              </p>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px]">
                <div className="text-slate-400">{"// Nhật ký cảm biến mẫu"}</div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400">[10:15:02] tab_hidden</span>
                  <span className="text-slate-500">duration: 4.2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400">[10:18:40] fullscreen_exit</span>
                  <span className="text-slate-500">severity: medium</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hỗ trợ cán bộ coi thi hậu kiểm</span>
              <span className="font-semibold text-cyan-700">Bằng chứng khách quan</span>
            </div>
          </div>

          {/* GROUP 6: Kết quả & Phân tích (Span 6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  Automated Scorer
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                6. Chấm tự động &amp; Phân tích phổ điểm
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Bộ thuật toán `AttemptScorer` độc lập tính điểm tự động ngay khi nộp bài. Cung cấp báo cáo phổ điểm trực quan, tỷ lệ đạt/trượt và độ phân biệt của từng câu hỏi.
              </p>

              {/* Mini visual distribution chart preview */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-end justify-between h-14 gap-1.5 px-2 pt-2">
                  {[
                    { label: "0-2", h: "15%", bg: "bg-red-400" },
                    { label: "2-4", h: "25%", bg: "bg-amber-400" },
                    { label: "4-6", h: "60%", bg: "bg-blue-400" },
                    { label: "6-8", h: "85%", bg: "bg-blue-600" },
                    { label: "8-10", h: "45%", bg: "bg-emerald-500" },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-full rounded-t ${bar.bg}`} style={{ height: bar.h }} />
                      <span className="text-[10px] text-slate-500 font-mono">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Bảo vệ điểm số bằng khóa bi quan</span>
              <span className="font-semibold text-purple-600">Thống kê chuẩn học thuật</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
