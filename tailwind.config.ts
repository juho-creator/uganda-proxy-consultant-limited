import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep engineering blue / graphite — primary structural color.
        ink: {
          50: "#f3f7fa",
          100: "#e1eaf1",
          200: "#c3d3e0",
          300: "#93aec4",
          400: "#63899f",
          500: "#3f6a83",
          600: "#2d5169",
          700: "#213f54",
          800: "#182f40",
          900: "#101f2c",
          950: "#0a1420",
        },
        // Terracotta / ochre — Uganda red-earth accent, used sparingly.
        clay: {
          50: "#fdf4ee",
          100: "#f9e3d3",
          200: "#f1c5a6",
          300: "#e6a279",
          400: "#d67f52",
          500: "#c1622f",
          600: "#a34d23",
          700: "#813c1c",
          800: "#622e18",
          900: "#452113",
          950: "#2b140c",
        },
        // Cool neutral base — deliberately not cream/warm.
        mist: {
          50: "#f7f8f9",
          100: "#eef0f2",
          200: "#dde1e5",
          300: "#bcc3ca",
          400: "#97a1ab",
          500: "#74808c",
          600: "#57626f",
          700: "#3d4753",
          800: "#2a323d",
          900: "#1b2129",
          950: "#12161c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
