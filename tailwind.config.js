const { addDynamicIconSelectors } = require('@iconify/tailwind');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [addDynamicIconSelectors(),],
  corePlugins: {
    preflight: false,
  }
}