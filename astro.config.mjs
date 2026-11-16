import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const publicPaths = new Set([
  '/',
  '/products/',
  '/products/enote/',
  '/products/buildingstore/',
  '/about/',
]);

export default defineConfig({
  output: 'static',
  site: 'https://ezhub.cn',
  integrations: [sitemap({ filter: (page) => publicPaths.has(new URL(page).pathname) })],
});
