<template>
  <div>
    <div
      class="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <component :is="logo" />
        <h2
          class="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900"
        >
          Change your password
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form @submit.prevent="onSubmit" @keydown="clearAllErrors">
            <div class="mt-6">
              <label
                for="password"
                class="block text-sm font-medium leading-5 text-gray-700"
                >Old password</label
              >
              <div class="mt-1 rounded-md shadow-sm">
                <input
                  id="current_password"
                  type="password"
                  required
                  v-model="form.oldPassword"
                  class="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                />
              </div>
            </div>
            <div class="mt-6">
              <label
                for="password"
                class="block text-sm font-medium leading-5 text-gray-700"
                >New password</label
              >
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
                >New password confirmation</label
              >
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
                >
                  {{ loading ? "Loading..." : "Confirm" }}
                </button>
              </span>
            </div>
          </form>
          <div class="flex items-center justify-center mt-6">
            <div class="text-xs leading-5">
              <div v-if="errors" class="flex flex-col">
                <span
                  v-for="error in Object.keys(errors)"
                  :key="error"
                  class="text-xs text-red-500"
                  >{{ errors[error] }}</span
                >
              </div>
              <p
                class="font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:underline"
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
import { redirectRoutes } from "../../../admin.config.js";
export default {
  name: "VPassword",
  layout: "empty",
  middleware: "authNotConfirmed",
  data() {
    return {
      logo: "logo",
      formType: "password",
      form: {
        oldPassword: "",
        password: "",
        password_confirmation: "",
      },
      loading: false,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        await this.$axios.post("/user/password", this.form);
        await this.$auth.fetchUser();
        this.redirectForRole();
      } catch (e) {
        this.setErrors(["password", e]);
      }
      this.loading = false;
    },
    redirectForRole() {
      this.$router.push({
        name: redirectRoutes[this.$auth.user.role]
          ? redirectRoutes[this.$auth.user.role].name
          : redirectRoutes.default.name,
      });
    },
  },
};
</script>
