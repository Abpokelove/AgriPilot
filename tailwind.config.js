/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F6F1",
        surface: "#FFFFFF",
        "surface-subtle": "#F2F1EA",
        "surface-dark": "#161E1B",
        charcoal: {
          DEFAULT: "#111815",
          muted: "#4B5563",
          light: "#6B7280",
        },
        emerald: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#10B981",
          700: "#0D5C46",
          800: "#0A4837",
          900: "#063226",
        },
        brand: {
          primary: "#0D5C46",
          accent: "#059669",
          amber: "#D97706",
          red: "#DC2626",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 4px 12px -2px rgba(17, 24, 21, 0.05), 0 2px 6px -1px rgba(17, 24, 21, 0.03)',
        'floating': '0 12px 32px -4px rgba(13, 92, 70, 0.12), 0 4px 12px -2px rgba(17, 24, 21, 0.06)',
      },
    },
  },
  plugins: [],
}
