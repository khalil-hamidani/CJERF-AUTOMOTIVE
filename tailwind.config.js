/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cjerf-black': '#070709',
        'cjerf-carbon': '#0D0E13',
        'cjerf-surface': '#13141B',
        'cjerf-card': '#161822',
        'cjerf-border': '#222533',
        'cjerf-border-hover': '#383C52',
        'cjerf-titanium': '#8B90A0',
        'cjerf-red': '#FF1E27',
        'cjerf-red-glow': 'rgba(255, 30, 39, 0.35)',
        'cjerf-red-dark': '#B30B12',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'red-laser': '0 0 25px rgba(255, 30, 39, 0.45)',
        'red-subtle': '0 0 15px rgba(255, 30, 39, 0.2)',
        'carbon-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0,0,0,0.8)',
      },
      animation: {
        'laser-sweep': 'laserSweep 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-scroll': 'gridScroll 20s linear infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        laserSweep: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0.2' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        gridScroll: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        }
      }
    },
  },
  plugins: [],
}
