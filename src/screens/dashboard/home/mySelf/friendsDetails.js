import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Colors, hp, wp} from '../../../../constant/colors';
import TextInput from '../../../../components/textInput';
import Button from '../../../../components/button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const FriendsDetails = (props) => {
  const {data, handleStateChange} = props;
  const [isLoading, setLoading] = useState(false);
  let contact_details = data?.contact_details || {};
  const [error, setError] = useState({
    name: undefined,
    phone: undefined,
    email: undefined,
  });

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
            fontFamily: 'Gilroy-Bold',
            fontSize: wp(4),
            color: Colors.inputTextColor,
            textAlign: 'center',
          }}>
          CONTACT DETAILS
        </Text>
        <View style={{marginTop: hp(3)}}>
          <TextInput
            label={'Friend’s Name *'}
            isRight={error.name}
            value={contact_details?.name}
            placeHolder={'Friend’s Name'}
            onChange={(text) => handleState('name', text)}
          />
          <TextInput
            label={'Friend’s Phone Number *'}
            isRight={error.phone}
            value={(contact_details?.phone).toString()}
            placeHolder={'Friend’s Phone Number'}
            keyboard={'decimal-pad'}
            onChange={(text) => handleState('phone', text)}
          />
          <TextInput
            label={'Friend’s Email *'}
            isRight={error.email}
            value={contact_details?.email}
            keyboard={'email-address'}
            placeHolder={'Friend’s Email'}
            onChange={(text) => handleState('email', text)}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={{marginHorizontal: wp(3), alignSelf: 'center'}}>
        <Button
          isLoading={isLoading}
          label={'NEXT'}
          onPress={() => {
            setLoading(true);
            let tempError = {};
            tempError.name = !(
              !contact_details.name ||
              contact_details.name.length === 0 ||
              !/^[A-Za-z ]+$/.test(contact_details.name)
            );
            tempError.email = !(
              !contact_details.email ||
              contact_details.email.length === 0 ||
              !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                contact_details.email,
              )
            );
            tempError.phone = !(
              !contact_details.phone?.length ||
              contact_details.phone?.length !== 10 ||
              /\D/.test(contact_details.phone)
            );
            setError(tempError);
            if (
              Object.values(tempError).findIndex((item) => item === false) ===
              -1
            ) {
              props.onPageChange(1);
            } else {
              setLoading(false);
            }
          }}
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
