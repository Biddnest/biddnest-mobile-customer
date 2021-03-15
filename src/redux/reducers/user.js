import {CONFIG_DATA, LOGIN_USER_DATA, SERVICE_DATA, SLIDER_DATA} from '../types';
import {appDefaultReducer} from './default';
const INITIAL_STATE = appDefaultReducer.Login;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_DATA: {
      return {...state, loginData: action.payload};
    }
    case SERVICE_DATA: {
      return {...state, serviceData: action.payload};
    }
    case CONFIG_DATA: {
      return {...state, configData: action.payload};
    }
    case SLIDER_DATA: {
      return {...state, sliderData: action.payload};
    }
    default:
      return state;
  }
};
