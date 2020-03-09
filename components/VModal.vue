<template>
  <div
    v-if="isOpen"
    class="z-10 fixed inset-0 flex items-center justify-center"
  >
    <div
      class="fixed bg-black opacity-50 h-screen w-screen"
      @click.self="closeModal"
    ></div>
    <div class="z-10 min-h-20 bg-white rounded" :class="[modalContainerStyle]">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "VModal",
  props: {
    open: {
      default: null
    },
    modalContainerStyle: {
      type: String,
      default: "w-full lg:w-1/2"
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  watch: {
    open() {
      this.isOpen = !this.isOpen;
      this.isOpen ? document.body.classList.add("overflow-hidden") : null;
      this.clearAllErrors();
    }
  },
  created() {
    if (process.client) {
      const closeModelOnEsc = e => {
        if (e.keyCode === 27) {
          this.isOpen = false;
        }
      };
      document.addEventListener("keyup", closeModelOnEsc);
      this.$once("hook:beforeDestroy", () => {
        document.removeEventListener("keyup", closeModelOnEsc);
      });
    }
    this.$on("closeModal", () => this.closeModal());
  },
  methods: {
    closeModal() {
      document.body.classList.remove("overflow-hidden");
      this.$parent.$emit("closeModal");
    }
  }
};
</script>
