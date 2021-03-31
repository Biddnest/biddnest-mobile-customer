import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Image} from 'react-native';
import React from 'react';
import Delivery from '../assets/svg/delivery.svg';
import Packaging from '../assets/svg/packaging.svg';
import Vendor from '../assets/svg/vendor.svg';
import Bidding from '../assets/svg/bidding.svg';
import Safety from '../assets/svg/safety.svg';
import Pricing from '../assets/svg/pricing.svg';
import CreditCard from '../assets/svg/credit_card.svg';
import DebitCard from '../assets/svg/debit_card.svg';
import NetBanking from '../assets/svg/netbanking.svg';

export const MapConstantDelta = 0.01;

export const Colors = {
  white: '#FFFFFF',
  black: '#000000',
  textLabelColor: '#424D58',
  inputTextColor: '#3B4B58',
  textBG: '#FDFDFD',
  btnBG: '#FFBC1E',
  silver: '#E0E5EC',
  grey: 'grey',
  transparent: 'transparent',
  red: 'red',
  lightGreen: '#83C373',
  darkBlue: '#0F0C75',
  pageBG: '#EFEFF4',
};

export const boxShadow = {
  shadowOffset: {width: 0, height: 4},
  shadowOpacity: 0.8,
  elevation: 2,
  shadowRadius: 2,
  shadowColor: '#3B4B5833',
};

export const IMAGE_OPTIONS = {
  title: 'Biddnest',
  takePhotoButtonTitle: 'Camera...',
  customButtons: [],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.5,
};

export const wp = widthPercentageToDP;
export const hp = heightPercentageToDP;

const renderImage = (uri, size = 50) => {
  return (
    <Image
      source={uri}
      resizeMode={'contain'}
      style={{height: size, width: size}}
    />
  );
};

export const PAYMENT_OPTION = [
  {
    image: <CreditCard width={40} height={40} />,
    name: 'Cards',
    value: 'card',
  },
  {
    image: <DebitCard width={40} height={40} />,
    name: 'Wallets',
    value: 'wallet',
  },
  {
    image: <NetBanking width={40} height={40} />,
    name: 'Net Banking',
    value: 'netbanking',
  },
  {
    image: renderImage(require('../assets/images/upipayment.png')),
    name: 'UPI Payment',
    value: 'upi',
  },
];

export const FAQS_OPTION = [
  {
    image: <Delivery width={50} height={50} />,
    name: 'Delivery',
  },
  {
    image: <Packaging width={50} height={50} />,
    name: 'Packaging',
  },
  {
    image: <Vendor width={50} height={50} />,
    name: 'Vendor',
  },
  {
    image: <Bidding width={50} height={50} />,
    name: 'Bidding',
  },
  {
    image: <Safety width={50} height={50} />,
    name: 'Safety',
  },
  {
    image: <Pricing width={50} height={50} />,
    name: 'Pricing',
  },
];

export const SIDE_DRAWER = [
  {
    iconFamily: 'Ionicons',
    icon: 'home-outline',
    topText: 'Home',
    bottomText: 'Explore Biddnest',
    navigate: 'Home',
  },
  {
    iconFamily: 'Ionicons',
    icon: 'calendar-outline',
    topText: 'My Bookings',
    bottomText: 'Everything you need to know',
    navigate: 'MyBooking',
  },
  {
    iconFamily: 'Feather',
    icon: 'info',
    topText: 'About Us',
    bottomText: 'Get to know us!',
    navigate: 'AboutUs',
  },
  {
    iconFamily: 'Ionicons',
    icon: 'document-text-outline',
    topText: 'Terms and Conditions',
    bottomText: 'Read more about our terms',
    navigate: 'TermsAndConditions',
  },
  {
    iconFamily: 'Ionicons',
    icon: 'share-social-outline',
    topText: 'Refer a friend',
    bottomText: 'Spread the joy of ease',
    navigate: 'ReferFriend',
  },
  {
    iconFamily: 'Ionicons',
    icon: 'help-buoy-outline',
    topText: 'Get Support',
    bottomText: 'Get in touch with us',
    navigate: 'ContactUs',
  },
  {
    iconFamily: 'MaterialCommunityIcons',
    icon: 'comment-question-outline',
    topText: 'FAQs',
    bottomText: 'Find answers for what you need',
    navigate: 'FAQs',
  },
];
