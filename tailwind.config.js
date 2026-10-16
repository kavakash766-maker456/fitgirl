/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090c",
        surface: "#0f1218",
        "surface-card": "#151a23",
        "surface-hover": "#1d2330",
        border: "#252e3e",
        "border-light": "#333f54",
        accent: {
          pink: "#ec4899",
          purple: "#a855f7",
          cyan: "#06b6d4",
          green: "#10b981",
        },
        whatsapp: "#25D366",
      },
      backgroundImage: {
        "gaming-glow": "radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15), transparent 70%)",
        "card-gradient": "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(15,18,24,0.95) 100%)",
      },
    },
  },
  plugins: [],
};
