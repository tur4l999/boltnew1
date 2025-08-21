// Auto-generated from design/tokens.json
// Do not edit directly - run npm run tokens to regenerate

export const theme = {
  "$schema": "https://example.com/dda-tokens.schema.json",
  "colors": {
    "primary": {
      "50": "#f0fdf4",
      "100": "#dcfce7",
      "200": "#bbf7d0",
      "300": "#86efac",
      "400": "#4ade80",
      "500": "#22c55e",
      "600": "#16a34a",
      "700": "#15803d",
      "800": "#166534",
      "900": "#14532d"
    },
    "gray": {
      "50": "#f9fafb",
      "100": "#f3f4f6",
      "200": "#e5e7eb",
      "300": "#d1d5db",
      "400": "#9ca3af",
      "500": "#6b7280",
      "600": "#4b5563",
      "700": "#374151",
      "800": "#1f2937",
      "900": "#111827"
    },
    "emerald": {
      "50": "#ecfdf5",
      "100": "#d1fae5",
      "200": "#a7f3d0",
      "300": "#6ee7b7",
      "400": "#34d399",
      "500": "#10b981",
      "600": "#059669",
      "700": "#047857",
      "800": "#065f46",
      "900": "#064e3b"
    },
    "red": {
      "50": "#fef2f2",
      "100": "#fee2e2",
      "200": "#fecaca",
      "300": "#fca5a5",
      "400": "#f87171",
      "500": "#ef4444",
      "600": "#dc2626",
      "700": "#b91c1c",
      "800": "#991b1b",
      "900": "#7f1d1d"
    },
    "semantic": {
      "background": "#f9fafb",
      "surface": "#ffffff",
      "text": {
        "primary": "#111827",
        "secondary": "#6b7280",
        "muted": "#9ca3af"
      },
      "border": "#e5e7eb",
      "success": "#10b981",
      "warning": "#f59e0b",
      "error": "#ef4444"
    }
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20,
    "2xl": 24,
    "3xl": 32,
    "4xl": 40,
    "5xl": 48
  },
  "typography": {
    "fontFamily": {
      "primary": "system-ui, -apple-system, sans-serif"
    },
    "fontSize": {
      "xs": 12,
      "sm": 14,
      "base": 16,
      "lg": 18,
      "xl": 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "black": "900"
    },
    "lineHeight": {
      "tight": "1.2",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "borderRadius": {
    "none": 0,
    "sm": 4,
    "md": 8,
    "lg": 12,
    "xl": 16,
    "2xl": 20,
    "full": 9999
  },
  "shadows": {
    "sm": {
      "shadowColor": "#000",
      "shadowOffset": {
        "width": 0,
        "height": 1
      },
      "shadowOpacity": 0.05,
      "shadowRadius": 2,
      "elevation": 1
    },
    "md": {
      "shadowColor": "#000",
      "shadowOffset": {
        "width": 0,
        "height": 4
      },
      "shadowOpacity": 0.1,
      "shadowRadius": 6,
      "elevation": 3
    },
    "lg": {
      "shadowColor": "#000",
      "shadowOffset": {
        "width": 0,
        "height": 10
      },
      "shadowOpacity": 0.1,
      "shadowRadius": 15,
      "elevation": 6
    },
    "xl": {
      "shadowColor": "#000",
      "shadowOffset": {
        "width": 0,
        "height": 20
      },
      "shadowOpacity": 0.1,
      "shadowRadius": 25,
      "elevation": 10
    }
  },
  "breakpoints": {
    "mobile": 320,
    "tablet": 768,
    "desktop": 1024
  }
} as const;

export type Theme = typeof theme;
export type ColorScale = keyof typeof theme.colors.primary;
export type SpacingScale = keyof typeof theme.spacing;
export type FontSize = keyof typeof theme.typography.fontSize;