export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    if (this.$auth.loggedIn) {
      await dispatch("admin/registerUserLastActivityDate");
      if (this.$auth.user.role === "OSL") {
        //
      } else if (this.$auth.user.role === "Admin") {
        await dispatch("admin/index");
      }
    }
  }
};
