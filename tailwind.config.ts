import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF5EA",
        raphia: {
          DEFAULT: "#8A5A2B",
          dark: "#6E451F",
          light: "#B08050",
        },
        forest: {
          DEFAULT: "#2F4A3A",
          dark: "#22382B",
          light: "#4A6B55",
        },
        ocre: {
          DEFAULT: "#D9A441",
          dark: "#B58430",
        },
        ink: "#3A2E1F",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      minHeight: {
        hero: "60vh",
      },
    },
  },
  plugins: [],
};

export default config;
