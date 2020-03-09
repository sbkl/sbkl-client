<template>
  <div class="flex items-start justify-center">
    <form
      v-if="!emailSent"
      class="shadow-xl p-6 rounded-lg bg-white w-full sm:w-88 sm:mx-0 mt-12"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-xl font-bold text-gray-900 tracking-wider mb-4">Reset password</h1>
      <v-input
        class="mb-4"
        label="Email"
        type="email"
        v-model="form.email"
        placeholder="me@example.com"
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
    <div v-else class="shadow-xl p-6 rounded-lg bg-white w-full sm:w-88 sm:mx-0 mt-12">
      <p class="text-center font-semibold">Email has been sent successfully!</p>
      <nuxt-link
        :to="{
          name: 'auth-login'
        }"
        class="block text-center text-teal-500 mt-4 text-sm hover:underline hover:text-teal-300"
        href="#"
      >Back</nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "password-reset-request",
  layout: "none",
  middleware: "guest",
  data() {
    return {
      formType: "password-reset",
      loading: false,
      form: {
        email: ""
      },
      emailSent: false
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
    }
  }
};
</script>
