<template>
  <div>
    <div
      v-if="open"
      class="hidden md:block fixed inset-0 z-10"
      @click.self="$parent.open = false"
    />
    <div
      v-if="authorised"
      class="block md:hidden pt-4 pb-3 border-t border-gray-700"
    >
      <span class="pl-2 text-gray-400 flex items-center">
        <slot name="icon"></slot>
        <span class="ml-2">{{ title }}</span>
      </span>
      <template v-for="([actionTitle, action, args], index) in actions">
        <a
          :key="index"
          @click.prevent="action(args)"
          class="cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >{{ actionTitle }}</a
        >
      </template>
    </div>
    <div
      v-if="authorised"
      class="hidden md:block relative inline-block text-left mr-4"
    >
      <button
        @click.prevent="$parent.open = !open"
        class="mt-1 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="w-8 h-8 fill-current"
        >
          <path
            d="M403.002 217.001C388.998 148.002 328.998 96 256 96c-57.998 0-107.998 32.998-132.998 81.001C63.002 183.002 16 233.998 16 296c0 65.996 53.999 120 120 120h260c55 0 100-45 100-100 0-52.998-40.996-96.001-92.998-98.999zM288 276v76h-64v-76h-68l100-100 100 100h-68z"
          />
        </svg>
      </button>
      <div
        v-if="open"
        class="z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg"
      >
        <div class="rounded-md bg-white shadow-xs">
          <div class="py-1">
            <template v-for="([actionTitle, action, args], index) in actions">
              <a
                :key="index"
                @click.prevent="action(args)"
                class="cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                >{{ actionTitle }}</a
              >
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "VDropdownNavIcon",
  props: {
    open: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    authorised: {
      type: Boolean,
      required: true
    },
    actions: {
      type: Array,
      required: true
    }
  }
};
</script>
