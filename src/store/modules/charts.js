import vaxios from '@/plugins/vaxios';
import router from '@/router/index';
import AppError from '@/plugins/appError';
import { db } from '@/plugins/firebase';

const state = () => ({
  chartList: [],
});

const getters = {};

const mutations = {
  setCharList(state, payload) {
    state.chartList = payload;
  },
};

const actions = {
  passChartList({ commit }, clist) {
    commit('setChartList', clist);
  },

  /**
   *  Pass object to query for data
   *  apiToken  params[0] Not passed
   *  idDevice  params[1]
   *  idSensor  params[2]
   *  dateFrom  params[3] Can be null
   *  dateTo    params[4] Can be null
   */
  async getData({ commit }, params) {
    const APItoken = params[0];
    const idDev = params[1];
    const idsSen = params[2];

    const config = {
      headers: {
        Authorization: `Bearer ${APItoken}`,
      },
      params: {
        firstSample: params[3],
        lastSample: params[4],
      },
    };
    try {
      const res = await vaxios.get(
        `/data/device/${idDev}/sensors/${idsSen}`,
        config
      );
      return res;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  /**
   *  Get chartList from firestore
   */
  getChartsFireBase({ commit }) {
    db.collection('charts')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.chartlist) {
            commit('setCharList', data.chartlist);
          }
        });
      });
  },
  /**
   * Checks first if chart object exists (update chart)
   * If not we push new chart on list
   * @param {*} param0
   * @param {*} chart
   */
  async addChart({ dispatch, state }, params) {
    //console.log('Passing chart: ', chart);
    const chart = params[0];
    const uidfb = params[1];
    const index = state.chartList.findIndex((elem) => {
      return elem.id === chart.id;
    });

    if (index > -1) {
      //console.log('Este es el índice encontrado: ', index);
      state.chartList[index] = chart;
    } else {
      state.chartList.push(chart);
    }

    try {
      params = [uidfb];
      const rs = await dispatch('updateChartfireBase', params);
      return rs;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async deleteChart({ dispatch, commit, state }, params) {
    const nchart = params[0];
    const uidfb = params[1];

    let nChartList = state.chartList.filter((chart) => {
      return nchart.id !== chart.id;
    });
    // first update store chart list
    commit('setCharList', nChartList);

    // then update firestore chart info
    try {
      params = [uidfb];
      const rs = await dispatch('updateChartfireBase', params);
      return rs;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  // addSerie({ commit, state}, serie) {
  //   this.chartList.series.push(serie);
  // },

  /**
   *
   * @param {https://firebase.google.com/docs/firestore/manage-data/add-data} param0
   * @param {*} params
   */
  async createChartOnFireBase({ commit, state }, params) {
    const firebaseUID = params[0];
    const data = { chartlist: state.chartList };
    db.collection('charts')
      .doc(firebaseUID)
      .set(data)
      .then((rs) => {
        console.log('Object created, ', rs);
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  },

  async updateChartfireBase({ commit, state }, params) {
    const firebaseUID = params[0];
    try {
      const data = { chartlist: state.chartList };
      console.log('update - uid: [', firebaseUID, ']', data);
      //await db.collection('charts').doc(firebaseUID).remove();
      const rs = await db.collection('charts').doc(firebaseUID).set(data);
      return rs;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  eraseAllData({ commit }) {
    commit('setCharList', []);
  },
};

export default { namespaced: true, state, getters, mutations, actions };
