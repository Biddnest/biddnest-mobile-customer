import React, {useEffect, useState} from 'react';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, hp, wp, PAYMENT_OPTION} from '../../../constant/colors';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TextInput from '../../../components/textInput';
import {STYLES} from '../../../constant/commonStyle';
import Button from '../../../components/button';
import AddNewCard from './addNewCard';
import UPIPayment from './UPIPayment';
import NetBanking from './netBanking';
import {APICall, getOrderDetails} from '../../../redux/actions/user';
import {CustomAlert, CustomConsole} from '../../../constant/commonFun';
import {STORE} from '../../../redux';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';

const Payment = (props) => {
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.payment) || {};
  const [addCardVisible, setCardVisible] = useState(false);
  const [UPIVisible, setUPIVisible] = useState(false);
  const [netBankingVisible, setNetBankingVisible] = useState(false);
  const orderData = props?.route?.params?.orderData || {};
  const [orderDetails, setOrderDetails] = useState({});
  const [paymentSummery, setPaymentSummery] = useState({});
  const [coupon_code, setCouponCode] = useState('');
  const [applyButton, setApplyButton] = useState(false);
  const [isLoading, setLoading] = useState(false);

  console.log(orderDetails);

  useEffect(() => {
    getOrderDetails(orderData?.public_booking_id)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setOrderDetails(res?.data?.data?.booking);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
    let obj = {
      url: `bookings/payment/summary?public_booking_id=${orderData?.public_booking_id}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setPaymentSummery(res?.data?.data?.payment_details);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  }, []);
  const paymentInitiate = () => {
    let obj = {
      url: 'bookings/payment/initiate',
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
      data: {
        public_booking_id: orderData?.public_booking_id,
        coupon_code: coupon_code.length > 0 ? coupon_code : null,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          // Razor pay
          paymentMethod(res?.payment);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  };
  const paymentMethod = (payment) => {
    let options = {
      currency: payment?.currency || 'INR',
      key: configData?.razorpay?.rzp_id,
      amount: payment?.grand_total,
      order_id: payment?.rzp_order_id,
      theme: {color: Colors.darkBlue},
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        props.navigation.pop(1);
        props.navigation.replace('OrderTracking', {
          orderData: orderDetails,
        });
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };
  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <View style={styles.container}>
        <SimpleHeader
          headerText={'PAYMENT'}
          navigation={props.navigation}
          onBack={() => props.navigation.goBack()}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1, padding: hp(2)}}>
          <Text>Payment Summary</Text>
          {Object.keys(paymentSummery).map((item, index) => {
            if (item === 'grand_total') {
              return null;
            }
            return (
              <View style={styles.flexBox} key={index}>
                <Text style={styles.leftText}>{item?.replace('_', ' ')}</Text>
                <Text style={styles.leftText}>
                  {Object.values(paymentSummery)[index]}
                </Text>
              </View>
            );
          })}
          <View style={styles.separatorView} />
          <View style={styles.flexBox}>
            <Text style={styles.totalText}>Grand Total</Text>
            <Text style={styles.totalText}>{paymentSummery?.grand_total}</Text>
          </View>
          <View
            style={{
              width: applyButton ? wp(65) : wp(96),
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: applyButton ? 'flex-start' : 'center',
            }}>
            <TextInput
              label={''}
              value={coupon_code}
              placeHolder={'Enter Coupon Code if any'}
              onChange={(text) => setCouponCode(text)}
              onFocus={() => {
                if (!applyButton) {
                  setApplyButton(true);
                }
              }}
              onBlur={() => {
                if (applyButton && coupon_code.length === 0) {
                  setApplyButton(false);
                }
              }}
            />
            {applyButton && (
              <Button
                label={'Apply'}
                isLoading={isLoading}
                width={wp(25)}
                onPress={() => {
                  // Verify coupon API
                  setLoading(true);
                  let obj = {
                    url: 'coupon/verify',
                    method: 'post',
                    headers: {
                      Authorization:
                        'Bearer ' + STORE.getState().Login?.loginData?.token,
                    },
                    data: {
                      public_booking_id: orderData?.public_booking_id,
                      coupon_code: coupon_code || null,
                    },
                  };
                  APICall(obj)
                    .then((res) => {
                      setLoading(false);
                      if (res?.data?.status === 'success') {
                      } else {
                        CustomAlert(res?.data?.message);
                      }
                    })
                    .catch((err) => {
                      setLoading(false);
                      CustomConsole(err);
                    });
                }}
              />
            )}
          </View>
          <LinearGradient
            colors={[Colors.darkBlue, '#462F97']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              borderRadius: 10,
              height: hp(6.5),
              backgroundColor: Colors.darkBlue,
              ...STYLES.common,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: wp(4),
                fontFamily: 'Roboto-Regular',
              }}>
              Total Price{'  '}
              <Text
                style={{
                  fontSize: wp(5.5),
                  fontFamily: 'Roboto-Bold',
                }}>
                RS. {paymentSummery?.grand_total}
              </Text>
            </Text>
          </LinearGradient>
          <FlatList
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            data={PAYMENT_OPTION}
            bounces={false}
            style={{marginTop: hp(2)}}
            contentContainerStyle={{justifyContent: 'space-evenly'}}
            renderItem={({item, index}) => {
              return (
                <View style={styles.movementLinear} key={index}>
                  <Pressable
                    onPress={() => {
                      if (orderDetails?.payment?.rzp_order_id) {
                        let temp = coupon_code.length > 0 ? coupon_code : null;
                        if (temp === orderDetails?.payment?.coupon_code) {
                          paymentMethod(orderDetails?.payment);
                        } else {
                          paymentInitiate();
                        }
                      } else {
                        paymentInitiate();
                      }
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: wp(30),
                    }}>
                    {item.image}
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        color: Colors.inputTextColor,
                        fontSize: wp(3.8),
                        marginTop: 10,
                      }}>
                      {item.name}
                    </Text>
                  </Pressable>
                </View>
              );
            }}
          />
          {/*<Button*/}
          {/*  spaceTop={hp(1)}*/}
          {/*  width={wp(90)}*/}
          {/*  backgroundColor={Colors.white}*/}
          {/*  label={'USE ANOTHER CARD'}*/}
          {/*  onPress={() => setCardVisible(true)}*/}
          {/*/>*/}
        </ScrollView>
      </View>
      <AddNewCard
        visible={addCardVisible}
        onCloseIcon={() => setCardVisible(false)}
      />
      <UPIPayment
        visible={UPIVisible}
        onCloseIcon={() => setUPIVisible(false)}
      />
      <NetBanking
        visible={netBankingVisible}
        onCloseIcon={() => setNetBankingVisible(false)}
      />
    </LinearGradient>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
    textTransform: 'capitalize',
  },
  totalText: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3.8),
    color: Colors.inputTextColor,
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(1),
  },
  movementLinear: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.silver,
    backgroundColor: Colors.white,
  },
});
