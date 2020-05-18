import { redirectRoutes } from "../admin.config";

export default function ({ store, redirect }) {
  if (store.$auth.loggedIn) {
    if (store.$auth.user.role === "Admin") {
      return redirect(redirectRoutes.admin);
    }
    if (store.$auth.user.role === "OSL") {
      if (!store.$auth.user.password_changed) {
        return redirect("/auth/password");
      }
      return redirect(redirectRoutes.user);
    }
    // if (store.$auth.user.password_changed) {
    //   return redirect(redirectRoutes.user);
    // } else {
    //   return redirect("/auth/password");
    // }
  }
}
