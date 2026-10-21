# 📁 Thư Mục Lưu Trữ Tài Sản Thiết Kế & Minh Họa (Design Assets & Creative Archive)

Thư mục này là **Kho tư liệu thiết kế master toàn diện** của nền tảng **ThiSmart**, lưu trữ các tài sản đồ họa chuẩn nhận diện thương hiệu, tranh minh họa 3D tính năng cao cấp (Full HD / 4K), bộ icon 3D và bản chụp giao diện (mockups).

> ℹ️ **Ghi chú quan trọng cho Lập trình viên:**  
> - Toàn bộ tên tệp đồ họa, tranh minh họa và icon nội bộ được chuẩn hóa theo định dạng **tiếng Việt không dấu gạch dưới (`snake_case`)** đồng bộ và trực quan.
> - Tài nguyên phục vụ trực tiếp lúc chạy (Runtime Assets) của ứng dụng web được lưu tại:  
>   🔗 **[`web-client/public/brand/`](../../../web-client/public/brand/)**  
> - Quy chuẩn sử dụng thương hiệu và token chi tiết xem tại:  
>   🔗 **[`docs/05-frontend/THISMART_BRAND_GUIDELINES.md`](../THISMART_BRAND_GUIDELINES.md)**.
> - Toàn bộ các hình ảnh tại đây đều đạt tiêu chuẩn độ phân giải cao (từ 1024px đến 1672px), ánh sáng 3D chân thực, sắc nét.

---

## 🗂️ Cấu Trúc Phân Tầng Thư Mục `assets/`

