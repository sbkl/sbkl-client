<template>
  <div>
    <div class>
      <label
        v-if="label != ''"
        class="block text-xs font-medium leading-5 text-gray-700"
        v-text="label.replace('_', ' ')"
      />
      <div>
        <div class="rounded-md shadow-sm">
          <button
            ref="button"
            type="button"
            @click="open"
            class="inline-flex justify-between w-full px-4 py-2 text-xs font-medium leading-5 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 active:bg-gray-50 active:text-gray-800"
            :class="[
              {
                'border-red-500':
                  formType === failedFormName && errors[errorAttribute],
              },
              disabled
                ? 'cursor-not-allowed text-gray-500'
                : 'text-gray-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue',
            ]"
          >
            <span
              class="truncate"
              :class="value === '' ? 'text-gray-400' : 'text-gray-700'"
            >{{ value != "" ? value : placeholder }}</span>
            <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref="dropdown"
        v-if="show"
        class="absolute inset-0 z-10 flex items-center justify-center bg-black-opacity-50"
        @click.self="close"
      >
        <div class="text-xs text-gray-900 bg-white rounded shadow-lg w-72">
          <div class="pb-2 m-4 bg-white border-b border-gray-200">
            <h3 class="text-lg font-medium leading-6 text-gray-900">{{ label }}</h3>
          </div>
          <div class="relative mx-4 mb-4 bg-gray-200 rounded">
            <div class="flex mt-1 rounded-md shadow-sm">
              <div class="relative flex-grow focus-within:z-10">
                <div
                  v-if="!showAdditionalAttributes"
                  class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none"
                >
                  <svg
                    class="w-4 h-4 text-gray-400"
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
                  class="block w-full transition duration-150 ease-in-out rounded-none form-input rounded-l-md sm:text-sm sm:leading-5"
                  placeholder="John Doe"
                  :class="[
                    showAdditionalAttributes
                      ? 'cursor-not-allowed text-gray-600 bg-gray-100'
                      : 'pl-8',
                    !onAddItem && !showAdditionalAttributes
                      ? 'rounded-md'
                      : 'rounded-l-md',
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
          <div class="h-64 px-4 overflow-auto">
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
            <div v-show="showAdditionalAttributes">
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
            </div>
            <div
              class="w-full px-2 py-2 font-semibold text-left text-gray-500"
              v-show="!filteredOptions.length && !showAdditionalAttributes"
            >
              {{
              options.length === 0 ? "No option available" : "No result found"
              }}
            </div>
          </div>
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
        v-text="errors[errorAttribute]"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "DropdownInput",
  props: {
    value: {
      default: "",
      type: String
    },
    options: {
      default: () => [],
      type: Array
    },
    placeholder: {
      default: "Select",
      type: String
    },
    label: {
      default: "",
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    filterFunction: {
      default: (search, options) =>
        options.filter(item =>
          item.toLowerCase().startsWith(search.toLowerCase().trim())
        ),
      type: Function
    },
    onInputCallback: {
      default: null,
      type: Function
    },
    onAddItem: {
      default: null,
      type: Function
    },
    onRemoveItem: {
      default: null,
      type: Function
    },
    additionalAttributes: {
      default: () => [],
      type: Array
    },
    errorField: {
      default: null,
      type: String
    }
  },
  computed: {
    filteredOptions() {
      const [options, name, badge] = this.options;
      if (Array.isArray(options)) {
        return this.filterFunction(
          this.search,
          options.map(option => option[name])
        );
      } else {
        return this.filterFunction(this.search, this.options);
      }
    },
    errorAttribute() {
      return this.errorField
        ? this.errorField
        : this.label.toLowerCase().replace(/ /g, "_");
    },
    exists() {
      const [options, name, badge] = this.options;
      if (Array.isArray(options)) {
        return (
          options
            .map(option => option[name])
            .filter(
              option => option.toLowerCase() === this.search.toLowerCase()
            ).length > 0 || this.search === ""
        );
      } else {
        return (
          this.options.filter(
            option => option.toLowerCase() === this.search.toLowerCase()
          ).length > 0 || this.search === ""
        );
      }
    }
  },
  data() {
    return {
      formType: this.$parent.formType,
      show: false,
      showAdditionalAttributes: false,
      search: "",
      highlightedIndex: 0,
      attributes: this.additionalAttributes.reduce((carry, attribute) => {
        if (Array.isArray(attribute)) {
          const [name, list, defaultIndex = 0] = attribute;
          carry.push({
            name,
            list
          });
        } else {
          const name = attribute;
          const list = [];
          carry.push({
            name,
            list
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
      }, {})
    };
  },
  methods: {
    badge(option) {
      const [options, name, badge] = this.options;
      if (Array.isArray(options)) {
        const index = options.findIndex(item => item[name] === option);
        return options[index][badge];
      } else {
        return null;
      }
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
      const index = this.additionalAttributes.findIndex(item => {
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
          block: "nearest"
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
    }
  }
};
</script>
