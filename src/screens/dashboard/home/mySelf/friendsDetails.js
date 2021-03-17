import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, Platform, Image} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextInput from '../../../../components/textInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Switch from '../../../../components/switch';
import Button from '../../../../components/button';
import MapModalAndroid from '../../../../components/mapModal';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CloseIcon from '../../../../components/closeIcon';

const FriendsDetails = (props) => {
  const {data, handleStateChange} = props;
  let contact_details = data?.contact_details || {};

  const handleState = (key, value) => {
    let temp = {...data.contact_details};
    temp[key] = value;
    handleStateChange('contact_details', temp);
  };

  return (
    <View>
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.inputForm}>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: wp(4),
            color: Colors.inputTextColor,
            textAlign: 'center',
          }}>
          CONTACT DETAILS
        </Text>
        <View style={{marginTop: hp(3)}}>
          <TextInput
            label={'Friend’s Name *'}
            // isRight={error.firstName}
            value={contact_details?.name}
            placeHolder={'Friend’s Name'}
            onChange={(text) => handleState('name', text)}
          />
          <TextInput
            label={'Friend’s Phone Number *'}
            // isRight={error.firstName}
            value={(contact_details?.phone).toString()}
            placeHolder={'Friend’s Phone Number'}
            onChange={(text) => handleState('phone', text)}
          />
          <TextInput
            label={'Friend’s Email *'}
            // isRight={error.firstName}
            value={contact_details?.email}
            keyboard={'email-address'}
            placeHolder={'Friend’s Email'}
            onChange={(text) => handleState('email', text)}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={{marginHorizontal: wp(3), alignSelf: 'center'}}>
        <Button
          label={'NEXT'}
          onPress={() => props.onPageChange(1)}
          width={wp(80)}
        />
      </View>
    </View>
  );
};

export default FriendsDetails;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
  },
  mapView: {
    height: hp(60),
    width: wp(100),
  },
});
