# ==============================================================================
# Dockerfile for ExamOps Agent (FastAPI, LangGraph, Python 3.12)
# Multi-stage build with Astral uv for deterministic ultra-fast builds
# ==============================================================================

FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

WORKDIR /app

# Enable bytecode compilation and copy link mode
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies first (layer caching)
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# Copy application source
COPY src ./src
COPY README.md ./

# Sync project package
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# ------------------------------------------------------------------------------
# Production Runner Image
# ------------------------------------------------------------------------------
FROM python:3.12-slim-bookworm AS runner

WORKDIR /app

# Non-root user for security (OWASP ASVS / Least-Privilege)
RUN groupadd -r examops && useradd -r -g examops examops

# Copy virtual environment and source code
COPY --from=builder --chown=examops:examops /app/.venv /app/.venv
COPY --from=builder --chown=examops:examops /app/src /app/src

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app/src"
ENV PYTHONUNBUFFERED=1
ENV API_HOST=0.0.0.0
ENV API_PORT=8001

# Writable directory for SQLite checkpoints
RUN mkdir -p /app/data && chown -R examops:examops /app/data

USER examops

EXPOSE 8001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')" || exit 1

CMD ["uvicorn", "examops.main:app", "--host", "0.0.0.0", "--port", "8001"]
