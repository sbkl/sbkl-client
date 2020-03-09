const path = require("path");
require("dotenv").config();
import { router, auth } from "sbkl-client";

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.APP_NAME,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["~/assets/sass/tailwind.sass"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "./plugins/global.js",
    "./plugins/mixins/responsive.js",
    "./plugins/sbkl-client.js"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
    "@nuxtjs/auth",
    "portal-vue/nuxt",
    "nuxt-purgecss"
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.URL + "/api"
  },
  auth: { ...auth(process.env.URL) },
  router: { ...router },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extractCSS: true,
    postcss: {
      plugins: {
        tailwindcss: path.resolve(__dirname, "./tailwind.config.js")
      }
    },
    transpile: ["sbkl-client"],
    extend(config, ctx) {}
  },
  purgeCSS: {
    mode: "postcss",
    paths: ["node_modules/sbkl-client/**/*.vue", "admin.config.js"]
  }
};
