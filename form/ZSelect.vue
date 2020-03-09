<template>
  <div class="mb-4">
    <div class="relative">
      <label v-if="label" class="text-xs text-gray-600 uppercase font-normal mb-1" v-text="label" />
      <select
        :disabled="disabled"
        :name="nameFormatted"
        :value="value === null ? label : value"
        class="h-10 block appearance-none cursor-pointer w-full bg-gray-200 rounded-none py-2 pl-2 border-b outline-none text-sm"
        :class="[
        formType === failedFormName && errors[errorAttribute] ? 'border-red-500' : 'focus:border-teal-500 hover:border-teal-300',
        selected && !disabled ? 'text-gray-900' : 'text-gray-500',
        disabled ? 'cursor-not-allowed text-gray-600' : '']"
        @change="hasbeenSelected"
      >
        <option :disabled="selected" v-text="placeholder" />
        <option v-for="(item, i) in data" :key="i" v-text="item" :selected="isSelected(item)" />
      </select>
      <div
        v-if="!disabled"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-gray-700"
      >
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
    <p
      class="my-1 text-xs text-red-600"
      v-if="formType === failedFormName && errors[errorAttribute]"
      v-text="errors[errorAttribute]"
    />
  </div>

  <!-- </div> -->
</template>
<script>
export default {
  name: "ZSelect",
  props: {
    disabled: {
      default: false
    },
    value: {
      default: ""
    },
    name: {
      default: "",
      type: String
    },
    label: {
      default: null,
      type: String
    },
    placeholder: {
      default: "Select"
    },
    data: {
      default: () => []
    },
    errorField: {
      default: null
    }
  },
  computed: {
    errorAttribute() {
      return this.errorField
        ? this.errorField
        : this.name
        ? this.name
        : this.label.toLowerCase().replace(/ /g, "_");
    },
    nameFormatted() {
      return this.name != ""
        ? this.name
        : this.label.toLowerCase().replace(/ /g, "_");
    }
  },
  data() {
    return {
      formType: this.$parent.formType,
      selected: false
    };
  },
  methods: {
    hasbeenSelected(e) {
      this.selected = true;
      this.clearErrors();
      this.$emit("input", e.target.value);
    },
    isSelected(item) {
      if (item == this.value) {
        this.selected = true;
        return true;
      }
      return false;
    }
  }
};
</script>

