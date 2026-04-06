import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        card: "#12121A",
        accent: "#38BDF8",
        approved: "#22C55E",
        rejected: "#EF4444",
        pending: "#EAB308",
      },
    },
  },
  plugins: [typography],
};
export default config;
