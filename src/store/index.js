import Vue from 'vue';
import Vuex from 'vuex';
import vaxios from '../plugins/vaxios';
import router from '../router/index';

import projects from './modules/projects';
import users from './modules/users';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: '',
    logged: false,
    token: '',
    counter: 69,
    loading: false,
  },
  mutations: {
  
  },
  actions: {
   
  },
  modules: {
    projects,
    users
  },
});
