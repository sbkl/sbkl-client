<template>
  <div class="w-full">
    <v-relationship-header
      v-if="table.relationshipHeaderTitle"
      :title="table.relationshipHeaderTitle"
    />
    <div class="lg:flex lg:items-center lg:justify-between mb-4">
      <div class="flex-1 min-w-0 flex">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          {{
          `${table.name.charAt(0).toUpperCase()}${table.name
          .substring(1)
          .replace("_", " ")}`
          }}
        </h2>
        <div class="ml-4 flex items-center text-sm leading-5 text-gray-500 sm:mr-6">
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
      <div class="mt-5 flex lg:mt-0 lg:ml-4">
        <v-upload-button
          v-if="table.upload"
          @upload="
                $parent.$emit('uploading', { file: $event, table: table.name })
              "
        />
        <span class="sm:ml-3 shadow-sm rounded-md">
          <button
            @click.prevent="
                $parent.$emit('openModal', {
                  event: { action: 'create', isRelationshipTable },
                  tableIndex: $vnode.key
                })
              "
            type="button"
            class="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray focus:border-gray-800 transition duration-150 ease-in-out"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
      <div class="-my-2 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200"
        >
          <table class="min-w-full">
            <thead class="flex flex-col">
              <tr class="flex items-center bg-gray-50 border-b border-gray-200">
                <th
                  v-for="([attribute, customStyle = 'w-32'],
              index) in table.attributes"
                  :key="attribute"
                  class="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
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
                  class="w-64 px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white block max-h-80vh overflow-scroll">
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
                  class="px-6 py-4 whitespace-no-wrap text-sm leading-5 truncate"
                  :class="[
                customStyle,
                { 'flex-1': index === table.attributes.length - 1 },
                index === 0 ? 'font-medium text-gray-900' : 'text-gray-500'
              ]"
                >
                  <div v-if="getSubAttribute(item, attribute, separator)" class="flex items-center">
                    <div>
                      <div
                        class="text-sm leading-5 font-medium text-gray-900"
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
                  class="w-64 px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900 text-center"
                >
                  <template v-for="[action, authorised = true] in table.actions">
                    <nuxt-link
                      v-if="action.substring(0, 2) != 'v-' && authorised"
                      :key="action"
                      :to="{ name: action }"
                      v-text="action"
                      class="-mb-px py-4 md:px-4 text-gray-500 hover:text-gray-600 cursor-pointer uppercase tracking-wide text-sm focus:outline-none font-semibold border-b-3 border-transparent"
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
      required: true
    },
    model: {
      default: null
    },
    hasRelationships: {
      type: Boolean,
      default: false
    },
    isRelationshipTable: {
      type: Boolean,
      default: false
    }
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
    }
  }
};
</script>
