/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#8ba2d7",
        secondary: "#c2cee9",
        tint: "#e7e6e5" /* off-white */,
        ahb_primary: "#EBBEC1",
        ahb_secondary: "#F4E0E1",
        bedingungsbaum_primary: "#E5BD5C",
        bedingungsbaum_secondary: "#F4E2B9",
        ebd_primary: "#8BA2D7",
        ebd_secondary: "#C2CEE9",
        fristenkalender_primary: "#ABDCD3",
        fristenkalender_secondary: "#D4EDE8",
      },
    },
  },
  plugins: [],
};
