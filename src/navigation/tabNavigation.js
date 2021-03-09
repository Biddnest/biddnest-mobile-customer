import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  MainStackNavigator,
  MyBookingStackNavigator,
  MyProfileStackNavigator,
} from './stackNavigation';
import {wp, hp, Colors} from '../constant/colors';
import {Image, Text} from 'react-native';
import ActiveHome from '../assets/svg/active_home.svg';
import InActiveHome from '../assets/svg/inactive_home.svg';
import ActiveBooking from '../assets/svg/active_booking.svg';
import InactiveBooking from '../assets/svg/inactive_booking.svg';
import ActiveProfile from '../assets/svg/active_profile.svg';
import InactiveProfile from '../assets/svg/inactive_profile.svg';

const TabNavigation = (props: any) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      tabBarOptions={{
        activeTintColor: Colors.darkBlue,
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
          if (route.name === 'Home') {
            if (focused) {
              return <ActiveHome width={hp(3)} height={hp(3)} />;
            }
            return <InActiveHome width={hp(12)} height={hp(12)} />;
          } else if (route.name === 'MyBooking') {
            if (focused) {
              return <ActiveBooking width={hp(12)} height={hp(12)} />;
            }
            return <InactiveBooking width={hp(3)} height={hp(3)} />;
          } else if (route.name === 'MyProfile') {
            if (focused) {
              return <ActiveProfile width={hp(12)} height={hp(12)} />;
            }
            return <InactiveProfile width={hp(3)} height={hp(3)} />;
          }
          return <ActiveHome width={hp(3)} height={hp(3)} />;
        },
        tabBarLabel: ({focused, color, size}) => {
          let tabLabel = 'Home';
          if (route.name === 'Home') {
          } else if (route.name === 'MyBooking') {
            tabLabel = 'My Bookings';
          } else if (route.name === 'MyProfile') {
            tabLabel = 'My Profile';
          }
          return (
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: wp(3.5),
                color: focused ? Colors.darkBlue : '#9D9CC5',
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
