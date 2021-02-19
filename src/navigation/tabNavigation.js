import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  MainStackNavigator,
  MyBookingStackNavigator,
  MyProfileStackNavigator,
} from './stackNavigation';
import {wp, hp, Colors} from '../constant/colors';
import {Text} from 'react-native';

const TabNavigation = (props: any) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      tabBarOptions={{
        activeTintColor: '#0F0C75',
        inactiveTintColor: '#9D9CC5',
        activeBackgroundColor: Colors.white,
        style: {
          height: hp(9),
          paddingVertical: hp(1),
          paddingBottom: hp(1),
          borderTopLeftRadius: wp(5),
          borderTopRightRadius: wp(5),
        },
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'ios-home';
          if (route.name === 'Home') {
          } else if (route.name === 'MyBooking') {
            iconName = 'ios-list';
          } else if (route.name === 'MyProfile') {
            iconName = 'ios-call';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({focused, color, size}) => {
          let tabLabel = 'Home';
          if (route.name === 'Home') {
          } else if (route.name === 'MyBooking') {
            tabLabel = 'My Booking';
          } else if (route.name === 'MyProfile') {
            tabLabel = 'My Profile';
          }
          return (
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: wp(3.5),
                color: focused ? '#0F0C75' : '#9D9CC5',
              }}>
              {tabLabel}
            </Text>
          );
        },
      })}>
      <Tab.Screen name="Home" component={MainStackNavigator} />
      <Tab.Screen name="MyBooking" component={MyBookingStackNavigator} />
      <Tab.Screen name="MyProfile" component={MyProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
