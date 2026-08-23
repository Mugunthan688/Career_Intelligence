/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Dark Backgrounds ─────────────────── */
        'bg-void':     '#060709',
        'bg-base':     '#08090E',
        'bg-surface':  '#0D0F18',
        'bg-card':     '#111420',
        'bg-elevated': '#1C2030',

        /* ── Aurora Accents ───────────────────── */
        'aurora-teal':    '#2DD4BF',
        'aurora-violet':  '#A78BFA',
        'aurora-rose':    '#FB7185',
        'aurora-amber':   '#FBBF24',
        'aurora-emerald': '#34D399',
        'aurora-blue':    '#60A5FA',

        /* ── Legacy aliases ───────────────────── */
        'neon-purple': '#A78BFA',
        'neon-violet': '#A78BFA',
        'neon-cyan':   '#2DD4BF',
        'neon-green':  '#34D399',
        'neon-pink':   '#FB7185',
        'neon-amber':  '#FBBF24',

        /* ── Text ─────────────────────────────── */
        'txt-base': '#F8FAFC',
        'txt-mid':  '#94A3B8',
        'txt-dim':  '#475569',
      },

      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        body:  ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },

      borderRadius: {
        'bento': '20px',
        'card':  '16px',
        'pill':  '999px',
      },

      boxShadow: {
        'aurora-sm': '0 0 14px rgba(167,139,250,0.20)',
        'aurora-md': '0 0 28px rgba(167,139,250,0.28), 0 0 60px rgba(167,139,250,0.08)',
        'teal-sm':   '0 0 14px rgba(45,212,191,0.22)',
        'teal-md':   '0 0 28px rgba(45,212,191,0.28)',
        'green-sm':  '0 0 12px rgba(52,211,153,0.25)',
        'rose-sm':   '0 0 12px rgba(251,113,133,0.22)',
        'card':      '0 4px 24px rgba(0,0,0,0.45)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(167,139,250,0.12)',
        'bento':     '0 2px 16px rgba(0,0,0,0.35)',
        'bento-hover':'0 12px 40px rgba(0,0,0,0.5)',
      },

      animation: {
        'aurora-shift': 'aurora-shift 6s ease infinite',
        'soft-pulse':   'soft-pulse 2.5s ease-in-out infinite',
        'shimmer-flow': 'shimmer-flow 2.5s linear infinite',
        'fade-up':      'fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':     'scale-in 0.35s ease-out both',
        'float':        'float 3.5s ease-in-out infinite',
        'glow-pulse':   'glow-pulse 2.5s ease-in-out infinite',
        'spin-slow':    'spin 12s linear infinite',
        'slide-right':  'slide-right 0.4s ease-out both',
        'node-pulse':   'node-pulse 2s ease-in-out infinite',
      },

      keyframes: {
        'aurora-shift': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'soft-pulse': {
          '0%,100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%':     { opacity: '0.5', transform: 'scale(1.2)' },
        },
        'shimmer-flow': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-7px)' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        'slide-right': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'node-pulse': {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%':     { transform: 'scale(1.1)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}