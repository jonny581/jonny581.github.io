#!/usr/bin/env python3
"""HomeEnabled weekly price checker.

Reads data/prices.json (the source of truth for product pricing), fetches each
product's retailer page, extracts the current price, and writes any changes
back to prices.json along with a change history. tools/generate.py then renders
the site from the updated data.

Design goals:
  * Fail-safe — a blocked fetch or unparseable page NEVER overwrites a good
    price or publishes $0. The old price is kept and the record is flagged.
  * Zero third-party dependencies (Python standard library only) so the GitHub
    Action needs no pip install and runs fast.

Usage:
  python3 tools/check_prices.py --seed     # create prices.json from generate.py
  python3 tools/check_prices.py            # check prices, update prices.json
  python3 tools/check_prices.py --dry-run  # check but don't write changes
"""
import os, sys, re, json, time, argparse, datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data", "prices.json")
sys.path.insert(0, HERE)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
HISTORY_MAX = 24


# --------------------------------------------------------------- money utils

def to_float(s):
    """'$2,199.00' -> 2199.0 ; returns None if no number found."""
    if s is None:
        return None
    s = str(s).replace(",", "")
    m = re.search(r"\d+(?:\.\d+)?", s)
    return float(m.group()) if m else None


def fmt_money(v):
    if v is None:
        return None
    if abs(v - round(v)) < 0.005:
        return "${:,}".format(int(round(v)))
    return "${:,.2f}".format(v)


# ----------------------------------------------------------- price extraction

def _walk_offers(node):
    found = []
    if isinstance(node, dict):
        if "offers" in node:
            offers = node["offers"]
            for o in (offers if isinstance(offers, list) else [offers]):
                if isinstance(o, dict):
                    for k in ("price", "lowPrice", "highPrice"):
                        if o.get(k):
                            found.append(o[k])
        for v in node.values():
            found += _walk_offers(v)
    elif isinstance(node, list):
        for v in node:
            found += _walk_offers(v)
    return found


def from_jsonld(html_text):
    for m in re.finditer(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>',
                         html_text, re.S | re.I):
        try:
            data = json.loads(m.group(1).strip())
        except Exception:
            continue
        prices = [to_float(p) for p in _walk_offers(data)]
        prices = [p for p in prices if p]
        if prices:
            return min(prices)   # the actual sale price, not a struck-through high
    return None


def from_meta(html_text):
    for prop in ("product:price:amount", "og:price:amount"):
        m = re.search(r'<meta[^>]+(?:property|name)=["\']' + prop +
                      r'["\'][^>]+content=["\']([\d.,]+)["\']', html_text, re.I)
        if not m:
            m = re.search(r'<meta[^>]+content=["\']([\d.,]+)["\'][^>]+(?:property|name)=["\']' +
                          prop + r'["\']', html_text, re.I)
        if m:
            return to_float(m.group(1))
    m = re.search(r'itemprop=["\']price["\'][^>]+content=["\']([\d.,]+)["\']', html_text, re.I)
    return to_float(m.group(1)) if m else None


def from_regex(html_text, pattern):
    if not pattern:
        return None
    m = re.search(pattern, html_text, re.I | re.S)
    return to_float(m.group(1)) if m else None


def extract_price(html_text, rec):
    """Return (price_float, method) trying the most reliable sources first."""
    cfg = rec.get("extract", {}) or {}
    custom = from_regex(html_text, cfg.get("regex"))
    if custom:
        return custom, "regex"
    p = from_jsonld(html_text)
    if p:
        return p, "json-ld"
    p = from_meta(html_text)
    if p:
        return p, "meta"
    return None, None


# ------------------------------------------------------------------- fetching

