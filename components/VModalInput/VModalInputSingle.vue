<template>
  <div class="mt-1">
    <span class="rounded-md shadow-sm">
      <button
        ref="button"
        type="button"
        @click.prevent="$emit('openModal')"
        class="inline-flex justify-between w-full px-4 py-2 text-xs font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
        aria-haspopup="true"
        aria-expanded="true"
      >
        {{ value && value != '' ? title(value) : 'Select' }}
        <div class="ml-2 -mr-1 text-gray-400">
          <svg
            class="w-3 h-3 -mb-1"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
          <svg
            class="w-3 h-3 -mt-1"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
    </span>
  </div>
</template>
<script>
export default {
  name: "VModalInputSingle",
  watch: {
    closing() {
      this.$refs.button.focus();
    }
  },
  props: {
    value: {
      required: true
    },
    closing: {
      type: Boolean,
      required: true
    },
    titleFields: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    title(item) {
      return this.titleFields.reduce((carry, field) => {
        if (carry === "") {
          return item[field];
        } else {
          return `${carry} ${item[field]}`;
        }
      }, "");
    },
  }
};
</script>
