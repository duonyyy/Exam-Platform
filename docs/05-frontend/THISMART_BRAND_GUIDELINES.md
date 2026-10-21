# 🎨 ThiSmart — Cẩm Nang Nhận Diện Thương Hiệu & Quy Chuẩn Thiết Kế (Brand Identity & Guidelines)

> **Tài liệu chuẩn mực kỹ thuật & nhận diện thương hiệu cho dự án ThiSmart**  
> **Dự án:** Exam Platform → **ThiSmart**  
> **Định hướng thương hiệu:** **Concept 03 — Minimal Tech / Modern EdTech**  
> **Phiên bản:** 2.0 · Cập nhật: 2026-10-17  
> **Phạm vi áp dụng:** Toàn bộ Web Client (`web-client/`), Tài liệu thiết kế (`docs/05-frontend/`), Marketing và Phòng thi trực tuyến.  
> **Stack công nghệ:** Next.js 15+ App Router, React 19, TypeScript Strict Mode, Tailwind CSS, TanStack Query v5.

---

## 🌟 0. Triết Lý & Định Vị Thương Hiệu

**ThiSmart không phải tên placeholder.** Đây là tên sản phẩm chính thức xuất hiện nhất quán trên toàn bộ hệ thống: Landing page, Sidebar, Trang xác thực, Phòng thi trực tuyến (Focus Exam Room), Thông báo/Email, Metadata, Favicon và Tài liệu đào tạo.

- **Tên hiển thị chuẩn:** `ThiSmart` (viết hoa chữ `T` và `S`; không viết `Thismart`, `thismart`, hay `THISMART` trong văn bản thông thường).
- **Tên đầy đủ / Phụ đề:** `ThiSmart — Nền tảng Khảo thí & Đánh giá Trực tuyến` (Exam Platform).
- **Slogan chính thức:** `Thi thông minh. Đánh giá chính xác.`
- **Giá trị cốt lõi:** **Tin cậy · Rõ ràng · Tập trung · Hiện đại · Dễ tiếp cận**.
- **Đối tượng phục vụ:** Thí sinh (Sinh viên/Học viên), Giảng viên/Cán bộ coi thi, Quản trị viên khảo thí và Cơ sở giáo dục/Đào tạo.
- **Phong cách thẩm mỹ:** **Minimal Tech / Academic SaaS** — Thanh lịch, hiện đại, tối giản chi tiết trang trí thừa, đặt độ tin cậy và khả năng tập trung của người dùng lên hàng đầu.

> **Quy tắc ưu tiên tối thượng:**  
> **An toàn thi cử & Toàn vẹn nghiệp vụ > Trải nghiệm người dùng & Khả năng tiếp cận (Accessibility WCAG 2.2 AA) > Nhất quán thương hiệu > Yếu tố trang trí đồ họa.**  
> Tuyệt đối không thay đổi luồng nghiệp vụ backend, thuật toán tính điểm, cơ chế chống gian lận (Proctoring) hay quy trình nộp bài chỉ để chạy theo đồ họa marketing.

---

## 🎯 1. Ý Tưởng Thiết Kế Concept 03 (Minimal Tech)

Biểu tượng Logo chính thức của **ThiSmart** mang cấu trúc hình học giàu tính biểu tượng:

```text
       ┌──────────┐
       │ ▀▀▀▀▀▀▀▀ │  ← 1. Chữ "T" cách điệu hình học (ThiSmart)
       └───┐  ┌───┘
           │  │      ← 2. Các lớp giấy thi & giao diện số hóa
       ┌───┘  └───┐     (Ba nét ngang tượng trưng cho câu hỏi và bài thi)
       │ ════════ │
       │ ════════ │  ← 3. Dải chuyển màu Gradient Xanh dương → Cyan
       └──────────┘     (Sự tin cậy, công nghệ hiện đại, năng động vừa đủ)
```

1. **Chữ T cách điệu hình học:** Đại diện cho tên thương hiệu **ThiSmart**, vững chãi và chuẩn xác.
2. **Hình tượng bài thi / Danh sách câu hỏi:** Ba đường nét kẻ ngang gợi liên tưởng đến bài kiểm tra, ngân hàng câu hỏi và bảng đánh giá năng lực.
3. **Các lớp hình gấp nếp (Layers):** Thể hiện quy trình số hóa thi cử, sự tiến bộ liên tục và chiều sâu công nghệ.
4. **Dải màu Gradient Cyan → Royal Blue (`#06B6D4` $\rightarrow$ `#2563EB`):** Biểu trưng cho sự minh bạch, bảo mật, tri thức và tính tương tác cao.

