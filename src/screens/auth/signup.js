import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, hp, wp} from '../../constant/colors';
import Header from './header';
import TextInput from '../../components/textInput';
import Button from '../../components/button';
import CheckBox from '../../components/checkBox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CommonActions} from '@react-navigation/native';
import {resetNavigator} from '../../constant/commonFun';

const Signup = (props) => {
  const [data, setData] = React.useState({});
  const [isAgree, setAgree] = React.useState(false);
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
              <TextInput label={'First Name'} placeHolder={'First Name'} />
            </View>
            <View style={{width: wp(45)}}>
              <TextInput label={'Last Name'} placeHolder={'Last Name'} />
            </View>
          </View>
          <TextInput
            label={'Email'}
            placeHolder={'Email'}
            keyboard={'email-address'}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: wp(45), paddingHorizontal: 10}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  color: Colors.textLabelColor,
                  fontSize: wp(4),
                  marginBottom: hp(1),
                }}>
                Gender
              </Text>
              <View
                style={
                  (Platform.OS !== 'android' && {
                    zIndex: 10,
                  }) ||
                  {}
                }>
                <DropDownPicker
                  items={[
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                  ]}
                  // showArrow={false}
                  defaultValue={'male'}
                  customArrowUp={() => (
                    <MaterialIcons
                      name="arrow-drop-up"
                      size={25}
                      color={'#3B4B58'}
                    />
                  )}
                  customArrowDown={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={25}
                      color={'#3B4B58'}
                    />
                  )}
                  containerStyle={{
                    height: hp(6.5),
                    borderWidth: 2,
                    borderRadius: 10,
                    borderColor: Colors.silver,
                    overflow: 'hidden',
                  }}
                  style={[
                    styles.customDropDowm,
                    {
                      paddingHorizontal: 15,
                    },
                  ]}
                  labelStyle={{
                    fontSize: wp(4),
                    backgroundColor: Colors.textBG,
                    color: Colors.inputTextColor,
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  dropDownStyle={[
                    styles.customDropDowm,
                    {
                      overflow: 'hidden',
                    },
                  ]}
                  onChangeItem={(item) => handleState('gender', item.value)}
                />
              </View>
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                label={'Referral Code'}
                placeHolder={'Referral Code'}
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
              // resetNavigator(props, 'Dashboard');
              props.navigation.navigate('Dashboard');
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
  customDropDowm: {
    backgroundColor: Colors.textBG,
    borderWidth: 0,
    borderRadius: 10,
  },
});
