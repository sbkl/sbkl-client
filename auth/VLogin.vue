<template>
  <div class="flex items-start justify-center">
    <form
      class="shadow-xl p-6 rounded-lg bg-white w-full sm:w-88 sm:mx-0 mt-12"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-xl font-bold text-gray-900 tracking-wider mb-4">Login</h1>
      <v-input
        class="mb-4"
        label="Email"
        type="email"
        v-model="form.username"
        placeholder="me@example.com"
      />
      <v-input
        class="mb-4"
        label="Password"
        type="password"
        v-model="form.password"
        placeholder="secret"
      />
      <v-button class="w-full" title="Login" :loading="loading" />
      <nuxt-link
        :to="{
          name: 'auth-password-reset'
        }"
        class="block text-center text-teal-500 mt-4 text-sm hover:underline hover:text-teal-300"
        href="#"
      >Forgot password</nuxt-link>
    </form>
  </div>
</template>
<script>
import { redirectRoutes } from "../../../admin.config.js";
import { mapActions } from "vuex";

export default {
  name: "VLogin",
  layout: "none",
  middleware: "guest",
  data() {
    return {
      formType: "login",
      form: {
        username: "",
        password: ""
      },
      loading: false,
      passportParams: {
        grant_type: process.env.PASSPORT_GRANT_TYPE,
        client_id: process.env.PASSPORT_CLIENT_ID,
        client_secret: process.env.PASSPORT_SECRET,
        scope: ""
      }
    };
  },
  mounted() {
    this.clearAllErrors();
  },
  methods: {
    ...mapActions({
      registerUserLastActivityDate: "admin/registerUserLastActivityDate"
    }),
    async onSubmit() {
      this.loading = true;
      try {
        await this.$auth.loginWith("laravel.passport", {
          data: { ...this.passportParams, ...this.form }
        });
        this.registerUserLastActivityDate();
        this.redirectForRole(this.$auth.user.role);
      } catch (e) {
        const error =
          e.response.data.error === "invalid_grant"
            ? "Wrong credentials"
            : e.response.data.error === "invalid_client"
            ? "Client key issue"
            : e.response.data.error;
        this.setErrors(["login", { error }, "error:email"]);
      }
      this.loading = false;
    },
    redirectForRole(role) {
      let routeName =
        role === "Admin" ? redirectRoutes.admin : redirectRoutes.user;
      if (this.$auth.user.password_changed) {
        this.$router.push({ name: routeName });
      } else {
        this.$router.push({ name: "auth-password" });
      }
    }
  }
};
</script>
