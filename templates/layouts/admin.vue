<template>
  <v-layout-admin
    :logo="require('../assets/img/rstore_icon_gray_bg.png')"
    :appName="appName"
    :routes="routes"
    :logout="logout"
  >
    <nuxt />
  </v-layout-admin>
</template>
<script>
import { customRoutes } from "sbkl-client/router";
import { mapActions } from "vuex";
export default {
  name: "AdminLayout",
  data() {
    return {
      appName: process.env.APP_NAME,
      routes: customRoutes
    };
  },
  methods: {
    ...mapActions({
      clearStore: "clearStore"
    }),
    logout() {
      this.$auth.logout();
      this.clearStore();
    }
  }
};
</script>
<style>
.nuxt-link-exact-active,
.nuxt-link-exact-active:hover {
  color: #ffffff;
  background-color: #1a202c;
}
</style>
