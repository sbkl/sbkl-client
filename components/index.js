export const components = {
  install(Vue, options) {
    const components = require.context("./", true, /\.vue$/i);
    components.keys().forEach((key) => {
      Vue.component(components(key).default.name, components(key).default);
    });
    const authComponents = require.context("../auth", true, /\.vue$/i);
    authComponents.keys().forEach((key) => {
      Vue.component(
        authComponents(key).default.name,
        authComponents(key).default
      );
    });
    const layoutsComponents = require.context("../layouts", true, /\.vue$/i);
    layoutsComponents.keys().forEach((key) => {
      Vue.component(
        layoutsComponents(key).default.name,
        layoutsComponents(key).default
      );
    });
  },
};
