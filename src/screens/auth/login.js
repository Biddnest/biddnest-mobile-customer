import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, hp, wp} from '../../constant/colors';
import TextInput from '../../components/textInput';
import {Checkbox} from 'react-native-paper';
import Button from '../../components/button';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Header from './header';

const Login = (props) => {
  const [otpSend, setOtpSend] = React.useState(false);
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
          <TextInput
            label={'Phone Number'}
            placeHolder={'Phone Number'}
            keyboard={'decimal-pad'}
          />
          {(!otpSend && (
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {/*<Checkbox*/}
                {/*  status={'checked'}*/}
                {/*  onPress={() => {}}*/}
                {/*  iconType="material"*/}
                {/*/>*/}
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
              <Button label={'SEND OTP'} onPress={() => setOtpSend(true)} />
            </View>
          )) || (
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  width: wp(85),
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    color: Colors.textLabelColor,
                    fontSize: wp(4.6),
                  }}>
                  Verify OTP
                </Text>
                <View
                  style={{
                    height: hp(9),
                  }}>
                  <OTPInputView
                    pinCount={6}
                    onCodeChanged={(code) => console.log(code)}
                    codeInputFieldStyle={styles.textInput}
                    codeInputHighlightStyle={[
                      styles.textInput,
                      {borderColor: '#243C99'},
                    ]}
                  />
                </View>
              </View>
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: wp(3.8),
                  marginTop: hp(1),
                }}>
                Waiting for OTP
              </Text>
              <Button
                label={'SUBMIT'}
                onPress={() => props.navigation.navigate('Signup')}
              />
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: wp(3.8),
                }}>
                Did not receive OTP?{' '}
                <Text
                  onPress={() => setOtpSend(false)}
                  style={{
                    fontFamily: 'Roboto-Bold',
                    color: Colors.textLabelColor,
                  }}>
                  Resend
                </Text>
              </Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
  common: {
    alignItems: 'center',
    justifyContent: 'center',
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
});
