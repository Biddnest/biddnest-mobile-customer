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
            placeHolder={'Friend’s Name'}
            onChange={(text) => handleStateChange('firstName', text)}
          />
          <TextInput
            label={'Friend’s Phone Number *'}
            // isRight={error.firstName}
            placeHolder={'Friend’s Phone Number'}
            onChange={(text) => handleStateChange('firstName', text)}
          />
          <TextInput
            label={'Friend’s Email *'}
            // isRight={error.firstName}
            keyboard={'email-address'}
            placeHolder={'Friend’s Email'}
            onChange={(text) => handleStateChange('firstName', text)}
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
