module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'dark-primary': '#1a202c',
        'dark-secondary': '#2d3748',
        highlight: '#00bcd4',
      },
    },
  },
  plugins: [],
};
