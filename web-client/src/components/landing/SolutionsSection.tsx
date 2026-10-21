"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { BrandDotPattern } from "@/components/patterns/BrandDotPattern";

export function SolutionsSection() {
  const [activeRole, setActiveRole] = useState<"student" | "teacher" | "admin">("student");

  const roles = [
    {
      id: "student" as const,
      name: "Thí Sinh (Sinh Viên)",
      badge: "Làm bài tập trung",
      icon: GraduationCap,
      imageSrc: "/brand/illustrations/focus-exam-room-3d.png",
      imageAlt: "Không gian làm bài phòng thi Focus Mode 3D",
      headline: "Không gian làm bài tĩnh lặng, an tâm về thời gian và kết quả",
      description:
        "Thí sinh chỉ tập trung vào việc thể hiện kiến thức của mình. Giao diện Focus Exam Room loại bỏ hoàn toàn các yếu tố gây xao nhãng, tự động lưu từng câu trả lời và thông báo minh bạch.",
      benefits: [
        "Không lo mất bài khi gặp sự cố mạng hoặc sập nguồn máy tính.",
        "Đồng hồ đếm ngược đồng bộ máy chủ giúp phân bổ thời gian làm bài công bằng.",
        "Bảng điều hướng trực quan giúp kiểm tra nhanh các câu phân vân trước khi nộp.",
        "Thông báo xác nhận hoàn thành rõ ràng, xem kết quả minh bạch sau khi ca thi đóng.",
      ],
      ctaText: "Vào phòng thi thử dành cho thí sinh",
      ctaHref: "/exam/demo",
    },
    {
      id: "teacher" as const,
      name: "Giảng Viên & Cán Bộ Coi Thi",
      badge: "Quản trị học thuật",
      icon: Users,
      imageSrc: "/brand/illustrations/exam-creation-3d.png",
      imageAlt: "Công cụ thiết kế đề thi và ngân hàng câu hỏi 3D",
      headline: "Biên soạn đề thi chuẩn hóa, lập lịch ca thi và giám sát nhẹ nhàng",
      description:
        "Cung cấp cho giảng viên bộ công cụ xây dựng ngân hàng câu hỏi phân tầng theo môn học, xáo trộn câu hỏi tự động và theo dõi tiến độ thi trực tiếp theo thời gian thực.",
      benefits: [
        "Quản lý cây Môn học và Chủ đề khoa học, hỗ trợ 4 định dạng câu hỏi linh hoạt.",
        "Tạo đề thi mẫu với cơ chế xáo trộn thứ tự câu và phương án chống nhìn bài chéo.",
        "Gán danh sách sinh viên dự thi và phân công giám thị theo từng ca thi cụ thể.",
        "Báo cáo thống kê phổ điểm và phân tích câu hỏi tự động ngay khi ca thi kết thúc.",
      ],
      ctaText: "Đăng nhập phân hệ Giảng viên",
      ctaHref: "/login",
    },
    {
      id: "admin" as const,
      name: "Ban Quản Trị & Nhà Trường",
      badge: "Toàn vẹn vận hành",
      icon: ShieldCheck,
      imageSrc: "/brand/illustrations/user-roles-3d.png",
      imageAlt: "Ma trận phân quyền đa tầng RBAC 3D",
      headline: "Phân quyền chặt chẽ, kiểm toán toàn hệ thống và toàn vẹn dữ liệu điểm số",
      description:
        "Giúp ban giám hiệu và phòng khảo thí kiểm soát toàn diện các kỳ thi của toàn trường, phân quyền tài khoản đa cấp và lưu vết nhật ký giám sát minh bạch phục vụ thanh tra.",
      benefits: [
        "Phân quyền đa tầng chống truy cập chéo bài thi giữa các sinh viên.",
        "Lưu vết toàn bộ sự kiện hành vi trình duyệt phục vụ công tác hậu kiểm.",
        "Khóa an toàn khi nộp bài trong giao dịch cơ sở dữ liệu ngăn ngừa nộp trùng lặp.",
        "Kiến trúc độc lập, vận hành ổn định phục vụ các kỳ thi tập trung quy mô lớn.",
      ],
      ctaText: "Đăng nhập cổng Quản trị viên",
      ctaHref: "/login",
    },
  ];

  const current = roles.find((r) => r.id === activeRole) || roles[0];
  const Icon = current.icon;

  return (
    <section id="solutions" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden">
      <BrandDotPattern opacity={0.03} color="#2563EB" gap={28} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Thiết Kế Theo Vai Trò Thực Tế</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Giải pháp chuyên biệt cho từng tác nhân trong kỳ thi
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Mỗi đối tượng đều có không gian làm việc chuyên biệt, đơn giản và đạt chuẩn hiệu năng giáo dục.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {roles.map((r) => {
            const RoleIcon = r.icon;
            const isSelected = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRole(r.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <RoleIcon className={`w-4 h-4 ${isSelected ? "text-cyan-200" : "text-slate-500"}`} />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Presentation Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                <Icon className="w-4 h-4" />
                <span>{current.badge}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {current.headline}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {current.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href={current.ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm text-sm"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center space-y-4">
              {/* Dynamic 3D Artwork for Active Role */}
              <div className="relative w-full max-w-[360px] aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-2 bg-gradient-to-tr from-blue-500/15 via-cyan-400/15 to-transparent rounded-full blur-xl pointer-events-none" />
                <Image
                  key={current.id}
                  src={current.imageSrc}
                  alt={current.imageAlt}
                  width={480}
                  height={360}
                  priority
                  className="w-full h-auto object-contain drop-shadow-xl select-none transition-all duration-500 animate-in fade-in zoom-in-95"
                />
              </div>

              {/* Responsibility Workflow Card */}
              <div className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2.5">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
                  Quy Trình &amp; Trách Nhiệm Phân Quyền
                </div>

                {activeRole === "student" && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-semibold mb-0.5">Tiếp nhận ca thi:</strong>
                      <span>Chỉ truy cập được ca thi khi có tên trong danh sách chỉ định của môn học.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-semibold mb-0.5">Làm bài &amp; Nộp bài:</strong>
                      <span>Thời gian được đếm chuẩn xác, tự động khóa và tính điểm ngay khi xác nhận nộp.</span>
                    </div>
                  </div>
                )}

                {activeRole === "teacher" && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-semibold mb-0.5">Soạn thảo &amp; Duyệt đề:</strong>
                      <span>Chủ động quản lý ngân hàng câu hỏi thuộc môn mình phụ trách.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-semibold mb-0.5">Giám sát &amp; Xem phổ điểm:</strong>
                      <span>Nắm bắt trực quan tiến độ làm bài của sinh viên và xuất bảng điểm chi tiết.</span>
                    </div>
                  </div>
                )}

                {activeRole === "admin" && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-semibold mb-0.5">Quản trị tài khoản &amp; Vai trò:</strong>
                      <span>Khởi tạo tài khoản, gán quyền giảng viên và sinh viên toàn trường.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-semibold mb-0.5">Kiểm toán &amp; Thanh tra:</strong>
                      <span>Tra cứu toàn bộ nhật ký giám sát ca thi phục vụ công tác phúc khảo và thanh tra.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
