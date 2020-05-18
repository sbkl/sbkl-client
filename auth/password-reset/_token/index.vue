<template>
  <div class="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        class="w-auto h-12 mx-auto"
        :src="require('../../../../../assets/img/rstore_icon_gray_bg.png')"
        alt="Workflow"
      />
      <h2
        class="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900"
      >Reset your password</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
        <p class="mb-4 text-sm text-gray-500">
          Your password must be more than 8 characters long, should contain
          at-least 1 Uppercase, 1 Lowercase, 1 Numeric and 1 special character.
        </p>
        <form @submit.prevent="onSubmit">
          <div class="mt-6">
            <label
              for="password"
              class="block text-sm font-medium leading-5 text-gray-700"
            >New password</label>
            <div class="mt-1 rounded-md shadow-sm">
              <input
                id="password"
                type="password"
                required
                v-model="form.password"
                class="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              />
              <p
                class="my-1 text-xs text-red-600"
                v-if="
        formType === failedFormName &&
          errors['password']
      "
                v-text="errors['password']"
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
                id="password_confirmation"
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
                :disabled="loading"
                type="submit"
                class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900"
                :class="loading ? 'cursor-not-allowed bg-gray-700' : 'bg-gray-800'"
              >{{ loading ? 'Loading...' : 'Submit'}}</button>
            </span>
          </div>
        </form>
        <div class="flex items-center justify-center mt-6">
          <div class="text-sm leading-5">
            <nuxt-link
              :to="{
                name: 'auth-login'
              }"
              class="font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:underline"
            >Go back to sign in</nuxt-link>
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
      this.loading = true;
      try {
        let response = await this.$axios.$patch(
          `user/${this.user.id}/password/reset`,
          this.form
        );
        this.$router.push({ name: "auth-login" });
      } catch (e) {
        console.log(e);
        this.setErrors(["password-reset", e]);
        this.loading = false;
      }
    }
  }
};
</script>