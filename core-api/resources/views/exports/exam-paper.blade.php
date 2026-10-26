<!DOCTYPE html>
<html lang="vi">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Đề Thi Khảo Thí - {{ $exam->title }}</title>
    <style>
        @page {
            margin: 15mm 15mm 15mm 15mm;
            size: a4 portrait;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10.5px;
            line-height: 1.45;
            color: #1e293b;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        .header-table td {
            vertical-align: top;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }

        .title-box {
            text-align: center;
            border-top: 1px solid #1e3a8a;
            border-bottom: 1px solid #1e3a8a;
            padding: 8px 0;
            margin: 8px 0 12px 0;
            background-color: #f1f5f9;
        }
        .exam-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e3a8a;
        }
        .exam-subtitle {
            font-size: 10px;
            color: #475569;
            margin-top: 2px;
        }

        .student-info-box {
            width: 100%;
            border: 1px solid #94a3b8;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .student-info-box td {
            padding: 6px 8px;
            font-size: 10px;
            border: 1px solid #cbd5e1;
        }

        .rules-notice {
            font-size: 9.5px;
            color: #475569;
            font-style: italic;
            margin-bottom: 15px;
            padding: 4px 8px;
            background-color: #f8fafc;
            border-left: 3px solid #1e3a8a;
        }

        .question-item {
            margin-bottom: 14px;
            page-break-inside: avoid;
        }
        .question-header {
            font-weight: bold;
            font-size: 11px;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .question-points {
            font-size: 10px;
            color: #2563eb;
            font-weight: normal;
        }
        .options-list {
            margin-left: 10px;
            margin-top: 4px;
        }
        .option-row {
            margin-bottom: 3px;
            font-size: 10.5px;
        }
        .option-bubble {
            display: inline-block;
            font-weight: bold;
            margin-right: 4px;
        }

        .answer-key-box {
            margin-top: 5px;
            padding: 5px 8px;
            background-color: #ecfdf5;
            border: 1px dashed #059669;
            border-radius: 3px;
            font-size: 10px;
        }
        .answer-key-title {
            font-weight: bold;
            color: #065f46;
        }
        .answer-explanation {
            color: #047857;
            font-style: italic;
            margin-top: 2px;
        }

        .page-break {
            page-break-after: always;
        }

        .answer-sheet-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .answer-sheet-table th {
            background-color: #1e3a8a;
            color: #ffffff;
            font-size: 9.5px;
            padding: 4px;
            border: 1px solid #0f172a;
        }
        .answer-sheet-table td {
            font-size: 9px;
            padding: 4px;
            border: 1px solid #cbd5e1;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Header Trường & Kỳ Thi -->
    <table class="header-table">
        <tr>
            <td class="text-left" style="width: 55%;">
                <div class="font-bold uppercase" style="font-size: 10px;">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & ĐÀO TẠO THI SMART</div>
                <div class="font-bold uppercase" style="color: #1e3a8a; font-size: 10.5px;">KHOA CÔNG NGHỆ THÔNG TIN</div>
                <div style="font-size: 9px; color: #64748b;">Học phần: {{ $exam->subject?->name ?? 'N/A' }} — Mã HP: {{ $exam->subject?->code ?? 'N/A' }}</div>
            </td>
            <td class="text-right" style="width: 45%;">
                <div class="font-bold uppercase" style="font-size: 10px;">KỲ THI KẾT THÚC HỌC PHẦN</div>
                <div style="font-size: 9.5px;">Mã đề thi: <strong>#{{ $exam->id }}</strong></div>
                <div style="font-size: 9px; color: #64748b;">Thời lượng: <strong>{{ $exam->duration_minutes }} phút</strong></div>
            </td>
        </tr>
    </table>

    <!-- Tiêu Đề Đề Thi -->
    <div class="title-box">
        <div class="exam-title uppercase">{{ $exam->title }}</div>
        <div class="exam-subtitle">
            Tổng số câu hỏi: {{ $exam->questions->count() }} câu | Thang điểm chuẩn: {{ $exam->total_points }} điểm | Điểm sàn đạt: {{ $exam->pass_score }} điểm
            @if($includeAnswers)
                <span style="color: #dc2626; font-weight: bold; margin-left: 5px;">[BẢN ĐÁP ÁN DÀNH CHO CÁN BỘ CHẤM THI]</span>
            @endif
        </div>
    </div>

    <!-- Khung Thông Tin Thí Sinh & Giám Thị (Nếu in đề thi cho thí sinh làm bài) -->
    @if(!$includeAnswers)
    <table class="student-info-box">
        <tr>
            <td style="width: 50%;"><strong>Họ và tên thí sinh:</strong> ..............................................................</td>
            <td style="width: 25%;"><strong>Mã SV:</strong> .............................</td>
            <td style="width: 25%;"><strong>Lớp:</strong> .............................</td>
        </tr>
        <tr>
            <td><strong>Số báo danh / Phòng thi:</strong> .....................................................</td>
            <td><strong>Chữ ký GT 1:</strong> ....................</td>
            <td><strong>Chữ ký GT 2:</strong> ....................</td>
        </tr>
    </table>

    <div class="rules-notice">
        * Lưu ý: Thí sinh kiểm tra kỹ số lượng câu hỏi trước khi làm bài. Không sử dụng tài liệu ngoài quy định. Tô kín ô tròn tương ứng trên phiếu trả lời.
    </div>
    @endif

    <!-- Danh Sách Câu Hỏi -->
    <div class="questions-container">
        @foreach($exam->questions as $index => $q)
            @php
                $orderNumber = $q->pivot?->getAttribute('order') ?? ($index + 1);
                $points = $q->pivot?->getAttribute('points') ?? 0.0;
                $options = is_array($q->options) ? $q->options : [];
                $correct = $q->correct_answer;
                $correctArray = is_array($correct) ? $correct : [$correct];
            @endphp
            <div class="question-item">
                <div class="question-header">
                    Câu {{ $orderNumber }}: <span style="font-weight: normal;">{{ $q->question_text }}</span>
                    <span class="question-points">({{ number_format((float)$points, 2) }} điểm)</span>
                </div>

                @if(!empty($options))
                    <div class="options-list">
                        @foreach($options as $opt)
                            @php
                                $optId = $opt['id'] ?? '';
                                $optContent = $opt['content'] ?? '';
                                $isCorrect = in_array($optId, $correctArray, true);
                            @endphp
                            <div class="option-row" style="{{ ($includeAnswers && $isCorrect) ? 'font-weight: bold; color: #065f46;' : '' }}">
                                <span class="option-bubble">({{ $optId }})</span> {{ $optContent }}
                                @if($includeAnswers && $isCorrect)
                                    <span style="color: #059669; font-size: 9px; font-weight: bold;">✔ [Đáp án đúng]</span>
                                @endif
                            </div>
                        @endforeach
                    </div>
                @elseif($q->question_type->value === 'short_answer')
                    <div style="margin: 8px 0 5px 15px; color: #64748b; font-style: italic;">
                        @if($includeAnswers)
                            <div style="font-weight: bold; color: #065f46;">Đáp án mẫu: {{ is_array($correct) ? implode(', ', $correct) : $correct }}</div>
                        @else
                            Bài làm: ....................................................................................................................................................................
                        @endif
                    </div>
                @endif

                @if($includeAnswers && !empty($q->explanation))
                    <div class="answer-key-box">
                        <span class="answer-key-title">Giải thích:</span>
                        <div class="answer-explanation">{{ $q->explanation }}</div>
                    </div>
                @endif
            </div>
        @endforeach
    </div>

    <!-- Trang Phụ: Bảng Đáp Án hoặc Phiếu Trả Lời Trắc Nghiệm Dự Phòng -->
    <div class="page-break"></div>

    @if($includeAnswers)
        <div class="title-box">
            <div class="exam-title uppercase">BẢNG TỔNG HỢP ĐÁP ÁN & BIỂU ĐIỂM CHI TIẾT</div>
            <div class="exam-subtitle">Đề thi: {{ $exam->title }} (Mã #{{ $exam->id }})</div>
        </div>

        <table class="answer-sheet-table">
            <thead>
                <tr>
                    <th style="width: 50px;">Câu số</th>
                    <th style="width: 120px;">Loại câu</th>
                    <th style="width: 70px;">Thang điểm</th>
                    <th style="width: 120px;">Đáp án đúng</th>
                    <th>Ghi chú / Tiêu chí chấm</th>
                </tr>
            </thead>
            <tbody>
                @foreach($exam->questions as $index => $q)
                    @php
                        $orderNumber = $q->pivot?->getAttribute('order') ?? ($index + 1);
                        $points = $q->pivot?->getAttribute('points') ?? 0.0;
                        $correct = $q->correct_answer;
                        $correctDisplay = is_array($correct) ? implode(', ', $correct) : (string)$correct;
                    @endphp
                    <tr>
                        <td class="font-bold">{{ $orderNumber }}</td>
                        <td>{{ $q->question_type->value }}</td>
                        <td>{{ number_format((float)$points, 2) }}</td>
                        <td class="font-bold" style="color: #065f46;">{{ $correctDisplay }}</td>
                        <td style="text-align: left; font-size: 8.5px;">{{ $q->explanation ?: '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="title-box">
            <div class="exam-title uppercase">PHIẾU TRẢ LỜI TRẮC NGHIỆM DỰ PHÒNG</div>
            <div class="exam-subtitle">Sử dụng trong trường hợp thi viết trên giấy hoặc phòng thi dự phòng mất điện</div>
        </div>

        <div style="font-size: 9.5px; margin-bottom: 10px; color: #475569;">
            * Hướng dẫn: Dùng bút chì hoặc bút mực tô đen kín một ô tròn tương ứng với phương án lựa chọn duy nhất cho mỗi câu hỏi.
        </div>

        <table class="answer-sheet-table">
            <thead>
                <tr>
                    <th style="width: 40px;">Câu</th>
                    <th>Phương án chọn</th>
                    <th style="width: 40px;">Câu</th>
                    <th>Phương án chọn</th>
                    <th style="width: 40px;">Câu</th>
                    <th>Phương án chọn</th>
                    <th style="width: 40px;">Câu</th>
                    <th>Phương án chọn</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $totalQ = $exam->questions->count();
                    $rowsPerCol = (int) ceil(max($totalQ, 20) / 4);
                @endphp
                @for($r = 1; $r <= $rowsPerCol; $r++)
                    <tr>
                        @for($col = 0; $col < 4; $col++)
                            @php
                                $qNum = $r + ($col * $rowsPerCol);
                            @endphp
                            @if($qNum <= $totalQ)
                                <td class="font-bold" style="background-color: #f8fafc;">{{ $qNum }}</td>
                                <td>[ A ] &nbsp; [ B ] &nbsp; [ C ] &nbsp; [ D ]</td>
                            @else
                                <td style="background-color: #f8fafc;"></td>
                                <td></td>
                            @endif
                        @endfor
                    </tr>
                @endfor
            </tbody>
        </table>
    @endif

</body>
</html>
