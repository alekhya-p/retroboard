import logging

import aiohttp

from ..core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

RESEND_ENDPOINT = "https://api.resend.com/emails"


async def _send_email(to_email: str, subject: str, html: str) -> bool:
    """Send a transactional email via Resend. Returns True on success."""
    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured - skipping email send to %s", to_email)
        return False

    payload = {
        "from": settings.EMAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json",
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(RESEND_ENDPOINT, json=payload, headers=headers) as resp:
                if resp.status >= 400:
                    body = await resp.text()
                    logger.error("Resend send failed (%s): %s", resp.status, body)
                    return False
                return True
    except Exception as e:
        logger.error("Error sending email via Resend: %s", str(e))
        return False


async def send_password_reset_email(to_email: str, reset_url: str, display_name: str = "") -> bool:
    name = (display_name or "there").strip()
    subject = "Reset your reAItro password"
    html = f"""\
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#0f172a">
  <h2 style="margin:0 0 12px">Reset your password</h2>
  <p style="color:#475569;line-height:1.5">Hi {name}, we received a request to reset your reAItro password. Click the button below to choose a new one. This link expires in {settings.RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
  <p style="margin:24px 0">
    <a href="{reset_url}" style="background:#2563eb;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px;display:inline-block">Reset password</a>
  </p>
  <p style="color:#64748b;font-size:13px;line-height:1.5">If the button doesn't work, paste this link into your browser:<br><a href="{reset_url}" style="color:#2563eb">{reset_url}</a></p>
  <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin-top:24px">If you didn't request this, you can safely ignore this email - your password won't change.</p>
</div>"""
    return await _send_email(to_email, subject, html)
