import Link from "next/link";
import {
  FileEdit,
  CalendarClock,
  Timer,
  BarChart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AnswerGridPattern } from "@/components/patterns/AnswerGridPattern";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Soạn ngân hàng & Thiết lập đề mẫu",
      description:
        "Giảng viên biên soạn câu hỏi theo môn học và chủ đề. Cấu hình đề thi mẫu với thời lượng, điểm sàn và cơ chế xáo trộn câu hỏi.",
      icon: FileEdit,
    },
    {
      step: "02",
      title: "Lập lịch ca thi & Gán danh sách sinh viên",
      description:
        "Ấn định khung giờ bắt đầu và kết thúc ca thi. Gán danh sách thí sinh được phép tham gia và chỉ định cán bộ coi thi giám sát.",
      icon: CalendarClock,
    },
    {
      step: "03",
      title: "Thí sinh làm bài trong Focus Room",
      description:
        "Thí sinh vào phòng thi tĩnh lặng không xao nhãng. Đồng hồ đồng bộ máy chủ và từng phương án chọn được lưu nháp liên tục.",
      icon: Timer,
    },
    {
      step: "04",
      title: "Chấm tự động & Xuất báo cáo phổ điểm",
      description:
        "Hệ thống chốt bài thi an toàn khi hết giờ hoặc thí sinh nộp bài. Tự động tính điểm và xuất báo cáo phổ điểm phân tích học thuật.",
      icon: BarChart,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-16 md:py-24 bg-white border-b border-slate-200 overflow-hidden">
      <AnswerGridPattern opacity={0.03} color="#2563EB" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Quy Trình Khảo Thí Khép Kín</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Vận hành kỳ thi trực tuyến qua 4 bước tinh gọn
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Từ khâu chuẩn bị đề thi đến khi công bố kết quả, toàn bộ luồng công việc được kết nối liền mạch và tự động hóa.
          </p>
        </div>

        {/* Continuous Connected Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-slate-50/90 transition flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-blue-600 transition">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Quy trình tự động hóa</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold text-white">Bạn muốn trải nghiệm trực tiếp quy trình thi?</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Phòng thi Demo được thiết lập sẵn sàng để bạn trải nghiệm trọn vẹn chỉ trong 1 phút.
            </div>
          </div>
          <Link
            href="/exam/demo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition text-sm shrink-0 shadow-md active:scale-[0.98]"
          >
            <span>Vào phòng thi thử ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
