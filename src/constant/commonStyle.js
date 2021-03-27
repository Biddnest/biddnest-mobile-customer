import {Colors, wp} from './colors';

export const STYLES = {
  textHeader: {
    fontFamily: 'Gilroy-Light',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
    textAlign: 'center',
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperStyle: {
    stepIndicatorSize: 45,
    currentStepIndicatorSize: 45,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 1,
    stepStrokeCurrentColor: Colors.darkBlue,
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: Colors.darkBlue,
    stepStrokeUnFinishedColor: '#DEDEDE',
    separatorFinishedColor: Colors.darkBlue,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Colors.white,
    stepIndicatorUnFinishedColor: '#DEDEDE',
    stepIndicatorCurrentColor: Colors.darkBlue,
  },
};
