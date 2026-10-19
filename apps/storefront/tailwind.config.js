const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens. Values live in src/styles/globals.css (:root) as RGB
        // channels so Tailwind opacity modifiers (bg-ink/60) work.
        black: "rgb(var(--color-black) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        bone: "rgb(var(--color-bone) / <alpha-value>)",
        ember: {
          DEFAULT: "rgb(var(--color-ember) / <alpha-value>)",
          deep: "rgb(var(--color-ember-deep) / <alpha-value>)",
        },
      },
      borderRadius: {
        none: "0px",
        // Small square controls only (checkbox).
        base: "4px",
        // Shared component tokens (see "UI components" in CLAUDE.md): every
        // surface (cards, sheets, images) uses `card`, every control (buttons,
        // pills, badges, inputs) uses `control`.
        card: "16px",
        control: "9999px",
      },
      borderColor: {
        // One hairline border for every component.
        hairline: "rgb(var(--color-bone) / 0.1)",
      },
      boxShadow: {
        // Floating glass surfaces (bars, sheets, drawers).
        glass: "0 -8px 32px -12px rgb(var(--color-black) / 0.7)",
        // Floating pills and overlays that hang below their anchor.
        float: "0 8px 32px -12px rgb(var(--color-black) / 0.7)",
      },
      height: {
        // Primary CTA and secondary control heights (both >= 44px tap target).
        control: "52px",
        "control-sm": "44px",
      },
      minHeight: {
        control: "52px",
        "control-sm": "44px",
      },
      transitionDuration: {
        // Motion timing tokens; mirrored for motion/react in src/lib/motion.ts.
        press: "120ms",
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
      },
      fontFamily: {
        sans: [
          "var(--font-satoshi)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Ubuntu",
          "sans-serif",
        ],
      },
      keyframes: {
        // Page fade between routes (common/components/page-fade).
        "page-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Magic UI Marquee (21st.dev). Width of one copy plus the gap.
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        // duration-base + ease-premium; backwards fill so no stacking context stays.
        "page-fade": "page-fade 200ms cubic-bezier(0.22, 1, 0.36, 1) backwards",
      },
    },
  },
  plugins: [],
}
