/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gradientColorStops: theme => ({
        'indigo-50': '#EEF2FF',
        'blue-100': '#DBEAFE',
      }),
    },
  },
  plugins: [],
};
