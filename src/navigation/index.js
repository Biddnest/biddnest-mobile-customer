import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/auth/splash';
import Login from '../screens/auth/login';
import Signup from '../screens/auth/signup';
import DrawerNavigation from './drawerNavigation';
import {navigationRef} from './RootNavigation';
import SingleTicket from '../screens/dashboard/drawer/singleTicket';
import WalkThroughPage from '../screens/auth/walkThroughPage';
import ChatBotButton from '../components/chatBotButton';

const Stack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const App = () => {
  const [routeName, setRouteName] = useState();
  useEffect(() => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }, []);
  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        theme={MyTheme}
        onStateChange={() => {
          setRouteName(navigationRef?.current?.getCurrentRoute().name);
        }}>
        <Stack.Navigator initialRouteName="Splash" headerMode={false}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="WalkThroughPage" component={WalkThroughPage} />
          <Stack.Screen name="Dashboard" component={DrawerNavigation} />
          <Stack.Screen name="SingleTicket" component={SingleTicket} />
        </Stack.Navigator>
        {/*{routeName && <ChatBotButton onPress={() => {}} />}*/}
      </NavigationContainer>
    </>
  );
};

export default App;
