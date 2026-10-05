# 💻 Exam Platform — Web Client

> Giao diện Web Client cho hệ thống thi trực tuyến **Exam Platform**, xây dựng trên nền tảng **Next.js 15+ (App Router)**, **React 19**, **TypeScript Strict Mode**, **Tailwind CSS**, và **TanStack Query v5**.

Tài liệu chi tiết về thiết kế hệ thống, xem tại: [docs/05-frontend/17-FRONTEND_DESIGN.md](../docs/05-frontend/17-FRONTEND_DESIGN.md).

---

## 🏗️ 1. Yêu Cầu Môi Trường (System Requirements)

- **Node.js:** `>= 20.x` (LTS khuyến nghị)
- **Package Manager:** `pnpm >= 9.x` (hoặc `npm >= 10.x`)
- **Backend Core API:** Đang chạy tại `http://localhost:8000/api/v1` (qua Docker Compose)

---

## 🚀 2. Cài Đặt & Cấu Hình

### 2.1. Cài đặt Dependencies
```bash
cd web-client
pnpm install
```

### 2.2. Cấu hình Biến Môi trường
Tạo file `.env.local` từ mẫu `.env.example`:
```bash
cp .env.example .env.local
```

Nội dung `.env.local`:
```env
# Địa chỉ gốc của Laravel REST API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Tùy chọn debug môi trường
NEXT_PUBLIC_APP_ENV=development
```

---

## 🛠️ 3. Lệnh Phát Triển & Kiểm Tra Chất Lượng

| Lệnh | Mục đích |
| :--- | :--- |
| `pnpm dev` | Khởi chạy máy chủ phát triển (Port `3000`) với tính năng Fast Refresh |
| `pnpm build` | Biên dịch ứng dụng tối ưu cho Production (kiểm tra type & static generation) |
| `pnpm start` | Chạy ứng dụng đã build ở chế độ Production |
| `pnpm lint` | Quét và kiểm tra quy chuẩn mã nguồn với ESLint |
| `pnpm typecheck` | Kiểm tra tính an toàn kiểu dữ liệu với TypeScript (`tsc --noEmit`) |
| `pnpm test` | Chạy bộ kiểm thử tự động (Component & Unit tests) |

---

## 📂 4. Cấu Trúc Thư Mục Chuẩn Monorepo (Feature-Driven)

```text
web-client/
├── public/                                  # Static assets (logo, minh họa)
├── src/
│   ├── app/                                 # Next.js App Router (Routing & Composition)
│   │   ├── (auth)/                          # Nhóm trang công khai (login, register)
│   │   ├── (dashboard)/                     # Nhóm trang có Navigation Sidebar
│   │   │   ├── admin/                       # Màn hình Admin (Quản trị User, Giám sát hệ thống)
│   │   │   ├── teacher/                     # Màn hình Giảng viên (Môn học, Ngân hàng câu hỏi, Đề thi, Ca thi)
│   │   │   └── student/                     # Màn hình Sinh viên (Dashboard, Lịch thi, Kết quả)
│   │   ├── exam/                            # Phòng thi trực tuyến (Focus Layout, Timer, Autosave)
│   │   │   └── [attemptId]/
│   │   ├── forbidden/page.tsx               # 403 Forbidden
│   │   ├── not-found.tsx                    # 404 Not Found
│   │   └── layout.tsx                       # Root Layout (Providers, Fonts, Toaster)
│   │
│   ├── features/                            # Tự đóng gói logic nghiệp vụ theo tính năng
│   │   ├── auth/                            # Đăng nhập, Profile, Guard
│   │   ├── users/                           # Quản lý người dùng
│   │   ├── subjects/                        # Môn học & Chủ đề
│   │   ├── questions/                       # Ngân hàng câu hỏi (Options JSON, Duyệt/Từ chối)
│   │   ├── exams/                           # Đề thi mẫu & Trình gắn câu hỏi
│   │   ├── exam-sessions/                   # Ca thi, Lập lịch, Gán thí sinh
│   │   ├── exam-taking/                     # Làm bài thi (Autosave, Timer, Proctoring Listener)
│   │   └── results/                         # Bảng điểm & Phúc khảo
│   │
│   ├── components/                          # UI Components dùng chung
│   │   ├── ui/                              # Button, Input, Select, Dialog, Card, Badge, Skeleton
│   │   ├── layout/                          # AppSidebar, AppHeader, PageContainer
│   │   └── feedback/                        # EmptyState, ErrorState, LoadingState
│   │
│   ├── lib/                                 # Cấu hình kỹ thuật
│   │   ├── api/                             # HTTP Client (Ky/Axios Wrapper) & Error Handler
│   │   ├── query/                           # TanStack Query Client & Query Keys Factory
│   │   └── utils/                           # cn helper, formatters
│   │
│   ├── types/                               # Common DTOs, API envelopes, Pagination
│   └── middleware.ts                        # Edge Middleware bảo vệ Route theo Role
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 5. Luồng Tích Hợp API (API Integration Pattern)

Tuân thủ nguyên tắc **không viết fetch rải rác trong component**:

```text
[Component UI]
      │
      ▼ (gọi hook nghiệp vụ)
