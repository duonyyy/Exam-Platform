"use client";

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  FileText,
  HelpCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { ThiSmartCtaButton } from "@/components/motion/ThiSmartCtaButton";
import {
  QuestionImportModalProps,
  QuestionValidationData,
} from "../types";
import {
  useDownloadQuestionTemplate,
  useValidateQuestionsExcel,
  useImportQuestionsExcel,
} from "../hooks/useQuestionImport";

export function QuestionImportModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTopicId,
  topics = [],
}: QuestionImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(defaultTopicId);
  const [validationData, setValidationData] = useState<QuestionValidationData | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplateMutation = useDownloadQuestionTemplate();
  const validateExcelMutation = useValidateQuestionsExcel();
  const importExcelMutation = useImportQuestionsExcel();

  if (!isOpen) return null;

  const handleDownloadTemplate = async () => {
    setLocalError(null);
    try {
      await downloadTemplateMutation.mutateAsync(selectedTopicId);
    } catch (err: any) {
      setLocalError(err?.message || "Không thể tải về tệp tin mẫu từ hệ thống.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx")) {
        setLocalError("Chỉ chấp nhận tệp tin định dạng Excel (.xlsx).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setLocalError("Dung lượng tệp vượt quá 10MB cho phép.");
        return;
      }
      setSelectedFile(file);
      setValidationData(null);
      setLocalError(null);
      setImportSuccessCount(null);
    }
  };

  const handleValidateFile = async () => {
    if (!selectedFile) return;
    setLocalError(null);

    try {
      const response = await validateExcelMutation.mutateAsync({
        file: selectedFile,
        topicId: selectedTopicId,
      });
      setValidationData(response.data);
    } catch (err: any) {
      setLocalError(err?.message || "Lỗi khi kiểm tra tính hợp lệ của tệp.");
    }
  };

  const handleExecuteImport = async () => {
    if (!selectedFile) return;
    setLocalError(null);

    try {
      const response = await importExcelMutation.mutateAsync({
        file: selectedFile,
        topicId: selectedTopicId,
      });
      const count = response.data?.imported_count || 0;
      setImportSuccessCount(count);
      if (onSuccess) {
        onSuccess(count);
      }
    } catch (err: any) {
      setLocalError(err?.message || "Lỗi khi nạp câu hỏi vào hệ thống.");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationData(null);
    setLocalError(null);
    setImportSuccessCount(null);
    validateExcelMutation.reset();
    importExcelMutation.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const errorMessage =
    localError ||
    (downloadTemplateMutation.error as Error)?.message ||
    (validateExcelMutation.error as Error)?.message ||
    (importExcelMutation.error as Error)?.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Nhập Ngân Hàng Câu Hỏi Hàng Loạt
              </h2>
              <p className="text-xs text-slate-400">
                Tải lên tệp Excel (.xlsx) để tự động thẩm định và nạp vào CSDL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">

          {/* Success Notification if import finished */}
          {importSuccessCount !== null ? (
            <div className="p-6 text-center space-y-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-300">
                Nhập Câu Hỏi Thành Công!
              </h3>
              <p className="text-sm text-slate-300">
                Đã thêm thành công <strong className="text-white font-bold">{importSuccessCount}</strong> câu hỏi mới vào ngân hàng đề thi. Tất cả câu hỏi đã được gán trạng thái <code className="bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded text-xs">ready</code> và sẵn sàng đưa vào đề thi.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                >
                  Nhập thêm tệp khác
                </button>
                <ThiSmartCtaButton
                  onClick={onClose}
                  variant="primary"
                  size="sm"
                >
                  Hoàn Tất & Xem Danh Sách
                </ThiSmartCtaButton>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Guidelines & Template Download */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
                      1
                    </span>
                    Tải Tệp Tin Mẫu Chuẩn
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    disabled={downloadTemplateMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition text-xs font-medium disabled:opacity-50"
                  >
                    {downloadTemplateMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Tải Template (.xlsx)
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tệp mẫu đã tích hợp sẵn hướng dẫn chi tiết, danh sách chủ đề hợp lệ và các cột: Chủ đề, Nội dung, Loại câu hỏi, Mức độ khó, Lựa chọn A-F, Đáp án đúng, Giải thích.
                </p>

                {topics.length > 0 && (
                  <div className="pt-2 flex items-center gap-2">
                    <label className="text-xs text-slate-400">Gán mặc định cho Chủ đề:</label>
                    <select
                      value={selectedTopicId || ""}
                      onChange={(e) => setSelectedTopicId(e.target.value ? Number(e.target.value) : undefined)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Dùng Chủ đề ghi trong từng dòng Excel --</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} {t.subjectName ? `(${t.subjectName})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Step 2: Upload Excel File */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
                    2
                  </span>
                  Chọn Tệp Excel Đã Điền Dữ Liệu
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                    selectedFile
                      ? "border-blue-500/60 bg-blue-500/5"
                      : "border-slate-700 hover:border-slate-500 bg-slate-950/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-white">{selectedFile.name}</p>
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB — Bấm để chọn tệp khác
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-slate-200">
                        Kéo thả tệp Excel vào đây hoặc <span className="text-blue-400 underline">chọn tệp từ máy tính</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Hỗ trợ định dạng .xlsx tiêu chuẩn, tối đa 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <strong className="font-semibold">Lỗi: </strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Validate Trigger Button */}
              {selectedFile && !validationData && (
                <div className="flex justify-end">
                  <ThiSmartCtaButton
                    onClick={handleValidateFile}
                    disabled={validateExcelMutation.isPending}
                    variant="primary"
                    size="md"
                  >
                    {validateExcelMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang Thẩm Định Tệp...
                      </>
                    ) : (
                      <>
                        Thẩm Định Dữ Liệu <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </ThiSmartCtaButton>
                </div>
              )}

              {/* Step 3: Validation Result Summary & Preview */}
              {validationData && (
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
                        3
                      </span>
                      Kết Quả Thẩm Định Dữ Liệu
                    </div>
                    <span className="text-xs text-slate-400">
                      Tổng số: <strong className="text-white">{validationData.total_rows}</strong> dòng
                    </span>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                      validationData.valid_count > 0
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                        : "bg-slate-800/40 border-slate-700 text-slate-400"
                    }`}>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-lg font-bold text-white">{validationData.valid_count}</div>
                        <div className="text-xs">Dòng hợp lệ sẵn sàng nạp</div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                      validationData.invalid_count > 0
                        ? "bg-rose-950/20 border-rose-500/30 text-rose-300"
                        : "bg-slate-800/40 border-slate-700 text-slate-400"
                    }`}>
                      <AlertTriangle className={`w-6 h-6 shrink-0 ${validationData.invalid_count > 0 ? "text-rose-400" : "text-slate-500"}`} />
                      <div>
                        <div className="text-lg font-bold text-white">{validationData.invalid_count}</div>
                        <div className="text-xs">Dòng phát hiện lỗi cú pháp</div>
                      </div>
                    </div>
                  </div>

                  {/* Error List if any */}
                  {validationData.errors && validationData.errors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        Chi tiết các dòng bị lỗi (Vui lòng sửa trong file Excel trước khi nạp):
                      </p>
                      <div className="max-h-44 overflow-y-auto rounded-lg border border-rose-500/30 bg-rose-950/20 p-2 space-y-1.5 text-xs">
                        {validationData.errors.map((err, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-rose-200 border-b border-rose-900/30 pb-1 last:border-0 last:pb-0">
                            <span className="font-mono px-1.5 py-0.5 rounded bg-rose-900/50 text-[11px] text-rose-300 font-semibold shrink-0">
                              Dòng {err.row}
                            </span>
                            <span className="font-medium text-slate-300">[{err.column}]:</span>
                            <span className="text-rose-300">{err.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Valid Questions Preview */}
                  {validationData.preview && validationData.preview.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        Xem trước dữ liệu mẫu ({validationData.preview.length} câu đầu tiên):
                      </p>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {validationData.preview.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1 text-xs">
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="font-mono text-[11px] text-blue-400">Dòng {item.row}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                                  {item.question_type}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                                  {item.difficulty}
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-200 line-clamp-2">{item.question_text}</p>
                            <div className="text-right">
                              <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/20">
                                Đáp án: {Array.isArray(item.correct_answer) ? item.correct_answer.join(",") : item.correct_answer}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Import Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleReset}
                      className="text-xs text-slate-400 hover:text-white transition"
                    >
                      Chọn lại tệp khác
                    </button>
                    <ThiSmartCtaButton
                      onClick={handleExecuteImport}
                      disabled={importExcelMutation.isPending || validationData.valid_count === 0 || validationData.invalid_count > 0}
                      variant="primary"
                      size="md"
                    >
                      {importExcelMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang Nạp Vào CSDL...
                        </>
                      ) : (
                        <>
                          Xác Nhận Nạp {validationData.valid_count} Câu Hỏi
                        </>
                      )}
                    </ThiSmartCtaButton>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
}
