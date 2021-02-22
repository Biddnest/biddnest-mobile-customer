import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, hp, wp} from '../../constant/colors';
import Header from './header';
import TextInput from '../../components/textInput';
import Button from '../../components/button';
import CheckBox from '../../components/checkBox';
import {resetNavigator} from '../../constant/commonFun';
import DropDown from '../../components/dropDown';

const Signup = (props) => {
  const [data, setData] = React.useState({});
  const [error, setError] = React.useState({});
  const [isAgree, setAgree] = React.useState(true);
  const handleState = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };
  return (
    <View style={[styles.container, {...styles.common}]}>
      <Header />
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: '#243C99',
          height: hp(70),
          width: wp(100),
        }}>
        <View style={styles.bottomView}>
          <Text
            style={{
              color: '#3B4B58',
              fontSize: wp(3.7),
              fontFamily: 'Gilroy-Light',
              marginBottom: hp(5),
            }}>
            CREATE AN ACCOUNT
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: wp(45)}}>
              <TextInput
                label={'First Name'}
                isRight={error.firstName}
                placeHolder={'First Name'}
                onChange={(text) => handleState('firstName', text)}
              />
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                label={'Last Name'}
                isRight={error.lastName}
                placeHolder={'Last Name'}
                onChange={(text) => handleState('lastName', text)}
              />
            </View>
          </View>
          <TextInput
            label={'Email'}
            placeHolder={'Email'}
            isRight={error.email}
            keyboard={'email-address'}
            onChange={(text) => handleState('email', text)}
          />
          <View style={{flexDirection: 'row'}}>
            <DropDown
              label={'Gender'}
              items={[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
              ]}
              onChangeItem={(text) => handleState('gender', text)}
            />
            <View style={{width: wp(45)}}>
              <TextInput
                label={'Referral Code'}
                isRight={error.referralCode}
                placeHolder={'Referral Code'}
                onChange={(text) => handleState('referralCode', text)}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox onPress={() => setAgree(!isAgree)} value={isAgree} />
            <Text
              style={{
                color: Colors.grey,
                fontSize: wp(3.8),
              }}>
              I agree to the{' '}
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  color: Colors.textLabelColor,
                }}>
                Terms & conditions
              </Text>
            </Text>
          </View>
          <Button
            label={'GET STARTED'}
            onPress={() => {
              let tempError = {};
              if (
                !data.firstName ||
                data.firstName.length === 0 ||
                /[^a-zA-Z]/.test(data.firstName)
              ) {
                tempError.firstName = false;
              } else {
                tempError.firstName = true;
              }
              if (
                !data.lastName ||
                data.lastName.length === 0 ||
                /[^a-zA-Z]/.test(data.lastName)
              ) {
                tempError.lastName = false;
              } else {
                tempError.lastName = true;
              }
              if (
                !data.email ||
                data.email.length === 0 ||
                !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                  data.email,
                )
              ) {
                tempError.email = false;
              } else {
                tempError.email = true;
              }
              if (!data.referralCode || data.referralCode.length === 0) {
                tempError.referralCode = false;
              } else {
                tempError.referralCode = true;
              }
              if (!isAgree) {
                tempError.isAgree = false;
              }
              setError(tempError);
              if (
                Object.values(tempError).findIndex((item) => item === false) ===
                -1
              ) {
                // resetNavigator(props, 'Dashboard');
                props.navigation.navigate('Dashboard');
              }
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 10,
    height: hp(6.5),
    marginTop: hp(1),
    borderColor: Colors.silver,
    color: Colors.textLabelColor,
    fontSize: wp(6),
  },
  bottomView: {
    height: hp(70),
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
    borderColor: 'red',
    overflow: 'hidden',
    width: wp(100),
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
    alignItems: 'center',
  },
  customDropDown: {
    backgroundColor: Colors.textBG,
  },
});
