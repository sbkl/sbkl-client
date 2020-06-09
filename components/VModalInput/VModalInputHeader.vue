<template>
  <div class="relative flex justify-between">
    <label :class="labelClass">{{ pluralLabel }}</label>
    <span class="ml-3" v-if="type != 'single'">
      <button
        @click.prevent="$emit('openModal')"
        type="button"
        class="absolute top-0 right-0 inline-flex items-center p-1 -mt-1 text-xs font-medium leading-5 text-teal-600 transition duration-150 ease-in-out border border-transparent rounded-md rounded-full hover:bg-teal-100 focus:outline-none focus:shadow-outline-teal focus:border-teal-300 active:bg-transparent"
      >
        <component :is="`v-icon-plus`" class="w-4 h-4" />
      </button>
    </span>
  </div>
</template>
<script>
export default {
  name: "VModalInputHeader",
  props: {
    label: {
      type: Array,
      default: () => ["Labels", "Label"]
    },
    labelClass: {
      type: String,
      default: "block text-xs font-medium leading-5 text-gray-700"
    },
    type: {
      type: String,
      default: "input"
    }
  },
  computed: {
    singularLabel() {
      const [plural, singular] = this.label;
      return singular;
    },
    pluralLabel() {
      const [plural, singular] = this.label;
      return plural;
    }
  }
};
</script>
