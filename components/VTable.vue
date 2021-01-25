<template>
  <div class="flex flex-col flex-1 overflow-hidden">
    <v-relationship-header
      v-if="table.relationshipHeaderTitle"
      :title="table.relationshipHeaderTitle"
    />
    <div v-if="hasHeader" class="p-2 mb-4 lg:flex lg:items-center lg:justify-between">
      <div class="flex flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          {{ labelText }}
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
    <div class="flex flex-col flex-1 p-2 overflow-hidden">
      <div
        class="flex flex-col flex-1 min-w-full overflow-hidden align-middle shadow sm:rounded-lg"
      >
        <table class="flex flex-col flex-1 min-w-full overflow-hidden bg-white">
          <thead>
            <tr class="flex text-xs leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
              <th
                v-for="(columnTitle, index) in Object.keys(table.columns)"
                :key="columnTitle"
                class="py-4 font-medium text-left"
                :class="[table.columns[columnTitle].style, { 'pl-6' : index === 0 }]"
              >
                {{ columnTitle }}
              </th>
              <th
                class="flex-1 py-4 pr-8 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-50"
              >Actions</th>
            </tr>
          </thead>
          <tbody id="main" class="block overflow-y-scroll">
            <tr
              v-for="(item, index) in model"
              :key="item.id"
              class="flex"
              :class="[{ 'border-b border-gray-200': index < model.length - 1 }]"
            >
              <td
                v-for="(columnTitle, index) in Object.keys(table.columns)"
                :key="columnTitle"
                class="py-4 text-sm leading-5 text-gray-500 truncate"
                :class="[table.columns[columnTitle].style, { 'pl-6' : index === 0 }, index === 0 ? 'font-medium text-gray-900' : 'text-gray-500']"
              >
                {{ formattedFields(item, table.columns[columnTitle].fields) }}
                <div v-if="table.columns[columnTitle].subFields" class="text-sm leading-5 text-gray-500">
                  {{ formattedFields(item, table.columns[columnTitle].subFields) }}
                </div> 
                <div v-if="table.columns[columnTitle].subSubFields" class="text-sm font-normal leading-5 text-gray-500">
                  {{ formattedFields(item, table.columns[columnTitle].subSubFields) }}
                </div>                                    
              </td>
              <td
                class="flex-1 px-2 py-4 text-sm font-medium text-right text-gray-900 whitespace-no-wrap"
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
                    :table="table"
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
</template>
<script>
export default {
  name: "VTable",
  computed: {
    labelText() {
      return this.table.name.replace(/_/g, " ").charAt(0).toUpperCase() + this.table.name.replace(/_/g, " ").substring(1)      
    }
  },
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
    formattedFields(item, fields) {
      return fields.split('').reduce((carry, char, index) => {
        if(['|', '-', ' '].includes(char) || index === fields.length - 1) {
          const indexVar = index === fields.length - 1 ? 1 : 0
          const scope = fields.substring(carry.index, index + indexVar)
          const scopeSplit = scope.split(':')
          let field, prefix, suffix;
          if(scopeSplit.length === 1) {
            field = scopeSplit[0]
            prefix = ''
            suffix = ''
          } else if(scopeSplit.length === 2) {
            field = scopeSplit[0]
            prefix = ''
            suffix = scopeSplit[1]
          } else if(scopeSplit.length === 3) {
            field = scopeSplit[1]
            prefix = scopeSplit[0]
            suffix = scopeSplit[2]
          }
          const value = item[field]
          const separatorValue = ['-', '|'].includes(carry.separator) ? ` ${carry.separator} ` : carry.separator 
          carry.value = carry.value + separatorValue + prefix + ' ' + item[field] + ' ' + suffix
          carry.separator = char
          carry.index = index + 1
        }
        return carry;
      }, {
        index: 0,
        value: '',
        separator: ''
      }).value
    },
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
