# Joseph Alvarado brand kit

The visual identity for agentjoea.com and all marketing graphics (social posts,
share cards, flyers). Tokens live in two synchronized places:

- **Web:** `src/styles/global.css` (CSS custom properties)
- **Graphics:** `brand/ja_graphics.mjs` (`ja.C`, `ja.SERIF`, `ja.SANS`)

If one changes, change the other.

## Color

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0E13` | Page/graphic background; text on gold |
| `surface` | `#121722` | Cards, panels |
| `panel` | `#1A2130` | Raised surfaces |
| `line` | `#242E40` | Hairline borders |
| `gold` | `#D8B36A` | **The** accent — CTAs, rules, badges, key words |
| `goldBright` | `#EECF8F` | Highlight end of gold gradients, hover states |
| `goldDeep` | `#8F6E35` | Shadow end of gold gradients |
| `cream` | `#F2EEE5` | Primary light text |
| `muted` | `#A8B0BD` | Secondary text |

Gold is punctuation, not paint: hairlines, one CTA, a badge, an accented word.
If more than ~15% of a composition is gold, pull back. Backgrounds are always
the dark vertical gradient with a *subtle* warm halo behind the focal point.

## Type

- **Display / headlines:** Playfair Display (the website's heading face).
  In rendered graphics it falls back to **Didot** on macOS — a sibling Didone
  serif, visually consistent. Upright by default; italic only for an accented
  word (matching the site's `<em>` gold italics).
- **Everything else:** Inter (falls back to Helvetica Neue).
  - *Kickers/labels:* UPPERCASE, weight 650–800, wide tracking (3–8px at
    social sizes) — mirrors the site's `.kicker`.
  - *Body:* weight 500, `muted` color or cream at 0.75–0.9 opacity.

## Recurring motifs

- **Gold hairline** (`rule`): gradient line fading at both ends. Frames top and
  bottom edges of graphics (`backdrop` adds them).
- **Accent bar** (`accentBar`): short solid gold bar under a heading — the
  site's `.divider-gold`.
- **Framed photo** (`framedPhoto`): rounded corners (rx 14–18), thin gold
  stroke, soft shadow — the website's card look.
- **Pill** (`pill`): gold fill + ink text for CTAs and the domain chip; ghost
  stroke for tags (RENTAL / FLIPPED / AIRBNB property badges).
- **Halo + grain:** always present, always subtle.

## Logo & photos

- `src/assets/brand/logo.webp` — the gold JA monogram + wordmark (light text;
  dark backgrounds only).
- `src/assets/brand/portrait.png` — Joe's suit portrait. Primary human element.
- `src/assets/brand/brokers-logo.png` — Chicagoland Brokers. Include a
  "Powered by" credit on anything acting as an ad for brokerage services.
- Property photos live in `src/assets/properties/<slug>/`.

## Voice & copy rules

- Warm, direct, first-person ("I make real estate easier for you").
- Facts (prices, stats, dates) come from the site content — never invent.
- Service area line: "Winfield, Wheaton, West Chicago & Chicago Suburbs".
- Contact: AgentJoeA@gmail.com · (224) 324-5472 · agentjoea.com.

## Rendering a graphic

```bash
node brand/share-card.mjs   # renders public/og.png (1200x630)
```

Copy `share-card.mjs` as the starting template for new formats (IG post
1080x1350, story 1080x1920, etc.). Author at 2x with `superSample: 2` and
resize down for crisp text. Eyeball every render before shipping.
