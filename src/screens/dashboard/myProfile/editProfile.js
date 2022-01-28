import React, {useState} from 'react';
import {Colors, hp, wp} from '../../../constant/colors';
import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInput from '../../../components/textInput';
import {Text} from 'react-native-elements';
import {STYLES} from '../../../constant/commonStyle';
import Button from '../../../components/button';
import {CustomAlert, ImageSelection} from '../../../constant/commonFun';
import DatePicker from 'react-native-datepicker';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {
  editMobileNumber,
  profileVerifyOTP,
  updateProfile,
} from '../../../redux/actions/user';
import moment from 'moment';
import CustomModalAndroid from '../../../components/customModal';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import FlatButton from '../../../components/flatButton';
import Ripple from 'react-native-material-ripple';
import SelectionModalAndroid from '../../../components/selectionModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {isAndroid} from 'react-native-calendars/src/expandableCalendar/commons';

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const configData =
    useSelector((state) => state.Login?.configData?.enums) || {};
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(
    useSelector((state) => state.Login?.loginData?.user) || {},
  );
  const parsedCity = JSON.parse(data.meta);
  const [otpModal, setOTPModal] = useState(false);
  const [imageSelect, setImageSelect] = useState(false);
  const [phone, setPhone] = React.useState();
  const [otp, setOTP] = React.useState();
  const [phoneValidate, setPhoneValidate] = React.useState(undefined);
  const [otpSend, setOtpSend] = React.useState(false);
  const [otpResponse, setOtpResponse] = useState({});
  const [error, setError] = useState({
    fname: undefined,
    lname: undefined,
    email: undefined,
    dob: undefined,
    city: undefined,
  });
  const handleState = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };
  const sendOTPFun = () => {
    setLoading(true);
    setOTP();
    if (!phone?.length || phone?.length !== 10 || /\D/.test(phone)) {
      setPhoneValidate(false);
      setLoading(false);
    } else {
      setPhoneValidate(true);

      // Send OTP
      editMobileNumber({phone})
        .then((res) => {
          if (res.status === 'success') {
            CustomAlert(res.message + res.data.otp);
            setOtpResponse(res.data);
            setOtpSend(true);
          } else {
            CustomAlert(res.message);
          }
        })
        .catch((err) => CustomAlert(err?.data?.message))
        .finally(() => setLoading(false));
    }
  };
  const setImage = (type) => {
    ImageSelection(type)
      .then((res) => {
        handleState('avatar', res);
        setImageSelect(false);
      })
      .catch((err) => {});
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <View style={styles.container}>
        <SimpleHeader
          headerText={'EDIT PROFILE'}
          navigation={props.navigation}
          onBack={() => props.navigation.goBack()}
        />
        <KeyboardAwareScrollView
          bounces={false}
          enableOnAndroid={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: wp(100),
            padding: hp(2),
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: wp(45)}}>
              <TextInput
                value={data?.fname}
                isRight={error.fname}
                label={'First Name *'}
                placeHolder={'David'}
                onChange={(text) => handleState('fname', text)}
              />
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                value={data?.lname}
                isRight={error.lname}
                label={'Last Name *'}
                placeHolder={'Jerome'}
                onChange={(text) => handleState('lname', text)}
              />
            </View>
          </View>
          <View style={{width: wp(90)}}>
            <TextInput
              value={data?.email}
              isRight={error.email}
              label={'Email ID *'}
              placeHolder={'davidje@gmail.com'}
              onChange={(text) => handleState('email', text)}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            {isAndroid ? (
              <Pressable
                style={{width: wp(45)}}
                onPress={() => setOTPModal(true)}>
                <TextInput
                  disable={true}
                  value={data?.phone}
                  label={'Phone Number *'}
                  placeHolder={'9739912345'}
                  onChange={(text) => handleState('phone', text)}
                />
              </Pressable>
            ) : (
              <View style={{width: wp(45)}}>
                <TextInput
                  caretHidden={true}
                  onFocus={() => {
                    Keyboard.dismiss();
                    setOTPModal(true);
                  }}
                  value={data?.phone}
                  label={'Phone Number *'}
                  placeHolder={'9739912345'}
                  onChange={(text) => handleState('phone', text)}
                />
              </View>
            )}
            <View
              style={[
                {marginBottom: hp(3), width: wp(45)},
                Platform.OS !== 'android' && {zIndex: 5001},
              ]}>
              <SelectionModalAndroid
                value={data.gender}
                width={wp(45)}
                label={'Gender *'}
                items={configData?.gender}
                onChangeItem={(text) => handleState('gender', text)}
              />
            </View>
          </View>

          <View style={{width: '92%', marginHorizontal: wp(3)}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.textLabelColor,
                fontSize: wp(4),
              }}>
              Date Of Birth *
            </Text>
            <View
              style={{
                marginTop: hp(1),
                marginBottom: hp(3),
                borderWidth: 2,
                // paddingHorizontal: 15,
                borderRadius: 10,
                height: hp(6),
                borderColor: error?.dob === false ? Colors.red : Colors.silver,
                backgroundColor: Colors.white,
              }}>
              <DatePicker
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                }}
                date={data?.dob && moment(data?.dob).format('D MMM yyyy')}
                mode="date"
                placeholder="Select date"
                format="D MMM yyyy"
                minDate={moment().subtract(60, 'years')}
                maxDate={moment().subtract(18, 'years')}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconComponent={
                  <Entypo
                    name={'calendar'}
                    size={hp(3)}
                    color={Colors.inputTextColor}
                    style={{
                      position: 'relative',
                      right: hp(1),
                    }}
                  />
                }
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    height: hp(6),
                    marginTop: 1,
                    width: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                  },
                  dateText: {
                    fontSize: wp(4),
                    backgroundColor: Colors.textBG,
                    color: Colors.inputTextColor,
                    justifyContent: 'flex-start',
                  },
                }}
                onDateChange={(date) => {
                  handleState('dob', date);
                }}
              />
            </View>
          </View>
          <View style={{width: wp(45)}}>
            <TextInput
              value={parsedCity?.city}
              isRight={error.city}
              label={'City *'}
              placeHolder={'Chennai'}
              onChange={(text) => handleState('city', text)}
            />
          </View>
          <View style={{marginHorizontal: wp(3)}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.textLabelColor,
                fontSize: wp(4),
              }}>
              Image
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: wp(18),
                marginTop: hp(1),
              }}>
              <View style={styles.profilePhoto}>
                <Image
                  source={{
                    uri: data?.avatar.includes('data:image/jpeg;base64,')
                      ? data?.avatar
                      : data?.avatar + '?' + new Date(),
                  }}
                  style={{height: '100%', width: '100%'}}
                  resizeMode={'stretch'}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  marginLeft: wp(5),
                  height: wp(18),
                }}>
                <Ripple
                  rippleColor={Colors.white}
                  onPress={async () => {
                    setImageSelect(true);
                  }}
                  style={styles.imageUploadBtn}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Bold',
                      fontSize: wp(3.8),
                      color: Colors.white,
                    }}>
                    UPLOAD IMAGE
                  </Text>
                </Ripple>
                {/*<Text*/}
                {/*  style={{*/}
                {/*    color: Colors.inputTextColor,*/}
                {/*    fontSize: wp(3.4),*/}
                {/*    fontFamily: 'Roboto-Light',*/}
                {/*  }}>*/}
                {/*  Max File size: 1MB*/}
                {/*</Text>*/}
              </View>
            </View>
            <Button
              isLoading={isLoading}
              spaceBottom={wp(0.1)}
              label={'SAVE'}
              onPress={() => {
                setLoading(true);
                let tempError = {};
                if (
                  !data.fname ||
                  data.fname.length === 0 ||
                  /[^a-zA-Z]/.test(data.fname)
                ) {
                  tempError.fname = false;
                } else {
                  tempError.fname = true;
                }
                if (
                  !data.lname ||
                  data.lname.length === 0 ||
                  /[^a-zA-Z]/.test(data.lname)
                ) {
                  tempError.lname = false;
                } else {
                  tempError.lname = true;
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
                if (!data.dob) {
                  tempError.dob = false;
                } else {
                  tempError.dob = true;
                }
                setError(tempError);
                if (
                  Object.values(tempError).findIndex(
                    (item) => item === false,
                  ) === -1
                ) {
                  dispatch(updateProfile(data))
                    .then((res) => {
                      if (res.status === 'success') {
                        setData(res?.data?.user);
                        props.navigation.goBack();
                      } else {
                        CustomAlert(res.message);
                      }
                    })
                    .catch((err) => CustomAlert(err?.data?.message))
                    .finally(() => setLoading(false));
                } else {
                  setLoading(false);
                }
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      <CustomModalAndroid
        visible={otpModal}
        title={'Change Phone Number'}
        onPress={() => {
          setPhoneValidate(undefined);
          setOtpSend(false);
          setPhone();
          setOTP();
          setOTPModal(false);
        }}>
        <View style={styles.bottomView}>
          <TextInput
            isRight={phoneValidate}
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
              <FlatButton
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
                  />
                </View>
              </View>
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
              <FlatButton
                label={'SUBMIT'}
                isLoading={isLoading}
                onPress={() => {
                  // Verify OTP
                  setLoading(true);
                  profileVerifyOTP({
                    phone,
                    otp,
                  })
                    .then((res) => {
                      if (res.status === 'success') {
                        setData({
                          ...data,
                          phone: phone,
                        });
                        setPhoneValidate(undefined);
                        setOtpSend(false);
                        setPhone();
                        setOTP();
                        setOTPModal(false);
                      } else {
                        CustomAlert(res.message);
                      }
                    })
                    .catch((err) => CustomAlert(err?.data?.message))
                    .finally(() => setLoading(false));
                }}
              />
            </View>
          )}
        </View>
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={imageSelect}
        title={'Upload From'}
        onPress={() => {
          setImageSelect(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: hp(3),
            width: wp(100),
          }}>
          <View style={styles.common}>
            <Ripple
              rippleColor={Colors.white}
              style={[STYLES.selectionView, STYLES.common]}
              onPress={() => setImage('camera')}>
              <Ionicons name={'camera'} color={Colors.darkBlue} size={hp(6)} />
            </Ripple>
            <Text
              style={[
                STYLES.selectionText,
                {
                  textAlign: 'center',
                },
              ]}>
              Camera
            </Text>
          </View>
          <View style={styles.common}>
            <Ripple
              rippleColor={Colors.white}
              onPress={() => setImage('gallery')}
              style={[STYLES.selectionView, STYLES.common]}>
              <AntDesign
                name={'picture'}
                color={Colors.darkBlue}
                size={hp(6)}
              />
            </Ripple>
            <Text
              style={[
                STYLES.selectionText,
                {
                  textAlign: 'center',
                },
              ]}>
              Gallery
            </Text>
          </View>
        </View>
      </CustomModalAndroid>
    </LinearGradient>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profilePhoto: {
    height: wp(18),
    width: wp(18),
    borderRadius: wp(9),
    backgroundColor: Colors.btnBG,
    overflow: 'hidden',
    ...STYLES.common,
  },
  imageUploadBtn: {
    height: wp(10),
    backgroundColor: Colors.btnBG,
    borderRadius: 5,
    width: wp(40),
    ...STYLES.common,
  },
  bottomView: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
    borderColor: 'red',
    overflow: 'hidden',
    width: wp(100),
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    alignItems: 'center',
  },
});
