# 🔐 Phân Hệ Xác Thực: Hồ Sơ Wireframe (01-AUTH-WIREFRAMES)

**Dự án**: ThiSmart (Exam Platform)  
**Đường dẫn**: `docs/05-frontend/wireframe/01-AUTH-WIREFRAMES.md`  
**Thương hiệu & Bản sắc**: **ThiSmart Concept 03 — Minimal Tech / Modern EdTech** (Chi tiết: [`THISMART_BRAND_GUIDELINES.md`](../THISMART_BRAND_GUIDELINES.md))  
**Slogan**: *Thi thông minh. Đánh giá chính xác.*  
**Nhóm màn hình**: Xác thực người dùng (Authentication & Identity)  
**Tài liệu liên quan**:
- Backend API: [`POST /api/v1/auth/login`](../../03-architecture-api/12-API_DESIGN.md), `POST /api/v1/auth/register`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`
- Cơ sở dữ liệu: Bảng [`users`](../../02-domain-database/09-DATABASE_DESIGN.md), [`personal_access_tokens`](../../02-domain-database/09-DATABASE_DESIGN.md)

---

## 1. `SCR-AUTH-01`: Màn Hình Đăng Nhập (Login Screen)

### 1.1. Thông Tin Chung
- **Đường dẫn URL**: `/login` (Tệp: `app/(auth)/login/page.tsx`)
- **Actor sử dụng**: Thí sinh (`student`), Giảng viên (`teacher`), Quản trị viên (`admin`).
- **Mục tiêu**: Xác thực người dùng thông qua Email và Mật khẩu, cấp Sanctum Token và điều hướng đến Dashboard theo vai trò.

### 1.2. Wireframe Bố Cục Desktop (1440px - Bố cục Split Screen)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ [ BANNER QUẢNG BÁ KHẢO THÍ - 50% ]          │ [ KHUNG ĐĂNG NHẬP (FORM CARD) - 50% ]    │
│                                             │                                          │
│                                             │  [Logo Mark] ThiSmart                    │
│                                             │  Cổng Khảo Thí & Đánh Giá Trực Tuyến     │
│   ┌─────────────────────────────────────┐   │                                          │
│   │                                     │   │  Chào mừng trở lại!                      │
│   │   [ Minh họa Phòng thi Thông minh ] │   │  Vui lòng đăng nhập để tiếp tục làm bài. │
│   │                                     │   │                                          │
│   │   "Hệ thống khảo thí an toàn,       │   │  ┌─────────────────────────────────────┐ │
│   │    minh bạch, chuẩn xác với         │   │  │ [!] Email hoặc mật khẩu không chính │ │
│   │    kiểm soát tranh chấp đồng thời   │   │  │     xác. Vui lòng kiểm tra lại.     │ │
│   │    và phòng chống gian lận"         │   │  └─────────────────────────────────────┘ │
│   │                                     │   │                                          │
│   │   • Giám sát cảm biến trình duyệt   │   │  Email / Mã định danh:                   │
│   │   • Tự động lưu đáp án tức thì      │   │  [ nguyenvana@student.edu.vn           ] │
│   │   • Chấm điểm chuẩn hóa máy chủ     │   │                                          │
│   │                                     │   │  Mật khẩu:                               │
│   └─────────────────────────────────────┘   │  [ ••••••••••••••••••••••••••••  [👁]  ] │
│                                             │                                          │
│   Phiên bản v2.0-STABLE                     │  [✓] Ghi nhớ đăng nhập   Quên mật khẩu?  │
│   Hỗ trợ tiêu chuẩn WCAG 2.2 AA             │                                          │
│                                             │  [=====================================] │
│                                             │  [        ĐĂNG NHẬP (Primary CTA)      ] │
│                                             │  [=====================================] │
│                                             │                                          │
│                                             │  Bạn là sinh viên mới chưa có tài khoản? │
│                                             │  👉 [Đăng ký tài khoản dự thi tại đây]   │
│                                             │                                          │
│                                             │  ────────────── HỖ TRỢ ────────────────  │
│                                             │  📞 Tổng đài Kỹ thuật: (024) 3754.7890   │
└─────────────────────────────────────────────┴──────────────────────────────────────────┘
```

