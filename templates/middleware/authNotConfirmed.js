import { redirectRoutes } from "../admin.config";

export default function({ store, redirect }) {
  if (store.$auth.loggedIn) {
    if (store.$auth.user.password_changed) {
      if (store.$auth.user.role === "Admin") {
        return redirect(redirectRoutes.admin);
      } else {
        return redirect(redirectRoutes.user);
      }
    }
  } else {
    return redirect("/auth/login");
  }
}
