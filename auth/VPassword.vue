<template>
  <div class="flex items-start justify-center">
    <form
      class="shadow-xl p-6 rounded-lg bg-white w-full sm:w-88 sm:mx-0 mt-12"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-xl font-bold text-gray-900 tracking-wider">
        Change password
      </h1>
      <p class="text-gray-500 my-4 text-xs">
        Your password must be more than 8 characters long, should contain
        at-least 1 Uppercase, 1 Lowercase, 1 Numeric and 1 special character.
      </p>
      <v-input
        class="mb-4"
        label="Old password"
        type="password"
        v-model="form.oldPassword"
        errorField="oldPassword"
      />
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
    </form>
  </div>
</template>
<script>
export default {
  name: "VPassword",
  layout: "none",
  middleware: "authNotConfirmed",
  data() {
    return {
      formType: "password",
      form: {
        oldPassword: "",
        password: "",
        password_confirmation: ""
      },
      loading: false
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        await this.$axios.patch("/user/password", this.form);
        await this.$auth.fetchUser();
        this.redirectForRole(this.$auth.user.role);
      } catch (e) {
        this.setErrors(["password", e]);
      }
      this.loading = false;
    },
    redirectForRole(role) {
      let routeName = role === "Admin" ? "admin-regions" : "stock";
      this.$router.push({ name: routeName });
    }
  }
};
</script>
