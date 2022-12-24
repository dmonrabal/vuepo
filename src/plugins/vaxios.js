import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_SIMOPO_PROD;

export default {
  get(url, options) {
    return axios
      .get(url, options)
      .then((response) => response.data)
      .catch((error) => error.response);
  },
  post(url, body, options) {
    console.log('BASE PATH AXIOS: ', axios.defaults.baseURL);
    console.log('URL AXIOS POST METHOD: ', url);
    console.log('Variables: ', process.env);
    return axios
      .post(url, body, options)
      .then((response) => response.data)
      .catch((error) => error.response);
  },
  update(url, body, options) {
    return axios
      .patch(url, body, options)
      .then((response) => response.data)
      .catch((error) => error.response);
  },
  delete(url, options) {
    return axios
      .delete(url, options)
      .then((response) => response.data)
      .catch((error) => error.response);
  },
};
