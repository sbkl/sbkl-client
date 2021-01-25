const state = () => ({
  models: {},
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
  async list(_, { routeName, attribute }) {
    const routePath = routeName.replace('-', '/')
    try {
      const list = await this.$axios.$get(`${routePath}?type=list&attribute=${attribute}`);
      return list;
    } catch (error) {
      console.log('error', error)
    }
  },
  async index({ commit }, { routeName, modelName, pageNumber }) {
    const routePath = routeName.replace('-', '/')
    try {
      let { data, links, meta } = await this.$axios.$get(`${routePath}?page=${pageNumber}`);
      const model = {
        data,
        links,
        meta,
        routeName,
        status: "",
        search: "",
      }
      commit("SET_MODELS", { modelName, model });

      // if (table && state.parentItemSelected) {
      //   const item = state.models[table].find(
      //     (item) => item.id === state.parentItemSelected.item.id
      //   );
      //   dispatch("selectParentItem", {
      //     parent: state.parentItemSelected.parent,
      //     item,
      //   });
      // }
    } catch (error) {
      console.log('error', error)
    }
  },
  async create({ dispatch, state }, { routeName, modelName, data, parentTableName }) {
    const routePath = routeName.replace('-', '/')
    try {
      if (parentTableName) {
        // const model = state.models[routeName].find(
        //   (item) => item[Object.keys(data)[0]] === data[Object.keys(data)[0]]
        // );
        // await this.$axios.$post(
        //   `admin/${parentTableName}/${state.parentItemSelected.item.id}/${table}/${model.id}`
        // );
        // await dispatch("index", parentTableName);
      } else {
        await this.$axios.$post(`${routePath}`, data);
        await dispatch("index", {routeName, modelName, pageNumber: 1});
      }
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${modelName}`, e], { root: true });
      return false;
    }
  },
  async update({ dispatch, state }, { routeName, model, modelName, data }) {
    const routePath = routeName.replace('-', '/')
    const pageNumber = state.models[modelName].meta.current_page
    try {
      await this.$axios.$patch(`${routePath}/${model.id}`, data);
      await dispatch("index", {routeName, modelName, pageNumber});
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${modelName}`, e], { root: true });
      return false;
    }
  },
  async delete({ dispatch, state }, { routeName, modelName, table, model, parentTableName }) {
    const routePath = routeName.replace('-', '/')
    try {
      if (parentTableName) {
        // await this.$axios.$delete(
        //   `admin/${parentTableName}/${state.parentItemSelected.item.id}/${table}/${model.id}`
        // );
        // await dispatch("index", parentTableName);
      } else {
        await this.$axios.$delete(`${routePath}/${model.id}`);
        await dispatch("index", {routeName, modelName, pageNumber: 1});
      }
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${modelName}`, e], { root: true });
      return false;
    }
  },
  async deactivate({ dispatch, state }, { routeName, model, modelName }) {
    const routePath = routeName.replace('-', '/')
    const pageNumber = state.models[modelName].meta.current_page
    try {
      await this.$axios.$patch(`${routePath}/${model.id}/deactivate`);
      await dispatch("index", {routeName, modelName, pageNumber});
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${modelName}`, e], { root: true });
      return false;
    }
  },
  async activate({ dispatch, state }, { routeName, model, modelName }) {
    const routePath = routeName.replace('-', '/')
    const pageNumber = state.models[modelName].meta.current_page
    try {
      await this.$axios.$patch(`${routePath}/${model.id}/activate`);
      await dispatch("index", {routeName, modelName, pageNumber});
      return true;
    } catch (e) {
      dispatch("validation/setErrors", [`${modelName}`, e], { root: true });
      return false;
    }
  },
  selectParentItem({ commit }, item) {
    commit("SET_PARENT_ITEM_SELECTED", item);
  },
  unselectParentItem({ commit }) {
    commit("SET_PARENT_ITEM_SELECTED", null);
  },
  async upload({ dispatch }, { routeName, modelName, file }) {
    const routePath = routeName.replace('-', '/')
    try {
      await this.$axios.$post(`${routePath}/upload`, file);
      await dispatch("index", {routeName, modelName, pageNumber: 1});
    } catch (e) {
      console.log(e);
    }
  },
  async paste({ dispatch }, { routeName, modelName, items }) {
    const routePath = routeName.replace('-', '/')
    try {
      await this.$axios.$post(`${routePath}/paste`, items);
      await dispatch("index", {routeName, modelName, pageNumber: 1});
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
  SET_MODELS(state, { modelName, model }) {
    state.models = { ...state.models, [modelName]: model};
    state = {...state, models: {...state.models, [modelName]: model}}
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
