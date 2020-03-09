/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  important: true,
  theme: {
    extend: {
      inset: {
        "2": "-1.25rem"
      },
      colors: {
        "black-opacity-50": "rgba(34,43,47,0.50)"
      },
      width: {
        "96": "24rem"
      },
      spacing: {
        "14": "3.5rem",
        "28": "10.5rem",
        "72": "18rem",
        "88": "22rem",
        "5vh": "5vh",
        "10vh": "10vh",
        "85vh": "85vh",
        "90vh": "90vh",
        "95vh": "95vh",
        "100vh": "100vh"
      },
      minWidth: {
        "8": "2rem",
        "24": "6rem",
        "96": "24rem"
      },
      minHeight: {
        "14": "3.5rem",
        "16": "4rem",
        "20": "5rem",
        "95vh": "95vh",
        "90vh": "90vh",
        "85vh": "85vh"
      },
      maxHeight: {
        "50vh": "50vh",
        "80vh": "80vh"
      },
      borderWidth: {
        "3": "3px"
      }
    }
  },
  variants: {},
  plugins: [
    require("postcss-import"),
    require("@tailwindcss/ui"),
    require("autoprefixer")
  ]
};
