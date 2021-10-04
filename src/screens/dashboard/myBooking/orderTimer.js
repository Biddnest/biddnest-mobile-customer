import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import {Colors, hp, wp} from '../../../constant/colors';
import {
  CustomAlert,
  CustomConsole,
  DiffMin,
  LoadingScreen,
  resetNavigator,
} from '../../../constant/commonFun';
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
import Feather from 'react-native-vector-icons/Feather';
import Requirements from './requirements';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapModalAndroid from '../../../components/mapModal';
import CloseIcon from '../../../components/closeIcon';
import FlatButton from '../../../components/flatButton';
import Ripple from 'react-native-material-ripple';
import {useSelector} from 'react-redux';

const OrderTimer = (props) => {
  const [orderDetails, setOrderDetails] = useState(
    props?.route?.params?.orderData || {},
  );
  const configData =
    useSelector((state) => state.Login?.configData?.timer) || {};
  const [timeOver, setTimeOver] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [tab, setTab] = useState([
    'Order Details',
    'Requirements',
    'Est Price',
  ]);
  const [selectedTab, setSelectedTab] = useState(2);
  const [mapVisible, setMapVisible] = useState(null);
  let coordinates =
    mapVisible === 'pickup'
      ? {
          latitude: parseFloat(orderDetails?.source_lat),

          longitude: parseFloat(orderDetails?.source_lng),
        }
      : {
          latitude: parseFloat(orderDetails?.destination_lat),
          longitude: parseFloat(orderDetails?.destination_lng),
        };
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    setLoading(true);
    if (orderDetails?.public_booking_id) {
      getOrderDetails(orderDetails?.public_booking_id)
        .then((res) => {
          if (res?.status == 400) {
            resetNavigator(props, 'Dashboard');
          } else if (res?.data?.status === 'success') {
            let temp = res?.data?.data?.booking;
            if (temp?.status === 4) {
              props.navigation.replace('FinalQuote', {orderData: temp});
            } else if (
              temp?.status === 5 ||
              temp?.status === 6 ||
              temp?.status === 7 ||
              temp?.status === 8
            ) {
              props.navigation.replace('OrderTracking', {orderData: temp});
            }
            setOrderDetails(res?.data?.data?.booking);
          } else {
            CustomAlert(res?.data?.message);
          }
        })
        .catch((err) => CustomConsole(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };
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
  const renderText = (key, value) => {
    return (
      <View>
        <Text style={STYLES.staticLabel}>{key}</Text>
        <Text
          style={[
            STYLES.staticLabel,
            {
              fontFamily: 'Roboto-Regular',
              marginTop: 5,
            },
          ]}>
          {value}
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.pageBG}}>
      <SimpleHeader
        headerText={'Proceed for Bidding'}
        navigation={props.navigation}
        onBack={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingScreen />}
      <ScrollView
        refreshControl={
          selectedTab !== 1 && (
            <RefreshControl refreshing={isLoading} onRefresh={getData} />
          )
        }
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
        <LinearGradient
          colors={[Colors.pageBG, Colors.white]}
          style={{flex: 1}}>
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
          <View style={{paddingVertical: hp(2)}}>
            <StepIndicator
              stepCount={meta?.self_booking ? 4 : 5}
              customStyles={STYLES.stepperStyle}
              currentPosition={meta?.self_booking ? 3 : 4}
              renderStepIndicator={renderStepIndicator}
            />
          </View>
          <View style={STYLES.tabView}>
            {tab.map((item, index) => {
              return (
                <Ripple
                  rippleColor={Colors.darkBlue}
                  key={index}
                  style={{
                    ...STYLES.common,
                    borderColor:
                      selectedTab === index ? Colors.darkBlue : '#ACABCD',
                    borderBottomWidth: selectedTab === index ? 2 : 0,
                  }}
                  onPress={() => setSelectedTab(index)}>
                  <Text
                    style={{
                      ...STYLES.tabText,
                      color:
                        selectedTab === index ? Colors.darkBlue : '#ACABCD',
                    }}>
                    {item}
                  </Text>
                </Ripple>
              );
            })}
          </View>
          {selectedTab === 0 && (
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: hp(2)}}>
              <View
                style={{
                  marginHorizontal: wp(5),
                  marginTop: hp(2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{maxWidth: '80%'}}>
                  {renderText('Pickup Address', source_meta?.address)}
                </View>
                <Pressable
                  style={STYLES.mapPinCircle}
                  onPress={() => setMapVisible('pickup')}>
                  <Feather
                    name={'map-pin'}
                    color={Colors.darkBlue}
                    size={wp(7)}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  marginHorizontal: wp(5),
                  marginTop: hp(2),
                  flexDirection: 'row',
                }}>
                <View style={{flex: 1}}>
                  {renderText('Pincode', source_meta?.pincode)}
                </View>
                <View style={{flex: 1}}>
                  {renderText('Floor', source_meta?.floor)}
                </View>
                <View style={{flex: 1}}>
                  {renderText('Lift', source_meta?.lift == 1 ? 'Yes' : 'No')}
                </View>
              </View>
              <View
                style={[
                  STYLES.separatorView,
                  {width: '90%', alignSelf: 'center'},
                ]}
              />
              <View
                style={{
                  marginHorizontal: wp(5),
                  marginTop: hp(2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{maxWidth: '80%'}}>
                  {renderText('Drop Address', destination_meta?.address)}
                </View>
                <Pressable
                  style={STYLES.mapPinCircle}
                  onPress={() => setMapVisible('drop')}>
                  <Feather
                    name={'map-pin'}
                    color={Colors.darkBlue}
                    size={wp(7)}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  marginHorizontal: wp(5),
                  marginTop: hp(2),
                  flexDirection: 'row',
                }}>
                <View style={{flex: 1}}>
                  {renderText('Pincode', destination_meta?.pincode)}
                </View>
                <View style={{flex: 1}}>
                  {renderText('Floor', destination_meta?.floor)}
                </View>
                <View style={{flex: 1}}>
                  {renderText(
                    'Lift',
                    destination_meta?.lift == 1 ? 'Yes' : 'No',
                  )}
                </View>
              </View>
            </ScrollView>
          )}
          {selectedTab === 1 && (
            <Requirements
              navigation={props.navigation}
              orderDetails={orderDetails}
            />
          )}
          {selectedTab === 2 && (
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {(orderDetails?.status !== 15 && (
                <>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Italic',
                      fontSize: wp(3.5),
                      color: '#99A0A5',
                      textAlign: 'center',
                      marginHorizontal: wp(6),
                      marginTop: hp(2),
                    }}>
                    You’ll get the estimated price once the time is up
                  </Text>
                  <View style={styles.inputForm}>
                    <View style={{marginVertical: hp(0.8)}}>
                      <CountdownCircleTimer
                        key={new Date()}
                        size={hp(25)}
                        onComplete={() => {
                          getData();
                          setTimeOver(true);
                        }}
                        isPlaying
                        duration={
                          orderDetails?.status === 2
                            ? configData?.bid_time
                            : configData?.rebid_time
                        }
                        initialRemainingTime={DiffMin(
                          orderDetails?.bid_result_at,
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
                      <Text style={styles.orderID}>ENQUIRY ID</Text>
                      <Text style={styles.orderNo}>
                        {orderDetails?.public_enquiry_id}
                      </Text>
                    </View>
                  </View>
                </>
              )) || (
                <View style={styles.inputForm}>
                  <Text style={styles.orderID}>
                    Your result will be confirmed shortly
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
          <MapModalAndroid
            visible={mapVisible !== null}
            onPress={() => setMapVisible(null)}>
            <View style={styles.mapView}>
              <MapView
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                style={{flex: 1}}
                initialRegion={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker coordinate={coordinates} />
              </MapView>
            </View>
            <CloseIcon
              onPress={() => setMapVisible(null)}
              style={[
                {
                  position: 'absolute',
                  right: hp(2),
                  top: hp(2),
                  height: hp(5),
                  width: hp(5),
                  borderRadius: hp(2.5),
                  zIndex: 5000,
                  backgroundColor: Colors.white,
                  ...STYLES.common,
                },
              ]}
            />
            <View style={{marginVertical: hp(3), width: wp(90)}}>
              {renderText(
                mapVisible === 'pickup' ? 'Pickup Address' : 'Drop Address',
                mapVisible === 'pickup'
                  ? source_meta?.address
                  : destination_meta?.address,
              )}
            </View>
            <View style={{marginTop: hp(1)}}>
              <FlatButton
                label={'open in maps app'}
                onPress={() => {
                  let scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
                  Linking.openURL(
                    scheme + `${coordinates.latitude},${coordinates.longitude}`,
                  );
                }}
              />
            </View>
          </MapModalAndroid>
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
  mapView: {
    height: hp(67),
    width: wp(100),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
});
