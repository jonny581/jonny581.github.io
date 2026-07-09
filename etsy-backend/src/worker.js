/* ListingView — Etsy publishing backend (Cloudflare Worker)
 *
 * A single-user backend that holds your Etsy Open API v3 credentials and turns
 * a "publish this design" request into a real Etsy listing:
 *
 *   POST /api/publish  ->  createDraftListing -> upload images -> upload files
 *                          -> (optional) activate
 *
 * Both the ListingView web UI (live mode) and a Claude Code automation call the
 * same endpoint with a shared bearer token (env.APP_TOKEN). No Etsy secret ever
 * reaches the browser — it lives only in Worker secrets + KV.
 *
 * Endpoints
 *   GET  /health                     -> {ok:true}                (public)
 *   GET  /oauth/login?key=APP_TOKEN  -> 302 to Etsy consent      (one-time)
 *   GET  /oauth/callback             -> stores tokens in KV      (Etsy redirect)
 *   GET  /api/shop                   -> connected shop info      (auth)
 *   GET  /api/taxonomy?q=digital     -> search seller taxonomy   (auth)
 *   POST /api/publish                -> create a listing         (auth)
 *
 * Auth: every /api/* call must send `Authorization: Bearer <APP_TOKEN>`.
 *
 * Required secrets (wrangler secret put ...): ETSY_KEYSTRING, APP_TOKEN
 * Required vars (wrangler.toml [vars]):       REDIRECT_URI, optional DEFAULT_TAXONOMY_ID, SHOP_ID
 * Required KV binding:                        TOKENS
 */

const ETSY_API = "https://api.etsy.com/v3/application";
const ETSY_TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";
const ETSY_CONNECT_URL = "https://www.etsy.com/oauth/connect";
const SCOPES = "listings_r listings_w shops_r shops_w";
const TOKENS_KEY = "etsy_tokens";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") return cors(request, new Response(null, { status: 204 }));

    try {
      if (pathname === "/health") return cors(request, json({ ok: true, service: "listingview-etsy-backend" }));

      if (pathname === "/oauth/login") return handleLogin(request, env, url);
      if (pathname === "/oauth/callback") return handleCallback(request, env, url);

      // Everything under /api requires the shared bearer token.
      if (pathname.startsWith("/api/")) {
        const authErr = requireAuth(request, env);
        if (authErr) return cors(request, authErr);

        if (pathname === "/api/shop" && request.method === "GET") return handleShop(request, env);
        if (pathname === "/api/taxonomy" && request.method === "GET") return handleTaxonomy(request, env, url);
        if (pathname === "/api/publish" && request.method === "POST") return handlePublish(request, env);

        return cors(request, json({ error: "not_found", path: pathname }, 404));
      }

      return cors(request, json({ error: "not_found" }, 404));
    } catch (err) {
      return cors(request, json({ error: "server_error", message: String(err && err.message || err) }, 500));
    }
  },
};

/* ------------------------------------------------------------------ helpers */

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

function cors(request, response) {
  const origin = request.headers.get("Origin") || "*";
  const h = new Headers(response.headers);
  h.set("Access-Control-Allow-Origin", origin);
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization, content-type");
  h.set("Access-Control-Max-Age", "86400");
  return new Response(response.body, { status: response.status, headers: h });
}

function requireAuth(request, env) {
  const got = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!env.APP_TOKEN) return json({ error: "misconfigured", message: "APP_TOKEN secret is not set" }, 500);
  // constant-time-ish compare
  if (got.length !== env.APP_TOKEN.length || got !== env.APP_TOKEN) {
    return json({ error: "unauthorized" }, 401);
  }
  return null;
}

function b64url(bytes) {
  let s = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function pkcePair() {
  const verifier = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: b64url(digest) };
}

/* -------------------------------------------------------------------- oauth */

