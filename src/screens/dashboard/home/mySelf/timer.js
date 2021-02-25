import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../../constant/colors';
import Button from '../../../../components/button';
import {resetNavigator} from '../../../../constant/commonFun';
import CustomModalAndroid from '../../../../components/customModal';
import CloseIcon from '../../../../components/closeIcon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {STYLES} from '../../../../constant/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
const Timer = (props) => {
  const [orderPlacedVisible, setOrderPlacedVisible] = useState(true);
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <Text
        style={{
          fontFamily: 'Roboto-Italic',
          fontSize: wp(3.5),
          color: '#99A0A5',
          textAlign: 'center',
          marginHorizontal: wp(6),
        }}>
        You’ll get the estimated price once the time is up
      </Text>
      <View style={styles.inputForm}>
        <Image
          source={require('../../../../assets/images/timer_clock.png')}
          style={{height: wp(30), width: wp(30), marginVertical: hp(0.8)}}
          resizeMode={'contain'}
        />
        <Text style={styles.mainText}>Time Left</Text>
        <View style={styles.separatorView} />
        <View style={styles.flexView}>
          <Text style={styles.orderID}>ORDER ID</Text>
          <Text style={styles.orderNo}>#34123</Text>
        </View>
        <Button
          spaceBottom={0}
          label={'GO TO HOME'}
          onPress={() => resetNavigator(props, 'Dashboard')}
        />
      </View>
      <CustomModalAndroid visible={orderPlacedVisible}>
        <CloseIcon
          onPress={() => setOrderPlacedVisible(false)}
          style={{
            position: 'absolute',
            right: 15,
            top: Platform.OS === 'android' ? 0 : -10,
          }}
        />
        <View
          style={{
            ...styles.circleView,
            ...STYLES.common,
          }}>
          <Feather name={'check'} size={wp(15)} color={Colors.btnBG} />
        </View>
        <Text
          style={[
            styles.mainText,
            {
              fontSize: wp(4),
              marginBottom: hp(2),
            },
          ]}>
          Order Placed Successfully!
        </Text>
        <View style={styles.separatorView} />
        <View
          style={[
            styles.flexView,
            {
              marginBottom: hp(2),
            },
          ]}>
          <Text style={styles.orderID}>ORDER ID</Text>
          <Text style={styles.orderNo}>#34123</Text>
        </View>
      </CustomModalAndroid>
    </ScrollView>
  );
};

export default Timer;

const styles = StyleSheet.create({
  inputForm: {
    marginHorizontal: wp(5),
    marginVertical: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    alignItems: 'center',
  },
  mainText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '90%',
    marginVertical: hp(2),
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  orderID: {
    fontFamily: 'Gilroy-Light',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  orderNo: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  circleView: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: Colors.white,
    borderWidth: 4,
    marginBottom: hp(3),
    borderColor: Colors.btnBG,
  },
});
