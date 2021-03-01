import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://wap-api.dev.diginnovators.com:3000/',
  baseURL: 'https://api.wap-awaragainstpollution.com/v2/',
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