async function handleLogin(request, env, url) {
  // Gate the consent kickoff behind the app token so randoms can't start it.
  if (url.searchParams.get("key") !== env.APP_TOKEN) {
    return cors(request, json({ error: "unauthorized", hint: "call /oauth/login?key=YOUR_APP_TOKEN" }, 401));
  }
  const { verifier, challenge } = await pkcePair();
  const state = b64url(crypto.getRandomValues(new Uint8Array(16)));
  await env.TOKENS.put("pkce_" + state, verifier, { expirationTtl: 600 });

  const authUrl = new URL(ETSY_CONNECT_URL);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", env.ETSY_KEYSTRING);
  authUrl.searchParams.set("redirect_uri", env.REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  return Response.redirect(authUrl.toString(), 302);
}

async function handleCallback(request, env, url) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  if (err) return cors(request, json({ error: "etsy_denied", detail: err }, 400));
  if (!code || !state) return cors(request, json({ error: "missing_code_or_state" }, 400));

  const verifier = await env.TOKENS.get("pkce_" + state);
  if (!verifier) return cors(request, json({ error: "state_expired", hint: "restart at /oauth/login" }, 400));
  await env.TOKENS.delete("pkce_" + state);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.ETSY_KEYSTRING,
    redirect_uri: env.REDIRECT_URI,
    code,
    code_verifier: verifier,
  });
  const res = await fetch(ETSY_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) return cors(request, json({ error: "token_exchange_failed", detail: data }, 502));

  await storeTokens(env, data);
  return cors(request, new Response(
    "<!doctype html><meta charset=utf-8><body style=\"font:16px system-ui;max-width:640px;margin:60px auto;padding:0 20px\">" +
    "<h2>✓ Etsy connected</h2><p>Tokens stored. You can close this tab — your backend can now publish listings.</p>" +
    "<p>Verify with <code>GET /api/shop</code> (send your app token).</p></body>",
    { headers: { "content-type": "text/html; charset=utf-8" } }));
}

async function storeTokens(env, data) {
  const rec = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000,
  };
  await env.TOKENS.put(TOKENS_KEY, JSON.stringify(rec));
  return rec;
}

// Returns a valid access token, refreshing (and rotating the refresh token) if needed.
async function getAccessToken(env) {
  const raw = await env.TOKENS.get(TOKENS_KEY);
  if (!raw) throw new Error("not_connected: run /oauth/login?key=APP_TOKEN once to authorize");
  let rec = JSON.parse(raw);
  if (Date.now() < rec.expires_at - 60000) return rec.access_token;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: env.ETSY_KEYSTRING,
    refresh_token: rec.refresh_token,
  });
  const res = await fetch(ETSY_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error("refresh_failed (re-run /oauth/login): " + JSON.stringify(data));
  rec = await storeTokens(env, data);
  return rec.access_token;
}

// Authenticated call to the Etsy API. `body` may be URLSearchParams or FormData.
async function etsy(env, method, path, { body, token } = {}) {
  const access = token || await getAccessToken(env);
  const headers = { "x-api-key": env.ETSY_KEYSTRING, Authorization: "Bearer " + access };
  const res = await fetch(ETSY_API + path, { method, headers, body });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const e = new Error("etsy_error " + res.status + " " + method + " " + path);
    e.status = res.status; e.detail = data;
    throw e;
  }
  return data;
}

async function resolveShopId(env) {
  if (env.SHOP_ID) return env.SHOP_ID;
  const me = await etsy(env, "GET", "/users/me");
  if (me.shop_id) return String(me.shop_id);
  // Fallback: list the user's shops
  const shops = await etsy(env, "GET", `/users/${me.user_id}/shops`);
  const id = shops && (shops.shop_id || (shops.results && shops.results[0] && shops.results[0].shop_id));
  if (!id) throw new Error("no_shop_found: set SHOP_ID in wrangler.toml");
  return String(id);
}

/* --------------------------------------------------------------------- /api */

async function handleShop(request, env) {
  try {
    const me = await etsy(env, "GET", "/users/me");
    const shopId = await resolveShopId(env);
    const shop = await etsy(env, "GET", `/shops/${shopId}`);
    return cors(request, json({
      ok: true, user_id: me.user_id, shop_id: shopId,
      shop_name: shop.shop_name, listing_active_count: shop.listing_active_count,
      currency: shop.currency_code, url: shop.url,
    }));
  } catch (err) {
    return cors(request, json({ ok: false, error: err.message, detail: err.detail || null }, err.status || 500));
  }
}

async function handleTaxonomy(request, env, url) {
  const q = (url.searchParams.get("q") || "").toLowerCase();
  try {
    const nodes = await etsy(env, "GET", "/seller-taxonomy/nodes");
    const flat = [];
    const walk = (arr) => arr.forEach((n) => { flat.push({ id: n.id, name: n.name, full: n.full_path_taxonomy_ids }); if (n.children) walk(n.children); });
    walk(nodes.results || []);
    const hits = q ? flat.filter((n) => n.name.toLowerCase().includes(q)) : flat;
    return cors(request, json({ ok: true, count: hits.length, results: hits.slice(0, 60) }));
  } catch (err) {
    return cors(request, json({ ok: false, error: err.message, detail: err.detail || null }, err.status || 500));
  }
}

// Decode a data: URI or return null. Returns { blob, ext }.
async function dataUriToBlob(uri) {
  if (typeof uri !== "string" || !uri.startsWith("data:")) return null;
  const res = await fetch(uri); // Workers can fetch data: URIs
  const blob = await res.blob();
  const mime = (uri.slice(5).split(";")[0] || blob.type || "application/octet-stream");
  const ext = ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg", "application/pdf": "pdf", "application/zip": "zip" })[mime] || "bin";
  return { blob, mime, ext };
}

