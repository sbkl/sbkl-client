<script>
import { createPopper } from "@popperjs/core";
export default {
  name: "VPopper",
  watch: {
    open(open) {
      if (open) {
        this.$nextTick(() => {
          this.setupPopper();
        });
      }
    }
  },
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  beforeDestroy() {
    if (this.popper != undefined) {
      this.popper.destroy();
    }
  },
  methods: {
    setupPopper() {
      if (this.popper != undefined) {
        this.popper.destroy();
      }
      this.popper = createPopper(
        this.$parent.$refs.button,
        this.$parent.$refs.dropdown,
        {
          placement: "bottom",
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                padding: 8
              }
            }
          ]
        }
      );
    }
  },
  render() {
    return this.$slots.default[0];
  }
};
</script>
