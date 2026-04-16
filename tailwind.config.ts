import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14B8A6',
          dark: '#0D9488',
          light: '#5EEAD4',
          soft: '#F0FDFA',
        },
        slate: {
          950: '#020617',
        },
      },
      boxShadow: {
        glow: '0 20px 50px rgba(20, 184, 166, 0.18)',
        soft: '0 20px 40px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        'primary-gradient': 'linear-gradient(135deg, #14B8A6 0%, #0D9488 55%, #0F766E 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(240,253,250,0.98) 0%, rgba(255,255,255,1) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
