<template>
  <div>
    <div
      v-if="open"
      class="hidden md:block fixed inset-0 z-10"
      @click.self="open = false"
    />
    <div
      v-if="authorised"
      class="block md:hidden pt-4 pb-3 border-t border-gray-700"
    >
      <button
        @click.prevent="showNotificationPanel = !showNotificationPanel"
        class="flex p-1 pl-2 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span class="pl-2 text-white">Notifications</span>
      </button>
    </div>
    <div v-if="authorised" class="hidden md:block relative">
      <button
        @click.prevent="showNotificationPanel = !showNotificationPanel"
        class="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
      <div v-if="notifications.length" class="absolute right-0 -pl-12 bottom-2">
        <div
          class="-mr-1 mb-2 bg-teal-400 text-white w-4 h-4 flex items-center justify-center rounded-full p-3"
        >
          <span class="text-xs">{{ notifications.length }}</span>
        </div>
      </div>
    </div>
    <v-notification-panel
      :showNotificationPanel="showNotificationPanel"
      @hideNotificationPanel="showNotificationPanel = false"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "VNotificationAction",
  props: ["authorised", "callback"],
  computed: {
    ...mapGetters({
      notifications: "notifications/notifications"
    })
  },
  data() {
    return {
      open: false,
      showNotificationPanel: false
    };
  }
};
</script>
