<template>
  <div class="flex items-center justify-center border-2 border-gray-300 border-dashed rounded-md">
    <div class="text-center">
      <component :is="itemIcon" class="w-12 h-12 mx-auto text-gray-400" />
      <p class="mt-1 text-sm text-gray-600">
        <a
          @click.prevent="$emit('openModal')"
          class="font-medium text-teal-600 transition duration-150 ease-in-out cursor-pointer hover:text-teal-500 focus:outline-none focus:underline"
        >Add a {{ name }}</a>
      </p>
      <p class="mt-1 text-xs text-gray-500">{{ constraints }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "VModalInputPlaceholder",
  props: {
    name: {
      type: String,
      default: "Label"
    },
    constraints: {
      type: String,
      default: ""
    },
    itemIcon: {
      type: String,
      default: ""
    }
  }
};
</script>
