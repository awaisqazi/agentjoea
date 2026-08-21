// Joseph Alvarado (agentjoea.com) brand-graphics render library.
//
// Compose on-brand marketing graphics as SVG in a fixed pixel coordinate
// space, then rasterize to PNG/JPEG with sharp (already installed via Astro).
// Adapted from the LSP event-graphics pipeline; tokens mirror the website's
// design system in src/styles/global.css so web + graphics stay in sync.
//
//   import * as ja from "./ja_graphics.mjs";
//   const sharp = ja.loadSharp();
//
// Text renders best on macOS: Playfair Display falls back to Didot (visually
// a sibling Didone serif) and Inter falls back to Helvetica Neue.

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Brand tokens — keep in lockstep with src/styles/global.css
// ---------------------------------------------------------------------------

export const C = {
  ink: "#0B0E13",        // page background / text on gold
  surface: "#121722",    // card surface
  panel: "#1A2130",      // raised surface
  line: "#242E40",       // hairline borders
  gold: "#D8B36A",       // the JA gold — CTAs, rules, accents
  goldBright: "#EECF8F", // highlight end of the gold gradient
  goldDeep: "#8F6E35",   // shadow end of the gold gradient
  cream: "#F2EEE5",      // primary light text
  muted: "#A8B0BD",      // secondary text
};

export const SERIF = "Playfair Display, Didot, Bodoni 72, Georgia, serif";
export const SANS = "Inter, Avenir Next, Helvetica Neue, Arial, sans-serif";

// Brand assets, resolved relative to this file.
export const ASSETS = {
  logo: path.join(HERE, "..", "src", "assets", "brand", "logo.webp"),
  portrait: path.join(HERE, "..", "src", "assets", "brand", "portrait.png"),
  brokers: path.join(HERE, "..", "src", "assets", "brand", "brokers-logo.png"),
  hero: path.join(HERE, "..", "src", "assets", "brand", "hero.jpg"),
};

// ---------------------------------------------------------------------------
// sharp resolution (Astro already depends on sharp)
// ---------------------------------------------------------------------------

export function loadSharp() {
  const attempts = [
    () => createRequire(path.join(HERE, "..", "package.json"))("sharp"),
    () => createRequire(path.join(process.cwd(), "package.json"))("sharp"),
    () => createRequire(import.meta.url)("sharp"),
  ];
  for (const a of attempts) {
    try { return a(); } catch { /* try next */ }
  }
  throw new Error("Could not load `sharp` — run `npm install` in the site repo first.");
}

// ---------------------------------------------------------------------------
// SVG text + primitives
// ---------------------------------------------------------------------------

export function esc(v) {
  return String(v)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

// A single line of text. anchor: start | middle | end.
export function txt({ text, x, y, size, color = C.cream, weight = 600, family = SANS, anchor = "start", tracking = 0, italic = false, opacity = 1 }) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" opacity="${opacity}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${italic ? "italic" : "normal"}" letter-spacing="${tracking}">${esc(text)}</text>`;
}

// Greedy word-wrap by approximate character count. maxChars ~ width/(size*0.5)
// for the sans; use ~0.46 for the serif.
export function wrapLines(text, maxChars) {
  const out = []; let cur = "";
  for (const w of String(text).split(/\s+/)) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) { out.push(cur); cur = w; } else cur = next;
  }
  if (cur) out.push(cur);
  return out;
}

export function paragraph({ text, x, y, size, width, color = C.cream, weight = 500, family = SANS, lineH = 1.32, opacity = 1, anchor = "start", italic = false, charRatio = 0.5 }) {
  const maxChars = Math.max(8, Math.floor(width / (size * charRatio)));
  return wrapLines(text, maxChars)
    .map((ln, i) => txt({ text: ln, x, y: y + i * size * lineH, size, color, weight, family, opacity, anchor, italic }))
    .join("");
}

// A gold hairline that fades at both ends. Requires goldLine from defs().
export function rule(x, y, w, opacity = 0.6, h = 2) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#goldLine)" opacity="${opacity}"/>`;
}

// Solid short accent bar — the web design's `divider-gold` motif.
export function accentBar(x, y, w = 56, h = 3, fill = C.gold) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

