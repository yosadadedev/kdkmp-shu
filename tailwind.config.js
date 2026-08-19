/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '390px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        sm: '16px',
      },
      screens: {
        sm: '390px',
        md: '390px',
        lg: '390px',
        xl: '390px',
      },
    },
    extend: {
      colors: {
        // Brand Merah Putih KDKMP
        brand: {
          50: '#FFF5F6',
          100: '#FFEBEE',
          200: '#FFCDD2',
          300: '#EF9A9A',
          400: '#E57373',
          500: '#C8102E',
          600: '#B41025',
          700: '#9E0D20',
          800: '#7E0A1A',
          900: '#5C0713',
        },
        surface: {
          DEFAULT: '#FAFAFA',
          raised: '#FFFFFF',
          muted: '#F5F5F5',
          disabled: '#EEEEEE',
        },
        text: {
          DEFAULT: '#212121',
          body: '#424242',
          muted: '#757575',
          inverted: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E0E0E0',
          light: '#F0F0F0',
          focus: '#1976D2',
          brand: '#C8102E',
        },
        link: {
          DEFAULT: '#1976D2',
          hover: '#115293',
        },
        success: {
          DEFAULT: '#4CAF50',
          soft: '#E8F5E9',
          text: '#2E7D32',
        },
        warning: {
          DEFAULT: '#FF9800',
          soft: '#FFF3E0',
          text: '#E65100',
        },
        danger: {
          DEFAULT: '#D32F2F',
          soft: '#FFEBEE',
          text: '#B71C1C',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
        pop: '0 8px 24px rgba(0, 0, 0, 0.08)',
        focus: '0 0 0 3px rgba(25, 118, 210, 0.15)',
        brandFocus: '0 0 0 3px rgba(200, 16, 46, 0.18)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '26px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      keyframes: {
        'shake-x': {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-6px)' },
          '40%,80%': { transform: 'translateX(6px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-pop': {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '60%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'countdown-pulse': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'shake-x': 'shake-x 0.38s ease-in-out',
        'fade-in': 'fade-in 0.24s ease-out',
        'slide-up': 'slide-up 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'scale-pop': 'scale-pop 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'countdown-pulse': 'countdown-pulse 1.2s ease-in-out infinite',
        'skeleton-shimmer': 'skeleton-shimmer 1.2s linear infinite',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom, 0px)',
      },
    },
  },
  plugins: [],
}
