<template>
  <span class="inline-flex rounded-md shadow-sm">
    <button
      :disabled="loading || disabled"
      type="button"
      class="w-full justify-center inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white transition ease-in-out duration-150"
      :class="[
        customStyles,
        {
          'bg-gray-300 cursor-not-allowed hover:bg-gray-300':
            loading || disabled,
        },
      ]"
    >
      <v-loader :class="{ 'loading  loading-gray-400': loading }" />
      {{ title }}
    </button>
  </span>
</template>
<script>
export default {
  name: "VButton",
  props: {
    title: {
      required: true,
      type: String,
    },
    loading: {
      default: false,
    },
    disabled: {
      default: false,
    },
    primaryColor: {
      type: String,
      default: "gray",
    },
  },
  computed: {
    customStyles() {
      if (this.primaryColor === "indigo") {
        return "bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700";
      }
      if (this.primaryColor === "teal") {
        return "bg-teal-600 hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal active:bg-teal-700";
      }
      if (this.primaryColor === "red") {
        return "bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700";
      }
      if (this.primaryColor === "orange") {
        return "bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700";
      }
      if (this.primaryColor === "yellow") {
        return "bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:border-yellow-700 focus:shadow-outline-yellow active:bg-yellow-700";
      }
      if (this.primaryColor === "blue") {
        return "bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700";
      }
      if (this.primaryColor === "green") {
        return "bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700";
      }
      if (this.primaryColor === "purple") {
        return "bg-purple-600 hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700";
      }
      if (this.primaryColor === "pink") {
        return "bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-pink active:bg-pink-700";
      }
      return "bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700";
    },
  },
};
</script>
