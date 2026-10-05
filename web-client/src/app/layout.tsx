import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Exam Platform — Hệ Thống Thi Trực Tuyến & Giám Sát Thông Minh",
  description:
    "Nền tảng thi cử và đánh giá năng lực trực tuyến bảo mật cao, chống gian lận đa tầng, phân quyền vai trò và trải nghiệm phòng thi tối ưu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans dark:bg-slate-950 dark:text-slate-100">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
