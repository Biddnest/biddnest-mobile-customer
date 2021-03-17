import React from 'react';
import {SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import App from '../navigation';
import appReducer from './reducers';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import Thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {logger} from 'redux-logger';
import ChatBotButton from '../components/chatBotButton';

const PERSIST_CONFIG = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 0,
};

const PERSIST_REDUCER = persistReducer(PERSIST_CONFIG, appReducer);
export const STORE = createStore(
  PERSIST_REDUCER,
  applyMiddleware(Thunk, logger),
);
let PERSIST_STORE = persistStore(STORE);

console.disableYellowBox = true;

const MainNavigator = () => {
  return (
    <Provider store={STORE}>
      <PersistGate loading={null} persistor={PERSIST_STORE}>
        <SafeAreaView style={{flex: 1}}>
          <App />
          {/*{STORE.getState().Login?.loginData?.token && (*/}
          {/*  <ChatBotButton onPress={() => {}} />*/}
          {/*)}*/}
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default MainNavigator;
