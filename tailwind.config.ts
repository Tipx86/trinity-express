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
        trinity: {
          blue: {
            HEADER: '#81A9D0',
            HEADER_DARK: '#6B99C4',
            NAVY: '#0C2340',
            OCEAN: '#0072C6',
            OCEAN_HOVER: '#005FA5',
            ACCENT: '#3A9AD9',
            BG_LIGHT: '#F4F7FA',
          },
          navy: {
            950: '#070F1E',
            900: '#0C2340',
            800: '#15305B',
          },
          emerald: {
            600: '#059669',
            500: '#10B981',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
