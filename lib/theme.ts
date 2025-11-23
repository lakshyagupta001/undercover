/**
 * Centralized Theme Configuration for Undercover Game
 *
 * Color Palette:
 * - Charcoal Black (#121212) – base background
 * - Gunmetal Gray (#2B2E32) – UI elements, cards
 * - Crimson Red (#9A1B1B) – highlights, danger cues, undercover
 * - Ivory White (#F5F5F5) – text
 * - Muted Gold (#C2A469) – special roles, premium UI, Mr. White
 */

export const theme = {
  colors: {
    // Base colors
    base: {
      charcoal: "#121212",
      charcoalLight: "#1A1A1A",
      charcoalDark: "#0A0A0A",
    },

    // UI Element colors
    surface: {
      gunmetal: "#2B2E32",
      gunmetalLight: "#363A3F",
      gunmetalDark: "#1F2225",
      elevated: "#323639",
    },

    // Accent colors
    accent: {
      crimson: "#9A1B1B",
      crimsonLight: "#B82828",
      crimsonDark: "#7A1515",
      crimsonGlow: "rgba(154, 27, 27, 0.5)",
    },

    // Text colors
    text: {
      ivory: "#F5F5F5",
      ivoryMuted: "#E0E0E0",
      ivorySoft: "#BDBDBD",
      ivoryDim: "#9E9E9E",
      ivoryFaint: "#757575",
    },

    // Special/Premium colors
    special: {
      gold: "#C2A469",
      goldLight: "#D4BB85",
      goldDark: "#A08550",
      goldGlow: "rgba(194, 164, 105, 0.5)",
    },

    // Role-specific colors
    roles: {
      civilian: {
        primary: "#4A6FA5",
        light: "#5B85C2",
        dark: "#3A5A87",
        glow: "rgba(74, 111, 165, 0.5)",
      },
      undercover: {
        primary: "#9A1B1B",
        light: "#B82828",
        dark: "#7A1515",
        glow: "rgba(154, 27, 27, 0.5)",
      },
      mrwhite: {
        primary: "#C2A469",
        light: "#D4BB85",
        dark: "#A08550",
        glow: "rgba(194, 164, 105, 0.5)",
      },
    },

    // State colors
    state: {
      success: "#2E7D4A",
      successLight: "#3D9960",
      warning: "#B8860B",
      warningLight: "#DAA520",
      error: "#9A1B1B",
      errorLight: "#B82828",
      info: "#4A6FA5",
      infoLight: "#5B85C2",
    },
  },

  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #9A1B1B 0%, #7A1515 100%)",
    secondary: "linear-gradient(135deg, #2B2E32 0%, #1F2225 100%)",
    civilian: "linear-gradient(135deg, #4A6FA5 0%, #3A5A87 100%)",
    undercover: "linear-gradient(135deg, #9A1B1B 0%, #7A1515 100%)",
    mrwhite: "linear-gradient(135deg, #C2A469 0%, #A08550 100%)",
    gold: "linear-gradient(135deg, #C2A469 0%, #A08550 100%)",
    dark: "linear-gradient(135deg, #1A1A1A 0%, #121212 100%)",
    background:
      "linear-gradient(135deg, #121212 0%, #1A1A1A 50%, #121212 100%)",
    card: "linear-gradient(135deg, rgba(43, 46, 50, 0.8) 0%, rgba(31, 34, 37, 0.8) 100%)",
    highlight:
      "linear-gradient(135deg, rgba(154, 27, 27, 0.2) 0%, rgba(122, 21, 21, 0.2) 100%)",
    goldHighlight:
      "linear-gradient(135deg, rgba(194, 164, 105, 0.2) 0%, rgba(160, 133, 80, 0.2) 100%)",
  },

  // Glass effect styles
  glass: {
    background: "rgba(43, 46, 50, 0.6)",
    backgroundDark: "rgba(18, 18, 18, 0.8)",
    border: "rgba(245, 245, 245, 0.1)",
    borderLight: "rgba(245, 245, 245, 0.15)",
  },

  // Shadows
  shadows: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.3)",
    md: "0 4px 8px rgba(0, 0, 0, 0.4)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.5)",
    xl: "0 12px 24px rgba(0, 0, 0, 0.6)",
    glow: {
      crimson: "0 0 20px rgba(154, 27, 27, 0.5)",
      gold: "0 0 20px rgba(194, 164, 105, 0.5)",
      civilian: "0 0 20px rgba(74, 111, 165, 0.5)",
    },
  },
} as const;

// CSS Custom Properties for use in globals.css
export const cssVariables = `
  --color-base: ${theme.colors.base.charcoal};
  --color-base-light: ${theme.colors.base.charcoalLight};
  --color-base-dark: ${theme.colors.base.charcoalDark};
  
  --color-surface: ${theme.colors.surface.gunmetal};
  --color-surface-light: ${theme.colors.surface.gunmetalLight};
  --color-surface-dark: ${theme.colors.surface.gunmetalDark};
  --color-surface-elevated: ${theme.colors.surface.elevated};
  
  --color-accent: ${theme.colors.accent.crimson};
  --color-accent-light: ${theme.colors.accent.crimsonLight};
  --color-accent-dark: ${theme.colors.accent.crimsonDark};
  
  --color-text: ${theme.colors.text.ivory};
  --color-text-muted: ${theme.colors.text.ivoryMuted};
  --color-text-soft: ${theme.colors.text.ivorySoft};
  --color-text-dim: ${theme.colors.text.ivoryDim};
  --color-text-faint: ${theme.colors.text.ivoryFaint};
  
  --color-special: ${theme.colors.special.gold};
  --color-special-light: ${theme.colors.special.goldLight};
  --color-special-dark: ${theme.colors.special.goldDark};
  
  --color-civilian: ${theme.colors.roles.civilian.primary};
  --color-undercover: ${theme.colors.roles.undercover.primary};
  --color-mrwhite: ${theme.colors.roles.mrwhite.primary};
  
  --color-success: ${theme.colors.state.success};
  --color-warning: ${theme.colors.state.warning};
  --color-error: ${theme.colors.state.error};
  --color-info: ${theme.colors.state.info};
`;

export type Theme = typeof theme;
