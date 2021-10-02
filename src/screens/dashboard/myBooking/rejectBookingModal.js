import {Text, View} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
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
import SelectionModalAndroid from '../../../components/selectionModal';

const RejectBookingModal = (props) => {
  const [error, setError] = useState(undefined);
  const [isAgree, setAgree] = useState(true);
  return (
    <CustomModalAndroid
      title={'REASON FOR REJECTION'}
      visible={props.visible}
      onPress={props.closeModal}>
      <SelectionModalAndroid
        value={props.value}
        width={wp(90)}
        label={''}
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
                ? 'bookings/request/rejected'
                : 'bookings/request/canceled',
              method: 'post',
              headers: {
                Authorization:
                  'Bearer ' + STORE.getState().Login?.loginData?.token,
              },
              data: {
                ...props.rejectData,
                public_booking_id: props?.public_booking_id,
                request_callback: isAgree,
              },
            };
            APICall(obj)
              .then((res) => {
                if (res?.data?.status === 'success') {
                  props.setApiResponse &&
                    props.setApiResponse(res?.data?.booking);
                  props.closeModal();
                  resetNavigator(props.navigation, 'Dashboard');
                } else {
                  CustomAlert(res?.data?.message);
                }
              })
              .catch((err) => CustomConsole(err))
              .finally(() => props.setLoading(false));
          }
        }}
      />
    </CustomModalAndroid>
  );
};

export default RejectBookingModal;
