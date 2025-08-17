import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg0: "var(--bg-0)",
        bg1: "var(--bg-1)",
        bg2: "var(--bg-2)",
        line: "var(--line)",
        text1: "var(--text-1)",
        text2: "var(--text-2)",
        text3: "var(--text-3)",
        crimson: "var(--crimson)",
        crimsonGlow: "var(--crimson-glow)"
      },
      borderRadius: {
        xl2: "1.25rem" // ~20px
      },
      boxShadow: {
        card: "0 8px 40px rgba(0,0,0,.6)"
      }
    }
  },
  plugins: [],
};

export default config;
