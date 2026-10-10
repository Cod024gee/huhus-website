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
        brand: "var(--brand)",
        "brand-deep": "var(--brand-deep)",
        "brand-soft": "var(--brand-soft)",
        ink: "var(--ink)",
        paper: "var(--paper)",
        accent: "var(--accent)",
        heat: "var(--heat)",
        cream: "var(--cream)",
        stone: "var(--stone)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        text: ["var(--font-text)"],
      },
      borderRadius: {
        'brand': '2px',
      }
    },
  },
  plugins: [],
};
export default config;
