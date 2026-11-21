/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070B14',
          900: '#0B1220',
          850: '#0E1628',
          800: '#131F36',
          700: '#1C2C4A',
        },
        accent: {
          blue: '#38BDF8',
          violet: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(56, 189, 248, 0.15)',
        'glow-violet': '0 0 24px rgba(139, 92, 246, 0.18)',
      },
    },
  },
  plugins: [],
};
