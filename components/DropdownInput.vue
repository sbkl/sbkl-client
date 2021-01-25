<template>
  <div>
    <div class>
      <label v-if="label != ''" class="block text-sm font-medium text-gray-700">{{ labelText }}</label>
      <button
        ref="button"
        type="button"
        @click="open"
        :disabled="disabled"
        class="inline-flex justify-between w-full px-4 py-2 mt-1 text-xs font-medium leading-5 transition duration-150 ease-in-out bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1"
        :class="[disabled ? 'cursor-not-allowed': '', 
        value === '' || disabled ? 'text-gray-400' : '',
          formType === failedFormName && errors[errorAttribute] ? 'text-red-900 placeholder-red-300 border-red-300 focus:ring-red-500 focus:border-red-500' : 'focus:ring-gray-500 focus:border-gray-500 border-gray-300'
          ]"
      >
        <span class="truncate">{{ value != "" ? value : placeholder }}</span>
        <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>        
      
      <div v-if="show" class="fixed inset-0 z-10 bg-gray-500 opacity-50"></div>
      <div
        ref="dropdown"
        v-if="show"
        class="absolute inset-0 z-20 flex items-center justify-center"
        @click.self="close"
      >
        <div class="overflow-hidden text-xs text-gray-900 bg-white rounded shadow-lg w-72">
          <div class="relative">
            <div class="flex">
              <div class="relative flex-grow text-gray-400 border-b border-gray-100 focus:outline-none focus-within:z-10 focus-within:text-gray-700">
                <div
                  v-if="!showAdditionalAttributes"
                  class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref="search"
                  type="search"
                  :disabled="showAdditionalAttributes"
                  v-model="search"
                  @keydown.esc="close"
                  @keydown.down="highlightNext"
                  @keydown.up="highlightPrev"
                  @keydown.enter.prevent="
                    filteredOptions.length === 0 && onAddItem
                      ? onSubmitAdd(search)
                      : select(filteredOptions[highlightedIndex])
                  "
                  @keydown.tab.prevent="
                    onAddItem != null && !exists
                      ? focusAddButton()
                      : filteredOptions.length === 0
                      ? null
                      : focusRemoveButtonHighlighted()
                  "
                  class="block w-full py-4 transition duration-150 ease-in-out border-none sm:text-sm sm:leading-5 focus:outline-none focus:ring-1 focus:ring-gray-100"
                  placeholder="Search"
                  :class="[
                    showAdditionalAttributes
                      ? 'cursor-not-allowed text-gray-600 bg-gray-100'
                      : 'pl-10',
                    !onAddItem && !showAdditionalAttributes
                      ? ''
                      : '',
                  ]"
                />
              </div>
              <button
                ref="add"
                v-if="onAddItem && !showAdditionalAttributes"
                :disabled="exists"
                @keydown.tab.prevent="
                  onRemoveItem && filteredOptions.length > 0
                    ? focusRemoveButtonHighlighted()
                    : focusSearchInput()
                "
                @keydown.enter.prevent="onSubmitAdd(search)"
                @keydown.esc="close"
                @click.prevent="onSubmitAdd(search)"
                class="relative inline-flex items-center p-2 -ml-px transition duration-150 ease-in-out border border-gray-300 rounded-r-md bg-gray-50"
                :class="[
                  exists
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700',
                ]"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                ref="close"
                v-if="showAdditionalAttributes"
                @click.prevent="showAdditionalAttributes = false"
                @keydown.enter.prevent="showAdditionalAttributes = false"
                @keydown.tab.prevent="focusAttributeField(0)"
                @keydown.esc="close"
                class="relative inline-flex items-center p-2 -ml-px text-gray-500 transition duration-150 ease-in-out border border-gray-300 rounded-r-md bg-gray-50 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>          
          <div  class="h-48 px-4 my-2 overflow-y-scroll">
            <div v-if="loading" class="flex flex-col items-center justify-center h-full">
              <svg
              class="w-5 h-5 text-gray-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <div class="mt-2 text-gray-500">Loading...</div>
            </div>
            <template v-else>
              <template v-if="Array.isArray(filteredOptions)">
                <ul
                  ref="options"
                  v-show="filteredOptions.length && !showAdditionalAttributes"
                  class="my-2"
                >
                  <li v-for="(option, index) in filteredOptions" :key="option">
                    <a
                      @click.self="select(option)"
                      class="flex items-center justify-between px-2 py-2 text-sm leading-5 text-gray-700 rounded cursor-pointer group hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                      :class="[index === highlightedIndex ? 'bg-gray-200' : '']"
                    >
                      <span class="truncate" @click.prevent="select(option)">{{ option }}</span>
                      <span
                        @click.prevent="select(option)"
                        v-if="badge(option)"
                        class="ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full bg-gray-50 group-focus:bg-gray-100 transition ease-in-out duration-150"
                      >{{ badge(option) }}</span>
                      <button
                        v-if="onRemoveItem && !badge(option)"
                        ref="remove"
                        class="text-gray-500 rounded-full active:bg-red-100 focus:bg-red-100 hover:text-red-500 focus:outline-none focus:text-red-700 focus:shadow-outline-red active:text-red-700"
                        @keydown.tab.prevent="focusSearchInput"
                        @keydown.enter.prevent="onSubmitRemove(option)"
                        @click.prevent="onSubmitRemove(option)"
                        @keydown.esc="close"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </a>
                  </li>
                </ul>
              </template>
              <template v-else-if="typeof filteredOptions === 'object'">
                <div class="w-full" v-for="list in Object.keys(filteredOptions)">
                  <label class="block w-full pb-2 mb-2 text-sm font-medium text-gray-500 border-b border-gray-100" v-show="filteredOptions[list].length > 0">{{ list }}</label>
                  <ul
                    ref="options"
                    v-show="filteredOptions[list].length && !showAdditionalAttributes"
                    class="my-2"
                  >
                    <li v-for="(option, index) in filteredOptions[list]" :key="option">
                      <a
                        @click.self="select(option)"
                        class="flex items-center justify-between px-2 py-2 text-sm leading-5 text-gray-700 rounded cursor-pointer group hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                        :class="[index === highlightedIndex ? 'bg-gray-200' : '']"
                      >
                        <span class="truncate" @click.prevent="select(option)">{{ option }}</span>
                        <span
                          @click.prevent="select(option)"
                          v-if="badge(option)"
                          class="ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full bg-gray-50 group-focus:bg-gray-100 transition ease-in-out duration-150"
                        >{{ badge(option) }}</span>
                        <button
                          v-if="onRemoveItem && !badge(option)"
                          ref="remove"
                          class="text-gray-500 rounded-full active:bg-red-100 focus:bg-red-100 hover:text-red-500 focus:outline-none focus:text-red-700 focus:shadow-outline-red active:text-red-700"
                          @keydown.tab.prevent="focusSearchInput"
                          @keydown.enter.prevent="onSubmitRemove(option)"
                          @click.prevent="onSubmitRemove(option)"
                          @keydown.esc="close"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </a>
                    </li>
                  </ul>
                </div>

              </template>
            </template>
            <!-- <div v-show="showAdditionalAttributes">
              <div v-for="(attribute, index) in attributes" :key="attribute.name" class="mb-2">
                <label
                  for="country"
                  class="block mb-1 ml-1 text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  {{
                  attribute.name.charAt(0, 1).toUpperCase() +
                  attribute.name.replace(/[\W_]+/g, " ").substr(1)
                  }}
                </label>
                <div class="mt-1 sm:mt-0">
                  <div class="max-w-xs rounded-md shadow-sm">
                    <select
                      :ref="`attributeInput${index}`"
                      v-if="attribute.list.length > 0"
                      :id="attribute.name"
                      :value="attributeValues[attribute.name]"
                      @change="
                        (e) => setAttributeValue(e.target.value, attribute.name)
                      "
                      @keydown.enter.prevent="
                        focusNextAttributeField(attribute.name)
                      "
                      @keydown.esc="close"
                      class="block w-full transition duration-150 ease-in-out form-select sm:text-sm sm:leading-5"
                    >
                      <option v-for="item in attribute.list" :value="item" :key="item">{{ item }}</option>
                    </select>
                    <div v-else class="max-w-lg rounded-md shadow-sm">
                      <input
                        :id="attribute.name"
                        :ref="`attributeInput${index}`"
                        type="text"
                        :value="attributeValues[attribute]"
                        @input="
                          (e) =>
                            setAttributeValue(e.target.value, attribute.name)
                        "
                        @keydown.enter.prevent="
                          focusNextAttributeField(attribute)
                        "
                        @keydown.esc="close"
                        class="block w-full transition duration-150 ease-in-out form-input sm:text-sm sm:leading-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <span class="relative inline-flex w-full h-10 mt-4 rounded-md shadow-sm">
                <button
                  ref="addWithAttributeButton"
                  @keydown.tab.prevent="$refs.close.focus"
                  @click.prevent="onSubmitAddWithAttributes"
                  @keydown.enter.prevent="onSubmitAddWithAttributes"
                  @keydown.esc="close"
                  class="w-full justify-center inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white transition ease-in-out duration-150"
                  :class="[
                    'bg-teal-600 hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal active:bg-teal-700',
                  ]"
                >Add</button>
              </span>
            </div> -->
            <!-- <div
              class="w-full px-2 py-2 font-semibold text-left text-gray-500"
              v-show="!filteredOptions.length && !showAdditionalAttributes"
            >
              {{
              options.model.data.length === 0 ? "No option available" : "No result found"
              }}
            </div> -->
          </div>
          <!-- <div v-if="options.model.meta.current_page < options.model.meta.last_page" class="mb-4">
            <Button @clicked="showMore" colour="white">Show more</Button>
          </div> -->
        </div>
      </div>
      <div
        v-if="
          formType === failedFormName &&
          errors[errorAttribute] &&
          Array.isArray(errors[errorAttribute])
        "
      >
        <p
          v-for="error in errors[errorAttribute]"
          :key="error"
          v-text="error"
          class="my-1 text-xs text-red-600"
        />
      </div>
      <p
        class="my-1 text-xs text-red-600"
        v-if="
          formType === failedFormName &&
          errors[errorAttribute] &&
          !Array.isArray(errors[errorAttribute])
        "
        v-text="errors[errorAttribute].replace(errorAttribute, errorValue)"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "DropdownInput",
  watch: {
    async show(show) {
      if(show) {
        this.loading = true;
        const options = await this.fetchValues()
        this.options = options
        this.loading = false;
      }
    }
  },
  props: {
    value: {
      default: "",
      type: String,
    },
    fetchValues: {
      default: () => {},
      type: Function,
    },
    placeholder: {
      default: "Select",
      type: String,
    },
    label: {
      default: "",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    filterFunction: {
      default: (search, options) =>
        options.filter((item) =>
          item.toLowerCase().startsWith(search.toLowerCase().trim())
        ),
      type: Function,
    },
    onInputCallback: {
      default: null,
      type: Function,
    },
    onAddItem: {
      default: null,
      type: Function,
    },
    onRemoveItem: {
      default: null,
      type: Function,
    },
    additionalAttributes: {
      default: () => [],
      type: Array,
    },
    errorField: {
      default: null,
    },
  },
  computed: {
    labelText() {
      return this.label.replace(/_/g, " ").charAt(0).toUpperCase() + this.label.replace(/_/g, " ").substring(1)
    },
    filteredOptions() {
      if(Array.isArray(this.options)) {
        return this.filterFunction(this.search, this.options);
      } else if(typeof this.options === 'object') {
        return Object.keys(this.options).reduce((carry, plantType) => {
          carry[plantType] = this.filterFunction(this.search, this.options[plantType])
          return carry;
        }, {} )
      } else {
        return []
      }
    },
    errorAttribute() {
      return this.errorField
        ? Array.isArray(this.errorField)
          ? this.errorField[0]
          : this.errorField
        : this.label.toLowerCase().replace(/ /g, "_");
    },
    errorValue() {
      return this.errorField && Array.isArray(this.errorField)
        ? this.errorField[1]
        : "";
    },
    exists() {
      // return this.options.filter(
      //     (option) => option.toLowerCase() === this.search.toLowerCase()
      //   ).length > 0 || this.search === ""
      // );
      // const [options, name, badge] = this.options;
      // if (Array.isArray(options)) {
      //   return (
      //     options
      //       .map((option) => option[name])
      //       .filter(
      //         (option) => option.toLowerCase() === this.search.toLowerCase()
      //       ).length > 0 || this.search === ""
      //   );
      // } else {
      //   return (
      //     this.options.filter(
      //       (option) => option.toLowerCase() === this.search.toLowerCase()
      //     ).length > 0 || this.search === ""
      //   );
      // }
    },
  },
  data() {
    return {
      loading: true,
      options: [],
      formType: this.$parent.formType,
      show: false,
      showAdditionalAttributes: false,
      search: "",
      highlightedIndex: 0,
      attributes: [{name: 'hello', list: []}],
      attributeValues: {hello: null},
      attributes: this.additionalAttributes.reduce((carry, attribute) => {
        if (Array.isArray(attribute)) {
          const [name, list, defaultIndex = 0] = attribute;
          carry.push({
            name,
            list,
          });
        } else {
          const name = attribute;
          const list = [];
          carry.push({
            name,
            list,
          });
        }
        return carry;
      }, []),
      attributeValues: this.additionalAttributes.reduce((carry, attribute) => {
        if (Array.isArray(attribute)) {
          const [name, list, defaultIndex = 0] = attribute;
          carry[name] = null;
        } else {
          const name = attribute;
          carry[name] = null;
        }
        return carry;
      }, {}),
    };
  },
  methods: {
    badge(option) {
      return null
      // const [options, name, badge] = this.options;
      // if (Array.isArray(options)) {
      //   const index = options.findIndex((item) => item[name] === option);
      //   return options[index][badge];
      // } else {
      //   return null;
      // }
    },
    setAttributeValue(value, attribute) {
      this.attributeValues[attribute] = value;
    },
    onSubmitAddWithAttributes() {
      this.onAddItem(this.search, this.attributeValues);
      this.showAdditionalAttributes = false;
      this.resetAttributeValues();
      this.$nextTick(() => {
        this.focusSearchInput();
      });
    },
    resetAttributeValues() {
      this.attributeValues = this.additionalAttributes.reduce(
        (carry, attribute) => {
          if (Array.isArray(attribute)) {
            const [name, list, defaultIndex = 0] = attribute;
            carry[name] = list[defaultIndex];
          } else {
            const name = attribute;
            carry[name] = null;
          }
          return carry;
        },
        {}
      );
    },
    onSubmitAdd(search) {
      if (this.additionalAttributes.length > 0) {
        this.showAdditionalAttributes = true;
        this.focusAttributeField(0);
        this.resetAttributeValues();
      } else {
        this.onAddItem(search);
        this.focusSearchInput();
      }
    },
    onSubmitRemove(option) {
      this.onRemoveItem(option);
      this.$emit("input", "");
      this.focusSearchInput();
      this.highlightedIndex = 0;
      this.scrollToHighlightedIndex();
    },
    focusNextAttributeField(attribute) {
      const index = this.additionalAttributes.findIndex((item) => {
        const [name, list] = item;
        return name === attribute;
      });
      if (index + 1 === this.additionalAttributes.length) {
        this.$refs.addWithAttributeButton.focus();
      } else {
        this.focusAttributeField(index + 1);
      }
    },
    focusAttributeField(index) {
      this.$nextTick(() => {
        this.$refs[`attributeInput${index}`][0].focus();
      });
    },
    focusAddButton() {
      this.$refs.add.focus();
    },
    focusSearchInput() {
      this.$refs.search.focus();
    },
    focusRemoveButtonHighlighted() {
      if (
        this.$refs.options.children[this.highlightedIndex].children[1] !=
        undefined
      ) {
        this.$refs.options.children[this.highlightedIndex].children[1].focus();
      } else {
        this.focusSearchInput();
      }
    },
    highlightPrev() {
      this.highlight((this.highlightedIndex -= 1));
    },
    highlightNext() {
      this.highlight((this.highlightedIndex += 1));
    },
    highlight(index) {
      if (this.filteredOptions.length) {
        this.highlightedIndex =
          index > this.filteredOptions.length - 1
            ? 0
            : this.highlightedIndex < 0
            ? this.filteredOptions.length - 1
            : index;
        this.scrollToHighlightedIndex();
      }
    },
    scrollToHighlightedIndex() {
      if (this.$refs.options.children[this.highlightedIndex]) {
        this.$refs.options.children[this.highlightedIndex].scrollIntoView({
          block: "nearest",
        });
      }
    },
    open() {
      if (!this.show && !this.disabled) {
        this.show = true;
        this.resetAttributeValues();
        this.$nextTick(() => {
          this.$refs.search.focus();
          if (this.options.length > 0) {
            this.scrollToHighlightedIndex();
          }
        });
      } else {
        this.$nextTick(() => {
          this.$refs.search.focus();
        });
      }
    },
    close() {
      if (this.show) {
        this.$refs.button.focus();
      }
      this.show = false;
      this.options = []
      this.search = "";
      this.highlightedIndex = 0;
      this.showAdditionalAttributes = false;
    },
    select(item) {
      this.$emit("input", item);
      this.close();
      if (this.onInputCallback) {
        this.onInputCallback(item);
      }
    },
  },
};
</script>
