import vaxios from '@/plugins/vaxios';
import router from '@/router/index';

import { auth } from '@/plugins/firebase';

const state = () => ({
  isLogged: false,
  user: '',
  error: '',
});

const getters = {};
const mutations = {
  setUser(state, payload) {
    state.user = payload;
    if (payload !== '') {
      state.isLogged = true;
      localStorage.setItem('user', JSON.stringify(payload));
      router.push('/');
    } else {
      state.isLogged = false;
      localStorage.removeItem('user');
      router.push('/login');
    }
  },

  setError(state, payload) {
    state.error = payload;
  },
};

const actions = {
  async logIn2({ commit }, user) {
    const url = process.env.VUE_APP_URL_PROD + '/users/login';
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => console.log('Error 2:', response));
  },

  async logIn({ commit }, user) {
    try {
      const res = await vaxios.post('/users/login', {
        email: user.email,
        password: user.password,
      });
      // firebase authentication
      //console.log('[RESPUESTA]: ', res);
      if (res.status !== 'success') {
        return res.data;
      } 
      
      let userLogged = {
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        _id: res.data.user._id,
        token: res.token,
      };
      commit('setUser', userLogged);
      return res;
    } catch (err) {
      console.log('[ERROR] - logIn: ', err);
    } 
  },

  async updateUser({ commit, state }, params) {
    const token = params[0];
    const body = params[1];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.update('/users/updateMe', body, config);
      console.log('RSP: ', res);
      let userLogged = {
        name: res.data.updatedUser.name,
        email: res.data.updatedUser.email,
        role: res.data.updatedUser.role,
        _id: res.data.updatedUser._id,
        token: token,
      };
      state.isLogged = true;
      state.user = userLogged;
      localStorage.setItem('user', JSON.stringify(userLogged));
      //commit('setUser', userLogged);
      return res;
    } catch (err) {
      console.log('[ERROR] - updateUser: ' + err.message);
      return err;
    }
  },

  async createUser({ commit }, user) {
    try {
      // Heroku sign up
      const resDB = await vaxios.post('/users/signup', {
        name: user.name,
        email: user.email,
        password: user.password,
        passwordConfirm: user.passwordConfirm,
      });
      if (resDB.status !== 'success') {
        return resDB.data;
      }
      let userDB = {
        name: resDB.data.user.name,
        email: resDB.data.user.email,
        role: resDB.data.user.role,
        _id: resDB.data.user._id,
        token: resDB.data.user.token,
      };

      console.log('RES DB: ', resDB);
      //Firebase create user
      const res = await auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      userDB.fireUID = res.user.uid;
      console.log('RES: ', res);
      commit('setUser', userDB);

      // const fireUser = {
      //   email: res.user.email,
      //   uid: res.user.uid,
      // };

      return res;
    } catch (err) {
      console.log('[ERROR] - createUser: ' + err);
      commit('setError', error);
      return err;
    }
  },

  logOut({ commit, state }) {
    commit('setUser', '');
  },
};

export default { namespaced: true, state, getters, mutations, actions };
