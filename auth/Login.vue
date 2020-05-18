<template>
  <div class="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        class="w-auto h-12 mx-auto"
        :src="require('../../../assets/img/rstore_icon_gray_bg.png')"
        alt="Workflow"
      />
      <h2
        class="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900"
      >Sign in to your account</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="onSubmit">
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-5 text-gray-700"
            >Email address</label>
            <div class="mt-1 rounded-md shadow-sm">
              <input
                id="email"
                type="email"
                required
                v-model="form.username"
                class="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              />
            </div>
            <span
              class="text-xs text-red-500"
              v-if="form.username.includes('burberry.com')"
            >Please use SSO</span>
          </div>

          <div class="mt-6">
            <label for="password" class="block text-sm font-medium leading-5 text-gray-700">Password</label>
            <div class="mt-1 rounded-md shadow-sm">
              <input
                id="password"
                type="password"
                required
                v-model="form.password"
                class="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              />
            </div>
          </div>

          <div class="mt-6">
            <span class="block w-full rounded-md shadow-sm">
              <button
                :disabled="loading || form.username.includes('burberry.com')"
                type="submit"
                class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900"
                :class="loading || form.username.includes('burberry.com') ? 'cursor-not-allowed bg-gray-700' : 'bg-gray-800'"
              >{{ loading ? 'Loading...' : 'Sign in'}}</button>
            </span>
          </div>
        </form>
        <div class="flex items-center justify-center mt-6">
          <div class="text-sm leading-5">
            <nuxt-link
              :to="{
                name: 'auth-password-reset'
              }"
              href="#"
              class="font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:underline"
            >Forgot your password?</nuxt-link>
          </div>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm leading-5">
              <span class="px-2 text-gray-500 bg-white">Or</span>
            </div>
          </div>

          <div class="mt-6">
            <div>
              <span class="inline-flex w-full rounded-md shadow-sm">
                <button
                  @click.prevent="SSOLogin"
                  :disabled="loading || ssoLoading"
                  type="button"
                  class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue"
                  aria-label="Sign in with Facebook"
                >{{ ssoLoading ? 'Redirecting to SSO...' : 'Sign in with SSO' }}</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { redirectRoutes } from "../../../admin.config.js";
import { mapActions, mapGetters } from "vuex";
const parseIdTokenFromUrl = url => {
  const params = url.substring(1).split("&");
  for (let i = 0; i < params.length; i++) {
    let pair = params[i].split("=");
    if (pair[0] === "id_token") {
      return pair[1];
    }
  }
  return null;
};
const setIdTokenToStorage = () => {
  if (process.browser) {
    if (
      window.location.hash.indexOf("id_token") > -1 &&
      window.sessionStorage
    ) {
      window.sessionStorage.setItem(
        "ping_id_token",
        parseIdTokenFromUrl(window.location.hash)
      );
    }
  }
};
setIdTokenToStorage();
export default {
  name: "Login",
  layout: "empty",
  middleware: "guest",
  data() {
    return {
      formType: "login",
      form: {
        username: "",
        password: ""
      },
      loading: false,
      ssoLoading: false,
      passportParams: {
        grant_type: process.env.PASSPORT_GRANT_TYPE,
        client_id: process.env.PASSPORT_CLIENT_ID,
        client_secret: process.env.PASSPORT_SECRET,
        scope: ""
      },
      exchangeToken: false
    };
  },
  mounted() {
    this.clearAllErrors();
    const ping_id_token = window.sessionStorage.ping_id_token;
    window.sessionStorage.removeItem("ping_id_token");
    if (ping_id_token) {
      this.exchangeToken = true;
      this.$auth
        .loginWith("laravel.tokenExchange", { data: { token: ping_id_token } })
        .then(() => {
          if (this.$auth.user.role !== "Admin") {
            throw "Invalid role. Access Denied";
          }
          this.registerUserLastActivityDate();
          this.init();
          this.$router.push({ name: redirectRoutes.admin });
        })
        .catch(e => {
          this.exchangeToken = false;
          window.localStorage.clear();
          this.$router.push({ name: "unauthorised" });
        });
    }
  },
  methods: {
    ...mapActions({
      init: "init",
      registerUserLastActivityDate: "admin/registerUserLastActivityDate"
    }),
    async onSubmit() {
      this.loading = true;
      try {
        await this.$auth.loginWith("laravel.passport", {
          data: { ...this.passportParams, ...this.form }
        });
        this.registerUserLastActivityDate();
        this.init();
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
    async SSOLogin() {
      this.ssoLoading = true;
      await this.$auth.loginWith("pingOne");
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