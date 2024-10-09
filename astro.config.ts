import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind({ applyBaseStyles: false }), icon(), solidJs()],

    // Update to your storefront URL
    site: 'https://givingarts.mfa.studio',

    output: 'server',

    vite: {
        build: {
            assetsInlineLimit(filePath) {
                return filePath.endsWith('css');
            },
        },
    },

    image: {
        // Update to your own image domains
        domains: [
            'localhost',
            'givingarts.mfa.studio',
        ],
    },

    adapter: vercel(),
});