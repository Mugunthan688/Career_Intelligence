/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Backgrounds ──────────────────── */
        'bg-base':     '#07090F',
        'bg-surface':  '#0C0F1A',
        'bg-card':     '#0F1221',
        'bg-elevated': '#141828',

        /* ── Brand / Neon ─────────────────── */
        'neon-purple': '#B06EFF',
        'neon-violet': '#8B5CF6',
        'neon-cyan':   '#22D3EE',
        'neon-green':  '#10B981',
        'neon-pink':   '#EC4899',
        'neon-amber':  '#F59E0B',

        /* ── Borders ──────────────────────── */
        'border-dim':  'rgba(176,110,255,0.12)',
        'border-mid':  'rgba(176,110,255,0.25)',
        'border-bright':'rgba(176,110,255,0.5)',

        /* ── Text ─────────────────────────── */
        'txt-base': '#F0F2FF',
        'txt-mid':  '#8892B0',
        'txt-dim':  '#3D4A6B',
      },

      fontFamily: {
        space: ['"Space Grotesk"',  'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace' ],
        body:  ['Inter',            'sans-serif'],
      },

      boxShadow: {
        'neon-sm':  '0 0 12px rgba(176,110,255,0.35)',
        'neon-md':  '0 0 24px rgba(176,110,255,0.45), 0 0 60px rgba(176,110,255,0.1)',
        'neon-lg':  '0 0 40px rgba(176,110,255,0.55), 0 0 80px rgba(176,110,255,0.15)',
        'cyan-sm':  '0 0 12px rgba(34,211,238,0.35)',
        'cyan-md':  '0 0 24px rgba(34,211,238,0.45)',
        'green-sm': '0 0 12px rgba(16,185,129,0.4)',
        'card':     '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover':'0 8px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(176,110,255,0.2)',
      },

      animation: {
        'spin-slow':      'spin 12s linear infinite',
        'spin-reverse':   'spin-reverse 9s linear infinite',
        'node-pulse':     'node-pulse 2s ease-in-out infinite',
        'float':          'float 3.5s ease-in-out infinite',
        'scan':           'scan 3.5s linear infinite',
        'shimmer':        'shimmer 3s linear infinite',
        'glitch':         'glitch 5s linear infinite',
        'blink':          'blink 1s step-end infinite',
        'glow-pulse':     'glow-pulse 2.5s ease-in-out infinite',
        'data-flow':      'data-flow 1.8s ease-in-out infinite',
        'fade-up':        'fade-up 0.45s ease-out both',
        'scale-in':       'scale-in 0.35s ease-out both',
        'slide-right':    'slide-right 0.4s ease-out both',
        'orbit':          'orbit 8s linear infinite',
      },

      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)'   },
        },
        'node-pulse': {
          '0%,100%': { transform:'scale(1)',    opacity:'1'   },
          '50%':     { transform:'scale(1.12)', opacity:'0.8' },
        },
        'float': {
          '0%,100%': { transform:'translateY(0px)' },
          '50%':     { transform:'translateY(-8px)' },
        },
        'scan': {
          '0%':   { top:'0%',   opacity:'0' },
          '4%':   { opacity:'1' },
          '96%':  { opacity:'1' },
          '100%': { top:'100%', opacity:'0' },
        },
        'shimmer': {
          '0%':   { backgroundPosition:'-300% center' },
          '100%': { backgroundPosition: '300% center' },
        },
        'glitch': {
          '0%,86%,100%': { opacity:'0', transform:'translate(0)' },
          '88%': { opacity:'0.8', transform:'translate(-3px, 1px)' },
          '90%': { opacity:'0.8', transform:'translate(3px, -1px)' },
          '92%': { opacity:'0.8', transform:'translate(-2px, 2px)' },
          '94%': { opacity:'0'   },
        },
        'blink': {
          '0%,100%': { opacity:'1' },
          '50%':     { opacity:'0' },
        },
        'glow-pulse': {
          '0%,100%': { opacity:'0.6' },
          '50%':     { opacity:'1'   },
        },
        'data-flow': {
          '0%':   { transform:'translateX(-100%)', opacity:'0' },
          '35%':  { opacity:'1' },
          '100%': { transform:'translateX(400%)',  opacity:'0' },
        },
        'fade-up': {
          from: { opacity:'0', transform:'translateY(14px)' },
          to:   { opacity:'1', transform:'translateY(0)'    },
        },
        'scale-in': {
          from: { opacity:'0', transform:'scale(0.94)' },
          to:   { opacity:'1', transform:'scale(1)'    },
        },
        'slide-right': {
          from: { opacity:'0', transform:'translateX(-14px)' },
          to:   { opacity:'1', transform:'translateX(0)'     },
        },
        'orbit': {
          from: { transform:'rotate(0deg) translateX(100px) rotate(0deg)'     },
          to:   { transform:'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}