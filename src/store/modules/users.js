import vaxios from '@/plugins/vaxios';
import router from '@/router/index';
import AppError from '@/plugins/appError';
import { auth } from '@/plugins/firebase';

const state = () => ({
  isLogged: false,
  user: '',
});

const getters = {};
const mutations = {
  setUser(state, payload) {
    state.user = payload;
    if (payload !== '') {
      state.isLogged = true;
      localStorage.setItem('user', JSON.stringify(payload));
      if (!payload.updated) {
        //router.push('/usuario');
        router.push('/');
      }
    } else {
      state.isLogged = false;
      localStorage.removeItem('user');
      router.push('/login');
    }
  },
};

const actions = {
  async logIn({ commit }, user) {
    try {
      const res = await vaxios.post('/users/login', {
        email: user.email,
        password: user.password,
      });

      console.log('Res login: ', res);
      // firebase authentication
      if (res === null || res === undefined || res.status !== 'success') {
        //throw new AppError(res.data.message, res.data.code);
        throw new AppError('Error logging', 500);
      }
      let userDB = {
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        photo: res.data.user.photo,
        _id: res.data.user._id,
        token: res.token,
      };

      //Firebase login
      const fres = await auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
      //console.log('RESPUESTA FIRBASE: ', fres);
      userDB.fireUID = fres.user.uid;
      userDB.fireToken = fres.user.refreshToken;
      commit('setUser', userDB);
      return res;
    } catch (err) {
      //console.log('[ERROR] - logIn: ', err);
      return { status: 'failed', message: err.message };
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
        photo: res.data.updatedUser.photo,
        updated: true,
        token: token,
      };
      state.isLogged = true;
      state.user = userLogged;
      localStorage.setItem('user', JSON.stringify(userLogged));
      commit('setUser', userLogged);
      return res;
    } catch (err) {
      //console.log('[ERROR] - updateUser: ' + err.message);
      return { status: 'failed', message: err.message };
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

      // console.log('RESPUESTA HEROKU: ', resDB);

      if (resDB.status !== 'success') {
        throw new AppError(resDB.data.message, resDB.status);
      }

      let userDB = {
        name: resDB.data.user.name,
        email: resDB.data.user.email,
        role: resDB.data.user.role,
        _id: resDB.data.user._id,
        token: resDB.data.user.token,
      };

      //Firebase create user
      const res = await auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      //console.log('RESPUESTA FIREBASE: ', res);
      userDB.fireUID = res.user.uid;
      commit('setUser', userDB);

      return res;
    } catch (err) {
      //console.log('[ERROR] - createUser: ' + err);
      return { status: 'failed', message: err.message };
    }
  },

  async logOut({ commit, state }) {
    try {
      const res = await auth.signOut();
      commit('setUser', '');
    } catch (err) {
      console.log('[ERROR] ', err);
    }
  },
};

export default { namespaced: true, state, getters, mutations, actions };
