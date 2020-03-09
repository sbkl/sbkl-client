<template>
  <div class="flex items-center mb-4">
    <button @click.prevent="unselectParentItem">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 512 512">
        <polyline
          points="328 112 184 256 328 400"
          style="fill:none;stroke:#000;stroke-linecap:square;stroke-miterlimit:10;stroke-width:48px"
        />
      </svg>
    </button>
    <h3 class="text-gray-700 text-2xl font-bold ml-6">{{getTitle}}</h3>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "VRelationshipHeader",
  props: ["title"],
  computed: {
    ...mapGetters({
      parentItemSelected: "admin/parentItemSelected"
    }),
    getTitle() {
      const [attribute, separator] = this.title;
      const concatenatedFields = attribute
        .split(":")[0]
        .split(",")
        .reduce((carry, field) => {
          const keys = field.split(".");
          const value = keys.reduce((carry, key) => {
            carry = carry ? carry[key] : this.parentItemSelected.item[key];
            return carry;
          }, null);
          carry = `${carry} ${carry != "" ? separator || "" : ""} ${value}`;
          return carry;
        }, "");
      return (
        (this.title[0].split(":")[1]
          ? this.title[0].split(":")[1] + ": "
          : "") + concatenatedFields
      );
    }
  },
  methods: {
    ...mapActions({
      unselectParentItem: "admin/unselectParentItem"
    })
  }
};
</script>