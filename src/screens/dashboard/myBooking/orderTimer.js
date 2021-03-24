import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Platform, ScrollView} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import Button from '../../../components/button';
import {
  CustomAlert,
  CustomConsole,
  resetNavigator,
  DiffMin,
} from '../../../constant/commonFun';
import TimerClock from '../../../assets/svg/timer_clock.svg';
import {getOrderDetails} from '../../../redux/actions/user';
import CountDown from '../../../components/countDown';
import SimpleHeader from '../../../components/simpleHeader';

const OrderTimer = (props) => {
  const orderData = props?.route?.params?.orderData || {};
  const [orderDetails, setOrderDetails] = useState({});
  const [time, setTime] = useState(300);
  useEffect(() => {
    getOrderDetails(orderData?.public_booking_id)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setOrderDetails(res?.data?.data?.booking);
          if (res?.data?.data?.booking?.bid_result_at) {
            let temp = DiffMin(
              new Date(res?.data?.data?.booking?.bid_result_at),
            );
            setTime(temp);
          }
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  }, []);
  return (
    <View style={{flex: 1}}>
      <SimpleHeader
        headerText={'Order Timer'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
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
          <View style={{marginVertical: hp(0.8)}}>
            <TimerClock width={wp(30)} height={wp(30)} />
          </View>
          <CountDown
            until={time}
            size={18}
            // digitStyle={{backgroundColor: time === 0 ? 'grey' : 'black'}}
            onFinish={() => {
              // props.navigation.navigate('FinalQuote');
            }}
            digitTxtStyle={{color: '#000'}}
            separatorStyle={{color: '#000'}}
            timeToShow={['M', 'S']}
            timeLabels={{m: null, s: null}}
            showSeparator
          />
          <Text style={styles.mainText}>Time Left</Text>
          <View style={styles.separatorView} />
          <View style={styles.flexView}>
            <Text style={styles.orderID}>ORDER ID</Text>
            <Text style={styles.orderNo}>
              #{orderDetails?.public_booking_id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderTimer;

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
});
