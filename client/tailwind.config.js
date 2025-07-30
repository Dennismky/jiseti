/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jiseti Brand Colors (maintaining existing theme)
        primary: {
          50: 'hsl(163, 100%, 95%)',
          100: 'hsl(163, 100%, 85%)',
          200: 'hsl(163, 100%, 75%)',
          300: 'hsl(163, 100%, 65%)',
          400: 'hsl(163, 100%, 55%)',
          500: 'hsl(163, 100%, 40%)', // Main brand color
          600: 'hsl(163, 100%, 30%)',
          700: 'hsl(163, 100%, 25%)',
          800: 'hsl(163, 100%, 19%)', // Dark brand color
          900: 'hsl(163, 100%, 15%)',
        },
        secondary: {
          50: 'hsl(145, 33%, 95%)',
          100: 'hsl(145, 33%, 85%)',
          500: 'hsl(145, 33%, 50%)',
          600: 'hsl(145, 33%, 28%)',
          700: 'hsl(145, 33%, 22%)',
        },
        accent: {
          500: 'hsl(25, 95%, 55%)', // Orange accent
        },
        // Status Colors
        status: {
          draft: 'hsl(210, 20%, 50%)',
          investigating: 'hsl(200, 80%, 50%)',
          resolved: 'hsl(145, 60%, 45%)',
          rejected: 'hsl(0, 75%, 55%)',
          pending: 'hsl(45, 95%, 60%)',
        },
        // Utility Colors
        background: 'hsl(220, 15%, 97%)',
        foreground: 'hsl(215, 25%, 15%)',
        muted: 'hsl(210, 40%, 96%)',
        border: 'hsl(214, 32%, 91%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
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
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}