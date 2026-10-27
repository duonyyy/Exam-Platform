"use client";

import React, { useEffect, useRef } from "react";

interface ExamWatermarkProps {
  studentName?: string;
  studentCode?: string;
  sessionCode?: string;
  opacity?: number;
}

export function ExamWatermark({
  studentName = "Nguyễn Văn A",
  studentCode = "SV2026101",
  sessionCode = "SES-2026",
  opacity = 0.065,
}: ExamWatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderWatermark = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const timestamp = new Date().toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const primaryText = `${studentName} • ${studentCode}`;
      const secondaryText = `${sessionCode} • ${timestamp}`;

      ctx.font = "bold 13px Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = `rgba(15, 23, 42, ${opacity})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const gridX = 300;
      const gridY = 180;
      const angle = (-22 * Math.PI) / 180;

      for (let x = -gridX; x < width + gridX; x += gridX) {
        for (let y = -gridY; y < height + gridY; y += gridY) {
          ctx.save();
          // Stagger alternate rows for organic security patterning
          const offsetX = (Math.floor(y / gridY) % 2 === 0) ? 0 : gridX / 2;
          ctx.translate(x + offsetX, y);
          ctx.rotate(angle);

          ctx.fillText(primaryText, 0, -8);
          ctx.font = "normal 11px Inter, sans-serif";
          ctx.fillText(secondaryText, 0, 10);
          ctx.font = "bold 13px Inter, sans-serif";

          ctx.restore();
        }
      }
    };

    renderWatermark();

    window.addEventListener("resize", renderWatermark);

    // Anti-Tamper: MutationObserver to re-render if styles or visibility are altered
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && (m.attributeName === "style" || m.attributeName === "class")) {
          if (containerRef.current) {
            containerRef.current.style.display = "block";
            containerRef.current.style.opacity = "1";
            containerRef.current.style.pointerEvents = "none";
          }
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { attributes: true });
    }

    return () => {
      window.removeEventListener("resize", renderWatermark);
      observer.disconnect();
    };
  }, [studentName, studentCode, sessionCode, opacity]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-[9999] overflow-hidden"
      style={{ display: "block", opacity: 1 }}
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none select-none" />
    </div>
  );
}
