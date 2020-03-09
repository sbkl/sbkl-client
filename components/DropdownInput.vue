<template>
  <div>
    <div v-if="show" class="z-10 absolute inset-0" @click.self="close"></div>
    <div class="relative">
      <label
        v-if="label != ''"
        class="text-xs text-gray-600 uppercase font-normal mb-1"
        v-text="label.replace('_', ' ')"
      />
      <button
        ref="button"
        type="button"
        class="w-full flex items-center bg-gray-200 text-xs h-10 pl-2 border-b bg-transparent focus:outline-none"
        :class="[
          {
            'border-red-500':
              formType === failedFormName && errors[errorAttribute]
          },
          disabled
            ? 'cursor-not-allowed text-gray-600'
            : 'text-gray-900 focus:border-teal-300 hover:border-teal-300'
        ]"
        @click="open"
      >
        <span v-if="value !== ''">{{ value }}</span>
        <span v-else class="search-select-placeholder text-gray-500">{{
          placeholder
        }}</span>
      </button>
      <div
        ref="dropdown"
        v-show="show"
        class="w-full absolute z-10 bg-gray-800 rounded shadow-lg text-xs text-gray-900 p-2"
      >
        <div class="relative rounded overflow-hidden bg-gray-200">
          <input
            ref="search"
            type="text"
            class="w-full p-2 focus:outline-none h-10"
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
            class="absolute right-0 inset-y-0 px-2 focus:outline-none"
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
              class="fill-current w-5 h-5"
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
            class="absolute right-0 inset-y-0 px-2 focus:outline-none cursor-pointer text-white focus:text-teal-300"
            @click.prevent="showAdditionalAttributes = false"
            @keydown.enter.prevent="showAdditionalAttributes = false"
            @keydown.tab.prevent="focusAttributeField(0)"
            @keydown.esc="close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="fill-current w-6 h-6"
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
              class="w-full text-left py-2 px-2 text-white focus:outline-none cursor-pointer rounded flex justify-between items-center"
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
                class="rounded-full w-6 h-6 flex items-center justify-center font-semibold"
                :class="[
                  index === highlightedIndex
                    ? 'bg-gray-800 text-white'
                    : 'bg-teal-300 text-gray-800'
                ]"
                >{{ badge(option) }}</span
              >
              <button
                v-if="onRemoveItem && !badge(option)"
                ref="remove"
                class="focus:text-red-500 hover:text-red-500 focus:outline-none mr-1"
                @keydown.tab.prevent="focusSearchInput"
                @keydown.enter.prevent="onSubmitRemove(option)"
                @click.prevent="onSubmitRemove(option)"
                @keydown.esc="close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="fill-current w-5 h-5"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M133.1 128l23.6 290.7c0 16.2 13.1 29.3 29.3 29.3h141c16.2 0 29.3-13.1 29.3-29.3L379.6 128H133.1zm61.6 265L188 160h18.5l6.9 233h-18.7zm70.3 0h-18V160h18v233zm52.3 0h-18.6l6.8-233H324l-6.7 233zM364 92h-36l-26.3-23c-3.7-3.2-8.4-5-13.2-5h-64.8c-4.9 0-9.7 1.8-13.4 5L184 92h-36c-17.6 0-30 8.4-30 26h276c0-17.6-12.4-26-30-26z"
                  />
                </svg>
              </button>
            </li>
          </ul>
          <div v-show="showAdditionalAttributes" class="mt-2" ref="attributes">
            <div
              v-for="attribute in attributes"
              :key="attribute.name"
              class="mb-2"
            >
              <label class="uppercase text-gray-200">
                {{ attribute.name.replace(/[\W_]+/g, " ") }}
              </label>
              <select
                v-if="attribute.list.length > 0"
                class="bg-gray-200 block h-10 w-full focus:outline-none focus:bg-white"
                :value="attributeValues[attribute.name]"
                @change="e => setAttributeValue(e.target.value, attribute.name)"
                @keydown.enter.prevent="focusNextAttributeField(attribute.name)"
                @keydown.esc="close"
              >
                <option
                  v-for="item in attribute.list"
                  :value="item"
                  :key="item"
                  >{{ item }}</option
                >
              </select>
              <input
                v-if="attribute.list.length === 0"
                type="text"
                :value="attributeValues[attribute]"
                class="bg-gray-200 rounded w-full h-10 p-2 focus:outline-none focus:bg-white"
                @input="e => setAttributeValue(e.target.value, attribute.name)"
                @keydown.enter.prevent="focusNextAttributeField(attribute)"
                @keydown.esc="close"
              />
            </div>
            <button
              ref="addWithAttributeButton"
              class="w-full bg-teal-400 text-teal-800 h-10 uppercase font-bold rounded mt-2 focus:outline-none focus:bg-teal-300"
              @keydown.tab.prevent="$refs.close.focus"
              @click.prevent="onSubmitAddWithAttributes"
              @keydown.enter.prevent="onSubmitAddWithAttributes"
              @keydown.esc="close"
            >
              Add
            </button>
          </div>
          <div
            class="w-full text-left py-2 px-2 text-gray-500 font-semibold"
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
