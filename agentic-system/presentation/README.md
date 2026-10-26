# Tài Liệu Thuyết Trình & Kịch Bản Demo (Presentation & Demo Script)

Thư mục chứa tài liệu thuyết trình, slide deck và kịch bản demo cho sản phẩm **ExamOps Agent — Trợ Lý AI Khảo Thí & Tự Động Hóa Soạn Đề**.

---

## 📽️ 1. Cấu Trúc Bài Thuyết Trình (Slide Deck Outline)

1. **Slide 1: Bối cảnh & Vấn đề thực tế**
   - Sự quá tải của Giảng viên khi phải soạn đề thi cân bằng ma trận độ khó Bloom thủ công.
   - Nguy cơ sai sót trong phân bổ điểm số, độ phủ chủ đề và câu hỏi chưa được thẩm định.
2. **Slide 2: Giải pháp — ExamOps Agent**
   - Trợ lý AI chuyên biệt cho ngành khảo thí.
   - Định nghĩa: $\text{Agent} = \text{Model} + \text{Harness}$ (Context, Skills, State, Verification, Human Gate, Observability).
3. **Slide 3: Kiến trúc 3 Lớp & Ranh Giới An Ninh**
   - Web Client (Next.js 15) $\leftrightarrow$ ExamOps Agent (FastAPI, LangGraph) $\leftrightarrow$ Core API (Laravel 13, PostgreSQL 16).
   - Nguyên tắc **Fail-Closed Isolation**: AI không đọc/ghi trực tiếp cơ sở dữ liệu.
4. **Slide 4: Chu trình điều phối 6 Bước (LangGraph StateGraph)**
   - Phân tích luồng từ `Intake` đến `Finalize`.
   - Điểm sáng: **Deterministic Mathematical Verification** & **Human-in-the-Loop Interrupt Gate**.
5. **Slide 5: Đảm bảo Chất Lượng & Đánh Giá Định Lượng (Evals)**
   - 36/36 tests tự động PASS trong 0.35s.
   - 8 Scenarios bao quát toàn diện các trường hợp biên và tấn công giả mạo.

---

## 🎬 2. Kịch Bản Demo Trực Tiếp (Live Demo Walkthrough Script)

- **Bước 1**: Mở trình duyệt vào giao diện Giảng viên: `http://localhost:3000/teacher/ai-assistant`.
- **Bước 2**: Nhập câu lệnh soạn đề:
  > *"Soạn đề thi mẫu môn Lập trình Web CS101 gồm 40 câu hỏi, thời gian 60 phút, độ khó 40% Dễ, 40% Trung bình, 20% Khó."*
- **Bước 3**: Quan sát Terminal AI State Graph trên màn hình:
  - Node 1: Xác thực vai trò Giảng viên $\rightarrow$ PASS.
  - Node 2: Lập kế hoạch chọn kỹ năng `exam-blueprint` $\rightarrow$ PASS.
  - Node 3: Sinh ma trận đề thi $\rightarrow$ PASS.
  - Node 4: Thẩm định tổng điểm (10.0) và tổng độ khó (100%) $\rightarrow$ PASS.
  - Node 5: Trình đề xuất bất biến kèm mã băm SHA-256 và tạm dừng tại cổng duyệt `WAITING_FOR_APPROVAL`.
- **Bước 4**: Giảng viên rà soát các câu hỏi và bấm **Phê duyệt & Xuất bản Đề thi**.
- **Bước 5**: Hệ thống gửi yêu cầu nguyên tử sang Core API, tạo đề thi thật và hiển thị thông báo thành công kèm nút chuyển đến `/teacher/exams`.
