import vaxios from '@/plugins/vaxios';
import router from '@/router/index';

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
      router.push('/');
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
      //console.log(res);
      let userLogged = {
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        _id: res.data.user._id,
        token: res.token,
      };
      commit('setUser', userLogged);
    } catch (e) {
      console.log('[ERROR] - logIn: ' + e.message);
    }
  },
  logOut({ commit, state }) {
    commit('setUser', '');
  },
};

export default { namespaced: true, state, getters, mutations, actions };
