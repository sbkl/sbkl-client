<template>
  <div
    class="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <component :is="logo" />
      <h2
        class="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900"
      >
        Reset your password
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
        <form
          @submit.prevent="onSubmit"
          v-if="!emailSent"
          @keydown="clearAllErrors"
        >
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-5 text-gray-700"
              >Email address</label
            >
            <div class="mt-1 rounded-md shadow-sm">
              <input
                id="email"
                type="email"
                required
                v-model="form.email"
                class="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              />
            </div>
          </div>

          <div class="mt-6">
            <span class="block w-full rounded-md shadow-sm">
              <button
                :disabled="loading"
                type="submit"
                class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900"
                :class="
                  loading ? 'cursor-not-allowed bg-gray-700' : 'bg-gray-800'
                "
              >
                {{ loading ? "Loading..." : "Submit" }}
              </button>
            </span>
            <div v-if="errors" class="flex flex-col">
              <span
                v-for="error in Object.keys(errors)"
                :key="error"
                class="mt-4 text-xs text-red-500"
                >{{ errors[error] }}</span
              >
            </div>
          </div>
        </form>

        <p v-else class="font-semibold text-center text-green-500">
          Email has been sent successfully!
        </p>

        <div class="flex items-center justify-center mt-6">
          <div class="text-sm leading-5">
            <nuxt-link
              :to="{
                name: 'auth-login',
              }"
              href="#"
              class="font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:underline"
              >Go back to sign in</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "password-reset-request",
  layout: "empty",
  middleware: "guest",
  data() {
    return {
      logo: "logo",
      formType: "password-reset",
      loading: false,
      form: {
        email: "",
      },
      emailSent: false,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        let { data } = await this.$axios.post(
          "/user/password/reset",
          this.form
        );
        this.emailSent = true;
      } catch (e) {
        this.setErrors(["password-reset-request", e]);
      }
      this.loading = false;
    },
  },
};
</script>
