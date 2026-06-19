"""Pin the public HTTP + WebSocket surface.

If a router is forgotten in main.py, a route is renamed, or a path changes
shape (e.g. ``/boards/{id}`` → ``/board/{id}``), the frontend silently 404s
on the next deploy. These tests catch that locally.
"""

import importlib


REQUIRED_HTTP_ROUTES = {
    # Auth
    ("POST", "/api/v1/auth/google"),
    ("POST", "/api/v1/auth/microsoft"),
    ("POST", "/api/v1/auth/anonymous"),
    ("GET",  "/api/v1/auth/me"),
    # Boards (retro)
    ("POST",   "/api/v1/boards"),
    ("GET",    "/api/v1/boards"),
    ("GET",    "/api/v1/boards/{board_id}"),
    ("PATCH",  "/api/v1/boards/{board_id}"),
    ("DELETE", "/api/v1/boards/{board_id}"),
    # Messages
    ("POST", "/api/v1/messages"),
    ("GET",  "/api/v1/messages/board/{board_id}"),
    # AI - retro
    ("POST", "/api/v1/ai/boards/{board_id}/summary"),
    ("POST", "/api/v1/ai/boards/{board_id}/action-items"),
    ("POST", "/api/v1/ai/generate-retro-idea"),
    ("POST", "/api/v1/ai/boards/{board_id}/icebreaker"),
    # AI - games
    ("POST", "/api/v1/ai/games/drawing-prompt"),
    ("POST", "/api/v1/ai/games/drawing-hint"),
    ("POST", "/api/v1/ai/games/trivia"),
    ("POST", "/api/v1/ai/games/judge-emoji"),
    ("POST", "/api/v1/ai/games/lie-inspiration"),
    ("POST", "/api/v1/ai/games/roulette-questions"),
    # Game rooms (separate collection - must not collide with /boards)
    ("POST",   "/api/v1/game-rooms"),
    ("GET",    "/api/v1/game-rooms/{room_id}"),
    ("DELETE", "/api/v1/game-rooms/{room_id}"),
}


REQUIRED_WS_ROUTES = {
    "/api/v1/messages/ws/{board_id}",
    "/api/v1/game-rooms/ws/{room_id}",
}


def _collect_routes(app):
    http = set()
    ws = set()
    for r in app.routes:
        path = getattr(r, "path", None)
        methods = getattr(r, "methods", None)
        if methods:
            for m in methods:
                if m in {"HEAD", "OPTIONS"}:
                    continue
                http.add((m, path))
        elif path is not None:
            # WebSocket / Mount: no `methods`.
            ws.add(path)
    return http, ws


def test_required_http_routes_are_registered():
    app = importlib.import_module("app.main").app
    http, _ = _collect_routes(app)
    missing = REQUIRED_HTTP_ROUTES - http
    assert not missing, f"Missing HTTP routes: {sorted(missing)}"


def test_required_websocket_routes_are_registered():
    app = importlib.import_module("app.main").app
    _, ws = _collect_routes(app)
    missing = REQUIRED_WS_ROUTES - ws
    assert not missing, f"Missing WebSocket routes: {sorted(missing)}"


def test_game_rooms_and_boards_are_distinct_paths():
    """Catches an accidental re-collapse of game rooms into the boards collection."""
    app = importlib.import_module("app.main").app
    http, _ = _collect_routes(app)
    paths = {p for _, p in http}
    assert "/api/v1/boards" in paths
    assert "/api/v1/game-rooms" in paths
