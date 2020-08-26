<template>
  <div class="inline-flex">
    <span class="inline-flex ml-3 rounded-md shadow-sm">
      <button
        @click.prevent="onPaste"
        type="button"
        class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out border border-transparent rounded-md focus:outline-none focus:shadow-outline-blue"
        :class="[
      loading
        ? 'bg-gray-500 cursor-not-allowed'
        : 'bg-gray-700 focus:bg-gray-800 hover:bg-gray-600 active:bg-gray-700'
    ]"
      >
        <svg v-if="!loading" class="-ml-0.5 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
          <path
            d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Paste
      </button>
    </span>
    <div
      v-if="error != ''"
      class="fixed inset-0 flex items-center justify-center bg-black-opacity-50"
    >
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        >
          <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
          <div
            class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div>
              <div
                class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-red-600">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3
                  class="text-lg font-medium leading-6 text-gray-900"
                  id="modal-headline"
                >Missing fields</h3>
                <div class="mt-2">
                  <p class="text-sm leading-5 text-gray-500">{{ error }}</p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <span class="flex w-full rounded-md shadow-sm">
                <button
                  @click.prevent="error = ''"
                  type="button"
                  class="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray sm:text-sm sm:leading-5"
                >Go back to dashboard</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "VPasteUpload",
  props: ["attributes"],
  data() {
    return {
      loading: false,
      error: "",
    };
  },
  methods: {
    async onPaste() {        
      try {
        this.loading = true;
        let data = await navigator.clipboard.readText();
        let rows = data.split("\n").map((d) => d.trim().split("\t"));
        let headerRow = rows[0];
        rows.shift();
        const missingFields = this.attributes.filter(
          (a) => !headerRow.includes(a)
        );
        if (missingFields.length > 0) {
          this.error =
            "The data are missing the following fields: " +
            missingFields.reduce((carry, f) => {
              if (carry === "") {
                carry = f;
              } else {
                carry = carry + ", " + f;
              }
              return carry;
            }, "");
            this.loading = false;
          return;
        }
        const items = rows.reduce((carry, row) => {
          let item = {};
          headerRow.forEach((a, index) => {
            item[a] = row[index];
          });
          carry.push(item);
          return carry;
        }, []);
        this.$emit("pasted", { items });
        this.loading = false;
      } catch (e) {
        console.error("Failed to read clipboard contents: ", e);
        this.loading = false;
      }
    },
  },
};
</script>