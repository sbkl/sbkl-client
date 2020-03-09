<template>
  <form @submit.prevent="onSubmit" class="p-8">
    <h1 class="uppercase mb-8 text-2xl font-semibold">{{ title }}</h1>
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
    <div class="w-full flex items-center justify-center">
      <v-button
        :loading="loading"
        class="flex-1"
        :class="{ 'bg-red-300 text-red-600': modal.event.action === 'delete' }"
        :title="modal.event.action"
      />
      <a
        href="#"
        role="button"
        class="font-bold py-2 px-4 uppercase tracking-wider text-sm text-gray-700 w-full text-center flex-1"
        @click.prevent="$parent.$emit('closeModal')"
        >Cancel</a
      >
    </div>
  </form>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "VForm",
  props: {
    table: {
      type: Object,
      required: true
    },
    modal: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      models: "admin/models"
    }),
    title() {
      return this.modal
        ? `${this.modal.event.action} ${` ${this.table.name
            .charAt(0)
            .toUpperCase()}${this.table.name
            .substring(0, this.table.name.length - 1)
            .substring(1)
            .replace("_", " ")}`}`
        : null;
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
      this.table.form.forEach(attribute => {
        const [name, type = "text", tableField, field = null] = attribute;
        if (Array.isArray(name)) {
          name.forEach(subAttribute => {
            const [
              subName,
              subType = "text",
              subTableField,
              subField = null
            ] = subAttribute;
            this.setForm(subName, subType, subTableField, subField);
          });
        } else {
          this.setForm(name, type, tableField, field);
        }
      });
  },
  methods: {
    ...mapActions({
      create: "admin/create",
      update: "admin/update",
      delete: "admin/delete"
    }),
    setForm(name, type, tableField, field) {
      if (type === "dropdown") {
        if (Array.isArray(tableField)) {
          this.$set(
            this.form,
            name,
            this.modal.item
              ? this.modal.item[name]
                ? this.modal.item[name]
                : tableField[
                    tableField.findIndex(item =>
                      field
                        ? this.modal.item[name][field]
                        : this.modal.item[name][name]
                    )
                  ]
              : ""
          );
        } else {
          const [table, field] = tableField.split(":");
          const formAttribute = name.split(":")[2]
            ? name.split(":")[2]
            : name.split(":")[1]
            ? name.split(":")[1]
            : name;
          const value = this.modal.item
            ? name
                .split(":")[0]
                .split(".")
                .reduce((carry, field) => {
                  carry = carry ? carry[field] : this.modal.item[field];
                  return carry;
                }, null)
            : null;
          this.$set(
            this.form,
            formAttribute,
            this.modal.item
              ? this.modal.item[name] === undefined
                ? value
                : typeof this.modal.item[name] === "string" ||
                  typeof this.modal.item[name] === "number"
                ? this.modal.item[name].toString()
                : this.modal.item[name][field].toString()
              : ""
          );
        }
      } else {
        this.$set(
          this.form,
          name,
          this.modal.item ? this.modal.item[name] : ""
        );
      }
    },
    async onSubmit(data) {
      this.loading = true;
      let submitted = await this[this.modal.event.action]({
        table: this.table.name,
        data: this.form,
        model: this.modal.item,
        parentTableName: this.table.parentTableName
      });
      if (submitted) {
        this.$parent.$emit("closeModal");
      }
      this.loading = false;
    },
    fetchList(callback, tableField) {
      if (Array.isArray(tableField)) {
        return tableField;
      }
      const [table, field] = tableField.split(":");
      return callback
        ? callback(this.models[table], this.models, this.form, this.modal.item)
        : this.models[table].map(item => item[field]);
    }
  }
};
</script>
