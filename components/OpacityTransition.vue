<script>
export default {
  name: "OpacityTransition",
  functional: true,
  render(createElement, context) {
    return createElement(
      "transition",
      {
        props: {
          enterClass: "opacity-0",
          enterToClass: "opacity-100",
          enterActiveClass: "transition ease-out duration-300",
          leaveClass: "opacity-100",
          leaveToClass: "opacity-0",
          leaveActiveClass: "transition ease-in duration-200"
        }
      },
      context.children
    );
  }
};
</script>