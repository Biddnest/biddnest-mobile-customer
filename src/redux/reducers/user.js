import {LOGIN_USER_DATA} from '../types';
import {appDefaultReducer} from './default';
const INITIAL_STATE = appDefaultReducer.Login;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_DATA: {
      return {...state, loginData: action.payload};
    }
    default:
      return state;
  }
};
