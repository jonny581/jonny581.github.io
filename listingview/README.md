# ListingView — Etsy research suite (demo build)

A self-contained recreation of an Etsy product-research tool in the spirit of
listingview.io. It is a static single-page app — no build step, no backend,
no dependencies — so it deploys straight from GitHub Pages at
`/listingview/`.

Because a static site cannot call Etsy's API, the marketplace is a **seeded
demo dataset** (`assets/data.js`): ~230 listings across 10 categories and 48
shops, generated deterministically so every visitor sees the same numbers.
The optimization tools (Listing Score, Tag Generator, Bulk Editor) are fully
functional against any input you type.

## Tools

| Route | Tool | What it does |
| --- | --- | --- |
| `#/dashboard` | Dashboard | Market totals, 12-month sales line, revenue-by-category bars, top listings |
| `#/explorer` | Listing Explorer | Search / filter / sort all listings; row click opens a detail drawer with photos, trend chart and tags |
| `#/keywords` | Keyword Finder | Volume, competition, average price, recommendation score, matching listings, related terms |
| `#/shops` | Shop Explorer | Shop-level aggregates, sortable, linked back into the Explorer |
| `#/library` | Asset Library | Folders + drag-and-drop uploads; every file you sell in one place; images feed the Mockup Generator |
| `#/mockups` | Mockup Generator | Renders any design onto 6 products (mug, tee, tote, hoodie, sticker, poster); download PNGs, save the set to the library, or apply it as a listing's photos |
| `#/delivery` | Digital Delivery | Attach library folders to a listing; simulated checkout queue auto-delivers files to buyers |
| `#/score` | Listing Score | 0–100 SEO score for any title + tags + description with check-by-check fix-it tips |
| `#/tags` | Tag Generator | 13 ready-to-paste tags (each ≤ 20 chars) from a product keyword, with copy-all |
| `#/bulk` | Bulk Editor | Find & replace, price % adjustments, prefix/suffix, and photo slot edits (add / delete / swap) — with before/after preview, then apply |

## The mockup pipeline

The three asset tools chain together so an image you create is always one step
from a listing photo:

1. Upload a design (or drop it straight into the Mockup Generator). PNG, JPG,
   WebP and SVG all work; transparent PNGs look best.
2. The generator composites it onto every product template with canvas —
   cylindrical warp on the mug, die-cut white border on the sticker, framed
   matte on the poster — with size/position sliders.
3. Download any mockup as a PNG, **Save set to Asset Library** (lands in the
   `Mockups` folder), or **Apply 6 photos** to put the whole set on a listing.
4. Saved mockups also appear in the Bulk Editor's *Photos* operation, so one
   image can be pushed into a chosen photo slot across hundreds of listings.

Templates live in `assets/mockups.js`; each one declares a print area and a
`render()` that draws the scene, so adding a new product is one entry in the
`templates` array.

## Files

- `index.html` — app shell (sidebar navigation + hash router mount point)
- `assets/app.css` — styles; light/dark themes (`◐ Theme` toggle, follows OS preference by default)
- `assets/data.js` — seeded PRNG demo dataset (listings, shops, categories)
- `assets/app.js` — router, all seven views, SEO analyzer, keyword model, SVG charts with tooltips

## Notes

- The SEO scoring rules mirror widely published Etsy best practice (140-char
  titles, 13 tags of ≤ 20 chars, multi-word tags, tag/title alignment, etc.).
- All numbers are illustrative. Not affiliated with Etsy, Inc.
