<script>
export default {
  name: "ModalTransition",
  functional: true,
  render(createElement, context) {
    return createElement(
      "transition",
      {
        props: {
          enterClass: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
          enterToClass: "opacity-100 translate-y-0 sm:scale-100",
          enterActiveClass: "transition ease-out duration-300",
          leaveClass: "opacity-100 translate-y-0 sm:scale-100",
          leaveToClass: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
          leaveActiveClass: "transition ease-in duration-200"
        }
      },
      context.children
    );
  }
};
</script>