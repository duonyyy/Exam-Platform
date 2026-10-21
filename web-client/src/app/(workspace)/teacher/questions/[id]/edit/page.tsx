"use client";

import React from "react";
import { useParams } from "next/navigation";
import { QuestionEditorForm } from "@/components/teacher/QuestionEditorForm";

export default function EditQuestionPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <QuestionEditorForm
      isEditMode={true}
      initialData={{
        id: id || "q-1042",
        subject: "IT4409",
        topic: "top-1",
        type: "single_choice",
        difficulty: "easy",
        content:
          "Trong kiến trúc RESTful API, phương thức HTTP nào có tính chất Idempotent và thường được sử dụng để cập nhật toàn bộ tài nguyên?",
        explanation:
          "Phương thức PUT có tính chất idempotent và theo chuẩn RFC 7231 được dùng để thay thế toàn bộ biểu diễn của tài nguyên mục tiêu.",
        options: [
          { key: "A", text: "POST", isCorrect: false },
          { key: "B", text: "PUT", isCorrect: true },
          { key: "C", text: "PATCH", isCorrect: false },
          { key: "D", text: "DELETE", isCorrect: false },
        ],
      }}
    />
  );
}
