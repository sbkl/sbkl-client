<template>
  <ul class="h-48 mt-1 overflow-y-auto border border-gray-200 rounded-md">
    <li
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center justify-between py-3 pl-3 pr-4 text-xs leading-5"
      :class="[index > 0 ? ' border-t border-gray-200' : '']"
    >
      <div class="flex items-center flex-1 w-0">
        <component :is="itemIcon" class="flex-shrink-0 w-5 h-5 text-gray-400" />
        <span class="flex-1 w-0 ml-2 truncate">{{ title(item) }}</span>
      </div>
      <div class="flex-shrink-0 ml-4">
        <a
          @click.prevent="$emit('onRemove', item)"
          class="font-medium text-teal-600 transition duration-150 ease-in-out cursor-pointer hover:text-teal-500"
        >Remove</a>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: "VModalInputList",
  props: {
    items: {
      type: Array,
      required: true
    },
    itemIcon: {
      type: String,
      default: ""
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
