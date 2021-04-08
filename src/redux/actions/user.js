import instance from '../../constant/baseService';
import {
  CONFIG_DATA,
  INVENTORY_DATA,
  LIVE_ORDERS,
  LOGIN_USER_DATA,
  PAST_ORDERS,
  RESET_STORE,
  SERVICE_DATA,
  SLIDER_DATA,
} from '../types';
import {CustomAlert} from '../../constant/commonFun';
import {STORE} from '../index';
import {CommonActions} from '@react-navigation/native';

export const APICall = (obj) => {
  return new Promise((resolve, reject) => {
    instance(obj)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          CustomAlert('Try to login again');
          // Logout
          // dispatch({
          //   type: RESET_STORE,
          // });
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{name: 'Login'}],
          //   }),
          // );
        } else if (err?.response) {
          reject(err.response);
        } else {
          CustomAlert('Server Down');
          reject(false);
        }
      });
  });
};

export const initialConfig = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: 'configuration',
        method: 'get',
      };
      APICall(obj)
        .then((res) => {
          dispatch({
            type: CONFIG_DATA,
            payload: res?.data?.data || {},
          });
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
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
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
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
};

export const updateProfile = (data) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: 'profile/update',
        method: 'put',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
        data: data,
      };
      APICall(obj)
        .then((res) => {
          dispatch({
            type: LOGIN_USER_DATA,
            payload: {
              ...STORE.getState().Login?.loginData,
              user: res?.data?.data?.user,
            },
          });
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

export const getSlider = (data) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: `sliders?lat=${data.latitude}&lng=${data.longitude}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          dispatch({
            type: SLIDER_DATA,
            payload: res?.data?.data || {},
          });
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const getServices = (data) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: `services?lat=${data.latitude}&lng=${data.longitude}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          dispatch({
            type: SERVICE_DATA,
            payload: res?.data?.data || {},
          });
          resolve(res.data);
        })
        .catch((err) => {
          if (err.status === 401) {
            // dispatch({
            //   type: RESET_STORE,
            // });
            // CommonActions.reset({
            //   index: 0,
            //   routes: [{name: 'Login'}],
            // });
          }
          CustomAlert(err?.data?.message);
          reject(err);
        });
    });
  };
};

export const getAllInventories = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: 'inventories/all',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          dispatch({
            type: INVENTORY_DATA,
            payload: res?.data?.data || {},
          });
          resolve(res.data);
        })
        .catch((err) => {
          if (err.status === 401) {
            // dispatch({
            //   type: RESET_STORE,
            // });
            // CommonActions.reset({
            //   index: 0,
            //   routes: [{name: 'Login'}],
            // });
          }
          CustomAlert(err?.data?.message);
          reject(err);
        });
    });
  };
};

export const getLiveOrders = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: 'bookings/history/live',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          dispatch({
            type: LIVE_ORDERS,
            payload: res?.data?.data || {},
          });
          resolve(res.data);
        })
        .catch((err) => {
          if (err.status === 401) {
            // dispatch({
            //   type: RESET_STORE,
            // });
            // CommonActions.reset({
            //   index: 0,
            //   routes: [{name: 'Login'}],
            // });
          }
          CustomAlert(err?.data?.message);
          reject(err);
        });
    });
  };
};

export const getPastOrders = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let obj = {
        url: 'bookings/history/past',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          dispatch({
            type: PAST_ORDERS,
            payload: res?.data?.data || {},
          });
          resolve(res.data);
        })
        .catch((err) => {
          if (err.status === 401) {
            // dispatch({
            //   type: RESET_STORE,
            // });
            // CommonActions.reset({
            //   index: 0,
            //   routes: [{name: 'Login'}],
            // });
          }
          CustomAlert(err?.data?.message);
          reject(err);
        });
    });
  };
};

export const getOrderDetails = (id) => {
  return new Promise((resolve, reject) => {
    let obj = {
      url: `bookings?id=${id}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err.status === 401) {
          // dispatch({
          //   type: RESET_STORE,
          // });
          // CommonActions.reset({
          //   index: 0,
          //   routes: [{name: 'Login'}],
          // });
        }
        CustomAlert(err?.data?.message);
        reject(err);
      });
  });
};
