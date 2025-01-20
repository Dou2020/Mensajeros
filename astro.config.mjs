// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://Dou2020.github.io',
  base: 'Mensajeros',
  adapter: node({
    mode: 'standalone'
  }),
  outDir: './dist',  // Asegúrate de que el directorio sea correcto
});