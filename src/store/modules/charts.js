import vaxios from '@/plugins/vaxios';
import router from '@/router/index';
import AppError from '@/plugins/appError';

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
  async getSeriesData({ commit }, params) {
    const token = params[0];
    const idPro = params[2];
    const idGrp = params[1];
    const idDev = params[3];
    const idsSe = params[4];
    const lsen = idsSe.join(",");
    console.log(params, ', list series: ', lsen);
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    try {
        const res = await vaxios.get(`/data/device/${idDev}/sensors/${lsen}`, config);
        return res.series;
    } catch (err) {
        console.log('[ERROR] getSeriesData: ', err.message);
    }
  },
};

export default { namespaced: true, state, getters, mutations, actions };
