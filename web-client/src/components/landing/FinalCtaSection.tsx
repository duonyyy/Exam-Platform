import Link from "next/link";
import { Timer, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { BrandDotPattern } from "@/components/patterns/BrandDotPattern";

export function FinalCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Container with subtle glow and border */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Subtle Brand Dot Grid */}
          <BrandDotPattern opacity={0.06} color="#38BDF8" gap={28} />

          {/* Ambient light */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-cyan-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ThiSmart — Thi Thông Minh. Đánh Giá Chính Xác.</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Sẵn sàng chuẩn hóa quy trình khảo thí của trường học?
            </h2>

            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Trải nghiệm ngay phòng thi Focus Mode không xao nhãng hoặc đăng nhập tài khoản giảng viên để thiết lập kỳ thi trực tuyến đầu tiên.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/exam/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition active:scale-[0.98] text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Timer className="w-5 h-5" />
                <span>Trải nghiệm phòng thi ngay</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-[0.98] text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span>Đăng nhập hệ thống</span>
              </Link>
            </div>

            {/* Micro guarantees */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Không cần cài đặt phần mềm bổ sung</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chạy mượt trên mọi trình duyệt hiện đại</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hỗ trợ thiết bị máy tính, laptop và tablet</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
