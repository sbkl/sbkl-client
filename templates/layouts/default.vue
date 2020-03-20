<template>
  <v-layout-elevated
    :logoImage="require(`../assets/img/rstore_icon_gray_bg.png`)"
    :routes="[
      ['Dashboard', 'dashboard', $auth.user ? $auth.user.role === 'Office' : false],
      ['Stores', 'stores', $auth.user ? $auth.user.role === 'Office' : false]
    ]"
    :actions="[
      //[component, authorisation, {callbacks}],
      //['v-notification-action', $auth.user && $auth.user.role === 'OSL'],
      ['v-profile-dropdown-actions', true, { clearStore }]
    ]"
  >
    <nuxt />
  </v-layout-elevated>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "defaultLayout",
  mounted() {
    // if (this.$auth.loggedIn && this.$auth.user.role != "Admin") {
    //   this.$echo
    //     .channel(`plant.${this.$auth.user.plant_id}`)
    //     .listen("TransitChanged", e => {
    //       this.fetchNotifications();
    //     });
    // }
  },
  methods: {
    ...mapActions({
      clearStore: "clearStore"
    })
  }
};
</script>
