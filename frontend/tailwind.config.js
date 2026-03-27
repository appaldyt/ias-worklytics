/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        app: '#F5F7FF',
        surface: '#FFFFFF',
        soft: '#E9ECF5',
        primaryText: '#111827',
        secondaryText: '#6B7280',
        brand: {
          500: '#2F5BFF',
          600: '#204BEB',
          soft: '#EEF3FF',
        },
      }
    },
  },
  plugins: [],
}

