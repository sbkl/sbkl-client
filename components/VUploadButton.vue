<template>
  <div>
    <input
      ref="fileInput"
      class="hidden"
      id="excel"
      name="excel"
      type="file"
      @change="onFileChange"
    />
    <label
      for="excel"
      class="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray focus:border-gray-800 transition duration-150 ease-in-out"
      :class="[
        uploading
          ? 'bg-gray-500 cursor-not-allowed'
          : 'bg-gray-700 focus:bg-gray-800'
      ]"
      :disabled="uploading"
    >
      <div class="flex items-center justify-center">
        <v-loader
          v-if="uploading"
          class="-mt-1 border-t-1 border-white mr-2"
          :class="{ 'loading loading-white': uploading }"
        />
        <svg
          v-if="!uploading"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-5 h-5 fill-current"
        >
          <path
            d="M18 14.97c0-.76-.3-1.51-.88-2.1l-3-3a3 3 0 0 0-4.24 0l-3 3A3 3 0 0 0 6 15a4 4 0 0 1-.99-7.88 5.5 5.5 0 0 1 10.86-.82A4.49 4.49 0 0 1 22 10.5a4.5 4.5 0 0 1-4 4.47z"
          />
          <path
            d="M11 14.41V21a1 1 0 0 0 2 0v-6.59l1.3 1.3a1 1 0 0 0 1.4-1.42l-3-3a1 1 0 0 0-1.4 0l-3 3a1 1 0 0 0 1.4 1.42l1.3-1.3z"
          />
        </svg>
        <p class="ml-2">{{ title }}</p>
      </div>
    </label>
  </div>
</template>
<script>
export default {
  name: "VUploadButton",
  props: {
    upload: {
      default: () => {}
    },
    filename: {
      default: "file"
    },
    title: {
      default: "Upload"
    }
  },
  data() {
    return {
      uploading: false,
      excel_file: null,
      fileError: null
    };
  },
  methods: {
    onFileChange(e) {
      this.fileError = "";
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.excel_file = files[0];
      this.onSubmit();
    },
    async onSubmit() {
      this.uploading = true;
      let formData = new FormData();
      this.excel_file != null &&
        formData.append(this.filename, this.excel_file);
      // await this.upload(formData);
      await this.$emit("upload", formData);
      this.uploading = false;
      this.excel_file = null;
      this.reset();
    },
    reset() {
      const input = this.$refs.fileInput;
      input.type = "text";
      input.type = "file";
    }
  }
};
</script>
