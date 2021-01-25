<template>
<div>
  <!-- <label :for="attribute" class="block text-sm font-medium text-gray-700">{{ labelText }}</label> -->
  <label class="block text-sm font-medium text-gray-700">{{ labelText }}</label>
  <div class="grid grid-cols-2">

  <div v-for="choice in choices" @click="onSelect(choice)" class="relative flex items-start py-2 mt-1">
    <div class="flex items-center h-5">
      <input @change="onSelect(choice)" :disabled="disabled" :id="choice" :name="choice" type="checkbox" :checked="checked(choice)" class="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500">
    </div>
    <div class="ml-3 text-sm">
      <label for="comments" class="text-gray-700 ">{{ choice }}</label>
      <!-- <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p> -->
    </div>
  </div>
  </div>
</div>
</template>
<script>
export default {
  name: "MultipleChoiceInput",
  props: {
    value: {
      default: "",
      type: Array,
    },
    fetchValues: {
      default: () => {},
      type: Function,
    },
    label: {
      default: "",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    labelText() {
      return this.label.replace(/_/g, " ").charAt(0).toUpperCase() + this.label.replace(/_/g, " ").substring(1)
    },
  },
  async created() {
    this.loading = true;
    const choices = await this.fetchValues()
    this.choices = choices
    this.loading = false;
  },
  data() {
    return {
      choices: [],
      loading: false,
    }
  },
  methods: {
    checked(value) {
      return this.value.filter(v => v === value).length > 0
    },
    onSelect(choice) {
      const values = [...this.value];
      const index = values.findIndex(v => v === choice)
      if(index > -1) {
        values.splice(index, 1)
      } else {
        values.push(choice)
      }
      this.$emit('input', values)
    }
  }
}
</script>