import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A6B',
          light: '#FFB4A2',
          dark: '#E6645A',
        },
        secondary: {
          DEFAULT: '#FFB4A2',
        },
        accent: {
          DEFAULT: '#F4A261',
          light: '#F9C894',
          dark: '#E68E4E',
        },
        cream: {
          DEFAULT: '#FFFBF7',
          dark: '#FFF5F0',
        },
        navy: {
          DEFAULT: '#2B2D42',
          light: '#8D99AE',
        },
      },
      fontFamily: {
        script: ['var(--font-great-vibes)', 'cursive'],
        display: ['var(--font-montserrat)', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'arial'],
      },
    },
  },
  plugins: [],
} satisfies Config;
