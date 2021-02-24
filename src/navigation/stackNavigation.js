import AboutUs from '../screens/dashboard/drawer/aboutUs';
import TermsAndConditions from '../screens/dashboard/drawer/termsAndConditions';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/dashboard/home';
import MyBooking from '../screens/dashboard/myBooking';
import MyProfile from '../screens/dashboard/myProfile';
import BookingStepper from '../screens/dashboard/home/bookingStepper';
import OrderTracking from '../screens/dashboard/myBooking/orderTracking';
import Payment from '../screens/dashboard/myBooking/payment';
import CardDetails from '../screens/dashboard/myBooking/cardDetails';
import FinalQuote from '../screens/dashboard/myBooking/finalQuote';

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} headerMode={false}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="BookingStepper" component={BookingStepper} />
    </Stack.Navigator>
  );
};

const MyBookingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} headerMode={false}>
      <Stack.Screen name="MyBooking" component={MyBooking} />
      <Stack.Screen name="OrderTracking" component={OrderTracking} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="CardDetails" component={CardDetails} />
        <Stack.Screen name="FinalQuote" component={FinalQuote} />
    </Stack.Navigator>
  );
};

const MyProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} headerMode={false}>
      <Stack.Screen name="MyProfile" component={MyProfile} />
    </Stack.Navigator>
  );
};

const DrawerStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
    </Stack.Navigator>
  );
};

export {
  MainStackNavigator,
  MyBookingStackNavigator,
  MyProfileStackNavigator,
  DrawerStackNavigator,
};