def fetch(url, retries=3):
    last = None
    for attempt in range(retries):
        try:
            req = Request(url, headers=HEADERS)
            with urlopen(req, timeout=25) as r:
                return r.read().decode("utf-8", "ignore"), None
        except HTTPError as e:
            last = "HTTP %s" % e.code
        except URLError as e:
            last = "URL error: %s" % e.reason
        except Exception as e:                      # noqa: BLE001
            last = str(e)[:120]
        time.sleep(2 ** attempt)
    return None, last


# ---------------------------------------------------------------------- seed

def seed():
    import generate
    data = {}
    if os.path.exists(DATA):
        data = json.load(open(DATA))
    for p in generate.PRODUCTS:
        slug = p["slug"]
        existing = data.get(slug, {})
        data[slug] = {
            "name": p["name"],
            "retailer": p["retailer"],
            "price": existing.get("price", p["price"]),
            "was": existing.get("was", p["was"]),
            "currency": "USD",
            # clean URL for scraping (strip affiliate/UTM query); EDIT to the
            # real product page if the seeded one is a placeholder.
            "scrape_url": existing.get("scrape_url", p["link"].split("?")[0]),
            "extract": existing.get("extract", {"strategy": "auto", "regex": None}),
            "status": existing.get("status", "seeded"),
            "last_checked": existing.get("last_checked"),
            "last_changed": existing.get("last_changed"),
            "history": existing.get("history", []),
        }
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    json.dump(data, open(DATA, "w"), indent=2)
    print("Seeded %d products -> %s" % (len(data), DATA))


# --------------------------------------------------------------------- check

def check(dry_run=False):
    if not os.path.exists(DATA):
        print("No prices.json — run with --seed first.")
        return 1
    data = json.load(open(DATA))
    now = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    changes, blocked, ok = [], [], 0

    for slug, rec in data.items():
        url = rec.get("scrape_url")
        rec["last_checked"] = now
        html_text, err = fetch(url) if url else (None, "no url")
        if html_text is None:
            rec["status"] = "unreachable"
            rec["status_note"] = err
            blocked.append((slug, err))
            continue
        price, method = extract_price(html_text, rec)
        if price is None:
            rec["status"] = "no_price_found"
            blocked.append((slug, "price not found on page"))
            continue

        ok += 1
        old = to_float(rec.get("price"))
        new_str = fmt_money(price)
        rec["status"] = "ok"
        rec["status_note"] = "via %s" % method
        if old is None or abs(price - old) >= 0.01:
            entry = {"t": now, "from": rec.get("price"), "to": new_str}
            rec["history"] = ([entry] + rec.get("history", []))[:HISTORY_MAX]
            rec["last_changed"] = now
            rec["price"] = new_str
            changes.append((slug, entry["from"], new_str))

    if not dry_run:
        json.dump(data, open(DATA, "w"), indent=2)

    _report(changes, blocked, ok)
    return 0


def _report(changes, blocked, ok):
    lines = []
    if changes:
        lines.append("### 💲 Price changes (%d)" % len(changes))
        for slug, frm, to in changes:
            lines.append("- **%s**: %s → **%s**" % (slug, frm, to))
    else:
        lines.append("### ✅ No price changes")
    lines.append("")
    lines.append("Checked OK: %d · Could not read: %d" % (ok, len(blocked)))
    if blocked:
        lines.append("")
        lines.append("<details><summary>Unreadable products (price kept)</summary>")
        lines.append("")
        for slug, why in blocked:
            lines.append("- %s — %s" % (slug, why))
        lines.append("</details>")
    report = "\n".join(lines)
    print(report)

    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a") as f:
            f.write(report + "\n")
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a") as f:
            f.write("changed=%s\n" % ("true" if changes else "false"))


# ----------------------------------------------------------------------- main

if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="HomeEnabled price checker")
    ap.add_argument("--seed", action="store_true", help="create/refresh prices.json from generate.py")
    ap.add_argument("--dry-run", action="store_true", help="check but do not write changes")
    args = ap.parse_args()
    if args.seed:
        seed()
    else:
        sys.exit(check(dry_run=args.dry_run))
