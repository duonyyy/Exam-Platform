"use client";

import React, { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { ExportReportButtonsProps } from "../types";
import {
  useExportSessionExcel,
  useExportSessionPdf,
  useExportExamPdf,
} from "../hooks/useExportReport";

export function ExportReportButtons({
  sessionId,
  examId,
  sessionTitle = "Ca thi",
  examTitle = "Đề thi",
  className = "",
}: ExportReportButtonsProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const exportExcelMutation = useExportSessionExcel();
  const exportSessionPdfMutation = useExportSessionPdf();
  const exportExamPdfMutation = useExportExamPdf();

  const handleExportSessionExcel = async () => {
    if (!sessionId) return;
    setLocalError(null);
    try {
      await exportExcelMutation.mutateAsync(sessionId);
    } catch (err: any) {
      setLocalError(err?.message || "Lỗi khi xuất bảng điểm Excel.");
    }
  };

  const handleExportSessionPdf = async () => {
    if (!sessionId) return;
    setLocalError(null);
    try {
      await exportSessionPdfMutation.mutateAsync(sessionId);
    } catch (err: any) {
      setLocalError(err?.message || "Lỗi khi xuất biên bản PDF.");
    }
  };

  const handleExportExamPdf = async (includeAnswers: boolean) => {
    if (!examId) return;
    setLocalError(null);
    setShowDropdown(false);
    try {
      await exportExamPdfMutation.mutateAsync({
        examId,
        includeAnswers,
      });
    } catch (err: any) {
      setLocalError(err?.message || "Lỗi khi xuất đề thi PDF.");
    }
  };

  const isAnyLoading =
    exportExcelMutation.isPending ||
    exportSessionPdfMutation.isPending ||
    exportExamPdfMutation.isPending;

  const errorMessage =
    localError ||
    (exportExcelMutation.error as Error)?.message ||
    (exportSessionPdfMutation.error as Error)?.message ||
    (exportExamPdfMutation.error as Error)?.message;

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* Session Result Exports */}
      {sessionId && (
        <div className="flex items-center gap-2">
          {/* Excel Export Button */}
          <button
            onClick={handleExportSessionExcel}
            disabled={isAnyLoading}
            className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
            title="Xuất bảng điểm ca thi đầy đủ kèm phổ điểm và phân tích câu hỏi sang Excel"
          >
            {exportExcelMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            )}
            <span>Bảng Điểm Excel (.xlsx)</span>
          </button>

          {/* PDF Session Report Button */}
          <button
            onClick={handleExportSessionPdf}
            disabled={isAnyLoading}
            className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
            title="Xuất biên bản ca thi và bảng điểm chuẩn in ấn có chữ ký cán bộ coi thi sang PDF"
          >
            {exportSessionPdfMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              <FileText className="w-4 h-4 text-blue-400" />
            )}
            <span>Biên Bản PDF In Ấn</span>
          </button>
        </div>
      )}

      {/* Exam Paper Exports */}
      {examId && (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isAnyLoading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2 disabled:opacity-50"
          >
            {exportExamPdfMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              <Download className="w-4 h-4 text-slate-400" />
            )}
            <span>Xuất Đề Thi PDF</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-20 text-xs">
              <button
                onClick={() => handleExportExamPdf(false)}
                className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Đề thi dự phòng (Không đáp án)</span>
              </button>
              <button
                onClick={() => handleExportExamPdf(true)}
                className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Đề thi kèm đáp án & giải thích</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error notification if failed */}
      {errorMessage && (
        <div className="text-[11px] text-red-400 flex items-center gap-1.5 ml-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
