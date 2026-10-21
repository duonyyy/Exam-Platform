import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Clock,
  Eye,
  FileCheck2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
} from "lucide-react";
import { BrandDotPattern } from "@/components/patterns/BrandDotPattern";
import { ThiSmartPattern } from "@/components/patterns/ThiSmartPattern";

export function SecurityTrustSection() {
  const securityPillars = [
    {
      title: "Kiểm soát phân quyền & Chống IDOR",
      subtitle: "Bảo vệ bài làm cá nhân của thí sinh",
      description:
        "Phân quyền đa tầng ở cả mức Endpoint (Role Middleware) và Bản ghi (Laravel Policy). Sinh viên tuyệt đối không thể đọc hay can thiệp vào bài thi của sinh viên khác.",
      icon: KeyRound,
    },
    {
      title: "Bảo mật đề thi & Không rò rỉ đáp án",
      subtitle: "Chính sách bảo mật đề thi học thuật",
      description:
        "Dữ liệu đề gửi về trình duyệt của thí sinh qua QuestionStudentResource loại bỏ hoàn toàn đáp án đúng và lời giải thích. Server bảo mật đáp án cho tới khi công bố kết quả.",
      icon: Lock,
    },
    {
      title: "Đồng hồ chuẩn hóa theo máy chủ",
      subtitle: "Đảm bảo công bằng thời gian tuyệt đối",
      description:
        "Hạn chót làm bài được ấn định bằng đồng hồ máy chủ. Mọi nỗ lực can thiệp hoặc thay đổi giờ trên thiết bị cá nhân của thí sinh đều không ảnh hưởng đến thời hạn thi thực tế.",
      icon: Clock,
    },
    {
      title: "Khóa an toàn khi nộp bài thi",
      subtitle: "Ngăn chặn nộp trùng lặp và race condition",
      description:
        "Khi thí sinh nộp bài hoặc hết giờ, hệ thống khóa dòng dữ liệu bài thi trong giao dịch cơ sở dữ liệu (`lockForUpdate`) để tính điểm một lần duy nhất, tránh lỗi nhân bản khi mạng chậm.",
      icon: FileCheck2,
    },
    {
      title: "Nhật ký giám sát hành vi khách quan",
      subtitle: "Cung cấp bằng chứng cho hội đồng thanh tra",
      description:
        "Ghi nhận trung thực các tín hiệu chuyển tab (`visibilitychange`), thoát toàn màn hình (`fullscreen_exit`) hoặc mất tiêu điểm để lưu vào nhật ký giám sát phục vụ hậu kiểm minh bạch.",
      icon: Eye,
    },
    {
      title: "Toàn vẹn dữ liệu & Ràng buộc chuẩn mực",
      subtitle: "Kiến trúc cơ sở dữ liệu ACID",
      description:
        "Ràng buộc duy nhất tổng hợp ngăn ngừa gán trùng thí sinh vào ca thi hoặc trùng lặp bản ghi câu trả lời, đảm bảo tính nhất quán dữ liệu của toàn trường.",
      icon: Database,
    },
  ];

  return (
    <section id="security" className="relative py-16 md:py-24 bg-[#0F172A] text-slate-100 border-b border-slate-800 overflow-hidden">
      {/* High-Tech Circuit Board Pattern (Security & Anti-Tamper Telemetry: 0.12 opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <ThiSmartPattern
          variant="circuit-board"
          opacity={0.12}
          showBackground={false}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Phòng Thủ Theo Chiều Sâu (Defense-in-Depth)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            An ninh, bảo mật &amp; Toàn vẹn dữ liệu kỳ thi
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300">
            Các lớp bảo vệ dữ liệu được thiết kế nghiêm ngặt dựa trên kiến trúc thực tế, hướng tới sự tin cậy và minh bạch cao nhất cho nhà trường.
          </p>
        </div>

        {/* Feature Spotlight with 3D Security Shield Artwork */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
              <div className="absolute inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <Image
                src="/brand/illustrations/illustration-feature-proctoring-security-3d.webp"
                alt="ThiSmart 3D Security Shield — Khiên an ninh khảo thí & Giám sát ca thi"
                width={450}
                height={450}
                className="w-full h-auto object-contain drop-shadow-2xl select-none"
              />

              {/* Floating Shield Status Badge */}
              <div className="absolute -bottom-2 -left-2 sm:left-4 bg-slate-950/90 text-slate-200 p-3 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md text-xs space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Server-Authoritative Clock</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Buffer bù trễ mạng 15s • Tự động khóa nộp
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-cyan-300 text-xs font-semibold border border-blue-400/20">
              <span>Kiểm Soát Tranh Chấp &amp; Khóa Bi Quan</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Cơ chế bảo vệ luồng nộp bài sinh tử trong giao dịch cơ sở dữ liệu
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Thời điểm thí sinh nhấn nộp bài là luồng nghiệp vụ sinh tử. Để triệt tiêu tình trạng nộp trùng lặp khi mạng chậm hoặc người dùng click liên tiếp, ThiSmart áp dụng khóa bi quan (`lockForUpdate`) trên PostgreSQL 16 kết hợp Idempotency-Key.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-semibold text-cyan-300 mb-1">Chống Race Condition:</div>
                <div className="text-slate-400">Bản ghi lượt thi được khóa ngay lập tức; chỉ trạng thái hợp lệ mới được tính điểm.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-semibold text-emerald-300 mb-1">Idempotent Upsert:</div>
                <div className="text-slate-400">Gửi lại câu trả lời nhiều lần không gây sinh thừa bản ghi hay xung đột dữ liệu.</div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Security Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-sm group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{pillar.title}</h3>
                  <div className="text-xs font-medium text-cyan-400 mb-2">
                    {pillar.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

               
              </div>
            );
          })}
        </div>

        {/* Transparent Institutional Commitment */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/95 border border-amber-400/20 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
            <strong className="font-bold text-amber-300 block sm:inline">Cam kết an ninh minh bạch: </strong>
            ThiSmart không đưa ra các tuyên bố quảng cáo không thực tế như &quot;chống gian lận tuyệt đối 100%&quot;. Thay vào đó, chúng tôi tập trung xây dựng phòng thủ nhiều lớp, bảo vệ toàn vẹn dữ liệu đề thi và cung cấp dữ liệu cảm biến trung thực để hội đồng khảo thí đưa ra kết luận chính xác.
          </div>
        </div>
      </div>
    </section>
  );
}
