/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6D35E8',
          violet: '#8B5CF6',
          light: '#F3EEFF',
          navy: '#172033',
          muted: '#5E687A',
          bg: '#FFFFFF',
          soft: '#F8F9FD',
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#EF4444',
          border: '#E7E9F0',
        },
        navy: {
          900: '#172033',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
        },
        safety: {
          green: '#16A34A',
          amber: '#F59E0B',
          red: '#EF4444',
          blue: '#6D35E8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 32, 51, 0.05), 0 1px 2px -1px rgba(23, 32, 51, 0.05)',
        'card': '0 4px 20px -2px rgba(23, 32, 51, 0.06), 0 2px 6px -1px rgba(23, 32, 51, 0.03)',
        'hover': '0 12px 30px -4px rgba(109, 53, 232, 0.12), 0 4px 12px -2px rgba(23, 32, 51, 0.04)',
        'purple-glow': '0 0 25px rgba(109, 53, 232, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
