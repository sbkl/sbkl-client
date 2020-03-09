<template>
  <button
    class="font-bold py-2 px-4 uppercase tracking-wider text-sm w-full text-center rounded bg-gray-800 text-white shadow hover:bg-gray-800"
    :class="{
      'bg-gray-300 cursor-not-allowed hover:bg-gray-300': loading || disabled
    }"
    :disabled="loading || disabled"
  >
    <v-loader :class="{ 'loading  loading-gray-400': loading }" />
    {{ title }}
  </button>
</template>
<script>
export default {
  name: "VButton",
  props: {
    title: {
      required: true,
      type: String
    },
    loading: {
      default: false
    },
    disabled: {
      default: false
    }
  }
};
</script>
