# 📋 01 — Nhóm Tài Liệu: Yêu Cầu & Phạm Vi Nghiệp Vụ (Requirements & Scope)

Thư mục này tập hợp các tài liệu mang vai trò **định nghĩa bài toán, phạm vi, yêu cầu chức năng, yêu cầu phi chức năng, ca sử dụng và các quy tắc nghiệp vụ** cốt lõi của hệ thống Exam Platform.

---

## Danh Mục Tài Liệu & Vai Trò Của Từng Tệp Tin

| Tên Tệp Tin | Vai Trò & Mục Đích Nghiệp Vụ |
| :--- | :--- |
| **[`01-PROBLEM_AND_SCOPE.md`](01-PROBLEM_AND_SCOPE.md)** | Tuyên bố bài toán, mục tiêu chuyển đổi số, phân tích 3 tác nhân (Admin, Teacher, Student), khoanh vùng IN-SCOPE / OUT-OF-SCOPE. |
| **[`02-REQUIREMENTS.md`](02-REQUIREMENTS.md)** | Danh mục yêu cầu chức năng chi tiết có mã định danh (`FR-AUTH`, `FR-USER`, `FR-EXAM`, `FR-ATTEMPT`...). |
| **[`03-NON_FUNCTIONAL_REQUIREMENTS.md`](03-NON_FUNCTIONAL_REQUIREMENTS.md)** | Yêu cầu phi chức năng (NFR): Hiệu năng Autosave $\le 100\text{ms}$, nộp bài $\le 500\text{ms}$, độ sẵn sàng 99.9%. |
| **[`04-USE_CASES.md`](04-USE_CASES.md)** | Sơ đồ Mermaid Use Case tổng quan và đặc tả chi tiết 4 luồng cốt lõi: Publish Session, Start Attempt, Autosave, Submit. |
| **[`05-BUSINESS_RULES.md`](05-BUSINESS_RULES.md)** | Danh mục 16 quy tắc nghiệp vụ (`BR-001` đến `BR-016`) kèm tầng thực thi (Database, Policy, Transaction, UX). |
