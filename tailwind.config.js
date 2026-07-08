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
      typography: {
        axim: {
          css: {
            '--tw-prose-body': '#d4d4d8', // text-zinc-300
            '--tw-prose-quote-borders': '#F0FF00', // axim-gold
            blockquote: {
              borderLeftColor: '#F0FF00',
              borderLeftWidth: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '1rem 1.5rem',
              marginTop: '2rem',
              marginBottom: '2rem',
              fontStyle: 'italic',
              fontWeight: '500',
              color: '#ffffff',
              borderTopRightRadius: '0.125rem',
              borderBottomRightRadius: '0.125rem'
            }
          }
        }
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
