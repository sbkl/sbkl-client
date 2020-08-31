<template>
  <div>
    <div class="pb-32 bg-gray-800">
      <nav class>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="border-b border-gray-700">
            <div class="flex items-center justify-between h-16 px-4 sm:px-0">
              <div class="flex items-center">
                <div class="flex items-center flex-shrink-0">
                  <nuxt-link :to="{ name: 'index' }">
                    <img :src="logoImage" class="w-10 h-10 rounded-lg" />
                  </nuxt-link>
                  <span v-if="title" class="ml-4 text-white">{{ title }}</span>
                </div>
                <div class="hidden md:block">
                  <div class="flex items-baseline ml-10">
                    <template v-for="([title, page, auth], index) in routes">
                      <nuxt-link
                        v-if="auth"
                        :key="page"
                        :to="{ name: page }"
                        class="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                        :class="{ 'ml-4': index != 0 }"
                      >{{ title }}</nuxt-link>
                    </template>
                  </div>
                </div>
              </div>
              <div class="hidden md:block">
                <div class="flex items-center ml-4 md:ml-6">
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
              <div class="flex -mr-2 md:hidden">
                <button
                  @click="open = !open"
                  class="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                >
                  <svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
        <div class="border-b border-gray-700 md:hidden" :class="open ? 'block' : 'hidden'">
          <div class="px-2 py-3 sm:px-3">
            <nuxt-link
              v-for="([title, page], index) in routes"
              :key="page"
              :to="{ name: page }"
              class="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
              :class="{ 'mt-1': index != 0 }"
              @click.native="open = false"
            >{{ title }}</nuxt-link>
          </div>
          <div class="px-2 py-3 sm:px-3">
            <template v-for="([action, authorised, callbacks = null], index) in actions">
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
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <portal to="header" />
        </div>
      </header>
    </div>
    <main class="-mt-32">
      <div class="px-4 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: "VLayoutElevated",
  props: ["logoImage", "routes", "actions", "title"],
  data() {
    return {
      open: false,
    };
  },
};
</script>
