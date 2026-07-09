# ListingView — Etsy publishing backend

A single-user [Cloudflare Worker](https://workers.cloudflare.com/) that holds your
Etsy Open API v3 credentials and turns a "publish this design" request into a real
Etsy listing. Both the ListingView web UI (live mode) and a Claude Code automation
call the same endpoint:

```
POST /api/publish  ->  create draft listing -> upload photos -> upload digital file -> (optional) activate
```

No Etsy secret ever reaches the browser — it lives only in Worker secrets + KV.

---

## What you'll need (once)

1. A **Cloudflare account** (free tier is fine).
2. An **Etsy account with an open shop** that can sell **digital downloads**.
3. An **Etsy app** (for the API keystring) — register at
   <https://www.etsy.com/developers/your-apps>. Etsy grants "personal" API access
   quickly; you don't need commercial approval for single-user publishing.

You provide two secrets; you invent one of them:

| Secret | Where it comes from |
| --- | --- |
| `ETSY_KEYSTRING` | Your Etsy app's **API Key (keystring)** |
| `APP_TOKEN` | **You invent it** — a long random string. It's the shared key your UI and automation send as `Authorization: Bearer <APP_TOKEN>`. Generate one: `openssl rand -hex 32` |

---

## Setup, step by step

All commands run from this `etsy-backend/` folder.

### 1. Install & log in

```bash
npm install
npx wrangler login          # opens a browser to authorize Cloudflare
```

### 2. Create the KV namespace (stores the rotating OAuth tokens)

```bash
npx wrangler kv namespace create TOKENS
```

Copy the printed `id` into `wrangler.toml` under `[[kv_namespaces]]` (replace
`PASTE_KV_NAMESPACE_ID_HERE`).

### 3. Set your secrets

```bash
npx wrangler secret put ETSY_KEYSTRING     # paste your Etsy app keystring
npx wrangler secret put APP_TOKEN          # paste your invented random token
```

### 4. First deploy (to learn your Worker URL)

```bash
npx wrangler deploy
```

Wrangler prints a URL like `https://listingview-etsy.<your-subdomain>.workers.dev`.

### 5. Wire up the redirect URL

- In **`wrangler.toml`**, set
  `REDIRECT_URI = "https://listingview-etsy.<your-subdomain>.workers.dev/oauth/callback"`.
- In your **Etsy app settings**, add that exact same URL as a **Callback URL**.
- Redeploy: `npx wrangler deploy`.

### 6. Connect your Etsy account (one-time OAuth)

Open this in your browser (substitute your Worker URL and your `APP_TOKEN`):

```
https://listingview-etsy.<your-subdomain>.workers.dev/oauth/login?key=<APP_TOKEN>
```

Approve the Etsy consent screen. You'll land on a "✓ Etsy connected" page. The
refresh token is now stored in KV and auto-refreshes forever (until you revoke it).

### 7. Verify

```bash
curl https://listingview-etsy.<your-subdomain>.workers.dev/api/shop \
  -H "Authorization: Bearer <APP_TOKEN>"
```

You should see your shop name and active-listing count.

### 8. Pick a taxonomy id (Etsy requires one per listing)

```bash
curl "https://listingview-etsy.<your-subdomain>.workers.dev/api/taxonomy?q=digital" \
  -H "Authorization: Bearer <APP_TOKEN>"
```

Find the node you want (e.g. **Digital Prints**) and set its `id` as
`DEFAULT_TAXONOMY_ID` in `wrangler.toml` (then redeploy), or pass `taxonomy_id`
per request. You can also set it in the web UI's live-publishing panel.

---

## Using it

### From the ListingView web UI

Open the app → **Auto-Publisher** → expand **Live publishing**:

1. Paste your Worker URL and `APP_TOKEN`, and your default taxonomy id.
2. Click **Test connection** — it should show your shop name.
3. Tick **Live mode**. (Leave **Activate** off at first — listings are created as
   **drafts** so you can review them in Etsy before spending the $0.20/listing fee.)
4. Queue designs and **Bulk-post**. Each row shows its real Etsy listing id with
   an **Open on Etsy** link.

### From a Claude Code automation

The same endpoint, called headlessly. This is the hand-off point for an art-
generation workflow — generate the art, then:

```bash
curl -X POST "$BACKEND/api/publish" \
  -H "Authorization: Bearer $APP_TOKEN" \
  -H "content-type: application/json" \
  -d '{
    "title": "Celestial Moon Phases Printable Wall Art | Boho Decor | Digital Download",
    "description": "High-resolution instant download ...",
    "price": 6.99,
    "tags": ["printable wall art","boho decor","moon phases","digital download"],
    "taxonomy_id": 2078,
    "images": ["data:image/png;base64,...", "data:image/png;base64,..."],
    "files":  [{ "name": "moon-phases.zip", "data": "data:application/zip;base64,..." }],
    "activate": false
  }'
```

Response:

```json
{ "ok": true, "listing_id": 1234567890, "state": "draft",
  "url": "https://www.etsy.com/listing/1234567890",
  "images_uploaded": 6, "files_uploaded": 1 }
```

`images` and `files[].data` are `data:` URIs (base64). PNG/JPG/WebP for photos
(SVGs are skipped — Etsy rejects them as photos); any file type for the digital
deliverable. Omit `activate` (or set `false`) to create a reviewable draft; set
`true` to publish live and incur Etsy's listing fee.

---

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | none | liveness check |
| GET | `/oauth/login?key=<APP_TOKEN>` | key | start one-time Etsy authorization |
| GET | `/oauth/callback` | Etsy | stores tokens (Etsy redirects here) |
| GET | `/api/shop` | bearer | connected shop info |
| GET | `/api/taxonomy?q=<term>` | bearer | search Etsy seller taxonomy |
| POST | `/api/publish` | bearer | create a listing (see payload above) |

## Local development / tests

```bash
npm test          # routing, auth, PKCE, and input-validation checks (no Etsy calls)
npm run dev       # wrangler dev — run the Worker locally
npm run tail      # stream live logs from the deployed Worker
```

The test suite (`test/logic.test.mjs`) exercises everything that doesn't require
real Etsy credentials. The only path it can't cover is the actual Etsy API calls
in `/api/publish` and `/api/shop` — those you validate with step 7 above once
you're connected.

## Notes & safety

- **Drafts by default.** Nothing goes live (or costs money) unless you pass
  `activate: true` / tick Activate.
- **Token rotation.** Etsy rotates refresh tokens; the Worker stores the new one
  on every refresh. If refresh ever fails (revoked/expired), re-run step 6.
- **One user.** Auth is a single shared token by design. Keep `APP_TOKEN` secret;
  anyone with it + your Worker URL can publish to your shop. Rotate it any time
  with `wrangler secret put APP_TOKEN`.
- **Not affiliated with Etsy, Inc.** Uses the official Etsy Open API v3 under your
  own app credentials.
