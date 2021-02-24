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

const TabNavigation = (props: any) => {
  const Tab = createBottomTabNavigator();

  const renderImage = (uri) => {
    return (
      <Image
        source={uri}
        style={{height: hp(3), width: hp(3)}}
        resizeMode={'contain'}
      />
    );
  };

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
              return renderImage(require('../assets/images/active_home.png'));
            }
            return renderImage(require('../assets/images/active_home.png'));
          } else if (route.name === 'MyBooking') {
            if (focused) {
              return renderImage(require('../assets/images/active_home.png'));
            }
            return renderImage(
              require('../assets/images/inactive_booking.png'),
            );
          } else if (route.name === 'MyProfile') {
            if (focused) {
              return renderImage(require('../assets/images/active_home.png'));
            }
            return renderImage(
              require('../assets/images/inactive_profile.png'),
            );
          }
          return (
            <Image
              source={require('../assets/images/active_home.png')}
              style={{height: hp(3), width: hp(3)}}
              resizeMode={'contain'}
            />
          );
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
