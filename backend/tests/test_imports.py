"""Catch the failure mode where a backend module won't load.

If any .py under app/ has a syntax error, an undefined name, a missing
import, or a circular dependency, the container will refuse to start and
Cloud Run will roll back. The two tests below catch that locally:

- ``test_every_module_parses``: AST-parse every file. This is what would
  have caught the docstring-collapsed-onto-def-line bug in ai_service.py.
- ``test_main_app_imports``: actually import ``app.main`` so route
  registration, dependency wiring and the routers all execute.
"""

import ast
import importlib
from pathlib import Path

import pytest

APP_ROOT = Path(__file__).resolve().parents[1] / "app"


def _iter_py_files():
    for p in APP_ROOT.rglob("*.py"):
        # Skip any __pycache__ leftovers just in case.
        if "__pycache__" in p.parts:
            continue
        yield p


@pytest.mark.parametrize("py_file", list(_iter_py_files()), ids=lambda p: str(p.relative_to(APP_ROOT)))
def test_every_module_parses(py_file: Path):
    source = py_file.read_text(encoding="utf-8")
    ast.parse(source, filename=str(py_file))


def test_main_app_imports():
    """Actually execute ``app.main`` - covers every router + service wired in."""
    mod = importlib.import_module("app.main")
    assert hasattr(mod, "app"), "app.main must expose a FastAPI `app`"
    # Sanity: dependency-injection helpers used by the routers.
    for helper in (
        "get_auth_service",
        "get_board_service",
        "get_message_service",
        "get_ai_service",
        "get_game_room_service",
    ):
        assert callable(getattr(mod, helper)), helper
