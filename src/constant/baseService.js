import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://dashboard-biddnest.dev.diginnovators.com:8080/api/v1/',
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
