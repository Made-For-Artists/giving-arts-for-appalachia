import kobalte from '@kobalte/tailwindcss';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import colors from 'tailwindcss/colors.js';
import { fontFamily } from 'tailwindcss/defaultTheme.js';
import plugin from 'tailwindcss/plugin.js';

export default {
    content: ['./src/**/*.{astro,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter Variable', ...fontFamily.sans],
            },
            colors: {
                theme: {
                    base: colors.slate,
                },
                'gafa-orange': '#aa7338',
                'gafa-gray': '#4d514a',
                'gafa-light-gray': '#76807a',
                'gafa-sand': '#ece1cd',
            },
            typography: ({ theme }) => ({
                gafacolors: {
                    css: {
                        '--tw-prose-headings': theme('colors.gafa-gray')
                    }
                }
            })
        },
    },
    plugins: [
        animate,
        kobalte,
        typography,
        plugin(function customStyles(api) {
            api.addUtilities({
                '.grid-center': {
                    display: 'grid',
                    'place-items': 'center',
                    'place-content': 'center',
                },
            });
        }),
    ],
    corePlugins: {
        container: false,
    },
} satisfies Config;
