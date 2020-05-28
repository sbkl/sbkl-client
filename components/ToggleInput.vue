<template>
  <div class="flex items-center">
    <label
      v-if="label != ''"
      class="block mr-2 text-sm font-medium leading-5 text-gray-700"
      v-text="label"
    />
    <!-- On: "bg-indigo-600", Off: "bg-gray-200" -->
    <span
      role="checkbox"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
      :aria-checked="toggled.toString()"
      class="relative flex-shrink-0 inline-block h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline"
      :class="toggled ? customStyles : ' bg-gray-200'"
    >
      <!-- On: "translate-x-5", Off: "translate-x-0" -->
      <span
        aria-hidden="true"
        class="inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow"
        :class="toggled ? 'translate-x-5' : 'translate-x-0'"
      ></span>
    </span>
  </div>
</template>

<script>
export default {
  name: "ToggleInput",
  model: {
    prop: "toggled",
    event: "toggle"
  },
  computed: {
    customStyles() {
      if (this.primaryColor === "indigo") {
        return "bg-indigo-600";
      }
      if (this.primaryColor === "teal") {
        return "bg-teal-600";
      }
      if (this.primaryColor === "red") {
        return "bg-red-600";
      }
      if (this.primaryColor === "orange") {
        return "bg-orange-600";
      }
      if (this.primaryColor === "yellow") {
        return "bg-yellow-600";
      }
      if (this.primaryColor === "blue") {
        return "bg-blue-600";
      }
      if (this.primaryColor === "green") {
        return "bg-green-600";
      }
      if (this.primaryColor === "purple") {
        return "bg-purple-600";
      }
      if (this.primaryColor === "pink") {
        return "bg-pink-600";
      }
      return "bg-gray-600";
    }
  },
  props: {
    toggled: {
      default: false,
      type: Boolean
    },
    label: {
      default: "",
      type: String
    },
    primaryColor: {
      type: String,
      default: "gray"
    }
  },
  methods: {
    toggle() {
      this.$emit("toggle", !this.toggled);
    }
  }
};
</script>
