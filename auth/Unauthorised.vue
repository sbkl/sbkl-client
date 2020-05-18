<template>
  <div class="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        class="w-auto h-12 mx-auto"
        :src="require('../../../assets/img/rstore_icon_gray_bg.png')"
        alt="Workflow"
      />
      <h2 class="mt-6 text-3xl font-extrabold leading-9 text-center text-red-500">Access Denied</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
        <p class="mb-4 text-sm text-center text-grey-500">
          You don't have the right role or permission to access RStore.
          Contact your administrator for more information.
        </p>
        <div class="flex items-center justify-center mt-6">
          <div class="text-sm leading-5">
            <nuxt-link
              :to="{
          name: 'auth-login'
        }"
              href="#"
              class="font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:underline"
            >Go back to sign in</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Unauthorised",
  layout: "empty"
};
</script>

