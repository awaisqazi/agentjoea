# agentjoea.com — Joseph Alvarado, Realtor & Investor

Refreshed website for Joseph Alvarado (Alvarado Investments), rebuilt from Webflow as a fast,
static [Astro](https://astro.build) site. All original content — pages, 6 property case
studies, 7 blog posts, testimonials, and imagery — was carried over.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
```

## Structure

- `src/config.ts` — every piece of contact info and every external link (Calendly, home-value
  tool, socials, brokerage). Edit here, updates everywhere.
- `src/content/properties/*.md` — property case studies (frontmatter holds prices/beds/baths;
  body holds the story + services list).
- `src/content/blog/*.md` — blog posts. Add a new `.md` file and it appears automatically.
- `src/assets/properties/<slug>/` — `card.jpg` is the cover; `gallery-*.jpg` files are picked
  up automatically on the property page.
- `src/styles/global.css` — the design system (colors, type, buttons, cards).
- `brand/` — the graphics brand kit: [BRAND.md](brand/BRAND.md) documents the identity,
  `ja_graphics.mjs` is an SVG→PNG render library sharing the site's tokens, and
  `node brand/share-card.mjs` regenerates the social share card (`public/og.png`).

## Deploy (GitHub Pages)

Push to `main` and `.github/workflows/deploy.yml` builds and publishes automatically.
One-time setup in the GitHub repo: **Settings → Pages → Source: "GitHub Actions"**.

The workflow currently builds for `https://<user>.github.io/<repo>/`. To move to the real
domain later:

1. Repo **Settings → Pages → Custom domain** → `agentjoea.com` (and set up the DNS records
   GitHub shows you at the domain registrar).
2. Delete the `DEPLOY_BASE` / `DEPLOY_SITE` lines from `.github/workflows/deploy.yml`.
3. Push — the site rebuilds for the root domain. Old Webflow URLs (`/about-me`, `/post/…`,
   `/case-study-properties/…`) redirect to the new structure automatically.

## Forms

This is a static site, so the contact + subscribe forms have no server. Until a form backend
is configured they gracefully fall back to opening the visitor's email app pre-filled.

To capture submissions properly: create a free form at [formspree.io](https://formspree.io),
then paste its endpoint into `FORM_ENDPOINT` in `src/config.ts`.
