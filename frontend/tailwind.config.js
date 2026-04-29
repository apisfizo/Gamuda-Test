/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gamuda: {
          950: "#0a0a0a",
          900: "#1a1a1a",
          800: "#2a2a2a",
          700: "#3a3a3a",
          600: "#4a4a4a",
          500: "#5a5a5a",
          400: "#6a6a6a",
          300: "#7a7a7a",
        },
        accent: {
          vivid: "#FF3333",
          glow: "#FF5555",
          muted: "#CC2222",
          dim: "#991111",
        },
        grid: "rgba(255, 51, 51, 0.05)",
      },
      fontFamily: {
        display: ["'Space Mono'", "monospace"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,51,51,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,51,51,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-sm": "24px 24px",
        "grid-md": "48px 48px",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
        "pulse-amber": "pulseAmber 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseAmber: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,51,51,0)" },
          "50%": { boxShadow: "0 0 0 4px rgba(255,51,51,0.15)" },
        },
      },
    },
  },
  plugins: [],
};
