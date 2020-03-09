<template>
  <div
    class="h-10 w-10 rounded-full bg-cool-gray-50 flex items-center justify-center"
  >{{first.charAt(0)}}{{second.charAt(0)}}</div>
</template>
<script>
export default {
  name: "VAvatarPlaceholder",
  props: ["first", "second"]
};
</script>