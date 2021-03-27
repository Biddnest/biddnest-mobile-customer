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
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
  resetNavigator,
} from '../../../constant/commonFun';
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
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrderDetails(orderData?.public_booking_id)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setOrderDetails(res?.data?.data?.booking);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
    fetchPaymentSummery();
  }, []);
  const fetchPaymentSummery = () => {
    let obj = {
      url: `bookings/payment/summary?public_booking_id=${orderData?.public_booking_id}`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
    };
    APICall(obj)
      .then((res) => {
        setLoading(false);
        if (res?.data?.status === 'success') {
          setPaymentSummery(res?.data?.data?.payment_details);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
  };
  const paymentInitiate = (cardType) => {
    setLoading(true);
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
        setLoading(false);
        if (res?.data?.status === 'success') {
          // Razor pay
          paymentMethod(res?.payment, cardType);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        CustomConsole(err);
      });
  };
  const paymentMethod = (payment, cardType) => {
    setLoading(true);
    let options = {
      currency: payment?.currency || 'INR',
      key: configData?.razorpay?.rzp_id,
      amount: parseFloat(paymentSummery?.grand_total).toFixed(2) * 100,
      order_id: payment?.rzp_order_id,
      theme: {color: Colors.darkBlue, hide_topbar: true},
      name: 'test',
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      prefill: {
        email: userData?.email,
        contact: userData?.phone,
        name: userData?.fname + ' ' + userData?.lname,
        method: cardType,
      },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        let obj = {
          url: 'bookings/payment/status/complete',
          method: 'post',
          headers: {
            Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
          },
          data: {
            public_booking_id: orderData?.public_booking_id,
            payment_id: data?.razorpay_payment_id,
          },
        };
        APICall(obj)
          .then((res) => {
            setLoading(false);
            if (res?.data?.status === 'success') {
              props.navigation.pop(1);
              props.navigation.replace('OrderTracking', {
                orderData: orderDetails,
              });
            } else {
              CustomAlert(res?.data?.message);
            }
          })
          .catch((err) => {
            setLoading(false);
            CustomConsole(err);
          });
      })
      .catch((error) => {
        // handle failure
        setLoading(false);
        // CustomAlert(`Error: ${error.code} | ${error.description}`);
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
        {isLoading && <LoadingScreen />}
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
                  {item === 'discount' ? '- ' : ''}₹{' '}
                  {parseFloat(Object.values(paymentSummery)[index]).toFixed(2)}
                </Text>
              </View>
            );
          })}
          <View style={styles.separatorView} />
          <View style={styles.flexBox}>
            <Text style={styles.totalText}>Grand Total</Text>
            <Text style={styles.totalText}>
              ₹ {parseFloat(paymentSummery?.grand_total).toFixed(2)}
            </Text>
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
              disable={couponApplied}
              autoCapitalize={true}
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
                label={couponApplied ? 'Remove' : 'Apply'}
                isLoading={isLoading}
                width={wp(25)}
                onPress={() => {
                  // Verify coupon API
                  setLoading(true);
                  if (couponApplied) {
                    setCouponApplied(false);
                    setApplyButton(false);
                    fetchPaymentSummery();
                  } else {
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
                        setCouponApplied(true);
                        setPaymentSummery(res?.data?.data?.payment_details);
                        CustomAlert('Coupon has been applied successfully');
                      })
                      .catch((err) => {
                        setLoading(false);
                        CustomConsole(err);
                      });
                  }
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
                ₹{paymentSummery?.grand_total}
              </Text>
            </Text>
          </LinearGradient>
          <FlatList
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            data={PAYMENT_OPTION}
            bounces={false}
            style={{marginTop: hp(2), marginBottom: hp(4)}}
            contentContainerStyle={{justifyContent: 'space-evenly'}}
            renderItem={({item, index}) => {
              return (
                <View style={styles.movementLinear} key={index}>
                  <Pressable
                    onPress={() => {
                      if (orderDetails?.payment?.rzp_order_id) {
                        let temp = coupon_code.length > 0 ? coupon_code : null;
                        if (temp === orderDetails?.payment?.coupon_code) {
                          paymentMethod(orderDetails?.payment, item.value);
                        } else {
                          paymentInitiate(item.value);
                        }
                      } else {
                        paymentInitiate(item.value);
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
