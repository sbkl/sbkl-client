<template>
  <div v-if="$auth.user && authorised">
    <div
      v-if="open"
      class="hidden md:block fixed inset-0 z-10"
      @click.self="open = false"
    />
    <!-- Mobile layout -->
    <div class="block md:hidden pt-4 pb-3 border-t border-gray-700">
      <div class="flex items-center pl-2">
        <div class="flex-shrink-0">
          <v-avatar-placeholder
            v-if="$auth.user"
            :first="$auth.user.first_name"
            :second="$auth.user.last_name"
          />
        </div>
        <div class="ml-3">
          <div class="text-base font-medium leading-none text-white">
            {{ $auth.user.first_name }} {{ $auth.user.last_name }}
          </div>
          <div class="mt-1 text-sm font-medium leading-none text-gray-400">
            {{ $auth.user.email }}
          </div>
        </div>
      </div>
      <div class="mt-3">
        <a
          @click.prevent="logout"
          class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
          >Sign out</a
        >
      </div>
    </div>
    <!-- Wide layout -->
    <div class="hidden md:block ml-3 relative">
      <div>
        <button @click.prevent="open = !open">
          <v-avatar-placeholder
            v-if="$auth.user"
            :first="$auth.user.first_name"
            :second="$auth.user.last_name"
          />
        </button>
      </div>
      <div
        v-if="open"
        class="z-20 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
      >
        <div class="py-1 rounded-md bg-white shadow-xs">
          <a
            @click.prevent="logout"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >Sign out</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "VProfileDropdownActions",
  props: ["authorised", "callbacks"],
  data() {
    return {
      open: false
    };
  },
  methods: {
    logout() {
      this.$auth.logout();
      this.callbacks.clearStore();
    }
  }
};
</script>
