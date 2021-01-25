<template>
  <div
    class="flex items-center justify-between px-4 mx-2 mt-4 border-t border-gray-200 sm:px-0"
  >
    <div class="flex flex-1 w-0">
      <a
        v-if="links.prev"
        @click.prevent="
          navigate({ itemId, pageNumber: prevPage, ...filters })
        "
        class="inline-flex items-center pt-4 pr-1 -mt-px text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out border-t-2 border-transparent cursor-pointer select-none hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400"
      >
        <svg
          class="w-5 h-5 mr-3 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Previous
      </a>
    </div>
    <div class="hidden md:flex">
      <a
        v-for="page in pageNumbers"
        :key="page"
        @click.prevent="navigate({ itemId, pageNumber: page, ...filters })"
        class="inline-flex items-center px-4 pt-4 -mt-px text-sm font-medium leading-5 transition duration-150 ease-in-out border-t-2 cursor-pointer select-none hover:border-gray-300 focus:outline-none"
        :class="
          page === meta.current_page
            ? 'text-gray-600 border-gray-500 focus:text-gray-800 focus:border-gray-700'
            : 'text-gray-500 border-transparent hover:text-gray-700 focus:text-gray-700 focus:border-gray-400'
        "
        >{{ page }}</a
      >
    </div>
    <div class="flex justify-end flex-1 w-0">
      <a
        v-if="links.next"
        @click.prevent="
          navigate({ itemId, pageNumber: nextPage, ...filters })
        "
        class="inline-flex items-center pt-4 pl-1 -mt-px text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out border-t-2 border-transparent cursor-pointer select-none hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400"
      >
        Next
        <svg
          class="w-5 h-5 ml-3 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: "VPagination",
  props: {
    links: {
      required: true,
    },
    meta: {
      required: true,
    },
    fetchResults: {
      required: true,
      type: Function,
    },
    itemId: {
      default: null,
    },
    filters: {
      default: {},
    },
  },
  computed: {
    prevPage() {
      if (!this.links.prev) {
        return null;
      }
      return +this.links.prev
        .substring(this.links.prev.indexOf("page"))
        .replace("page=", "");
    },
    nextPage() {
      if (!this.links.next) {
        return null;
      }
      return +this.links.next
        .substring(this.links.next.indexOf("page"))
        .replace("page=", "");
    },
    pageNumbers() {
      let first_page =
        this.meta.last_page < 7
          ? 1
          : this.meta.current_page - 3 < 1
          ? 1
          : this.meta.current_page -
            3 -
            (this.meta.current_page + 3 > this.meta.last_page
              ? this.meta.current_page + 3 - this.meta.last_page
              : 0);
      const last_page =
        this.meta.last_page < 7
          ? this.meta.last_page
          : this.meta.current_page + 3 > this.meta.last_page
          ? this.meta.last_page
          : this.meta.current_page +
            3 +
            Math.abs(
              this.meta.current_page - 3 < 1 ? this.meta.current_page - 4 : 0
            );
      let pages = [];
      for (let step = first_page; step <= last_page; step++) {
        pages.push(step);
      }
      return pages;
    },
  },
  methods: {
    scrollingToTop() {
      setTimeout(() => {
        document.querySelector("#main").scrollTop = 0;
      }, 250);
    },
    navigate(data) {
      this.fetchResults(data);
      this.scrollingToTop();
    }
  }
};
</script>
