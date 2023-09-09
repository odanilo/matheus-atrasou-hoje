import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        artistic: ["ziclets", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        border: "inset 0 0 0 2px",
        underline: "inset 0px -4px 0px 0 red",
      },
    },
  },
  plugins: [],
} satisfies Config;
