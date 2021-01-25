<template>
  <div class="flex flex-col flex-1 pt-6 overflow-hidden">
    <div class="flex flex-col flex-1 overflow-hidden">
      <div class="flex flex-col flex-1 overflow-hidden">
        <div
          class="flex flex-col flex-1 w-full px-2 overflow-hidden"
        >
        <v-table
          v-if="
            !parentItemSelected ||
              ($nuxt.$route.name === `${routeName}` &&
                parentItemSelected.parent != table.name)
          "
          :table="table"
          :model="models[table.name].data"
          :hasRelationships="relationships.length > 0"
        />
        <v-pagination
          v-if="models[table.name].links"
          class="mb-4"
          :links="models[table.name].links"
          :meta="models[table.name].meta"
          :filters="{ status: models[table.name].status }"
          :fetchResults="fetchResults"
        />
        </div>
      </div>        
    <!-- <div v-if="parentItemSelected && parentItemSelected.parent === table.name" class="w-full">
      <v-table
        v-for="(relationship, index) in relationships"
        :key="index"
        :table="relationship"
        :model="parentItemSelected.item[relationship.name]"
        :isRelationshipTable="true"
      />
    </div> -->    
    </div>
    <v-modal :open="modal" :modalContainerStyle="modalContainerStyle">
      <v-admin-form :routeName="routeName" :table="activeTable" :modal="modal" />
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
  async asyncData({ params, app, store, route, $axios }) {    
    const routeName = route.name
    const table = tables[routeName];
    const routePath = routeName.replace('-', '/')
    if(store.getters['admin/models'][table.name] === undefined) {
      let { data, links, meta } = await $axios.$get(`${routePath}`);
      const model = {
        data,
        links,
        meta,
        routeName,
        status: "",
        search: "",
      }
      store.commit('admin/SET_MODELS', { modelName: table.name, model })
    }    

    const relationships = Object.keys(
      tables[routeName].relationships || {}
    ).reduce((carry, relationshipKey) => {
      carry.push({
        ...tables[routeName].relationships[relationshipKey],
        parentTableName: tables[routeName].name,
      });
      return carry;
    }, []);

    const modalContainerStyle =
      tables[routeName].modalContainerStyle || "min-w-96";

    return {
      routeName,
      routePath,
      table,
      relationships,
      modalContainerStyle,
    }
  },
  data() {
    return {
      activeTable: null,
      modal: null,
      parentItem: null,
    };
  },
  created() {
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
      await this.upload({ routeName: this.$route.name, modelName: table, file });
    });
    this.$on("pasting", async ({ items, table }) => {
      await this.paste({ routeName: this.$route.name, modelName: table, items });
    });
  },
  methods: {
    ...mapActions({
      fetchModel: "admin/index",
      upload: "admin/upload",
      paste: "admin/paste",
    }),
    fetchResults(data) {
      const { pageNumber } = data
      this.fetchModel({routeName: this.$nuxt.$route.name, modelName: this.table.name, pageNumber})
    }
  },
};
</script>