```text
docs/05-frontend/assets/
├── README.md                                    # [BẠN ĐANG Ở ĐÂY] Hướng dẫn tra cứu & bản đồ tài nguyên
│
├── brand/                                       # Nhận diện thương hiệu, Bảng Master, Logo & Favicon
│   ├── bang_tong_quan_nhan_dien_thuong_hieu.png # Concept board nhận diện thương hiệu tổng thể (1448×1086)
│   ├── poster_cam_nang_thuong_hieu_mini.png     # Poster cẩm nang thương hiệu thu nhỏ (1448×1086)
│   ├── bang_quy_chuan_kich_thuoc_favicon.png    # Bảng quy chuẩn kích thước biểu tượng (1448×1086)
│   ├── he_thong_hoa_van_nen_thuong_hieu.png     # Hệ thống 6 hoa văn nền thương hiệu cao cấp (1448×1086)
│   ├── huong_dan_chuyen_dong_motion.png         # Hướng dẫn vi chuyển động & animation (1672×941)
│   ├── bieu_tuong_ung_dung_squircle_3d.png      # Biểu tượng ứng dụng 3D Squircle đổ bóng gương (1254×1254)
│   ├── bieu_tuong_logo_chu_t_3d.png             # Biểu tượng chữ T 3D độc lập (1254×1254)
│   ├── logo_ngang_thuong_hieu_3d.png            # Logo ngang 3D (1448×1086)
│   ├── logo_ngang_slogan_nen_toi_3d.png         # Logo ngang 3D kèm slogan nền tối (1448×1086)
│   ├── logo_ngang_slogan_nen_sang_3d.png        # Logo ngang 3D kèm slogan nền sáng (1448×1086)
│   ├── logo_ngang_nen_sang.png                  # Logo ngang nền sáng (1406×451)
│   ├── logo_ngang_kem_slogan_nen_toi.png        # Logo ngang kèm slogan nền tối (1442×469)
│   ├── logo_ngang_kem_slogan_nen_sang.png       # Logo ngang kèm slogan nền sáng (1448×481)
│   ├── bieu_tuong_logo_chu_t.png                # Biểu tượng chữ T độc lập (1024×1024)
│   ├── bieu_tuong_goc_master.png                # Master Icon 1024×1024
│   ├── bieu_tuong_ung_dung_pwa.png              # Biểu tượng ứng dụng PWA (1024×1024)
│   ├── anh_chia_se_mang_xa_hoi_og.png           # Ảnh preview Open Graph chuẩn mạng xã hội (1200×630)
│   ├── apple-touch-icon.png                     # Icon cho thiết bị iOS (180×180 - chuẩn web)
│   ├── favicon.ico                              # Multi-size ICO chuẩn trình duyệt (chuẩn web)
│   ├── favicon-16.png ... favicon-512.png       # Favicon các kích cỡ (chuẩn web)
│   └── manifest.json                            # Web App Manifest cho PWA (chuẩn web)
│
├── 3d-illustrations/                            # Tranh minh họa 3D tính năng cao cấp (Full HD / 4K)
│   ├── minh_hoa_hero_quy_dao_bai_thi_3d.png     # Hero: Quỹ đạo bài thi thông minh 3D (1672×941)
│   ├── minh_hoa_tinh_nang_ngan_hang_cau_hoi_3d.png  # Ngân hàng câu hỏi & Thư mục chủ đề 3D (1254×1254)
│   ├── minh_hoa_tinh_nang_phong_thi_focus_3d.png    # Phòng thi Focus Mode & Autosave (1254×1254)
│   ├── minh_hoa_tinh_nang_giam_sat_bao_mat_3d.png   # Khiên bảo mật & Giám sát ca thi (1254×1254)
│   ├── minh_hoa_tinh_nang_thiet_ke_de_thi_3d.png    # Thiết kế đề thi & Ma trận câu hỏi (1448×1086)
│   ├── minh_hoa_tinh_nang_lap_lich_ca_thi_3d.png    # Lập lịch ca thi & Phân công thí sinh (1448×1086)
│   ├── minh_hoa_tinh_nang_cham_diem_thong_ke_3d.png # Chấm điểm tức thì & Báo cáo phổ điểm (1448×1086)
│   └── minh_hoa_tinh_nang_phan_quyen_nguoi_dung_3d.png # Người dùng & Ma trận phân quyền RBAC (1448×1086)
│
├── icon/                                        # Bộ icon 3D tính năng, giao diện & hoa văn trang trí
│   ├── hero_quy_dao_bai_thi.png                 # Icon tính năng Hero / Quỹ đạo bài thi
│   ├── ngan_hang_cau_hoi_3d.png                 # Icon Ngân hàng câu hỏi 3D
│   ├── phong_thi_focus_3d.png                   # Icon Phòng thi Focus Mode 3D
│   ├── giam_sat_bao_mat_3d.png                  # Icon Giám sát & An ninh bảo mật 3D
│   ├── thiet_ke_de_thi_3d.png                   # Icon Thiết kế đề thi 3D
│   ├── lap_lich_ca_thi_3d.png                   # Icon Lập lịch ca thi 3D
│   ├── cham_diem_thong_ke_3d.png                # Icon Chấm điểm & Thống kê 3D
│   ├── vai_tro_nguoi_dung_3d.png                # Icon Vai trò người dùng & RBAC 3D
│   ├── tich_hop_he_thong_api.png                # Icon Tích hợp hệ thống API
│   ├── 01_trac_nghiem.png ... 10_luu_tru_api.png# 10 icon nghiệp vụ chính
│   ├── 11_bieu_tuong_lam_moi.png ... 20_bieu_tuong_cai_dat.png # 10 icon công cụ & thao tác
│   ├── 21_hoa_tiet_cham.png ... 26_nen_song_03.png # 6 hoa văn & lưới nền
│   ├── 27_minh_hoa_trang_tri.png ... 31_may_bay_giay.png # 5 hình khối & chi tiết trang trí 3D
│   └── assets.json                              # Metadata mô tả bộ icon
│
└── mockups/                                     # Bản chụp giao diện thực tế (Desktop & Mobile)
    ├── giao_dien_may_tinh_desktop.png           # Ảnh chụp giao diện Desktop máy tính bàn (1440×976)
    ├── giao_dien_dien_thoai_mobile.png          # Ảnh chụp giao diện Mobile điện thoại (390×1070)
    └── exam-platform-ui-preview.html            # Bản xem trước tương tác độc lập (HTML)
```

---

## 🎨 1. Bảng Tra Cứu Hệ Thống Thương Hiệu Master (`brand/`)

