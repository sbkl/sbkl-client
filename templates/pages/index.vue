<template>
  <div></div>
</template>

<script>
import { redirectRoutes } from "../admin.config";
export default {
  name: "Welcome",
  mounted() {
    if (this.$auth.user) {
      if (this.$auth.user.role === "OSL") {
        this.$router.push({ name: redirectRoutes.user });
      } else if (this.$auth.user.role === "Admin") {
        this.$router.push({ name: redirectRoutes.admin });
      } else {
        this.$auth.logout();
      }
    } else {
      this.$router.push({ name: "auth-login" });
    }
  }
};
</script>
