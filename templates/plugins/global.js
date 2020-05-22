import Vue from "vue";
const files = require.context("../components", true, /\.vue$/i);
files.keys().map((key) => {
  Vue.component(files(key).default.name, files(key).default);
});
