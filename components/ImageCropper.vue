<template>
  <div>
    <div v-if="cropperOn" class="absolute inset-0 z-10 flex items-center justify-center bg-black">
      <div v-if="showActionButtons" class="absolute top-0 right-0 p-6">
        <button
          class="p-2 transition duration-150 ease-in-out bg-gray-600 rounded-full shadow-sm hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700"
          @click.prevent="resetPhotoState"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
        <button
          class="p-2 ml-2 transition duration-150 ease-in-out bg-teal-600 rounded-full shadow-sm hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal active:bg-teal-700"
          @click.prevent="crop"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
      <div class="h-full w-80vh">
        <img class="object-cover object-center mx-auto" id="image" :src="image" alt="Image" />
      </div>
    </div>
    <div class="h-full">
      <label class="block" :class="labelClass">{{ labelName }}</label>
      <div
        v-if="!croppedImage"
        class="flex items-center justify-center px-6 pt-5 pb-6 mt-2 border-2 border-gray-300 border-dashed rounded-md"
        :class="[imageHeight]"
      >
        <div class="text-center">
          <svg
            class="w-12 h-12 mx-auto text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p class="mt-1 text-sm text-gray-600">
            <label
              for="photo"
              class="font-medium text-teal-600 transition duration-150 ease-in-out cursor-pointer hover:text-teal-500 focus:outline-none focus:underline"
            >Upload a picture</label>
            <input
              class="hidden"
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              @change="onFileChange"
            />
          </p>
          <p class="mt-1 text-xs text-gray-500">PNG or JPG up to 10MB</p>
        </div>
      </div>
      <div v-else class="relative overflow-hidden bg-black rounded-md" :class="[imageHeight]">
        <img
          class="object-cover object-center w-auto h-full mx-auto"
          :src="croppedImage"
          alt="Image"
        />
        <label
          for="photo"
          class="absolute bottom-0 right-0 p-2 mb-2 mr-2 transition duration-150 ease-in-out bg-teal-600 rounded-full shadow-sm cursor-pointer hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal active:bg-teal-700"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </label>
        <input
          class="hidden"
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          @change="onFileChange"
        />
      </div>
      <div>
        <div
          v-if="
            $parent.formType === 'post' &&
              errors['image'] &&
              Array.isArray(errors['image'])
          "
        >
          <p
            v-for="error in errors['image']"
            :key="error"
            v-text="error"
            class="text-xs text-red-600"
          />
        </div>
        <p
          class="text-xs text-red-600"
          v-if="
            $parent.formType === failedFormName &&
              errors['image'] &&
              !Array.isArray(errors['image'])
          "
          v-text="errors['image']"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Cropper from "cropperjs";
export default {
  name: "ImageCropper",
  model: {
    prop: "croppedImage",
    event: "onConfirmCropped"
  },
  props: ["croppedImage", "aspectRatio"],
  props: {
    croppedImage: {
      type: String,
      default: null
    },
    aspectRatio: {
      type: Number,
      default: 2 / 3
    },
    labelName: {
      type: String,
      default: "Photo"
    },
    labelClass: {
      type: String,
      default: "text-xs font-medium leading-5 text-gray-700"
    },
    imageHeight: {
      type: String,
      default: "h-72"
    }
  },
  data() {
    return {
      showActionButtons: false,
      cropperOn: false,
      formType: "",
      photo_file: null,
      fileError: null,
      cropper: false,
      image: null,
      cropperOptions: {
        dragMode: "move",
        zoomable: true,
        aspectRatio: this.aspectRatio,
        autoCropArea: 1,
        restore: false,
        guides: false,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false
      }
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.cropped = this.src;
    // });
  },
  methods: {
    crop() {
      const data = this.cropper
        // .getCroppedCanvas({ width: 4096, height: 3072 })
        .getCroppedCanvas({ width: 1024, height: 768 })
        .toDataURL("image/jpeg");
      this.$emit("onConfirmCropped", data);
      this.cropperOn = false;
    },
    setAspectRatio() {
      if (this.cropperOptions.aspectRatio === 2 / 3) {
        this.cropper.setAspectRatio(4 / 3);
        this.cropperOptions.aspectRatio = 4 / 3;
      } else {
        this.cropper.setAspectRatio(2 / 3);
        this.cropperOptions.aspectRatio = 2 / 3;
      }
    },
    resetPhotoState() {
      this.cropper.reset();
    },
    initCropper() {
      var image = document.querySelector("#image");
      this.cropper = new Cropper(image, { ...this.cropperOptions });
      this.showActionButtons = true;
    },
    onFileChange(e) {
      if (this.cropper) this.cropper.destroy();
      this.cropperOn = true;
      this.fileError = "";
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.photo_file = files[0];
      var reader = new FileReader();
      reader.onload = e => (this.image = e.target.result);
      reader.readAsDataURL(files[0]);
      const title = files[0].name
        .split("")
        .reverse()
        .join("")
        .split(".")
        .pop()
        .split("")
        .reverse()
        .join("");
      this.$emit("setTitle", title);
      setTimeout(this.initCropper, 1000);
    }
  }
};
</script>
