import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import projects from './modules/projects';
import users from './modules/users';
import devices from './modules/devices';
import charts from './modules/charts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {},
  actions: {},
  plugins: [createPersistedState()],
  modules: {
    projects,
    users,
    devices,
    charts
  },
});
