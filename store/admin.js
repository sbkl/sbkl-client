const state = () => ({
  models: [],
  parentItemSelected: null,
});
const getters = {
  models(state) {
    return state.models;
  },
  parentItemSelected(state) {
    return state.parentItemSelected;
  },
};
const actions = {
  async index({ state, commit, dispatch }, table = null) {
    try {
      let models = await this.$axios.$get("admin/panel");
      commit("SET_MODELS", models);
      if (table && state.parentItemSelected) {
        const item = state.models[table].find(
          (item) => item.id === state.parentItemSelected.item.id
        );
        dispatch("selectParentItem", {
          parent: state.parentItemSelected.parent,
          item,
        });
      }
    } catch (error) {}
  },
  async create({ dispatch, state }, { table, data, parentTableName }) {
    try {
      if (parentTableName) {
        const model = state.models[table].find(
          (item) => item[Object.keys(data)[0]] === data[Object.keys(data)[0]]
        );
        await this.$axios.$post(
          `admin/${parentTableName}/${state.parentItemSelected.item.id}/${table}/${model.id}`
        );
        await dispatch("index", parentTableName);
      } else {
        await this.$axios.$post(`admin/${table}`, data);
        await dispatch("index");
      }
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${table}`, e], { root: true });
      return false;
    }
  },
  async update({ dispatch }, { table, data, model }) {
    try {
      await this.$axios.$patch(`admin/${table}/${model.id}`, data);
      await dispatch("index");
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${table}`, e], { root: true });
      return false;
    }
  },
  async delete({ dispatch, state }, { table, model, parentTableName }) {
    try {
      if (parentTableName) {
        await this.$axios.$delete(
          `admin/${parentTableName}/${state.parentItemSelected.item.id}/${table}/${model.id}`
        );
        await dispatch("index", parentTableName);
      } else {
        await this.$axios.$delete(`admin/${table}/${model.id}`);
        await dispatch("index");
      }
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${table}`, e], { root: true });
      return false;
    }
  },
  async deactivate({ dispatch }, { table, model }) {
    try {
      await this.$axios.$patch(`admin/${table}/${model.id}/deactivate`);
      await dispatch("index");
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${table}`, e], { root: true });
      return false;
    }
  },
  async activate({ dispatch }, { table, model }) {
    try {
      await this.$axios.$patch(`admin/${table}/${model.id}/activate`);
      await dispatch("index");
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${table}`, e], { root: true });
      return false;
    }
  },
  selectParentItem({ commit }, item) {
    commit("SET_PARENT_ITEM_SELECTED", item);
  },
  unselectParentItem({ commit }) {
    commit("SET_PARENT_ITEM_SELECTED", null);
  },
  async upload({ dispatch }, { table, file }) {
    try {
      await this.$axios.$post(`admin/${table}/upload`, file);
      dispatch("index");
    } catch (e) {
      console.log(e);
    }
  },
  async paste({ dispatch }, { table, items }) {
    try {
      console.log(items);
      await this.$axios.$post(`admin/${table}/paste`, items);
      dispatch("index");
    } catch (e) {
      console.log(e);
    }
  },
  async registerUserLastActivityDate() {
    try {
      await this.$axios.$patch("admin/users/last-activity");
    } catch (e) {
      console.log(e);
    }
  },
  clearAdmin({ commit }) {
    commit("CLEAR_ADMIN");
  },
};
const mutations = {
  SET_MODELS(state, models) {
    state.models = models;
  },
  SET_PARENT_ITEM_SELECTED(state, item) {
    state.parentItemSelected = item;
  },
  CLEAR_ADMIN(state) {
    state.models = [];
    state.parentItemSelected = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
