import vaxios from '@/plugins/vaxios';
import AppError from '@/plugins/appError';

const state = () => ({
  devicesList: [],
  devicesGrpSelected: [],

  deviceSelected: '',
  sensorsList: [],
});

const getters = {};
const mutations = {
  setAllDevices(state, payload) {
    state.devicesList = payload;
  },

  setDevicesGroup(state, payload) {
    state.devicesGrpSelected = payload;
  },
  setDeviceSelected(state, payload) {
    state.deviceSelected = payload;
  },
};

const actions = {
  selectDevice({ commit }, device) {
    commit('setDeviceSelected', device);
  },

  async getDevicesProject({ commit }, params) {
    const token = params[0];
    const idPro = params[1];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.get(`/projects/${idPro}/allDevices`, config);
      return res;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async getAllDevPro({ dispatch, commit }, params) {
    const token = params[0];
    const idsPro = params[1];
    let allDevs = [];
    try {
      await Promise.all(
        idsPro.map(async (idPro) => {
          const res = await dispatch('getDevicesProject', [token, idPro]);
          const ldevs = res.data.devices;
          if (ldevs.length > 0) {
            allDevs = allDevs.concat(ldevs);
          }
        })
      );
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
    commit('setAllDevices', allDevs);
  },

  async getDevicesGroup({ dispatch, commit }, params) {
    const token = params[0];
    const idPro = params[1];
    const idGrp = params[2];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.get(
        `/projects/${idPro}/groups/${idGrp}/devices`,
        config
      );
      commit('setDevicesGroup', res.data.devices);
      return res;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async createDevice({ dispatch, commit }, params) {
    const token = params[0];
    const idPro = params[1];
    const idGrp = params[2];
    const body = params[3];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.post(
        `/projects/${idPro}/groups/${idGrp}/devices`,
        body,
        config
      );
      commit('setDeviceSelected', res.data.device);
      return res;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async updateDevice({ dispatch, commit }, params) {
    const token = params[0];
    const idPro = params[1];
    const idGrp = params[2];
    const body = params[3];
    const idDev = params[4];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.update(
        `/projects/${idPro}/groups/${idGrp}/devices/${idDev}`,
        body,
        config
      );
      commit('setDeviceSelected', res.data.device);
      return res;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async deleteDevice({ dispatch, commit }, params) {
    const token = params[0];
    const idPro = params[1];
    const idGrp = params[2];
    const idDev = params[3];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.delete(
        `/projects/${idPro}/groups/${idGrp}/devices/${idDev}`,
        config
      );
      //console.log('Respuesta delete: ', res);
      return res;
    } catch (err) {
      console.log('Respuesta delete: ', err);
      return { status: 'failed', message: err.message };
    }
  },

  async getDevice({ dispatch, commit }, params) {
    const token = params[0];
    const idPro = params[1];
    const idGrp = params[2];
    const idDev = params[3];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.get(
        `/projects/${idPro}/groups/${idGrp}/devices/${idDev}`,
        config
      );
      // console.log('getDevcie RS: ', res);
      commit('setDeviceSelected', res.data.device);
      return res;
    } catch (err) {
      console.log('Respuesta GET: ', err);
      return { status: 'failed', message: err.message };
    }
  },

  async getData({ commit }, params) {
    const token = params[0];
    const APItoken = params[1];
    const idDev = params[2];
    const idsSen = params[3];

    const config = {
      headers: {
        Authorization: `Bearer ${APItoken}`,
      },
      params: {
        firstSample: params[4],
        lastSample: params[5],
      },
    };

    try {
      //console.log('PARAMS enviados: ', params);
      const res = await vaxios.get(
        `/data/device/${idDev}/sensors/${idsSen}`,
        config
      );
      //console.log('getData RS: ', res);
      return res;
    } catch (err) {
      console.log('Respuesta GET Data: ', err);
      return { status: 'failed', message: err.message };
    }
  },

  passDevicesPopulated({ commit }, devices ) {
    commit('setAllDevices', devices);
  }
};

export default { namespaced: true, state, getters, mutations, actions };
