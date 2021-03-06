import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, hp, wp} from '../../constant/colors';
import TextInput from '../../components/textInput';
import Button from '../../components/button';
import Header from './header';
import CheckBox from '../../components/checkBox';
import LinearGradient from 'react-native-linear-gradient';
import {CustomAlert, resetNavigator} from '../../constant/commonFun';
import {useDispatch} from 'react-redux';
import {sendOTP, signOut, verifyOTP} from '../../redux/actions/user';
import {LOGIN_USER_DATA} from '../../redux/types';
import OneSignal from 'react-native-onesignal';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import CountDown from '../../components/countDown';

const Login = (props) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = React.useState();
  const [otp, setOTP] = React.useState();
  const [phoneValidate, setPhoneValidate] = React.useState(undefined);
  const [otpSend, setOtpSend] = React.useState(false);
  const [isAgree, setAgree] = React.useState(true);
  const [isLoading, setLoading] = useState(false);
  const [otpResponse, setOtpResponse] = useState({});
  const [resendOTP, setResendOTP] = useState(false);

  useEffect(() => {
    dispatch(signOut());
  }, []);

  const sendOTPFun = () => {
    setLoading(true);
    setResendOTP(false);
    setOTP();
    if (!phone?.length || phone?.length !== 10 || /\D/.test(phone)) {
      setPhoneValidate(false);
      setLoading(false);
    } else if (!isAgree) {
      setPhoneValidate(true);
      setLoading(false);
      CustomAlert('Please Agree to the Terms & Conditions');
    } else {
      setPhoneValidate(true);

      // Send OTP
      sendOTP({phone})
        .then((res) => {
          setLoading(false);
          if (res.status === 'success') {
            CustomAlert(res.message + res.data.otp);
            setOtpResponse(res.data);
            setOtpSend(true);
          } else {
            CustomAlert(res.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          CustomAlert(err?.data?.message);
        });
    }
  };

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
              isLeft={true}
              label={'Phone Number *'}
              placeHolder={'Phone Number'}
              keyboard={'decimal-pad'}
              onChange={(text) => {
                if (isLoading) {
                  setLoading(false);
                }
                if (otpSend) {
                  setOtpSend(false);
                }
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
                  isLoading={isLoading}
                  spaceTop={hp(4)}
                  label={'SEND OTP'}
                  onPress={() => {
                    sendOTPFun();
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
                    Verify OTP *
                  </Text>
                  <View
                    style={{
                      height: hp(7),
                      marginTop: hp(1),
                      marginBottom: hp(2),
                      alignSelf: 'center',
                    }}>
                    <SmoothPinCodeInput
                      codeLength={6}
                      restrictToNumbers={true}
                      value={otp}
                      autoFocus
                      onTextChange={(code) => setOTP(code)}
                      cellStyle={{
                        borderWidth: 2,
                        borderRadius: 10,
                        height: hp(6),
                        width: hp(6),
                        marginTop: hp(1),
                        borderColor: Colors.silver,
                        fontSize: wp(5),
                      }}
                      cellStyleFocused={{
                        borderColor: Colors.darkBlue,
                      }}
                      keyboardType={'number-pad'}
                      cellSpacing={wp(2)}
                      textStyle={{
                        fontFamily: 'Gilroy-SemiBold',
                        fontSize: wp(5),
                        backgroundColor: Colors.textBG,
                        color: Colors.inputTextColor,
                      }}
                      onFulfill={(code) => {
                        Keyboard.dismiss();
                        setLoading(true);
                        verifyOTP({
                          phone,
                          otp: code,
                        })
                          .then((res) => {
                            setLoading(false);
                            if (res.status === 'success') {
                              dispatch({
                                type: LOGIN_USER_DATA,
                                payload: res.data,
                              });
                              if (otpResponse?.new === true) {
                                props.navigation.navigate('Signup', {
                                  phone,
                                });
                              } else {
                                OneSignal.setExternalUserId(
                                  res?.data?.user?.id?.toString(),
                                  (results) => {},
                                );
                                resetNavigator(props, 'Dashboard');
                              }
                            } else {
                              CustomAlert(res.message);
                            }
                          })
                          .catch((err) => {
                            setLoading(false);
                            CustomAlert(err?.data?.message);
                          });
                      }}
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
                  isLoading={isLoading}
                  onPress={() => {
                    // Verify OTP
                    setLoading(true);
                    verifyOTP({
                      phone,
                      otp,
                    })
                      .then((res) => {
                        setLoading(false);
                        if (res.status === 'success') {
                          dispatch({
                            type: LOGIN_USER_DATA,
                            payload: res.data,
                          });
                          if (otpResponse?.new === true) {
                            props.navigation.navigate('Signup', {
                              phone,
                            });
                          } else {
                            OneSignal.setExternalUserId(
                              res?.data?.user?.id?.toString(),
                              (results) => {},
                            );
                            resetNavigator(props, 'Dashboard');
                          }
                        } else {
                          CustomAlert(res.message);
                        }
                      })
                      .catch((err) => {
                        setLoading(false);
                        CustomAlert(err?.data?.message);
                      });
                  }}
                />
                {(resendOTP && (
                  <Text
                    style={{
                      color: Colors.grey,
                      fontSize: wp(3.8),
                    }}>
                    Did not receive OTP?{' '}
                    <Text
                      onPress={() => sendOTPFun()}
                      style={{
                        fontFamily: 'Roboto-Bold',
                        color: Colors.textLabelColor,
                      }}>
                      Resend
                    </Text>
                  </Text>
                )) || (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.grey,
                        fontSize: wp(3.8),
                      }}>
                      Resend OTP enable in{' '}
                    </Text>
                    <CountDown
                      key={new Date()}
                      until={30}
                      onFinish={() => setResendOTP(true)}
                      digitStyle={{height: '100%'}}
                      digitTxtStyle={{
                        fontFamily: 'Roboto-Bold',
                        color: Colors.textLabelColor,
                      }}
                      separatorStyle={{color: '#000'}}
                      timeToShow={['M', 'S']}
                      timeLabels={{m: null, s: null}}
                      showSeparator
                    />
                  </View>
                )}
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
    height: hp(6),
    width: hp(6),
    marginTop: hp(1),
    borderColor: Colors.silver,
    color: Colors.textLabelColor,
    fontSize: wp(5),
  },
  checkBoxView: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: wp(2),
  },
});
