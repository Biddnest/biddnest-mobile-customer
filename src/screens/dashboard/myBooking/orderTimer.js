import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import {CustomAlert, CustomConsole, DiffMin, LoadingScreen} from '../../../constant/commonFun';
import {getOrderDetails} from '../../../redux/actions/user';
import SimpleHeader from '../../../components/simpleHeader';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

const OrderTimer = (props) => {
  const orderData = props?.route?.params?.orderData || {};
  const [orderDetails, setOrderDetails] = useState({});
  const [time, setTime] = useState(
    DiffMin(new Date(orderData?.bid_result_at)) || 0,
  );
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    getOrderDetails(orderData?.public_booking_id)
      .then((res) => {
        setLoading(false)
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
        setLoading(false)
        CustomConsole(err);
      });
  }, []);
  const children = ({remainingTime}) => {
    return (
      <Text
        style={{
          color: Colors.darkBlue,
          fontSize: wp(5),
          fontFamily: 'Roboto-Bold',
        }}>
        {new Date(remainingTime * 1000).toISOString().substr(11, 8)}
      </Text>
    );
  };
  return (
    <View style={{flex: 1}}>
      <SimpleHeader
        headerText={'Order Timer'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingScreen />}
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
            <CountdownCircleTimer
              onComplete={() =>
                props.navigation.replace('FinalQuote', {
                  orderData: orderDetails,
                })
              }
              isPlaying
              duration={Math.abs(time) * 60}
              children={children}
              colors={[
                [Colors.darkBlue, 0.4],
                [Colors.btnBG, 0.4],
                [Colors.red, 0.2],
              ]}
            />
          </View>
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
