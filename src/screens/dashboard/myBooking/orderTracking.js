import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import SimpleHeader from '../../../components/simpleHeader';
import {STYLES} from '../../../constant/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../../components/button';
import LinearGradient from 'react-native-linear-gradient';
import CustomModalAndroid from '../../../components/customModal';
import CloseIcon from '../../../components/closeIcon';
import TwoButton from '../../../components/twoButton';
import VerticalStepper from './verticalStepper';
import OrderDetailModal from './orderDetailModal';
import FlatButton from '../../../components/flatButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getDistance} from 'geolib';
import Share from 'react-native-share';
import moment from 'moment';
import {STORE} from '../../../redux';
import {APICall, getOrderDetails} from '../../../redux/actions/user';
import {CustomAlert, CustomConsole} from '../../../constant/commonFun';

const OrderTracking = (props) => {
  const orderData = props?.route?.params?.orderData || {};
  const [isLoading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [manageOrderVisible, setManageOrderVisible] = useState(false);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [resecheduleOrder, setRescheduleOrder] = useState(false);
  let dateArray = [];
  const renderIcon = (item) => {
    switch (item.iconFamily) {
      case 'Feather':
        return (
          <Feather name={item.icon} size={wp(8)} color={Colors.darkBlue} />
        );
      case 'AntDesign':
        return (
          <AntDesign name={item.icon} size={wp(8)} color={Colors.darkBlue} />
        );
      case 'Ionicons':
        return (
          <Ionicons name={item.icon} size={wp(8)} color={Colors.darkBlue} />
        );
      default:
        break;
    }
  };
  orderData?.movement_dates.forEach((item) => {
    dateArray.push(moment(item.date).format('D MMM yyyy'));
  });
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
  }, []);
  let source_meta =
    (orderDetails?.source_meta &&
      JSON.parse(orderDetails?.source_meta?.toString())) ||
    {};
  let destination_meta =
    (orderDetails?.destination_meta &&
      JSON.parse(orderDetails?.destination_meta?.toString())) ||
    {};
  let meta =
    (orderDetails?.meta && JSON.parse(orderDetails?.meta?.toString())) || {};

  console.log(orderDetails, meta?.distance);
  return (
    <View style={styles.container}>
      <SimpleHeader
        headerText={'ORDER TRACKING'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View
            style={{
              backgroundColor: Colors.white,
              marginTop: 5,
              padding: hp(2),
              flexDirection: 'row',
            }}>
            <Image
              source={require('../../../assets/images/pin_distance.png')}
              style={{height: wp(15), width: wp(10)}}
              resizeMode={'contain'}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    ...styles.locationText,
                    marginTop: 0,
                    textTransform: 'uppercase',
                  }}>
                  {source_meta?.city}
                </Text>
                <Text
                  style={[styles.locationText, {textTransform: 'uppercase'}]}>
                  {destination_meta?.city}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={{...styles.locationText, marginTop: 0}}>
                  ID:{' '}
                  <Text
                    style={{
                      fontFamily: 'Gilroy-Extrabold',
                    }}>
                    #{orderData?.public_booking_id}
                  </Text>
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Gilroy-Extrabold',
                      fontSize: wp(4.5),
                      color: Colors.inputTextColor,
                    }}>
                    {meta?.distance} KM
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            {[
              {
                icon: 'phone-call',
                title: 'Virtual Assistance',
                iconFamily: 'Feather',
              },
              {
                icon: 'file-text',
                title: 'Order Details',
                iconFamily: 'Feather',
              },
              {
                icon: 'share-social-outline',
                title: 'Share',
                iconFamily: 'Ionicons',
              },
              {
                icon: 'closecircleo',
                title: 'Manage Order',
                iconFamily: 'AntDesign',
              },
            ].map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    if (item.title === 'Order Details') {
                      setOrderDetailsVisible(true);
                    } else if (item.title === 'Manage Order') {
                      setManageOrderVisible(true);
                    } else if (item.title === 'Share') {
                      Share.open({
                        title: 'Share via',
                        message: 'some message',
                        url: 'https://www.google.com/',
                      })
                        .then((res) => {
                          console.log(res);
                        })
                        .catch((err) => {
                          err && console.log(err);
                        });
                    } else if (item.title === 'Virtual Assistance') {
                      props.navigation.navigate('FinalQuote');
                    }
                  }}
                  style={{
                    marginTop: hp(2),
                    ...STYLES.common,
                  }}>
                  <View
                    key={index}
                    style={{
                      ...styles.btnView,
                      ...STYLES.common,
                    }}>
                    {renderIcon(item)}
                  </View>
                  <Text numberOfLines={1} style={styles.btnText}>
                    {item.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{alignItems: 'center'}}>
            <Button
              label={'START'}
              onPress={() => {}}
              width={wp(90)}
              spaceBottom={0}
            />
          </View>
          <View
            style={{
              ...styles.inputForm,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{
                    ...styles.driverContact,
                    fontFamily: 'Roboto-Medium',
                  }}>
                  DRIVER
                </Text>
                {/*<Text*/}
                {/*  style={{*/}
                {/*    ...styles.driverContact,*/}
                {/*    marginTop: 10,*/}
                {/*    fontFamily: 'Roboto-Regular',*/}
                {/*  }}>*/}
                {/*  Not Assigned*/}
                {/*</Text>*/}
                <Text style={{...styles.driverContact, marginTop: 10}}>
                  Name{' '}
                  <Text style={{fontFamily: 'Roboto-Regular'}}>
                    Omkar patil
                  </Text>
                </Text>
                <Text style={{...styles.driverContact, marginTop: 5}}>
                  Phone{' '}
                  <Text style={{fontFamily: 'Roboto-Regular'}}>9090909090</Text>
                </Text>
              </View>
              <View
                style={{
                  height: wp(15),
                  width: wp(15),
                  borderRadius: wp(7.5),
                  backgroundColor: '#F2E6FF',
                  ...STYLES.common,
                }}>
                <Ionicons name={'call'} color={Colors.darkBlue} size={wp(6)} />
              </View>
            </View>
            <View style={styles.separatorView} />
            <View style={styles.flexBox}>
              <Text style={styles.leftText}>vehicle type</Text>
              <Text style={styles.rightText}>Motor-X, Tempo</Text>
            </View>
            <View style={styles.flexBox}>
              <Text style={styles.leftText}>vehicle number</Text>
              <Text style={styles.rightText}>KA03 B 1678</Text>
            </View>
            <View style={styles.flexBox}>
              <Text style={styles.leftText}>manpower</Text>
              <Text style={styles.rightText}>5</Text>
            </View>
          </View>
          <VerticalStepper />
          <View
            style={{...styles.inputForm, marginTop: 0, marginBottom: hp(2)}}>
            <View style={{...styles.flexBox, marginTop: 0}}>
              <Text style={styles.leftText}>price</Text>
              <Text style={{...styles.rightText, fontFamily: 'Roboto-Bold'}}>
                Rs.{' '}
                {orderDetails?.final_quote}
              </Text>
            </View>
            <View style={styles.flexBox}>
              <Text style={styles.leftText}>moving date</Text>
              <Text
                style={{
                  ...styles.rightText,
                  fontFamily: 'Roboto-Bold',
                  maxWidth: '60%',
                  textAlign: 'right',
                }}>
                {dateArray.join('\n')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <CustomModalAndroid visible={orderDetailsVisible}>
        <OrderDetailModal
          title={'ORDER DETAILS'}
          onCloseIcon={() => setOrderDetailsVisible(false)}
          data={orderDetails?.inventories}
        />
      </CustomModalAndroid>
      <CustomModalAndroid
        visible={manageOrderVisible || cancelOrder}
        onPress={() => {
          setRescheduleOrder(false);
          setCancelOrder(false);
          setManageOrderVisible(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '85%',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Roboto-Regular',
              color: Colors.inputTextColor,
            }}>
            {cancelOrder
              ? 'CANCEL ORDER'
              : resecheduleOrder
              ? 'RESCHEDULE'
              : 'MANAGE ORDER'}
          </Text>
          <CloseIcon
            onPress={() => {
              setRescheduleOrder(false);
              setCancelOrder(false);
              setManageOrderVisible(false);
            }}
            style={{position: 'absolute', right: 0}}
          />
        </View>
        <View style={{...styles.separatorView, width: '85%'}} />
        <View
          style={{
            marginTop: hp(4),
            marginBottom: hp(2),
            marginHorizontal: cancelOrder ? wp(6) : wp(20),
          }}>
          {/*{cancelOrder && (*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      textAlign: 'center',*/}
          {/*      fontFamily: 'Roboto-Regular',*/}
          {/*      fontSize: wp(4),*/}
          {/*      color: Colors.inputTextColor,*/}
          {/*      marginBottom: hp(2),*/}
          {/*    }}>*/}
          {/*    Terms & Conditions*/}
          {/*  </Text>*/}
          {/*)}*/}
          {/*  '1. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. \n\n 2. AtLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 3. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'*/}
          <Text
            style={{
              ...styles.manageOrderText,
              textAlign: cancelOrder ? 'left' : 'center',
            }}>
            {cancelOrder
              ? 'Are you sure you want to cancel this order?'
              : resecheduleOrder
              ? 'Our Virtual Assistant will get in touch with you shortly'
              : 'How would you like to manage your order?'}
          </Text>
        </View>
        {(resecheduleOrder && (
          <FlatButton
            label={'OKEY'}
            onPress={() => {
              setRescheduleOrder(false);
              setCancelOrder(false);
              setManageOrderVisible(false);
            }}
          />
        )) || (
          <TwoButton
            leftLabel={cancelOrder ? 'No' : 'CANCEL & REFUND'}
            rightLabel={cancelOrder ? 'Yes' : 'RESCHEDULE'}
            isLoading={isLoading}
            leftOnPress={() => {
              if (cancelOrder) {
                setCancelOrder(false);
                setManageOrderVisible(false);
              } else {
                setCancelOrder(true);
              }
            }}
            rightOnPress={() => {
              if (cancelOrder) {
                setCancelOrder(false);
                setManageOrderVisible(false);
                props.navigation.goBack();
              } else {
                // Call reschedule API
                setLoading(true);
                let obj = {
                  url: 'bookings/reschedul',
                  method: 'post',
                  headers: {
                    Authorization:
                      'Bearer ' + STORE.getState().Login?.loginData?.token,
                  },
                  data: {
                    public_booking_id: orderData?.public_booking_id,
                  },
                };
                APICall(obj)
                  .then((res) => {
                    setLoading(false);
                    if (res?.data?.status === 'success') {
                      setRescheduleOrder(true);
                    } else {
                      CustomAlert(res?.data?.message);
                    }
                  })
                  .catch((err) => {
                    setLoading(false);
                    CustomConsole(err);
                  });
                // setManageOrderVisible(false);
              }
            }}
          />
        )}
      </CustomModalAndroid>
    </View>
  );
};

export default OrderTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBG,
  },
  locationText: {
    fontFamily: 'Gilroy-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(4.5),
    marginTop: hp(2),
  },
  btnView: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    borderWidth: 0.8,
    borderColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  btnText: {
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.2),
    color: Colors.inputTextColor,
    maxWidth: wp(25),
    textAlign: 'center',
  },
  inputForm: {
    marginHorizontal: wp(5),
    paddingVertical: wp(3),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
  },
  driverContact: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(4),
    color: Colors.inputTextColor,
  },
  separatorView: {
    borderWidth: 0.8,
    borderColor: Colors.silver,
    width: '100%',
    marginTop: hp(1),
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    textTransform: 'uppercase',
  },
  rightText: {
    fontFamily: 'Roboto-Light',
    fontSize: wp(4),
    color: Colors.inputTextColor,
  },
  manageOrderText: {
    fontFamily: 'Roboto-Regular',
    color: Colors.inputTextColor,
    fontSize: wp(4),
    textAlign: 'center',
  },
});
