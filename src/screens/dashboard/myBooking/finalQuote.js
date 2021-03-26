import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import Button from '../../../components/button';
import {STYLES} from '../../../constant/commonStyle';
import CheckBox from '../../../components/checkBox';
import SimpleHeader from '../../../components/simpleHeader';
import LinearGradient from 'react-native-linear-gradient';
import LocationDistance from '../../../components/locationDistance';
import RejectBookingModal from './rejectBookingModal';
import {useSelector} from 'react-redux';
import {CustomAlert, CustomConsole} from '../../../constant/commonFun';
import {getOrderDetails} from '../../../redux/actions/user';

const FinalQuote = (props) => {
  const orderData = props?.route?.params?.orderData || {};
  const configData =
    useSelector((state) => state.Login?.configData?.keys) || {};
  const configDataEnums =
    useSelector((state) => state.Login?.configData?.enums?.booking) || {};
  const [rejectVisible, setRejectVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [defaultReason, setDefaultReason] = useState([]);
  const [rejectData, setRejectData] = useState({
    reason: '',
    desc: '',
  });
  const [orderDetails, setOrderDetails] = useState({});
  const [isAgree, setAgree] = useState(true);
  useEffect(() => {
    let temp = [];
    configData.cancellation_reason_options.forEach((item) => {
      temp.push({
        label: item,
        value: item,
      });
    });
    setRejectData({
      ...rejectData,
      reason: configData?.cancellation_reason_options[0],
    });
    setDefaultReason(temp);
  }, [configData]);

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

  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <View style={styles.container}>
        <SimpleHeader
          headerText={'FINAL QUOTE'}
          navigation={props.navigation}
          onBack={() => props.navigation.goBack()}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <LocationDistance
            from={source_meta?.city}
            to={destination_meta?.city}
            finalDistance={meta?.distance}
          />
          <View style={styles.inputForm}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.headerText}>FINAL BIDDING IS HERE</Text>
            </View>
            <View style={styles.circleView}>
              <Text style={styles.priceText}>
                Rs. {orderDetails?.final_quote}
              </Text>
              <Text style={styles.priceLabel}>Base price</Text>
            </View>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                fontSize: wp(4),
                color: Colors.inputTextColor,
              }}>
              {configDataEnums?.booking_type?.economic ==
              orderDetails?.booking_type
                ? 'Economic'
                : 'Premium'}
            </Text>
            {orderDetails?.vehicle && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text
                    style={[
                      styles.leftText,
                      {
                        textTransform: 'uppercase',
                      },
                    ]}>
                    vehicle type
                  </Text>
                  <Text
                    style={[
                      styles.leftText,
                      {
                        textTransform: 'uppercase',
                      },
                    ]}>
                    man power
                  </Text>
                </View>
                <View style={{flex: 1, marginLeft: 15}}>
                  <Text
                    style={[styles.leftText, {textTransform: 'capitalize'}]}>
                    {orderDetails?.vehicle?.name},{' '}
                    {orderDetails?.vehicle?.vehicle_type}
                  </Text>
                  <Text style={styles.leftText}>05</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.checkBoxView}>
            <CheckBox onPress={() => setAgree(!isAgree)} value={isAgree} />
            <Text
              style={{
                color: Colors.grey,
                fontSize: wp(3.8),
              }}>
              I agree to the Terms & conditions
            </Text>
          </View>
          <View
            style={[
              styles.inputForm,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <Image
              source={require('../../../assets/images/coupon.png')}
              style={{height: wp(10), width: wp(10), marginLeft: 10}}
              resizeMode={'contain'}
            />
            <Text
              style={{
                width: wp(70),
                marginLeft: 10,
                fontFamily: 'Roboto-Italic',
                fontSize: wp(3.5),
                color: '#99A0A5',
              }}>
              use coupon code{' '}
              <Text
                style={{
                  color: Colors.btnBG,
                }}>
                “NEW2021”
              </Text>{' '}
              to avail 20% off on your first order. Tap to copy code.
            </Text>
          </View>
          <View style={styles.btnWrapper}>
            <Button
              width={wp(43)}
              backgroundColor={Colors.white}
              label={'REJECT'}
              onPress={() => setRejectVisible(true)}
            />
            <Button
              label={'ACCEPT'}
              onPress={() =>
                props.navigation.navigate('Payment', {orderData: orderDetails})
              }
              spaceBottom={0}
              width={wp(43)}
            />
          </View>
          <RejectBookingModal
            visible={rejectVisible}
            closeModal={() => setRejectVisible(false)}
            dropDownDefault={defaultReason}
            dropDownChange={(text) =>
              setRejectData({...rejectData, reason: text})
            }
            textValue={rejectData?.desc}
            rejectData={rejectData}
            textOnChange={(text) => setRejectData({...rejectData, desc: text})}
            isLoading={isLoading}
            setLoading={(text) => setLoading(text)}
            public_booking_id={orderDetails?.public_booking_id}
            navigation={props}
          />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default FinalQuote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputForm: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: '#DEE6ED',
    marginTop: hp(2),
    marginHorizontal: hp(2),
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    marginRight: 5,
  },
  circleView: {
    borderRadius: wp(15),
    borderColor: Colors.btnBG,
    height: wp(30),
    width: wp(30),
    borderWidth: 3,
    marginVertical: hp(2),
    ...STYLES.common,
  },
  priceText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.7),
    color: Colors.btnBG,
  },
  priceLabel: {
    fontFamily: 'Roboto-Light',
    fontSize: wp(4),
    color: Colors.btnBG,
    marginTop: 5,
  },
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  btnWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(90),
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    marginTop: hp(2),
  },
});
