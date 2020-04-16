export const components = {
  install(Vue, options) {
    const files = require.context("./", true, /\.vue$/i);
    files.keys().forEach((key) => {
      Vue.component(files(key).default.name, files(key).default);
    });
  },
};
