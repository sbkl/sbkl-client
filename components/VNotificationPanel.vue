<template>
  <div v-if="showNotificationPanel">
    <transition name="fade" appear>
      <div
        @click.prevent="hideNotificationPanel"
        class="absolute inset-0 z-20 bg-black-opacity-50"
      />
    </transition>
    <transition name="slide" appear>
      <div class="absolute inset-y-0 right-0 z-30 w-full bg-white sm:w-96">
        <div class="flex items-center justify-between">
          <h1 class="py-4 pl-4 text-3xl font-bold">Notifications</h1>
          <button
            @click.prevent="hideNotificationPanel"
            class="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-gray-600"
          >
            <svg
              class="w-6 h-6 text-gray-400"
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
        <div class="overflow-scroll">
          <div
            class="p-2 border-b border-gray-200"
            v-for="notification in notifications"
            :key="notification.id"
          >
            <p class="text-gray-800">
              Order #{{ notification.data.order_number }} is now
              {{ notification.data.status }}
            </p>
            <p class="text-sm text-gray-500">{{ notification.created_at }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "VNotificationPanel",
  props: ["showNotificationPanel"],
  computed: {
    ...mapGetters({
      notifications: "notifications/notifications",
    }),
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    ...mapActions({
      fetchNotifications: "notifications/index",
      markNotificationsAsRead: "notifications/markNotificationsAsRead",
    }),
    hideNotificationPanel() {
      this.markNotificationsAsRead();
      this.$emit("hideNotificationPanel");
    },
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.slide-enter {
  transform: translateX(100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-enter-active {
  position: absolute;
}

.slide-leave {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-in-out;
}
</style>
