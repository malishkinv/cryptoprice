import axios from "axios";
const api_key = "3fd910df59aec1532f0d628006650038c746f4a62731a5cf04c3d59f7a31296a";

const ApiService = {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  setHeader() {
    axios.defaults.headers.common["Authorization"] =
        "Apikey " + api_key;
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  }
};

export default ApiService;
