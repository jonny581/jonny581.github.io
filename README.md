# HomeEnabled — Aging-in-Place Affiliate Blog & Store

A production-quality static affiliate site for **HomeEnabled**, a brand that reviews
the latest products, technology and health-care updates helping aging adults live
safely and independently in their own homes.

**Live site:** https://jonny581.github.io/

## What's inside

- **Home** (`index.html`) — hero, trust strip, featured products, categories, latest posts, newsletter
- **Shop Products** (`products.html`) — all 10 reviewed products, grouped by category
- **Blog** (`blog.html`) — index of all 10 review articles
- **10 full review articles** (`articles/*.html`) — each with byline, verdict score, key
  features, spec table, pros/cons, FAQ, and affiliate CTAs to AmeriGlide / US Medical Supplies
- **Info pages** — About, Contact, FTC Affiliate Disclosure, Privacy Policy

## Products covered

| Product | Category | Retailer |
| --- | --- | --- |
| AmeriGlide Rave 2 Stair Lift | Stair Lifts & Home Access | AmeriGlide |
| AmeriGlide Horizon Stair Lift | Stair Lifts & Home Access | AmeriGlide |
| AmeriGlide Hercules II 750 Vertical Platform Lift | Stair Lifts & Home Access | AmeriGlide |
| AmeriGlide Express Dumbwaiter | Stair Lifts & Home Access | AmeriGlide |
| AmeriGlide Reclining Bath Lift | Bathroom Safety | US Medical Supplies |
| AmeriGlide Sanctuary Walk-In Tub | Bathroom Safety | AmeriGlide |
| AmeriGlide Toilet Incline Lift | Bathroom Safety | AmeriGlide |
| Golden MaxiComfort Cloud PR-510 Lift Chair | Comfort & Daily Living | US Medical Supplies |
| Pride Go-Go Elite Traveller Scooter | Mobility | US Medical Supplies |
| AmeriGlide Aluminum Modular Ramp | Mobility | US Medical Supplies |

## Images

Each product has a distinct, hand-crafted SVG illustration in `assets/images/`,
modeled on the appearance of the real product (the retailer sites block automated
image retrieval, so original illustrations are used instead of hotlinked photos —
they never break, scale losslessly, and weigh a few KB each).

## Editing / regenerating pages

All HTML pages are rendered by a single generator that holds the product data and
article copy:

```bash
python3 tools/generate.py
```

Edit product details, prices, links or article text in `tools/generate.py` and re-run.
Styles live in `assets/css/style.css` (high-contrast, WCAG AA, senior-friendly type scale).

## Weekly price updates (manual, ~15 minutes)

Prices live in **`data/prices.json`** (the single source of truth), separate from
the article copy in `tools/generate.py`. Updating them is a quick weekly habit —
you change one number, automation does the rest.

**Your weekly routine**

1. Open **[`PRICE-CHECK.md`](PRICE-CHECK.md)** — a checklist (regenerated on every
   build) listing each product, its current price, and a direct link to the
   retailer's page. Click each link and compare (~10 min).
2. For anything that changed, open **`data/prices.json`** on GitHub, click the
   pencil (Edit), change that product's `"price"` (and `"was"` if the sale
   changed), and **Commit changes** (~5 min).
3. Done. You don't run anything else.

**What happens automatically** (`.github/workflows/site-build.yml`, triggered by
your commit to `data/prices.json`):

- Validates the JSON (a typo fails the build instead of deploying a broken file).
- Runs `tools/check_prices.py --sync` — stamps this week's *"last verified"* date
  on every product, and for any changed price appends a dated **history** entry.
- Regenerates the site and commits the rebuilt pages, which **deploys** them.
- A green **"Price Drop"** badge appears on the card and review for ~45 days after
  a decrease; every review shows a dynamic *"last verified ⟨date⟩"* line.

> **Nothing changed this week?** Open *Actions → Build & Deploy on Price Update →
> Run workflow* to refresh the "last verified" dates without editing anything.

**Local alternative** (if you prefer the terminal):

```bash
python3 tools/check_prices.py --seed   # (re)build prices.json from generate.py
# ...edit the price values in data/prices.json...
python3 tools/check_prices.py          # --sync: stamp dates + record changes (no network)
python3 tools/generate.py              # re-render the site
python3 tools/check_prices.py --scan   # OPTIONAL: try fetching live prices (often blocked)
```

> Note: `--scan` (live fetching) is kept for occasional spot-checks but is **not**
> scheduled — AmeriGlide and US Medical Supplies block automated requests, which is
> exactly why the weekly check is a manual eyeball.

## Compliance notes

- Affiliate relationships are disclosed in the announcement bar, in every article,
  in the footer, and on a dedicated disclosure page (FTC 16 CFR Part 255).
- Affiliate URLs carry `utm_source=homeenabled` parameters — replace with your real
  affiliate/tracking links before monetizing.
- Prices and specs are illustrative; verify against the retailer before publishing.
