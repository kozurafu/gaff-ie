import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gaff: {
          teal: '#0D9488',
          'teal-dark': '#0F766E',
          'teal-light': '#14B8A6',
          gold: '#D97706',
          'gold-light': '#F59E0B',
          slate: '#1E293B',
          'slate-light': '#334155',
          warm: '#FAFAF9',
          'warm-dark': '#F5F5F4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
