import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import {Html5Entities} from 'html-entities';
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
} from '../../../constant/commonFun';
import RenderHtml from 'react-native-render-html';

const PrivacyPolicy = (props) => {
  const [termsText, setTermsText] = useState('');
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    let obj = {
      url: 'page/privacy-policies',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          const entities = new Html5Entities();
          let temp = entities.decode(res?.data?.data?.page?.content);
          setTermsText(temp);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => CustomConsole(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'Privacy Policy'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
        right={true}
        onRightPress={() => {}}
      />
      {isLoading && <LoadingScreen />}
      <ScrollView
        style={{flex: 1, marginBottom: wp(5)}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.inputForm}>
          {/* <Text style={styles.bottomText}>{termsText}</Text> */}
          <RenderHtml source={{html: termsText}} contentWidth={250} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PrivacyPolicy;

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
    fontSize: hp(1.9),
  },
});
