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
import EditProfile from '../screens/dashboard/myProfile/editProfile';
import ReferFriend from '../screens/dashboard/drawer/referFriend';
import ContactUs from '../screens/dashboard/drawer/contactUs';
import FAQs from '../screens/dashboard/drawer/faqs';
import FAQDetails from '../screens/dashboard/drawer/faqs/faqDetails';
import OrderTimer from '../screens/dashboard/myBooking/orderTimer';
import RaiseTicket from '../screens/dashboard/myBooking/raiseTicket';
import PlacedOrder from '../screens/dashboard/myBooking/placedOrder';

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
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="ReferFriend" component={ReferFriend} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="FAQs" component={FAQs} />
      <Stack.Screen name="FAQDetails" component={FAQDetails} />
      <Stack.Screen name="FinalQuote" component={FinalQuote} />
      <Stack.Screen name="RaiseTicket" component={RaiseTicket} />
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
      <Stack.Screen name="OrderTimer" component={OrderTimer} />
      <Stack.Screen name="PlacedOrder" component={PlacedOrder} />
      <Stack.Screen name="RaiseTicket" component={RaiseTicket} />
    </Stack.Navigator>
  );
};

const MyProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} headerMode={false}>
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export {MainStackNavigator, MyBookingStackNavigator, MyProfileStackNavigator};
