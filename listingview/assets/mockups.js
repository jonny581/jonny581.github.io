/* ListingView — Mockup Generator rendering engine.
 *
 * Each template draws a product scene on a canvas, then composites a user
 * design into its print area. Everything is drawn with canvas primitives, so
 * any image (PNG/JPG/WebP/SVG data URL or upload) drops in with no external
 * assets and the result can be exported with canvas.toDataURL().
 */
"use strict";

const LVMock = (() => {
  const SIZE = 840;

  const cnv = (w = SIZE, h = SIZE) => {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
  };

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Render the design onto a transparent "plate" the exact size of the print
  // area (contain fit, user scale + vertical offset), so templates can warp or
  // clip the plate without caring about the source image's dimensions.
  function plate(img, w, h, opts) {
    const c = cnv(Math.round(w), Math.round(h));
    const ctx = c.getContext("2d");
    const s = Math.min(w / img.width, h / img.height) * (opts.scale || 1);
    const dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2 + (opts.offsetY || 0) * h, dw, dh);
    return c;
  }

  function room(ctx, wallA, wallB, floorY, floorA, floorB) {
    const wall = ctx.createLinearGradient(0, 0, 0, floorY);
    wall.addColorStop(0, wallA); wall.addColorStop(1, wallB);
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, SIZE, floorY);
    if (floorY >= SIZE) return;
    const floor = ctx.createLinearGradient(0, floorY, 0, SIZE);
    floor.addColorStop(0, floorA); floor.addColorStop(1, floorB);
    ctx.fillStyle = floor;
    ctx.fillRect(0, floorY, SIZE, SIZE - floorY);
  }

  function softShadow(ctx, cx, cy, rx, ry, alpha = 0.18) {
    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, rx);
    g.addColorStop(0, `rgba(20,20,20,${alpha})`);
    g.addColorStop(1, "rgba(20,20,20,0)");
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    ctx.translate(-cx, -cy);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Subtle top-light shading over the print area so the design sits "in" the material
  function printShade(ctx, x, y, w, h) {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "rgba(255,255,255,0.025)");
    g.addColorStop(0.6, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.03)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }

  // Cylindrical warp: draw the plate in vertical slices that dip toward the edges
  function drawCylindrical(ctx, plateC, x, y, w, h, bulge = 0.05) {
    const slices = 72;
    for (let i = 0; i < slices; i++) {
      const t = (i + 0.5) / slices;
      const curve = Math.sin(t * Math.PI);           // 0 at edges, 1 at center
      const dy = (1 - curve) * h * bulge;
      ctx.drawImage(plateC,
        (plateC.width / slices) * i, 0, plateC.width / slices, plateC.height,
        x + (w / slices) * i, y + dy, w / slices + 0.6, h - dy * 1.6);
    }
  }

  // ---- templates -------------------------------------------------------------

  const templates = [
    {
      id: "mug", name: "Ceramic Mug",
      render(img, opts) {
        const c = cnv(), ctx = c.getContext("2d");
        room(ctx, "#e9e2d6", "#ded4c4", 560, "#b9a488", "#a68f72");
        softShadow(ctx, 420, 618, 250, 46, 0.24);

        // handle (behind body)
        ctx.strokeStyle = "#e6e3de";
        ctx.lineWidth = 34;
        ctx.beginPath();
        ctx.arc(575, 420, 82, -Math.PI / 2.6, Math.PI / 2.6);
        ctx.stroke();
        ctx.strokeStyle = "#d2cec8";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(575, 420, 96, -Math.PI / 3.4, Math.PI / 3.4);
        ctx.stroke();

        // body
        const body = ctx.createLinearGradient(240, 0, 610, 0);
        body.addColorStop(0, "#d8d5cf");
        body.addColorStop(0.18, "#f7f5f1");
        body.addColorStop(0.55, "#ffffff");
        body.addColorStop(0.88, "#e2dfd9");
        body.addColorStop(1, "#cfccc5");
        ctx.fillStyle = body;
        rr(ctx, 240, 268, 360, 348, 28);
        ctx.fill();
        // rim
        ctx.fillStyle = "#c9c6bf";
        ctx.beginPath();
        ctx.ellipse(420, 272, 180, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#8f8c85";
        ctx.beginPath();
        ctx.ellipse(420, 272, 168, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // print area (wraps the body)
        const p = { x: 278, y: 316, w: 284, h: 236 };
        drawCylindrical(ctx, plate(img, p.w, p.h, opts), p.x, p.y, p.w, p.h);
        printShade(ctx, p.x, p.y, p.w, p.h);
        return c;
      },
    },
    {
      id: "tee", name: "Unisex Tee",
      render(img, opts) {
        const c = cnv(), ctx = c.getContext("2d");
        room(ctx, "#dfe4e8", "#cfd6dc", SIZE, "", "");
        softShadow(ctx, 420, 700, 300, 40, 0.16);

        const fabric = ctx.createLinearGradient(0, 200, 0, 720);
        fabric.addColorStop(0, "#f4f2ee");
        fabric.addColorStop(1, "#dcd9d3");
        ctx.fillStyle = fabric;
        ctx.strokeStyle = "#b9b6af";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(330, 208);                       // left neck
        ctx.quadraticCurveTo(420, 258, 510, 208);   // neck opening
        ctx.lineTo(590, 232);                       // right shoulder
        ctx.lineTo(700, 330); ctx.lineTo(660, 402); // right sleeve
        ctx.lineTo(568, 360);
        ctx.lineTo(560, 690);                       // right side
        ctx.quadraticCurveTo(420, 706, 280, 690);   // hem
        ctx.lineTo(272, 360);
        ctx.lineTo(180, 402); ctx.lineTo(140, 330); // left sleeve
        ctx.lineTo(250, 232);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // collar ribbing
        ctx.strokeStyle = "#c7c4bd";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(332, 212);
        ctx.quadraticCurveTo(420, 268, 508, 212);
        ctx.stroke();
        // sleeve seams
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(272, 360); ctx.lineTo(258, 246); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(568, 360); ctx.lineTo(582, 246); ctx.stroke();

        const p = { x: 300, y: 320, w: 240, h: 290 };
        ctx.drawImage(plate(img, p.w, p.h, opts), p.x, p.y);
        printShade(ctx, p.x, p.y, p.w, p.h);
        return c;
      },
    },
    {
      id: "tote", name: "Canvas Tote",
      render(img, opts) {
        const c = cnv(), ctx = c.getContext("2d");
        room(ctx, "#e7e0d2", "#dbd2c0", 620, "#c9b393", "#b49d7d");
        softShadow(ctx, 420, 668, 240, 36, 0.2);

        // handles
        ctx.strokeStyle = "#c9b691";
        ctx.lineWidth = 22;
        ctx.beginPath(); ctx.moveTo(330, 320); ctx.quadraticCurveTo(360, 130, 400, 320); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(440, 320); ctx.quadraticCurveTo(480, 130, 510, 320); ctx.stroke();

        // bag
        const canvasG = ctx.createLinearGradient(250, 0, 590, 0);
        canvasG.addColorStop(0, "#efe6d3");
        canvasG.addColorStop(0.5, "#f8f1e2");
        canvasG.addColorStop(1, "#e5dbc6");
        ctx.fillStyle = canvasG;
        ctx.strokeStyle = "#c6b795";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(262, 310);
        ctx.lineTo(578, 310);
        ctx.lineTo(596, 648);
        ctx.quadraticCurveTo(420, 664, 244, 648);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        // top hem stitch
        ctx.setLineDash([7, 6]);
        ctx.strokeStyle = "#b7a684";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(268, 332); ctx.lineTo(572, 332); ctx.stroke();
        ctx.setLineDash([]);

        const p = { x: 305, y: 380, w: 230, h: 220 };
        ctx.drawImage(plate(img, p.w, p.h, opts), p.x, p.y);
        printShade(ctx, p.x, p.y, p.w, p.h);
        return c;
      },
    },
    {
      id: "hoodie", name: "Heavy Hoodie",
      render(img, opts) {
        const c = cnv(), ctx = c.getContext("2d");
        room(ctx, "#e3e0da", "#d2cfc8", SIZE, "", "");
        softShadow(ctx, 420, 706, 300, 40, 0.16);

        const fabric = ctx.createLinearGradient(0, 160, 0, 730);
        fabric.addColorStop(0, "#5a6470");
        fabric.addColorStop(1, "#454e58");
        ctx.fillStyle = fabric;
        ctx.strokeStyle = "#333a43";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(338, 216);
        ctx.quadraticCurveTo(420, 252, 502, 216);
        ctx.lineTo(592, 246);
        ctx.lineTo(706, 356); ctx.lineTo(662, 428);
        ctx.lineTo(572, 382);
        ctx.lineTo(566, 700);
        ctx.quadraticCurveTo(420, 716, 274, 700);
        ctx.lineTo(268, 382);
        ctx.lineTo(178, 428); ctx.lineTo(134, 356);
        ctx.lineTo(248, 246);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // hood
        ctx.fillStyle = "#4d5661";
        ctx.beginPath();
        ctx.moveTo(338, 216);
        ctx.quadraticCurveTo(360, 130, 420, 124);
        ctx.quadraticCurveTo(480, 130, 502, 216);
        ctx.quadraticCurveTo(420, 262, 338, 216);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        // drawstrings
        ctx.strokeStyle = "#d8d5cf";
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(392, 244); ctx.quadraticCurveTo(388, 300, 396, 330); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(448, 244); ctx.quadraticCurveTo(452, 300, 444, 330); ctx.stroke();

        // kangaroo pocket
        ctx.fillStyle = "#4d5661";
        ctx.strokeStyle = "#333a43";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(316, 560);
        ctx.lineTo(524, 560);
        ctx.lineTo(548, 682);
        ctx.quadraticCurveTo(420, 694, 292, 682);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // ribbed cuffs hem
        ctx.fillStyle = "#3d454e";
        rr(ctx, 276, 686, 288, 26, 8);
        ctx.fill();

        const p = { x: 316, y: 340, w: 208, h: 200 };
        ctx.drawImage(plate(img, p.w, p.h, opts), p.x, p.y);
        printShade(ctx, p.x, p.y, p.w, p.h);
        return c;
      },
    },
    {
      id: "sticker", name: "Vinyl Sticker",
      render(img, opts) {
        const c = cnv(), ctx = c.getContext("2d");
        room(ctx, "#dcd7ce", "#cfc9be", SIZE, "", "");
        // subtle desk texture lines
        ctx.strokeStyle = "rgba(120,110,95,0.10)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 120 + i * 90);
          ctx.lineTo(SIZE, 96 + i * 90);
          ctx.stroke();
        }

        const p = { x: 230, y: 230, w: 380, h: 380 };
        const plateC = plate(img, p.w, p.h, opts);

        // white silhouette (die-cut border): stamp a white copy in a ring
        const white = cnv(plateC.width, plateC.height);
        const wctx = white.getContext("2d");
        wctx.drawImage(plateC, 0, 0);
        wctx.globalCompositeOperation = "source-in";
        wctx.fillStyle = "#ffffff";
        wctx.fillRect(0, 0, white.width, white.height);

        ctx.save();
        ctx.translate(SIZE / 2, SIZE / 2);
        ctx.rotate(-0.06);
        ctx.translate(-SIZE / 2, -SIZE / 2);
        ctx.shadowColor = "rgba(30,30,30,0.35)";
        ctx.shadowBlur = 22;
        ctx.shadowOffsetY = 14;
        const R = 14;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
          ctx.drawImage(white, p.x + Math.cos(a) * R, p.y + Math.sin(a) * R);
          ctx.shadowColor = "transparent";
        }
        ctx.drawImage(plateC, p.x, p.y);
        // glossy diagonal highlight
        const gl = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
        gl.addColorStop(0.32, "rgba(255,255,255,0)");
        gl.addColorStop(0.44, "rgba(255,255,255,0.20)");
        gl.addColorStop(0.52, "rgba(255,255,255,0)");
        ctx.fillStyle = gl;
        ctx.fillRect(p.x - R, p.y - R, p.w + R * 2, p.h + R * 2);
        ctx.restore();
        return c;
      },
    },
    {
      id: "poster", name: "Matte Poster",
      render(img, opts) {
        const c = cnv(), ctx = c.getContext("2d");
        room(ctx, "#e8e4dc", "#ddd8ce", 700, "#8a7358", "#75604a");
        // baseboard
        ctx.fillStyle = "#f1ede6";
        ctx.fillRect(0, 672, SIZE, 30);

        // frame with drop shadow
        ctx.save();
        ctx.shadowColor = "rgba(30,30,30,0.35)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 16;
        ctx.fillStyle = "#3c3630";
        ctx.fillRect(238, 128, 364, 476);
        ctx.restore();
        ctx.fillStyle = "#57504a";
        ctx.fillRect(246, 136, 348, 460);
        // matte
        ctx.fillStyle = "#fbfaf7";
        ctx.fillRect(258, 148, 324, 436);

        const p = { x: 288, y: 182, w: 264, h: 368 };
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.drawImage(plate(img, p.w, p.h, opts), p.x, p.y);
        // glass sheen
        const gl = ctx.createLinearGradient(246, 136, 594, 596);
        gl.addColorStop(0.55, "rgba(255,255,255,0)");
        gl.addColorStop(0.66, "rgba(255,255,255,0.12)");
        gl.addColorStop(0.72, "rgba(255,255,255,0)");
        ctx.fillStyle = gl;
        ctx.fillRect(246, 136, 348, 460);
        return c;
      },
    },
  ];

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = src;
    });
  }

  async function renderAll(src, opts = {}) {
    const img = await loadImage(src);
    return templates.map((t) => ({ id: t.id, name: t.name, canvas: t.render(img, opts) }));
  }

  return { templates, renderAll, loadImage };
})();
