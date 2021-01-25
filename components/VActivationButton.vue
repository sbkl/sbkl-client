<template>
  <button
    @click.prevent="clicked"
    class="mx-2 focus:outline-none"
    :class="[item.deactivated_at === null ? 'text-green-400' : 'text-red-400']"
  >
    <svg
      v-if="loading"
      class="w-5 h-5 text-gray-400 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-current">
      <path
        d="M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"
      />
      <path
        d="M363.5 148.5C334.8 119.8 296.6 104 256 104c-40.6 0-78.8 15.8-107.5 44.5C119.8 177.2 104 215.4 104 256s15.8 78.8 44.5 107.5C177.2 392.2 215.4 408 256 408c40.6 0 78.8-15.8 107.5-44.5C392.2 334.8 408 296.6 408 256s-15.8-78.8-44.5-107.5z"
      />
    </svg>
  </button>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "VActivationButton",
  props: {
    item: {
      default: null
    },
    table: {
      required: true
    },
    isRelationshipTable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions({
      deactivate: "admin/deactivate",
      activate: "admin/activate"
    }),
    async clicked() {
      if(!this.loading) {
        this.loading = true;
        if (this.item.deactivated_at === null) {
          await this.deactivate({ routeName: this.$route.name, modelName: this.table.name, model: this.item });
        } else {
          await this.activate({ routeName: this.$route.name, modelName: this.table.name, model: this.item });
        }
        this.loading = false;
      }
    },
  }
};
</script>
