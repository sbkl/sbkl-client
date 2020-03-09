<template>
  <div class="leading-loose text-gray-800">
    <h2 class="font-bold text-3xl text-gray-900 mb-10">Support</h2>
    <p class="text-gray-900 mt-5">
      <strong>Contact Us</strong>
    </p>
    <p>
      If you have any questions or issues about the {{ appName }} app, do not
      hesitate to contact me at
      <a href="mailto: sebastien@sbkl.ltd" class="text-teal-500 underline"
        >sebastien@sbkl.ltd</a
      >
      .
    </p>
  </div>
</template>
<script>
export default {
  name: "Support",
  layout: "none",
  data() {
    return {
      appName: process.env.APP_NAME
    };
  }
};
</script>
