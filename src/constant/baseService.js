import axios from 'axios';
// import {STORE} from '../redux';

// const data = STORE.getState().Login?.configData?.config?.api || '';
const instance = axios.create({
  // baseURL: data.base_url + '/api/' + data.version + '/',
  // baseURL: 'https://dashboard-biddnest.dev.diginnovators.com/api/v1/',
  baseURL: 'https://uat-dashboard-biddnest.dev.diginnovators.com/api/v1/',
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

// REQUEST INTERCEPTOR
instance.interceptors.request.use(
  (request) => {
    console.log('Request: ', request);
    return request;
  },
  (error) => {
    console.error('Error from Request Interceptor: ', error);
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
instance.interceptors.response.use(
  (response) => {
    console.log('Response: ', response);
    return response;
  },
  (error) => {
    console.log('Error from Response Interceptor: ', error.response);
    return Promise.reject(error);
  },
);

export default instance;