| Tên Tệp Tiếng Việt (`snake_case`) | Độ Phân Giải | Mô Tả Nội Dung | Mục Đích Sử Dụng |
| :--- | :---: | :--- | :--- |
| **[`bang_tong_quan_nhan_dien_thuong_hieu.png`](brand/bang_tong_quan_nhan_dien_thuong_hieu.png)** | 1448×1086 | Bảng tổng quan nhận diện thương hiệu ThiSmart: Biểu tượng chữ T, Wordmark, Tagline, App Icon, Bảng màu và Preview giao diện. | Thuyết trình thương hiệu, onboarding thành viên |
| **[`poster_cam_nang_thuong_hieu_mini.png`](brand/poster_cam_nang_thuong_hieu_mini.png)** | 1448×1086 | Cẩm nang thương hiệu thu nhỏ: Logo chính, Logo đảo màu nền tối, Bảng mã màu HEX, Font chữ đề xuất (Inter) và Khoảng cách an toàn. | Quick-reference poster cho UI/UX Designer |
| **[`bang_quy_chuan_kich_thuoc_favicon.png`](brand/bang_quy_chuan_kich_thuoc_favicon.png)** | 1448×1086 | Bảng quy chuẩn hiển thị Favicon ở các tỷ lệ 16×16, 32×32, 64×64 và App Tile 1024×1024. | Hướng dẫn xuất bản đa kích thước biểu tượng cho web |
| **[`he_thong_hoa_van_nen_thuong_hieu.png`](brand/he_thong_hoa_van_nen_thuong_hieu.png)** | 1448×1086 | Bộ 6 họa tiết nền đặc trưng: Dot Grid, Answer Choice Grid, Folded Ribbon Mesh, Academic Network, Rounded Arc, Soft Wave Divider. | Làm hoa văn nền Hero/Footer, watermark, chứng chỉ |
| **[`huong_dan_chuyen_dong_motion.png`](brand/huong_dan_chuyen_dong_motion.png)** | 1672×941 | Hướng dẫn vi tương tác (Micro-interactions): Hiệu ứng Logo Reveal, CTA Button Hover, Thẻ tính năng nâng nổi, Menu trượt mobile. | Chuẩn hóa animation cho CSS Transitions và Framer Motion |
| **[`bieu_tuong_ung_dung_squircle_3d.png`](brand/bieu_tuong_ung_dung_squircle_3d.png)** | 1254×1254 | Biểu tượng ứng dụng 3D dạng Squircle đổ bóng gương cao cấp. | Mockup app di động, slide thuyết trình |
| **[`bieu_tuong_logo_chu_t_3d.png`](brand/bieu_tuong_logo_chu_t_3d.png)** | 1254×1254 | Biểu tượng chữ T 3D độc lập, góc nghiêng isometric công nghệ. | Splash screen, avatar nhận diện 3D |
| **[`logo_ngang_thuong_hieu_3d.png`](brand/logo_ngang_thuong_hieu_3d.png)** | 1448×1086 | Logo ngang 3D đầy đủ tên ThiSmart. | Banner truyền thông, poster lớn |
| **[`logo_ngang_slogan_nen_toi_3d.png`](brand/logo_ngang_slogan_nen_toi_3d.png)** | 1448×1086 | Logo ngang 3D kèm khẩu hiệu trên nền tối. | Key visual nền tối, sự kiện ra mắt |
| **[`logo_ngang_slogan_nen_sang_3d.png`](brand/logo_ngang_slogan_nen_sang_3d.png)** | 1448×1086 | Logo ngang 3D kèm khẩu hiệu trên nền sáng. | Tài liệu in ấn, hội thảo giáo dục |
| **[`logo_ngang_nen_sang.png`](brand/logo_ngang_nen_sang.png)** | 1406×451 | Logo phẳng ngang chính thức trên nền sáng. | TopBar, Sidebar expanded, Trang Login |
| **[`logo_ngang_kem_slogan_nen_sang.png`](brand/logo_ngang_kem_slogan_nen_sang.png)** | 1448×481 | Logo phẳng ngang kèm slogan trên nền sáng. | Banner giới thiệu, Hero section |
| **[`logo_ngang_kem_slogan_nen_toi.png`](brand/logo_ngang_kem_slogan_nen_toi.png)** | 1442×469 | Logo phẳng ngang kèm slogan trên nền tối. | Dark Hero, Footer tối màu |
| **[`bieu_tuong_logo_chu_t.png`](brand/bieu_tuong_logo_chu_t.png)** | 1024×1024 | Biểu tượng chữ T phẳng độc lập trong suốt. | Sidebar collapsed, Header phòng thi |
| **[`bieu_tuong_goc_master.png`](brand/bieu_tuong_goc_master.png)** | 1024×1024 | Biểu tượng nguồn raster chất lượng cao. | Master asset dự phòng |
| **[`bieu_tuong_ung_dung_pwa.png`](brand/bieu_tuong_ung_dung_pwa.png)** | 1024×1024 | Icon ứng dụng nền xanh bo góc. | Cài đặt PWA, App icon di động |
| **[`anh_chia_se_mang_xa_hoi_og.png`](brand/anh_chia_se_mang_xa_hoi_og.png)** | 1200×630 | Ảnh preview Open Graph mạng xã hội. | Preview khi share Facebook/Zalo/LinkedIn |

---

## 🚀 2. Bộ 8 Tranh Minh Họa 3D Độc Lập Chất Lượng Cao (`3d-illustrations/`)

