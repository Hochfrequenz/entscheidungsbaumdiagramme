/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#8ba2d7",
        secondary: "#c2cee9",
        tertiary: "#e7e6e5", /* off-white */
      },
    },
  },
  plugins: [],
};
