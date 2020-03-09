<template>
  <v-layout-elevated
    :logoImage="require(`../assets/img/rstore_icon_gray_bg.png`)"
    :routes="[
      //[title, route, authorisation]
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
      // fetchNotifications: "notifications/index",
      // clearNotifications: "notifications/clearNotifications"
    }),
    clearStore() {
      // this.clearNotifications();
    }
  }
};
</script>
