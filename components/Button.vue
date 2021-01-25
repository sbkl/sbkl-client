<script>
export default {
  name: "Button",
  props: {
    buttonStyle: {
      type: String,
      default: ''
    },
    focusStyle: {
      type: String,
      default: "focus:ring-2 focus:ring-offset-2"
    },
    textSize: {
      type: String,
      default: "text-sm"
    },
    padding: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "button",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    iconStyle: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    cursor: {
      type: String,
      default: "cursor-pointer",
    },
  },
  data() {
    return {
      colours: {
        gray: {
          icon: "text-white",
          active: "hover:bg-gray-700 focus:ring-gray-500",
          text: "text-white bg-gray-600 border-transparent",
        },
        red: {
          icon: "text-white",
          active: "hover:bg-red-700 focus:ring-red-500",
          text: "text-white bg-red-600 border-transparent",
        },
        white: {
          icon: "text-gray-500",
          active:
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
          text: "text-gray-700 bg-white border-gray-300",
        },
        transparent: {
          icon: "text-gray-500",
          active:
            "hover:text-gray-500 focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50",
          text: "text-gray-700 bg-transparent border-transparent",
        },
      },
    };
  },
  methods: {
    getNode(vNode, createElement, left = true) {
      if (vNode === undefined) {
        return [];
      }
      const hasTag = Boolean(vNode.tag);
      const isCustomComponent = Boolean(vNode.componentOptions);
      if (hasTag) {
        if (isCustomComponent) {
          const { tag, propsData, children } = vNode.componentOptions;
          vNode = createElement(
            tag,
            {
              props: {
                ...propsData,
              },
              attrs: {
                disabled: this.disabled,
                class: `${this.iconStyle ? this.iconStyle : "w-5 h-5"} ${left ? "mr-2 -ml-1" : "ml-2 -mr-1"}`,
              },
            },
            children
          );
          left
            ? this.$scopedSlots.default().shift()
            : this.$scopedSlots.default().pop();
        } else {
          vNode.data.attrs.class = `w-5 h-5 -ml-1 ${left ? "mr-2" : "ml-2"}`;
        }
      } else {
        vNode = [];
      }
      return vNode;
    },
    getLoadingNode(createElement) {
      return createElement(
        "svg",
        {
          attrs: {
            class: `animate-spin -ml-1 mr-3 h-5 w-5`,
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
          },
        },
        [
          createElement("circle", {
            attrs: {
              class: `opacity-25`,
              cx: "12",
              cy: "12",
              r: "10",
              stroke: "currentColor",
              "stroke-width": "4",
            },
          }),
          createElement("path", {
            attrs: {
              class: `opacity-75`,
              fill: "currentColor",
              d:
                "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
            },
          }),
        ]
      );
    },
  },
  render(createElement) {
    if (typeof this.$scopedSlots.default !== "function") {
      throw new Error("The Button element is missing its content");
    }
    const loadingNode = this.getLoadingNode(createElement);
    const vNodes = [...this.$scopedSlots.default()];
    const firstChildren = this.getNode(vNodes.shift(), createElement);
    const lastChildren = this.getNode(vNodes.pop(), createElement, false);

    return createElement("span", {}, [
      createElement(
        "button",
        {
          attrs: {
            type: this.type,
            class: `inline-flex justify-center items-center ml-3 transition duration-150 border font-medium ease-in-out focus:outline-none rounded-md shadow-sm ${this.cursor} ${this.buttonStyle} ${this.padding ? 'px-4 py-2' : ''} ${this.textSize} ${this.focusStyle}`,
          },
          on: {
            click: () => (!this.disabled ? this.$emit("clicked") : null),
          },
        },
        [
          this.loading ? loadingNode : firstChildren,
          ...this.$scopedSlots.default(),
          lastChildren,
        ]
      ),
    ]);
  },
};
</script>
