import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors, wp, hp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../components/button';
import {STYLES} from '../../../constant/commonStyle';
import {resetNavigator} from '../../../constant/commonFun';
import RateUs from './rateUs';

const ReferFriend = (props) => {
  const [rateUsVisible, setRateUsVisible] = useState(false);
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
            When your friends sign up using the referral code, they get{' '}
            <Text style={{fontFamily: 'Roboto-Bold'}}>INR 100 </Text>
            and you get <Text style={{fontFamily: 'Roboto-Bold'}}>INR 200</Text>
          </Text>
          <View style={styles.referralView}>
            <Text style={styles.referralText}>MovDavid123</Text>
          </View>
          <Button
            label={'SEND INVITE'}
            spaceTop={wp(4)}
            width={wp(82)}
            spaceBottom={wp(1)}
            onPress={() => {
              setRateUsVisible(true);
            }}
          />
        </View>
        <RateUs
          visible={rateUsVisible}
          onCloseIcon={() => {
            setRateUsVisible(false);
            resetNavigator(props, 'Home');
          }}
        />
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
    lineHeight: 22,
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
