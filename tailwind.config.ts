import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mono: {
          100: "#FFFFFF", // White
          200: "#F3F3F3", // Light Gray
          300: "#D1D1D1", // Medium Light Gray
          400: "#ADADAD", // Medium Gray
          500: "#8A8A8A", // Gray
          600: "#676767", // Medium Dark Gray
          700: "#454545", // Dark Gray
          800: "#292929", // Very Dark Gray
          900: "#141414", // Nearly Black
          950: "#0A0A0A", // Deep Black
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        monochrome: {
          "primary": "#8A8A8A",
          "secondary": "#454545",
          "accent": "#FFFFFF",
          "neutral": "#292929",
          "base-100": "#141414",
          "base-200": "#0A0A0A",
          "base-300": "#000000",
          "base-content": "#FFFFFF",
          "info": "#D1D1D1",
          "success": "#ADADAD",
          "warning": "#8A8A8A",
          "error": "#676767",
        },
      },
    ],
    darkTheme: "monochrome",
  },
} satisfies Config;
