# CLAUDE.md

Shared context for Claude Code and Cowork working in this repo. Read this first;
it holds the decisions and standards that don't belong in commit messages.

## What this repo is

`jonny581.github.io` is a GitHub Pages user site — **always public**, no private
Pages tier exists. It currently hosts **two unrelated projects**:

1. **HomeEnabled** (repo root) — a static affiliate blog/store for aging-in-place
   products. Own README at `README.md`. Not related to project 2 — don't cross
   the streams (e.g. don't reuse HomeEnabled's price-check automation for
   ListingView, don't merge their CSS).
2. **ListingView + etsy-backend** (`listingview/`, `etsy-backend/`) — a personal
   Etsy listing-automation suite. This is the active project and the one this
   file mostly documents.

Both live on `master` (the deployed branch). Feature work happens on
`claude/listing-view-recreation-9r21ql` and merges to `master` when ready to go
live (merging = deploying, since Pages serves `master` directly).

## Project 2: ListingView + etsy-backend

**Goal:** automate selling downloadable AI art on Etsy, end to end — generated
artwork in, a live Etsy listing out — as a link in a larger Claude Code
automation chain. Single user (the repo owner), single Etsy shop, no multi-tenant
anything.

### Architecture

```
Claude Code automation ─┐
                        ├──► Cloudflare Worker (etsy-backend/) ──► Etsy Open API v3
listingview/ web UI ────┘         │
                                  └─ KV: rotating OAuth tokens
```

- **`listingview/`** — static frontend, no build step, no dependencies. Plain
  HTML/CSS/JS. Everything (dataset, mockup engine, SEO scoring) runs client-side
  with a seeded PRNG for demo data — no network calls except the optional live
  backend.
  - `assets/data.js` — seeded demo marketplace (listings/shops/categories)
  - `assets/mockups.js` — canvas rendering engine: composites any uploaded design
    onto 6 product templates (mug, tee, tote, hoodie, sticker, poster)
  - `assets/app.js` — router + all views (Dashboard, Explorer, Keyword Finder,
    Shop Explorer, Asset Library, Mockup Generator, Digital Delivery,
    **Auto-Publisher**, Listing Score, Tag Generator, Bulk Editor)
  - `assets/live.js` — thin client for the backend; config (URL + token) lives
    in `localStorage`, never hard-coded
  - `about.html` / `privacy.html` — **required for Etsy's developer app review**,
    not optional boilerplate. Keep them accurate if scopes or behavior change.
- **`etsy-backend/`** — single-user Cloudflare Worker. Holds Etsy OAuth
  credentials, does the real work: `POST /api/publish` = create draft listing →
  upload mockup photos → upload digital file → optional activate. See its own
  `README.md` for the full endpoint list and setup steps.

### Key decisions (and why)

- **Cloudflare Workers**, not another backend host — free tier is enough for
  one user, holds secrets server-side, trivial OAuth callback hosting.
- **Drafts by default.** `/api/publish` never activates a listing unless the
  caller explicitly passes `activate: true`. Etsy charges $0.20/listing on
  activation — don't spend it silently, ever.
- **Single shared bearer token** (`APP_TOKEN`), not real user accounts. Correct
  for a single-user tool; don't over-engineer auth here.
- **Etsy secrets never enter this repo or chat.** `ETSY_KEYSTRING` and
  `APP_TOKEN` are set via `wrangler secret put` (or the Cloudflare dashboard)
  directly on the user's machine — never pasted into a session, a file, or a
  commit. If asked to help with a secret, the answer is always "run this
  command yourself," never "paste it here."
- **Demo mode vs. live mode** in the frontend are the same code path — live
  mode just means `LVLive.getConfig().live` is true and a real backend URL is
  configured. Don't fork the UI into two versions; branch at the point of the
  actual API call (see `routes.publish` in `app.js`).
- **App name "ListingView"** collides with an existing commercial product
  (listingview.io) that this project was originally modeled after (UI/UX
  reference only — no code, assets, or backend from them). Flagged as a risk
  for Etsy's app review and worth renaming before wide use; not yet resolved.
  Check with the user before assuming it's settled.

### Standards

- **No secrets, ever, in this repo.** `.gitignore` covers `.wrangler/`,
  `.dev.vars`, `node_modules/`. Before committing, check `git status` for
  anything that looks like a token or credential.
- **Testing:** no formal test runner is wired into CI for the frontend. Verify
  UI changes with a headless Playwright smoke pass before calling work done —
  see the pattern in prior session scratch files (navigate each route, assert
  no `pageerror`/console errors, screenshot key states). The backend has a real
  test suite: `cd etsy-backend && npm test` (routing/auth/PKCE/validation,
  no live Etsy calls — that part is manual, see its README).
- **Commit messages:** explain *why*, not just *what*; this repo's history is
  the design log for this project since there's no separate issue tracker.
- **Etsy API usage stays within `etsy-backend/`.** The frontend never talks to
  Etsy directly — always through the Worker, so credentials stay server-side.

### Current status (update this section as things move)

- Etsy developer app: **submitted, approval pending.** Keystring issued but
  shop-connect OAuth may not be fully live until Etsy approves.
- Backend: code complete, unit-tested, **not yet deployed** (deploy is a user
  action — needs their own `wrangler login`).
- Live-mode publish flow: verified end-to-end against a local mock backend
  (correct payload shape: title, 13 tags, 6 mockup images, 1 digital file,
  price, description, `activate:false`). **Not yet verified against real Etsy.**
- Open decision: rename before wider use? (see "ListingView" naming risk above)

## Working conventions for this repo

- Default branch for Pages deploy is `master`; treat merges to it as production
  deploys, not just code review checkpoints.
- When adding a new automated-listing capability, update both
  `listingview/README.md` (or `etsy-backend/README.md`) *and* this file's
  "Current status" section — this file should always reflect where the project
  actually is, not where it started.
- If a request could plausibly touch the HomeEnabled site, confirm scope first
  — the two projects are unrelated and shouldn't bleed into each other.
