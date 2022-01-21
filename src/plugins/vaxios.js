import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_URL_PROD;

export default {
  get(url, options) {
    return axios.get(url, options).then((response) => response.data);
  },
  post(url, body, options) {
    return axios.post(url, body, options).then((response) => response.data);
  },
  update(url, body, options) {
    return axios.patch(url, body, options).then((response) => response.data);
  },
  delete(url, options) {
    return axios.delete(url, options);
  },
};
