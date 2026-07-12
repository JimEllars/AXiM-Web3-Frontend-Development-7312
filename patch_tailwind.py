import re

config = """/** @type {import('tailwindcss').Config} */
import { theme as siteTheme } from './src/config/theme.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'onyx': {
          500: '#1c1c1e'
        },
        'axim-purple': '#7D00FF',
        'axim-gold': '#F0FF00',
        'axim-green': '#00FF00',
        'axim-deep': '#120025',
        'bg-void': '#050505',
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
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      typography: (theme) => ({
        axim: {
          css: {
            '--tw-prose-body': '#d4d4d8',
            '--tw-prose-quote-borders': '#F0FF00',
            code: {
              color: '#d4d4d8',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              lineHeight: '1rem',
              fontFamily: theme('fontFamily.mono').join(', '),
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#030303',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '0.125rem',
              fontFamily: theme('fontFamily.mono').join(', '),
              fontSize: '0.75rem',
              lineHeight: '1rem',
              overflowX: 'auto',
              color: '#e4e4e7',
              marginBottom: '1.5rem',
            },
            blockquote: {
              borderLeftWidth: '2px',
              borderLeftColor: theme('colors.axim-purple'),
              backgroundImage: 'linear-gradient(to right, rgba(125, 0, 255, 0.05), transparent)',
              paddingLeft: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              fontStyle: 'italic',
              fontWeight: '500',
              color: '#e4e4e7',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'h2, h3, h4': {
              fontWeight: '900',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
          }
        }
      })
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
"""

with open("tailwind.config.js", "w") as f:
    f.write(config)

print("tailwind patched")
