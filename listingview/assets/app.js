/* ListingView — app logic (routing, views, tools, charts). No dependencies. */
"use strict";

(() => {
  const { listings, shops, CATEGORIES, MONTHS, strHash } = LV;
  const $ = (sel, el = document) => el.querySelector(sel);
  const main = () => $("#view");

  // ---- utils ---------------------------------------------------------------
  const fmt = new Intl.NumberFormat("en-US");
  const usd = (n) => "$" + fmt.format(Math.round(n));
  const usd2 = (n) => "$" + n.toFixed(2);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("on"), 2200);
  }

  // SEO score for a generated listing (same rules as the Listing Score tool)
  function listingSeo(l) {
    return analyzeListing(l.title, l.tags, "x ".repeat(90) + l.title).score;
  }

  const scoreBadge = (s) =>
    `<span class="badge ${s >= 80 ? "score-a" : s >= 60 ? "score-b" : "score-c"}">${s}</span>`;

  const trendDelta = (trend) => {
    const prev = trend[10] || 1, cur = trend[11];
    return Math.round(((cur - prev) / Math.max(prev, 1)) * 100);
  };
  const deltaHtml = (pct) =>
    pct >= 0 ? `<span class="up">▲ ${pct}%</span>` : `<span class="down">▼ ${Math.abs(pct)}%</span>`;

  // ---- charts (inline SVG + shared tooltip) ---------------------------------
  function tooltip(box) {
    let tt = box.querySelector(".viz-tooltip");
    if (!tt) { tt = document.createElement("div"); tt.className = "viz-tooltip"; box.appendChild(tt); }
    return {
      show(x, y, html) {
        tt.innerHTML = html;
        tt.style.left = x + "px"; tt.style.top = y + "px";
        tt.classList.add("on");
      },
      hide() { tt.classList.remove("on"); },
    };
  }

  // Vertical bar chart: data = [{label, value}]
  function barChart(el, data, { fmtV = fmt.format.bind(fmt), height = 240 } = {}) {
    const W = 720, H = height, padL = 8, padR = 8, padT = 14, padB = 26;
    const max = Math.max(...data.map((d) => d.value)) || 1;
    const iw = (W - padL - padR) / data.length;
    const bw = Math.min(34, iw - 8);
    const y = (v) => padT + (1 - v / max) * (H - padT - padB);

    let bars = "", labels = "", gridlines = "";
    for (let g = 1; g <= 3; g++) {
      const gy = padT + (g / 4) * (H - padT - padB);
      gridlines += `<line x1="${padL}" x2="${W - padR}" y1="${gy}" y2="${gy}" stroke="var(--grid)" stroke-width="1"/>`;
    }
    data.forEach((d, i) => {
      const x = padL + i * iw + (iw - bw) / 2;
      const by = y(d.value), bh = H - padB - by;
      bars += `<path data-i="${i}" d="M${x},${H - padB} L${x},${by + 4} Q${x},${by} ${x + 4},${by} L${x + bw - 4},${by} Q${x + bw},${by} ${x + bw},${by + 4} L${x + bw},${H - padB} Z" fill="var(--accent)"/>
        <rect data-i="${i}" x="${padL + i * iw}" y="${padT}" width="${iw}" height="${H - padT - padB}" fill="transparent"/>`;
      labels += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${esc(d.label)}</text>`;
    });
    el.classList.add("chart-box");
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart">
      ${gridlines}
      <line x1="${padL}" x2="${W - padR}" y1="${H - padB}" y2="${H - padB}" stroke="var(--baseline)" stroke-width="1"/>
      ${bars}${labels}</svg>`;
    const tt = tooltip(el), svg = el.querySelector("svg");
    svg.addEventListener("mousemove", (e) => {
      const t = e.target.closest("[data-i]");
      if (!t) return tt.hide();
      const d = data[+t.dataset.i];
      const r = el.getBoundingClientRect();
      tt.show(e.clientX - r.left, e.clientY - r.top, `<div class="tt-head">${esc(d.label)}</div>${fmtV(d.value)}`);
    });
    svg.addEventListener("mouseleave", () => tt.hide());
  }

  // Line chart with crosshair: values[] against MONTHS labels
  function lineChart(el, labels, values, { fmtV = fmt.format.bind(fmt), height = 240 } = {}) {
    const W = 720, H = height, padL = 8, padR = 8, padT = 14, padB = 26;
    const max = Math.max(...values) || 1;
    const x = (i) => padL + (i / (values.length - 1)) * (W - padL - padR);
    const y = (v) => padT + (1 - v / max) * (H - padT - padB);
    const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    let gridlines = "", ticks = "";
    for (let g = 1; g <= 3; g++) {
      const gy = padT + (g / 4) * (H - padT - padB);
      gridlines += `<line x1="${padL}" x2="${W - padR}" y1="${gy}" y2="${gy}" stroke="var(--grid)" stroke-width="1"/>`;
    }
    labels.forEach((lb, i) => {
      if (i % 2) return;
      const anchor = i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle";
      ticks += `<text x="${x(i)}" y="${H - 8}" text-anchor="${anchor}" font-size="10.5" fill="var(--muted)">${esc(lb)}</text>`;
    });
    el.classList.add("chart-box");
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart">
      ${gridlines}
      <line x1="${padL}" x2="${W - padR}" y1="${H - padB}" y2="${H - padB}" stroke="var(--baseline)" stroke-width="1"/>
      <polygon points="${x(0)},${H - padB} ${pts} ${x(values.length - 1)},${H - padB}" fill="var(--accent)" opacity="0.10"/>
      <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <line class="xh" y1="${padT}" y2="${H - padB}" stroke="var(--baseline)" stroke-width="1" opacity="0"/>
      <circle class="dot" r="4.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2" opacity="0"/>
      ${ticks}</svg>`;
    const tt = tooltip(el), svg = el.querySelector("svg");
    const xh = svg.querySelector(".xh"), dot = svg.querySelector(".dot");
    svg.addEventListener("mousemove", (e) => {
      const r = svg.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(values.length - 1, Math.round(((mx - padL) / (W - padL - padR)) * (values.length - 1))));
      xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("opacity", "1");
      dot.setAttribute("cx", x(i)); dot.setAttribute("cy", y(values[i])); dot.setAttribute("opacity", "1");
      const er = el.getBoundingClientRect();
      tt.show(((x(i) / W) * r.width) + (r.left - er.left), ((y(values[i]) / H) * r.height) + (r.top - er.top),
        `<div class="tt-head">${esc(labels[i])}</div>${fmtV(values[i])}`);
    });
    svg.addEventListener("mouseleave", () => { tt.hide(); xh.setAttribute("opacity", "0"); dot.setAttribute("opacity", "0"); });
  }

  const sparkline = (trend, w = 96, h = 26) => {
    const max = Math.max(...trend) || 1;
    const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * w},${h - 2 - (v / max) * (h - 4)}`).join(" ");
    const up = trend[11] >= trend[0];
    return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <polyline points="${pts}" fill="none" stroke="${up ? "var(--good-badge)" : "var(--bad)"}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  };

  // ---- listing SEO analyzer (shared by Listing Score + explorer) ------------
  const FILLER = new Set(["a", "an", "and", "the", "for", "of", "with", "in", "on", "to", "|", "-", "&"]);
  const words = (s) => s.toLowerCase().split(/[^a-z0-9']+/).filter((w) => w && !FILLER.has(w));

  function analyzeListing(title, tags, description) {
    const checks = [];
    const add = (ok, max, got, label, tip) => checks.push({ ok, max, got, label, tip });
    title = (title || "").trim();
    description = (description || "").trim();
    tags = (tags || []).map((t) => t.trim().toLowerCase()).filter(Boolean);

    // Title
    const tl = title.length;
    add(tl >= 60 && tl <= 140, 12, tl >= 60 && tl <= 140 ? 12 : tl >= 30 ? 6 : 0,
      `Title length (${tl} characters)`,
      tl > 140 ? "Etsy cuts titles at 140 characters — trim it." :
      tl < 60 ? "Aim for 60–140 characters so more keyword phrases can match." :
      "Good length — enough room for several keyword phrases.");
    const firstWords = words(title.slice(0, 40));
    add(firstWords.length >= 3, 10, firstWords.length >= 3 ? 10 : 4,
      "Strong opening keywords",
      firstWords.length >= 3 ? "The first 40 characters carry real keywords — that's what search and shoppers see first."
        : "Put your most important keyword phrase at the very start of the title.");
    const tw = words(title);
    const dupWord = tw.some((w, i) => tw.indexOf(w) !== i && tw.filter((x) => x === w).length > 2);
    add(!dupWord, 6, dupWord ? 0 : 6, "No keyword stuffing",
      dupWord ? "A word repeats 3+ times — repetition doesn't boost rank and looks spammy." : "No excessive repetition.");
    const caps = title.replace(/[^A-Za-z]/g, "");
    const allCaps = caps.length > 10 && caps === caps.toUpperCase();
    add(!allCaps, 4, allCaps ? 0 : 4, "Readable capitalization",
      allCaps ? "ALL-CAPS titles hurt click-through — use Title Case." : "Title Case reads well in search results.");

    // Tags
    add(tags.length === 13, 16, Math.round((tags.length / 13) * 16),
      `Tag count (${tags.length}/13)`,
      tags.length === 13 ? "All 13 tag slots used — every empty slot is a search you can't match."
        : `Add ${13 - tags.length} more tag${13 - tags.length === 1 ? "" : "s"} — use every slot.`);
    const over = tags.filter((t) => t.length > 20);
    add(over.length === 0, 6, over.length ? 0 : 6, "Tags within 20 characters",
      over.length ? `${over.length} tag(s) exceed Etsy's 20-character limit: ${over.map(esc).join(", ")}` : "All tags fit Etsy's 20-character limit.");
    const multi = tags.filter((t) => t.includes(" ")).length;
    add(tags.length > 0 && multi / Math.max(tags.length, 1) >= 0.6, 10,
      Math.round((multi / Math.max(tags.length, 1)) * 10),
      `Multi-word tags (${multi}/${tags.length})`,
      "Multi-word phrases match long-tail searches with less competition than single words.");
    const dupTags = tags.filter((t, i) => tags.indexOf(t) !== i);
    add(dupTags.length === 0, 4, dupTags.length ? 0 : 4, "No duplicate tags",
      dupTags.length ? `Duplicated: ${[...new Set(dupTags)].map(esc).join(", ")}` : "Each tag is unique.");
    const twSet = new Set(tw);
    const overlap = tags.filter((t) => words(t).some((w) => twSet.has(w))).length;
    add(tags.length > 0 && overlap / Math.max(tags.length, 1) >= 0.5, 12,
      Math.round((overlap / Math.max(tags.length, 1)) * 12),
      `Tags echoed in the title (${overlap}/${tags.length})`,
      "Etsy rewards listings where tag phrases also appear in the title — align them.");

    // Description
    const dw = description ? description.split(/\s+/).filter(Boolean).length : 0;
    add(dw >= 150, 12, dw >= 150 ? 12 : Math.round((dw / 150) * 12),
      `Description length (${dw} words)`,
      dw >= 150 ? "Detailed descriptions convert better and feed Etsy's relevance signals."
        : "Aim for 150+ words: materials, size, personalization, shipping, care.");
    const firstSentence = description.slice(0, 160).toLowerCase();
    const kwInDesc = firstWords.some((w) => firstSentence.includes(w));
    add(kwInDesc, 8, kwInDesc ? 8 : 0, "Keyword in the first lines of description",
      kwInDesc ? "Your opening keywords also appear early in the description."
        : "Repeat your main keyword phrase in the first sentence or two of the description.");

    const max = checks.reduce((a, c) => a + c.max, 0);
    const got = checks.reduce((a, c) => a + c.got, 0);
    return { score: Math.round((got / max) * 100), checks };
  }
  listings.forEach((l) => { l.seo = listingSeo(l); });

  // ---- keyword stats --------------------------------------------------------
  function keywordIndex() {
    const map = new Map();
    for (const l of listings) {
      for (const t of l.tags) {
        if (!map.has(t)) map.set(t, []);
        map.get(t).push(l);
      }
    }
    return map;
  }
  const KW_INDEX = keywordIndex();

  function keywordStats(kw) {
    kw = kw.trim().toLowerCase();
    if (!kw) return null;
    const hits = KW_INDEX.get(kw) || listings.filter((l) => l.tags.some((t) => t.includes(kw)) || l.title.toLowerCase().includes(kw));
    const h = strHash(kw);
    const volume = Math.round(400 + h * 42000 + hits.length * 900);
    const competition = Math.round(120 + strHash(kw + "|c") * 90000 + hits.length * 2600);
    const avgPrice = hits.length ? hits.reduce((a, l) => a + l.price, 0) / hits.length : 8 + strHash(kw + "|p") * 60;
    const sales = hits.reduce((a, l) => a + l.sales30, 0);
    const demand = Math.min(100, Math.round((volume / Math.max(competition, 1)) * 130 + Math.min(sales / 22, 40)));
    const score = Math.max(1, Math.min(100, Math.round(demand * 0.55 + (volume > 5000 ? 25 : (volume / 5000) * 25) + (competition < 20000 ? 20 : Math.max(0, 20 - (competition - 20000) / 4000)))));
    const level = competition > 55000 ? "High" : competition > 18000 ? "Medium" : "Low";
    return { kw, volume, competition, level, avgPrice, demand, score, hits };
  }

  // ---- tag generator ---------------------------------------------------------
  const TG_MODS = {
    audience: ["for her", "for him", "for mom", "for kids", "for women", "for best friend"],
    occasion: ["birthday gift", "christmas gift", "anniversary", "mothers day gift", "wedding gift", "housewarming"],
    style: ["minimalist", "boho", "vintage", "personalized", "custom", "handmade", "cute", "modern"],
    intent: ["gift idea", "gift set", "decor", "unique gift", "small gift"],
  };
  function generateTags(seed) {
    seed = seed.trim().toLowerCase().replace(/\s+/g, " ");
    if (!seed) return [];
    const short = seed.split(" ").slice(-2).join(" ");
    const cands = [seed];
    for (const s of TG_MODS.style) cands.push(`${s} ${short}`);
    for (const a of TG_MODS.audience) cands.push(`${short} ${a}`);
    for (const o of TG_MODS.occasion) cands.push(o, `${short.split(" ").pop()} ${o.split(" ")[0]} gift`);
    for (const i of TG_MODS.intent) cands.push(`${short} ${i}`, i);
    const seen = new Set(); const out = [];
    // deterministic per-seed ordering so the same keyword always gives same tags
    const ranked = cands
      .map((t) => { let x = t; while (x.length > 20 && x.includes(" ")) x = x.slice(0, x.lastIndexOf(" ")); return x.trim(); })
      .filter((t) => t.length >= 3 && t.length <= 20)
      .sort((a, b) => strHash(seed + a) - strHash(seed + b));
    ranked.unshift(seed.length <= 20 ? seed : short);
    for (const t of ranked) {
      if (!seen.has(t)) { seen.add(t); out.push(t); }
      if (out.length === 13) break;
    }
    return out;
  }

  // ---- views -----------------------------------------------------------------
  const routes = {};

  function header(title, sub, extra = "") {
    return `<div class="topbar">
      <div><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>
      <div class="topbar-actions">${extra}<span class="demo-pill">Demo data</span>
        <button class="btn small" id="theme-toggle" title="Toggle light/dark">◐ Theme</button></div>
    </div>`;
  }
  function wireTheme() {
    $("#theme-toggle")?.addEventListener("click", () => {
      const root = document.documentElement;
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("lv-theme", next);
    });
  }

  // -- Dashboard --
  routes.dashboard = () => {
    const totalSales = listings.reduce((a, l) => a + l.sales30, 0);
    const totalRev = listings.reduce((a, l) => a + l.revenue30, 0);
    const avgSeo = Math.round(listings.reduce((a, l) => a + l.seo, 0) / listings.length);
    const monthly = MONTHS.map((_, i) => listings.reduce((a, l) => a + l.trend[i], 0));
    const mDelta = Math.round(((monthly[11] - monthly[10]) / monthly[10]) * 100);
    const byCat = CATEGORIES.map((c) => ({
      label: c.name.split(" ")[0],
      value: listings.filter((l) => l.category === c.name).reduce((a, l) => a + l.revenue30, 0),
    })).sort((a, b) => b.value - a.value);
    const top = listings.slice().sort((a, b) => b.revenue30 - a.revenue30).slice(0, 8);

    main().innerHTML = `
      ${header("Market overview", "A live pulse on the tracked marketplace: sales, revenue and what's winning right now.")}
      <div class="grid tiles">
        <div class="card tile"><div class="t-label">Tracked listings</div><div class="t-value">${fmt.format(listings.length)}</div><div class="t-delta">across ${shops.length} shops</div></div>
        <div class="card tile"><div class="t-label">Sales · 30 days</div><div class="t-value">${fmt.format(totalSales)}</div><div class="t-delta">${deltaHtml(mDelta)} vs prior month</div></div>
        <div class="card tile"><div class="t-label">Revenue · 30 days</div><div class="t-value">${usd(totalRev)}</div><div class="t-delta">est. across tracked listings</div></div>
        <div class="card tile"><div class="t-label">Avg SEO score</div><div class="t-value">${avgSeo}</div><div class="t-delta">out of 100</div></div>
      </div>
      <div class="grid two">
        <div class="card"><h2>Monthly sales, all tracked listings</h2><div class="card-sub">Units sold per month, last 12 months</div><div id="ch-line"></div></div>
        <div class="card"><h2>Revenue by category · 30 days</h2><div class="card-sub">Estimated revenue, top categories</div><div id="ch-bar"></div></div>
      </div>
      <div class="card">
        <h2>Top listings by revenue</h2><div class="card-sub">Click any row for a full performance breakdown</div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th class="wrap">Listing</th><th>Category</th><th class="num">Price</th><th class="num">Sales/mo</th><th class="num">Revenue/mo</th><th>Trend</th><th class="num">SEO</th></tr></thead>
          <tbody>${top.map((l) => `<tr class="clickable" data-id="${l.id}">
            <td class="wrap"><span class="t-title">${esc(l.title)}</span><span class="t-shop">${esc(l.shop)}</span></td>
            <td>${esc(l.category)}</td><td class="num">${usd2(l.price)}</td>
            <td class="num">${fmt.format(l.sales30)}</td><td class="num">${usd(l.revenue30)}</td>
            <td>${sparkline(l.trend)}</td><td class="num">${scoreBadge(l.seo)}</td></tr>`).join("")}
          </tbody></table></div>
      </div>`;
    wireTheme();
    lineChart($("#ch-line"), MONTHS, monthly, { fmtV: (v) => fmt.format(v) + " sales" });
    barChart($("#ch-bar"), byCat.slice(0, 6), { fmtV: usd });
    main().querySelectorAll("tr[data-id]").forEach((tr) => tr.addEventListener("click", () => openDrawer(+tr.dataset.id)));
  };

  // -- Listing Explorer --
  const exState = { q: "", cat: "", sort: "revenue30", dir: -1, page: 1, per: 15 };
  routes.explorer = () => {
    main().innerHTML = `
      ${header("Listing Explorer", "Search and filter every tracked listing. Sort any column, then click a row for the full breakdown.")}
      <div class="card">
        <div class="controls">
          <input class="input grow" id="ex-q" type="search" placeholder="Search titles, tags or shops…" value="${esc(exState.q)}">
          <select class="input" id="ex-cat">
            <option value="">All categories</option>
            ${CATEGORIES.map((c) => `<option ${exState.cat === c.name ? "selected" : ""}>${c.name}</option>`).join("")}
          </select>
          <select class="input" id="ex-per">
            ${[15, 30, 50].map((n) => `<option value="${n}" ${exState.per === n ? "selected" : ""}>${n} rows</option>`).join("")}
          </select>
        </div>
        <div id="ex-table"></div>
      </div>`;
    wireTheme();
    $("#ex-q").addEventListener("input", (e) => { exState.q = e.target.value; exState.page = 1; renderExplorerTable(); });
    $("#ex-cat").addEventListener("change", (e) => { exState.cat = e.target.value; exState.page = 1; renderExplorerTable(); });
    $("#ex-per").addEventListener("change", (e) => { exState.per = +e.target.value; exState.page = 1; renderExplorerTable(); });
    renderExplorerTable();
  };

  function renderExplorerTable() {
    const q = exState.q.trim().toLowerCase();
    let rows = listings.filter((l) =>
      (!exState.cat || l.category === exState.cat) &&
      (!q || l.title.toLowerCase().includes(q) || l.shop.toLowerCase().includes(q) || l.tags.some((t) => t.includes(q))));
    const dir = exState.dir;
    rows.sort((a, b) => (a[exState.sort] > b[exState.sort] ? dir : a[exState.sort] < b[exState.sort] ? -dir : 0));
    const pages = Math.max(1, Math.ceil(rows.length / exState.per));
    exState.page = Math.min(exState.page, pages);
    const slice = rows.slice((exState.page - 1) * exState.per, exState.page * exState.per);
    const cols = [
      ["title", "Listing", "wrap"], ["price", "Price", "num"], ["sales30", "Sales/mo", "num"],
      ["revenue30", "Revenue/mo", "num"], ["views30", "Views/mo", "num"], ["favorites", "Favorites", "num"],
      ["_trend", "Trend", ""], ["seo", "SEO", "num"],
    ];
    const arrow = (k) => exState.sort === k ? `<span class="arrow">${dir === -1 ? "▼" : "▲"}</span>` : "";
    $("#ex-table").innerHTML = `
      <div class="table-wrap"><table class="data">
        <thead><tr>${cols.map(([k, lb, cls]) =>
          `<th class="${cls} ${k === "_trend" ? "" : "sortable"}" data-k="${k}">${lb} ${k === "_trend" ? "" : arrow(k)}</th>`).join("")}</tr></thead>
        <tbody>${slice.length ? slice.map((l) => `<tr class="clickable" data-id="${l.id}">
          <td class="wrap"><span class="t-title">${esc(l.title)}</span><span class="t-shop">${esc(l.shop)} · ${esc(l.category)}</span></td>
          <td class="num">${usd2(l.price)}</td><td class="num">${fmt.format(l.sales30)}</td>
          <td class="num">${usd(l.revenue30)}</td><td class="num">${fmt.format(l.views30)}</td>
          <td class="num">${fmt.format(l.favorites)}</td><td>${sparkline(l.trend)}</td>
          <td class="num">${scoreBadge(l.seo)}</td></tr>`).join("")
        : `<tr><td colspan="8"><div class="empty">No listings match — try a broader search.</div></td></tr>`}</tbody>
      </table></div>
      <div class="pager">
        <span>${fmt.format(rows.length)} listings</span>
        <button class="btn small" id="pg-prev" ${exState.page <= 1 ? "disabled" : ""}>‹ Prev</button>
        <span>Page ${exState.page} / ${pages}</span>
        <button class="btn small" id="pg-next" ${exState.page >= pages ? "disabled" : ""}>Next ›</button>
      </div>`;
    $("#ex-table").querySelectorAll("th.sortable").forEach((th) => th.addEventListener("click", () => {
      const k = th.dataset.k;
      if (exState.sort === k) exState.dir *= -1; else { exState.sort = k; exState.dir = -1; }
      renderExplorerTable();
    }));
    $("#pg-prev")?.addEventListener("click", () => { exState.page--; renderExplorerTable(); });
    $("#pg-next")?.addEventListener("click", () => { exState.page++; renderExplorerTable(); });
    $("#ex-table").querySelectorAll("tr[data-id]").forEach((tr) => tr.addEventListener("click", () => openDrawer(+tr.dataset.id)));
  }

  // -- listing detail drawer --
  function openDrawer(id) {
    const l = listings.find((x) => x.id === id);
    if (!l) return;
    const shop = shops.find((s) => s.id === l.shopId);
    const drawer = $("#drawer");
    drawer.innerHTML = `
      <button class="close-x" aria-label="Close">✕</button>
      <div class="meta">${esc(l.category)} · Listed ${l.ageMonths} months ago</div>
      <h2>${esc(l.title)}</h2>
      <div class="meta">${esc(l.shop)} · ${esc(shop.country)} · ★ ${l.rating} (${fmt.format(l.reviews)} reviews)</div>
      <div class="kv-grid">
        <div class="kv"><div class="k">Price</div><div class="v">${usd2(l.price)}</div></div>
        <div class="kv"><div class="k">Sales / month</div><div class="v">${fmt.format(l.sales30)}</div></div>
        <div class="kv"><div class="k">Revenue / month</div><div class="v">${usd(l.revenue30)}</div></div>
        <div class="kv"><div class="k">Lifetime sales</div><div class="v">${fmt.format(l.salesTotal)}</div></div>
        <div class="kv"><div class="k">Views / month</div><div class="v">${fmt.format(l.views30)}</div></div>
        <div class="kv"><div class="k">Favorites</div><div class="v">${fmt.format(l.favorites)}</div></div>
      </div>
      <h3>12-month sales trend ${deltaHtml(trendDelta(l.trend))}</h3>
      <div id="dr-chart"></div>
      <h3>Tags (${l.tags.length}/13)</h3>
      <div>${l.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <h3>SEO score ${scoreBadge(l.seo)}</h3>
      <p style="color:var(--ink-2);font-size:13px">Run this listing through <a href="#/score" id="dr-score-link">Listing Score</a> to see the full check-by-check report and fix-it tips.</p>`;
    document.body.classList.add("drawer-open");
    lineChart($("#dr-chart"), MONTHS, l.trend, { fmtV: (v) => fmt.format(v) + " sales", height: 190 });
    drawer.querySelector(".close-x").addEventListener("click", closeDrawer);
    $("#dr-score-link").addEventListener("click", () => {
      closeDrawer();
      scoreState.prefill = l;
    });
  }
  const closeDrawer = () => document.body.classList.remove("drawer-open");

  // -- Keyword Finder --
  const kwState = { q: "" };
  routes.keywords = () => {
    // seed ideas: most-used tags in the dataset
    const popular = [...KW_INDEX.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 18).map(([k]) => k);
    main().innerHTML = `
      ${header("Keyword Finder", "Type any search term a buyer might use. Get volume, competition, average price and a recommendation score.")}
      <div class="card">
        <div class="controls">
          <input class="input grow" id="kw-q" type="search" placeholder="e.g. minimalist necklace, boho wall art…" value="${esc(kwState.q)}">
          <button class="btn primary" id="kw-go">Analyze</button>
        </div>
        <div class="card-sub">Popular in the tracked market:</div>
        <div>${popular.map((k) => `<button class="chip" data-kw="${esc(k)}" style="cursor:pointer">${esc(k)}</button>`).join("")}</div>
      </div>
      <div id="kw-result" style="margin-top:14px"></div>`;
    wireTheme();
    const run = () => { kwState.q = $("#kw-q").value; renderKeyword(kwState.q); };
    $("#kw-go").addEventListener("click", run);
    $("#kw-q").addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    main().querySelectorAll("[data-kw]").forEach((b) => b.addEventListener("click", () => {
      $("#kw-q").value = b.dataset.kw; run();
    }));
    if (kwState.q) renderKeyword(kwState.q);
  };

  function renderKeyword(q) {
    const el = $("#kw-result");
    const s = keywordStats(q);
    if (!s) { el.innerHTML = ""; return; }
    const related = generateTags(s.kw).slice(1, 9);
    el.innerHTML = `
      <div class="grid tiles">
        <div class="card tile"><div class="t-label">Searches / month</div><div class="t-value">${fmt.format(s.volume)}</div><div class="t-delta">estimated buyer searches</div></div>
        <div class="card tile"><div class="t-label">Competition</div><div class="t-value">${fmt.format(s.competition)}</div><div class="t-delta">${s.level} — competing listings</div></div>
        <div class="card tile"><div class="t-label">Average price</div><div class="t-value">${usd2(s.avgPrice)}</div><div class="t-delta">among matching listings</div></div>
        <div class="card tile"><div class="t-label">Recommendation</div><div class="t-value">${s.score}<span style="font-size:15px;color:var(--muted)">/100</span></div>
          <div class="rec-bar" style="margin-top:6px"><i style="width:${s.score}%"></i></div></div>
      </div>
      <div class="card">
        <h2>“${esc(s.kw)}” — matching listings in the tracked market (${s.hits.length})</h2>
        <div class="card-sub">Related terms worth testing: ${related.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        ${s.hits.length ? `<div class="table-wrap"><table class="data">
          <thead><tr><th class="wrap">Listing</th><th class="num">Price</th><th class="num">Sales/mo</th><th class="num">Revenue/mo</th><th>Trend</th></tr></thead>
          <tbody>${s.hits.slice(0, 10).map((l) => `<tr class="clickable" data-id="${l.id}">
            <td class="wrap"><span class="t-title">${esc(l.title)}</span><span class="t-shop">${esc(l.shop)}</span></td>
            <td class="num">${usd2(l.price)}</td><td class="num">${fmt.format(l.sales30)}</td>
            <td class="num">${usd(l.revenue30)}</td><td>${sparkline(l.trend)}</td></tr>`).join("")}</tbody>
        </table></div>` : `<div class="empty">No tracked listings use this term yet — that can mean low competition. Estimates above are modeled.</div>`}
      </div>`;
    el.querySelectorAll("tr[data-id]").forEach((tr) => tr.addEventListener("click", () => openDrawer(+tr.dataset.id)));
  }

  // -- Listing Score --
  const scoreState = { prefill: null };
  routes.score = () => {
    const p = scoreState.prefill;
    scoreState.prefill = null;
    main().innerHTML = `
      ${header("Listing Score", "Paste your title, tags and description. Get a 0–100 SEO score with a check-by-check report and fix-it tips.")}
      <div class="grid two">
        <div class="card">
          <label class="field-label" for="sc-title">Title</label>
          <input class="input" id="sc-title" style="width:100%" maxlength="200" placeholder="e.g. Minimalist Gold Bar Necklace | Birthday Gift for Her | Dainty Layering Chain" value="${p ? esc(p.title) : ""}">
          <label class="field-label" for="sc-tags">Tags <span style="color:var(--muted);font-weight:400">(comma-separated, up to 13)</span></label>
          <textarea class="input" id="sc-tags" rows="3" placeholder="minimalist necklace, gold bar necklace, gift for her, …">${p ? esc(p.tags.join(", ")) : ""}</textarea>
          <label class="field-label" for="sc-desc">Description</label>
          <textarea class="input" id="sc-desc" rows="7" placeholder="Paste your full listing description…">${p ? esc("This " + p.title.toLowerCase() + " is handmade to order in our studio. ") : ""}</textarea>
          <div class="copy-row"><button class="btn primary" id="sc-go">Score my listing</button>
          <button class="btn" id="sc-sample">Load an example</button></div>
        </div>
        <div class="card" id="sc-result"><div class="empty">Your report will appear here.</div></div>
      </div>`;
    wireTheme();
    const run = () => {
      const tags = $("#sc-tags").value.split(",").map((t) => t.trim()).filter(Boolean);
      const { score, checks } = analyzeListing($("#sc-title").value, tags, $("#sc-desc").value);
      const C = 2 * Math.PI * 48;
      $("#sc-result").innerHTML = `
        <div class="score-hero">
          <div class="score-ring">
            <svg viewBox="0 0 116 116" width="116" height="116" aria-hidden="true">
              <circle cx="58" cy="58" r="48" fill="none" stroke="var(--surface-2)" stroke-width="10"/>
              <circle cx="58" cy="58" r="48" fill="none" stroke="${score >= 80 ? "var(--good-badge)" : score >= 60 ? "#eda100" : "var(--bad)"}"
                stroke-width="10" stroke-linecap="round" stroke-dasharray="${(score / 100) * C} ${C}"
                transform="rotate(-90 58 58)"/>
            </svg>
            <div class="val">${score}<small>/ 100</small></div>
          </div>
          <div><h2>${score >= 80 ? "Strong listing" : score >= 60 ? "Good — a few quick wins left" : "Needs work"}</h2>
          <p style="color:var(--ink-2)">${score >= 80 ? "This listing follows Etsy SEO best practice. Keep titles and tags fresh as trends shift."
            : "Work through the failed checks below — each one is a concrete, five-minute fix."}</p></div>
        </div>
        <ul class="check-list">
          ${checks.map((c) => `<li class="${c.got === c.max ? "pass" : c.got > 0 ? "warn-c" : "fail"}">
            <span class="mark">${c.got === c.max ? "✓" : c.got > 0 ? "!" : "✕"}</span>
            <span><strong>${c.label}</strong><span class="tip">${c.tip}</span></span>
            <span class="pts">${c.got}/${c.max}</span></li>`).join("")}
        </ul>`;
    };
    $("#sc-go").addEventListener("click", run);
    $("#sc-sample").addEventListener("click", () => {
      const l = listings[42];
      $("#sc-title").value = l.title;
      $("#sc-tags").value = l.tags.join(", ");
      $("#sc-desc").value = `This ${l.title.split("|")[0].trim().toLowerCase()} is handmade in small batches in our home studio. `
        + "Each piece is finished by hand, quality-checked, and packed in recyclable gift-ready packaging, so it arrives ready to give. "
        + "Choose your size and color from the dropdown menus, and add a note at checkout if you would like free personalization. "
        + "Materials are sourced from small suppliers and every order ships within two business days with tracking included. "
        + "If anything is not perfect when it arrives, message us and we will make it right — our buyers come back because we treat every order like a gift for a friend. "
        + "Care instructions and a small thank-you card are included in every package.";
      run();
    });
    if (p) run();
  };

  // -- Tag Generator --
  routes.tags = () => {
    main().innerHTML = `
      ${header("Tag Generator", "Describe your product in a few words and get 13 ready-to-paste Etsy tags, each within the 20-character limit.")}
      <div class="card">
        <div class="controls">
          <input class="input grow" id="tg-q" type="search" placeholder="e.g. ceramic coffee mug">
          <button class="btn primary" id="tg-go">Generate 13 tags</button>
        </div>
        <div id="tg-out"></div>
      </div>`;
    wireTheme();
    const run = () => {
      const tags = generateTags($("#tg-q").value);
      const out = $("#tg-out");
      if (!tags.length) { out.innerHTML = `<div class="empty">Enter a product keyword to generate tags.</div>`; return; }
      out.innerHTML = `
        <div style="margin-top:8px">${tags.map((t) => `<span class="chip good">${esc(t)} <span style="color:var(--muted)">· ${t.length}</span></span>`).join("")}</div>
        <div class="copy-row">
          <button class="btn" id="tg-copy">Copy all (comma-separated)</button>
          <a class="btn" href="#/score" id="tg-score">Score these tags →</a>
        </div>`;
      $("#tg-copy").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(tags.join(", ")); toast("13 tags copied"); }
        catch { toast("Copy failed — select and copy manually"); }
      });
      $("#tg-score").addEventListener("click", () => {
        scoreState.prefill = { title: $("#tg-q").value, tags };
      });
    };
    $("#tg-go").addEventListener("click", run);
    $("#tg-q").addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
  };

  // -- Bulk Editor --
  const bulkState = { sel: new Set(), op: "replace" };
  routes.bulk = () => {
    main().innerHTML = `
      ${header("Bulk Editor", "Select listings, choose an operation, preview every change side-by-side, then apply. Nothing changes until you hit Apply.")}
      <div class="grid two">
        <div class="card">
          <h2>1 · Select listings</h2>
          <div class="controls" style="margin-top:10px">
            <input class="input grow" id="bk-q" type="search" placeholder="Filter by title or shop…">
            <button class="btn small" id="bk-all">Select page</button>
            <button class="btn small" id="bk-none">Clear</button>
          </div>
          <div id="bk-list" style="max-height:420px;overflow:auto"></div>
        </div>
        <div class="card">
          <h2>2 · Choose operation</h2>
          <label class="field-label" for="bk-op">Operation</label>
          <select class="input" id="bk-op" style="width:100%">
            <option value="replace">Find &amp; replace in titles</option>
            <option value="price">Adjust prices by %</option>
            <option value="prefix">Add title prefix</option>
            <option value="suffix">Add title suffix</option>
          </select>
          <div id="bk-fields"></div>
          <div class="copy-row"><button class="btn primary" id="bk-preview">Preview changes</button></div>
        </div>
      </div>
      <div id="bk-out" style="margin-top:14px"></div>`;
    wireTheme();

    const listEl = $("#bk-list");
    const renderList = () => {
      const q = $("#bk-q").value.trim().toLowerCase();
      const rows = listings.filter((l) => !q || l.title.toLowerCase().includes(q) || l.shop.toLowerCase().includes(q)).slice(0, 40);
      listEl.innerHTML = `<table class="data"><tbody>${rows.map((l) => `
        <tr><td style="width:28px"><input type="checkbox" data-id="${l.id}" ${bulkState.sel.has(l.id) ? "checked" : ""}></td>
        <td class="wrap"><span class="t-title" style="max-width:none">${esc(l.title)}</span>
        <span class="t-shop">${esc(l.shop)} · ${usd2(l.price)}</span></td></tr>`).join("")}</tbody></table>`;
      listEl.querySelectorAll("input[type=checkbox]").forEach((cb) => cb.addEventListener("change", () => {
        const id = +cb.dataset.id;
        cb.checked ? bulkState.sel.add(id) : bulkState.sel.delete(id);
        syncCount();
      }));
      listEl._rows = rows;
    };
    const syncCount = () => { $("#bk-preview").textContent = `Preview changes (${bulkState.sel.size} selected)`; };

    const fieldTemplates = {
      replace: `<label class="field-label">Find</label><input class="input" id="bk-find" style="width:100%" placeholder="e.g. Christmas">
        <label class="field-label">Replace with</label><input class="input" id="bk-repl" style="width:100%" placeholder="e.g. Valentines Day">`,
      price: `<label class="field-label">Change prices by (%)</label><input class="input" id="bk-pct" type="number" value="10" style="width:100%">
        <p style="color:var(--muted);font-size:12.5px;margin-top:6px">Positive raises prices, negative lowers them. Rounded to .99 endings.</p>`,
      prefix: `<label class="field-label">Prefix to add</label><input class="input" id="bk-text" style="width:100%" placeholder="e.g. SALE · ">`,
      suffix: `<label class="field-label">Suffix to add</label><input class="input" id="bk-text" style="width:100%" placeholder="e.g.  | Free Shipping">`,
    };
    const renderFields = () => { $("#bk-fields").innerHTML = fieldTemplates[$("#bk-op").value]; };

    function computeChanges() {
      const op = $("#bk-op").value;
      const sel = listings.filter((l) => bulkState.sel.has(l.id));
      const changes = [];
      for (const l of sel) {
        if (op === "replace") {
          const find = $("#bk-find").value;
          if (!find) continue;
          const next = l.title.split(find).join($("#bk-repl").value);
          if (next !== l.title) changes.push({ l, field: "title", from: l.title, to: next.slice(0, 140) });
        } else if (op === "price") {
          const pct = parseFloat($("#bk-pct").value) || 0;
          if (!pct) continue;
          let next = l.price * (1 + pct / 100);
          next = Math.max(0.99, Math.round(next) - 0.01);
          if (Math.abs(next - l.price) >= 0.01) changes.push({ l, field: "price", from: usd2(l.price), to: usd2(next), raw: next });
        } else {
          const text = $("#bk-text").value;
          if (!text) continue;
          const next = (op === "prefix" ? text + l.title : l.title + text).slice(0, 140);
          if (next !== l.title) changes.push({ l, field: "title", from: l.title, to: next });
        }
      }
      return changes;
    }

    $("#bk-preview").addEventListener("click", () => {
      const out = $("#bk-out");
      if (!bulkState.sel.size) { out.innerHTML = `<div class="card"><div class="empty">Select at least one listing first.</div></div>`; return; }
      const changes = computeChanges();
      if (!changes.length) { out.innerHTML = `<div class="card"><div class="empty">No changes to make — fill in the operation fields, or the values already match.</div></div>`; return; }
      out.innerHTML = `<div class="card">
        <h2>3 · Preview — ${changes.length} change${changes.length === 1 ? "" : "s"}</h2>
        <div class="card-sub">Review each before/after, then apply.</div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Shop</th><th class="wrap">Before</th><th class="wrap">After</th></tr></thead>
          <tbody>${changes.map((c) => `<tr><td>${esc(c.l.shop)}</td>
            <td class="wrap"><span class="diff-del">${esc(c.from)}</span></td>
            <td class="wrap"><span class="diff-add">${esc(c.to)}</span></td></tr>`).join("")}</tbody>
        </table></div>
        <div class="copy-row"><button class="btn primary" id="bk-apply">Apply ${changes.length} change${changes.length === 1 ? "" : "s"}</button>
        <span style="color:var(--muted);font-size:12.5px">Demo mode: changes update the in-app dataset only.</span></div>
      </div>`;
      $("#bk-apply").addEventListener("click", () => {
        for (const c of changes) {
          if (c.field === "title") { c.l.title = c.to; c.l.seo = listingSeo(c.l); }
          else { c.l.price = c.raw; c.l.revenue30 = Math.round(c.l.sales30 * c.raw); }
        }
        toast(`${changes.length} listing${changes.length === 1 ? "" : "s"} updated`);
        $("#bk-out").innerHTML = "";
        renderList();
      });
    });

    $("#bk-q").addEventListener("input", renderList);
    $("#bk-all").addEventListener("click", () => { (listEl._rows || []).forEach((l) => bulkState.sel.add(l.id)); renderList(); syncCount(); });
    $("#bk-none").addEventListener("click", () => { bulkState.sel.clear(); renderList(); syncCount(); });
    $("#bk-op").addEventListener("change", renderFields);
    renderFields(); renderList(); syncCount();
  };

  // -- Shop Explorer --
  const shopState = { sort: "revenue" };
  routes.shops = () => {
    main().innerHTML = `
      ${header("Shop Explorer", "Every shop in the tracked market, ranked. Click a shop to see its listings in the Explorer.")}
      <div class="card"><div id="sh-table"></div></div>`;
    wireTheme();
    const agg = shops.map((s) => {
      const ls = listings.filter((l) => l.shopId === s.id);
      return {
        s, count: ls.length,
        sales: ls.reduce((a, l) => a + l.sales30, 0),
        revenue: ls.reduce((a, l) => a + l.revenue30, 0),
        lifetime: ls.reduce((a, l) => a + l.salesTotal, 0),
        seo: ls.length ? Math.round(ls.reduce((a, l) => a + l.seo, 0) / ls.length) : 0,
        best: ls.slice().sort((a, b) => b.revenue30 - a.revenue30)[0],
      };
    }).filter((a) => a.count > 0);
    const render = () => {
      agg.sort((a, b) => b[shopState.sort] - a[shopState.sort]);
      const arrow = (k) => shopState.sort === k ? `<span class="arrow">▼</span>` : "";
      $("#sh-table").innerHTML = `<div class="table-wrap"><table class="data">
        <thead><tr><th>Shop</th><th class="num sortable" data-k="count">Listings ${arrow("count")}</th>
          <th class="num sortable" data-k="sales">Sales/mo ${arrow("sales")}</th>
          <th class="num sortable" data-k="revenue">Revenue/mo ${arrow("revenue")}</th>
          <th class="num sortable" data-k="lifetime">Lifetime sales ${arrow("lifetime")}</th>
          <th class="num sortable" data-k="seo">Avg SEO ${arrow("seo")}</th>
          <th class="wrap">Top listing</th></tr></thead>
        <tbody>${agg.map((a) => `<tr>
          <td><span class="t-title">${esc(a.s.name)}</span><span class="t-shop">${esc(a.s.country)} · ★ ${a.s.rating} · since ${a.s.openedYear}</span></td>
          <td class="num">${a.count}</td><td class="num">${fmt.format(a.sales)}</td>
          <td class="num">${usd(a.revenue)}</td><td class="num">${fmt.format(a.lifetime)}</td>
          <td class="num">${scoreBadge(a.seo)}</td>
          <td class="wrap"><a href="#/explorer" data-shop="${esc(a.s.name)}">${esc(a.best.title.split("|")[0].trim())}</a></td></tr>`).join("")}</tbody>
      </table></div>`;
      $("#sh-table").querySelectorAll("th.sortable").forEach((th) => th.addEventListener("click", () => { shopState.sort = th.dataset.k; render(); }));
      $("#sh-table").querySelectorAll("a[data-shop]").forEach((a) => a.addEventListener("click", () => {
        exState.q = a.dataset.shop; exState.cat = ""; exState.page = 1;
      }));
    };
    render();
  };

  // ---- router ----------------------------------------------------------------
  function route() {
    closeDrawer();
    const hash = (location.hash || "#/dashboard").replace("#/", "");
    const view = routes[hash] ? hash : "dashboard";
    document.querySelectorAll(".nav-item").forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#/${view}`));
    routes[view]();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  // theme init
  const saved = localStorage.getItem("lv-theme");
  document.documentElement.dataset.theme =
    saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  $("#drawer-scrim").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  route();
})();
