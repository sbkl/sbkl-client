<template>
  <div class="flex items-start justify-center">
    <form
      v-if="!error && !loading"
      class="shadow-xl p-6 rounded-lg bg-white w-full sm:w-88 sm:mx-0 mt-12"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-xl font-bold text-gray-900 tracking-wider">Reset password</h1>
      <p class="text-gray-500 my-4 text-xs">
        Your password must be more than 8 characters long, should contain
        at-least 1 Uppercase, 1 Lowercase, 1 Numeric and 1 special character.
      </p>
      <v-input
        class="mb-4"
        label="New password"
        type="password"
        v-model="form.password"
        errorField="password"
      />
      <v-input
        class="mb-4"
        label="Password confirmation"
        type="password"
        v-model="form.password_confirmation"
      />
      <v-button class="w-full" title="Confirm" :loading="loading" />
      <nuxt-link
        :to="{
          name: 'auth-login'
        }"
        class="block text-center text-teal-500 mt-4 text-sm hover:underline hover:text-teal-300"
        href="#"
      >Back</nuxt-link>
    </form>
    <div
      v-if="error && !loading"
      class="shadow-xl p-6 rounded-lg bg-white w-full sm:w-88 sm:mx-0 mt-12"
    >
      <h1 class="text-xl font-bold text-gray-900 tracking-wider mb-4 text-center">Reset password</h1>
      <p class="text-red-500 text-sm font-semibold text-center">{{ error }}</p>
      <nuxt-link
        to="/"
        class="block text-center text-teal-500 mt-4 text-sm hover:underline hover:text-teal-300"
      >Back</nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "PasswordResetToken",
  layout: "none",
  middleware: "guest",
  mounted() {
    this.fetchUser();
  },
  data() {
    return {
      loading: false,
      user: null,
      formType: "password-reset",
      form: {
        password: "",
        password_confirmation: "",
        token: ""
      },
      error: null
    };
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      try {
        const token = this.$route.params.token;
        let { data: user } = await this.$axios.$post(
          "user/password/reset/token",
          {
            token
          }
        );
        this.user = user;
        this.form.token = token;
      } catch (e) {
        this.error = e.response.data.errors.token[0];
      }
      this.loading = false;
    },
    async onSubmit() {
      try {
        let response = await this.$axios.$patch(
          `user/${this.user.id}/password/reset`,
          this.form
        );
        this.$router.push({ name: "auth-login" });
      } catch (e) {
        this.setErrors(["password-reset", e]);
      }
    }
  }
};
</script>
