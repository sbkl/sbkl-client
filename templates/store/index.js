export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    await dispatch("init");
  },
  async init({ dispatch }) {
    if (this.$auth.loggedIn) {
      await dispatch("admin/registerUserLastActivityDate");
      if (this.$auth.user.role === "OSL") {
        //
      } else if (this.$auth.user.role === "Admin") {
        await dispatch("admin/index");
      }
    }
  },
  clearStore({ dispatch }) {
    // dispatch('stores/clearStores')
  }
};
