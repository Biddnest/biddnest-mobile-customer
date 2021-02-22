import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

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

export const wp = widthPercentageToDP;
export const hp = heightPercentageToDP;
