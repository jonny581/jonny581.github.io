/* Exercises the Worker's routing/auth/PKCE without touching Etsy.
 * Run: node test/logic.test.mjs   (Node 20+)
 */
import worker from "../src/worker.js";

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓", msg); } else { fail++; console.error("  ✗", msg); } };

// in-memory KV mock
function kv() {
  const m = new Map();
  return {
    _m: m,
    async get(k) { const v = m.get(k); return v === undefined ? null : v; },
    async put(k, v) { m.set(k, v); },
    async delete(k) { m.delete(k); },
  };
}

const env = {
  ETSY_KEYSTRING: "test_keystring",
  APP_TOKEN: "s3cret-app-token-1234567890",
  REDIRECT_URI: "https://example.workers.dev/oauth/callback",
  TOKENS: kv(),
};

const call = (path, init) => worker.fetch(new Request("https://example.workers.dev" + path, init), env, {});

console.log("routing & auth");
{
  const r = await call("/health");
  const b = await r.json();
  ok(r.status === 200 && b.ok === true, "/health returns ok");

  const r2 = await call("/api/shop");
  ok(r2.status === 401, "/api/shop without token -> 401");

  const r3 = await call("/api/shop", { headers: { Authorization: "Bearer wrong" } });
  ok(r3.status === 401, "/api/shop with wrong token -> 401");

  const r4 = await call("/nope");
  ok(r4.status === 404, "unknown path -> 404");

  const r5 = await call("/api/shop", { method: "OPTIONS" });
  ok(r5.status === 204 && r5.headers.get("Access-Control-Allow-Origin"), "OPTIONS preflight -> 204 + CORS");
}

console.log("oauth login (PKCE + KV)");
{
  const r = await call("/oauth/login");
  ok(r.status === 401, "/oauth/login without key -> 401");

  const r2 = await call("/oauth/login?key=" + env.APP_TOKEN, { redirect: "manual" });
  ok(r2.status === 302, "/oauth/login with key -> 302 redirect");
  const loc = new URL(r2.headers.get("Location"));
  ok(loc.origin + loc.pathname === "https://www.etsy.com/oauth/connect", "redirects to Etsy consent");
  ok(loc.searchParams.get("code_challenge_method") === "S256", "uses PKCE S256");
  ok(loc.searchParams.get("client_id") === env.ETSY_KEYSTRING, "passes client_id");
  ok(loc.searchParams.get("scope").includes("listings_w"), "requests listings_w scope");
  const state = loc.searchParams.get("state");
  ok(!!(await env.TOKENS.get("pkce_" + state)), "PKCE verifier stored in KV under state");

  // challenge must be the SHA-256 of the stored verifier, base64url, no padding
  const verifier = await env.TOKENS.get("pkce_" + state);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  ok(b64 === loc.searchParams.get("code_challenge"), "code_challenge = SHA256(verifier)");
}

console.log("callback validation");
{
  const r = await call("/oauth/callback?error=access_denied");
  ok(r.status === 400, "callback with error -> 400");
  const r2 = await call("/oauth/callback?code=abc&state=doesnotexist");
  const b2 = await r2.json();
  ok(r2.status === 400 && b2.error === "state_expired", "callback with unknown state -> state_expired");
}

console.log("publish validation (pre-Etsy input checks)");
{
  const auth = { Authorization: "Bearer " + env.APP_TOKEN, "content-type": "application/json" };
  const bad = await call("/api/publish", { method: "POST", headers: auth, body: "{" });
  ok((await bad.json()).error === "bad_json", "malformed json -> bad_json");

  const noTitle = await call("/api/publish", { method: "POST", headers: auth, body: JSON.stringify({ description: "d", price: 5, taxonomy_id: 1 }) });
  ok((await noTitle.json()).error === "missing_title", "missing title rejected");

  const noPrice = await call("/api/publish", { method: "POST", headers: auth, body: JSON.stringify({ title: "t", description: "d", taxonomy_id: 1 }) });
  ok((await noPrice.json()).error === "missing_price", "missing price rejected");

  const noTax = await call("/api/publish", { method: "POST", headers: auth, body: JSON.stringify({ title: "t", description: "d", price: 5 }) });
  ok((await noTax.json()).error === "missing_taxonomy_id", "missing taxonomy_id rejected (no default set)");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
