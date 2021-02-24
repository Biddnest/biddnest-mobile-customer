import {Colors, hp, wp} from '../../../constant/colors';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDown from '../../../components/dropDown';
import TextInput from '../../../components/textInput';
import {Text} from 'react-native-elements';
import {STYLES} from '../../../constant/commonStyle';
import Button from '../../../components/button';
import {ImageSelection} from '../../../constant/commonFun';

const EditProfile = (props) => {
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
                label={'First Name'}
                placeHolder={'David'}
                onChange={(text) => handleState('referralCode', text)}
              />
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                label={'Last Name'}
                placeHolder={'Jerome'}
                onChange={(text) => handleState('referralCode', text)}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: wp(45)}}>
              <TextInput
                label={'Email ID'}
                placeHolder={'davidje@gmail.com'}
                onChange={(text) => handleState('referralCode', text)}
              />
            </View>
            <View style={{width: wp(45)}}>
              <TextInput
                label={'Phone Number'}
                placeHolder={'9739912345'}
                onChange={(text) => handleState('referralCode', text)}
              />
            </View>
          </View>
          <View style={{marginBottom: hp(3)}}>
            <DropDown
              width={wp(90)}
              label={'Gender'}
              items={[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
              ]}
              onChangeItem={(text) => handleState('gender', text)}
            />
          </View>
          <TextInput
            label={'Date of Birth'}
            placeHolder={'23 Dec 20'}
            onChange={(text) => handleState('referralCode', text)}
          />
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
                <Text style={styles.profileText}>DJ</Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  marginLeft: wp(5),
                  height: wp(18),
                }}>
                <Pressable
                  onPress={() => ImageSelection()}
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
              spaceBottom={wp(0.1)}
              label={'SAVE'}
              onPress={() => props.navigation.goBack()}
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
    backgroundColor: Colors.darkBlue,
    ...STYLES.common,
  },
  profileText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.white,
    fontSize: wp(7),
  },
  imageUploadBtn: {
    height: wp(10),
    backgroundColor: Colors.btnBG,
    borderRadius: 5,
    width: wp(40),
    ...STYLES.common,
  },
});
