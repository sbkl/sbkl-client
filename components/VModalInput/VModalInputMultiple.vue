<template>
  <div class="text-xs leading-5 text-gray-900">
    <v-modal-input-list
      v-if="type === 'list' && items && items.length > 0"
      :items="items"
      :titleFields="titleFields"
      :itemIcon="itemIcon"
      @onRemove="$event => $emit('onRemove', $event)"
    />
    <template v-else>
      <v-modal-input-tags
        v-if="type === 'tags' && items && items.length > 0"
        :items="items"
        :titleFields="titleFields"
        @onRemove="$event => $emit('onRemove', $event)"
      />
      <v-modal-input-placeholder
        v-else
        class="h-48"
        :name="name"
        :itemIcon="itemIcon"
        :constraints="constraints"
      />
    </template>
  </div>
</template>
<script>
export default {
  name: "VModalInputMultiple",
  props: {
    name: {
      type: String,
      default: "Label"
    },
    type: {
      type: String,
      default: "single"
    },
    items: {
      type: Array,
      required: true
    },
    itemIcon: {
      type: String,
      default: ""
    },
    titleFields: {
      type: Array,
      required: true
    },
    constraints: {
      type: String,
      default: ""
    }
  }
};
</script>