### 1.3. Wireframe Bố Cục Mobile (< 768px)
```text
┌─────────────────────────────────────────┐
│ [Logo Mark] ThiSmart                    │
│                                         │
│ Chào mừng bạn!                          │
│ Đăng nhập hệ thống khảo thí trực tuyến  │
│                                         │
│ Email / Mã sinh viên:                   │
│ [ nguyenvana@student.edu.vn           ] │
│                                         │
│ Mật khẩu:                               │
│ [ ••••••••••••••••••••••••••••   [👁]  ]│
│                                         │
│ [✓] Ghi nhớ          Quên mật khẩu?     │
│                                         │
│ [=====================================] │
│ [              ĐĂNG NHẬP              ] │
│ [=====================================] │
│                                         │
│ Chưa có tài khoản? [Đăng ký dự thi]     │
│                                         │
│ ─────────────────────────────────────── │
│ © 2026 Đại học Quốc Gia • Phòng Khảo Thí│
└─────────────────────────────────────────┘
```

### 1.4. Thành Phần Dữ Liệu & Ràng Buộc Kiểm Lỗi (Validation Rules)
| Trường dữ liệu | Loại điều khiển | Quy tắc Validation (Zod Schema) | Thông báo lỗi hiển thị |
| :--- | :--- | :--- | :--- |
| `email` | `input[type="email"]` | `z.string().email().max(255)` | "Email không đúng định dạng." |
| `password` | `input[type="password"]` | `z.string().min(6).max(255)` | "Mật khẩu phải chứa ít nhất 6 ký tự." |
| `remember` | `input[type="checkbox"]` | `z.boolean().optional()` | Không |

### 1.5. Kịch Bản Tương Tác & Trạng Thái (UI States)
1. **Trạng thái Trống (Idle)**: Nút "Đăng nhập" ở trạng thái sẵn sàng.
2. **Trạng thái Đang gửi (Submitting)**: Nút "Đăng nhập" bị vô hiệu hóa, hiển thị icon Spinner quay tròn: `Đang xác thực...`.
3. **Trạng thái Sai thông tin (401 Unauthorized)**: Hiển thị Banner đỏ đầu Form: *"Email hoặc mật khẩu không chính xác."*
4. **Trạng thái Quá số lần thử (429 Too Many Requests)**: Form bị khóa trong 60 giây kèm đồng hồ đếm ngược: *"Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 54 giây."*
5. **Điều hướng sau khi thành công (200 OK)**:
   - Nếu `user.role === 'student'` $\rightarrow$ Điều hướng sang `/student/exams`.
   - Nếu `user.role === 'teacher'` $\rightarrow$ Điều hướng sang `/teacher`.
   - Nếu `user.role === 'admin'` $\rightarrow$ Điều hướng sang `/admin`.

---

## 2. `SCR-AUTH-02`: Màn Hình Đăng Ký Tài Khoản Thí Sinh (Register)

### 2.1. Thông Tin Chung
- **Đường dẫn URL**: `/register` (Tệp: `app/(auth)/register/page.tsx`)
- **Actor sử dụng**: Thí sinh tự do hoặc Sinh viên tạo tài khoản thi.
- **Mục tiêu**: Thu thập thông tin định danh sinh viên, tạo tài khoản vai trò `student` trong bảng `users`.

