/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "bg-white": "url('../public/images/global/bg-dark1.png')",
        "nav-light": "url('../public/images/global/bg-nav-light.png')",
        "nav-dark": "url('../public/images/global/bg-nav-dark.png')",
        "bg-dark": "url('../public/images/global/bg-dark.webp')",
        "bannerImg": "url('../public/images/global/bg-1.jpg')",
        "blackOverlay": "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
        "greenOverlay": "linear-gradient(to right, #EEEEEE 0%, #76ABAE 100%)",
      },
      boxShadow: {
        "3xl": "60px 60px 60px 60px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        darkbg: "#222831",
        
        lightgreen: "#76ABAE",
        light: "#EEEEEE",
        
      },
    },
  },
  plugins: [],
};
