<template>
  <div
    class="fixed inset-0 z-10 overflow-y-auto"
    :class="{ hidden: !containerShow }"
  >
    <div
      class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0"
    >
      <opacity-transition>
        <div
          v-if="isOpen"
          class="fixed inset-0 transition-opacity"
          aria-hidden="true"
        >
          <div
            @click.self="closeModal"
            class="absolute inset-0 bg-gray-500 opacity-75"
          ></div>
        </div>
      </opacity-transition>
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >

      <modal-transition>
        <div
          v-if="isOpen"
          class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:align-middle sm:max-w-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div
            class="flex flex-col min-h-0 overflow-hidden text-left align-bottom sm:max-h-80vh sm:align-middle"
            :class="modalContainerStyle"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <slot></slot>
          </div>
        </div>
      </modal-transition>
    </div>
  </div>
</template>
<script>
export default {
  name: "VModal",
  props: {
    open: {
      default: null,
    },
    modalContainerStyle: {
      type: String,
      default: "w-full lg:w-1/2",
    },
  },
  data() {
    return {
      isOpen: false,
      containerShow: false,
    };
  },
  watch: {
    open() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        document.body.classList.add("overflow-hidden");
        this.containerShow = true;
      } else {
        setTimeout(() => {
          this.containerShow = false;
        }, 400);
      }
      this.clearAllErrors();
    },
  },
  created() {
    if (process.client) {
      const closeModelOnEsc = (e) => {
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
    },
  },
};
</script>
