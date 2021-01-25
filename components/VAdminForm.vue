<template>
<form @submit.prevent="onSubmit" class="flex flex-col h-screen overflow-hidden">
  <div class="flex-1 w-full overflow-y-scroll sm:p-8">
    <div>
      <div class="mb-4">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ title }}
        </h3>
      </div>
      <div v-if="modal.event.action != 'delete'" class="pt-4 border-t border-gray-200" >
        <div
          v-for="(inputTitle, index) in Object.keys(table.form.inputs)"
          :key="index"
          class="mb-4"
        >          
          <template v-if="table.form.inputs[inputTitle].attribute">
            <dropdown-input
              v-if="table.form.inputs[inputTitle].type === 'dropdown'"
              :disabled="modal.event.action != 'create' && table.form.inputs[inputTitle].disabled"
              :label="inputTitle"
              :fetchValues="() => fetchValues(table.form.inputs[inputTitle])"
              v-model="
                form[table.form.inputs[inputTitle].attribute]
              "
            />
            <multiple-choice-input
              v-else-if="table.form.inputs[inputTitle].type === 'multi-select'"
              :label="inputTitle"
              :fetchValues="() => fetchValues(table.form.inputs[inputTitle])"
              :disabled="modal.event.action != 'create' && table.form.inputs[inputTitle].disabled"
              v-model="
                form[table.form.inputs[inputTitle].attribute]
              "
            />
            <Input 
              v-else
              :type="table.form.inputs[inputTitle].type"
              :step="table.form.inputs[inputTitle].step"
              :attribute="table.form.inputs[inputTitle].attribute"
              :disabled="modal.event.action != 'create' && table.form.inputs[inputTitle].disabled"
              v-model="form[table.form.inputs[inputTitle].attribute]"
            />
          </template>
          <template v-else>
            <div>
              <label class="block pb-4 mb-4 text-sm font-medium text-gray-500 border-b border-gray-100">{{ inputTitle }}</label>
            <div class="grid grid-cols-3 gap-4">

            <div
                v-for="(input, index) in Object.keys(table.form.inputs[inputTitle])"
                :key="index"
              >
            <dropdown-input
              v-if="table.form.inputs[inputTitle][input].type === 'dropdown'"
              :disabled="modal.event.action != 'create' && table.form.inputs[inputTitle][input].disabled"
              :label="input"
              :fetchValues="() => fetchValues(table.form.inputs[inputTitle][input])"
              v-model="
                form[table.form.inputs[inputTitle][input].attribute]
              "
            />
            <multiple-choice-input
              v-else-if="table.form.inputs[inputTitle][input].type === 'multi-select'"
              :label="input"
              :fetchValues="() => fetchValues(table.form.inputs[inputTitle][input])"
              :disabled="modal.event.action != 'create' && table.form.inputs[inputTitle][input].disabled"
              v-model="
                form[table.form.inputs[inputTitle][input].attribute]
              "
            />
            <Input 
              v-else
              :type="table.form.inputs[inputTitle][input].type"
              :step="table.form.inputs[inputTitle][input].step"
              :label="input"
              :attribute="table.form.inputs[inputTitle][input].attribute"
              :disabled="modal.event.action != 'create' && table.form.inputs[inputTitle][input].disabled"
              v-model="form[table.form.inputs[inputTitle][input].attribute]"
            />
              </div>
            </div>
            </div>
          </template>
        </div>
      </div>
      <template v-else>
        <p class="text-lg text-gray-600">
          Are you sure you want to delete this item?
        </p>
        <p
          class="my-1 text-xs text-red-600"
          v-if="
            table.name === failedFormName &&
              errors[table.name] &&
              !Array.isArray(errors[table.name])
          "
          v-text="errors[table.name]"
        />
      </template>    
    </div>
  </div>
  <div class="px-4 py-2 bg-gray-100 border-t border-gray-200">
    <div class="flex justify-end">
      <Button
        type="submit"
        :colour="modal.event.action === 'delete' ? 'red' : 'gray'"
        :buttonStyle="`${modal.event.action === 'delete' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'} text-white border-transparent`"
        :loading="loading"
      >{{ submitButtonText }}</Button>
      <Button
        buttonStyle="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        iconStyle="text-gray-400 w-4 h-4"
        @clicked="$parent.$emit('closeModal')"
      >Cancel</Button>
    </div>
  </div>
