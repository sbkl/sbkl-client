<template>
  <div class="relative bg-gray-50 overflow-hidden">
    <div
      x-data="{ open: false }"
      class="relative pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32"
    >
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6">
        <nav
          class="relative flex items-center justify-between sm:h-10 md:justify-center"
        >
          <div
            class="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0"
          >
            <div class="flex items-center justify-between w-full md:w-auto">
              <nuxt-link :to="{ name: 'index' }" class="flex items-center">
                <img
                  :src="require(`../assets/img/rstore_icon_gray_bg.png`)"
                  class="w-10 h-10 rounded-lg"
                />
                <p class="text-gray-700 font-semibold text-3xl">
                  {{ appName }}
                </p>
              </nuxt-link>
            </div>
          </div>
        </nav>
      </div>
      <div
        class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28"
      >
        <nuxt />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoneLayout",
  data() {
    return {
      appName: process.env.APP_NAME
    };
  }
};
</script>
