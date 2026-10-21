"""Persistence lifecycle and SQLite checkpointer for LangGraph workflows."""

from __future__ import annotations

import sqlite3
from pathlib import Path

from langgraph.checkpoint.sqlite import SqliteSaver

from examops.config import Settings, get_settings


class PersistenceManager:
    """Manages SQLite checkpointer connection lifecycle."""

    def __init__(self, db_path: str | None = None) -> None:
        self.settings: Settings = get_settings()
        self.db_path = db_path or self.settings.checkpoint_db_path

    def get_checkpointer(self) -> SqliteSaver:
        """Create and return a configured SqliteSaver instance."""
        if self.db_path == ":memory:":
            conn = sqlite3.connect(":memory:", check_same_thread=False)
            return SqliteSaver(conn)

        path = Path(self.db_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        conn = sqlite3.connect(str(path), check_same_thread=False)
        return SqliteSaver(conn)


def get_checkpointer(db_path: str | None = None) -> SqliteSaver:
    """Helper to acquire a checkpointer."""
    manager = PersistenceManager(db_path=db_path)
    return manager.get_checkpointer()
