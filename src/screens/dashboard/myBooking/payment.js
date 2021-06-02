import React, {useEffect, useRef, useState} from 'react';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, hp, wp, PAYMENT_OPTION} from '../../../constant/colors';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TextInput from '../../../components/textInput';
import {STYLES} from '../../../constant/commonStyle';
import Button from '../../../components/button';
import {APICall, getOrderDetails} from '../../../redux/actions/user';
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
} from '../../../constant/commonFun';
import {STORE} from '../../../redux';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Html5Entities} from 'html-entities';
import HTML from 'react-native-render-html';
import moment from 'moment';
import {Base64} from 'js-base64';

const Payment = (props) => {
  const entities = new Html5Entities();
  const inputCode = useRef(null);
  const configData =
    useSelector((state) => state.Login?.configData?.enums?.payment) || {};
  const APIData =
    useSelector((state) => state.Login?.configData?.config?.api) || '';
  const orderData = props?.route?.params?.orderData || {};
  const [orderDetails, setOrderDetails] = useState({});
  const [paymentSummery, setPaymentSummery] = useState({});
  const [coupon_code, setCouponCode] = useState('');
  const [applyButton, setApplyButton] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const userData = useSelector((state) => state.Login?.loginData?.user) || {};
  const [couponApplied, setCouponApplied] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (orderData?.public_booking_id) {
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
      let obj = {
        url: `coupon/get?public_booking_id=${orderData?.public_booking_id}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
        },
      };
      APICall(obj)
        .then((res) => {
          if (res?.data?.status === 'success') {
            setCoupons(res?.data?.data?.coupons);
          } else {
            CustomAlert(res?.data?.message);
          }
        })
        .catch((err) => {
          CustomConsole(err);
        });
    }
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
          paymentMethod(res?.data?.data?.payment, cardType);
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
      key: Base64.decode(configData?.razorpay?.rzp_id),
      amount: parseFloat(paymentSummery?.grand_total).toFixed(2) * 100,
      order_id: payment?.rzp_order_id,
      theme: {color: Colors.darkBlue, hide_topbar: true},
      name: APIData?.name,
      description: `Movement on ${
        orderData?.bid?.meta &&
        moment(JSON.parse(orderData?.bid?.meta?.toString()).moving_date).format(
          'Do MMM YYYY',
        )
      }`,
      image: APIData?.logo,
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
          <Text
            style={[
              styles.leftText,
              {
                fontSize: wp(3.8),
              },
            ]}>
            Payment Summary
          </Text>
          {Object.keys(paymentSummery).map((item, index) => {
            if (item === 'grand_total') {
              return null;
            }
            return (
              <View style={styles.flexBox} key={index}>
                <Text style={styles.leftText}>
                  {item?.split('_').join(' ')}
                </Text>
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp(1),
            }}>
            <View
              style={{
                width: applyButton ? wp(65) : wp(96),
              }}>
              <TextInput
                ref={inputCode}
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
            </View>
            {applyButton && (
              <Button
                label={couponApplied ? 'Remove' : 'Apply'}
                isLoading={isLoading}
                width={wp(25)}
                spaceTop={hp(1)}
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
                        if (res?.data?.status === 'success') {
                          setCouponApplied(true);
                          setPaymentSummery(res?.data?.data?.payment_details);
                          CustomAlert('Coupon has been applied successfully');
                        } else {
                          CustomAlert(res?.data?.message);
                        }
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
          {coupons?.length > 0 && (
            <Text
              style={{
                color: Colors.textLabelColor,
                fontSize: wp(4),
                fontFamily: 'Gilroy-SemiBold',
                marginBottom: hp(0.5),
              }}>
              Available Coupons
            </Text>
          )}
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            refreshing={isLoading}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            data={coupons}
            extraData={coupons}
            bounces={false}
            renderItem={({item, index}) => {
              return (
                <View
                  style={[
                    styles.inputForm,
                    {
                      flex: 1,
                      marginTop: wp(2),
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: wp(1),
                      width: '100%',
                    }}>
                    <View
                      style={{
                        borderWidth: 1,
                        height: hp(5),
                        borderRadius: 6,
                        borderStyle: 'dashed',
                        borderColor: Colors.btnBG,
                        backgroundColor: Colors.white,
                        flex: 1,
                        ...STYLES.common,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Bold',
                          fontSize: wp(3.5),
                          color: Colors.inputTextColor,
                        }}>
                        {coupons[index]?.code}
                      </Text>
                    </View>
                    <Pressable
                      style={{
                        width:
                          coupons?.length === index + 1
                            ? coupons?.length % 2 === 0
                              ? '18%'
                              : '8%'
                            : '18%',
                        marginLeft: '3%',
                      }}
                      onPress={() => {
                        if (!applyButton) {
                          setApplyButton(true);
                        }
                        setCouponCode(coupons[index].code);
                        CustomAlert('Tap apply to get discount');
                      }}>
                      <MaterialIcons
                        name={'content-copy'}
                        size={hp(3.5)}
                        color={Colors.darkBlue}
                      />
                    </Pressable>
                  </View>
                  <HTML
                    defaultTextProps={{
                      width: wp(70),
                      marginTop: hp(1),
                    }}
                    baseFontStyle={{
                      fontFamily: 'Roboto-Regular',
                      fontSize: wp(3),
                      textAlign: 'center',
                      color: '#99A0A5',
                    }}
                    source={{html: coupons[index].desc}}
                    contentWidth={'90%'}
                  />
                </View>
              );
            }}
          />
          <LinearGradient
            colors={[Colors.darkBlue, '#462F97']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              marginTop: coupons?.length > 0 ? hp(1) : 0,
              borderRadius: 10,
              height: hp(6),
              backgroundColor: Colors.darkBlue,
              ...STYLES.common,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: wp(4),
                fontFamily: 'Roboto-Regular',
              }}>
              To be paid{'  '}
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
            keyExtractor={(item, index) => index.toString()}
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
                    onPress={() => paymentInitiate(item.value)}
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
        </ScrollView>
      </View>
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
  inputForm: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 0.8,
    borderRadius: 6,
    backgroundColor: '#FFFDF4',
    borderColor: Colors.btnBG,
    marginBottom: hp(1),
    marginHorizontal: wp(2),
    alignItems: 'center',
  },
});