/*
 * POST /api/publish
 * {
 *   "title": "...", "description": "...", "price": 6.99,
 *   "tags": ["...", ...],                       // up to 13
 *   "taxonomy_id": 2078,                         // optional -> DEFAULT_TAXONOMY_ID
 *   "quantity": 999,                             // optional
 *   "who_made": "i_did", "when_made": "made_to_order",  // optional defaults
 *   "type": "download",                          // "download" (digital) or "physical"
 *   "images": ["data:image/png;base64,..."],     // becomes listing photos
 *   "files":  [{ "name": "art.zip", "data": "data:application/zip;base64,..." }],
 *   "activate": false                            // true -> spend the $0.20 fee & go live
 * }
 * -> { ok, listing_id, state, url, images_uploaded, files_uploaded }
 */
async function handlePublish(request, env) {
  let payload;
  try { payload = await request.json(); }
  catch { return cors(request, json({ error: "bad_json" }, 400)); }

  const title = (payload.title || "").slice(0, 140).trim();
  const description = (payload.description || "").trim();
  const price = Number(payload.price);
  const tags = (payload.tags || []).map((t) => String(t).slice(0, 20)).filter(Boolean).slice(0, 13);
  const taxonomy_id = payload.taxonomy_id || env.DEFAULT_TAXONOMY_ID;
  const type = payload.type === "physical" ? "physical" : "download";

  if (!title) return cors(request, json({ error: "missing_title" }, 400));
  if (!description) return cors(request, json({ error: "missing_description" }, 400));
  if (!(price > 0)) return cors(request, json({ error: "missing_price" }, 400));
  if (!taxonomy_id) return cors(request, json({ error: "missing_taxonomy_id", hint: "pass taxonomy_id or set DEFAULT_TAXONOMY_ID; find one via GET /api/taxonomy?q=digital" }, 400));

  try {
    const shopId = await resolveShopId(env);
    const token = await getAccessToken(env);

    // 1) create draft listing
    const form = new URLSearchParams();
    form.set("quantity", String(payload.quantity || (type === "download" ? 999 : 1)));
    form.set("title", title);
    form.set("description", description);
    form.set("price", price.toFixed(2));
    form.set("who_made", payload.who_made || "i_did");
    form.set("when_made", payload.when_made || "made_to_order");
    form.set("taxonomy_id", String(taxonomy_id));
    form.set("type", type);
    if (type === "download") form.set("is_supply", "false");
    tags.forEach((t) => form.append("tags", t));

    const created = await etsy(env, "POST", `/shops/${shopId}/listings`, {
      token,
      body: form,
    });
    const listingId = created.listing_id;

    // 2) upload images -> listing photos
    let imagesUploaded = 0;
    for (let i = 0; i < (payload.images || []).length; i++) {
      const dec = await dataUriToBlob(payload.images[i]);
      if (!dec || dec.ext === "svg") continue; // Etsy rejects SVG photos; send PNG/JPG
      const fd = new FormData();
      fd.append("image", dec.blob, `photo-${i + 1}.${dec.ext}`);
      fd.append("rank", String(i + 1));
      await etsy(env, "POST", `/shops/${shopId}/listings/${listingId}/images`, { token, body: fd });
      imagesUploaded++;
    }

    // 3) upload digital files -> delivered to buyers at checkout
    let filesUploaded = 0;
    if (type === "download") {
      for (let i = 0; i < (payload.files || []).length; i++) {
        const f = payload.files[i];
        const dec = await dataUriToBlob(f.data || f.dataURI || f.uri);
        if (!dec) continue;
        const fd = new FormData();
        fd.append("file", dec.blob, f.name || `file-${i + 1}.${dec.ext}`);
        fd.append("name", f.name || `file-${i + 1}.${dec.ext}`);
        fd.append("rank", String(i + 1));
        await etsy(env, "POST", `/shops/${shopId}/listings/${listingId}/files`, { token, body: fd });
        filesUploaded++;
      }
    }

    // 4) optionally activate (spends Etsy's listing fee)
    let state = created.state || "draft";
    if (payload.activate) {
      const patch = new URLSearchParams({ state: "active" });
      const updated = await etsy(env, "PATCH", `/shops/${shopId}/listings/${listingId}`, { token, body: patch });
      state = updated.state || "active";
    }

    return cors(request, json({
      ok: true,
      listing_id: listingId,
      state,
      url: created.url || `https://www.etsy.com/listing/${listingId}`,
      images_uploaded: imagesUploaded,
      files_uploaded: filesUploaded,
    }));
  } catch (err) {
    return cors(request, json({ ok: false, error: err.message, detail: err.detail || null }, err.status || 500));
  }
}
