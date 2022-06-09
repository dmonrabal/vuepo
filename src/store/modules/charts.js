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
   * Checks first if chart object exists (update chart)
   * If not we push new chart on list
   * @param {*} param0
   * @param {*} chart
   */
  addChart({ commit, state }, chart) {
    //console.log('Passing chart: ', chart);
    const index = state.chartList.findIndex((elem) => {
      return elem.id === chart.id;
    });

    if (index > -1) {
      //console.log('Este es el índice encontrado: ', index);
      state.chartList[index] = chart;
    } else {
      state.chartList.push(chart);
    }
  },

  deleteChart({ commit, state }, nchart) {
    let nChartList = state.chartList.filter((chart) => {
      return nchart.id !== chart.id;
    });
    commit('setCharList', nChartList);
  },

  // addSerie({ commit, state}, serie) {
  //   this.chartList.series.push(serie);
  // },

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
      console.log('Respuesta GET Data: ', err);
      return { status: 'failed', message: err.message };
    }
  },

  getChartsFireBase({ commit }) {
    console.log('getChartsFireBase');

    // v8
    db.collection('charts')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
          //console.log(`${doc.id} => ${ JSON.stringify(doc)}`);
          const data = doc.data();
          if (data.chartlist) {
            commit('setCharList', data.chartlist);
          }
        });
      });
  },

  async updateChartfireBase({ commit, state }, params) {
    const firebaseUID = params[0];
    try {
      const ref = db.collection('charts').doc(firebaseUID);
      const obj = { chartlist: state.chartList };
      console.log('DB: ', state.chartList);
      const rs = await db.collection('charts').doc(firebaseUID).set(obj);
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  },

  eraseAllData({ commit }) {
    commit('setCharList', []);
  },
};

export default { namespaced: true, state, getters, mutations, actions };
