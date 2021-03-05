import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, hp, wp} from '../../constant/colors';
import TextInput from '../../components/textInput';
import Button from '../../components/button';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Header from './header';
import CheckBox from '../../components/checkBox';
import LinearGradient from 'react-native-linear-gradient';
import {CustomAlert} from '../../constant/commonFun';
import {useDispatch} from 'react-redux';
import {sendOTP, verifyOTP} from '../../redux/actions/user';

const Login = (props) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = React.useState();
  const [otp, setOTP] = React.useState();
  const [phoneValidate, setPhoneValidate] = React.useState(undefined);
  const [otpSend, setOtpSend] = React.useState(false);
  const [isAgree, setAgree] = React.useState(true);
  return (
    <View style={[styles.container, {...styles.common}]}>
      <Header />
      <LinearGradient
        colors={[Colors.darkBlue, '#333092']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          height: hp(70),
          width: wp(100),
        }}>
        <KeyboardAwareScrollView
          enableOnAndroid={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1,
          }}>
          <View style={styles.bottomView}>
            <TextInput
              isRight={phoneValidate}
              label={'Phone Number'}
              placeHolder={'Phone Number'}
              keyboard={'decimal-pad'}
              onChange={(text) => {
                setOtpSend(false);
                setPhone(text);
              }}
            />
            {(!otpSend && (
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    onPress={() => setAgree(!isAgree)}
                    value={isAgree}
                  />
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
                  label={'SEND OTP'}
                  onPress={() => {
                    if (
                      !phone?.length ||
                      phone?.length !== 10 ||
                      /\D/.test(phone)
                    ) {
                      setPhoneValidate(false);
                    } else if (!isAgree) {
                      setPhoneValidate(true);
                      CustomAlert('Agree to the Terms & Conditions');
                    } else {
                      setPhoneValidate(true);
                      setOtpSend(true);
                      // Send OTP
                      sendOTP({phone}).then((res) => {});
                    }
                  }}
                />
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
                      fontSize: wp(4),
                    }}>
                    Verify OTP
                  </Text>
                  <View
                    style={{
                      height: hp(9),
                    }}>
                    <OTPInputView
                      pinCount={6}
                      onCodeChanged={(code) => setOTP(code)}
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
                  onPress={() => {
                    // Verify OTP
                    verifyOTP({
                      phone,
                      otp,
                    }).then((res) => {

                    })
                    props.navigation.navigate('Signup');
                  }}
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
      </LinearGradient>
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
  checkBoxView: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: wp(2),
  },
});
