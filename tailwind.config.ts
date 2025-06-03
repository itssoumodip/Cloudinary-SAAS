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
          900: "#1A1A1A", // Nearly Black
          950: "#0F0F0F", // Deep Black
        },
        dark: {
          100: "#2A2A2A",
          200: "#252525", 
          300: "#202020", 
          400: "#1C1C1C", 
          500: "#181818", 
          600: "#151515", 
          700: "#121212", 
          800: "#0F0F0F", 
          900: "#080808", 
          950: "#050505",
        },
      },
      boxShadow: {
        'subtle': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 15px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dark-gradient': 'linear-gradient(to bottom, #1A1A1A, #0F0F0F)',
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
          "neutral": "#1A1A1A",
          "base-100": "#151515",
          "base-200": "#121212",
          "base-300": "#0F0F0F",
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
