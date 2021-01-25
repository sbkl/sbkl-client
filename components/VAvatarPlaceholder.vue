<template>
  <div
    class="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
  >{{first.charAt(0)}}{{second.charAt(0)}}</div>
</template>
<script>
export default {
  name: "VAvatarPlaceholder",
  props: ["first", "second"]
};
</script>