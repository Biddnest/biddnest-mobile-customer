import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CustomModalAndroid from '../../../components/customModal';
import {Colors, hp, wp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import {Rating, AirbnbRating} from 'react-native-elements';
import TwoButton from '../../../components/twoButton';
import TextInput from '../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {STYLES} from '../../../constant/commonStyle';

const RateUs = (props) => {
  const [rating, setRating] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [headerText, setHeaderText] = useState('How did you like our Service?');

  useEffect(() => {
    if (currentStep === 0) {
      setHeaderText('How did you like our Service?');
    } else if (currentStep === 1) {
      setHeaderText('How did you like our Driver?');
    } else if (currentStep === 2) {
      setHeaderText('How did you like our Experience?');
    } else if (currentStep === 3) {
      setHeaderText('Do you have any Suggestions?');
    } else {
      setHeaderText('Would you like to rate us on Playstore?');
    }
  }, [currentStep]);
  return (
    <CustomModalAndroid
      visible={props.visible}
      onPress={() => {
        setCurrentStep(0);
        props.onCloseIcon();
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '85%',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Roboto-Regular',
            color: Colors.inputTextColor,
          }}>
          RATE US!
        </Text>
        <CloseIcon
          onPress={() => {
            setCurrentStep(0);
            props.onCloseIcon();
          }}
        />
      </View>
      <View style={{...styles.separatorView, width: '85%'}} />
      {currentStep === 4 && (
        <View
          style={{
            height: wp(15),
            width: wp(15),
            borderRadius: wp(7.5),
            backgroundColor: Colors.darkBlue,
            ...STYLES.common,
          }}>
          <Ionicons
            name={'logo-google-playstore'}
            color={Colors.white}
            size={wp(10)}
          />
        </View>
      )}
      <Text style={styles.text}>{headerText}</Text>
      {(currentStep === 0 || currentStep === 1 || currentStep === 2) && (
        <AirbnbRating
          count={5}
          defaultRating={rating}
          startingValue={0}
          showRating={false}
          fractions={1}
          ratingCount={5}
          imageSize={30}
          onFinishRating={(text) => setRating(text)}
        />
      )}
      {currentStep === 3 && (
        <TextInput
          label={''}
          placeHolder={
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At'
          }
          numberOfLines={4}
          onChange={(text) => {}}
        />
      )}
      <TwoButton
        leftLabel={'SKIP'}
        rightLabel={currentStep === 4 ? 'SURE!' : 'NEXT'}
        leftOnPress={() => {
          if (currentStep === 4) {
            setCurrentStep(0);
            props.onCloseIcon();
          } else {
            setCurrentStep(currentStep + 1);
          }
        }}
        rightOnPress={() => {
          if (currentStep === 4) {
            setCurrentStep(0);
            props.onCloseIcon();
          } else {
            setCurrentStep(currentStep + 1);
          }
        }}
      />
    </CustomModalAndroid>
  );
};

export default RateUs;

const styles = StyleSheet.create({
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  text: {
    color: Colors.inputTextColor,
    fontSize: wp(3.8),
    marginTop: hp(3),
    marginBottom: hp(2),
  },
});
