import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B2447',
          dark: '#06162d',
          light: '#1b3b6b',
          soft: '#f0f4f8',
        },
        gold: {
          DEFAULT: '#B8955F',
          dark: '#927546',
          light: '#d1b687',
        },
        slate: {
          950: '#020617',
        },
      },
      boxShadow: {
        glow: '0 20px 50px rgba(11, 36, 71, 0.18)',
        soft: '0 20px 40px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        'primary-gradient': 'linear-gradient(135deg, #0B2447 0%, #1b3b6b 55%, #06162d 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(240,244,248,0.98) 0%, rgba(255,255,255,1) 100%)',
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
