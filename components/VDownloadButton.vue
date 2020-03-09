<template>
  <span class="shadow-sm rounded-md">
    <button
      type="button"
      @click.prevent="downloadFile"
      :class="[
                downloading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 focus:bg-gray-800'
              ]"
      :disabled="downloading"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray focus:border-gray-800 transition duration-150 ease-in-out"
    >
      <v-loader
        v-if="downloading"
        class="-mt-2 border-t-1 border-white mr-4"
        :class="{ 'loading loading-gray-400': downloading }"
      />
      {{ title }}
    </button>
  </span>
</template>
<script>
export default {
  name: "VDownloadButton",
  props: ["download", "filename", "title"],
  data() {
    return {
      downloading: false
    };
  },
  methods: {
    async downloadFile() {
      this.downloading = true;
      let data = await this.download();
      await this.setupFile(
        data,
        `${this.filename} - stock - ${Date.now()}.xlsx`
      );
      this.downloading = false;
    },
    async setupFile(data, fileName) {
      const response = await fetch(data);
      const blob = await response.blob();
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(blob);
      a.setAttribute("download", fileName);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }
  }
};
</script>
