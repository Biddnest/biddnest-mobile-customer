import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors, wp, hp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../components/button';
import {STYLES} from '../../../constant/commonStyle';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';
import {PlayInstallReferrer} from 'react-native-play-install-referrer';
import {STORE} from '../../../redux';
import {APICall} from '../../../redux/actions/user';
import {CustomAlert} from '../../../constant/commonFun';

const ReferFriend = (props) => {
  const [url, setUrl] = useState();
  useEffect(() => {
    PlayInstallReferrer.getInstallReferrerInfo((installReferrerInfo, error) => {
      if (!error) {
        console.log(
          'Install referrer = ' + installReferrerInfo.installReferrer,
        );
        console.log(
          'Referrer click timestamp seconds = ' +
            installReferrerInfo.referrerClickTimestampSeconds,
        );
        console.log(
          'Install begin timestamp seconds = ' +
            installReferrerInfo.installBeginTimestampSeconds,
        );
        console.log(
          'Referrer click timestamp server seconds = ' +
            installReferrerInfo.referrerClickTimestampServerSeconds,
        );
        console.log(
          'Install begin timestamp server seconds = ' +
            installReferrerInfo.installBeginTimestampServerSeconds,
        );
        console.log('Install version = ' + installReferrerInfo.installVersion);
        console.log(
          'Google Play instant = ' + installReferrerInfo.googlePlayInstant,
        );
      } else {
        console.log('Failed to get install referrer info!');
        console.log('Response code: ' + error.responseCode);
        console.log('Message: ' + error.message);
      }
    });
  }, []);

  useEffect(() => {
    let obj = {
      url: '/referral-link',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res.status === 200) {
          // setTransactionHistory(res?.data?.data?.ledger);
          setUrl(res?.data?.data?.short_url);
        }
      })
      .catch((err) => {
        // (false);
        CustomAlert(err?.data?.message);
      });
  }, []);
  const userData =
    useSelector((state) => state.Login?.loginData?.user?.meta) || '';

  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <SimpleHeader
        headerText={'Refer A Friend'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
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
                  url: url,
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
