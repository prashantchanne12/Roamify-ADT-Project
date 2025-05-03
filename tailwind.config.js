/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F4F5',
          100: '#C2E4E7',
          200: '#9ED3D9',
          300: '#7AC2CB',
          400: '#56B1BD',
          500: '#0B7285', // Main primary color
          600: '#096474',
          700: '#075563',
          800: '#054652',
          900: '#043741',
        },
        secondary: {
          50: '#FCF0F0',
          100: '#F9DBDC',
          200: '#F0B4B6',
          300: '#E88D90',
          400: '#DF666A',
          500: '#C25E5E', // Main secondary color
          600: '#A94A4A',
          700: '#8F3737',
          800: '#762424',
          900: '#5C1111',
        },
        accent: {
          50: '#FFF8E6',
          100: '#FFEFC0',
          200: '#FFE599',
          300: '#FFDB73',
          400: '#FFD14D',
          500: '#FFC726',
          600: '#EBAC00',
          700: '#C49000',
          800: '#9D7300',
          900: '#755700',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};