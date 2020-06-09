<template>
  <div
    class="flex grid flex-wrap items-start h-48 grid-cols-6 p-4 overflow-y-auto border border-gray-200 rounded-md"
  >
    <span v-for="(item, index) in items" :key="index" class="flex items-center bg-teal-100">
      <span>{{ title(item) }}</span>
      <a
        @click.prevent="$emit('onRemove', item)"
        class="font-medium text-teal-600 transition duration-150 ease-in-out cursor-pointer hover:text-teal-500"
      >
        <svg
          class="w-3 h-3"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </a>
    </span>
  </div>
</template>
<script>
export default {
  name: "VModalInputTags",
  props: {
    items: {
      type: Array,
      required: true
    },
    titleFields: {
      type: Array,
      required: true
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
    }
  }
};
</script>
