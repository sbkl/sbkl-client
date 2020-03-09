import { tables } from "../../../admin.config";
export const customRoutes = Object.keys(tables);

export default {
  extendRoutes(routes, resolve) {
    routes.push({
      name: "auth-login",
      path: "/auth/login",
      component: resolve(__dirname, "../auth/VLogin.vue")
    });
    routes.push({
      name: "auth-password",
      path: "/auth/password",
      component: resolve(__dirname, "../auth/VPassword.vue")
    });
    routes.push({
      name: "auth-password-reset",
      path: "/auth/password-reset",
      component: resolve(__dirname, "../auth/password-reset/index.vue")
    });
    routes.push({
      name: "auth-password-reset-token",
      path: "/auth/password-reset/:token",
      component: resolve(__dirname, "../auth/password-reset/_token/index.vue")
    });
    customRoutes.forEach(route => {
      routes.push({
        name: `${route}`,
        path: `/${route.replace("-", "/")}`,
        component: resolve(__dirname, "../components/AdminPanel.vue")
      });
    });
  }
};
