import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f6ff",
          100: "#dbeaff",
          200: "#bdd6ff",
          300: "#8fb8ff",
          400: "#5b91ff",
          500: "#3a6dff",
          600: "#2a4fe6",
          700: "#233fb4",
          800: "#1f3690",
          900: "#1d3173",
        },
        ink: {
          50: "#f7f7f8",
          100: "#eeeef1",
          200: "#d9d9df",
          300: "#b8b8c2",
          400: "#8c8c99",
          500: "#6b6b78",
          600: "#52525c",
          700: "#3f3f47",
          800: "#27272e",
          900: "#17171c",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
