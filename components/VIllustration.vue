<template>
  <div
    class="w-full flex flex-col items-center bg-white shadow-lg py-12 rounded"
  >
    <img :src="src" class="w-88" />
    <p class="mt-10 text-xl text-gray-700">{{ description }}</p>
  </div>
</template>
<script>
export default {
  name: "VIllustration",
  props: ["src", "description"]
};
</script>