### 2.2. Wireframe Bố Cục Desktop & Tablet
```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                     THISMART                                            │
│                ┌────────────────────────────────────────────────────────┐               │
│                │  [Logo Mark] ĐĂNG KÝ TÀI KHOẢN SINH VIÊN               │               │
│                │  Tạo tài khoản để tham gia các kỳ thi trực tuyến       │               │
│                │                                                        │               │
│                │  Họ và tên thí sinh:                                   │               │
│                │  [ Nguyễn Văn A                                      ] │               │
│                │                                                        │               │
│                │  Mã số sinh viên (MSSV):                               │               │
│                │  [ 21020015                                          ] │               │
│                │                                                        │               │
│                │  Email trường cấp (hoặc email cá nhân):                │               │
│                │  [ 21020015@vnu.edu.vn                               ] │               │
│                │                                                        │               │
│                │  Mật khẩu khởi tạo:                                    │               │
│                │  [ •••••••••••••••••••••••••••••                [👁] ] │               │
│                │  Độ mạnh: [████████░░░░] Khá (Tối thiểu 8 ký tự)       │               │
│                │                                                        │               │
│                │  Xác nhận lại mật khẩu:                                │               │
│                │  [ •••••••••••••••••••••••••••••                [👁] ] │               │
│                │                                                        │               │
│                │  [✓] Tôi cam kết thông tin cá nhân trên là chính xác   │               │
│                │      và tuân thủ Quy chế thi trực tuyến.               │               │
│                │                                                        │               │
│                │  [==================================================]  │               │
│                │  [          ĐĂNG KÝ TÀI KHOẢN DỰ THI                ]  │               │
│                │  [==================================================]  │               │
│                │                                                        │               │
│                │  Đã có tài khoản? 👉 [Đăng nhập vào hệ thống]          │               │
│                └────────────────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.3. Quy Tắc Validation & Xử Lý Lỗi
- `name`: Tối thiểu 2 ký tự, không chứa ký tự đặc biệt gây script injection.
- `email`: Duy nhất trong hệ thống (kiểm tra `UNIQUE` trên bảng `users`). Nếu trùng trả về lỗi: *"Email này đã được đăng ký tài khoản trong hệ thống."*
- `password_confirmation`: Bắt buộc trùng khớp chính xác với `password`.
- Sau khi đăng ký thành công: Tự động đăng nhập và chuyển hướng sang `/student/exams` kèm Toast thông báo chào mừng.

---

## 3. `SCR-AUTH-03`: Quên Mật Khẩu & Đặt Lại Mật Khẩu (Forgot Password)

### 3.1. Thông Tin Chung
- **Đường dẫn URL**: `/forgot-password` và `/reset-password`
- **Mục tiêu**: Cho phép thí sinh hoặc giảng viên khôi phục quyền truy cập tài khoản thông qua liên kết xác thực an toàn gửi về email.

### 3.2. Wireframe Bố Cục Giao Diện
```text
┌─────────────────────────────────────────────────────────────┐
│                    KHÔI PHỤC MẬT KHẨU                       │
│                                                             │
│  Nhập email đã đăng ký của bạn. Hệ thống sẽ gửi một mã      │
│  xác thực (hoặc đường dẫn an toàn) để đặt lại mật khẩu mới. │
│                                                             │
│  Email tài khoản:                                           │
│  [ nguyenvana@student.edu.vn                              ] │
│                                                             │
│  [=======================================================]  │
│  [              GỬI HƯỚNG DẪN ĐẶT LẠI MẬT KHẨU           ]  │
│  [=======================================================]  │
│                                                             │
│  ← [Quay lại màn hình Đăng nhập]                            │
└─────────────────────────────────────────────────────────────┘
                            ↓↓↓ (Sau khi gửi thành công)
┌─────────────────────────────────────────────────────────────┐
│                 ĐÃ GỬI LIÊN KẾT XÁC THỰC!                   │
│                  [Icon Hộp Thư Xanh Lá]                     │
│                                                             │
│  Chúng tôi đã gửi email hướng dẫn đến:                      │
│  👉 nguyenvana@student.edu.vn                               │
│                                                             │
│  Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam) và làm   │
│  theo hướng dẫn trong vòng 15 phút.                         │
│                                                             │
│  Chưa nhận được email? [Gửi lại mã sau 45s]                 │
└─────────────────────────────────────────────────────────────┘
```
