<template>
  <div>
    <label v-if="label" class="block text-xs font-medium leading-5 text-gray-700">{{ label }}</label>
    <div
      class="flex mt-1 form-input"
      :class="[active ? 'outline-none shadow-outline-teal border-teal-300' : '']"
    >
      <svg
        class="w-5 h-5 text-gray-400"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <VueDatePicker
        :noCalendarIcon="true"
        :value="date"
        @input="$event => $emit('onSelect', $event)"
        @onOpen="active = true"
        @onClose="active = false"
        color="#0694a2"
      />
      <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  name: "VDatePicker",
  model: {
    prop: "date",
    event: "onSelect"
  },
  props: {
    date: {
      required: true
    },
    label: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      active: false
    };
  }
};
</script>
<style lang="CSS">
.vd-wrapper .vd-picker__input-wrapper > input {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  color: #374151 !important;
}
</style>
