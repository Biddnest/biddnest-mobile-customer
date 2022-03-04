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


const CancelBookingModal = (props) => {
  const [error, setError] = useState(undefined);
  
  return (
    <CustomModalAndroid
      title={'REASON FOR CANCEL'}
      visible={props.visible}
      onPress={props.closeModal}>
     
      <View style={{width: wp(90)}}>

      <TextInput
          label={''}
          placeHolder={'Reason of Cancellation'}
          numberOfLines={2}
          value={props.reason}
          onChange={(text) => props.setReason(text)}
        />
        <TextInput
          label={''}
          placeHolder={'Description of Cancellation'}
          numberOfLines={4}
          value={props.desc}
          onChange={(text) => props.setDesc(text)}
        />
      </View>
     
      <FlatButton
        isLoading={props.isLoading}
        label={'CANCEL ORDER'}
        onPress={() => props.onPressCancelButton()}
      />
    </CustomModalAndroid>
  );
};

export default CancelBookingModal;
