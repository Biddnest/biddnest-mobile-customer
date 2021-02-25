import React from 'react';
import CustomModalAndroid from '../../../components/customModal';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colors, wp, hp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import TextInput from '../../../components/textInput';
import {STYLES} from '../../../constant/commonStyle';
import CheckBox from '../../../components/checkBox';
import FlatButton from '../../../components/flatButton';

const UPIPayment = (props) => {
  return (
    <CustomModalAndroid visible={props.visible}>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
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
            UPI PAYMENT
          </Text>
          <CloseIcon onPress={props.onCloseIcon} />
        </View>
        <View style={{...styles.separatorView, width: '85%'}} />
        <View style={{width: wp(90)}}>
          <TextInput
            label={'UPI ID'}
            placeHolder={'abc@sbcbank.com'}
            onChange={(text) => {}}
          />
        </View>
        <Image
          source={require('../../../assets/images/timer_clock.png')}
          style={{height: wp(30), width: wp(30), marginVertical: hp(0.8)}}
          resizeMode={'contain'}
        />
        <Text style={styles.mainText}>Time Left</Text>
        <FlatButton label={'SUBMIT'} />
      </View>
    </CustomModalAndroid>
  );
};

export default UPIPayment;

const styles = StyleSheet.create({
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  mainText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
    marginTop: hp(1),
  },
});
