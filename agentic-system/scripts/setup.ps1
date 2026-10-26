# PowerShell Setup Script for ExamOps Agent (Windows)
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Setting up ExamOps Agent Environment (Windows)          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not installed or not in PATH. Please install Python 3.11+."
}

$pyVersion = python -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")'
Write-Host "Detected Python version: $pyVersion" -ForegroundColor Green

if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment in .venv..." -ForegroundColor Yellow
    python -m venv .venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

Write-Host "Upgrading pip and installing dependencies..." -ForegroundColor Yellow
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

Write-Host ""
Write-Host "Running test suite to verify installation..." -ForegroundColor Cyan
pytest tests\ -v

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Setup Complete! Run server with: uvicorn examops.main:app --port 8001" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
