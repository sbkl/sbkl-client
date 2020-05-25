<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      class="block text-xs font-medium leading-5"
      v-text="label.replace('_', ' ')"
    />
    <div class="relative mt-1 rounded-md shadow-sm">
      <input
        class="block w-full text-xs form-input sm:leading-5"
        :class="[
        {'border-red-500' : formType === failedFormName && errors[errorAttribute]},
        disabled ? 'cursor-not-allowed text-gray-300' : 'text-gray-700',
        { 'w-full': !this.$slots.default }
      ]"
        :placeholder="placeholder"
        :type="type"
        :name="nameFormatted"
        :value="value"
        :readonly="disabled"
        @input="inputChange($event, nameFormatted)"
      />
    </div>
    <div
      v-if="
        formType === failedFormName &&
          errors[errorAttribute] &&
          Array.isArray(errors[errorAttribute])
      "
    >
      <p
        v-for="error in errors[errorAttribute]"
        :key="error"
        v-text="error"
        class="my-1 text-xs text-red-600"
      />
    </div>
    <p
      class="my-1 text-xs text-red-600"
      v-if="
        formType === failedFormName &&
          errors[errorAttribute] &&
          !Array.isArray(errors[errorAttribute])
      "
      v-text="errors[errorAttribute]"
    />
  </div>
</template>
<script>
export default {
  name: "VInput",
  props: {
    value: {
      default: ""
    },
    label: {
      default: "",
      type: String
    },
    name: {
      default: "",
      type: String
    },
    type: {
      default: "text"
    },
    placeholder: {
      default: ""
    },
    errorField: {
      default: null
    },
    disabled: {
      default: false
    }
  },
  computed: {
    errorAttribute() {
      return this.errorField
        ? this.errorField
        : this.label.toLowerCase().replace(/ /g, "_");
    },
    nameFormatted() {
      return this.name
        ? this.name
        : this.label.toLowerCase().replace(/ /g, "_");
    }
  },
  data() {
    return {
      formType: this.$parent.formType
    };
  },
  methods: {
    inputChange(e, field) {
      this.clearFieldErrors(field);
      this.$emit("input", e.target.value);
    }
  }
};
</script>
