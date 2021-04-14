import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import {CustomAlert, CustomConsole, DiffMin} from '../../../constant/commonFun';
import {getOrderDetails} from '../../../redux/actions/user';
import SimpleHeader from '../../../components/simpleHeader';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import LinearGradient from 'react-native-linear-gradient';
import LocationDistance from '../../../components/locationDistance';
import StepIndicator from 'react-native-step-indicator';
import {STYLES} from '../../../constant/commonStyle';
import FinishFriends from '../../../assets/svg/finish_friends.svg';
import FinishMapPin from '../../../assets/svg/finish_map_pin.svg';
import FinishCalender from '../../../assets/svg/finish_calender.svg';
import FinishBed from '../../../assets/svg/finish_bed.svg';
import ActiveRs from '../../../assets/svg/active_rs.svg';
import InActiveRs from '../../../assets/svg/inactive_rs.svg';

const OrderTimer = (props) => {
  const orderData = props?.route?.params?.orderData || {};
  const [orderDetails, setOrderDetails] = useState({});
  const [timeOver, setTimeOver] = useState(false);
  useEffect(() => {
    if (orderData?.public_booking_id) {
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
    }
  }, []);
  const children = ({remainingTime}) => {
    return (
      <Text
        style={{
          color: Colors.darkBlue,
          fontSize: wp(5),
          fontFamily: 'Gilroy-Bold',
        }}>
        {new Date(remainingTime * 1000).toISOString().substr(11, 8)}
      </Text>
    );
  };
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
  const renderFriends = (stepStatus) => {
    return <FinishFriends width={hp(9)} height={hp(9)} />;
  };
  const renderMapPin = (stepStatus) => {
    return <FinishMapPin width={hp(3.5)} height={hp(3.5)} />;
  };
  const renderCalender = (stepStatus) => {
    return <FinishCalender width={hp(3.5)} height={hp(3.5)} />;
  };
  const renderBed = (stepStatus) => {
    return <FinishBed width={hp(3.5)} height={hp(3.5)} />;
  };
  const renderRS = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveRs width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return null;
    } else {
      return <InActiveRs width={hp(3.5)} height={hp(3.5)} />;
    }
  };
  const getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }: {
    position: number,
    stepStatus: string,
  }) => {
    switch (position) {
      case 0:
        if (!meta?.self_booking) {
          return renderFriends(stepStatus);
        }
        return renderMapPin(stepStatus);
      case 1:
        if (!meta?.self_booking) {
          return renderMapPin(stepStatus);
        }
        return renderCalender(stepStatus);
      case 2:
        if (!meta?.self_booking) {
          return renderCalender(stepStatus);
        }
        return renderBed(stepStatus);
      case 3:
        if (!meta?.self_booking) {
          return renderBed(stepStatus);
        }
        return renderRS(stepStatus);
      case 4:
        if (!meta?.self_booking) {
          return renderRS(stepStatus);
        }
        return null;
      default: {
        break;
      }
    }
  };
  const renderStepIndicator = (params: any) =>
    getStepIndicatorIconConfig(params);
  return (
    <View style={{flex: 1, backgroundColor: Colors.pageBG}}>
      <SimpleHeader
        headerText={'Order Tracking'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
        <LinearGradient
          colors={[Colors.pageBG, Colors.white]}
          style={{flex: 1}}>
          <LocationDistance
            from={
              source_meta?.city === destination_meta?.city
                ? source_meta?.geocode
                : source_meta?.city
            }
            to={
              source_meta?.city === destination_meta?.city
                ? destination_meta?.geocode
                : destination_meta?.city
            }
            finalDistance={meta?.distance}
          />
          <View style={{paddingVertical: hp(2)}}>
            <StepIndicator
              stepCount={meta?.self_booking ? 4 : 5}
              customStyles={STYLES.stepperStyle}
              currentPosition={meta?.self_booking ? 3 : 4}
              renderStepIndicator={renderStepIndicator}
            />
          </View>
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
                onComplete={() => {
                  setTimeOver(true);
                  // props.navigation.replace('FinalQuote', {
                  //   orderData: orderDetails,
                  // })
                }}
                isPlaying
                duration={DiffMin(
                  orderDetails?.bid_result_at || orderData?.bid_result_at,
                )}
                children={children}
                colors={[[Colors.darkBlue, 0.4]]}
              />
            </View>
            <Text style={styles.mainText}>Time Left</Text>
            {timeOver && (
              <Text style={styles.mainText}>
                Your result will be displayed soon
              </Text>
            )}
            <View style={styles.separatorView} />
            <View style={styles.flexView}>
              <Text style={styles.orderID}>ORDER ID</Text>
              <Text style={styles.orderNo}>{orderData?.public_booking_id}</Text>
            </View>
          </View>
        </LinearGradient>
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
    fontFamily: 'Gilroy-Bold',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
  orderNo: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    color: Colors.inputTextColor,
  },
});
