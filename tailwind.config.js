module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      screens: {},
      colors: {
        blue: {
          100: "#F1FBFF",
          300: "#312f62",
          500: "#4F46E5",
          700: "#07577A",
        },
        red: {
          500: "#EB6578",
        },
        grey: {
          100: "#E4E4E7",
          200: "#FAFAFB",
          300: "#A1A1AA",
          400: "#D4D4D8",
          700: "#71717A",
        },
        dark: {
          300: "#3F3F46",
          200: "#222222",
          180: "#18181B",
        },
        whiting: "#FEFEFF",
        green: {
          100: "#ECFDF3",
          500: "#12B76A",
          600: "#14532D",
        },
        yellow: {
          100: "rgba(225, 209, 25, 0.22)",
          500: "#FEE02A",
        },
        
      },
      fontSize: {
        "3xl": "28px",
      },
      lineHeight: {
        "3xl": "32px",
      },
      spacing: {
        7.5: "30px",
        13: "52px",
        15: "60px",
        17: "68px",
        30: "120px",
        80: "320px",
        28: "112px",
      },
      width: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
