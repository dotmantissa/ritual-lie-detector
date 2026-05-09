import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0c0c0f",
        surface: "#141418",
        card: "#1a1a20",
        line: "rgba(255,255,255,0.08)",
        text: "#f0ece0",
        muted: "#6b6b72",
        truth: "#22c55e",
        lie: "#ef4444",
        amber: "#f59e0b",
        ritual: "#2d6a3f"
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
