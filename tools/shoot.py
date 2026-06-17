#!/usr/bin/env python3
"""Screenshot HomeEnabled pages for visual QA. Usage: python3 tools/shoot.py [tag]"""
import sys, os
from playwright.sync_api import sync_playwright

ROOT = "file://" + os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAG = sys.argv[1] if len(sys.argv) > 1 else "now"
OUT = f"/tmp/shots/{TAG}"
os.makedirs(OUT, exist_ok=True)

PAGES = [
    ("index.html", "home", True),
    ("products.html", "products", False),
    ("blog.html", "blog", False),
    ("articles/ameriglide-rave-2-stair-lift-review.html", "article", True),
    ("contact.html", "contact", False),
]
EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

with sync_playwright() as p:
    b = p.chromium.launch(headless=True, executable_path=EXE,
                          args=["--no-sandbox", "--disable-gpu"])
    pg = b.new_page(viewport={"width": 1340, "height": 1000}, device_scale_factor=1)
    for path, name, full in PAGES:
        pg.goto(ROOT + "/" + path, wait_until="load")
        pg.wait_for_timeout(500)
        pg.screenshot(path=f"{OUT}/{name}.png", full_page=full)
        print(f"  {OUT}/{name}.png")
    pg.set_viewport_size({"width": 390, "height": 844})
    pg.goto(ROOT + "/index.html", wait_until="load"); pg.wait_for_timeout(500)
    pg.screenshot(path=f"{OUT}/home-mobile.png", full_page=True)
    print(f"  {OUT}/home-mobile.png")
    b.close()
