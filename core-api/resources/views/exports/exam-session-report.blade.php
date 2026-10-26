<!DOCTYPE html>
<html lang="vi">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Biên Bản Khảo Thí & Bảng Điểm Ca Thi - {{ $session->title }}</title>
    <style>
        @page {
            margin: 20mm 15mm 20mm 15mm;
            size: a4 landscape;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #1e293b;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .header-table td {
            vertical-align: top;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        
        .title-section {
            text-align: center;
            margin: 10px 0 15px 0;
        }
        .main-title {
            font-size: 16px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 4px;
        }
        .sub-title {
            font-size: 11px;
            color: #475569;
            font-style: italic;
        }

        .meta-box {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
        }
        .meta-box td {
            padding: 6px 10px;
            font-size: 11px;
            border-bottom: 1px solid #e2e8f0;
        }

        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .stats-table td {
            padding: 6px 8px;
            font-size: 10.5px;
            border: 1px solid #cbd5e1;
            text-align: center;
        }
        .stats-header {
            background-color: #e2e8f0;
            font-weight: bold;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .data-table th {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: bold;
            font-size: 10.5px;
            padding: 6px 4px;
            border: 1px solid #0f172a;
            text-align: center;
        }
        .data-table td {
            padding: 5px 4px;
            font-size: 10px;
            border: 1px solid #cbd5e1;
            vertical-align: middle;
        }
        .data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .badge-pass {
            color: #16a34a;
            font-weight: bold;
        }
        .badge-fail {
            color: #dc2626;
            font-weight: bold;
        }

        .signatures-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            page-break-inside: avoid;
        }
        .signatures-table td {
            text-align: center;
            vertical-align: top;
            width: 33.33%;
            padding: 0 10px;
        }
        .sig-title {
            font-weight: bold;
            margin-bottom: 4px;
        }
        .sig-sub {
            font-size: 9.5px;
            color: #64748b;
            font-style: italic;
            margin-bottom: 50px;
        }
        .sig-name {
            font-weight: bold;
            font-size: 11px;
        }
    </style>
</head>
<body>

    <!-- Header Quốc Hiệu / Đơn Vị -->
    <table class="header-table">
        <tr>
            <td class="text-left" style="width: 50%;">
                <div class="font-bold uppercase">BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
                <div class="font-bold uppercase" style="color: #1e3a8a;">HỌC VIỆN CÔNG NGHỆ & ĐÀO TẠO THI SMART</div>
                <div style="font-size: 9.5px; color: #64748b;">Hệ Thống Quản Lý Khảo Thí Trực Tuyến Exam Platform</div>
            </td>
            <td class="text-center" style="width: 50%;">
                <div class="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div class="font-bold" style="font-size: 10.5px;">Độc lập - Tự do - Hạnh phúc</div>
                <div style="font-size: 9.5px; color: #64748b; margin-top: 3px;">-------------------o0o-------------------</div>
            </td>
        </tr>
    </table>

    <!-- Tiêu Đề Chính -->
    <div class="title-section">
        <div class="main-title">BIÊN BẢN KẾT QUẢ KHẢO THÍ VÀ BẢNG ĐIỂM CHÍNH THỨC</div>
        <div class="sub-title">Khóa thi học kỳ chính quy — Kết xuất từ hệ thống ngày {{ $generatedAt }}</div>
    </div>

    <!-- Thông Tin Ca Thi & Đề Thi -->
    <table class="meta-box">
        <tr>
            <td style="width: 50%;"><strong>Tên ca thi:</strong> {{ $session->title }} (Mã #{{ $session->id }})</td>
            <td style="width: 50%;"><strong>Học phần / Môn học:</strong> {{ $session->exam?->subject?->name ?? 'N/A' }} ({{ $session->exam?->subject?->code ?? 'N/A' }})</td>
        </tr>
        <tr>
            <td><strong>Đề thi mẫu:</strong> {{ $session->exam?->title ?? 'N/A' }} (Mã đề #{{ $session->exam?->id }})</td>
            <td><strong>Khung giờ thi:</strong> {{ $session->start_at->format('H:i d/m/Y') }} — {{ $session->end_at->format('H:i d/m/Y') }} ({{ $session->exam?->duration_minutes ?? 0 }} phút)</td>
        </tr>
        <tr>
            <td><strong>Cán bộ coi thi phân công:</strong> 
                @php
                    $proctors = $session->sessionTeachers->pluck('teacher.name')->filter()->join(', ');
                @endphp
                {{ $proctors ?: 'Cán bộ phòng Khảo thí' }}
            </td>
            <td><strong>Thang điểm tối đa:</strong> {{ $report['session']['exam']['total_points'] ?? 10.0 }} điểm | <strong>Điểm sàn đạt:</strong> {{ $report['session']['exam']['pass_score'] ?? 0.0 }} điểm</td>
        </tr>
    </table>

    <!-- Tóm Tắt Thống Kê Nhanh -->
    <table class="stats-table">
        <tr class="stats-header">
            <td>Tổng thí sinh</td>
            <td>Tham gia thi</td>
            <td>Đã nộp bài</td>
            <td>Vắng thi</td>
            <td>Tỷ lệ tham gia</td>
            <td>Điểm cao nhất</td>
            <td>Điểm thấp nhất</td>
            <td>Điểm trung bình</td>
            <td>Tỷ lệ đạt</td>
        </tr>
        <tr>
            <td class="font-bold">{{ $report['summary']['total_assigned'] ?? 0 }}</td>
            <td>{{ $report['summary']['total_participants'] ?? 0 }}</td>
            <td class="font-bold" style="color: #1e3a8a;">{{ $report['summary']['total_submitted'] ?? 0 }}</td>
            <td style="color: #dc2626;">{{ $report['summary']['total_absent'] ?? 0 }}</td>
            <td>{{ $report['summary']['attendance_rate'] ?? 0 }}%</td>
            <td class="font-bold" style="color: #16a34a;">{{ $report['statistics']['max_score'] ?? '-' }}</td>
            <td>{{ $report['statistics']['min_score'] ?? '-' }}</td>
            <td class="font-bold">{{ $report['statistics']['avg_score'] ?? '-' }}</td>
            <td class="font-bold" style="color: #16a34a;">{{ $report['statistics']['pass_rate'] ?? 0 }}%</td>
        </tr>
    </table>

    <!-- Bảng Điểm Thí Sinh Chi Tiết -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 25px;">STT</th>
                <th style="width: 60px;">Mã SV</th>
                <th style="width: 140px;">Họ và Tên</th>
                <th>Email</th>
                <th style="width: 65px;">Trạng Thái</th>
                <th style="width: 45px;">Điểm Số</th>
                <th style="width: 45px;">Thang Đ.</th>
                <th style="width: 50px;">Kết Quả</th>
                <th style="width: 65px;">Xếp Loại</th>
                <th style="width: 60px;">Thời Gian</th>
                <th style="width: 45px;">Vi Phạm</th>
                <th style="width: 60px;">Chữ Ký</th>
            </tr>
        </thead>
        <tbody>
            @forelse($report['scoreboard'] as $index => $row)
                @php
                    $durationText = '-';
                    if ($row['duration_seconds'] !== null) {
                        $mins = intdiv((int) $row['duration_seconds'], 60);
                        $secs = (int) $row['duration_seconds'] % 60;
                        $durationText = sprintf('%02dm%02ds', $mins, $secs);
                    }
                    $statusText = match($row['status']) {
                        'submitted' => 'Đã nộp',
                        'in_progress' => 'Đang làm',
                        default => 'Vắng thi'
                    };
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center font-bold">SV{{ $row['student_id'] }}</td>
                    <td>{{ $row['student_name'] }}</td>
                    <td style="font-size: 9px; color: #475569;">{{ $row['student_email'] }}</td>
                    <td class="text-center">{{ $statusText }}</td>
                    <td class="text-center font-bold" style="font-size: 11px;">
                        {{ $row['score'] !== null ? number_format((float) $row['score'], 2) : '-' }}
                    </td>
                    <td class="text-center">{{ $report['session']['exam']['total_points'] ?? 10.0 }}</td>
                    <td class="text-center">
                        @if($row['is_passed'] === true)
                            <span class="badge-pass">ĐẠT</span>
                        @elseif($row['is_passed'] === false)
                            <span class="badge-fail">HỎNG</span>
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-center">{{ $row['classification'] ?? '-' }}</td>
                    <td class="text-center">{{ $durationText }}</td>
                    <td class="text-center" style="{{ ($row['violations_count'] ?? 0) > 0 ? 'color: #dc2626; font-weight: bold;' : '' }}">
                        {{ $row['violations_count'] ?? 0 }}
                    </td>
                    <td></td>
                </tr>
            @empty
                <tr>
                    <td colspan="12" class="text-center" style="padding: 15px;">Chưa có thí sinh tham gia ca thi này.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Chữ Ký Biên Bản -->
    <table class="signatures-table">
        <tr>
            <td>
                <div class="sig-title">CÁN BỘ COI THI 1</div>
                <div class="sig-sub">(Ký và ghi rõ họ tên)</div>
                <div class="sig-name">_________________________</div>
            </td>
            <td>
                <div class="sig-title">CÁN BỘ COI THI 2</div>
                <div class="sig-sub">(Ký và ghi rõ họ tên)</div>
                <div class="sig-name">_________________________</div>
            </td>
            <td>
                <div style="font-size: 10px; color: #64748b; margin-bottom: 3px;">
                    Hà Nội, ngày {{ date('d') }} tháng {{ date('m') }} năm {{ date('Y') }}
                </div>
                <div class="sig-title uppercase">TRƯỞNG PHÒNG KHẢO THÍ</div>
                <div class="sig-sub">(Ký, đóng dấu xác nhận)</div>
                <div class="sig-name">_________________________</div>
            </td>
        </tr>
    </table>

</body>
</html>
