/** @type {import('tailwindcss').Config} */
import { theme as siteTheme } from './src/config/theme.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'axim-gold': siteTheme.colors.primary,
        'axim-purple': siteTheme.colors.purple,
        'axim-green': siteTheme.colors.secondary,
        'axim-teal': siteTheme.colors.accent,
        'bg-void': siteTheme.colors.background,
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-hover': 'rgba(255, 255, 255, 0.06)',
      },
      borderColor: {
        'subtle': 'rgba(255, 255, 255, 0.1)',
        'active': 'rgba(255, 255, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
