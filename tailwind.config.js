/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studioBg: '#090d16',      // Very deep, rich, low-light background
        studioCard: '#111827',    // Sleek dark gray-blue for cards and panels
        studioCardHover: '#1f2937', // Hover color for cards and panels
        studioBorder: '#1f2937',  // Subtle border lines
        studioTextMuted: '#9ca3af', // Secondary gray text
        studioPrimary: '#6366f1',  // Vibrant Indigo accent
        studioPrimaryHover: '#4f46e5',
        studioSecondary: '#10b981', // Vibrant Emerald for video indicators/success
        studioSecondaryHover: '#059669',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(99, 102, 241, 0.15)',
        'glow-secondary': '0 0 15px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}
