<template>
  <div class="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
    <v-table
      v-if="
        !parentItemSelected ||
          ($nuxt.$route.name === `admin-${table.name}` &&
            parentItemSelected.parent != table.name)
      "
      :table="table"
      :model="models[table.name]"
      :hasRelationships="relationships.length > 0"
    />
    <div v-if="parentItemSelected && parentItemSelected.parent === table.name" class="w-full">
      <v-table
        v-for="(relationship, index) in relationships"
        :key="index"
        :table="relationship"
        :model="parentItemSelected.item[relationship.name]"
        :isRelationshipTable="true"
      />
    </div>
    <v-modal :open="modal" :modalContainerStyle="modalContainerStyle">
      <v-form :table="activeTable" :modal="modal" />
    </v-modal>
  </div>
</template>
<script>
import { tables } from "../../../admin.config";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AdminPanel",
  middleware: "authenticated",
  layout: "admin",
  computed: {
    ...mapGetters({
      models: "admin/models",
      parentItemSelected: "admin/parentItemSelected",
    }),
  },
  data() {
    return {
      table: {
        name: "",
        attributes: [],
        form: [],
        actions: [],
      },
      activeTable: null,
      modal: null,
      relationships: [],
      modalContainerStyle: null,
      parentItem: null,
    };
  },
  created() {
    const routeName = this.$nuxt.$route.name;
    this.table = tables[routeName];
    this.relationships = Object.keys(
      tables[routeName].relationships || {}
    ).reduce((carry, relationshipKey) => {
      carry.push({
        ...tables[routeName].relationships[relationshipKey],
        parentTableName: tables[routeName].name,
      });
      return carry;
    }, []);
    this.modalContainerStyle =
      tables[routeName].modalContainerStyle || "min-w-96";
    this.$on("openModal", (data) => {
      this.modal = data;
      if (data.event.isRelationshipTable) {
        this.activeTable = this.relationships[data.tableIndex];
      } else {
        this.activeTable = this.table;
      }
    });
    this.$on("closeModal", (item) => {
      this.modal = null;
    });
    this.$on("uploading", async ({ file, table }) => {
      await this.upload({ table, file });
    });
    this.$on("pasting", async ({ items, table }) => {
      await this.paste({ table, items });
    });
    this.fetchModels();
  },
  methods: {
    ...mapActions({
      fetchModels: "admin/index",
      upload: "admin/upload",
      paste: "admin/paste",
    }),
  },
};
</script>
