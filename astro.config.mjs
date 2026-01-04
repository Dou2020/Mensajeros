// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import cloudflare from '@astrojs/cloudflare';

//import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  site: 'https://www.iglesiasinai.org',

  //site: 'https://Dou2020.github.io',
  base: '/',

  adapter: cloudflare({
    platformProxy: {enabled: true},
  }),
  image: {
    service: { entrypoint: '@astrojs/image/services/sharp' },
    domains: [
      's3.us-west-2.amazonaws.com',
      'dou2020.github.io', 
      'avatars.githubusercontent.com', 
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ],
  },
});