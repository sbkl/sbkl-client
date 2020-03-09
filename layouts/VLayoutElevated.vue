<template>
  <div>
    <div class="bg-gray-800 pb-32">
      <nav class>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="border-b border-gray-700">
            <div class="flex items-center justify-between h-16 px-4 sm:px-0">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <nuxt-link :to="{ name: 'index' }">
                    <img :src="logoImage" class="w-10 h-10 rounded-lg" />
                  </nuxt-link>
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline">
                    <template v-for="([title, page, auth], index) in routes">
                      <nuxt-link
                        v-if="auth"
                        :key="page"
                        :to="{ name: page }"
                        class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                        :class="{ 'ml-4': index != 0 }"
                        >{{ title }}</nuxt-link
                      >
                    </template>
                  </div>
                </div>
              </div>
              <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                  <template
                    v-for="([action, authorised, callbacks = null],
                    index) in actions"
                  >
                    <component
                      :key="index"
                      :is="action"
                      :authorised="authorised"
                      :callbacks="callbacks"
                    />
                  </template>
                </div>
              </div>
              <div class="-mr-2 flex md:hidden">
                <button
                  @click="open = !open"
                  class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                >
                  <svg
                    class="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      class="inline-flex"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                    <path
                      :class="open ? 'inline-flex' : 'hidden'"
                      class="hidden"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="border-b border-gray-700 md:hidden"
          :class="open ? 'block' : 'hidden'"
        >
          <div class="px-2 py-3 sm:px-3">
            <nuxt-link
              v-for="([title, page], index) in routes"
              :key="page"
              :to="{ name: page }"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
              :class="{ 'mt-1': index != 0 }"
              @click.native="open = false"
              >{{ title }}</nuxt-link
            >
          </div>
          <div class="px-2 py-3 sm:px-3">
            <template
              v-for="([action, authorised, callbacks = null], index) in actions"
            >
              <component
                :key="index"
                :is="action"
                :authorised="authorised"
                :callbacks="callbacks"
                @close="open = false"
              />
            </template>
          </div>
        </div>
      </nav>
      <header class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <portal to="header" />
        </div>
      </header>
    </div>
    <main class="-mt-32">
      <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: "VLayoutElevated",
  props: ["logoImage", "routes", "actions"],
  data() {
    return {
      open: false
    };
  }
};
</script>
