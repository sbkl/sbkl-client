import { redirectRoutes } from "../admin.config";

export default function ({ store, redirect }) {
  if (store.$auth.loggedIn) {
    if (store.$auth.user.password_changed) {
      return redirect(
        redirectRoutes[store.$auth.user.role]
          ? redirectRoutes[store.$auth.user.role]
          : redirectRoutes.default
      );
    }
  } else {
    return redirect("/auth/login");
  }
}
