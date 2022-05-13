import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Design
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';

// ApexCharts
import VueApexCharts from 'vue-apexcharts';
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

// Vuevalidate
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

// Axios
import axios from 'axios';

Vue.config.productionTip = false;

new Vue({
  router,
  store,n
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
