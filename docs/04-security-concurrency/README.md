# 🔒 04 — Nhóm Tài Liệu: An Ninh, Bảo Mật & Tranh Chấp Đồng Thời (Security & Concurrency)

Thư mục này tập hợp các tài liệu mang vai trò **thiết kế cơ chế xác thực/phân quyền, mô hình đe dọa an ninh STRIDE + OWASP API Top 10, phòng chống lỗ hổng IDOR, rò rỉ đề thi và giải pháp khóa dòng kiểm soát tranh chấp đồng thời**.

---

## Danh Mục Tài Liệu & Vai Trò Của Từng Tệp Tin

| Tên Tệp Tin | Vai Trò & Mục Đích An Ninh |
| :--- | :--- |
| **[`13-AUTH_AND_ACCESS_CONTROL.md`](13-AUTH_AND_ACCESS_CONTROL.md)** | Xác thực Sanctum kết hợp Next.js HTTP-Only Cookie Proxy; phân quyền 5 tầng; Laravel Policies chống triệt để lỗ hổng IDOR. |
| **[`14-THREAT_MODEL.md`](14-THREAT_MODEL.md)** | Mô hình đe dọa STRIDE; đối phó và kiểm chứng 8 kịch bản tấn công thực tế (IDOR, BFLA, Brute-force, Mass Assignment, Sensitive Log). |
| **[`16-CONSISTENCY_AND_CONCURRENCY.md`](16-CONSISTENCY_AND_CONCURRENCY.md)** | Ma trận Race Conditions; cơ chế khóa bi quan CSDL `SELECT ... FOR UPDATE` triệt tiêu Double Submit; Header `Idempotency-Key`. |
