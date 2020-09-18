<template>
  <div></div>
</template>

<script>
import { redirectRoutes } from "../admin.config";
export default {
  name: "Welcome",
  mounted() {
    if (this.$auth.user) {
      this.$router.push({
        name: redirectRoutes[this.$auth.user.role]
          ? redirectRoutes[this.$auth.user.role].name
          : redirectRoutes.default.name,
      });
    } else {
      this.$router.push({ name: "auth-login" });
    }
  },
};
</script>