[features/{domain}/hooks/useX.ts]
      │
      ▼ (quản lý cache & server state)
[TanStack Query: useQuery / useMutation]
      │
      ▼ (hàm gọi API thuần túy)
[features/{domain}/api/x.ts]
      │
      ▼ (tự động gắn Bearer Token & bắt lỗi tập trung)
[lib/api/client.ts]
      │
      ▼ HTTP Request
[Backend Laravel API: http://localhost:8000/api/v1]
```

---

## 🔒 6. Nguyên Tắc An Ninh Bắt Buộc (Security Guidelines)

1. **Tuyệt đối không lưu đáp án đúng (`correct_answer`)** trong bundle client hay local storage.
2. **Không lưu token thô vào `localStorage`** (tránh tấn công XSS). Token được lưu an toàn qua **HTTP-only, Secure Cookie**.
3. **Mọi form nhập liệu đều phải validate 2 lớp:**
   - Lớp 1 (Client): Zod Schema giúp trải nghiệm mượt mà, phản hồi tức thì.
   - Lớp 2 (Server): Laravel Form Request là chốt chặn cuối cùng; lỗi `422` được tự động map về input tương ứng.
4. **Edge Route Protection:** File `src/middleware.ts` tự động chặn các truy cập trái phép cấp URL (ví dụ: Sinh viên cố tình vào `/admin/*`), nhưng vẫn coi Laravel Policy là lớp bảo vệ thực sự.

---

## 🚀 7. Sẵn Sàng Triển Khai Lên Vercel (Vercel Ready)

Hệ thống được thiết kế hoàn toàn tương thích với kiến trúc serverless của **Vercel**:
- **Cấu hình Monorepo**: Đã tích hợp sẵn [`vercel.json`](./vercel.json) với bộ tiêu đề bảo mật HTTP (Security Headers) và cấu hình pnpm.
- **Reverse Proxy Chống CORS**: Tập tin [`next.config.ts`](./next.config.ts) định tuyến `/api/backend/*` sang Laravel Backend (`INTERNAL_BACKEND_URL`), đảm bảo cookies HttpOnly hoạt động hoàn hảo dưới dạng First-Party.
- **Tự động hóa CI/CD**: Hỗ trợ Preview Deployments cho PRs và Production Deployments qua GitHub Actions (`.github/workflows/deploy-frontend-vercel.yml`) hoặc Vercel GitHub App.
- Không sử dụng các module Node.js native nặng nề cấm kỵ; tách biệt rõ ràng biến môi trường build-time (`NEXT_PUBLIC_*`) và server-side (`INTERNAL_BACKEND_URL`).
