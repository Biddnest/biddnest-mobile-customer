import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors, wp, hp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../components/button';
import {STYLES} from '../../../constant/commonStyle';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';

const ReferFriend = (props) => {
  const userData =
    useSelector((state) => state.Login?.loginData?.user?.meta) || '';
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'Refer a friend'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
        textTransform
      />
      <View style={{flex: 1}}>
        <View style={styles.inputForm}>
          <Image
            source={require('../../../assets/images/refer_friend.png')}
            style={styles.image}
            resizeMode={'contain'}
          />
          <Text style={styles.text}>
            When your friends sign up, you and them both get
            <Text style={{fontFamily: 'Roboto-Bold'}}> ₹100 </Text>
            off on next booking .
          </Text>
          <View style={styles.referralView}>
            <Text style={styles.referralText}>
              {JSON.parse(userData)?.refferal_code}
            </Text>
          </View>
          <Button
            label={'SEND INVITE'}
            spaceTop={wp(4)}
            width={wp(82)}
            spaceBottom={wp(1)}
            onPress={() => {
              try {
                Share.open({
                  title: 'Share via',
                  message: `Hey there, \nI invite you to install this application using my refferal code - ${
                    JSON.parse(userData)?.refferal_code
                  } to get ₹100 off on your first booking. \nclick here to install \n`,
                  url: 'https://play.google.com/store',
                    // url: 'https://appstoreconnect.apple.com/apps/1606873664/testflight/ios',
                })
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    err && console.log(err);
                  });
              } catch (e) {
                console.log(e);
              }
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default ReferFriend;

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
  text: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  referralView: {
    borderWidth: 1.5,
    height: hp(6),
    borderRadius: hp(1),
    marginTop: wp(4),
    borderStyle: 'dashed',
    ...STYLES.common,
  },
  referralText: {
    color: Colors.darkBlue,
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.8),
  },
  image: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginBottom: wp(8),
    marginTop: wp(4),
  },
});
