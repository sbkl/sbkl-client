<template>
  <div>
    <div class="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <component :is="logo" />
        <h2
          class="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900"
        >Reset your password</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form @submit.prevent="onSubmit" @keydown="clearAllErrors">
            <div class="mt-6">
              <label
                for="password"
                class="block text-sm font-medium leading-5 text-gray-700"
              >New password</label>
              <div class="mt-1 rounded-md shadow-sm">
                <input
                  id="new_password"
                  type="password"
                  required
                  v-model="form.password"
                  class="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                />
              </div>
            </div>
            <div class="mt-6">
              <label
                for="password"
                class="block text-sm font-medium leading-5 text-gray-700"
              >Password confirmation</label>
              <div class="mt-1 rounded-md shadow-sm">
                <input
                  id="new_password_confirmation"
                  type="password"
                  required
                  v-model="form.password_confirmation"
                  class="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                />
              </div>
            </div>
            <div class="mt-6">
              <span class="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900"
                  :class="
                    loading ? 'cursor-not-allowed bg-gray-700' : 'bg-gray-800'
                  "
                >{{ loading ? "Loading..." : "Confirm" }}</button>
              </span>
            </div>
          </form>
          <div class="flex items-center justify-center mt-6">
            <div class="text-xs leading-5 text-center">
              <nuxt-link
                :to="{
                  name: 'auth-login',
                }"
                href="#"
                class="text-sm font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:underline"
              >Go back to sign in</nuxt-link>
              <div v-if="errors" class="flex flex-col mt-6 text-left">
                <span
                  v-for="error in Object.keys(errors)"
                  :key="error"
                  class="text-xs text-red-500"
                >{{ errors[error] }}</span>
              </div>
              <p
                class="font-medium text-left text-gray-500 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:underline"
              >
                Your password must be more than 8 characters long, should
                contain at-least 1 Uppercase, 1 Lowercase, 1 Numeric and 1
                special character.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PasswordResetToken",
  layout: "empty",
  middleware: "guest",
  mounted() {
    this.fetchUser();
  },
  data() {
    return {
      logo: "logo",
      loading: false,
      user: null,
      formType: "password-reset",
      form: {
        password: "",
        password_confirmation: "",
        token: "",
      },
      error: null,
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
            token,
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
    },
  },
};
</script>