> 🚫 **Điều cấm kỵ:**  
> Tuyệt đối **không thay thế** logo ThiSmart bằng các icon ngẫu nhiên như mũ tốt nghiệp, bóng đèn, sách mở, checkmark hay khiên bảo vệ từ thư viện Lucide/FontAwesome. Logo ThiSmart là tài sản sở hữu thương hiệu độc lập.

---

## 📦 2. Danh Mục Tài Sản Thương Hiệu (Brand Asset Manifest)

Toàn bộ tệp tin hình ảnh, biểu tượng và favicon đã được chuẩn hóa và triển khai trực tiếp tại thư mục tĩnh **`web-client/public/brand/`**:

| Tên Tệp Tin | Định dạng & Kích thước | Mục đích sử dụng | Vị trí hiển thị đề xuất |
| :--- | :--- | :--- | :--- |
| **`logo-horizontal-light.png`** | PNG trong suốt, 1406×451 | **Logo chính** trên nền sáng | TopBar, Sidebar expanded, Trang Login, Landing page |
| **`logo-horizontal-tagline-light.png`** | PNG trong suốt, 1448×481 | Logo + Slogan trên nền sáng | Banner giới thiệu, Hero section, Tài liệu hướng dẫn |
| **`logo-horizontal-tagline-dark.png`** | PNG trong suốt, 1442×469 | Logo + Slogan trên nền tối | Dark Hero, Footer tối màu, Bảng điều khiển ban đêm |
| **`logo-mark.png`** | PNG trong suốt, 1024×1024 | Biểu tượng T đơn độc | Sidebar collapsed, Header phòng thi thu gọn, App avatar |
| **`app-icon.png`** | PNG nền xanh vuông, 1024×1024 | Icon ứng dụng có nền bo góc | PWA mockup, Icon cài đặt thiết bị di động |
| **`icon.png`** | PNG trong suốt, 1024×1024 | Biểu tượng nguồn chất lượng cao | Master raster reference cho thiết kế |
| **`favicon.ico`** | Multi-size ICO | Favicon chuẩn trình duyệt | Thẻ `<link rel="icon">` trong root layout |
| **`favicon-16.png`** / **`favicon-32.png`** | PNG 16×16 & 32×32 | Favicon độ phân giải thấp | Tab trình duyệt, bookmark bar |
| **`favicon-48.png`** / **`favicon-64.png`** | PNG 48×48 & 64×64 | Favicon độ phân giải trung bình | Windows taskbar pin, macOS dock |
| **`favicon-192.png`** / **`favicon-512.png`** | PNG 192×192 & 512×512 | PWA Web App Manifest icons | Màn hình chính Android, Chrome install prompt |
| **`apple-touch-icon.png`** | PNG 180×180 | Biểu tượng cho thiết bị Apple | Safari iOS Add to Home Screen |
| **`og-image.png`** | PNG 1200×630 | Open Graph Preview Image | Xem trước khi chia sẻ link Facebook, Zalo, LinkedIn |
| **`manifest.json`** | JSON Metadata | Web App Manifest | Cấu hình PWA cho Next.js App Router |

