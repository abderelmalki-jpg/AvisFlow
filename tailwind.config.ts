import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Firebase Studio dark theme
        fb: {
          bg:       "#0F0F11",   // page background
          surface:  "#1A1A1F",   // card / panel
          surface2: "#242429",   // hover / elevated surface
          border:   "#2E2E38",   // borders
          text:     "#F0F0F5",   // primary text
          muted:    "#8A8A9A",   // secondary text
          dim:      "#4A4A5A",   // disabled / placeholder
        },
        sidebar: {
          bg:     "#0A0A0D",
          hover:  "#1A1A1F",
          active: "#1F1B14",     // warm dark when active
          border: "#1E1E26",
          text:   "#8A8A9A",
          "text-active": "#F0F0F5",
        },
        // Firebase orange
        brand: {
          50:  "#FFF3E0",
          100: "#FFE0B2",
          400: "#FFA726",
          500: "#FF6D00",
          600: "#E65100",
          700: "#BF360C",
        },
        surface: "#1A1A1F",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        card:       "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
        "card-hover":"0 4px 12px 0 rgb(0 0 0 / 0.5)",
        orange:     "0 0 0 3px rgb(255 109 0 / 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
