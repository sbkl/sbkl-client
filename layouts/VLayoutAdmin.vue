<template>
  <div
    class="h-screen flex overflow-hidden bg-gray-100"
    @keydown.escape="sidebarOpen = false"
  >
    <!-- Off-canvas menu for mobile -->
    <div class="md:hidden">
      <div
        @click="sidebarOpen = false"
        class="fixed inset-0 z-30 bg-gray-600 opacity-0 pointer-events-none transition-opacity ease-linear duration-300"
        :class="
          sidebarOpen
            ? 'opacity-75 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        "
      ></div>
      <div
        class="fixed inset-y-0 left-0 flex flex-col z-40 max-w-xs w-full bg-gray-800 transform ease-in-out duration-300"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="absolute top-0 right-0 -mr-14 p-1">
          <button
            v-if="sidebarOpen"
            @click="sidebarOpen = false"
            class="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
          >
            <svg
              class="h-6 w-6 text-white"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
          <div class="flex-shrink-0 flex items-center px-4">
            <img class="h-8 w-auto rounded-lg" :src="logo" alt="RStore" />
            <span class="ml-4 text-white text-xl font-semibold">{{
              appName
            }}</span>
          </div>
          <nav class="mt-5 px-2">
            <template v-for="(route, index) in routes">
              <nuxt-link
                :key="route"
                :to="{ name: `${route}` }"
                class="group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition ease-in-out duration-150"
                :class="{ 'mt-1': index > 0 }"
                >{{ routeName(route) }}</nuxt-link
              >
            </template>
          </nav>
        </div>
        <div class="flex-shrink-0 flex bg-gray-700 p-4">
          <a href="#" class="flex-shrink-0 group block">
            <div class="flex items-center">
              <div>
                <v-avatar-placeholder
                  v-if="$auth.user"
                  :first="$auth.user.first_name"
                  :second="$auth.user.last_name"
                />
              </div>
              <div class="ml-3">
                <p class="text-base leading-6 font-medium text-white">
                  {{ $auth.user.first_name }} {{ $auth.user.last_name }}
                </p>
                <p
                  class="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150"
                >
                  {{ $auth.user.email }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:block md:flex md:flex-shrink-0">
      <div class="h-screen flex flex-col w-64 bg-gray-800">
        <div class="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <img class="h-8 w-auto rounded-lg" :src="logo" alt="Logo" />
            <span class="ml-4 text-white text-xl font-semibold">{{
              appName
            }}</span>
          </div>
          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <nav class="mt-5 flex-1 px-2 bg-gray-800">
            <template v-for="(route, index) in routes">
              <nuxt-link
                :key="route"
                :to="{ name: `${route}` }"
                class="group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition ease-in-out duration-150"
                :class="{ 'mt-1': index > 0 }"
                >{{ routeName(route) }}</nuxt-link
              >
            </template>
          </nav>
        </div>
        <div class="flex-shrink-0 flex bg-gray-700 p-4">
          <a
            href="#"
            class="flex-shrink-0 group block focus:outline-none w-full"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 flex items-center">
                <div>
                  <v-avatar-placeholder
                    v-if="$auth.user"
                    :first="$auth.user.first_name"
                    :second="$auth.user.last_name"
                  />
                </div>
                <div class="ml-3">
                  <p class="text-sm leading-5 font-medium text-white">
                    {{ $auth.user.first_name }} {{ $auth.user.last_name }}
                  </p>
                </div>
              </div>
              <button type="button" @click.prevent="logout">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="w-7 h-7 fill-current text-gray-400"
                >
                  <path
                    d="M160,256a16,16,0,0,1,16-16H320V136c0-32-33.79-56-64-56H104a56.06,56.06,0,0,0-56,56V376a56.06,56.06,0,0,0,56,56H264a56.06,56.06,0,0,0,56-56V272H176A16,16,0,0,1,160,256Z"
                  />
                  <path
                    d="M459.31,244.69l-80-80a16,16,0,0,0-22.62,22.62L409.37,240H320v32h89.37l-52.68,52.69a16,16,0,1,0,22.62,22.62l80-80a16,16,0,0,0,0-22.62Z"
                  />
                </svg>
              </button>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <div class="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
        <button
          @click.stop="sidebarOpen = true"
          class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
        >
          <svg
            class="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <main
        class="flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: "VLayoutAdmin",
  props: {
    appName: {
      default: ""
    },
    logo: {
      default: null
    },
    routes: {
      default: () => []
    },
    logout: {
      default: () => {}
    }
  },
  data() {
    return {
      sidebarOpen: false
    };
  },
  methods: {
    routeName(route) {
      let formattedRouteName = route.replace("admin-", "").replace("_", " ");
      return (formattedRouteName =
        formattedRouteName.charAt(0).toUpperCase() +
        formattedRouteName.substring(1));
    }
  }
};
</script>
