/**
 * Created by chenjiajun on 2019/11/5.
 */
import axios from 'axios'

const instance = axios.create({
  baseURL: ''
});

instance.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default instance;
