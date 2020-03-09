import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import router from "./router";
import auth from "./auth";
import adminStore from "./store/admin";
import validationStore from "./store/validation";
const validation = {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        ...mapGetters({
          errors: "validation/errors",
          failedFormName: "validation/failedFormName"
        })
      },
      methods: {
        ...mapActions({
          setErrors: "validation/setErrors",
          clearFieldErrors: "validation/clearFieldErrors",
          clearAllErrors: "validation/clearAllErrors"
        })
      }
    });
  }
};
Vue.use(validation);
export { auth, router, adminStore, validationStore };
