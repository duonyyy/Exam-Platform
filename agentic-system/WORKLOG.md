# Bảng Theo Dõi Tiến Độ Kỹ Thuật (Engineering Worklog)

> Bảng ghi nhận chi tiết các tác vụ kỹ thuật đã triển khai trong hệ thống **ExamOps Agent**.

---

## 📅 Lịch Sử Thực Thi Tác Vụ

| Ngày | Thành viên / Role | Tác vụ kỹ thuật | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|:---:|---|:---:|
| 2026-10-23 | AI Agent / Senior Architect | Thiết kế kiến trúc 6-Node StateGraph | ✅ Hoàn thành | `src/examops/graph.py` | 3h |
| 2026-10-23 | AI Agent / Backend Engineer | Xây dựng SQLite Checkpointer & Persistence | ✅ Hoàn thành | `src/examops/persistence.py` | 2h |
| 2026-10-23 | AI Agent / Security Engineer | Xây dựng Least-Privilege ToolRegistry | ✅ Hoàn thành | `src/examops/tools/` | 2.5h |
| 2026-10-23 | AI Agent / Senior Engineer | Xây dựng Mock & Gemini Model Providers | ✅ Hoàn thành | `src/examops/model.py` | 3h |
| 2026-10-23 | AI Agent / Test Engineer | Xây dựng bộ lượng giá 8 kịch bản nghiệp vụ | ✅ Hoàn thành | `tests/evals/test_eval_suite.py` | 3h |
| 2026-10-23 | AI Agent / Fullstack Engineer | Kết nối Core API `/exams/from-blueprint` | ✅ Hoàn thành | `src/examops/platform_client.py` | 2.5h |
| 2026-10-23 | AI Agent / Architect | Tái cấu trúc phân lớp (`nodes`, `tools`, `api`, `services`) | ✅ Hoàn thành | Clean Architecture Scaffolding | 2h |

---

## 🎯 Kế Hoạch Tác Vụ Tiếp Theo

- [ ] Nghiên cứu tích hợp Streamlit Dashboard phục vụ đánh giá nội bộ nhanh cho chuyên gia Khảo thí.
- [ ] Mở rộng thuật toán sinh ma trận đề thi phân tích thêm chỉ số độ phân biệt $D$ của ngân hàng câu hỏi.
