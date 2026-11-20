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
          50: '#FDFCFB',
          100: '#FAF7F2', // Warm Alabaster / Silk Ivory primary background
          200: '#F4EFE6',
          300: '#E8E0D5', // Warm subtle borders
          400: '#D9CFC1',
          500: '#C7BBAA',
        },
        espresso: {
          800: '#2C2723',
          900: '#1E1B18', // Deep Espresso Charcoal primary text and dark surfaces
          950: '#151311',
        },
        champagne: {
          50: '#FAF6F0',
          100: '#F5ECDF',
          200: '#EBD8C1',
          300: '#DEC2A0',
          400: '#D2AC7F',
          500: '#C59B6D', // Burnished Champagne Gold accent
          600: '#B08453',
          700: '#8E673B',
          800: '#6E4E2C',
        },
        rose: {
          300: '#DBA2AA',
          400: '#CA848F',
          500: '#B86B77', // Muted Terracotta Rose secondary accent
          600: '#9E535E',
          700: '#7F3D47',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 27, 24, 0.05)',
        'luxury': '0 12px 36px -4px rgba(30, 27, 24, 0.08)',
        'luxury-hover': '0 20px 45px -4px rgba(30, 27, 24, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
