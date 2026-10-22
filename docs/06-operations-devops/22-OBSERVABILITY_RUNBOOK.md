# 22 — Sổ Tay Vận Hành Giám Sát (Observability Runbook & Instrumentation Plan)

**Dự án**: Exam Platform  
**Tài liệu**: `docs/06-operations-devops/22-OBSERVABILITY_RUNBOOK.md`  
**Áp dụng Skill**: `observability-and-instrumentation`  
**Trạng thái**: Production Baseline Approved  

---

## 1. Mục Tiêu & 4 Câu Hỏi Vận Hành Cốt Lõi (On-Call Core Questions)

Khi vận hành một kỳ thi quy mô lớn với hàng nghìn thí sinh truy cập đồng thời, kỹ sư trực ca (On-call Engineer) cần trả lời ngay lập tức 4 câu hỏi:

1. **Tỷ lệ nộp bài thành công là bao nhiêu?** Có thí sinh nào gặp lỗi 5xx khi bấm nộp bài không?
2. **Độ trễ thao tác lưu đáp án tự động (Autosave Latency) có vượt ngưỡng 100ms không?**
3. **Có dấu hiệu nghẽn khóa hàng chờ CSDL (Lock Contention) tại bảng `exam_attempts` không?**
4. **Hệ thống giám sát phòng thi có ghi nhận đột biến vi phạm (Surge of proctoring violations) do sự cố mạng hàng loạt không?**

---

## 2. Chiến Lược 3 Trụ Cột Giám Sát (The 3 Pillars of Observability)

```
┌────────────────────────────────────────────────────────┐
│                      METRICS                           │
│  "Điều gì đang xảy ra trên toàn hệ thống?"              │
│  (Throughput, Error Rate, p95/p99 Latency, Active DB)   │
└──────────────────────────┬─────────────────────────────┘
                           │ phát hiện bất thường
                           ▼
┌────────────────────────────────────────────────────────┐
│                       TRACES                           │
│  "Độ trễ tiêu tốn ở bước nào trong chuỗi xử lý?"       │
│  (Client -> Nginx -> PHP-FPM -> Postgres Lock -> Redis)│
└──────────────────────────┬─────────────────────────────┘
                           │ định vị điểm nghẽn
                           ▼
┌────────────────────────────────────────────────────────┐
│                        LOGS                            │
│  "Tại sao trường hợp cụ thể này lại thất bại?"         │
│  (JSON Structured Logs: attempt_id, error_code, stack) │
└────────────────────────────────────────────────────────┘
```

---

## 3. Chỉ Số Dịch Vụ SLI / SLO Mục Tiêu

| Chỉ số (SLI) | Phương pháp đo lường | Mục tiêu (SLO) | Hành động khi vi phạm |
| :--- | :--- | :--- | :--- |
| **API Availability** | Số request 2xx/3xx/4xx chia cho tổng số request | $\ge 99.95\%$ trong khung giờ thi | Bật chế độ Read-Only cache, scale ngang PHP-FPM workers |
| **Autosave Latency** | p99 thời gian phản hồi `PATCH /answers` | $\le 100\text{ ms}$ | Kiểm tra connection pool Postgres, tăng Redis memory |
| **Submit Success Rate** | Tỷ lệ lượt nộp bài `POST /submit` thành công hợp lệ | $100\%$ không mất bài | Kích hoạt worker khôi phục từ snapshot bộ nhớ đệm |
| **Live Proctoring Ingestion** | Tỷ lệ nhận tín hiệu `/proctoring-events` | $\ge 99.9\%$ | Nới lỏng rate limit tạm thời cho IP phòng máy |

---

## 4. Định Dạng Nhật Ký Có Cấu Trúc (Structured JSON Logging)

Mọi log sự kiện quan trọng trong `core-api/` và `agentic-system/` bắt buộc phát ra định dạng JSON máy có thể phân tích (machine-readable):

```json
{
  "timestamp": "2026-10-22T08:30:00.124Z",
  "level": "INFO",
  "event": "exam_attempt_submitted",
  "service": "core-api",
  "environment": "production",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "context": {
    "attempt_id": 842,
    "session_id": 101,
    "student_id": 405,
    "score": 9.25,
    "total_points": 10.0,
    "duration_seconds": 2840,
    "lock_wait_ms": 4.2
  }
}
```

---

## 5. Danh Mục Metrics Prometheus & Cảnh Báo (Alerting Rules)

### 5.1. Custom Metrics Cần Đo Lường:
- `exam_attempts_active_total`: Gauge số lượng thí sinh đang làm bài thi.
- `exam_attempt_submit_duration_seconds`: Histogram thời gian xử lý giao dịch nộp bài và chấm điểm.
- `exam_attempt_lock_wait_ms`: Histogram thời gian chờ khóa hàng đợi `lockForUpdate()`.
- `exam_proctoring_violations_total`: Counter số lượng vi phạm được ghi nhận theo `type` và `severity`.

### 5.2. Quy Tắc Cảnh Báo (AlertManager Rules):
1. **Critical: HighSubmitFailureRate**
   - Điều kiện: `rate(http_requests_total{route="api.v1.exam-attempts.submit", status=~"5.."}[1m]) > 0.01`
   - Hành động: Bắn tin PagerDuty/Telegram khẩn cấp tới On-Call Lead.
2. **Warning: HighAutosaveLatency**
   - Điều kiện: `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{route="api.v1.exam-attempts.answers.save"}[5m])) > 0.15`
   - Hành động: Thông báo kênh kỹ thuật kiểm tra tải CSDL và Redis buffer.
