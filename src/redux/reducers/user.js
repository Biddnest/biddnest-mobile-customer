import {
  CHAT_BOT_VISIBLE,
  CONFIG_DATA,
  ENQUIRY_ORDERS,
  FORM_DATA,
  GET_ZONES,
  INVENTORY_DATA,
  LIVE_ORDERS,
  LOGIN_USER_DATA,
  PAST_ORDERS,
  SERVICE_DATA,
  SLIDER_DATA,
} from '../types';
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
    case INVENTORY_DATA: {
      return {...state, inventoriesData: action.payload};
    }
    case LIVE_ORDERS: {
      return {...state, liveOrders: action.payload};
    }
    case ENQUIRY_ORDERS: {
      return {...state, enquiryOrders: action.payload};
    }
    case PAST_ORDERS: {
      return {...state, pastOrders: action.payload};
    }
    case GET_ZONES: {
      return {...state, zones: action.payload};
    }
    case FORM_DATA: {
      return {...state, formData: action.payload};
    }
    case CHAT_BOT_VISIBLE: {
      return {...state, chatBotVisible: action.payload};
    }
    default:
      return state;
  }
};
