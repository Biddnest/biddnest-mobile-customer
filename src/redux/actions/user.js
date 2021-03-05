import instance from '../../constant/baseService';
import {LOGIN_USER_DATA, RESET_STORE} from '../types';
import {CustomAlert} from '../../constant/commonFun';

export const APICall = (obj) => {
  return new Promise((resolve, reject) => {
    instance(obj)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err?.response) {
          reject(err.response);
        } else {
          CustomAlert('Server Down');
        }
      });
  });
};

export const sendOTP = (data) => {
  return new Promise((resolve, reject) => {
    let obj = {
      url: 'auth/login',
      method: 'post',
      data: data,
    };
    APICall(obj)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const verifyOTP = (data) => {
  return new Promise((resolve, reject) => {
    let obj = {
      url: 'auth/login/verify-otp',
      method: 'post',
      data: data,
    };
    APICall(obj)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const signUP = (data) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: 'auth/signup',
        method: 'post',
        data: data,
      };
      APICall(obj)
        .then((res) => {
          if (res?.data?.status === 'success') {
            dispatch({
              type: LOGIN_USER_DATA,
              payload: res.data,
            });
          }
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const signOut = (data) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      APICall(data)
        .then((res) => {
          if (res && res.data && res.data.status === 'success') {
            dispatch({
              type: RESET_STORE,
            });
          }
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};
