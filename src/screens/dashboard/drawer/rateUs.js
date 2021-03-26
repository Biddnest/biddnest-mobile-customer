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
import {
  CustomAlert,
  CustomConsole,
  resetNavigator,
} from '../../../constant/commonFun';
import {useSelector} from 'react-redux';
import FlatButton from '../../../components/flatButton';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';

const RateUs = (props) => {
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.review?.question) ||
    [];
  const [isLoading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [review, setReview] = useState([]);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    let temp = [];
    configData.forEach((item) => {
      if (item?.type === 'rating') {
        temp.push({
          question: item.question,
          rating: 3,
        });
      }
    });
    setReview(temp);
  }, []);
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
      {/*{currentStep === 4 && (*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      height: wp(15),*/}
      {/*      width: wp(15),*/}
      {/*      borderRadius: wp(7.5),*/}
      {/*      backgroundColor: Colors.darkBlue,*/}
      {/*      ...STYLES.common,*/}
      {/*    }}>*/}
      {/*    <Ionicons*/}
      {/*      name={'logo-google-playstore'}*/}
      {/*      color={Colors.white}*/}
      {/*      size={wp(10)}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*)}*/}
      <Text style={styles.text}>{configData[currentStep].question}</Text>
      {(configData[currentStep].type === 'rating' && (
        <AirbnbRating
          count={5}
          defaultRating={review[currentStep]?.rating}
          startingValue={0}
          showRating={false}
          fractions={1}
          ratingCount={5}
          imageSize={30}
          onFinishRating={(text) => {
            let temp = [...review];
            temp[currentStep].rating = text;
            setReview(temp);
          }}
        />
      )) || (
        <TextInput
          label={''}
          numberOfLines={4}
          onChange={(text) => setSuggestion(text)}
          value={suggestion}
        />
      )}
      {(currentStep === 0 && (
        <View style={{marginTop: hp(2)}}>
          <FlatButton
            label={'NEXT'}
            onPress={() => {
              setCurrentStep(currentStep + 1);
            }}
          />
        </View>
      )) || (
        <TwoButton
          isLoading={isLoading}
          leftLabel={'PREVIOUS'}
          rightLabel={currentStep === configData.length - 1 ? 'SURE!' : 'NEXT'}
          leftOnPress={() => {
            setCurrentStep(currentStep - 1);
          }}
          rightOnPress={() => {
            if (configData.length - 1 === currentStep) {
              // Call Add Review API
              setLoading(true);
              let obj = {
                url: 'review',
                method: 'post',
                headers: {
                  Authorization:
                    'Bearer ' + STORE.getState().Login?.loginData?.token,
                },
                data: {
                  public_booking_id: props?.public_booking_id,
                  review: review,
                  suggestion: 'ABC',
                },
              };
              APICall(obj)
                .then((res) => {
                  setLoading(false);
                  if (res?.data?.status === 'success') {
                    setCurrentStep(0);
                    props.successRedirect();
                  } else {
                    CustomAlert(res?.data?.message);
                  }
                })
                .catch((err) => {
                  setLoading(false);
                  CustomConsole(err);
                });
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
        />
      )}
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
