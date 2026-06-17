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

## Automatic price checking

Prices live in **`data/prices.json`** (the single source of truth), separate from
the article copy in `tools/generate.py`. A weekly GitHub Action keeps them current:

1. **`.github/workflows/price-check.yml`** runs every Monday (and on-demand via
   *Actions → Weekly Price Check → Run workflow*).
2. **`tools/check_prices.py`** fetches each product's `scrape_url`, extracts the
   current price (tries schema.org JSON-LD → price meta tags → an optional
   per-product regex), and writes any change back to `prices.json` with a dated
   history entry.
3. The site is regenerated and, **if a price changed, auto-committed and pushed** —
   which on GitHub Pages publishes the new price. A green **"Price Drop"** badge
   appears on the card and review for ~45 days after a decrease, and every review
   shows a dynamic *"last verified ⟨date⟩"* line.

**Fail-safe by design:** if a page is blocked (HTTP 403) or the price can't be
parsed, the checker **keeps the existing price** and flags the record — it never
publishes a `$0` or blank price.

**Before it pulls live numbers, you must:** put the real product-page URL in each
product's `scrape_url`, and (if a retailer doesn't expose schema.org/meta pricing)
add an `extract.regex` that captures the price. Heads-up: AmeriGlide and
US Medical Supplies currently return `403` to automated requests, so out of the
box the weekly run will safely keep prices unchanged and flag them as unreachable
until real URLs/selectors (or a scraping service/API) are wired in.

Run it locally:

```bash
python3 tools/check_prices.py --seed     # (re)build prices.json from generate.py
python3 tools/check_prices.py --dry-run  # check live prices, write nothing
python3 tools/check_prices.py            # check and update prices.json
python3 tools/generate.py                # re-render the site from updated prices
```

## Compliance notes

- Affiliate relationships are disclosed in the announcement bar, in every article,
  in the footer, and on a dedicated disclosure page (FTC 16 CFR Part 255).
- Affiliate URLs carry `utm_source=homeenabled` parameters — replace with your real
  affiliate/tracking links before monetizing.
- Prices and specs are illustrative; verify against the retailer before publishing.
