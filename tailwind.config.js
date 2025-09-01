/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EF7E71',
        'primary-dark': '#E66B5D',
        'primary-light': '#F29287',
        secondary: '#D4654F',
        'secondary-dark': '#B8543C',
        accent: '#FFE066',
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.6' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 32px rgba(0, 0, 0, 0.06)',
        medium: '0 8px 40px rgba(0, 0, 0, 0.12)',
        hard: '0 20px 60px rgba(0, 0, 0, 0.2)',
        glow: '0 0 40px rgba(239, 126, 113, 0.4)',
        'glow-secondary': '0 0 40px rgba(212, 101, 79, 0.4)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(239, 126, 113, 0.4)' },
          to: {
            boxShadow:
              '0 0 30px rgba(239, 126, 113, 0.8), 0 0 40px rgba(239, 126, 113, 0.6)',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
