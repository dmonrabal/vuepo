import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login';
import Projects from '../views/Projects';
import Project from '../views/Project';
import Groups from '../views/Groups';
import Group from '../views/Group';
import Devices from '../views/Devices';
import Device from '../views/Device';
import User from '../views/User';

import Data from '../views/Data';
// Only for test purpose
import Grid from '../views/Grid';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/proyectos',
    name: 'Projects',
    component: Projects,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/proyectos/:idProject',
    name: 'Project',
    component: Project,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/grupos/',
    name: 'Groups',
    component: Groups,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/grupos/:idGroup',
    name: 'Group',
    component: Group,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/dispositivos/',
    name: 'Devices',
    component: Devices,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/dispositivos/:idDevice',
    name: 'Device',
    component: Device,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/datos',
    name: 'Data',
    component: Data,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/usuario',
    name: 'User',
    component: User,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/grid',
    name: 'Grid',
    component: Grid,
    meta: {
      requireAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const rutaPro = to.matched.some((record) => record.meta.requireAuth);
  if (rutaPro && store.state.users.isLogged === false) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