Tất cả các tác phẩm dưới đây được render độc lập ở độ phân giải siêu nét (1254px – 1672px), ánh sáng 3D phong cách Claymorphism hiện đại:

| Tên Tệp Tiếng Việt (`snake_case`) | Kích Thước | Nghiệp Vụ Tương Ứng | Mô Tả Trực Quan |
| :--- | :---: | :--- | :--- |
| **[`minh_hoa_hero_quy_dao_bai_thi_3d.png`](3d-illustrations/minh_hoa_hero_quy_dao_bai_thi_3d.png)** | 1672×941 | Trang chủ / Hero Banner | Biểu tượng ThiSmart trung tâm bao quanh bởi quỹ đạo phát sáng, đề thi trôi nổi, nút chọn trắc nghiệm và biểu mẫu chấm thi. |
| **[`minh_hoa_tinh_nang_ngan_hang_cau_hoi_3d.png`](3d-illustrations/minh_hoa_tinh_nang_ngan_hang_cau_hoi_3d.png)** | 1254×1254 | Ngân hàng câu hỏi (Phase 4) | Cửa sổ soạn câu hỏi với huy hiệu Q, cây thư mục chủ đề, các định dạng câu hỏi (đơn lựa chọn, đa lựa chọn, điền khuyết, gắn hình). |
| **[`minh_hoa_tinh_nang_phong_thi_focus_3d.png`](3d-illustrations/minh_hoa_tinh_nang_phong_thi_focus_3d.png)** | 1254×1254 | Phòng thi Focus Mode (Phase 7) | Màn hình máy tính phòng thi tinh gọn, đồng hồ đếm ngược, huy hiệu đám mây lưu tự động thời gian thực và lưới điều hướng câu hỏi. |
| **[`minh_hoa_tinh_nang_giam_sat_bao_mat_3d.png`](3d-illustrations/minh_hoa_tinh_nang_giam_sat_bao_mat_3d.png)** | 1254×1254 | Giám sát & An ninh (Phase 7) | Khiên bảo vệ phát sáng mang biểu tượng ThiSmart, ổ khóa bảo mật, khung giám sát thí sinh, dòng nhịp tim ECG và thẻ nhật ký cảnh báo. |
| **[`minh_hoa_tinh_nang_thiet_ke_de_thi_3d.png`](3d-illustrations/minh_hoa_tinh_nang_thiet_ke_de_thi_3d.png)** | 1448×1086 | Thiết kế đề thi (Phase 5) | Bảng kẹp đề thi 3D với biểu đồ cột, nút kiểm xanh, menu tùy chọn tạo mới, thiết lập ma trận và xem trước đề. |
| **[`minh_hoa_tinh_nang_lap_lich_ca_thi_3d.png`](3d-illustrations/minh_hoa_tinh_nang_lap_lich_ca_thi_3d.png)** | 1448×1086 | Lập lịch ca thi (Phase 6) | Quyển lịch tháng dạng xoắn ốc 3D, đồng hồ kim nổi, danh sách các ca thi và khung thời gian làm bài chuẩn mực. |
| **[`minh_hoa_tinh_nang_cham_diem_thong_ke_3d.png`](3d-illustrations/minh_hoa_tinh_nang_cham_diem_thong_ke_3d.png)** | 1448×1086 | Chấm điểm & Báo cáo (Phase 8) | Thẻ kết quả kính mờ (glassmorphism), biểu đồ cột phổ điểm, biểu đồ tròn tỷ lệ đạt 85% và bảng danh sách thí sinh. |
| **[`minh_hoa_tinh_nang_phan_quyen_nguoi_dung_3d.png`](3d-illustrations/minh_hoa_tinh_nang_phan_quyen_nguoi_dung_3d.png)** | 1448×1086 | Phân quyền RBAC (Phase 1) | Bộ 3 avatar 3D đại diện cho Quản trị viên, Giảng viên và Thí sinh kèm danh sách quyền hạn chi tiết. |

---

## 🖥️ 3. Tài Liệu Demo Giao Diện (`mockups/`)

- **[`mockups/giao_dien_may_tinh_desktop.png`](mockups/giao_dien_may_tinh_desktop.png)**: Bản chụp giao diện màn hình lớn máy tính bàn (1440×976).
- **[`mockups/giao_dien_dien_thoai_mobile.png`](mockups/giao_dien_dien_thoai_mobile.png)**: Bản chụp giao diện điện thoại thông minh (390×1070).
- **[`mockups/exam-platform-ui-preview.html`](mockups/exam-platform-ui-preview.html)**: Bản xem trước tương tác độc lập định dạng HTML.
