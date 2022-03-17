import Vue from 'vue';
import Vuex from 'vuex';
// import vaxios from '../plugins/vaxios';
// import router from '../router/index';
import createPersistedState from 'vuex-persistedstate';
import projects from './modules/projects';
import users from './modules/users';
import devices from './modules/devices';

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
    devices
  },
});
