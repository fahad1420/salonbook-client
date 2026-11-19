import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alabaster: {
          50: '#FCFBF9',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EAE1D7',
          400: '#DDD0C2',
        },
        espresso: {
          800: '#2A2421',
          900: '#1C1917',
          950: '#141210',
        },
        champagne: {
          100: '#F8EFE9',
          200: '#EEDDD4',
          300: '#DCB5A8',
          400: '#CA8E8B',
          500: '#B76E79',
          600: '#A05964',
          700: '#854550',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
