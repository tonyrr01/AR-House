import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        mist: "#eef3f1",
        pine: "#1f5f50",
        sea: "#247a7a",
        sun: "#f3b23c",
        clay: "#b95f43"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
