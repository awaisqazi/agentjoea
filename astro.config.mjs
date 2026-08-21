// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// DEPLOY_BASE / DEPLOY_SITE are set by the GitHub Actions workflow so the site
// works at https://<user>.github.io/<repo>/ out of the box. Once the custom
// domain (agentjoea.com) is pointed at GitHub Pages, remove those env lines
// from .github/workflows/deploy.yml and this falls back to the root domain.
const site = process.env.DEPLOY_SITE || 'https://agentjoea.com';
const base = process.env.DEPLOY_BASE || undefined;

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  // Old Webflow URLs → new structure, so existing links and SEO keep working
  // once the domain points here.
  redirects: {
    '/about-me': '/about/',
    '/blog-news': '/blog/',
    '/private-policy': '/privacy-policy/',
    '/case-study-properties/[slug]': '/properties/[slug]',
    '/post/[slug]': '/blog/[slug]',
  },
});