### Thư mục tư liệu tham chiếu thiết kế (`docs/05-frontend/assets/`):
- **[`bang_tong_quan_nhan_dien_thuong_hieu.png`](assets/brand/bang_tong_quan_nhan_dien_thuong_hieu.png)**: Bảng vẽ concept nhận diện thương hiệu tổng thể (ThiSmart — Modern EdTech).
- **[`poster_cam_nang_thuong_hieu_mini.png`](assets/brand/poster_cam_nang_thuong_hieu_mini.png)**: Bảng tổng hợp quy chuẩn logo, màu sắc, font chữ và khoảng cách an toàn.
- **[`bang_quy_chuan_kich_thuoc_favicon.png`](assets/brand/bang_quy_chuan_kich_thuoc_favicon.png)**: Bản quy chuẩn biểu tượng nhận diện ở các tỷ lệ favicon & app tile.
- **[`he_thong_hoa_van_nen_thuong_hieu.png`](assets/brand/he_thong_hoa_van_nen_thuong_hieu.png)**: Bộ 6 hoa văn nền thương hiệu ứng dụng cho giao diện và ấn phẩm.
- **[`huong_dan_chuyen_dong_motion.png`](assets/brand/huong_dan_chuyen_dong_motion.png)**: Hướng dẫn vi tương tác, thông số gia tốc và thời gian chuyển động (motion specs).
- **[`minh_hoa_hero_quy_dao_bai_thi_3d.png`](assets/3d-illustrations/minh_hoa_hero_quy_dao_bai_thi_3d.png)** & bộ tranh 3D: Tranh minh họa 3D tính năng phòng thi, ngân hàng câu hỏi và khiên giám sát thi cử.
- **[`Bộ minh họa 3D tính năng cao cấp`](assets/README.md#2-bộ-8-tranh-minh-họa-3d-độc-lập-chất-lượng-cao-3d-illustrations)**: Trọn bộ 8 tác phẩm 3D tính năng độc lập chuẩn phân giải cao (1254px – 1672px).


---

## 🎨 3. Hệ Thống Token Thiết Kế (Design Tokens & Color Palette)

### 3.1. Bảng Màu Thương Hiệu (Semantic Color Palette)

```css
:root {
  /* Brand Core Tokens */
  --brand-primary: #2563EB;        /* Blue 600 - CTA chính, Active item, Focus ring */
  --brand-primary-hover: #1D4ED8;  /* Blue 700 - Hover nút chính */
  --brand-primary-soft: #EFF6FF;   /* Blue 50 - Nền mục được chọn, Highlight nhẹ */
  --brand-accent: #06B6D4;         /* Cyan 500 - Điểm nhấn công nghệ, Tiến độ thi */
  --brand-accent-hover: #0891B2;   /* Cyan 600 - Hover accent */

  /* Neutral Typography & Surface */
  --brand-ink: #0F172A;            /* Slate 900 - Tiêu đề, Nội dung chữ chính (AAA) */
  --brand-muted: #475569;          /* Slate 600 - Nhãn phụ, Metadata, Caption */
  --brand-muted-light: #94A3B8;    /* Slate 400 - Placeholder, Border phụ */
  --brand-bg: #F8FAFC;             /* Slate 50 - Nền trang (Dịu mắt khi thi dài) */
  --brand-surface: #FFFFFF;        /* Trắng - Nền card, Dialog, Question box */
  --brand-border: #E2E8F0;         /* Slate 200 - Đường phân cách, Viền input */

  /* Functional Status Tokens (Bảng màu chức năng chuẩn mực — Minimal Tech / Academic SaaS) */
  /* Success: Sắc ngọc Jade / Teal-Emerald — Dịu mắt, ăn nhập hoàn hảo với Royal Blue & Cyan */
  --brand-success: #059669;        /* Emerald 600 - Đã lưu đáp án thành công, Điểm đạt, Trạng thái hoạt động */
  --brand-success-hover: #047857;  /* Emerald 700 - Hover nút thành công */
  --brand-success-soft: #ECFDF5;   /* Emerald 50 - Nền badge thành công (Mint sương mai thanh nhã) */
  --brand-success-border: #A7F3D0; /* Emerald 200 - Viền badge thành công */
  --brand-success-text: #065F46;   /* Emerald 800 - Chữ trạng thái đạt chuẩn WCAG AAA (7.5:1) */

  /* Warning: Sắc mật ong Honey Amber — Ấm áp, cảnh báo học thuật, không chói gắt như vàng giao thông */
  --brand-warning: #D97706;        /* Amber 600 - Cảnh báo sắp hết giờ, Đánh dấu xem lại câu hỏi */
  --brand-warning-hover: #B45309;  /* Amber 700 - Hover cảnh báo */
  --brand-warning-soft: #FFFBEB;   /* Amber 50 - Nền badge cảnh báo (Sắc giấy ngà ấm áp) */
  --brand-warning-border: #FDE68A; /* Amber 200 - Viền badge cảnh báo */
  --brand-warning-text: #92400E;   /* Amber 800 - Chữ cảnh báo đạt chuẩn WCAG AA (6.2:1) */

  /* Danger: Sắc hồng ngọc Rose Crimson — Thanh lịch, nghiêm cẩn, không gây căng thẳng như đỏ cờ */
  --brand-danger: #E11D48;         /* Rose 600 - Mất kết nối, Lỗi nộp bài, Cờ vi phạm giám sát AI */
  --brand-danger-hover: #BE123C;   /* Rose 700 - Hover nút nguy hiểm */
  --brand-danger-soft: #FFF1F2;    /* Rose 50 - Nền badge nguy hiểm (Sắc cánh hoa dịu mắt) */
  --brand-danger-border: #FECDD3;  /* Rose 200 - Viền badge lỗi */
  --brand-danger-text: #9F1239;    /* Rose 800 - Chữ cảnh báo nguy hiểm đạt chuẩn WCAG AAA (7.1:1) */
}

/* Chế độ Dark Theme (Tùy chọn cho Dashboard & Giám thị) */
.dark {
  --brand-bg: #0B1220;
  --brand-surface: #111C32;
  --brand-ink: #F8FAFC;
  --brand-muted: #CBD5E1;
  --brand-border: #334155;
  --brand-primary-soft: #1E3A5F;

  /* Functional Status Tokens (Dark theme) */
  --brand-success: #10B981;
  --brand-success-soft: rgba(16, 185, 129, 0.12);
  --brand-success-border: rgba(52, 211, 153, 0.28);
  --brand-success-text: #6EE7B7;

  --brand-warning: #F59E0B;
  --brand-warning-soft: rgba(245, 158, 11, 0.12);
  --brand-warning-border: rgba(251, 191, 36, 0.28);
  --brand-warning-text: #FDE68A;

  --brand-danger: #F43F5E;
  --brand-danger-soft: rgba(244, 63, 94, 0.12);
  --brand-danger-border: rgba(251, 113, 133, 0.28);
  --brand-danger-text: #FECDD3;
}
```

### 3.2. Quy Tắc Sử Dụng Gradient & Màu Nổi (Cyan)
- **Gradient chính thức:** `linear-gradient(120deg, #2563EB 0%, #06B6D4 100%)`.
- **Phạm vi dùng Gradient:** Chỉ áp dụng cho Hero banner trang chủ, Logo biểu tượng, và thanh tiến độ hoàn thành bài thi (`ExamProgress`).
- ❌ **Cấm:** Không phủ gradient lên toàn bộ nền phòng thi, không dùng gradient cho văn bản câu hỏi, và không dùng cyan `#06B6D4` cho chữ nhỏ trên nền trắng vì vi phạm độ tương phản WCAG 2.2 AA.

### 3.3. Typography (Kiểu Chữ)
- **Bộ font ưu tiên:** **Inter** hoặc **Geist Sans** (Hỗ trợ tiếng Việt đầy đủ 100%, rõ ràng ở kích thước nhỏ).
- **Tiêu đề màn hình chính:** `24px – 30px`, font-weight `700` (Bold), letter-spacing `-0.02em`.
- **Tiêu đề khu vực (Section):** `18px – 20px`, font-weight `600` (Semibold).
- **Văn bản câu hỏi thi (`QuestionStatement`):** `16px – 18px`, line-height `1.65`, font-weight `500`. Dòng chữ không trải quá 800px để tránh mỏi mắt.
- **Phương án trả lời (`OptionCard`):** `14px – 15px`, line-height `1.5`, padding dọc rộng rãi (tối thiểu `44px` chiều cao tương tác).
- **Đồng hồ đếm ngược (`ExamTimer`):** Bắt buộc sử dụng `font-variant-numeric: tabular-nums` để cố định chiều rộng các chữ số khi nhảy giây.

### 3.4. Khoảng Cách & Bo Góc (Spacing & Radius Scale)
- **Hệ thống Spacing 4px:** `4, 8, 12, 16, 20, 24, 32, 40, 48px`.
- **Bo góc (Border Radius):**
  - Nút bấm & Ô nhập liệu (`Button`, `Input`): `8px – 10px` (`rounded-lg`).
  - Thẻ phương án & Palette câu hỏi (`OptionCard`, `NumButton`): `10px – 12px`.
  - Hộp câu hỏi & Bảng điều khiển (`QuestionCard`, `WhitePanel`): `14px – 16px` (`rounded-2xl`).
  - Hộp thoại xác nhận (`Modal`, `AlertDialog`): `18px – 20px`.
- **Độ đổ bóng (Box Shadows):** Rất nhẹ và tự nhiên (`0 4px 16px rgba(15, 23, 42, 0.04)`), phân tách khối chủ yếu bằng viền mỏng `1px border-border`.

---

## 📐 4. Quy Chuẩn Sử Dụng Logo Trong Giao Diện

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│ ĐƯỢC PHÉP                                                                      │
│ ✓ Dùng logo-horizontal-light trên nền trắng #FFFFFF hoặc xám dịu #F8FAFC       │
│ ✓ Dùng logo-horizontal-tagline-dark trên nền Navy tối #0B1220                  │
│ ✓ Dùng logo-mark (biểu tượng T) khi thu nhỏ Sidebar hoặc trên màn hình Mobile  │
│ ✓ Đảm bảo Clear Space xung quanh logo tối thiểu bằng 1/4 chiều cao icon        │
│                                                                                │
│ CẤM TUYỆT ĐỐI                                                                  │
│ ❌ Không bóp méo tỷ lệ (Stretching/Squishing), xoay nghiêng hoặc thêm drop-shadow│
│ ❌ Không đổi màu logo bằng CSS filter (invert, hue-rotate)                     │
│ ❌ Không đặt logo bản sáng lên nền đen hoặc logo bản tối lên nền trắng         │
│ ❌ Không tự ý thay chữ "ThiSmart" thành biểu tượng mũ cử nhân / Lucide icons   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Kích Thước Khuyến Nghị Theo Khu Vực:
- **Header TopBar Desktop:** Chiều cao logo `32px – 38px`, `width: auto`.
- **Sidebar Khảo Thí (Expanded):** Chiều cao logo `28px – 34px`.
- **Sidebar Thu Gọn (Collapsed):** Sử dụng `logo-mark.png` kích thước `32×32px`.
- **Phòng thi Focus Room:** Biểu tượng `logo-mark.png` `28×28px` kèm chữ `ThiSmart` tinh gọn, không chiếm không gian câu hỏi.
- **Hero Trang Đăng Nhập:** Chiều cao logo `40px – 48px`.

---

## 👥 5. Hướng Dẫn Trải Nghiệm Theo Từng Vai Trò (Role-Based UX)

### 5.1. Phân Hệ Thí Sinh & Phòng Thi (`SCR-STU-03: Focus Exam Room`)
- **Triết lý:** **Calm, Focused, Zero Distraction**. Đây là không gian thi cử nghiêm túc, không phải trang marketing.
- **Layout:** Focus Shell độc lập — Loại bỏ hoàn toàn Sidebar, TopBar hệ thống và Footer.
- **Header:** Chỉ chứa `BrandLogo` tinh gọn, tên môn học, mã thí sinh, đồng hồ đếm ngược và thanh trạng thái đồng bộ (`Đang lưu...`, `Đã lưu`, `Mất kết nối`).
- **Trạng thái lưu đáp án (Authoritative Feedback):**
  - 🔄 **Đang lưu...**: Màu xanh dương dịu (`--brand-primary`), icon xoay nhẹ.
  - ✅ **Đã lưu**: Màu xanh lá cây (`--brand-success`), icon đám mây có dấu tích.
  - ⚠️ **Mất mạng / Chưa đồng bộ**: Màu đỏ (`--brand-danger`), hiển thị banner cảnh báo và nút thử kết nối lại.

### 5.2. Phân Hệ Giảng Viên (Teacher Workspace)
- **Triết lý:** **Structured, Efficient, High Density**.
- **Trọng tâm:** Quản lý Môn học & Chủ đề, Soạn thảo ngân hàng câu hỏi 4 loại, Tạo đề thi mẫu, Lập lịch ca thi và Giám sát trực tiếp (Live Proctoring Console).
- **Giao diện:** Bảng dữ liệu (`DataTable`), Bộ lọc đa tiêu chí, Pagination rõ ràng, Thao tác phím tắt nhanh.

### 5.3. Phân Hệ Quản Trị Viên (Admin Workspace)
- **Triết lý:** **Trustworthy, Operational, Audit-Friendly**.
- **Trọng tâm:** Thống kê toàn trường, Quản lý tài khoản người dùng & RBAC, Nhật ký kiểm toán bất biến (Audit Logs) và Cấu hình tham số hệ thống.

---

## 💻 6. Tích Hợp Vào Mã Nguồn Next.js 15+ App Router

### 6.1. Component `BrandLogo.tsx` Chuẩn Hóa
Đường dẫn: `web-client/src/components/branding/BrandLogo.tsx`

```tsx
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  theme?: 'light' | 'dark';
  withTagline?: boolean;
  compact?: boolean;
  href?: string;
  className?: string;
}

export function BrandLogo({
  theme = 'light',
  withTagline = false,
  compact = false,
  href = '/',
  className = '',
}: BrandLogoProps) {
  // Khi ở dạng thu gọn (Icon Only)
  if (compact) {
    const logoContent = (
      <Image
        src="/brand/logo-mark.png"
        alt="ThiSmart Logo"
        width={1024}
        height={1024}
        priority
        className={`h-9 w-9 object-contain ${className}`}
      />
    );
    return href ? <Link href={href} aria-label="ThiSmart Trang chủ">{logoContent}</Link> : logoContent;
  }

  // Chọn tệp hình ảnh theo theme và tagline
  let src = '/brand/logo-horizontal-light.png';
  let width = 1406;
  let height = 451;

  if (withTagline) {
    if (theme === 'dark') {
      src = '/brand/logo-horizontal-tagline-dark.png';
      width = 1442;
      height = 469;
    } else {
      src = '/brand/logo-horizontal-tagline-light.png';
      width = 1448;
      height = 481;
    }
  }

  const logoImg = (
    <Image
      src={src}
      alt="ThiSmart — Thi thông minh. Đánh giá chính xác."
      width={width}
      height={height}
      priority
      className={`h-9 w-auto object-contain ${className}`}
    />
  );

  return href ? (
    <Link href={href} className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
      {logoImg}
    </Link>
  ) : (
    logoImg
  );
}
```

### 6.2. Cấu Hình Metadata & Favicons trong `app/layout.tsx`

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'ThiSmart — Nền tảng Khảo thí & Đánh giá Trực tuyến',
    template: '%s | ThiSmart',
  },
  description: 'Hệ thống tổ chức thi và khảo thí trực tuyến an toàn, chuẩn mực và chống gian lận.',
  applicationName: 'ThiSmart',
  icons: {
    icon: [
      { url: '/brand/favicon.ico', sizes: 'any' },
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://thismart.edu.vn',
    siteName: 'ThiSmart',
    title: 'ThiSmart — Thi thông minh. Đánh giá chính xác.',
    description: 'Nền tảng tổ chức thi và khảo thí trực tuyến hiện đại dành cho giáo dục.',
    images: [
      {
        url: '/brand/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ThiSmart Platform Preview',
      },
    ],
  },
};
```

---

## ✅ 7. Danh Sách Kiểm Tra Nhận Diện Thương Hiệu (Brand DoD)

Trước khi nghiệm thu bất kỳ màn hình hoặc tính năng frontend nào, lập trình viên bắt buộc phải đối chiếu:

- [ ] Tên thương hiệu hiển thị đúng chuẩn `ThiSmart` trên giao diện, thanh tiêu đề, breadcrumbs và email/receipt.
- [ ] Logo sử dụng trực tiếp từ thư mục `/brand/`, đúng phiên bản sáng/tối phù hợp với màu nền xung quanh.
- [ ] Không có hiện tượng biến dạng logo (sai tỷ lệ khung hình `aspect-ratio`).
- [ ] Favicon hiển thị sắc nét trên các tab trình duyệt (đã kiểm thử ở 16px và 32px).
- [ ] Slogan chính thức được viết chuẩn xác: `Thi thông minh. Đánh giá chính xác.`
- [ ] Màu sắc tuân thủ bảng mã semantic token (`#2563EB`, `#06B6D4`, `#0F172A`, `#F8FAFC`).
- [ ] Phòng thi giữ vững nguyên tắc Focus Shell: không chứa banner quảng cáo hay trang trí gây phân tâm.
- [ ] Tất cả trạng thái tương tác (`hover`, `focus-visible`, `active`, `disabled`, `loading`) đều được thiết kế chỉn chu.
