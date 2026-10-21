import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FocusExamPreviewStage } from "@/components/landing/FocusExamPreviewStage";
import { FeatureShowcases } from "@/components/landing/FeatureShowcases";
import { SecurityTrustSection } from "@/components/landing/SecurityTrustSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ThiSmart — Hệ Thống Khảo Thí Trực Tuyến & Giám Sát Thông Minh",
  description:
    "Thi thông minh. Đánh giá chính xác. Nền tảng tổ chức kỳ thi trực tuyến, phòng thi tập trung Focus Mode, tự động lưu đáp án, đồng hồ đồng bộ máy chủ và bảo mật đề thi chuẩn mực.",
  openGraph: {
    title: "ThiSmart — Hệ Thống Khảo Thí Trực Tuyến & Giám Sát Thông Minh",
    description:
      "Thi thông minh. Đánh giá chính xác. Nền tảng khảo thí số thế hệ mới cho trường học và viện đào tạo.",
    images: ["/brand/og-image.png"],
    type: "website",
    locale: "vi_VN",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Sticky Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full" id="main-content">
        {/* 1. Hero Section (Direction B — Brand First with 3D Exam Orbit & Live Telemetry) */}
        <HeroSection />

        {/* 2. Interactive Focus Exam Room Product Preview Stage */}
        <FocusExamPreviewStage />

        {/* 3. Core Academic Capabilities (Question Bank 3D & Telemetry Analytics) */}
        <FeatureShowcases />

        {/* 4. Security, Privacy & Integrity Trust Architecture (Deep Navy with 3D Security Shield) */}
        <SecurityTrustSection />

        {/* 5. Role-Based Solutions (Student / Teacher / Admin) */}
        <SolutionsSection />

        {/* 6. How It Works (Continuous 4-Step Flow) */}
        <HowItWorksSection />

        {/* 7. Final Call to Action */}
        <FinalCtaSection />
      </main>

      {/* 8. Semantic Enterprise Footer */}
      <Footer />
    </div>
  );
}
