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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://thismart.edu.vn"),
  title: {
    default: "ThiSmart — Hệ Thống Thi Trực Tuyến & Giám Sát Thông Minh",
    template: "%s | ThiSmart",
  },
  description:
    "ThiSmart — Thi thông minh. Đánh giá chính xác. Nền tảng thi trực tuyến bảo mật cao, chống gian lận đa tầng, phân quyền vai trò và trải nghiệm phòng thi tối ưu.",
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
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
