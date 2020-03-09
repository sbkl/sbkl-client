const state = () => ({
  errors: {},
  failedFormName: ""
});
const getters = {
  errors(state) {
    return state.errors;
  },
  failedFormName(state) {
    return state.failedFormName;
  }
};
const actions = {
  setErrors({ commit }, data) {
    const [form, e, input = null] = data;
    let errors = {};
    if (input) {
      const [error, field] = input.split(":");
      errors[field] = e.response ? e.response.data[error] : e[error];
    } else {
      errors = e.response.data.errors;
      Object.keys(errors).forEach(key => {
        errors[key] = errors[key][0];
      });
    }
    commit("SET_ERRORS", { form, errors });
  },
  clearFieldErrors({ commit }, field) {
    commit("CLEAR_FIELD_ERRORS", field);
  },
  clearAllErrors({ commit }) {
    commit("CLEAR_ALL_ERRORS");
  }
};
const mutations = {
  SET_ERRORS(state, { form, errors }) {
    state.errors = errors;
    state.failedFormName = form;
  },
  CLEAR_FIELD_ERRORS(state, field) {
    state.errors[field] = null;
  },
  CLEAR_ALL_ERRORS(state) {
    state.errors = {};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
