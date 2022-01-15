import vaxios from '@/plugins/vaxios';

const state = () => ({
  projectList: [],
  projectSelected: '',
  totalStats: {
    totalProjecs:0,
    totalGroups: 0,
    totalUsers: 0,
    totalDevices: 0,
    totalSensors: 0,
    callsToAPI: {
      max: 0,
      min: 0,
      total: 0,
    },
  },
});

const getters = {};
const mutations = {
  setProjects(state, payload) {
    state.projectList = payload.projects;
  },

  setProject(state, payload) {
    state.projectSelected = payload;
  },

  setTotalStats(state, payload) {
    state.totalStats = payload;
  },
};
const actions = {
  async getProjects({ commit }, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.get('/projects', config);
      //console.log(res.data);
      commit('setProjects', res.data);
    } catch (err) {
      console.log('[ERROR] projects:getProjects: ', err);
    }
  },

  async getStatsProject({ commit }, params) {
    const token = params[0];
    const idProject = params[1];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const stats = await vaxios.get(`/stats/project/${idProject}`, config);
      //console.log('Mis stats: ', stats);
      return stats;
    } catch (err) {
      console.log('[ERROR] projects:getStatsProject: ', err);
    }
  },

  async getTotalStats({ dispatch, commit, state }, token) {
    let totalGrp = 0;
    let totalUsers = 0;
    let totalDev = 0;
    let totalSen = 0;
    let maxCalls = 0;
    let minCalls = 0;
    let totCalls = 0;

    if (state.projectList.length > 0) {
      await Promise.all(
        state.projectList.map(async (project) => {
          const idPro = project._id;
          const res = await dispatch('getStatsProject', [token, idPro]);
          //console.log(res);
          totalGrp += res.totalGroups;
          totalUsers += res.totalUsers;
          totalDev += res.totalDevices;
          totalSen += res.totalSensors;
          maxCalls += res.callsToAPI.max;
          minCalls += res.callsToAPI.min;
          totCalls += res.callsToAPI.total;
        })
      );
    }

    const stats = {
      totalProjecs: state.projectList.length,
      totalGroups: totalGrp,
      totalUsers: totalUsers,
      totalDevices: totalDev,
      totalSensors: totalSen,
      callsToAPI: {
        max: maxCalls,
        min: minCalls,
        total: totCalls,
      },
    };

    commit('setTotalStats', stats);
  },

  async getProject({ commit }, idProject) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const project = await vaxios.get(`/projects/${idProject}`);
      console.log('Project: ' - Project);
    } catch (err) {
      console.log('[ERROR] projects:getProjects: ', err);
    }
  },
};

export default { namespaced: true, state, getters, mutations, actions };
