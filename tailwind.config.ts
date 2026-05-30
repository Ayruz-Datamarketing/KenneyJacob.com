import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        accent: "#b91c1c",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            a: { color: "#b91c1c", textDecoration: "none" },
            "a:hover": { textDecoration: "underline" },
            img: { borderRadius: "0.375rem" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
