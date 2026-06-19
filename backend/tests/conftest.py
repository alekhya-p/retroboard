"""Test-wide setup. Runs before any test module is imported.

Two things have to be in place before importing ``app.main``:

1. ``CUSTOM_CONFIGURE_DEPLOYMENT=true`` - bypasses Google Secret Manager in
   ``app.core.config.get_settings`` so we don't need GCP access to load the
   Settings object.

2. ``google.auth.default`` stubbed - ``AIService`` calls it during
   ``_ensure_client`` and would otherwise try to reach the metadata server.
   We swap in fake ADC credentials so the module imports cleanly offline.
"""

import os
import sys
from pathlib import Path

# Ensure the backend root is on sys.path when pytest is invoked from elsewhere.
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

# Skip Secret Manager.
os.environ.setdefault("CUSTOM_CONFIGURE_DEPLOYMENT", "true")
os.environ.setdefault("GOOGLE_CLOUD_PROJECT", "test-project")
os.environ.setdefault("VERTEX_AI_LOCATION", "europe-west4")

# Stub ADC.
import google.auth
import google.auth.credentials


class _FakeCreds(google.auth.credentials.Credentials):
    def __init__(self):
        super().__init__()
        self.token = "fake-token"

    def refresh(self, request):  # pragma: no cover - no-op
        self.token = "fake-token"


def _fake_default(*args, **kwargs):
    return _FakeCreds(), "test-project"


google.auth.default = _fake_default
