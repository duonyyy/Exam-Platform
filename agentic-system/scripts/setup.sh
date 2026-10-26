#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "  Setting up ExamOps Agent Environment (Unix/macOS/WSL)   "
echo "=========================================================="

if ! command -v python3 &>/dev/null; then
    echo "Error: python3 is not installed. Please install Python 3.11+."
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Detected Python version: $PYTHON_VERSION"

if [ ! -d ".venv" ]; then
    echo "Creating virtual environment in .venv..."
    python3 -m venv .venv
fi

echo "Activating virtual environment..."
source .venv/bin/activate

echo "Upgrading pip and installing dependencies..."
pip install --upgrade pip
pip install -e ".[dev]"

if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo ""
echo "Running test suite to verify installation..."
pytest tests/ -v

echo ""
echo "=========================================================="
echo "  Setup Complete! Run server with: make run               "
echo "=========================================================="
