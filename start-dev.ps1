<#
.SYNOPSIS
    ThiSmart Exam Platform — Script Khởi Chạy Tự Động Toàn Hệ Thống (1-Click Local Dev Launcher)
.DESCRIPTION
    Khởi động đồng thời cả 3 phân hệ độc lập:
    1. Core API (Laravel 13 - Port 8000)
    2. ExamOps AI Copilot (Python FastAPI - Port 8001)
    3. Web Client (Next.js 15 App Router - Port 3000)
    Kiểm tra tự động kết nối và in bảng hướng dẫn tài khoản.
#>

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "   🎓 THISMART EXAM PLATFORM — KHỞI CHẠY TỰ ĐỘNG MÔI TRƯỜNG PHÁT TRIỂN    " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Kiểm tra môi trường hệ thống
Write-Host "[1/5] Kiểm tra công cụ hệ thống..." -ForegroundColor Yellow
$phpVersion = php -v 2>$null | Select-Object -First 1
$nodeVersion = node -v 2>$null
$pythonPath = Join-Path $rootDir "agentic-system\.venv\Scripts\python.exe"

if (-not $phpVersion) {
    Write-Host "  ❌ Không tìm thấy PHP trong PATH." -ForegroundColor Red
} else {
    Write-Host "  ✅ PHP: $phpVersion" -ForegroundColor Green
}

if (-not $nodeVersion) {
    Write-Host "  ❌ Không tìm thấy Node.js trong PATH." -ForegroundColor Red
} else {
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
}

if (-not (Test-Path $pythonPath)) {
    Write-Host "  ❌ Không tìm thấy virtualenv Python tại $pythonPath" -ForegroundColor Red
} else {
    Write-Host "  ✅ Python venv: $pythonPath" -ForegroundColor Green
}

Write-Host ""

# 2. Khởi chạy Core API (Laravel 13)
Write-Host "[2/5] Khởi động Core API (Laravel 13 trên http://127.0.0.1:8000)..." -ForegroundColor Yellow
$coreApiJob = Start-Process -FilePath "php" -ArgumentList "artisan serve --host=127.0.0.1 --port=8000" -WorkingDirectory (Join-Path $rootDir "core-api") -PassThru -WindowStyle Hidden

# 3. Khởi chạy ExamOps AI Copilot (FastAPI)
Write-Host "[3/5] Khởi động ExamOps AI Copilot (FastAPI trên http://127.0.0.1:8001)..." -ForegroundColor Yellow
$agentJob = Start-Process -FilePath $pythonPath -ArgumentList "-m uvicorn examops.main:app --host 127.0.0.1 --port 8001" -WorkingDirectory (Join-Path $rootDir "agentic-system") -PassThru -WindowStyle Hidden

# 4. Khởi chạy Web Client (Next.js 15)
Write-Host "[4/5] Khởi động Web Client (Next.js 15 trên http://localhost:3000)..." -ForegroundColor Yellow
$clientJob = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory (Join-Path $rootDir "web-client") -PassThru -WindowStyle Hidden

# 5. Chờ dịch vụ khởi động và kiểm tra Healthcheck
Write-Host "[5/5] Kiểm tra kết nối dịch vụ (Healthchecks)..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

$coreHealthy = $false
$agentHealthy = $false
$clientHealthy = $false

try {
    $resCore = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/health" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($resCore.status -eq "ok" -or $resCore.status -eq "healthy") { $coreHealthy = $true }
} catch {}

try {
    $resAgent = Invoke-RestMethod -Uri "http://127.0.0.1:8001/health" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($resAgent.status -eq "healthy") { $agentHealthy = $true }
} catch {}

try {
    $resClient = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($resClient.StatusCode -eq 200) { $clientHealthy = $true }
} catch {}

Write-Host ""
Write-Host "==========================================================================" -ForegroundColor Green
Write-Host "                 🎉 CÁC DỊCH VỤ ĐÃ SẴN SÀNG HOẠT ĐỘNG!                    " -ForegroundColor Green
Write-Host "==========================================================================" -ForegroundColor Green
Write-Host "  • Web Client (Frontend) : http://localhost:3000       $([char]0x2192) $(if ($clientHealthy) {'[ONLINE]'} else {'[STARTING...]'}" -ForegroundColor Cyan
Write-Host "  • Core API (Backend)    : http://127.0.0.1:8000       $([char]0x2192) $(if ($coreHealthy) {'[ONLINE]'} else {'[STARTING...]'}" -ForegroundColor Cyan
Write-Host "  • AI Copilot (ExamOps)  : http://127.0.0.1:8001       $([char]0x2192) $(if ($agentHealthy) {'[ONLINE]'} else {'[STARTING...]'}" -ForegroundColor Cyan
Write-Host "  • Tài liệu Swagger API  : http://127.0.0.1:8000/docs/api" -ForegroundColor DarkGray
Write-Host ""
Write-Host "--------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  🔑 TÀI KHOẢN MẪU TRẢI NGHIỆM HỆ THỐNG (DEMO CREDENTIALS):" -ForegroundColor Yellow
Write-Host "  1. Giảng viên (Teacher): teacher@examplatform.local   | Mật khẩu: Teacher@123456"
Write-Host "  2. Thí sinh (Student)  : student@examplatform.local   | Mật khẩu: Student@123456"
Write-Host "  3. Quản trị viên (Admin): admin@examplatform.local     | Mật khẩu: Admin@123456"
Write-Host "--------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Nhấn phím bất kỳ hoặc đóng cửa sổ này để dừng các dịch vụ..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Dọn dẹp tiến trình khi kết thúc
Write-Host "Đang dừng các dịch vụ..." -ForegroundColor Yellow
if ($coreApiJob -and -not $coreApiJob.HasExited) { Stop-Process -Id $coreApiJob.Id -Force -ErrorAction SilentlyContinue }
if ($agentJob -and -not $agentJob.HasExited) { Stop-Process -Id $agentJob.Id -Force -ErrorAction SilentlyContinue }
if ($clientJob -and -not $clientJob.HasExited) { Stop-Process -Id $clientJob.Id -Force -ErrorAction SilentlyContinue }
Write-Host "Đã dừng toàn bộ dịch vụ. Tạm biệt!" -ForegroundColor Green