</form>

  <!-- <form @submit.prevent="onSubmit" class="p-8">
    <h1 class="mb-8 text-2xl font-semibold uppercase">{{ title }}</h1>
    <div v-if="modal.event.action != 'delete'">
      <div
        v-for="([
          attribute,
          type = 'text',
          tableField = null,
          field = null,
          disabled = false,
          callback
        ],
        index) in table.form"
        :key="index"
        class="mb-4"
      >
        <div v-if="Array.isArray(attribute)" class="lg:flex">
          <div
            v-for="([
              subAttribute,
              subType = 'text',
              subTableField = null,
              field = null,
              subDisabled = false,
              subCallback
            ],
            index) in attribute"
            :key="index"
            class="flex-1 mb-4 lg:mb-0"
            :class="[
              index === 0
                ? 'lg:mr-2'
                : index === attribute.length - 1
                ? 'lg:ml-2'
                : 'lg:mr-2 lg:ml-2'
            ]"
          >
            <dropdown-input
              v-if="subType === 'dropdown'"
              :disabled="modal.event.action != 'create' && subDisabled"
              :label="
                subAttribute.split(':').length > 1
                  ? subAttribute.split(':')[1]
                  : subAttribute
              "
              :options="fetchList(subCallback, subTableField)"
              v-model="
                form[
                  subAttribute.split(':')[2]
                    ? subAttribute.split(':')[2]
                    : subAttribute.split(':')[1]
                    ? subAttribute.split(':')[1]
                    : subAttribute
                ]
              "
            />
            <v-input
              v-else
              :disabled="modal.event.action != 'create' && subDisabled"
              :type="subType"
              :label="subAttribute"
              v-model="form[subAttribute]"
            />
          </div>
        </div>
        <template v-else>
          <dropdown-input
            v-if="type === 'dropdown'"
            :disabled="modal.event.action != 'create' && disabled"
            :label="
              attribute.split(':').length > 1
                ? attribute.split(':')[1]
                : attribute
            "
            :options="fetchList(callback, tableField)"
            v-model="
              form[
                attribute.split(':')[2]
                  ? attribute.split(':')[2]
                  : attribute.split(':')[1]
                  ? attribute.split(':')[1]
                  : attribute
              ]
            "
          />
          <v-input
            v-else
            :disabled="modal.event.action != 'create' && disabled"
            :type="type"
            :label="attribute"
            v-model="form[attribute]"
          />
        </template>
      </div>
    </div>
    <div v-else class="mb-8">
      <p class="text-lg text-gray-600">
        Are you sure you want to delete this item?
      </p>
      <p
        class="my-1 text-xs text-red-600"
        v-if="
          table.name === failedFormName &&
            errors[table.name] &&
            !Array.isArray(errors[table.name])
        "
        v-text="errors[table.name]"
      />
    </div>
    <div class="flex items-center justify-center w-full">
      <v-button
        :loading="loading"
        class="flex-1"
        :class="{ 'bg-red-300 text-red-600': modal.event.action === 'delete' }"
        :title="modal.event.action"
      />
      <a
        href="#"
        role="button"
        class="flex-1 w-full px-4 py-2 text-sm font-bold tracking-wider text-center text-gray-700 uppercase"
        @click.prevent="$parent.$emit('closeModal')"
        >Cancel</a
      >
    </div>
  </form> -->
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "VAdminForm",
  props: {
    table: {
      type: Object,
      required: true
    },
    modal: {
      type: Object,
      required: true
    },
    routeName: {
      type: String,
    }
  },
  computed: {
    ...mapGetters({
      models: "admin/models"
    }),
    title() {
      const intro = this.modal.event.action === 'create' ? 'Create a new' : ''
      return this.modal
        ? `${intro} ${` ${this.table.name
            .charAt(0)
            .toUpperCase()}${this.table.name
            .substring(0, this.table.name.length - 1)
            .substring(1)
            .replace("_", " ")}`}`
        : null;
    },
    submitButtonText() {
      return this.modal.event.action.charAt(0).toUpperCase() + this.modal.event.action.substring(1)
    }
  },
  data() {
    return {
      formType: "",
      form: {},
      loading: false
    };
  },
  created() {
    this.formType = this.table.name;
    this.table.form &&
      Object.keys(this.table.form.inputs).forEach(async inputTitle => {
        const { value, attribute, type = "text", source } = this.table.form.inputs[inputTitle]
          if(attribute) {
            this.setForm(value, attribute, type, source);
          } else {
            Object.keys(this.table.form.inputs[inputTitle]).forEach(input => {
              const { value, attribute, type = "text", source } = this.table.form.inputs[inputTitle][input]
              this.setForm(value, attribute, type, source);
            })
          }

        // const [name, type = "text", tableField, field = null] = attribute;
        // if(tableField && typeof tableField === 'string') {
        //   const [routeName] = tableField.split(":");
        //   await this.fetchModel({routeName, pageNumber: 1})
        // }

        // if (Array.isArray(attribute)) {
        //   attribute.forEach(subAttribute => {
        //     const [
        //       subName,
        //       subType = "text",
        //       subTableField,
        //       subField = null
        //     ] = subAttribute;
        //     this.setForm(subName, subType, subTableField, subField);
        //   });
        // } else {
        //   this.setForm(attribute, type, tableField, field);
        // }
      });
  },
  methods: {
    ...mapActions({
      create: "admin/create",
      update: "admin/update",
      delete: "admin/delete",
      fetchModel: "admin/index",
      fetchList: "admin/list"
    }),
    setForm(value, attribute, type, source) {

      if(type === 'dropdown') {
        this.$set(
          this.form,
          attribute,
          this.modal.item ? this.modal.item[value] : ""
        );
      } else if (type === 'multi-select') {
      this.$set(
        this.form,
        attribute,
        this.modal.item ? this.modal.item[value] : []
      );
      } else {
        this.$set(
          this.form,
          attribute,
          this.modal.item ? this.modal.item[value] : ""
        );
      }
      // if (type === "dropdown") {
      //   if (Array.isArray(tableField)) {
      //     this.$set(
      //       this.form,
      //       attribute,
      //       this.modal.item
      //         ? this.modal.item[attribute]
      //           ? this.modal.item[attribute]
      //           : tableField[
      //               tableField.findIndex(item =>
      //                 field
      //                   ? this.modal.item[attribute][field]
      //                   : this.modal.item[attribute][attribute]
      //               )
      //             ]
      //         : ""
      //     );
      //   } else {
      //     const [table, field] = tableField.split(":");
      //     const formAttribute = attribute.split(":")[2]
      //       ? attribute.split(":")[2]
      //       : attribute.split(":")[1]
      //       ? attribute.split(":")[1]
      //       : attribute;
      //     const value = this.modal.item
      //       ? attribute
      //           .split(":")[0]
      //           .split(".")
      //           .reduce((carry, field) => {
      //             carry = carry ? carry[field] : this.modal.item[field];
      //             return carry;
      //           }, null)
      //       : null;
      //     this.$set(
      //       this.form,
      //       formAttribute,
      //       this.modal.item
      //         ? this.modal.item[attribute] === undefined
      //           ? value
      //           : typeof this.modal.item[attribute] === "string" ||
      //             typeof this.modal.item[attribute] === "number"
      //           ? this.modal.item[attribute].toString()
      //           : this.modal.item[attribute][field].toString()
      //         : ""
      //     );
      //   }
      // } else {
      //   this.$set(
      //     this.form,
      //     attribute,
      //     this.modal.item ? this.modal.item[attribute] : ""
      //   );
      // }
    },
    async onSubmit() {
      if(!this.loading) {
        this.loading = true;
        let submitted = await this[this.modal.event.action]({
          routeName: this.routeName,
          modelName: this.table.name,
          data: this.form,
          model: this.modal.item,
          parentTableName: this.table.parentTableName
        });
        if (submitted) {
          this.$parent.$emit("closeModal");
        }
        this.loading = false;
      }
    },
    async fetchValues(input) {
      if(Array.isArray(input.source)) {
        return input.source
      } else {
        const { source: {routeName, attribute } } = input
        const values = await this.fetchList({ routeName, attribute })
        return values
      }
      return []
      // form[table.form.inputs[inputTitle].model], form[table.form.inputs[inputTitle].attribute]
      // if (Array.isArray(tableField)) {
      //   return tableField;
      // }
      // if(typeof tableField === 'string') {
        // const [routeName, field] = tableField.split(":");
        // return {
        //   model: this.models[model],
        //   field: attribute,
        // }
        // return this.models[routeName].data.map(item => item[field])
      // }
      
      // if(Callback) {
      //   return callback(this.models[table], this.models, this.form, this.modal.item)
      // }
    }
  }
};
</script>
