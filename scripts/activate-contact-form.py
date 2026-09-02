#!/usr/bin/env python3
"""Activate the FormSubmit.co endpoint for the Dudley contact form.

FormSubmit (https://formsubmit.co) requires a one-time activation step the first time
any form POSTs to a brand-new target address: it emails that address an "Activate Form"
link, and until someone clicks it, real submissions are silently dropped (never
delivered, no error shown to the visitor). This script automates that one-time step:

  1. POST a harmless test submission to the FormSubmit AJAX endpoint for the target
     address (same shape as what src/components/ContactForm.astro sends), which
     triggers FormSubmit to send the activation email.
  2. Log into the target mailbox over IMAP and poll for that activation email.
  3. Extract the activation link and open it (this is what actually flips the switch on
     FormSubmit's side).
  4. Print whatever hashed endpoint id FormSubmit reveals on the confirmation page, if
     any, so it can be pasted into ContactForm.astro's FORMSUBMIT_TARGET.

This script sends a real email and reads a real mailbox — it is NOT run automatically as
part of any build. The orchestrator (or Owner) runs it manually, once, after the contact
form ships. See PUBLISHING.md -> "Contact form" for the full runbook.

IMAP config: reads KEY=VALUE lines from ~/.doright/dudley-support.env. Required keys:
  DUDLEY_SUPPORT_IMAP_HOST
  DUDLEY_SUPPORT_IMAP_PORT
  DUDLEY_SUPPORT_IMAP_USERNAME
  DUDLEY_SUPPORT_IMAP_APP_PASSWORD
  DUDLEY_SUPPORT_IMAP_MAILBOX
The values themselves are never printed by this script.

Usage:
  python3 scripts/activate-contact-form.py                # full run: POST + poll + open
  python3 scripts/activate-contact-form.py --dry-run       # skip the POST, still poll+open
  python3 scripts/activate-contact-form.py --no-activate   # poll + print the link only,
                                                            # do not open/click it
Exit status is non-zero if the activation email never arrives within the poll window.
"""

from __future__ import annotations

import argparse
import email
import imaplib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from email.header import decode_header
from pathlib import Path

TARGET_ADDRESS = "support@dudleyapps.com"
FORMSUBMIT_AJAX_URL = f"https://formsubmit.co/ajax/{TARGET_ADDRESS}"
ENV_PATH = Path.home() / ".doright" / "dudley-support.env"

REQUIRED_ENV_KEYS = [
    "DUDLEY_SUPPORT_IMAP_HOST",
    "DUDLEY_SUPPORT_IMAP_PORT",
    "DUDLEY_SUPPORT_IMAP_USERNAME",
    "DUDLEY_SUPPORT_IMAP_APP_PASSWORD",
    "DUDLEY_SUPPORT_IMAP_MAILBOX",
]

POLL_INTERVAL_SECONDS = 15
POLL_TOTAL_SECONDS = 180  # ~3 minutes

# Matches any formsubmit.co URL in the email body/HTML.
FORMSUBMIT_URL_RE = re.compile(r"https://formsubmit\.co/[^\s\"'<>\)]+", re.IGNORECASE)
# A long hex string used as a FormSubmit hashed endpoint id, e.g.
# https://formsubmit.co/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
HASHED_ENDPOINT_RE = re.compile(r"formsubmit\.co/([0-9a-f]{20,})", re.IGNORECASE)


def log(message: str) -> None:
    print(f"[activate-contact-form] {message}", flush=True)


def post_activation_test(dry_run: bool) -> None:
    payload = {
        "name": "Dudley site bot",
        "email": "noreply@dudleyapps.com",
        "subject": "Contact form activation test",
        "message": (
            "This is an automated activation check for the Dudley Development contact "
            "form (scripts/activate-contact-form.py). It confirms FormSubmit can deliver "
            "to this address. You can ignore this message."
        ),
        "_subject": "Contact form activation test",
        "_template": "table",
        "_honey": "",
    }

    if dry_run:
        log(f"--dry-run: would POST test submission to {FORMSUBMIT_AJAX_URL}")
        return

    log(f"POSTing test submission to {FORMSUBMIT_AJAX_URL} ...")
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        FORMSUBMIT_AJAX_URL,
        data=body,
        method="POST",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            text = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        status = e.code
        text = e.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as e:
        log(f"POST failed: {e}")
        return

    log(f"FormSubmit response: HTTP {status}")
    log(f"FormSubmit body: {text[:500]}")


def load_env(path: Path) -> dict[str, str]:
    if not path.exists():
        log(f"ERROR: env file not found at {path}")
        sys.exit(1)

    values: dict[str, str] = {}
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        values[key] = value

    missing = [k for k in REQUIRED_ENV_KEYS if k not in values or not values[k]]
    if missing:
        log(f"ERROR: {path} is missing required keys: {', '.join(missing)}")
        sys.exit(1)

    return values


def decode_mime_str(value: str | None) -> str:
    if not value:
        return ""
    parts = decode_header(value)
    out = []
    for text, charset in parts:
        if isinstance(text, bytes):
            out.append(text.decode(charset or "utf-8", errors="replace"))
        else:
            out.append(text)
    return "".join(out)


def get_body_text(msg: email.message.Message) -> str:
    chunks: list[str] = []
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type in ("text/plain", "text/html"):
                try:
                    payload = part.get_payload(decode=True)
                    if payload:
                        chunks.append(payload.decode(part.get_content_charset() or "utf-8", errors="replace"))
                except Exception:
                    continue
    else:
        try:
            payload = msg.get_payload(decode=True)
            if payload:
                chunks.append(payload.decode(msg.get_content_charset() or "utf-8", errors="replace"))
        except Exception:
            pass
    return "\n".join(chunks)


