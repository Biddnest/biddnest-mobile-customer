import {combineReducers} from 'redux';
import UserReducer from './user';
import {RESET_STORE} from '../types';
import {appDefaultReducer} from './default';

const appReducer = combineReducers({
  Login: UserReducer,
});

export default function rootReducer(state, action) {
  let finalState = appReducer(state, action);
  if (action.type === RESET_STORE) {
    finalState = appDefaultReducer; //resetReducer(finalState, action);
  }
  return finalState;
}
