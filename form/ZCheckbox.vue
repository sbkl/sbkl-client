<template>
  <div class="flex flex-col">
    <label v-if="label" class="text-xs text-gray-600 uppercase font-normal mb-1" v-text="label" />
    <div class="flex items-center">
      <input
        class="pl-2 border-b outline-none bg-gray-200 text-gray-900 text-sm"
        :class="[{'border-red-500' : errors.form === form && errors.errors[errorAttribute]}, {'focus:border-teal-500 hover:border-teal-300' : !errors.form === form && !errors.errors[errorAttribute]}, {'w-full' : !this.$slots.default}]"
        :placeholder="placeholder"
        type="checkbox"
        :name="nameFormatted"
        :value="value"
        :checked="checked"
        :disabled="disabled"
        @change="$emit('input', $event.target.checked)"
      />
      <slot></slot>
    </div>
    <p
      class="my-1 text-xs text-red-600"
      v-if="errors.form === form && errors.errors[errorAttribute]"
      v-text="errors.errors[errorAttribute]"
    />
  </div>
</template>
<script>
export default {
  name: "ZCheckbox",
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
    placeholder: {
      default: ""
    },
    errorField: {
      default: null
    },
    checked: {
      default: false
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
      form: this.$parent.formType
    };
  }
};
</script>