def looks_like_activation_email(subject: str, from_header: str) -> bool:
    subject_l = subject.lower()
    from_l = from_header.lower()
    if "formsubmit" in from_l:
        return True
    if "activate" in subject_l or "confirm" in subject_l:
        return True
    return False


def find_activation_email(env: dict[str, str]) -> email.message.Message | None:
    host = env["DUDLEY_SUPPORT_IMAP_HOST"]
    port = int(env["DUDLEY_SUPPORT_IMAP_PORT"])
    username = env["DUDLEY_SUPPORT_IMAP_USERNAME"]
    app_password = env["DUDLEY_SUPPORT_IMAP_APP_PASSWORD"]
    mailbox = env["DUDLEY_SUPPORT_IMAP_MAILBOX"]

    conn = imaplib.IMAP4_SSL(host, port)
    try:
        conn.login(username, app_password)
        conn.select(mailbox)

        status, data = conn.search(None, "ALL")
        if status != "OK" or not data or not data[0]:
            return None

        message_ids = data[0].split()
        # Newest first; only look at a reasonable recent window.
        for msg_id in reversed(message_ids[-25:]):
            status, msg_data = conn.fetch(msg_id, "(RFC822)")
            if status != "OK" or not msg_data or not msg_data[0]:
                continue
            raw = msg_data[0][1]
            msg = email.message_from_bytes(raw)

            subject = decode_mime_str(msg.get("Subject"))
            from_header = decode_mime_str(msg.get("From"))
            to_header = decode_mime_str(msg.get("To"))

            if TARGET_ADDRESS.lower() not in to_header.lower():
                continue
            if not looks_like_activation_email(subject, from_header):
                continue

            return msg
        return None
    finally:
        try:
            conn.close()
        except Exception:
            pass
        conn.logout()


def poll_for_activation_email(env: dict[str, str]) -> email.message.Message | None:
    deadline = time.time() + POLL_TOTAL_SECONDS
    attempt = 0
    while time.time() < deadline:
        attempt += 1
        log(f"Checking mailbox for the FormSubmit activation email (attempt {attempt}) ...")
        try:
            msg = find_activation_email(env)
        except imaplib.IMAP4.error as e:
            log(f"IMAP error: {e}")
            msg = None

        if msg is not None:
            return msg

        remaining = deadline - time.time()
        if remaining <= 0:
            break
        time.sleep(min(POLL_INTERVAL_SECONDS, max(0, remaining)))

    return None


def extract_activation_url(msg: email.message.Message) -> str | None:
    body = get_body_text(msg)
    urls = FORMSUBMIT_URL_RE.findall(body)
    if not urls:
        return None

    # Prefer a URL that explicitly says activate/confirm; fall back to the first match.
    for url in urls:
        if "activate" in url.lower() or "confirm" in url.lower():
            return url
    return urls[0]


def open_activation_url(url: str) -> str:
    log(f"Opening activation URL: {url}")
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            final_url = resp.geturl()
            text = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        status = e.code
        final_url = e.geturl() if hasattr(e, "geturl") else url
        text = e.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as e:
        log(f"ERROR: failed to open activation URL: {e}")
        sys.exit(1)

    log(f"HTTP {status} (final URL: {final_url})")
    log(f"Response body (first 300 chars): {text[:300]!r}")

    hashed = set(HASHED_ENDPOINT_RE.findall(final_url)) | set(HASHED_ENDPOINT_RE.findall(text))
    if hashed:
        log("Found candidate hashed FormSubmit endpoint id(s):")
        for h in hashed:
            log(f"  https://formsubmit.co/{h}")
        log(
            "If confirmed, paste the id into "
            "src/components/ContactForm.astro's FORMSUBMIT_TARGET constant."
        )
    else:
        log(
            "No hashed endpoint id found in the confirmation page. That's fine — "
            f"FormSubmit will keep delivering to the plain address ({TARGET_ADDRESS})."
        )

    return text


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true", help="Skip the test POST to FormSubmit; still poll IMAP and open any link found.")
    parser.add_argument("--no-activate", action="store_true", help="Poll IMAP and print the found activation link, but do not open/click it.")
    args = parser.parse_args()

    post_activation_test(dry_run=args.dry_run)

    env = load_env(ENV_PATH)

    log(f"Polling {env['DUDLEY_SUPPORT_IMAP_MAILBOX']} for up to {POLL_TOTAL_SECONDS // 60} minutes ...")
    msg = poll_for_activation_email(env)

    if msg is None:
        log("ERROR: no FormSubmit activation email arrived within the poll window.")
        log(f"Check that {TARGET_ADDRESS} is actually forwarding into this mailbox, then retry.")
        sys.exit(1)

    subject = decode_mime_str(msg.get("Subject"))
    log(f"Found candidate email: subject={subject!r}")

    url = extract_activation_url(msg)
    if url is None:
        log("ERROR: found a matching email but no formsubmit.co link inside it.")
        sys.exit(1)

    log(f"Activation link: {url}")

    if args.no_activate:
        log("--no-activate: not opening the link. Re-run without this flag to activate.")
        return

    open_activation_url(url)
    log("Done. Send a real test submission through /contact/ to confirm delivery.")


if __name__ == "__main__":
    main()
