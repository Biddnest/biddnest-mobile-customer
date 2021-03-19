import React, {useState} from 'react';
import {Colors, hp, wp} from '../../../constant/colors';
import {Image, Platform, Pressable, StyleSheet, View} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownAndroid from '../../../components/dropDown';
import TextInput from '../../../components/textInput';
import {Text} from 'react-native-elements';
import {STYLES} from '../../../constant/commonStyle';
import Button from '../../../components/button';
import {CustomAlert, ImageSelection} from '../../../constant/commonFun';
import DatePicker from 'react-native-datepicker';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfile} from '../../../redux/actions/user';
import moment from 'moment';

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const configData =
    useSelector((state) => state.Login?.configData?.enums) || {};
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(
    useSelector((state) => state.Login?.loginData?.user) || {},
  );
  const [error, setError] = useState({
    fname: undefined,
    lname: undefined,
    email: undefined,
  });
  const handleState = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
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
                label={'First Name'}
                placeHolder={'David'}
                onChange={(text) => handleState('fname', text)}
              />
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                value={data?.lname}
                isRight={error.lname}
                label={'Last Name'}
                placeHolder={'Jerome'}
                onChange={(text) => handleState('lname', text)}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: wp(45)}}>
              <TextInput
                value={data?.email}
                isRight={error.email}
                label={'Email ID'}
                placeHolder={'davidje@gmail.com'}
                onChange={(text) => handleState('email', text)}
              />
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                disable={true}
                value={data?.phone}
                label={'Phone Number'}
                placeHolder={'9739912345'}
                onChange={(text) => handleState('phone', text)}
              />
            </View>
          </View>
          <View
            style={[
              {marginBottom: hp(3)},
              Platform.OS !== 'android' && {zIndex: 5001},
            ]}>
            <DropDownAndroid
              value={data.gender}
              width={wp(90)}
              label={'Gender'}
              items={configData?.gender}
              onChangeItem={(text) => handleState('gender', text)}
            />
          </View>
          <View style={{width: '92%', marginHorizontal: wp(3)}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                color: Colors.textLabelColor,
                fontSize: wp(4),
              }}>
              Date Of Birth
            </Text>
            <View
              style={{
                marginTop: hp(1),
                marginBottom: hp(3),
                borderWidth: 2,
                // paddingHorizontal: 15,
                borderRadius: 10,
                height: hp(6.5),
                borderColor: Colors.silver,
                backgroundColor: Colors.white,
              }}>
              <DatePicker
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                }}
                date={moment(data?.dob).format('D MMM yyyy')}
                mode="date"
                placeholder="select date"
                format="D MMM yyyy"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconComponent={
                  <Entypo
                    name={'calendar'}
                    size={25}
                    color={Colors.inputTextColor}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: 7,
                      marginLeft: 0,
                    }}
                  />
                }
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    height: hp(6.5),
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
                  source={{uri: data?.avatar}}
                  style={{height: '100%', width: '100%'}}
                  resizeMode={'contain'}
                />
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  marginLeft: wp(5),
                  height: wp(18),
                }}>
                <Pressable
                  onPress={async () => {
                    ImageSelection()
                      .then((res) => {
                        handleState('avatar', res);
                      })
                      .catch((err) => {});
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
                </Pressable>
                <Text
                  style={{
                    color: Colors.inputTextColor,
                    fontSize: wp(3.4),
                    fontFamily: 'Roboto-Light',
                  }}>
                  Max File size: 1MB
                </Text>
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
                setError(tempError);
                if (
                  Object.values(tempError).findIndex(
                    (item) => item === false,
                  ) === -1
                ) {
                  dispatch(updateProfile(data))
                    .then((res) => {
                      setLoading(false);
                      if (res.status === 'success') {
                        setData(res?.data?.user);
                        props.navigation.goBack();
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
      </View>
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
});
