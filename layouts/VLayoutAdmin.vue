<template>
  <div
    class="flex h-screen overflow-hidden bg-gray-100"
    @keydown.escape="sidebarOpen = false"
  >
    <!-- Off-canvas menu for mobile -->
    <div class="md:hidden">
      <div
        @click="sidebarOpen = false"
        class="fixed inset-0 z-30 transition-opacity duration-300 ease-linear bg-gray-600 opacity-0 pointer-events-none"
        :class="
          sidebarOpen
            ? 'opacity-75 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        "
      ></div>
      <div
        class="fixed inset-y-0 left-0 z-40 flex flex-col w-full max-w-xs duration-300 ease-in-out transform bg-gray-800"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="absolute top-0 right-0 p-1 -mr-14">
          <button
            v-if="sidebarOpen"
            @click="sidebarOpen = false"
            class="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-gray-600"
          >
            <svg
              class="w-6 h-6 text-white"
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
        <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <img class="w-auto h-8 rounded-lg" :src="logo" alt="RStore" />
            <span class="ml-4 text-xl font-semibold text-white">{{
              appName
            }}</span>
          </div>
          <nav class="px-2 mt-5">
            <template v-for="(route, index) in routes">
              <nuxt-link
                :key="route"
                :to="{ name: `${route}` }"
                class="flex items-center px-2 py-2 text-base font-medium leading-6 text-gray-300 transition duration-150 ease-in-out rounded-md group hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                :class="{ 'mt-1': index > 0 }"
                >{{ routeName(route) }}</nuxt-link
              >
            </template>
          </nav>
        </div>
        <div class="flex flex-shrink-0 p-4 bg-gray-300">
          <a href="#" class="flex-shrink-0 block group">
            <div class="flex items-center">
              <div>
                <v-avatar-placeholder
                  v-if="$auth.user"
                  :first="$auth.user.first_name"
                  :second="$auth.user.last_name"
                />
              </div>
              <div class="ml-3">
                <p class="text-base font-medium leading-6 text-white">
                  {{ $auth.user.first_name }} {{ $auth.user.last_name }}
                </p>
                <p
                  class="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300"
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
      <div class="flex flex-col w-64 h-screen bg-gray-800">
        <div class="flex flex-col flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <img class="w-auto h-8 rounded-lg" :src="logo" alt="Logo" />
            <span class="ml-4 text-xl font-semibold text-white">{{
              appName
            }}</span>
          </div>
          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <nav class="flex-1 px-2 mt-5 bg-gray-800">
            <template v-for="(route, index) in routes">
              <nuxt-link
                :key="route"
                :to="{ name: `${route}` }"
                class="flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-300 transition duration-150 ease-in-out rounded-md group hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                :class="{ 'mt-1': index > 0 }"
                >{{ routeName(route) }}</nuxt-link
              >
            </template>
          </nav>
        </div>
        <div class="flex flex-shrink-0 p-4 bg-gray-700">
          <a
            href="#"
            class="flex-shrink-0 block w-full group focus:outline-none"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center flex-1">
                <div>
                  <v-avatar-placeholder
                    v-if="$auth.user"
                    :first="$auth.user.first_name"
                    :second="$auth.user.last_name"
                  />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium leading-5 text-white">
                    {{ $auth.user.first_name }} {{ $auth.user.last_name }}
                  </p>
                </div>
              </div>
              <button type="button" @click.prevent="logout">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="text-gray-400 fill-current w-7 h-7"
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
    <div class="flex flex-col flex-1 w-0 overflow-hidden">
      <div class="pt-1 pl-1 md:hidden sm:pl-3 sm:pt-3">
        <button
          @click.stop="sidebarOpen = true"
          class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
        >
          <svg
            class="w-6 h-6"
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
        class="flex flex-1 overflow-hidden"
      >
        <div class="flex flex-col flex-1 px-4 mx-auto overflow-hidden max-w-7xl sm:px-6 md:px-8">
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
