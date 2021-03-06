import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, hp, wp} from '../../constant/colors';
import Header from './header';
import TextInput from '../../components/textInput';
import Button from '../../components/button';
import CheckBox from '../../components/checkBox';
import {
  CustomAlert,
  resetNavigator,
} from '../../constant/commonFun';
import LinearGradient from 'react-native-linear-gradient';
import {signUP} from '../../redux/actions/user';
import {useDispatch, useSelector} from 'react-redux';
import {LOGIN_USER_DATA} from '../../redux/types';
import {STORE} from '../../redux';
import OneSignal from 'react-native-onesignal';
import SelectionModal from '../../components/selectionModal';

const Signup = (props) => {
  const dispatch = useDispatch();
  const userData = STORE.getState().Login?.loginData;
  const configData =
    useSelector((state) => state.Login?.configData?.enums) || {};
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    fname: '',
    lname: '',
    email: '',
    gender: '',
    referral_code: '',
    phone: props?.route?.params?.phone || 0,
  });
  const genderDefault = [...configData?.gender];
  const [error, setError] = useState({
    fname: undefined,
    lname: undefined,
    email: undefined,
  });
  const [isAgree, setAgree] = useState(true);
  const handleState = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };
  if (genderDefault?.findIndex((item, index) => item.value === null) === -1) {
    genderDefault.unshift({
      label: '-Select-',
      value: null,
    });
  }
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
                  label={'First Name *'}
                  isRight={error.fname}
                  value={data?.fname}
                  placeHolder={'John'}
                  onChange={(text) => handleState('fname', text)}
                />
              </View>
              <View style={{width: wp(45)}}>
                <TextInput
                  label={'Last Name *'}
                  isRight={error.lname}
                  value={data?.lname}
                  placeHolder={'Doe'}
                  onChange={(text) => handleState('lname', text)}
                />
              </View>
            </View>
            <TextInput
              label={'Email ID *'}
              placeHolder={'example@domain.com'}
              isRight={error.email}
              value={data?.email}
              keyboard={'email-address'}
              onChange={(text) => handleState('email', text)}
            />
            <View
              style={[
                {flexDirection: 'row'},
                Platform.OS !== 'android' && {zIndex: 5001},
              ]}>
              <SelectionModal
                width={wp(45)}
                style={
                  error?.gender === false
                    ? {
                        borderColor: 'red',
                        borderWidth: 2,
                      }
                    : {}
                }
                value={data?.gender}
                label={'Gender *'}
                items={genderDefault}
                onChangeItem={(text) => handleState('gender', text)}
              />
              <View style={{width: wp(45)}}>
                <TextInput
                  value={data?.referral_code}
                  label={'Referral Code'}
                  isRight={error.referral_code}
                  placeHolder={'ABC123'}
                  onChange={(text) => handleState('referral_code', text)}
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
              isLoading={isLoading}
              onPress={() => {
                setLoading(true);
                let tempError = {};
                tempError.fname = !(
                  !data.fname ||
                  data.fname.length === 0 ||
                  /[^a-zA-Z]/.test(data.fname)
                );
                tempError.lname = !(
                  !data.lname ||
                  data.lname.length === 0 ||
                  /[^a-zA-Z]/.test(data.lname)
                );
                tempError.gender = !!data?.gender;
                tempError.email = !(
                  !data.email ||
                  data.email.length === 0 ||
                  !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                    data.email,
                  )
                );
                // tempError.referral_code = !(
                //   !data.referral_code || data.referral_code.length === 0
                // );
                if (!isAgree) {
                  CustomAlert('Please Agree to the Terms & Conditions');
                  tempError.isAgree = false;
                }
                setError(tempError);
                if (
                  Object.values(tempError).findIndex(
                    (item) => item === false,
                  ) === -1
                ) {
                  dispatch(signUP(data))
                    .then((res) => {
                      setLoading(false);
                      if (res.status === 'success') {
                        dispatch({
                          type: LOGIN_USER_DATA,
                          payload: {...userData, ...res?.data},
                        });
                        OneSignal.setExternalUserId(
                          res?.data?.user?.id?.toString(),
                          (results) => {},
                        );
                        resetNavigator(props, 'Dashboard');
                      } else {
                        CustomAlert(res.message);
                      }
                    })
                    .catch((err) => {
                      setLoading(false);
                      CustomAlert(err.data.message);
                    });
                } else {
                  setLoading(false);
                }
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
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
    height: hp(6),
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
