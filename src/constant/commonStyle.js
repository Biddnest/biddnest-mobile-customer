import {Colors, hp, wp} from './colors';

export const STYLES = {
  textHeader: {
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Gilroy-Bold',
  },
  common: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperStyle: {
    stepIndicatorSize: hp(6),
    currentStepIndicatorSize: hp(6),
    separatorStrokeWidth: hp(0.1),
    currentStepStrokeWidth: hp(0.1),
    stepStrokeCurrentColor: Colors.darkBlue,
    stepStrokeWidth: hp(0.1),
    stepStrokeFinishedColor: Colors.darkBlue,
    stepStrokeUnFinishedColor: '#DEDEDE',
    separatorFinishedColor: Colors.darkBlue,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Colors.white,
    stepIndicatorUnFinishedColor: '#DEDEDE',
    stepIndicatorCurrentColor: Colors.darkBlue,
  },
  modalHeader: {
    fontFamily: 'Gilroy-Bold',
    color: Colors.inputTextColor,
    fontSize: wp(4),
    marginTop: 25,
    marginBottom: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  simpleText: {
    color: Colors.inputTextColor,
    fontSize: wp(3.8),
    marginTop: hp(3),
    marginBottom: hp(2),
    marginHorizontal: wp(10),
    textAlign: 'center',
  },
};
