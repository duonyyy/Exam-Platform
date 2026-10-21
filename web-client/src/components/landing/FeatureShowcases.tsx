"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Database,
  BarChart3,
  CheckCircle2,
  Shuffle,
  Sparkles,
  ArrowRight,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { BrandDotPattern } from "@/components/patterns/BrandDotPattern";

export function FeatureShowcases() {
  const [activeQuestionTab, setActiveQuestionTab] = useState<
    "single" | "multi" | "tf" | "short"
  >("single");

  return (
    <section id="features" className="relative py-16 md:py-24 bg-slate-50/70 border-b border-slate-200 overflow-hidden">
      <BrandDotPattern opacity={0.04} color="#2563EB" gap={32} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Năng Lực Khảo Thí Cốt Lõi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Quy trình học thuật chuẩn hóa từ soạn đề đến phân tích
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Được xây dựng phục vụ nhu cầu khảo thí thực tế của các trường đại học, viện đào tạo và tổ chức giáo dục chuyên nghiệp.
          </p>
        </div>

        {/* SHOWCASE 1: Question Bank & Exam Blueprint (With 3D Artwork) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text & Specs (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Ngân Hàng Câu Hỏi &amp; Ma Trận Đề Mẫu</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Quản trị ngân hàng học thuật phân tầng và soạn đề thông minh
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Tổ chức tri thức giảng dạy thành cây Môn học và Chủ đề khoa học. Đề thi mẫu được thiết lập với ma trận điểm, cơ chế xáo trộn câu hỏi và thời lượng linh hoạt, tái sử dụng cho nhiều đợt thi.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">4 Định dạng câu hỏi khảo thí chuẩn mực:</strong>
                  <span>
                    Trắc nghiệm một đáp án, nhiều đáp án, câu hỏi nhị phân Đúng/Sai và câu trả lời điền ngắn.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Cơ chế xáo trộn đa tầng (Shuffle Engine):</strong>
                  <span>
                    Tự động hoán vị thứ tự câu hỏi và thứ tự phương án trả lời đối với từng thí sinh, ngăn chặn nhìn bài chéo trong phòng thi.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Bảo vệ đề thi — Không rò rỉ đáp án:</strong>
                  <span>
                    Dữ liệu đề gửi về client loại bỏ hoàn toàn đáp án đúng và lời giải thích; server là nguồn chân lý duy nhất bảo mật điểm số.
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Question Types Switcher */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-700 mb-2">Xem thử cấu trúc câu hỏi hỗ trợ:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                {[
                  { id: "single", label: "Một đáp án" },
                  { id: "multi", label: "Nhiều đáp án" },
                  { id: "tf", label: "Đúng / Sai" },
                  { id: "short", label: "Điền ngắn" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveQuestionTab(t.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition text-center border ${
                      activeQuestionTab === t.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-sm">
                {activeQuestionTab === "single" && (
                  <>
                    <div className="font-semibold text-slate-800">
                      Trắc nghiệm 1 phương án đúng (Single Choice):
                    </div>
                    <div className="text-slate-600 italic">
                      &quot;Độ phức tạp của thuật toán Quicksort trong trường hợp tốt nhất là gì?&quot;
                    </div>
                    <div className="text-emerald-700 font-medium">✓ Phương án A: O(n log n)</div>
                  </>
                )}
                {activeQuestionTab === "multi" && (
                  <>
                    <div className="font-semibold text-slate-800">
                      Trắc nghiệm chọn nhiều đáp án (Multiple Choice):
                    </div>
                    <div className="text-slate-600 italic">
                      &quot;Những giao thức nào thuộc tầng Ứng dụng (Application Layer)?&quot;
                    </div>
                    <div className="text-emerald-700 font-medium">✓ HTTP, DNS, SMTP</div>
                  </>
                )}
                {activeQuestionTab === "tf" && (
                  <>
                    <div className="font-semibold text-slate-800">Câu hỏi nhị phân Đúng / Sai:</div>
                    <div className="text-slate-600 italic">
                      &quot;Cây nhị phân tìm kiếm luôn đảm bảo khóa bên trái nhỏ hơn nút gốc.&quot;
                    </div>
                    <div className="text-emerald-700 font-medium">✓ Đáp án: Đúng (True)</div>
                  </>
                )}
                {activeQuestionTab === "short" && (
                  <>
                    <div className="font-semibold text-slate-800">Câu hỏi điền đáp án ngắn:</div>
                    <div className="text-slate-600 italic">
                      &quot;Nhập từ khóa xác định tính duy nhất của phần tử trong tập hợp.&quot;
                    </div>
                    <div className="text-emerald-700 font-medium">✓ Khóa so khớp: UNIQUE / SET</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Visual Artwork & Blueprint Card (6 cols) */}
          <div className="lg:col-span-6 relative flex flex-col items-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center">
              <div className="absolute inset-4 bg-gradient-to-tr from-indigo-500/15 via-blue-400/15 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <Image
                src="/brand/illustrations/question-bank-3d.png"
                alt="ThiSmart 3D Question Bank — Ngân hàng câu hỏi và ma trận đề thi"
                width={600}
                height={450}
                priority
                className="w-full h-auto object-contain drop-shadow-2xl select-none transition-transform duration-500 hover:scale-[1.02]"
              />

              {/* Floating Blueprint Meta Badge */}
              <div className="absolute -bottom-2 right-2 sm:right-6 bg-white/95 text-slate-900 p-3.5 rounded-xl border border-slate-200 shadow-xl backdrop-blur-md max-w-xs text-xs space-y-1.5">
                <div className="flex items-center justify-between text-indigo-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Shuffle Engine Active</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600">
                    Auto-Seed
                  </span>
                </div>
                <div className="text-slate-600">
                  Hoán vị ngẫu nhiên thứ tự câu và phương án riêng biệt cho từng thí sinh.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SHOWCASE 2: Objective Telemetry & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual 3D Analytics Artwork & Telemetry (6 cols) */}
          <div className="lg:col-span-6 lg:order-1 relative flex flex-col items-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center">
              <div className="absolute inset-4 bg-gradient-to-tr from-cyan-500/15 via-blue-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

              <Image
                src="/brand/illustrations/grading-analytics-3d.png"
                alt="ThiSmart 3D Grading & Analytics — Báo cáo phổ điểm & phân tích kỳ thi"
                width={600}
                height={450}
                priority
                className="w-full h-auto object-contain drop-shadow-2xl select-none transition-transform duration-500 hover:scale-[1.02]"
              />

              {/* Live Monitoring Telemetry Floating Snippet */}
              <div className="absolute -bottom-3 left-2 sm:left-4 right-2 sm:right-4 bg-slate-900/95 text-slate-200 p-3.5 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md font-mono text-[11px] space-y-1.5">
                <div className="text-slate-400 flex items-center justify-between">
                  <span className="text-cyan-300 font-semibold">{"// Live Telemetry & Proctoring Audit"}</span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active Telemetry</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-cyan-300">[10:14:22] SV20260101: tab_hidden</span>
                  <span className="text-slate-400">thời lượng: 3.8s (Ghi nhận)</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald-300">[10:28:15] SV20260108: attempt_submitted</span>
                  <span className="text-emerald-400 font-bold">Điểm số: 8.75 / 10 (Đạt)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Description (6 cols) */}
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Giám Sát Khách Quan &amp; Báo Cáo Phổ Điểm</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Giám sát ca thi minh bạch, chấm tự động và phân tích phổ điểm tức thời
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              ThiSmart không đưa ra phán quyết cảm tính mà thu thập trung thực các tín hiệu hành vi trình duyệt để phục vụ hội đồng khảo thí hậu kiểm. Ngay khi thí sinh nộp bài, hệ thống chốt an toàn và xuất báo cáo phổ điểm chuẩn học thuật.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Nhật ký sự kiện trình duyệt khách quan:</strong>
                  <span>
                    Ghi nhận các tín hiệu như chuyển tab (`visibilitychange`), thoát toàn màn hình (`fullscreen_exit`) hoặc mất tiêu điểm cửa sổ.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Chấm tự động và khóa bi quan khi nộp:</strong>
                  <span>
                    Bài thi được chốt an toàn trong giao dịch cơ sở dữ liệu (`lockForUpdate`), ngăn chặn nộp trùng lặp khi mạng chậm.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Phân tích phổ điểm và độ phân biệt câu hỏi:</strong>
                  <span>
                    Biểu đồ phân vị điểm số, tỷ lệ đạt/trượt và độ phân biệt câu hỏi giúp nhà trường đánh giá chuẩn xác chất lượng đề.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