// Rounded pill chip. Gold fill + ink text for CTAs/URLs; ghost (stroke) for tags.
export function pill(x, y, w, h, { fill = C.gold, stroke = "none", strokeOpacity = 1, strokeWidth = 2, opacity = 1 } = {}) {
  const s = stroke === "none" ? "" : ` stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="${strokeWidth}"`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" opacity="${opacity}"${s}/>`;
}

// Bordered content card matching the website's card style.
export function card(x, y, w, h, { rx = 14, accent = false } = {}) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>`;
  if (accent) s += rule(x + rx, y, w - rx * 2, 0.5);
  return s;
}

// Subtle deterministic grain so large dark fields don't band.
export function grain(W, H, count = 220, opacity = 0.05) {
  const d = [];
  for (let i = 0; i < count; i += 1) {
    const x = (i * 109 + 19) % W, y = (i * 73 + 41) % H, r = 0.8 + ((i * 7) % 4) * 0.36;
    d.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.cream}" opacity="${opacity}"/>`);
  }
  return d.join("");
}

// ---------------------------------------------------------------------------
// Shared <defs> + background
// ---------------------------------------------------------------------------

// haloCx/haloCy position the warm glow behind the focal point.
export function defs({ haloCx = "30%", haloCy = "40%", extra = "" } = {}) {
  return `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0D1118"/><stop offset="0.5" stop-color="#121722"/><stop offset="1" stop-color="#080A0F"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.goldDeep}" stop-opacity="0"/><stop offset="0.25" stop-color="${C.gold}"/><stop offset="0.5" stop-color="${C.goldBright}"/><stop offset="0.75" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldDeep}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.goldBright}"/><stop offset="1" stop-color="${C.gold}"/>
    </linearGradient>
    <radialGradient id="halo" cx="${haloCx}" cy="${haloCy}" r="55%">
      <stop offset="0" stop-color="${C.goldBright}" stop-opacity="0.14"/><stop offset="0.4" stop-color="${C.gold}" stop-opacity="0.06"/><stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.5"/></filter>
    ${extra}
  </defs>`;
}

// Background gradient + halo + grain, with optional thin gold edge hairlines.
export function backdrop(W, H, { grainCount = 220, grainOpacity = 0.05, hairlines = true } = {}) {
  let s = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`
    + `<rect width="${W}" height="${H}" fill="url(#halo)"/>`
    + grain(W, H, grainCount, grainOpacity);
  if (hairlines) {
    s += `<rect x="0" y="0" width="${W}" height="2" fill="url(#goldLine)" opacity="0.7"/>`
      + `<rect x="0" y="${H - 2}" width="${W}" height="2" fill="url(#goldLine)" opacity="0.7"/>`;
  }
  return s;
}

// A framed photo with soft shadow + thin gold stroke (the website's card look).
export function framedPhoto({ href, x, y, w, h, rx = 18, id = "photoClip", stroke = "rgba(216,179,106,0.55)" }) {
  return `<g filter="url(#softShadow)">`
    + `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>`
    + `<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="${stroke}" stroke-width="2.5"/>`
    + `</g>`;
}

// ---------------------------------------------------------------------------
// Rasterizing
// ---------------------------------------------------------------------------

export async function imageDataURI(sharp, filePath, { width = 1600, format = "png", extract = null } = {}) {
  let p = sharp(filePath);
  if (extract) p = p.extract(extract);
  if (width) p = p.resize({ width, withoutEnlargement: true });
  const buf = await (format === "jpeg" ? p.jpeg({ quality: 90, mozjpeg: true }) : p.png()).toBuffer();
  return `data:image/${format};base64,${buf.toString("base64")}`;
}

export async function renderPNG(sharp, markup, outPath, { resize = null } = {}) {
  let p = sharp(Buffer.from(markup));
  if (resize) p = p.resize(resize[0], resize[1]);
  await p.png({ compressionLevel: 9 }).toFile(outPath);
  return outPath;
}

export async function renderJPEG(sharp, markup, outPath, { quality = 90, resize = null } = {}) {
  let p = sharp(Buffer.from(markup));
  if (resize) p = p.resize(resize[0], resize[1]);
  await p.jpeg({ quality, mozjpeg: true }).toFile(outPath);
  return outPath;
}

// Author at superSample× (2 is a good default) and pass resize to renderPNG for
// crisper text at the final size.
export function svgRoot(W, H, body, { defsBlock = defs(), superSample = 1 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * superSample}" height="${H * superSample}" viewBox="0 0 ${W} ${H}">${defsBlock}${body}</svg>`;
}
