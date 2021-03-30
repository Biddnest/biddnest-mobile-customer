import {Platform, Text, View} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import CloseIcon from '../../../components/closeIcon';
import DropDownAndroid from '../../../components/dropDown';
import TextInput from '../../../components/textInput';
import CheckBox from '../../../components/checkBox';
import FlatButton from '../../../components/flatButton';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import {
  CustomAlert,
  CustomConsole,
  resetNavigator,
} from '../../../constant/commonFun';
import CustomModalAndroid from '../../../components/customModal';
import React, {useState} from 'react';

const RejectBookingModal = (props) => {
  const [error, setError] = useState(undefined);
  const [isAgree, setAgree] = useState(true);
  return (
    <CustomModalAndroid visible={props.visible} onPress={props.closeModal}>
      <Text
        style={{
          fontFamily: 'Roboto-Regular',
          color: Colors.inputTextColor,
          fontSize: wp(3.5),
        }}>
        REASON FOR REJECTION
      </Text>
      <CloseIcon
        onPress={props.closeModal}
        style={{
          position: 'absolute',
          right: 15,
          top: Platform.OS === 'android' ? -4 : -10,
        }}
      />
      <DropDownAndroid
        label={''}
        value={props.value}
        width={wp(90)}
        items={props.dropDownDefault}
        onChangeItem={(text) => props.dropDownChange(text)}
      />
      <View style={{width: wp(90)}}>
        <TextInput
          label={''}
          placeHolder={'Enter your expected price here'}
          numberOfLines={4}
          isRight={error}
          value={props.rejectData?.desc}
          onChange={(text) => props.textOnChange(text)}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: hp(1.5),
        }}>
        <CheckBox onPress={() => setAgree(!isAgree)} value={isAgree} />
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            color: Colors.inputTextColor,
            fontSize: wp(3.8),
          }}>
          Talk to our agent
        </Text>
      </View>
      <FlatButton
        isLoading={props.isLoading}
        label={'CANCEL BOOKING'}
        onPress={() => {
          // Cancel booking API
          props.setLoading(true);
          if (props.rejectData?.desc?.replace(/^\s+/g, '').length === 0) {
            setError(false);
            props.setLoading(false);
          } else {
            setError(true);
            // From Requirement Details screen
            let obj = {
              url: props.setApiResponse
                ? 'bookings/cancel'
                : 'bookings/request/canceled',
              method: props.setApiResponse ? 'delete' : 'post',
              headers: {
                Authorization:
                  'Bearer ' + STORE.getState().Login?.loginData?.token,
              },
              data: {
                ...props.rejectData,
                public_booking_id: props?.public_booking_id,
              },
            };
            APICall(obj)
              .then((res) => {
                props.setLoading(false);
                if (res?.data?.status === 'success') {
                  props.setApiResponse &&
                    props.setApiResponse(res?.data?.booking);
                  props.closeModal();
                  resetNavigator(props.navigation, 'Dashboard');
                } else {
                  CustomAlert(res?.data?.message);
                }
              })
              .catch((err) => {
                props.setLoading(false);
                CustomConsole(err);
              });
          }
        }}
      />
    </CustomModalAndroid>
  );
};

export default RejectBookingModal;
