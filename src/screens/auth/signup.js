import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, hp, wp} from '../../constant/colors';
import Header from './header';
import TextInput from '../../components/textInput';
import Button from '../../components/button';

const Signup = () => {
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
            <View style={{width: wp(45)}}>
              <DropDownPicker
                items={[
                  {label: 'USA', value: 'usa'},
                  {label: 'UK', value: 'uk'},
                  {label: 'France', value: 'france'},
                ]}
                // defaultValue={this.state.country}
                containerStyle={{height: 40}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={(item) => {}}
              />
              {/*<TextInput label={'Gender'} />*/}
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                label={'Referral Code'}
                placeHolder={'Referral Code'}
              />
            </View>
          </View>
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
          <Button label={'GET STARTED'} onPress={() => {}} />
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
});
