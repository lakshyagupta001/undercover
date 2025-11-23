import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        base: {
          DEFAULT: "#121212",
          light: "#1A1A1A",
          dark: "#0A0A0A",
        },
        // Surface/UI element colors
        surface: {
          DEFAULT: "#2B2E32",
          light: "#363A3F",
          dark: "#1F2225",
          elevated: "#323639",
        },
        // Accent color (Crimson Red)
        accent: {
          DEFAULT: "#9A1B1B",
          light: "#B82828",
          dark: "#7A1515",
        },
        // Text colors (Ivory)
        ivory: {
          DEFAULT: "#F5F5F5",
          muted: "#E0E0E0",
          soft: "#BDBDBD",
          dim: "#9E9E9E",
          faint: "#757575",
        },
        // Special/Gold colors
        gold: {
          DEFAULT: "#C2A469",
          light: "#D4BB85",
          dark: "#A08550",
        },
        // Role-specific colors
        civilian: {
          DEFAULT: "#4A6FA5",
          light: "#5B85C2",
          dark: "#3A5A87",
        },
        undercover: {
          DEFAULT: "#9A1B1B",
          light: "#B82828",
          dark: "#7A1515",
        },
        mrwhite: {
          DEFAULT: "#C2A469",
          light: "#D4BB85",
          dark: "#A08550",
        },
        // State colors
        success: {
          DEFAULT: "#2E7D4A",
          light: "#3D9960",
        },
        warning: {
          DEFAULT: "#B8860B",
          light: "#DAA520",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "pulse-crimson": "pulseCrimson 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(154, 27, 27, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(154, 27, 27, 0.8)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(194, 164, 105, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(194, 164, 105, 0.8)" },
        },
        pulseCrimson: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(154, 27, 27, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(154, 27, 27, 0.8)" },
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #9A1B1B 0%, #7A1515 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #2B2E32 0%, #1F2225 100%)",
        "gradient-civilian":
          "linear-gradient(135deg, #4A6FA5 0%, #3A5A87 100%)",
        "gradient-undercover":
          "linear-gradient(135deg, #9A1B1B 0%, #7A1515 100%)",
        "gradient-mrwhite": "linear-gradient(135deg, #C2A469 0%, #A08550 100%)",
        "gradient-gold": "linear-gradient(135deg, #C2A469 0%, #A08550 100%)",
        "gradient-dark": "linear-gradient(135deg, #1A1A1A 0%, #121212 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
