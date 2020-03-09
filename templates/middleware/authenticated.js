export default function({ store, redirect }) {
  if (!store.$auth.loggedIn) {
    return redirect("/auth/login");
  } else if (!store.$auth.user.password_changed) {
    return redirect("/auth/password");
  }
}
