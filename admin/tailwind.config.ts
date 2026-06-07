import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        bg: "oklch(var(--bg) / <alpha-value>)",
        surface: "oklch(var(--surface) / <alpha-value>)",
        "surface-2": "oklch(var(--surface-2) / <alpha-value>)",
        border: "oklch(var(--border) / <alpha-value>)",
        muted: "oklch(var(--muted) / <alpha-value>)",
        fg: "oklch(var(--fg) / <alpha-value>)",
        "fg-muted": "oklch(var(--fg-muted) / <alpha-value>)",
        accent: "oklch(var(--accent) / <alpha-value>)",
        "accent-fg": "oklch(var(--accent-fg) / <alpha-value>)",
        success: "oklch(var(--success) / <alpha-value>)",
        warn: "oklch(var(--warn) / <alpha-value>)",
        danger: "oklch(var(--danger) / <alpha-value>)",
        info: "oklch(var(--info) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
        xs: ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.02em" }],
        sm: ["0.8125rem", { lineHeight: "1.15rem" }],
        base: ["0.9375rem", { lineHeight: "1.4rem" }],
        md: ["1rem", { lineHeight: "1.55rem" }],
        lg: ["1.125rem", { lineHeight: "1.6rem" }],
        xl: ["1.375rem", { lineHeight: "1.7rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.75rem", { lineHeight: "2.05rem", letterSpacing: "-0.02em" }],
        "3xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
        "4xl": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "5xl": ["4rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "14px",
        "2xl": "20px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-in": "fade-in 280ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-up": "fade-up 360ms cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
