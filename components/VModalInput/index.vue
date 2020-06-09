<template>
  <div>
    <v-modal-input-header :type="type" @openModal="toggleModal = !toggleModal" :label="label" />
    <v-modal-input-single
      v-if="type === 'single'"
      :value="value"
      @openModal="toggleModal = !toggleModal"
      :titleFields="titleFields"
      :closing="closing"
    />
    <v-modal-input-multiple
      v-if="type === 'list' || type === 'tags'"
      :type="type"
      :items="value"
      :itemIcon="itemIcon"
      :titleFields="titleFields"
      @openModal="toggleModal = !toggleModal"
      @onRemove="removeItem"
      :name="singularLabel"
      :constraints="constraints"
    />
    <v-modal-input-standard
      :keyField="keyField"
      :titleFields="titleFields"
      :toggleModal="toggleModal"
      :label="pluralLabel"
      :options="options"
      @closing="closing = !closing"
      @selected="itemSelected"
      :onAddItem="onAddItem"
      :onRemoveItem="onRemoveItem"
    />
  </div>
</template>
<script>
export default {
  name: "VModalInput",
  props: {
    value: {
      required: true
    },
    label: {
      type: Array,
      default: () => ["Labels", "Label"]
    },
    labelClass: {
      type: String,
      default: "block text-xs font-medium leading-5 text-gray-700"
    },
    type: {
      type: String,
      default: "single"
    },
    options: {
      default: () => [],
      type: Array
    },
    itemIcon: {
      type: String,
      default: ""
    },
    titleFields: {
      type: Array,
      default: () => []
    },
    keyField: {
      default: "id",
      type: String
    },
    constraints: {
      type: String,
      default: ""
    },
    onAddItem: {
      default: null,
      type: Function
    },
    onRemoveItem: {
      default: null,
      type: Function
    }
  },
  computed: {
    singularLabel() {
      const [plural, singular] = this.label;
      return singular;
    },
    pluralLabel() {
      const [plural, singular] = this.label;
      return plural;
    }
  },
  data() {
    return {
      toggleModal: false,
      closing: false,
      formType: this.$parent.formType
    };
  },
  methods: {
    itemSelected(item) {
      if (this.type === "single") {
        this.$emit("input", item);
        this.toggleModal = !this.toggleModal;
      } else if (this.type === "list") {
        const items = [...this.value];
        const index = items.findIndex(
          object => object[this.keyField] === item[this.keyField]
        );
        if (index === -1) {
          items.push(item);
        }
        this.$emit("input", items);
        this.toggleModal = !this.toggleModal;
      }
    },
    removeItem(item) {
      const items = [
        ...this.value.filter(
          object => object[this.keyField] != item[this.keyField]
        )
      ];
      this.$emit("input", items);
    }
  }
};
</script>
