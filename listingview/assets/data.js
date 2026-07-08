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

  return { listings, shops, CATEGORIES, MONTHS, strHash, mulberry32 };
})();
