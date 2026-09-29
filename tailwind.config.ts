import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00B4D8', // Cyan
          dark: '#0077B6',
          light: '#90E0EF',
          soft: '#CAF0F8',
        },
        secondary: {
          DEFAULT: '#6C6C70', // Grey from logo
          dark: '#4F4F53',
          light: '#8E8E92',
        },
        slate: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      boxShadow: {
        glow: '0 20px 50px rgba(0, 180, 216, 0.18)',
        soft: '0 20px 40px rgba(17, 24, 39, 0.08)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(0,180,216,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.08) 1px, transparent 1px)',
        'primary-gradient': 'linear-gradient(135deg, #0077B6 0%, #00B4D8 55%, #90E0EF 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(202,240,248,0.98) 0%, rgba(255,255,255,1) 100%)',
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
