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
import FinalQuote from '../screens/dashboard/myBooking/finalQuote';
import EditProfile from '../screens/dashboard/myProfile/editProfile';
import ReferFriend from '../screens/dashboard/drawer/referFriend';
import ContactUs from '../screens/dashboard/drawer/contactUs';
import FAQs from '../screens/dashboard/drawer/faqs';
import FAQDetails from '../screens/dashboard/drawer/faqs/faqDetails';
import OrderTimer from '../screens/dashboard/myBooking/orderTimer';
import RaiseTicket from '../screens/dashboard/myBooking/raiseTicket';
import BookingInitialQuote from '../screens/dashboard/myBooking/bookingIntialQuote';
import OrderDetails from '../screens/dashboard/drawer/orderDetails';
import PrivacyPolicy from '../screens/dashboard/drawer/privacyPolicy';
import Notification from '../screens/dashboard/drawer/notification';

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
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="RaiseTicket" component={RaiseTicket} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="OrderTimer" component={OrderTimer} />
      <Stack.Screen name="OrderTracking" component={OrderTracking} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen
        name="BookingInitialQuote"
        component={BookingInitialQuote}
      />
    </Stack.Navigator>
  );
};

const MyBookingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} headerMode={false}>
      <Stack.Screen name="MyBooking" component={MyBooking} />
      <Stack.Screen name="OrderTracking" component={OrderTracking} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="FinalQuote" component={FinalQuote} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen
        name="BookingInitialQuote"
        component={BookingInitialQuote}
      />
      <Stack.Screen name="OrderTimer" component={OrderTimer} />
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
