/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F17",
        glassCard: "rgba(18, 24, 38, 0.65)",
        glassBorder: "rgba(255, 255, 255, 0.08)",
        brandCyan: "#00F2FE",
        brandBlue: "#4FACFE",
        brandPurple: "#7928CA",
      },
    },
  },
  plugins: [],
}
