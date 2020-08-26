<template>
  <div class="w-full">
    <v-relationship-header
      v-if="table.relationshipHeaderTitle"
      :title="table.relationshipHeaderTitle"
    />
    <div v-if="hasHeader" class="mb-4 lg:flex lg:items-center lg:justify-between">
      <div class="flex flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          {{
          `${table.name.charAt(0).toUpperCase()}${table.name
          .substring(1)
          .replace("_", " ")}`
          }}
        </h2>
        <div class="flex items-center ml-4 text-sm leading-5 text-gray-500 sm:mr-6">
          <svg
            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
              clip-rule="evenodd"
            />
          </svg>
          {{ model ? model.length : 0 }}
        </div>
      </div>
      <div class="flex mt-5 lg:mt-0 lg:ml-4">
        <v-upload-button
          v-if="table.upload"
          @upload="
                $parent.$emit('uploading', { file: $event, table: table.name })
              "
        />
        <v-paste-upload
          v-if="table.paste"
          :attributes="table.paste"
          @pasted="
                $parent.$emit('pasting', { items: $event, table: table.name })
              "
        />
        <span class="rounded-md shadow-sm sm:ml-3">
          <button
            @click.prevent="
                $parent.$emit('openModal', {
                  event: { action: 'create', isRelationshipTable },
                  tableIndex: $vnode.key
                })
              "
            type="button"
            class="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-700 border border-transparent rounded-md cursor-pointer hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray focus:border-gray-800"
          >
            <svg class="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            Create
            {{
            isRelationshipTable
            ? " Relationship"
            : `${table.name.charAt(0).toUpperCase()}${table.name
            .substring(0, table.name.length - 1)
            .substring(1)
            .replace("_", " ")}`
            }}
          </button>
        </span>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="py-2 -my-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
        >
          <table class="min-w-full">
            <thead class="flex flex-col">
              <tr class="flex items-center border-b border-gray-200 bg-gray-50">
                <th
                  v-for="([attribute, customStyle = 'w-32'],
              index) in table.attributes"
                  :key="attribute"
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase"
                  :class="[
                customStyle,
                { 'flex-1': index === table.attributes.length - 1 }
              ]"
                >
                  {{
                  attribute.split(":")[1]
                  ? attribute.split(":")[1].replace("_", " ")
                  : attribute.replace("_", " ")
                  }}
                </th>
                <th
                  class="w-64 px-6 py-3 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase bg-gray-50"
                >Actions</th>
              </tr>
            </thead>
            <tbody class="block overflow-scroll bg-white max-h-80vh">
              <tr
                v-for="(item, index) in model"
                :key="item.id"
                class="flex"
                :class="[{ 'border-b border-gray-200': index < model.length - 1 }]"
              >
                <td
                  v-for="([attribute, customStyle = 'w-32', separator],
              index) in table.attributes"
                  :key="attribute"
                  class="px-6 py-4 text-sm leading-5 truncate whitespace-no-wrap"
                  :class="[
                customStyle,
                { 'flex-1': index === table.attributes.length - 1 },
                index === 0 ? 'font-medium text-gray-900' : 'text-gray-500'
              ]"
                >
                  <div v-if="getSubAttribute(item, attribute, separator)" class="flex items-center">
                    <div>
                      <div
                        class="text-sm font-medium leading-5 text-gray-900"
                      >{{getAttribute(item, attribute, separator)}}</div>
                      <div
                        class="text-sm leading-5 text-gray-500"
                      >{{ getSubAttribute(item, attribute, separator) }}</div>
                    </div>
                  </div>
                  <template
                    v-else
                  >{{ getAttribute(item, attribute, separator) }} {{ getSubAttribute(item, attribute, separator) }}</template>
                </td>
                <td
                  class="w-64 px-6 py-4 text-sm font-medium leading-5 text-center text-gray-900 whitespace-no-wrap"
                >
                  <template v-for="[action, authorised = true] in table.actions">
                    <nuxt-link
                      v-if="action.substring(0, 2) != 'v-' && authorised"
                      :key="action"
                      :to="{ name: action }"
                      v-text="action"
                      class="py-4 -mb-px text-sm font-semibold tracking-wide text-gray-500 uppercase border-transparent cursor-pointer md:px-4 hover:text-gray-600 focus:outline-none border-b-3"
                    />
                    <component
                      v-if="action.substring(0, 2) === 'v-' && authorised"
                      :key="action"
                      :is="action"
                      :item="item"
                      :table="table.name"
                      :isRelationshipTable="isRelationshipTable"
                      @clicked="
                    $parent.$emit('openModal', {
                      event: $event,
                      item,
                      tableIndex: $vnode.key
                    })
                  "
                    />
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "VTable",
  props: {
    table: {
      type: Object,
      required: true,
    },
    model: {
      default: null,
    },
    hasRelationships: {
      type: Boolean,
      default: false,
    },
    isRelationshipTable: {
      type: Boolean,
      default: false,
    },
    hasHeader: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    getAttribute(item, attribute, separator) {
      const concatenatedFields = attribute
        .split(":")[0]
        .split("|")[0]
        .split(",")
        .reduce((carry, field) => {
          const keys = field.split(".");
          const value = keys.reduce((carry, key) => {
            carry = carry ? carry[key] : item[key];
            return carry;
          }, null);
          carry = `${carry} ${carry != "" ? separator || "" : ""} ${value}`;
          return carry;
        }, "");
      return concatenatedFields;
    },
    getSubAttribute(item, attribute, separator) {
      if (attribute.split(":")[0].split("|")[1]) {
        const concatenatedFields = attribute
          .split(":")[0]
          .split("|")[1]
          .split(",")
          .reduce((carry, field) => {
            const keys = field.split(".");
            const value = keys.reduce((carry, key) => {
              carry = carry ? carry[key] : item[key];
              return carry;
            }, null);
            carry = `${carry} ${carry != "" ? separator || "" : ""} ${value}`;
            return carry;
          }, "");
        return concatenatedFields;
      } else {
        return null;
      }
    },
  },
};
</script>
