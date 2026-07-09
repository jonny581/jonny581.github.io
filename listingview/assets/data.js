/* ListingView — demo dataset
 *
 * Everything the app shows is generated here with a seeded PRNG, so the
 * "marketplace" is deterministic across page loads (same listings, same
 * numbers) while still looking organic. No network calls, no real Etsy data.
 */
"use strict";

const LV = (() => {
  // ---- seeded PRNG (mulberry32) -------------------------------------------
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(20260708);
  const ri = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const shuffled = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Deterministic hash → [0,1) for arbitrary strings (keyword stats)
  function strHash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967296;
  }

  // ---- vocabulary ----------------------------------------------------------
  const CATEGORIES = [
    {
      name: "Jewelry",
      nouns: ["Necklace", "Ring", "Bracelet", "Earrings", "Pendant", "Anklet", "Charm"],
      materials: ["Sterling Silver", "14k Gold Filled", "Rose Gold", "Copper Wire", "Polymer Clay", "Resin", "Beaded"],
      styles: ["Minimalist", "Boho", "Dainty", "Celestial", "Vintage Style", "Art Deco", "Botanical"],
      priceRange: [12, 145],
    },
    {
      name: "Home & Living",
      nouns: ["Candle", "Throw Pillow Cover", "Wall Shelf", "Coaster Set", "Planter", "Doormat", "Cutting Board"],
      materials: ["Soy Wax", "Ceramic", "Walnut Wood", "Linen", "Concrete", "Rattan", "Stoneware"],
      styles: ["Farmhouse", "Scandinavian", "Mid Century", "Cottagecore", "Japandi", "Rustic", "Modern"],
      priceRange: [14, 120],
    },
    {
      name: "Craft Supplies",
      nouns: ["Sticker Pack", "Digital Stamp Set", "Yarn Bundle", "Bead Mix", "Fabric Bundle", "Mold", "Stencil Set"],
      materials: ["Vinyl", "Merino Wool", "Glass", "Cotton", "Silicone", "Mylar", "Washi"],
      styles: ["Kawaii", "Floral", "Geometric", "Retro", "Watercolor", "Gothic", "Pastel"],
      priceRange: [4, 45],
    },
    {
      name: "Clothing",
      nouns: ["T Shirt", "Sweatshirt", "Beanie", "Tote Bag", "Baby Onesie", "Apron", "Kimono Robe"],
      materials: ["Organic Cotton", "Fleece", "Chunky Knit", "Canvas", "Bamboo", "Linen", "Tie Dye"],
      styles: ["Oversized", "Embroidered", "Graphic", "Custom", "Vintage Wash", "Matching Family", "Y2K"],
      priceRange: [15, 85],
    },
    {
      name: "Art & Collectibles",
      nouns: ["Art Print", "Original Painting", "Enamel Pin", "Sculpture", "Photo Print", "Portrait", "Poster"],
      materials: ["Giclee", "Acrylic", "Hard Enamel", "Clay", "Fine Art Paper", "Digital", "Canvas"],
      styles: ["Abstract", "Landscape", "Pet Portrait", "Line Art", "Impressionist", "Surreal", "Folk Art"],
      priceRange: [8, 320],
    },
    {
      name: "Wedding & Party",
      nouns: ["Invitation Suite", "Cake Topper", "Guest Book", "Table Numbers", "Veil", "Favor Tags", "Welcome Sign"],
      materials: ["Acrylic", "Handmade Paper", "Wood", "Calligraphy", "Pressed Flower", "Gold Foil", "Velvet"],
      styles: ["Elegant", "Rustic", "Modern Minimal", "Garden Party", "Boho Chic", "Classic", "Whimsical"],
      priceRange: [9, 260],
    },
    {
      name: "Toys & Games",
      nouns: ["Plush Toy", "Wooden Puzzle", "Busy Board", "Dollhouse Kit", "Dice Set", "Play Mat", "Name Puzzle"],
      materials: ["Crochet", "Beech Wood", "Felt", "Resin", "Montessori", "Silicone", "Amigurumi"],
      styles: ["Personalized", "Educational", "Dinosaur", "Woodland", "Space", "Fantasy", "Animal"],
      priceRange: [11, 140],
    },
    {
      name: "Bath & Beauty",
      nouns: ["Soap Bar", "Bath Bomb Set", "Lip Balm", "Body Butter", "Beard Oil", "Shampoo Bar", "Sugar Scrub"],
      materials: ["Goat Milk", "Shea Butter", "Cold Process", "Essential Oil", "Vegan", "Oatmeal Honey", "Charcoal"],
      styles: ["Lavender", "Citrus", "Unscented", "Spa Gift", "Herbal", "Seasonal", "Zero Waste"],
      priceRange: [5, 60],
    },
    {
      name: "Paper & Stationery",
      nouns: ["Planner", "Journal", "Notepad", "Greeting Card Set", "Bookmark", "Desk Calendar", "Washi Tape"],
      materials: ["Recycled Paper", "Leather Bound", "Letterpress", "Foil Stamped", "Hand Bound", "Dot Grid", "Linen Cover"],
      styles: ["Academic", "Budget", "Wellness", "Illustrated", "Funny", "Motivational", "Celestial"],
      priceRange: [4, 55],
    },
    {
      name: "Digital Downloads",
      nouns: ["Printable Wall Art", "Budget Spreadsheet", "Resume Template", "Lightroom Presets", "SVG Bundle", "Meal Planner", "Wedding Template"],
      materials: ["Instant Download", "Editable", "Canva Template", "Excel", "Procreate", "PDF", "Cricut"],
      styles: ["Minimalist", "Boho", "Small Business", "Aesthetic", "Printable", "Digital", "Customizable"],
      priceRange: [2, 35],
    },
  ];

  const AUDIENCES = ["for Her", "for Him", "for Mom", "for Kids", "for Best Friend", "for Teacher", "for Couples", "for Bride"];
  const OCCASIONS = ["Birthday Gift", "Anniversary Gift", "Christmas Gift", "Mothers Day", "Housewarming", "Baby Shower", "Graduation Gift", "Bridesmaid Gift"];

  const SHOP_PREFIX = ["Wild", "Willow", "Golden", "Tiny", "Maple", "Luna", "Ever", "Fern", "Cedar", "Honey", "River", "Clover", "Aspen", "Sunny", "Nova", "Birch", "Juniper", "Meadow", "Opal", "Hazel"];
  const SHOP_SUFFIX = ["Crafts", "Studio", "Makery", "Design Co", "Workshop", "Threads", "Goods", "Atelier", "Handmade", "Collective", "Supply", "Creations"];

  // ---- shops ---------------------------------------------------------------
  const shopNames = [];
  while (shopNames.length < 48) {
    const name = pick(SHOP_PREFIX) + pick(SHOP_SUFFIX);
    if (!shopNames.includes(name)) shopNames.push(name);
  }
  const shops = shopNames.map((name, i) => ({
    id: i + 1,
    name,
    country: pick(["United States", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Ukraine", "France"]),
    openedYear: ri(2014, 2025),
    rating: Math.round((3.9 + rand() * 1.1) * 10) / 10,
  }));

  // ---- listings ------------------------------------------------------------
  function makeTags(cat, noun, material, style, audience, occasion) {
    const raw = [
      `${style} ${noun}`,
      `${material} ${noun}`,
      `${noun} ${audience}`,
      occasion,
      `${style} ${material}`,
      `handmade ${noun}`,
      `custom ${noun}`,
      `${cat.name.split(" ")[0]} gift`,
      `${style} decor`,
      `${occasion} idea`,
      `personalized gift`,
      `${material} gift`,
      `${style} gift ${audience}`,
    ].map((t) => t.toLowerCase());
    // Etsy tags max out at 20 characters — trim to whole words like sellers do
    const seen = new Set();
    const tags = [];
    for (let t of raw) {
      while (t.length > 20 && t.includes(" ")) t = t.slice(0, t.lastIndexOf(" "));
      t = t.slice(0, 20).trim();
      if (t && !seen.has(t)) { seen.add(t); tags.push(t); }
      if (tags.length === 13) break;
    }
    return tags;
  }

  // 12-month unit-sales trend with a per-listing drift + seasonal bump
  function makeTrend(base) {
    const drift = rand() * 0.24 - 0.08;          // -8%..+16% per month
    const season = rand() < 0.45;                // ~half the shop sells more in Q4
    const out = [];
    let level = Math.max(1, base * (0.55 + rand() * 0.5));
    for (let m = 0; m < 12; m++) {
      const seasonal = season && (m >= 9) ? 1.25 + rand() * 0.5 : 1;
      const noise = 0.75 + rand() * 0.5;
      out.push(Math.max(0, Math.round(level * seasonal * noise)));
      level *= 1 + drift;
    }
    return out;
  }

  const listings = [];
  let id = 1;
  for (const cat of CATEGORIES) {
    const count = ri(20, 26);
    for (let i = 0; i < count; i++) {
      const noun = pick(cat.nouns);
      const material = pick(cat.materials);
      const style = pick(cat.styles);
      const audience = pick(AUDIENCES);
      const occasion = pick(OCCASIONS);
      const shop = pick(shops);

      const title = `${style} ${material} ${noun} | ${occasion} ${audience} | Handmade ${cat.name.split(" ")[0]} Gift`;
      const [lo, hi] = cat.priceRange;
      const price = Math.round((lo + rand() * (hi - lo)) * 100) / 100;

      // Popularity is long-tailed: a few hits, many modest sellers
      const pop = Math.pow(rand(), 2.6);
      const sales30 = Math.round(2 + pop * 480);
      const trend = makeTrend(sales30);
      const salesTotal = trend.reduce((a, b) => a + b, 0) + ri(0, sales30 * 8);
      const conversion = 0.012 + rand() * 0.04;
      const views30 = Math.round(sales30 / conversion);
      const favorites = Math.round(salesTotal * (0.35 + rand() * 0.9));
      const ageMonths = ri(2, 60);

      listings.push({
        id: id++,
        title,
        shopId: shop.id,
        shop: shop.name,
        category: cat.name,
        price,
        sales30,
        salesTotal,
        revenue30: Math.round(sales30 * price),
        views30,
        favorites,
        reviews: Math.round(salesTotal * (0.18 + rand() * 0.2)),
        rating: Math.round((4.0 + rand() * 1.0) * 10) / 10,
        ageMonths,
        tags: makeTags(cat, noun, material, style, audience, occasion),
        trend,
        keyword: `${style} ${noun}`.toLowerCase(),
      });
    }
  }

  // ---- listing photo slots (placeholder thumbs as inline SVG) ---------------
  const CAT_HUES = {};
  CATEGORIES.forEach((c, i) => { CAT_HUES[c.name] = (i * 37 + 12) % 360; });

  function photoThumb(word, hue, n) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="hsl(${hue},50%,88%)"/><stop offset="1" stop-color="hsl(${hue},42%,68%)"/></linearGradient></defs>` +
      `<rect width="400" height="400" fill="url(#g)"/>` +
      `<circle cx="200" cy="160" r="84" fill="hsl(${hue},46%,58%)" opacity="0.5"/>` +
      `<text x="200" y="182" text-anchor="middle" font-family="system-ui,sans-serif" font-size="64" font-weight="700" fill="hsl(${hue},40%,26%)">${word.slice(0, 1).toUpperCase()}</text>` +
      `<text x="200" y="300" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="600" fill="hsl(${hue},34%,32%)">${word}</text>` +
      `<text x="200" y="342" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="hsl(${hue},28%,40%)">Photo ${n}</text></svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  for (const l of listings) {
    const hue = CAT_HUES[l.category];
    const word = l.title.split(" ").find((w) => w.length > 3) || "Item";
    const filled = ri(3, 6);
    l.photos = Array.from({ length: 6 }, (_, i) => (i < filled ? photoThumb(word, (hue + i * 14) % 360, i + 1) : null));
  }

  // ---- sample designs (original SVG artwork, usable in the Mockup Generator) --
  const svgUri = (s) => "data:image/svg+xml," + encodeURIComponent(s);
  const SAMPLE_DESIGNS = [
    {
      name: "monstera-leaf.svg",
      src: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">` +
        `<mask id="m"><rect width="480" height="480" fill="white"/>` +
        `<path d="M110 210 Q200 225 236 240 L110 258 Z" fill="black"/>` +
        `<path d="M130 320 Q210 300 238 282 L162 362 Z" fill="black"/>` +
        `<path d="M370 210 Q280 225 244 240 L370 258 Z" fill="black"/>` +
        `<path d="M350 320 Q270 300 242 282 L318 362 Z" fill="black"/>` +
        `<path d="M196 120 Q228 180 238 214 L166 142 Z" fill="black"/>` +
        `<path d="M284 120 Q252 180 242 214 L314 142 Z" fill="black"/></mask>` +
        `<path d="M240 52 C132 52 62 150 72 254 C82 356 158 428 240 428 C322 428 398 356 408 254 C418 150 348 52 240 52 Z" fill="#2f7d4f" mask="url(#m)"/>` +
        `<rect x="234" y="230" width="12" height="220" rx="6" fill="#256a41"/></svg>`),
    },
    {
      name: "sun-and-moon.svg",
      src: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">` +
        `<g stroke="#c98500" stroke-width="14" stroke-linecap="round">` +
        `<line x1="240" y1="34" x2="240" y2="86"/><line x1="240" y1="394" x2="240" y2="446"/>` +
        `<line x1="34" y1="240" x2="86" y2="240"/><line x1="394" y1="240" x2="446" y2="240"/>` +
        `<line x1="95" y1="95" x2="131" y2="131"/><line x1="349" y1="349" x2="385" y2="385"/>` +
        `<line x1="95" y1="385" x2="131" y2="349"/><line x1="349" y1="131" x2="385" y2="95"/></g>` +
        `<circle cx="240" cy="240" r="128" fill="#eda100"/>` +
        `<path d="M292 148 A118 118 0 1 0 332 300 A96 96 0 0 1 292 148 Z" fill="#7a5200" opacity="0.9"/>` +
        `<circle cx="205" cy="222" r="12" fill="#7a5200"/><circle cx="248" cy="205" r="8" fill="#7a5200"/></svg>`),
    },
    {
      name: "mountain-badge.svg",
      src: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">` +
        `<circle cx="240" cy="240" r="200" fill="none" stroke="#33414f" stroke-width="16"/>` +
        `<circle cx="240" cy="240" r="168" fill="#e8f0f7"/>` +
        `<path d="M120 300 L200 170 L246 240 L286 190 L360 300 Z" fill="#33414f"/>` +
        `<path d="M200 170 L222 206 L204 206 L228 246 L246 240 Z" fill="#ffffff" opacity="0.85"/>` +
        `<circle cx="320" cy="150" r="26" fill="#eda100"/>` +
        `<rect x="120" y="300" width="240" height="14" rx="7" fill="#33414f"/>` +
        `<text x="240" y="368" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="800" letter-spacing="6" fill="#33414f">EXPLORE</text></svg>`),
    },
  ];

  // ---- asset library (demo files + anything the user uploads) ---------------
  let assetId = 1;
  const FOLDERS = ["Designs", "Mockups", "Photos", "Reels", "Q4 Drop", "Source"];
  const assets = [];
  for (const d of SAMPLE_DESIGNS) {
    assets.push({ id: assetId++, name: d.name, folder: "Designs", type: "image", size: 14 * 1024 + ri(0, 9000), src: d.src });
  }
  const someListings = shuffled(listings).slice(0, 9);
  someListings.forEach((l, i) => {
    assets.push({ id: assetId++, name: `product-shot-${String(i + 1).padStart(2, "0")}.jpg`, folder: "Photos", type: "image", size: ri(600, 3200) * 1024, src: l.photos[0] });
  });
  for (let i = 1; i <= 6; i++) assets.push({ id: assetId++, name: `loop_${i}.mp4`, folder: "Reels", type: "video", size: ri(18, 92) * 1024 * 1024 });
  for (let i = 1; i <= 4; i++) assets.push({ id: assetId++, name: `q4-drop-v${i}.zip`, folder: "Q4 Drop", type: "archive", size: ri(4, 60) * 1024 * 1024 });
  assets.push({ id: assetId++, name: "brand-kit.ai", folder: "Source", type: "doc", size: 21 * 1024 * 1024 });
  assets.push({ id: assetId++, name: "font-license.pdf", folder: "Source", type: "doc", size: 180 * 1024 });

  // ---- demo checkout queue for Digital Delivery ------------------------------
  const CUSTOMERS = [
    { name: "Maya R.", amount: 18 }, { name: "Hugo K.", amount: 24 },
    { name: "Priya S.", amount: 16 }, { name: "Theo W.", amount: 22 },
    { name: "Aisha B.", amount: 31 }, { name: "Leo M.", amount: 12 },
  ];

  // ---- monthly axis labels (last 12 months, oldest first) -------------------
  const MONTHS = (() => {
    const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date(2026, 6, 1); // demo dataset is frozen at Jul 2026
    const out = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(`${names[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`);
    }
    return out;
  })();

  return { listings, shops, CATEGORIES, MONTHS, strHash, mulberry32, assets, FOLDERS, CUSTOMERS, nextAssetId: () => assetId++ };
})();
