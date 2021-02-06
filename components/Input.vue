<template>
  <div>
    <label :for="attribute" class="block text-sm font-medium text-gray-700">{{
      labelText
    }}</label>
    <div class="relative mt-1 rounded-md shadow-sm">
      <input
        ref="input"
        :disabled="disabled"
        :type="type"
        :step="step"
        :name="attribute"
        :id="attribute"
        class="block w-full rounded-md focus:outline-none sm:text-sm"
        :class="[
          formType === failedFormName && errors[attribute]
            ? 'pr-10 text-red-900 placeholder-red-300 border-red-300 focus:ring-red-500 focus:border-red-500 '
            : 'shadow-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300',
          { 'text-gray-500 cursor-not-allowed': disabled },
        ]"
        :value="value"
        @input="inputChange"
        aria-invalid="true"
        :aria-describedby="`${attribute}-error`"
      />
      <div
        v-if="formType === failedFormName && errors[attribute]"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <!-- Heroicon name: exclamation-circle -->
        <svg
          class="w-5 h-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <p
      v-if="
        formType === failedFormName &&
        errors[attribute] &&
        !Array.isArray(errors[attribute])
      "
      class="mt-2 text-sm text-red-600"
      id="email-error"
    >
      {{ errors[attribute] }}
    </p>
  </div>
</template>
<script>
export default {
  name: "Input",
  props: {
    type: {
      type: String,
      default: "text",
    },
    step: {
      type: String,
      default: "1",
    },
    label: {
      type: String,
      default: "",
    },
    attribute: {
      type: String,
      default: "",
    },
    value: {
      type: [Number, String],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    labelText() {
      if (this.label) {
        return this.label.replace(/_/g, " ");
      }
      return (
        this.attribute.replace(/_/g, " ").charAt(0).toUpperCase() +
        this.attribute.replace(/_/g, " ").substring(1)
      );
    },
  },
  data() {
    return {
      formType: this.$parent.formType,
    };
  },
  methods: {
    inputChange(e) {
      this.clearFieldErrors(this.attribute);
      this.$emit("input", e.target.value);
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>
