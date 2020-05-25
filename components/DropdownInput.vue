<template>
  <div>
    <div v-if="show" class="absolute inset-0 z-10" @click.self="close"></div>
    <div class="relative">
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
                  formType === failedFormName && errors[errorAttribute]
              },
              value === '' ? 'text-gray-400' : 'text-gray-700',
              disabled
                ? 'cursor-not-allowed text-gray-500'
                : 'text-gray-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue'
            ]"
          >
            <span>{{ value != "" ? value : placeholder}}</span>
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
        v-show="show"
        class="absolute z-10 w-full p-2 text-xs text-gray-900 bg-gray-800 rounded shadow-lg"
      >
        <div class="relative mb-2 bg-gray-200 rounded">
          <input
            ref="search"
            type="text"
            class="block w-full form-input sm:text-sm sm:leading-5"
            :class="[
              showAdditionalAttributes
                ? 'bg-gray-800 text-white font-bold cursor-not-allowed'
                : ''
            ]"
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
          />
          <button
            v-if="onAddItem && !showAdditionalAttributes"
            ref="add"
            class="absolute inset-y-0 right-0 px-2 rounded-r-lg focus:outline-none"
            :class="[
              exists
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-teal-300 cursor-pointer focus:bg-teal-400'
            ]"
            :disabled="exists"
            @keydown.tab.prevent="
              onRemoveItem && filteredOptions.length > 0
                ? focusRemoveButtonHighlighted()
                : focusSearchInput()
            "
            @keydown.enter.prevent="onSubmitAdd(search)"
            @keydown.esc="close"
            @click.prevent="onSubmitAdd(search)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 fill-current"
              viewBox="0 0 512 512"
            >
              <path
                d="M368.5 240H272v-96.5c0-8.8-7.2-16-16-16s-16 7.2-16 16V240h-96.5c-8.8 0-16 7.2-16 16 0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7H240v96.5c0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7 8.8 0 16-7.2 16-16V272h96.5c8.8 0 16-7.2 16-16s-7.2-16-16-16z"
              />
            </svg>
          </button>
          <button
            ref="close"
            v-if="showAdditionalAttributes"
            class="absolute inset-y-0 right-0 px-2 text-white cursor-pointer focus:outline-none focus:text-teal-300"
            @click.prevent="showAdditionalAttributes = false"
            @keydown.enter.prevent="showAdditionalAttributes = false"
            @keydown.tab.prevent="focusAttributeField(0)"
            @keydown.esc="close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 fill-current"
              viewBox="0 0 512 512"
            >
              <path
                d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"
              />
            </svg>
          </button>
        </div>
        <div class="h-64 overflow-auto">
          <ul
            ref="options"
            v-show="filteredOptions.length && !showAdditionalAttributes"
            class="mt-2"
          >
            <li
              v-for="(option, index) in filteredOptions"
              :key="option"
              class="flex items-center justify-between w-full px-2 py-2 text-left text-white rounded cursor-pointer focus:outline-none"
              :class="[
                index === highlightedIndex
                  ? 'bg-teal-300 text-teal-900 font-semibold hover:bg-teal-400 hover:text-white'
                  : ' hover:bg-gray-700'
              ]"
              @click.self="select(option)"
            >
              {{ option }}
              <span
                v-if="badge(option)"
                class="flex items-center justify-center w-6 h-6 font-semibold rounded-full"
                :class="[
                  index === highlightedIndex
                    ? 'bg-gray-800 text-white'
                    : 'bg-teal-300 text-gray-800'
                ]"
              >{{ badge(option) }}</span>
              <button
                v-if="onRemoveItem && !badge(option)"
                ref="remove"
                class="mr-1 focus:text-red-400 hover:text-red-400 focus:outline-none"
                @keydown.tab.prevent="focusSearchInput"
                @keydown.enter.prevent="onSubmitRemove(option)"
                @click.prevent="onSubmitRemove(option)"
                @keydown.esc="close"
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
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </li>
          </ul>
          <div v-show="showAdditionalAttributes" class="mt-2" ref="attributes">
            <div v-for="attribute in attributes" :key="attribute.name" class="mb-2">
              <label class="text-gray-200 uppercase">{{ attribute.name.replace(/[\W_]+/g, " ") }}</label>
              <select
                v-if="attribute.list.length > 0"
                class="block w-full h-10 bg-gray-200 focus:outline-none focus:bg-white"
                :value="attributeValues[attribute.name]"
                @change="e => setAttributeValue(e.target.value, attribute.name)"
                @keydown.enter.prevent="focusNextAttributeField(attribute.name)"
                @keydown.esc="close"
              >
                <option v-for="item in attribute.list" :value="item" :key="item">{{ item }}</option>
              </select>
              <input
                v-if="attribute.list.length === 0"
                type="text"
                :value="attributeValues[attribute]"
                class="w-full h-10 p-2 bg-gray-200 rounded focus:outline-none focus:bg-white"
                @input="e => setAttributeValue(e.target.value, attribute.name)"
                @keydown.enter.prevent="focusNextAttributeField(attribute)"
                @keydown.esc="close"
              />
            </div>
            <button
              ref="addWithAttributeButton"
              class="w-full h-10 mt-2 font-bold text-teal-800 uppercase bg-teal-400 rounded focus:outline-none focus:bg-teal-300"
              @keydown.tab.prevent="$refs.close.focus"
              @click.prevent="onSubmitAddWithAttributes"
              @keydown.enter.prevent="onSubmitAddWithAttributes"
              @keydown.esc="close"
            >Add</button>
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
import { createPopper } from "@popperjs/core";
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
  beforeDestroy() {
    if (this.popper != undefined) {
      this.popper.destroy();
    }
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
        this.$refs.attributes.children[index].children[1].focus();
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
          this.setupPopper();
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
    setupPopper() {
      if (this.popper === undefined) {
        this.popper = createPopper(this.$refs.button, this.$refs.dropdown, {
          placement: "bottom"
        });
      } else {
        this.popper.update();
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
