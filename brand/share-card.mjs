// Renders the Open Graph share card (public/og.png, 1200x630) — the image
// shown when a link to agentjoea.com is shared in iMessage/Slack/social.
//
//   node brand/share-card.mjs

import path from "node:path";
import { fileURLToPath } from "node:url";
import * as ja from "./ja_graphics.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "..", "public", "og.png");

const W = 1200, H = 630;
const sharp = ja.loadSharp();

const portrait = await ja.imageDataURI(sharp, ja.ASSETS.portrait, { width: 900 });
const logo = await ja.imageDataURI(sharp, ja.ASSETS.logo, { width: 320 });

let s = ja.backdrop(W, H);

// ---- right: framed portrait ----
const PW = 330, PH = 470;
const PX = W - PW - 84, PY = (H - PH) / 2;
s += ja.framedPhoto({ href: portrait, x: PX, y: PY, w: PW, h: PH, rx: 18 });

// ---- left column ----
const LX = 84;

// logo
s += `<image href="${logo}" x="${LX - 6}" y="64" width="150" height="94" preserveAspectRatio="xMidYMid meet"/>`;

// kicker
s += ja.txt({
  text: "REALTOR · CHICAGOLAND BROKERS · INVESTOR",
  x: LX, y: 235, size: 21, color: ja.C.gold, weight: 700, tracking: 4,
});

// name
s += ja.txt({
  text: "Joseph Alvarado",
  x: LX - 4, y: 318, size: 84, color: ja.C.cream, family: ja.SERIF, weight: 600,
});

s += ja.accentBar(LX, 352, 64, 3);

// value line + service area
s += ja.paragraph({
  text: "I make real estate easier for you. Buy, sell, and invest with an agent who invests himself.",
  x: LX, y: 407, size: 26, width: 610, color: ja.C.muted, weight: 500, lineH: 1.42,
});
s += ja.txt({
  text: "Winfield · Wheaton · West Chicago · Chicago Suburbs",
  x: LX, y: 493, size: 22, color: ja.C.cream, weight: 600, opacity: 0.9,
});

// domain pill CTA
const pillW = 268, pillH = 54, pillY = 528;
s += ja.pill(LX, pillY, pillW, pillH, { fill: "url(#goldFill)" });
s += ja.txt({
  text: "agentjoea.com", x: LX + pillW / 2, y: pillY + 36, size: 25,
  color: ja.C.ink, weight: 700, anchor: "middle",
});

const markup = ja.svgRoot(W, H, s, {
  defsBlock: ja.defs({ haloCx: "26%", haloCy: "35%" }),
  superSample: 2,
});
await ja.renderPNG(sharp, markup, OUT, { resize: [W, H] });
console.log(`wrote ${OUT}`);
