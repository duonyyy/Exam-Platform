.PHONY: run test eval lint format typecheck check clean help

help:
	@echo "Available commands for ExamOps Agent:"
	@echo "  make run        - Start FastAPI server on port 8001"
	@echo "  make test       - Run all unit and integration tests"
	@echo "  make eval       - Run evaluation test suite"
	@echo "  make lint       - Check linting with ruff"
	@echo "  make format     - Format code with ruff"
	@echo "  make typecheck  - Strict typecheck with mypy"
	@echo "  make check      - Run lint, format check, typecheck, and tests"
	@echo "  make clean      - Remove cache and temporary files"

run:
	uvicorn examops.main:app --reload --host 0.0.0.0 --port 8001

test:
	pytest tests/ -v

eval:
	pytest tests/evals/test_eval_suite.py -v

lint:
	ruff check src/ tests/

format:
	ruff format src/ tests/

typecheck:
	mypy src/

check: lint typecheck test

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
