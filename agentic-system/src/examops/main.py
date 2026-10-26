"""FastAPI Application entrypoint and server assembly for ExamOps Agent."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from examops import __version__
from examops.api.routes import agent_graph
from examops.api.routes import router as api_router
from examops.config import get_settings
from examops.telemetry import setup_telemetry

# Initialize settings and telemetry
settings = get_settings()
setup_telemetry(settings)

# Create FastAPI application
app = FastAPI(
    title="ExamOps Agent API",
    description="Intelligent Orchestration Service for Exam Platform",
    version=__version__,
)

# Enable CORS for local dev and web client access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

__all__ = ["app", "agent_graph"]
