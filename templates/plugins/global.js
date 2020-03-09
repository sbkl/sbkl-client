import Vue from "vue";
// import Component from "../components/Component.vue";
let components = [
  // Component
];
components.forEach(component => Vue.component(component.name, component));
