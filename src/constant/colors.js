import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Image} from 'react-native';
import React from 'react';

export const Colors = {
  white: '#FFFFFF',
  black: '#000000',
  textLabelColor: '#424D58',
  inputTextColor: '#3B4B58',
  textBG: '#FDFDFD',
  btnBG: '#EBC352',
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

export const PAYMENT_OPTION = [
  {
    image: (
      <Image
        source={require('../assets/images/credit_card.png')}
        resizeMode={'contain'}
        style={{height: 40, width: 40}}
      />
    ),
    name: 'Credit Card',
  },
  {
    image: (
      <Image
        source={require('../assets/images/debit_card.png')}
        resizeMode={'contain'}
        style={{height: 40, width: 40}}
      />
    ),
    name: 'Debit Card',
  },
  {
    image: (
      <Image
        source={require('../assets/images/netbanking.png')}
        resizeMode={'contain'}
        style={{height: 40, width: 40}}
      />
    ),
    name: 'Net Banking',
  },
  {
    image: (
      <Image
        source={require('../assets/images/upipayment.png')}
        resizeMode={'contain'}
        style={{height: 50, width: 50}}
      />
    ),
    name: 'UPI Payment',
  },
];
