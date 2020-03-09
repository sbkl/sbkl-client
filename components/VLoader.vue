<template>
  <div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<script>
export default {
  name: "VLoader"
};
</script>
<style>
.loading {
  display: inline-block;
  position: relative;
  width: 16px;
  height: 16px;
}

.loading div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  margin: 4px;
  border: 2px solid #fff;
  border-radius: 50%;
  animation: loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}

.loading.loading-gray-900 div {
  border-color: #1a202c transparent transparent transparent;
}

.loading.loading-gray-400 div {
  border-color: #cbd5e0 transparent transparent transparent;
}

.loading div:nth-child(1) {
  animation-delay: -0.45s;
}

.loading div:nth-child(2) {
  animation-delay: -0.3s;
}

.loading div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
