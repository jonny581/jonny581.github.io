/* ListingView — live publishing client.
 *
 * Thin wrapper around the Etsy backend Worker. The UI's Auto-Publisher uses it
 * in "live mode"; the exact same HTTP contract is what a Claude Code automation
 * calls headlessly. Config (backend URL + app token + defaults) is kept in
 * localStorage — nothing sensitive is baked into the static site.
 */
"use strict";

const LVLive = (() => {
  const KEY = "lv-live-config";

  const getConfig = () => {
    try { return Object.assign({ baseUrl: "", token: "", taxonomyId: "", activate: false, live: false }, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch { return { baseUrl: "", token: "", taxonomyId: "", activate: false, live: false }; }
  };
  const setConfig = (patch) => {
    const next = Object.assign(getConfig(), patch);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  };
  const configured = () => { const c = getConfig(); return !!(c.baseUrl && c.token); };

  const base = () => getConfig().baseUrl.replace(/\/+$/, "");
  const authHeaders = () => ({ Authorization: "Bearer " + getConfig().token });

  async function testConnection() {
    if (!configured()) throw new Error("Set the backend URL and app token first.");
    const res = await fetch(base() + "/api/shop", { headers: authHeaders() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) throw new Error(data.error || data.message || ("HTTP " + res.status));
    return data; // { shop_name, shop_id, currency, ... }
  }

  // payload: { title, description, price, tags[], images[dataURI], files[{name,data}], taxonomy_id?, activate? }
  async function publish(payload) {
    if (!configured()) throw new Error("Live backend is not configured.");
    const c = getConfig();
    const body = Object.assign({
      taxonomy_id: c.taxonomyId || undefined,
      activate: !!c.activate,
      type: "download",
    }, payload);
    const res = await fetch(base() + "/api/publish", {
      method: "POST",
      headers: Object.assign({ "content-type": "application/json" }, authHeaders()),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      const detail = data.detail ? " — " + JSON.stringify(data.detail).slice(0, 300) : "";
      throw new Error((data.error || data.message || ("HTTP " + res.status)) + detail);
    }
    return data; // { listing_id, state, url, images_uploaded, files_uploaded }
  }

  return { getConfig, setConfig, configured, testConnection, publish };
})();
