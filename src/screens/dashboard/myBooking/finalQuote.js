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
import {
  CustomAlert,
  CustomConsole,
  LoadingScreen,
  resetNavigator,
} from '../../../constant/commonFun';
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
    if (orderData?.public_booking_id) {
      setLoading(true);
      getOrderDetails(orderData?.public_booking_id)
        .then((res) => {
          setLoading(false);
          if (res?.status == 400) {
            resetNavigator(props, 'Dashboard');
          } else if (res?.data?.status === 'success') {
            setOrderDetails(res?.data?.data?.booking);
          } else {
            CustomAlert(res?.data?.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          CustomConsole(err);
        });
    }
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
  let bid_meta =
    (orderDetails?.bid?.meta &&
      JSON.parse(orderDetails?.bid?.meta?.toString())) ||
    {};

  return (
    <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
      <View style={styles.container}>
        <SimpleHeader
          headerText={'FINAL QUOTE'}
          navigation={props.navigation}
          onBack={() => props.navigation.goBack()}
        />
        {isLoading && <LoadingScreen />}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1, marginBottom: hp(8)}}>
          <LocationDistance
            from={
              source_meta?.city === destination_meta?.city
                ? source_meta?.address
                : source_meta?.city
            }
            to={
              source_meta?.city === destination_meta?.city
                ? destination_meta?.address
                : destination_meta?.city
            }
            finalDistance={meta?.distance}
          />
          <View style={styles.inputForm}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.headerText}>FINAL BIDDING IS HERE</Text>
            </View>
            <View style={styles.circleView}>
              <Text style={styles.priceText}>
                ??? {orderDetails?.final_quote}
              </Text>
              <Text style={styles.priceLabel}>Base price</Text>
            </View>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: wp(4),
                color: Colors.inputTextColor,
              }}>
              {configDataEnums?.booking_type?.economic ==
              orderDetails?.booking_type
                ? 'Economic'
                : 'Premium'}
            </Text>
            {bid_meta && (
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
                    {/*{orderDetails?.vehicle?.name},{' '}*/}
                    {bid_meta?.vehicle_type}
                  </Text>
                  <Text style={styles.leftText}>
                    {orderDetails?.movement_specifications?.meta &&
                      JSON.parse(
                        orderDetails?.movement_specifications?.meta?.toString(),
                      ).min_man_power +
                        '-' +
                        JSON.parse(
                          orderDetails?.movement_specifications?.meta?.toString(),
                        ).max_man_power}
                  </Text>
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
        </ScrollView>
        <View style={styles.btnWrapper}>
          <Button
            width={wp(43)}
            backgroundColor={Colors.white}
            label={'REJECT'}
            onPress={() => setRejectVisible(true)}
          />
          <Button
            label={'ACCEPT'}
            onPress={() => {
              if (isAgree) {
                props.navigation.navigate('Payment', {
                  orderData: orderDetails,
                });
              } else {
                CustomAlert('Please accept Terms & Conditions');
              }
            }}
            spaceBottom={0}
            width={wp(43)}
          />
        </View>
        <RejectBookingModal
          value={rejectData?.reason}
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
    position: 'absolute',
    bottom: 0,
  },
  leftText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(4),
    color: Colors.inputTextColor,
    marginTop: hp(2),
  },
});
