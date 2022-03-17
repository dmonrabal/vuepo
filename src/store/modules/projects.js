import vaxios from '@/plugins/vaxios';
import AppError from '@/plugins/appError';

const state = () => ({
  projectList: [], // All projects
  groupsList: [], // All groups
  projectSelected: '',
  groupSelected: '',
  totalStats: {
    totalProjecs: 0,
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

  setGroups(state, payload) {
    state.groupsList = payload;
  },

  setGroup(state, payload) {
    state.groupSelected = payload;
  },

  setTotalStats(state, payload) {
    state.totalStats = payload;
  },
};

const actions = {
  // PROJECT ACTIONS
  async getProjects({ dispatch, commit }, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.get('/projects', config);
      //console.log(res.data);
      commit('setProjects', res.data);
      const reslg = await dispatch('loadFullGroups');
      const reslstat = await dispatch('getTotalStats', token);
      return res;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async getProject({ commit }, idProject) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.get(`/projects/${idProject}`);
      return res.data;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async createProject({ dispatch, commit }, params) {
    const token = params[0];
    const body = params[1];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await vaxios.post('/projects/', body, config);
      // console.log('Res update project:', res);
      commit('setProject', res.data.project);
      const resUpPr = await dispatch('getProjects', token);
      return resUpPr;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async updateProject({ dispatch, commit }, params) {
    const token = params[0];
    const body = params[1];
    const idProject = params[2];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await vaxios.update(`/projects/${idProject}`, body, config);
      commit('setProject', res.data.project);
      const resUpPr = await dispatch('getProjects', token);
      return res;
    } catch (err) {
      //console.log('EXCEPTION updateProject: ', err);
      return { status: 'failed', message: err.message };
    }
  },

  async deleteProject({ dispatch, commit }, params) {
    const token = params[0];
    const idProject = params[1];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.delete(`/projects/${idProject}`, config);
      commit('setProject', '');
      const resUpPr = await dispatch('getProjects', token);
      return resUpPr;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  selectProject({ commit }, project) {
    commit('setProject', project);
  },

  // GROUP METHODS
  async createGroup({ dispatch, commit }, params) {
    const token = params[0];
    const body = params[1];
    const idProject = params[2];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const resDB = await vaxios.post(
        `/projects/${idProject}/groups`,
        body,
        config
      );
      // commit('setProject', resDB.data.project);
      const resUpPr = await dispatch('getProjects', token);
      return resUpPr;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async updateGroup({ dispatch, commit }, params) {
    const token = params[0];
    const body = params[1];
    const idProject = params[2];
    const idGroup = params[3];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await vaxios.update(
        `/projects/${idProject}/groups/${idGroup}`,
        body,
        config
      );
     // commit('setProject', res.data.project);
      const resUpPr = await dispatch('getProjects', token);
      return res;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },

  async deleteGroup({ dispatch, commit }, params) {
    const token = params[0];
    const idProject = params[1];
    const idGroup = params[2];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await vaxios.delete(
        `/projects/${idProject}/groups/${idGroup}`,
        config
      );
      // commit('setProject', res.data.project);
      const resUpPr = await dispatch('getProjects', token);
      return resUpPr;
    } catch (err) {
      return { status: 'failed', message: err.message };
    }
  },
  // Stats methods
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
      // console.log('Mis stats: ', stats);
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

          project.stats = {
            totalGroups: res.totalGroups,
            totalDevices: res.totalDevices,
            totalSensors: res.totalSensors,
            totalUsers: res.totalUsers,
            maxCalls: res.callsToAPI.max,
            minCalls: res.callsToAPI.min,
            totCalls: res.callsToAPI.total,
          };

          //console.log('STATS: ', project.stats);
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

  loadFullGroups({ commit, state }) {
    let groups = [];
    state.projectList.forEach((project) => {
      //console.log('Entro en proyecto: ', project.name);
      project.groups.forEach((group) => {
        let groupLoad = group;
        groupLoad.project = project.name;
        groupLoad.idProject = project._id;

        groups.push(groupLoad);
      });
    });
    commit('setGroups', groups);
  },

  selectGroup({ commit, state }, group) {
    commit('setGroup', group);
  },
};

export default { namespaced: true, state, getters, mutations, actions };
