"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { Menu, ArrowRight, Palette } from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import { ThiSmartDrawer } from "@/components/motion/ThiSmartDrawer";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Phòng thi", href: "/#product-preview" },
    { label: "Tính năng", href: "/#features" },
    { label: "Bảo mật", href: "/#security" },
    { label: "Giải pháp", href: "/#solutions" },
    { label: "6 Vector Lab", href: "/patterns", isBadge: true },
    { label: "Design System", href: "/design-system" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm"
          : "bg-white/85 backdrop-blur-sm border-b border-slate-200/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Official Brand Logo */}
        <div className="flex items-center shrink-0">
          <BrandLogo href="/" withTagline={false} priority className="h-8 sm:h-9 w-auto" />
        </div>

        {/* Desktop Navigation Links (>= 1024px lg) */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600"
          aria-label="Chính"
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center gap-1.5 ${
                item.isBadge
                  ? "text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 font-semibold"
                  : "hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              {item.isBadge && <Palette className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Action CTAs (Desktop >= 1024px lg) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Đăng nhập
          </Link>
          <ThiSmartCtaButton href="/exam/demo" className="text-sm py-2 px-5">
            <span>Trải nghiệm phòng thi</span>
            <ArrowRight className="w-4 h-4" />
          </ThiSmartCtaButton>
        </div>

        {/* Tablet & Mobile Menu Trigger (< 1024px) */}
        <div className="flex items-center lg:hidden gap-2">
          <Link
            href="/exam/demo"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Vào thi thử
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="ts-drawer-trigger p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition focus-visible:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* M4. Mobile Menu Slide-in Drawer (Right to Left ~300ms) */}
      <ThiSmartDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="ThiSmart Điều Hướng"
      >
        <nav className="flex flex-col space-y-1" aria-label="Di động">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3.5 py-3 rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center justify-between ${
                item.isBadge
                  ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200/60"
                  : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <span>{item.label}</span>
              {item.isBadge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold uppercase tracking-wider">
                  New
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Đăng nhập hệ thống
          </Link>
          <ThiSmartCtaButton
            href="/exam/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full justify-center text-sm py-2.5"
          >
            <span>Trải nghiệm phòng thi</span>
            <ArrowRight className="w-4 h-4" />
          </ThiSmartCtaButton>
        </div>
      </ThiSmartDrawer>
    </header>
  );
}
