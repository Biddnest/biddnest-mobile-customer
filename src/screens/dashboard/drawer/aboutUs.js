import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import {CustomAlert, CustomConsole} from '../../../constant/commonFun';

const AboutUs = (props) => {
  const [aboutText, setAboutText] = useState('');
  useEffect(() => {
    let obj = {
      url: 'page/about-us',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setAboutText(res?.data?.data?.page?.content);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  }, []);
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'About us'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.inputForm}>
          <Text style={styles.bottomText}>{aboutText}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    padding: wp(4),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: wp(5),
  },
  bottomText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(3.6),
  },
});
