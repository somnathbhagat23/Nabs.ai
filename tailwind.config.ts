import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nabs-bg": "#0F0F10",
        "nabs-surface": "#121214",
        "nabs-input": "#1A1A1D",
        "nabs-input-border": "#2A2A2E",
        "nabs-text": "#EDEDED",
        "nabs-muted": "#A1A1AA",
        "nabs-placeholder": "#6B7280",
        "nabs-accent": "#8AB4F8"
      },
      boxShadow: {
        "nabs-input": "0 12px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
