"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Layers,
  Copy,
  Check,
  Eye,
  Download,
  Code,
  FileImage,
  ExternalLink,
  X,
} from "lucide-react";
import {
  BRAND_ILLUSTRATIONS_3D,
  BRAND_ICONS_3D,
  type AssetMeta,
} from "@/lib/brand-assets";

export function BrandAssetsCatalogSection() {
  const [activeTab, setActiveTab] = useState<"all" | "illustrations" | "icons" | "decorative">("all");
  const [selectedAsset, setSelectedAsset] = useState<AssetMeta | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const allAssets: AssetMeta[] = [
    ...Object.values(BRAND_ILLUSTRATIONS_3D),
    ...Object.values(BRAND_ICONS_3D),
  ];

  const filteredAssets = allAssets.filter((asset) => {
    if (activeTab === "illustrations") return asset.category === "illustration";
    if (activeTab === "icons") return asset.category === "icon_3d";
    if (activeTab === "decorative") return asset.category === "decorative";
    return true;
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <section id="brand-assets" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Spec 05 • Kho Tư Liệu Đồ Họa 3D &amp; Nhận Diện Thương Hiệu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Kho Tài Sản 3D &amp; Biểu Tượng Thương Hiệu
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Toàn bộ tranh minh họa Full HD, icon tính năng 3D và họa tiết trang trí chuẩn nhận diện ThiSmart Concept 03.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "all" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất cả ({allAssets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("illustrations")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "illustrations" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tranh minh họa 3D ({Object.keys(BRAND_ILLUSTRATIONS_3D).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("icons")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "icons" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Icon tính năng 3D (9)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("decorative")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "decorative" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Họa tiết trang trí (4)
          </button>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.src}
            className="ts-feature-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-400 transition flex flex-col justify-between group"
          >
            <div>
              {/* Asset Image Container */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden group-hover:bg-blue-50/40 transition">
                <div className="absolute inset-4 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                <Image
                  src={asset.src}
                  alt={asset.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />

                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/90 text-slate-600 font-semibold border border-slate-200/80 shadow-2xs backdrop-blur-xs">
                  {asset.width} × {asset.height}
                </span>
              </div>

              {/* Meta Info */}
              <div className="p-4 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      asset.category === "illustration"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : asset.category === "icon_3d"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {asset.category === "illustration"
                      ? "Minh Họa 3D"
                      : asset.category === "icon_3d"
                      ? "Icon 3D"
                      : "Trang Trí"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                  {asset.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {asset.description}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleCopy(asset.src, asset.src)}
                className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-600 transition"
                title="Sao chép đường dẫn ảnh"
              >
                {copiedKey === asset.src ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 text-[11px]">Đã copy</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy path</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedAsset(asset)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition"
              >
                <Eye className="w-3 h-3" />
                <span>Xem chi tiết</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Code Integration Tutorial */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Hướng Dẫn Tích Hợp Vào Mã Nguồn Next.js &amp; TypeScript
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">@/lib/brand-assets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400">{"// Cách 1: Sử dụng qua Master Registry"}</span>
            <pre className="text-cyan-300 leading-relaxed overflow-x-auto">
{`import Image from "next/image";
import { BRAND_ILLUSTRATIONS_3D } from "@/lib/brand-assets";

export function HeroFeature() {
  const meta = BRAND_ILLUSTRATIONS_3D.heroExamOrbit;
  return (
    <Image
      src={meta.src}
      alt={meta.title}
      width={meta.width}
      height={meta.height}
      className="drop-shadow-2xl"
    />
  );
}`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400">{"// Cách 2: Sử dụng BrandAssetImage Component"}</span>
            <pre className="text-cyan-300 leading-relaxed overflow-x-auto">
{`import { BrandAssetImage } from "@/components/media/BrandAssetImage";

export function AchievementBadge() {
  return (
    <BrandAssetImage
      src="/brand/icons-3d/icon-graduation-cap.png"
      alt="Mũ cử nhân 3D"
      width={96}
      height={96}
      float
      glow
    />
  );
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Asset Detail & Code Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedAsset.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedAsset.src} • {selectedAsset.width} × {selectedAsset.height} px
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview image */}
            <div className="w-full h-64 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <Image
                src={selectedAsset.src}
                alt={selectedAsset.title}
                width={selectedAsset.width}
                height={selectedAsset.height}
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              <strong>Mô tả thiết kế: </strong> {selectedAsset.description}
            </div>

            {/* Code Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Mã JSX tích hợp:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `<Image src="${selectedAsset.src}" alt="${selectedAsset.title}" width={${selectedAsset.width}} height={${selectedAsset.height}} className="object-contain" />`,
                      "modal-code"
                    )
                  }
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-[11px]"
                >
                  {copiedKey === "modal-code" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Chép mã JSX</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto">
{`<Image
  src="${selectedAsset.src}"
  alt="${selectedAsset.title}"
  width={${selectedAsset.width}}
  height={${selectedAsset.height}}
  className="object-contain drop-shadow-md"
/>`}
              </pre>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
